import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Phone, Search } from 'lucide-react';
import Brand from '../ui/Brand';
import MegaMenu from './MegaMenu';
import MobileDrawer from './MobileDrawer';
import SearchOverlay from './SearchOverlay';
import { primaryNav } from '../../lib/nav';
import { useSite } from '../../lib/site-context';

export default function Header() {
  const { categories, settings } = useSite();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!megaOpen) return undefined;
    const onPointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setMegaOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [megaOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header__bar">
          <Brand name={settings?.brand_name} />

          <nav className="nav" aria-label="ناوبری اصلی" ref={navRef}>
            {primaryNav.map((item) =>
              item.hasMega ? (
                <div className="nav__item" key={item.to}>
                  <button
                    type="button"
                    className={`nav__link ${isActive(item.to) ? 'is-active' : ''}`}
                    aria-expanded={megaOpen}
                    aria-controls="products-mega"
                    onClick={() => setMegaOpen((open) => !open)}
                  >
                    {item.label}
                    <ChevronDown size={14} className="nav__chevron" aria-hidden="true" />
                  </button>
                  {categories.length ? (
                    <MegaMenu id="products-mega" open={megaOpen} categories={categories} />
                  ) : null}
                </div>
              ) : (
                <div className={`nav__item ${item.optional ? 'nav__item--optional' : ''}`} key={item.to}>
                  <Link className={`nav__link ${isActive(item.to) ? 'is-active' : ''}`} to={item.to}>
                    {item.label}
                  </Link>
                </div>
              ),
            )}
          </nav>

          <div className="header__actions">
            {settings?.phone_primary ? (
              settings.phone_link ? (
                <a className="header__phone" href={`tel:${settings.phone_link}`}>
                  <Phone size={15} aria-hidden="true" />
                  <span>{settings.phone_primary}</span>
                </a>
              ) : (
                <span className="header__phone">
                  <Phone size={15} aria-hidden="true" />
                  <span>{settings.phone_primary}</span>
                </span>
              )
            ) : null}

            <button
              className="icon-btn"
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="جست‌وجوی محصولات"
            >
              <Search size={18} aria-hidden="true" />
            </button>

            <Link className="btn btn--outline header__cta" to="/consultation">
              درخواست مشاوره
            </Link>

            <button
              className="icon-btn header__burger"
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={drawerOpen}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
