import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Expand } from 'lucide-react';
import Reveal from '../ui/Reveal';
import BackgroundVideo from '../ui/BackgroundVideo';
import Lightbox from '../ui/Lightbox';
import { GALLERY } from '../../lib/site';

export default function GalleryPreview() {
  const [openIndex, setOpenIndex] = useState(null);
  const items = GALLERY.slice(0, 6);

  return (
    <section className="section section--dark gallery" id="gallery" aria-labelledby="gallery-title">
      <BackgroundVideo src="/videos/serving-food.mp4" poster="/images/serving.webp" veil="deep" />

      <div className="container">
        <Reveal className="section-head gallery__head">
          <span className="eyebrow">گالری مستر</span>
          <h2 id="gallery-title">نور، دود و میزی که منتظر شماست</h2>
          <p className="section-head__text">
            چند قاب از شب‌های مستر کباب؛ از حرارت زغال تا میزی که با نان داغ و ماست موسیر چیده می‌شود.
          </p>
        </Reveal>

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
    </section>
  );
}
