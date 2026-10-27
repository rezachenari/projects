import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MegaMenu({ id, open, categories }) {
  return (
    <div className={`mega ${open ? 'is-open' : ''}`} id={id} aria-hidden={!open}>
      <div className="mega__grid">
        {categories.map((category) => (
          <Link
            key={category.slug}
            className="mega__link"
            to={`/categories/${category.slug}`}
            tabIndex={open ? 0 : -1}
          >
            <img
              className="mega__thumb"
              src={category.image_url}
              alt=""
              width="52"
              height="52"
              loading="lazy"
              decoding="async"
            />
            <span className="mega__label">
              <strong>{category.title}</strong>
              <span>{category.short_description}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mega__foot">
        <span>ابعاد، متریال و جزئیات هر محصول قابل سفارشی‌سازی است.</span>
        <Link className="link-arrow" to="/products" tabIndex={open ? 0 : -1}>
          <span>همه محصولات</span>
          <ArrowLeft size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
