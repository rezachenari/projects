import { Clock, Phone, Users } from 'lucide-react';
import Reveal from '../ui/Reveal';
import BackgroundVideo from '../ui/BackgroundVideo';
import ReservationForm from '../forms/ReservationForm';

export default function ReservationSection({ settings }) {
  return (
    <section className="section section--dark reserve" id="reservation" aria-labelledby="reserve-title">
      <BackgroundVideo src="/videos/reservation-cta.mp4" poster="/images/reservation.webp" veil="deep" />

      <div className="container reserve__grid">
        <Reveal className="reserve__info">
          <span className="eyebrow">رزرو میز</span>
          <h2 id="reserve-title">میزتان را کنار زغال نگه می‌داریم</h2>
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
                <a className="muted" href={`tel:${settings.phone?.replace(/[^\d+]/g, '') || ''}`}>
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
    </section>
  );
}
