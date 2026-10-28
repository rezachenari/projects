import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, Phone, X } from 'lucide-react';
import { NAV_LINKS } from '../../lib/site';

export default function Header({ settings }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/' && !location.hash;
    if (to.startsWith('/#')) return onHome && location.hash === to.slice(1);
    return location.pathname === to;
  };

  return (
    <>
      <header className={`site-header ${scrolled || !onHome ? 'is-scrolled' : ''} ${!onHome ? 'is-solid' : ''}`}>
        <div className="container site-header__inner">
          <Link className="brand" to="/" aria-label={`${settings.brand_name} — خانه`}>
            <span className="brand__mark" aria-hidden="true">
              <Flame size={18} />
            </span>
            <span className="brand__text">
              <span className="brand__name">{settings.brand_name}</span>
              <span className="brand__tag">{settings.tagline}</span>
            </span>
          </Link>

          <nav className="nav" aria-label="ناوبری اصلی">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav__link ${isActive(link.to) ? 'is-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <a className="header-phone" href={`tel:${settings.phone?.replace(/[^\d+]/g, '') || ''}`}>
              <Phone size={14} aria-hidden="true" />
              <span>{settings.phone}</span>
            </a>
            <Link className="btn btn--amber btn--sm" to="/reservation">
              رزرو میز
            </Link>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${open ? 'is-open' : ''}`} role="dialog" aria-modal={open} aria-label="منوی موبایل">
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="mobile-nav__link" onClick={() => setOpen(false)}>
            <span>{link.label}</span>
            <span aria-hidden="true">←</span>
          </Link>
        ))}
        <Link className="btn btn--amber mobile-nav__cta" to="/reservation" onClick={() => setOpen(false)}>
          رزرو میز
        </Link>
        <a className="mobile-nav__phone" href={`tel:${settings.phone?.replace(/[^\d+]/g, '') || ''}`}>
          {settings.phone}
        </a>
      </div>
    </>
  );
}
