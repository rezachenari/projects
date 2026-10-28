import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import DishCard from '../ui/DishCard';
import Reveal from '../ui/Reveal';
import ScrollVideoSection from '../cinema/ScrollVideoSection';

/** World 02 — the signature of taste. Featured dishes stay real HTML over the film. */
export default function SignatureMenu({ categories = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);

  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    return categories.find((category) => category.slug === activeSlug) || categories[0];
  }, [activeSlug, categories]);

  return (
    <ScrollVideoSection
      id="menu"
      index={2}
      name="امضای طعم"
      src="/videos/signature-dishes.mp4"
      mobileSrc="/videos/signature-dishes-mobile.mp4"
      poster="/images/sig.webp"
      travel="165vh"
      veil="deep"
      transition="warm"
      focus="50% 48%"
      mobileFocus="50% 42%"
      eyebrow="پیشنهاد مستر کباب"
      title="انتخاب‌های خوش‌طعم برای سلیقه‌های خاص"
      text="از کباب‌های اصیل ایرانی تا همراهی برنج زعفرانی؛ انتخابت را پیدا کن و برای یک وعده دلچسب آماده شو."
    >
      <div className="container world-block">
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
      </div>

      <div className="container world-block menu-section__cta">
        <Reveal>
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
    </ScrollVideoSection>
  );
}
