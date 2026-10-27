import { useEffect, useRef, useState } from 'react';

const MOBILE_MEDIA = '(max-width: 900px)';
const MIN_STEP = 0.004; // seconds; finer than a single frame at 24fps

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function onConstrainedConnection() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType || '');
}

/**
 * Binds a <video> to scroll progress instead of playback:
 * `video.currentTime = progress * duration` for the duration of a sticky hero.
 *
 * - No `play()` / `pause()` calls: the frame is a pure function of scroll.
 * - One rAF loop while the hero is on screen; it stops as soon as it leaves.
 * - The section needs a `--hero-travel` taller than its sticky stage (CSS).
 */
export default function useScrollVideoScrub({ desktopSrc, mobileSrc, poster }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  const [scrubEnabled] = useState(() => !prefersReducedMotion() && !onConstrainedConnection());
  const [videoSrc] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(MOBILE_MEDIA).matches ? mobileSrc : desktopSrc,
  );
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!scrubEnabled || videoFailed) return undefined;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!section || !stage || !video) return undefined;

    let frame = 0;
    let active = false;
    let duration = 0;
    let startY = 0;
    let travel = 1;
    let lastApplied = -1;

    const measure = () => {
      startY = section.getBoundingClientRect().top + window.scrollY;
      // Scroll distance the stage actually stays pinned: section height minus the
      // sticky stage and the offset it sticks below the sticky header.
      const stickOffset = Number.parseFloat(getComputedStyle(stage).top) || 0;
      travel = Math.max(1, section.offsetHeight - stage.offsetHeight - stickOffset);
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    const tick = () => {
      frame = 0;
      if (duration > 0) {
        const progress = Math.min(1, Math.max(0, (window.scrollY - startY) / travel));
        // Stay just inside the last frame so the final frame is a real rendered frame.
        const target = Math.min(duration - 0.02, progress * duration);
        if (Math.abs(target - lastApplied) > MIN_STEP) {
          lastApplied = target;
          video.currentTime = target;
        }
      }
      if (active) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (active && !frame) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMeta = () => {
      measure();
      lastApplied = -1;
      start();
    };
    const onResize = () => {
      measure();
      start();
    };
    const onReady = () => setVideoReady(true);
    const onError = () => setVideoFailed(true);

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              active = entry.isIntersecting;
              if (active) {
                measure();
                start();
              } else {
                stop();
              }
            },
            { threshold: 0 },
          );

    if (observer) observer.observe(section);
    else active = true;

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onError);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    if (video.readyState >= 1) onMeta();
    start();

    return () => {
      active = false;
      stop();
      if (observer) observer.disconnect();
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onError);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [scrubEnabled, videoFailed]);

  return {
    sectionRef,
    stageRef,
    videoRef,
    poster,
    videoSrc,
    scrubEnabled,
    videoReady,
    videoFailed,
    handleVideoError: () => setVideoFailed(true),
  };
}
