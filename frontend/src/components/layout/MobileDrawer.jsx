import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, Phone } from 'lucide-react';
import Brand from '../ui/Brand';
import { primaryNav } from '../../lib/nav';
import { useSite } from '../../lib/site-context';

export default function MobileDrawer({ open, onClose }) {
  const { categories, settings } = useSite();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      {open ? <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" /> : null}
      <div
        className={`drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        aria-hidden={!open}
      >
        <div className="drawer__head">
          <Brand onClick={onClose} name={settings?.brand_name || 'پارس ویترین'} />
          <button className="icon-btn" type="button" onClick={onClose} aria-label="بستن منو">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="drawer__nav" aria-label="ناوبری موبایل">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              className="drawer__link"
              to={item.to}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
            >
              <span>{item.label}</span>
              <ChevronLeft size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>

        {categories.length ? (
          <>
            <p className="drawer__section">دسته‌بندی محصولات</p>
            <div className="drawer__cats">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  className="drawer__cat"
                  to={`/categories/${category.slug}`}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <div className="drawer__foot">
          <Link className="btn btn--gold" to="/consultation" onClick={onClose} tabIndex={open ? 0 : -1}>
            درخواست مشاوره اختصاصی
          </Link>
          {settings?.phone_primary ? (
            <span className="drawer__phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={15} aria-hidden="true" />
              {settings.phone_link ? (
                <a href={`tel:${settings.phone_link}`} tabIndex={open ? 0 : -1}>
                  {settings.phone_primary}
                </a>
              ) : (
                settings.phone_primary
              )}
            </span>
          ) : null}
          {settings?.contact_placeholder ? (
            <span className="drawer__note">اطلاعات تماس نمونه است و باید با اطلاعات واقعی جایگزین شود.</span>
          ) : null}
        </div>
      </div>
    </>
  );
}
