import { Link } from 'react-router-dom';
import { Clock, Flame, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { NAV_LINKS } from '../../lib/site';

export default function Footer({ settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <span className="brand">
              <span className="brand__mark" aria-hidden="true">
                <Flame size={18} />
              </span>
              <span className="brand__text">
                <span className="brand__name">{settings.brand_name}</span>
                <span className="brand__tag">{settings.tagline}</span>
              </span>
            </span>
            <p className="muted">
              کباب زغالی، برنج زعفرانی و مهمان‌نوازی ایرانی؛ در فضایی که بوی چوب و ادویه از همان درِ ورودی
              به استقبال می‌آید.
            </p>
          </div>

          <div>
            <h4 className="footer__title">دسترسی سریع</h4>
            <nav className="footer__links" aria-label="ناوبری پاورقی">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
              <Link to="/#gallery">گالری تصاویر</Link>
            </nav>
          </div>

          <div>
            <h4 className="footer__title">ساعت کاری</h4>
            <ul className="footer__contact">
              <li>
                <Clock size={15} aria-hidden="true" />
                <span>{settings.hours}</span>
              </li>
              <li>
                <Clock size={15} aria-hidden="true" />
                <span>{settings.reservation_note}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">تماس با ما</h4>
            <ul className="footer__contact">
              <li>
                <MapPin size={15} aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
              <li>
                <Phone size={15} aria-hidden="true" />
                <a href={`tel:${settings.phone?.replace(/[^\d+]/g, '') || ''}`}>{settings.phone}</a>
              </li>
              <li>
                <Mail size={15} aria-hidden="true" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li>
                <Instagram size={15} aria-hidden="true" />
                <span dir="ltr">{settings.instagram}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {settings.brand_name} — همه حقوق محفوظ است.
          </span>
          <span className="muted">ساخته‌شده با عشق به طعم زغال</span>
        </div>
      </div>
    </footer>
  );
}
