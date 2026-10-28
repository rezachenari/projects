import { Link } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import DishCard from '../components/ui/DishCard';
import Reveal from '../components/ui/Reveal';
import { useSite } from '../lib/site-context';

export default function Menu() {
  const { categories } = useSite();

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">منوی مستر کباب</span>
          <h1>منوی کامل، از زغال تا دسر</h1>
          <p className="lead">
            همه‌ی بشقاب‌های مستر کباب در یک صفحه. آیتم‌های ناموجود هر شب به‌روز می‌شوند؛ اگر چیزی تمام شده
            بود، پیشنهاد ما را از سرآشپز بپرسید.
          </p>
        </div>
      </section>

      <section className="section section--dark menu-page">
        <div className="container">
          {categories.length ? (
            categories.map((category) => (
              <div className="menu-category" key={category.slug} id={category.slug}>
                <div className="menu-category__head">
                  <h2>{category.title}</h2>
                  <p className="muted">{category.description}</p>
                </div>
                <div className="menu-grid">
                  {category.dishes.map((dish, index) => (
                    <Reveal key={dish.slug} delay={Math.min(index, 3) * 50}>
                      <DishCard dish={dish} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="menu-grid" aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="dish-card dish-card--skeleton" key={index} />
              ))}
            </div>
          )}

          <div className="menu-page__cta">
            <span className="menu-page__cta-icon" aria-hidden="true">
              <Flame size={18} />
            </span>
            <p>منتظرتان هستیم؛ میزتان را از قبل رزرو کنید.</p>
            <Link className="btn btn--amber" to="/reservation">
              <span>رزرو میز</span>
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
