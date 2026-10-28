import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ordinary background video for the non-hero sections: muted, looping, lazy.
 * The source is only attached once the section approaches the viewport, and
 * playback pauses while it is off screen.
 */
export default function BackgroundVideo({ src, poster, veil = 'soft', className = '' }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const inViewRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // A play() issued before the media has data is rejected; retry on canplay.
  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !inViewRef.current || failed) return;
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }, [failed]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      inViewRef.current = true;
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          tryPlay();
        } else if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      },
      { rootMargin: '280px 0px', threshold: 0 },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [tryPlay]);

  return (
    <div ref={wrapRef} className={`bg-video ${className}`.trim()} aria-hidden="true">
      {poster ? <img className="bg-video__poster" src={poster} alt="" loading="lazy" decoding="async" /> : null}
      {shouldLoad && !failed ? (
        <video
          ref={videoRef}
          className={`bg-video__el ${ready ? 'is-ready' : ''}`}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          disablePictureInPicture
          onLoadedData={() => setReady(true)}
          onCanPlay={() => {
            setReady(true);
            tryPlay();
          }}
          onError={() => setFailed(true)}
        />
      ) : null}
      <span className={`bg-video__veil bg-video__veil--${veil}`} />
    </div>
  );
}
