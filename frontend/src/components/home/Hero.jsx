import { Link } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import Reveal from '../ui/Reveal';
import useScrollVideoScrub from '../../lib/useScrollVideoScrub';

const HERO_POSTER = '/images/hero-video-poster.webp';
const HERO_VIDEO = '/videos/hero-scrub.mp4';
const HERO_VIDEO_MOBILE = '/videos/hero-scrub-mobile.mp4';

export default function Hero() {
  const { sectionRef, stageRef, videoRef, videoSrc, scrubEnabled, videoReady, videoFailed, handleVideoError } =
    useScrollVideoScrub({
      desktopSrc: HERO_VIDEO,
      mobileSrc: HERO_VIDEO_MOBILE,
      poster: HERO_POSTER,
    });

  return (
    <section className={`hero ${scrubEnabled ? 'hero--scrub' : ''}`} ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__stage" ref={stageRef}>
        <div className="hero__media">
          <img
            className="hero__poster"
            src={HERO_POSTER}
            alt="نمای سینمایی از ویترین طلا و جواهر با نورپردازی لوکس"
            width="1280"
            height="720"
            decoding="async"
          />
          {scrubEnabled && !videoFailed ? (
            <video
              ref={videoRef}
              className={`hero__video ${videoReady ? 'is-ready' : ''}`}
              src={videoSrc}
              poster={HERO_POSTER}
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
              onError={handleVideoError}
            />
          ) : null}
        </div>
        <div className="hero__veil" aria-hidden="true" />

        <div className="container">
          <Reveal className="hero__copy">
            <span className="eyebrow">طراحی، تولید و اجرای تخصصی دکور طلافروشی</span>
            <h1 id="hero-title">
              ویترینی بسازید که <span className="hero__accent">ارزش طلاهای شما</span> را دوچندان نشان دهد
            </h1>
            <p className="hero__text">
              از طراحی اولین ایده تا ساخت و اجرای نهایی؛ ویترین‌ها و مانکن‌های اختصاصی برای گالری‌هایی که می‌خواهند
              متفاوت دیده شوند و تجربه‌ای ماندگار برای مشتریان خود بسازند.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--gold" to="/products">
                <span>مشاهده محصولات</span>
                <span className="btn__icon">
                  <ArrowLeft size={17} aria-hidden="true" />
                </span>
              </Link>
              <Link className="btn btn--outline" to="/consultation">
                <span>مشاوره طراحی اختصاصی</span>
                <span className="btn__icon">
                  <Play size={15} aria-hidden="true" />
                </span>
              </Link>
            </div>
            <p className="hero__trust">
              <span>طراحی اختصاصی</span>
              <span className="hero__trust-dot" aria-hidden="true" />
              <span>ساخت سفارشی</span>
              <span className="hero__trust-dot" aria-hidden="true" />
              <span>اجرای حرفه‌ای</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
