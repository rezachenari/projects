import { Link } from 'react-router-dom';
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import Brand from '../ui/Brand';
import { footerLinks, footerServices } from '../../lib/nav';
import { useSite } from '../../lib/site-context';

export default function Footer() {
  const { settings } = useSite();
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());

  const socials = [
    settings?.instagram ? { href: settings.instagram, label: 'اینستاگرام', Icon: Instagram } : null,
    settings?.telegram ? { href: settings.telegram, label: 'تلگرام', Icon: Send } : null,
    settings?.whatsapp ? { href: settings.whatsapp, label: 'واتس‌اپ', Icon: MessageCircle } : null,
  ].filter(Boolean);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <Brand name={settings?.brand_name} subtitle={settings?.brand_tagline} />
            <p className="footer__about">
              طراحی، ساخت و اجرای ویترین طلافروشی، مانکن و استند نمایش طلا؛ با تمرکز بر متریال، نورپردازی و جزئیاتی
              که هویت گالری شما را در نگاه اول منتقل می‌کند.
            </p>
            {socials.length ? (
              <div className="footer__social">
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer noopener">
                    <Icon size={17} aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav className="footer__col" aria-label="لینک‌های اصلی">
            <h2 className="footer__title">دسترسی سریع</h2>
            <div className="footer__links">
              {footerLinks.map((link) => (
                <Link key={link.to} className="footer__link" to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav className="footer__col" aria-label="خدمات">
            <h2 className="footer__title">خدمات</h2>
            <div className="footer__links">
              {footerServices.map((link) => (
                <Link key={link.to} className="footer__link" to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="footer__col">
            <h2 className="footer__title">تماس با ما</h2>
            <div className="footer__contact">
              {settings?.phone_primary ? (
                <div className="footer__contact-row">
                  <Phone size={15} aria-hidden="true" />
                  <span>
                    {settings.phone_link ? (
                      <a href={`tel:${settings.phone_link}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {settings.phone_primary}
                      </a>
                    ) : (
                      settings.phone_primary
                    )}
                  </span>
                </div>
              ) : null}
              {settings?.email ? (
                <div className="footer__contact-row">
                  <Mail size={15} aria-hidden="true" />
                  <span>{settings.email}</span>
                </div>
              ) : null}
              {settings?.address ? (
                <div className="footer__contact-row">
                  <MapPin size={15} aria-hidden="true" />
                  <span>{settings.address}</span>
                </div>
              ) : null}
              {settings?.hours ? (
                <div className="footer__contact-row">
                  <Clock size={15} aria-hidden="true" />
                  <span>{settings.hours}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {settings?.brand_name || 'پارس ویترین'} — تمام حقوق محفوظ است.</span>
          {settings?.contact_placeholder ? (
            <span className="footer__bottom-note">
              اطلاعات تماس و شبکه‌های اجتماعی نمونه است؛ پیش از انتشار با اطلاعات واقعی جایگزین شود.
            </span>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
