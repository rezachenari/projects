import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { priceLabel } from '../../lib/utils';

export default function ProductCard({ product }) {
  const detailPath = `/products/${product.slug}`;
  const inquiryPath = `/consultation?type=${encodeURIComponent('مشاوره و استعلام قیمت')}&product=${encodeURIComponent(
    product.name,
  )}`;

  return (
    <article className="card product-card">
      <div className="card__media">
        <img
          src={product.image_url}
          alt={product.image_alt || product.name}
          loading="lazy"
          decoding="async"
          width="640"
          height="640"
        />
      </div>
      <div className="card__body">
        <span className="card__meta">{product.category_title}</span>
        <h3 className="card__title">{product.name}</h3>
        <p className="card__spec">{product.spec_line}</p>
        <div className="card__foot">
          <span className="product-card__price">{priceLabel(product)}</span>
          <Link className="link-arrow" to={inquiryPath} style={{ position: 'relative', zIndex: 3 }}>
            <span>درخواست قیمت</span>
            <ArrowLeft size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <Link className="card__link" to={detailPath} aria-label={`${product.name} — مشاهده جزئیات`} />
    </article>
  );
}
