import { Link } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import Reveal from '../ui/Reveal';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <img
          src="/images/hero-necklace-bust.webp"
          alt="مانکن مخملی مشکی با گردنبند طلا و جواهر در نورپردازی سینمایی"
          width="1920"
          height="1080"
          decoding="async"
        />
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
    </section>
  );
}
