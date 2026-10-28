import { useState } from 'react';
import { Expand } from 'lucide-react';
import Lightbox from '../components/ui/Lightbox';
import Reveal from '../components/ui/Reveal';
import { GALLERY } from '../lib/site';

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">گالری مستر</span>
          <h1>شب‌های زغالی مستر کباب</h1>
          <p className="lead">قاب‌هایی از سالن، زغال‌دان و بشقاب‌هایی که هر شب از آشپزخانه بیرون می‌آیند.</p>
        </div>
      </section>

      <section className="section section--dark gallery-page">
        <div className="container">
          <div className="gallery__grid gallery__grid--full">
            {GALLERY.map((item, index) => (
              <Reveal
                className={`gallery__item ${item.span ? `gallery__item--${item.span}` : ''}`}
                key={item.src}
                delay={Math.min(index, 4) * 50}
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
        </div>
      </section>

      {openIndex !== null ? (
        <Lightbox items={GALLERY} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      ) : null}
    </>
  );
}
