import useScrollVideoScrub from '../../lib/useScrollVideoScrub';

/**
 * Scroll-driven video "world" behind a section (or inside a media panel).
 *
 * There is no autoplay and no loop: the frame you see is a pure function of how
 * far the section has travelled through the viewport, so the footage plays out
 * as the visitor scrolls — down, up, and back again.
 *
 * `--scene-progress` (0 → 1) is written on the wrapper by the hook; the styles in
 * `components.css` turn that into the arrival: the frame pushes in and resolves
 * out of a dark curtain over the first part of the traversal.
 *
 * Fallbacks (see AGENTS.md): reduced motion or save-data → poster only.
 */
export default function ScrollVideo({ src, poster, veil = 'deep', variant = 'section', className = '' }) {
  const { sectionRef, videoRef, videoSrc, scrubEnabled, shouldLoad, videoReady, videoFailed, handleVideoError } =
    useScrollVideoScrub({
      desktopSrc: src,
      poster,
      mode: 'traverse',
      lazy: true,
      progressVar: '--scene-progress',
    });

  const classes = [
    'bg-video',
    scrubEnabled ? 'is-scrub' : '',
    variant === 'panel' ? 'bg-video--panel' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={sectionRef}
      className={classes}
      aria-hidden="true"
      data-video-state={videoFailed ? 'failed' : videoReady ? 'ready' : 'loading'}
      data-testid="scene-video-wrap"
    >
      <div className="bg-video__media">
        {poster ? (
          <img className="bg-video__poster" src={poster} alt="" loading="lazy" decoding="async" />
        ) : null}
        {shouldLoad && scrubEnabled ? (
          <video
            ref={videoRef}
            className={`bg-video__el ${videoReady ? 'is-ready' : ''}`}
            src={videoSrc}
            poster={poster}
            muted
            preload="auto"
            playsInline
            tabIndex={-1}
            disablePictureInPicture
            onError={handleVideoError}
            data-testid="scene-video"
          />
        ) : null}
      </div>
      <span className={`bg-video__veil bg-video__veil--${veil}`} />
      <span className="bg-video__curtain" />
    </div>
  );
}
