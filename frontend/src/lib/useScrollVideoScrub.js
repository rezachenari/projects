import { useEffect, useRef, useState } from 'react';

/**
 * True scroll-driven video scrubbing.
 *
 * The displayed frame is a pure function of scroll position:
 *
 *   progress = clamp(<section geometry> / travel, 0, 1)
 *   video.currentTime = progress * video.duration
 *
 * - Never calls play()/pause(): the video is a frame source, not a playback.
 * - One rAF loop, and only while the section is on screen.
 * - A single controller per <video> element (guarded via a WeakMap), so a
 *   remount or a StrictMode double-mount can never fight over the same video.
 * - Re-measures geometry on resize / orientation change / layout shifts.
 *
 * Two geometry modes:
 * - `sticky`   (cinematic worlds): a pinned stage; progress runs over the travel
 *   the section provides after the stage height.
 * - `traverse` (a plain backdrop): progress runs while the section crosses the
 *   viewport, so no layout change (no sticky, no clipped content) is needed.
 *
 * The progress value is written on the SECTION, not the stage, so both the pinned
 * stage and the content layer that scrolls over it can drive their choreography
 * from the same number.
 */

const MOBILE_QUERY = '(max-width: 900px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// One frame at 24fps is ~0.0417s. Skip updates finer than a third of a frame so
// we never queue the same seek repeatedly ("avoid repeated timestamp assignment").
const MIN_SEEK_DELTA = 0.012;

// The last frame is a hair inside the tail: seeking exactly to `duration` some
// browsers render black instead of the final frame.
const TAIL_EPSILON = 0.05;

const controllers = new WeakMap();

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function isConstrainedConnection() {
  if (typeof navigator === 'undefined') return false;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType || '');
}

export default function useScrollVideoScrub({
  desktopSrc,
  mobileSrc,
  poster,
  mode = 'sticky',
  lazy = false,
  // How early a lazy source is attached. Cinematic worlds sit a whole travel
  // apart, so they pass a viewport-sized margin to warm the next clip up.
  preloadMargin = '320px',
  progressVar = '--world-progress',
}) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  // Save-data / very slow connections get the poster instead of a heavy scrub.
  const [constrained] = useState(isConstrainedConnection);
  const [videoSrc] = useState(() =>
    mobileSrc && typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
      ? mobileSrc
      : desktopSrc,
  );
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  // Lazy backdrops only attach their source once the section is approaching.
  const [shouldLoad, setShouldLoad] = useState(() => !lazy);

  const scrubEnabled = !reducedMotion && !constrained && !videoFailed;

  // Respect a live change of the OS "reduce motion" setting.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event) => setReducedMotion(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Attach the source shortly before the section reaches the viewport.
  useEffect(() => {
    if (!lazy || shouldLoad) return undefined;
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // A far-away world can be reported as intersecting while the page is
        // still being laid out (or right after a route change), so confirm the
        // real geometry before spending a video download on it.
        const rect = section.getBoundingClientRect();
        const slack = window.innerHeight;
        if (rect.top > window.innerHeight + slack || rect.bottom < -slack) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: `${preloadMargin} 0px`, threshold: 0 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [lazy, preloadMargin, shouldLoad]);

  useEffect(() => {
    if (!scrubEnabled || !shouldLoad) return undefined;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!section || !video) return undefined;
    if (mode === 'sticky' && !stage) return undefined;

    // Never allow a second controller to drive the same element.
    if (controllers.has(video)) return undefined;
    controllers.set(video, true);

    const target = mode === 'sticky' ? stage : section;

    let rafId = 0;
    let visible = false;
    let duration = 0;
    let startY = 0;
    let travel = 1;
    let lastApplied = -1;
    let queued = null;
    let lastProgress = -1;

    section.style.setProperty(progressVar, '0');

    const readDuration = () => {
      duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    };

    const measure = () => {
      readDuration();
      startY = section.getBoundingClientRect().top + window.scrollY;
      if (mode === 'sticky') {
        const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
        travel = Math.max(1, section.offsetHeight - stage.offsetHeight - stickyTop);
      } else {
        travel = Math.max(1, window.innerHeight + section.offsetHeight);
      }
    };

    const applyTime = (time) => {
      if (Math.abs(time - lastApplied) < MIN_SEEK_DELTA) return;
      lastApplied = time;
      // If the decoder is still catching up, keep only the freshest target and
      // apply it from `seeked` — this is what keeps scrolling responsive.
      if (video.seeking) {
        queued = time;
        return;
      }
      video.currentTime = time;
    };

    const progressAtScroll = () => {
      const raw =
        mode === 'sticky'
          ? (window.scrollY - startY) / travel
          : (window.innerHeight - (startY - window.scrollY)) / travel;
      if (!Number.isFinite(raw) || raw <= 0) return 0;
      return raw >= 1 ? 1 : raw;
    };

    const tick = () => {
      rafId = 0;
      const progress = progressAtScroll();

      // One write per real change: the value feeds every layer of the world.
      if (Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress;
        section.style.setProperty(progressVar, progress.toFixed(4));
      }

      if (duration > 0) {
        const tail = Math.max(0, duration - TAIL_EPSILON);
        applyTime(Math.min(tail, progress * duration));
      }

      if (visible) rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const onLoadedMetadata = () => {
      measure();
      lastApplied = -1;
      readDuration();
      start();
    };

    const onDurationChange = () => readDuration();

    const onFirstFrame = () => {
      readDuration();
      setVideoReady(true);
    };

    const onSeeked = () => {
      // Release the freshest target that arrived while the decoder was busy.
      if (queued !== null) {
        const next = queued;
        queued = null;
        lastApplied = next;
        video.currentTime = next;
      }
      setVideoReady(true);
    };

    const onError = () => setVideoFailed(true);

    const onResize = () => {
      measure();
      start();
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              if (visible) {
                measure();
                start();
              } else {
                stop();
              }
            },
            { threshold: 0 },
          );

    if (observer) observer.observe(section);
    else {
      visible = true;
      measure();
      start();
    }

    // Re-measure when the section's own box changes (fonts, media, viewport).
    const layoutObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure());

    if (layoutObserver) {
      layoutObserver.observe(section);
      if (stage) layoutObserver.observe(stage);
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadeddata', onFirstFrame);
    video.addEventListener('canplay', onFirstFrame);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    // Metadata may already be there by the time the effect runs.
    if (video.readyState >= 1) {
      measure();
      lastApplied = -1;
      start();
    }
    start();

    return () => {
      stop();
      controllers.delete(video);
      if (observer) observer.disconnect();
      if (layoutObserver) layoutObserver.disconnect();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadeddata', onFirstFrame);
      video.removeEventListener('canplay', onFirstFrame);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [mode, progressVar, scrubEnabled, shouldLoad, videoFailed, videoSrc]);

  return {
    sectionRef,
    stageRef,
    videoRef,
    poster,
    videoSrc,
    scrubEnabled,
    shouldLoad,
    videoReady,
    videoFailed,
    handleVideoError: () => setVideoFailed(true),
  };
}
