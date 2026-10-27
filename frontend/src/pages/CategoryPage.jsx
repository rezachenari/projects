import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/cards/ProductCard';
import Reveal from '../components/ui/Reveal';
import { useApi, useDocumentMeta } from '../lib/utils';
import { useSite } from '../lib/site-context';
import NotFound from './NotFound';

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, loading: siteLoading } = useSite();
  const category = categories.find((item) => item.slug === slug);
  const { data, loading, error, retry } = useApi(`/products?category=${encodeURIComponent(slug)}`);

  useDocumentMeta({
    title: category ? `${category.title} | پارس ویترین` : 'دسته‌بندی محصولات | پارس ویترین',
    description: category?.short_description || 'دسته‌بندی محصولات ویترین و نمایش طلا.',
  });

  if (!siteLoading && !category) return <NotFound />;

  const products = data?.products || [];

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'محصولات', to: '/products' }, { label: category?.title || '…' }]} />
          <h1>{category?.title || 'در حال بارگذاری…'}</h1>
          {category ? <p className="lead">{category.long_description || category.short_description}</p> : null}
        </div>
      </section>

      <section className="shop">
        <div className="container">
          <div className="shop__toolbar">
            <span className="shop__count">{loading ? 'در حال بارگذاری…' : `${products.length} محصول در این دسته`}</span>
            <Link className="link-arrow" to="/products">
              <span>همه محصولات</span>
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="shop__grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="skeleton" key={index} style={{ minHeight: 360 }} />
              ))}
            </div>
          ) : error ? (
            <div className="empty-state">
              <strong>فهرست محصولات بارگذاری نشد.</strong>
              <p>{error.message}</p>
              <button className="btn btn--outline" type="button" onClick={retry}>
                تلاش دوباره
              </button>
            </div>
          ) : products.length ? (
            <div className="shop__grid">
              {products.map((product, index) => (
                <Reveal key={product.slug} delay={(index % 3) * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>هنوز محصولی برای این دسته ثبت نشده است.</strong>
              <p>برای این دسته می‌توانید سفارش ساخت اختصاصی ثبت کنید.</p>
              <Link className="btn btn--gold" to="/consultation">
                درخواست ساخت اختصاصی
              </Link>
            </div>
          )}

          <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="cta-band">
              <div className="cta-band__text">
                <span className="cta-band__title">ابعاد فضای شما با محصولات استاندارد هم‌خوان نیست؟</span>
                <span className="cta-band__desc">
                  ابعاد و سبک مورد نظرتان را بگویید تا گزینه سفارشی برای همان فضا طراحی شود.
                </span>
              </div>
              <Link className="btn btn--gold" to="/consultation">
                درخواست ساخت اختصاصی
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
