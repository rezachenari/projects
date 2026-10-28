import useScrollVideoScrub from '../../lib/useScrollVideoScrub';

/** Persian chapter numerals, one per world. */
const CHAPTERS = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵', '۰۶', '۰۷', '۰۸', '۰۹'];

/**
 * One cinematic world of the nine-world journey.
 *
 * Every world is the same machine with its own configuration:
 *
 *   <section>            tall container — `--world-travel` + one viewport
 *     .world__stage      sticky viewport: video + veil + transition layers
 *         .world__scene  poster → scrubbed <video>, choreographed by progress
 *         .world__veil   the scrim the copy reads against
 *         .world__bridge / .world__glow   the world-to-world handoff
 *     .world__flow       the copy (and optional content) that scrolls over it
 *
 * The frame is a pure function of scroll (`video.currentTime = progress ×
 * duration`, see `useScrollVideoScrub`), and so is everything else here: the
 * scene's arrival, the copy's reveal steps and the exit dissolve all read the
 * same `--world-progress`. Nothing is time-based, so the same scroll position
 * always produces the same picture, forwards or backwards.
 *
 * - `layout="stage"` pins the copy inside the stage (the opening world).
 * - `layout="flow"` scrolls the copy, and any `children`, over the pinned scene.
 */
export default function ScrollVideoSection({
  id,
  index = 1,
  name,
  src,
  mobileSrc,
  poster,
  travel = '200vh',
  focus = '50% 50%',
  mobileFocus,
  veil = 'deep',
  transition = 'dissolve',
  layout = 'flow',
  priority = false,
  className = '',
  eyebrow,
  title,
  headingId = id ? `${id}-title` : undefined,
  headingLevel = 2,
  text,
  actions,
  meta,
  children,
}) {
  const {
    sectionRef,
    stageRef,
    videoRef,
    videoSrc,
    scrubEnabled,
    shouldLoad,
    videoReady,
    videoFailed,
    handleVideoError,
  } = useScrollVideoScrub({
      desktopSrc: src,
      mobileSrc,
      poster,
      mode: 'sticky',
      // The opening world loads immediately; the others attach about one
      // viewport before their section arrives and are never all alive at once.
      lazy: !priority,
      preloadMargin: priority ? '320px' : '130%',
      progressVar: '--world-progress',
    });

  const Heading = `h${headingLevel}`;
  const state = videoFailed ? 'failed' : videoReady ? 'ready' : 'loading';

  const copy = (
    <div className="world__copy">
      <span className="world__chapter">
        <span className="world__num" aria-hidden="true">
          {CHAPTERS[(index - 1) % CHAPTERS.length]}
        </span>
        {name ? <span className="world__name">{name}</span> : null}
      </span>
      {eyebrow ? <span className="eyebrow world__eyebrow">{eyebrow}</span> : null}
      {title ? (
        <Heading id={headingId} className="world__title">
          {title}
        </Heading>
      ) : null}
      {text ? <p className="world__text">{text}</p> : null}
      {actions ? <div className="world__actions">{actions}</div> : null}
      {meta ? <div className="world__meta">{meta}</div> : null}
    </div>
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`world world--${layout} ${scrubEnabled ? 'world--cinema' : 'world--static'} ${className}`.trim()}
      style={{
        '--world-travel': travel,
        '--world-focus': focus,
        '--world-focus-mobile': mobileFocus || focus,
      }}
      data-world={index}
      data-video-state={state}
      data-transition={transition}
      data-entrance={priority ? 'instant' : 'reveal'}
      aria-labelledby={headingId}
    >
      <div className="world__stage" ref={stageRef}>
        <div className="world__scene" aria-hidden="true">
          <img
            className="world__poster"
            src={poster}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchpriority: 'high' } : {})}
          />
          {scrubEnabled && shouldLoad ? (
            <video
              ref={videoRef}
              className={`world__el ${videoReady ? 'is-ready' : ''}`}
              src={videoSrc}
              poster={poster}
              muted
              preload="auto"
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
              data-testid={`world-video-${index}`}
              onError={handleVideoError}
            />
          ) : null}
        </div>

        <span className="world__veil" data-veil={veil} aria-hidden="true" />
        <span className="world__glow" aria-hidden="true" />
        <span className="world__bridge" aria-hidden="true" />
        <span className="world__vignette" aria-hidden="true" />

        {layout === 'stage' ? (
          <div className="world__layer">
            <div className="container">{copy}</div>
          </div>
        ) : null}

        <div className="world__rail" aria-hidden="true">
          <span />
        </div>
      </div>

      {layout === 'stage' ? null : (
        <div className="world__flow">
          <div className="world__layer world__layer--flow">
            <div className="container">{copy}</div>
          </div>
          {children}
        </div>
      )}
    </section>
  );
}
