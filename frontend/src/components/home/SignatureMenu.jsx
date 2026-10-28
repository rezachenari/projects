import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import DishCard from '../ui/DishCard';
import Reveal from '../ui/Reveal';
import ScrollVideo from '../ui/ScrollVideo';

export default function SignatureMenu({ categories = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);

  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    return categories.find((category) => category.slug === activeSlug) || categories[0];
  }, [activeSlug, categories]);

  return (
    <section className="section section--dark menu-section" id="menu" aria-labelledby="menu-title">
      <ScrollVideo src="/videos/signature-dishes.mp4" poster="/images/sig.webp" veil="deep" />

      <div className="container">
        <Reveal className="section-head menu-section__head">
          <span className="eyebrow">منوی مستر</span>
          <h2 id="menu-title">از کوبیده ممتاز تا جوجه زغالی</h2>
          <p className="section-head__text">
            هر دستور با گوشت تازه‌ی روز، زغال بلوط و صبرِ کافی نوشته شده است؛ دستورهایی که سال‌هاست روی یک
            منو مانده‌اند.
          </p>
        </Reveal>

        {categories.length ? (
          <div className="menu-tabs" role="tablist" aria-label="دسته‌های منو">
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                role="tab"
                aria-selected={category.slug === activeCategory?.slug}
                className={`menu-tabs__item ${category.slug === activeCategory?.slug ? 'is-active' : ''}`}
                onClick={() => setActiveSlug(category.slug)}
              >
                {category.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="menu-tabs" aria-hidden="true">
            <span className="menu-tabs__skeleton" />
            <span className="menu-tabs__skeleton" />
            <span className="menu-tabs__skeleton" />
          </div>
        )}

        {activeCategory ? (
          <>
            <p className="menu-section__desc">{activeCategory.description}</p>
            <div className="menu-grid">
              {activeCategory.dishes.slice(0, 6).map((dish, index) => (
                <Reveal key={dish.slug} delay={index * 60}>
                  <DishCard dish={dish} />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="menu-grid" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="dish-card dish-card--skeleton" key={index} />
            ))}
          </div>
        )}

        <Reveal className="menu-section__cta">
          <Link className="btn btn--outline" to="/menu">
            <span className="btn__icon">
              <Flame size={16} aria-hidden="true" />
            </span>
            <span>مشاهده منوی کامل</span>
            <span className="btn__icon">
              <ArrowLeft size={16} aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
