import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Expand, Utensils } from 'lucide-react';
import Reveal from '../ui/Reveal';
import Lightbox from '../ui/Lightbox';
import ScrollVideoSection from '../cinema/ScrollVideoSection';
import { GALLERY } from '../../lib/site';

/** World 05 — the moment of serving. Food reaches the table, the gallery follows. */
export default function GalleryPreview() {
  const [openIndex, setOpenIndex] = useState(null);
  const items = GALLERY.slice(0, 6);

  return (
    <ScrollVideoSection
      id="gallery"
      index={5}
      name="لحظه سرو"
      src="/videos/serving-food.mp4"
      mobileSrc="/videos/serving-food-mobile.mp4"
      poster="/images/serving.webp"
      travel="180vh"
      veil="deep"
      transition="dissolve"
      focus="50% 50%"
      mobileFocus="50% 46%"
      title="لذت غذا، از لحظه‌ای شروع می‌شود که به میز می‌رسد"
      text="یک انتخاب خوشمزه، یک میز دلنشین و فرصتی برای لذت بردن از طعم‌های آشنا."
      actions={
        <Link className="btn btn--amber" to="/menu">
          <span className="btn__icon">
            <Utensils size={16} aria-hidden="true" />
          </span>
          <span>دیدن منوی غذاها</span>
          <span className="btn__icon">
            <ArrowLeft size={16} aria-hidden="true" />
          </span>
        </Link>
      }
    >
      <div className="container world-block">
        <h3 className="world-subtitle">نور، دود و میزی که منتظر شماست</h3>

        <div className="gallery__grid">
          {items.map((item, index) => (
            <Reveal
              className={`gallery__item ${item.span ? `gallery__item--${item.span}` : ''}`}
              key={item.src}
              delay={index * 50}
            >
              <button type="button" className="gallery__button" onClick={() => setOpenIndex(index)}>
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                <span className="gallery__caption">{item.caption}</span>
                <span className="gallery__zoom" aria-hidden="true">
                  <Expand size={15} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="gallery__cta">
          <Link className="btn btn--ghost" to="/gallery">
            <span>همه‌ی تصاویر</span>
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>

      {openIndex !== null ? (
        <Lightbox items={items} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      ) : null}
    </ScrollVideoSection>
  );
}
