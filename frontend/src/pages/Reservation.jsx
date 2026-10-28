import { Clock, MapPin, Phone } from 'lucide-react';
import ReservationForm from '../components/forms/ReservationForm';
import Reveal from '../components/ui/Reveal';
import { useSite } from '../lib/site-context';

export default function Reservation() {
  const { settings } = useSite();

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">رزرو میز</span>
          <h1>میزتان را کنار زغال نگه می‌داریم</h1>
          <p className="lead">
            فرم را پر کنید تا همکاران ما برای تأیید تماس بگیرند. رزروهای شب آخر هفته را حداقل یک روز زودتر
            ثبت کنید.
          </p>
        </div>
      </section>

      <section className="section section--dark reserve-page">
        <div className="container reserve-page__grid">
          <Reveal className="reserve-page__form">
            <ReservationForm />
          </Reveal>

          <Reveal className="reserve-page__aside" delay={80}>
            <h2>راه‌های دیگر رزرو</h2>
            <ul className="reserve__list">
              <li>
                <span className="reserve__icon" aria-hidden="true">
                  <Phone size={16} />
                </span>
                <div>
                  <strong>تماس تلفنی</strong>
                  <a className="muted" href={`tel:${settings.phone?.replace(/[^\d+]/g, '') || ''}`}>
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li>
                <span className="reserve__icon" aria-hidden="true">
                  <Clock size={16} />
                </span>
                <div>
                  <strong>ساعت کاری</strong>
                  <span className="muted">{settings.hours}</span>
                </div>
              </li>
              <li>
                <span className="reserve__icon" aria-hidden="true">
                  <MapPin size={16} />
                </span>
                <div>
                  <strong>نشانی</strong>
                  <span className="muted">{settings.address}</span>
                </div>
              </li>
            </ul>
            <p className="form-note">{settings.reservation_note}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
