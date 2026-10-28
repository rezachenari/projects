import { ArrowLeft, ChefHat, MousePointerClick } from 'lucide-react';
import useScrollVideoScrub from '../../lib/useScrollVideoScrub';

const POSTER = '/images/hero-poster.webp';

export default function Hero() {
  const {
    sectionRef,
    stageRef,
    videoRef,
    videoSrc,
    scrubEnabled,
    videoReady,
    videoFailed,
    handleVideoError,
  } = useScrollVideoScrub({
    desktopSrc: '/videos/hero-kebab.mp4',
    mobileSrc: '/videos/hero-kebab-mobile.mp4',
    poster: POSTER,
  });

  return (
    <section
      className={`hero ${scrubEnabled ? 'hero--scrub' : 'hero--static'}`}
      ref={sectionRef}
      aria-labelledby="hero-title"
      data-scrub={scrubEnabled ? 'on' : 'off'}
      data-video-state={videoFailed ? 'failed' : videoReady ? 'ready' : 'loading'}
    >
      <div className="hero__stage" ref={stageRef}>
        <div className="hero__media">
          <img
            className="hero__poster"
            src={POSTER}
            alt="کباب زغالی تازه روی حرارت زغال در رستوران مستر کباب"
            width="1280"
            height="720"
            fetchPriority="high"
            decoding="async"
          />
          {scrubEnabled ? (
            <video
              ref={videoRef}
              className={`hero__video ${videoReady ? 'is-ready' : ''}`}
              src={videoSrc}
              poster={POSTER}
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
              data-testid="hero-video"
              onError={handleVideoError}
            />
          ) : null}
        </div>

        <div className="hero__veil" aria-hidden="true" />

        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">عطر زغال، طعم اصالت</span>
            <h1 id="hero-title">
              کبابی که عطرش، <span className="hero__accent">اشتها را بیدار می‌کند</span>
            </h1>
            <p className="hero__text">
              از حرارت زغال تا عطر برنج زعفرانی؛ تجربه‌ای از طعم ایرانی که برای دوباره چشیدن ساخته شده است.
            </p>
            <div className="hero__actions">
              <a className="btn btn--amber" href="#menu">
                <span className="btn__icon">
                  <ChefHat size={17} aria-hidden="true" />
                </span>
                <span>منوی مستر کباب</span>
              </a>
              <a className="btn btn--outline" href="#reservation">
                <span>شروع یک تجربه خوشمزه</span>
                <span className="btn__icon">
                  <ArrowLeft size={16} aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>

          <div className="hero__foot">
            <span className="hero__cue">
              {scrubEnabled ? <MousePointerClick size={15} aria-hidden="true" /> : null}
              <span>{scrubEnabled ? 'برای آغاز، اسکرول کنید' : 'مستر کباب، ولیعصر'}</span>
            </span>
            <span className="hero__hint">یک تجربه سینمایی از عطر زغال</span>
          </div>
        </div>

        <div className="hero__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
