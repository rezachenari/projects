import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <article className="card cat-card">
      <div className="card__media">
        <img
          src={category.image_url}
          alt={category.image_alt || category.title}
          loading="lazy"
          decoding="async"
          width="640"
          height="854"
        />
      </div>
      <div className="cat-card__overlay">
        <h3 className="cat-card__title">{category.title}</h3>
        <p className="cat-card__desc">{category.short_description}</p>
        <span className="cat-card__arrow">
          <span>مشاهده محصولات</span>
          <ArrowLeft size={15} aria-hidden="true" />
        </span>
      </div>
      <Link
        className="card__link"
        to={`/categories/${category.slug}`}
        aria-label={`${category.title} — مشاهده محصولات`}
      />
    </article>
  );
}
