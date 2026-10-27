import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function SearchOverlay({ open, onClose }) {
  const [term, setTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const query = term.trim();
    onClose();
    setTerm('');
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="جست‌وجوی محصولات">
      <div className="search-overlay__panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="search-overlay__label">جست‌وجو در محصولات</span>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="بستن جست‌وجو">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={submit}>
          <label className="visually-hidden" htmlFor="site-search">
            نام محصول یا دسته‌بندی
          </label>
          <div className="search-overlay__row">
            <Search size={20} color="#D6AD62" aria-hidden="true" />
            <input
              id="site-search"
              ref={inputRef}
              className="search-overlay__input"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="مثلاً ویترین دیواری، مانکن گردنبند…"
              autoComplete="off"
            />
            <button className="btn btn--gold" type="submit" style={{ minHeight: 44 }}>
              جست‌وجو
            </button>
          </div>
        </form>
        <p className="search-overlay__hint">برای بستن، کلید Esc را بزنید.</p>
      </div>
    </div>
  );
}
