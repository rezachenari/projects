import { ArrowLeft, Clock, Phone, PhoneCall, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import ReservationForm from '../forms/ReservationForm';
import ScrollVideoSection from '../cinema/ScrollVideoSection';
import { telHref } from '../../lib/site';

/** World 08 — the invitation. The culmination of the journey. */
export default function ReservationSection({ settings }) {
  return (
    <ScrollVideoSection
      id="reservation"
      index={8}
      name="دعوت"
      src="/videos/reservation-cta.mp4"
      mobileSrc="/videos/reservation-cta-mobile.mp4"
      poster="/images/reservation.webp"
      travel="175vh"
      veil="deep"
      transition="dissolve"
      focus="50% 48%"
      mobileFocus="50% 44%"
      title="امروز، نوبت یک غذای خوشمزه است"
      text="منوی مستر کباب را ببین، انتخابت را انجام بده و برای یک تجربه دلچسب آماده شو."
      actions={
        <>
          <Link className="btn btn--amber" to="/menu">
            <span>مشاهده منو</span>
            <span className="btn__icon">
              <ArrowLeft size={16} aria-hidden="true" />
            </span>
          </Link>
          <a className="btn btn--outline" href={telHref(settings?.phone)}>
            <span className="btn__icon">
              <PhoneCall size={16} aria-hidden="true" />
            </span>
            <span>تماس با مستر کباب</span>
          </a>
        </>
      }
    >
      <div className="container world-block">
        <div className="reserve__grid">
          <Reveal className="reserve__info">
            <span className="eyebrow">رزرو میز</span>
            <h3 className="world-subtitle">میزتان را کنار زغال نگه می‌داریم</h3>
            <p className="lead">
              شب‌های آخر هفته میزهای کنار زغال‌دان زود پر می‌شوند؛ رزرو را از همین‌جا ثبت کنید تا میز
              دلخواهتان را نگه داریم.
            </p>

            <ul className="reserve__list">
              <li>
                <span className="reserve__icon" aria-hidden="true">
                  <Clock size={16} />
                </span>
                <div>
                  <strong>ساعت پذیرش</strong>
                  <span className="muted">{settings.hours}</span>
                </div>
              </li>
              <li>
                <span className="reserve__icon" aria-hidden="true">
                  <Users size={16} />
                </span>
                <div>
                  <strong>جمع‌های بزرگ</strong>
                  <span className="muted">برای بیش از ۱۲ نفر، هماهنگی تلفنی</span>
                </div>
              </li>
              <li>
                <span className="reserve__icon" aria-hidden="true">
                  <Phone size={16} />
                </span>
                <div>
                  <strong>رزرو تلفنی</strong>
                  <a className="muted" href={telHref(settings?.phone)}>
                    {settings.phone}
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal className="reserve__form" delay={90}>
            <ReservationForm compact />
          </Reveal>
        </div>
      </div>
    </ScrollVideoSection>
  );
}
