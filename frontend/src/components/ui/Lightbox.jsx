import { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Lightbox({ items, index, onClose, onIndexChange }) {
  const item = items[index];

  const go = useCallback(
    (step) => {
      onIndexChange((index + step + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') go(1);
      if (event.key === 'ArrowRight') go(-1);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || 'تصویر گالری'}
      onClick={onClose}
    >
      <button type="button" className="lightbox__close" onClick={onClose} aria-label="بستن">
        <X size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        onClick={(event) => {
          event.stopPropagation();
          go(-1);
        }}
        aria-label="تصویر قبلی"
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>
      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        {item.caption ? <figcaption>{item.caption}</figcaption> : null}
      </figure>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={(event) => {
          event.stopPropagation();
          go(1);
        }}
        aria-label="تصویر بعدی"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
