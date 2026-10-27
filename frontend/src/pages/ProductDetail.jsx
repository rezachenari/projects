import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Info, MessageSquare, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/cards/ProductCard';
import Reveal from '../components/ui/Reveal';
import JsonLd from '../components/ui/JsonLd';
import { priceLabel, useApi, useDocumentMeta } from '../lib/utils';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, loading, error, retry } = useApi(`/products/${encodeURIComponent(slug)}`);

  const product = data?.product || null;
  const related = data?.related || [];

  useDocumentMeta({
    title: product ? `${product.name} | پارس ویترین` : 'جزئیات محصول | پارس ویترین',
    description: product?.summary || 'جزئیات محصول و امکان استعلام قیمت.',
  });

  if (loading) {
    return (
      <section className="detail">
        <div className="container">
          <div className="detail__layout">
            <div className="skeleton" style={{ minHeight: 460 }} />
            <div className="skeleton" style={{ minHeight: 460 }} />
          </div>
        </div>
      </section>
    );
  }

  if (error?.status === 404) return <NotFound />;

  if (error || !product) {
    return (
      <section className="detail">
        <div className="container">
          <div className="empty-state">
            <strong>اطلاعات محصول بارگذاری نشد.</strong>
            <p>{error?.message}</p>
            <button className="btn btn--outline" type="button" onClick={retry}>
              تلاش دوباره
            </button>
          </div>
        </div>
      </section>
    );
  }

  const inquiryPath = `/consultation?type=${encodeURIComponent('مشاوره و استعلام قیمت')}&product=${encodeURIComponent(
    product.name,
  )}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.summary,
          category: product.category_title,
          image: [product.image_url],
          brand: { '@type': 'Brand', name: 'پارس ویترین' },
        }}
      />

      <section className="detail">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'محصولات', to: '/products' },
              { label: product.category_title, to: `/categories/${product.category_slug}` },
              { label: product.name },
            ]}
          />

          <div className="detail__layout">
            <Reveal className="detail__media">
              <img
                src={product.image_url}
                alt={product.image_alt || product.name}
                width="900"
                height="945"
                decoding="async"
              />
            </Reveal>

            <div className="detail__info">
              <span className="eyebrow">{product.category_title}</span>
              <h1>{product.name}</h1>
              <p className="detail__price">{priceLabel(product)}</p>
              <p className="detail__lead">{product.description}</p>

              {product.features?.length ? (
                <div className="feature-list">
                  {product.features.map((feature) => (
                    <div className="feature-list__item" key={feature}>
                      <span className="feature-list__icon" aria-hidden="true">
                        <ShieldCheck size={18} strokeWidth={1.4} />
                      </span>
                      <p className="feature-list__desc" style={{ alignSelf: 'center' }}>
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="specs">
                {(product.specs || []).map((spec) => (
                  <div className="specs__row" key={spec.label}>
                    <span className="specs__key">{spec.label}</span>
                    <span className="specs__val">{spec.value}</span>
                  </div>
                ))}
                <div className="specs__row">
                  <span className="specs__key">وضعیت قیمت</span>
                  <span className="specs__val">بر اساس ابعاد و متریال، استعلام می‌شود</span>
                </div>
              </div>

              <div className="detail__actions">
                <Link className="btn btn--gold" to={inquiryPath}>
                  <span>درخواست قیمت</span>
                  <span className="btn__icon">
                    <MessageSquare size={16} aria-hidden="true" />
                  </span>
                </Link>
                <Link className="btn btn--outline" to={`/categories/${product.category_slug}`}>
                  <span>سایر محصولات این دسته</span>
                  <span className="btn__icon">
                    <ArrowLeft size={16} aria-hidden="true" />
                  </span>
                </Link>
              </div>

              <p className="detail__note">
                <Info size={16} aria-hidden="true" />
                قیمت نهایی به ابعاد، نوع شیشه، متریال بدنه و نورپردازی بستگی دارد؛ همین‌جا درخواست خود را ثبت کنید تا
                برآورد متناسب با پروژه اعلام شود.
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section section--mid">
          <div className="container">
            <div className="shop__toolbar">
              <h2 style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.7rem)' }}>محصولات مرتبط</h2>
              <Link className="link-arrow" to="/products">
                <span>همه محصولات</span>
                <ArrowLeft size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="shop__grid">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 60}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
