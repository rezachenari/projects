import { Link, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/cards/ProductCard';
import Reveal from '../components/ui/Reveal';
import { useApi, useDocumentMeta } from '../lib/utils';
import { useSite } from '../lib/site-context';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || '';
  const { categories } = useSite();

  const query = new URLSearchParams();
  if (activeCategory) query.set('category', activeCategory);
  if (q) query.set('q', q);
  const apiPath = `/products${query.toString() ? `?${query.toString()}` : ''}`;
  const { data, loading, error, retry } = useApi(apiPath);

  useDocumentMeta({
    title: 'محصولات | ویترین، مانکن و استند نمایش طلا',
    description:
      'ویترین طلافروشی، مانکن و استند نمایش طلا، ویترین رومیزی و تجهیزات نمایش؛ محصولات قابل سفارشی‌سازی برای گالری‌های طلا و جواهر.',
  });

  const products = data?.products || [];
  const total = data?.total ?? products.length;

  const setCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    setSearchParams(next);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next);
  };

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'محصولات' }]} />
          <h1>ویترین، مانکن و استند نمایش طلا</h1>
          <p className="lead">
            هر محصول با امکان تعریف ابعاد، متریال و جزئیات اجرایی ارائه می‌شود. اگر اندازه یا سبک مورد نظر شما در
            فهرست نیست، امکان ساخت سفارشی وجود دارد.
          </p>
        </div>
      </section>

      <section className="shop">
        <div className="container">
          <div className="shop__layout">
            <aside className="filters" aria-label="فیلتر دسته‌بندی">
              <div className="filters__group">
                <span className="filters__title">دسته‌بندی</span>
                <button
                  type="button"
                  className={`filters__link ${!activeCategory ? 'is-active' : ''}`}
                  onClick={() => setCategory('')}
                >
                  <span>همه محصولات</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    className={`filters__link ${activeCategory === category.slug ? 'is-active' : ''}`}
                    onClick={() => setCategory(category.slug)}
                  >
                    <span>{category.title}</span>
                    <span className="filters__count">{category.product_count ?? ''}</span>
                  </button>
                ))}
              </div>

              <div className="filters__group">
                <span className="filters__title">راهنمای انتخاب</span>
                <p className="field__hint" style={{ lineHeight: 1.9 }}>
                  برای انتخاب دقیق‌تر، ابعاد فضای فروشگاه و سبک دکور را در نظر بگیرید. در صورت نیاز، مشاوره پیش از
                  سفارش در دسترس است.
                </p>
                <Link className="link-arrow" to="/consultation">
                  <span>درخواست مشاوره</span>
                </Link>
              </div>
            </aside>

            <div>
              <div className="shop__toolbar">
                <span className="shop__count">{loading ? 'در حال بارگذاری…' : `${total} محصول`}</span>
                {q ? (
                  <span className="search-chip">
                    <Search size={13} aria-hidden="true" />
                    نتیجه جست‌وجو: {q}
                    <button type="button" onClick={clearSearch} aria-label="حذف جست‌وجو" style={{ display: 'inline-flex' }}>
                      <X size={14} aria-hidden="true" />
                    </button>
                  </span>
                ) : null}
              </div>

              {loading ? (
                <div className="shop__grid">
                  {Array.from({ length: 6 }).map((_, index) => (
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
                  <strong>محصولی با این مشخصات پیدا نشد.</strong>
                  <p>می‌توانید دسته‌بندی دیگری را انتخاب کنید یا درخواست ساخت سفارشی ثبت کنید.</p>
                  <Link className="btn btn--gold" to="/consultation">
                    درخواست ساخت اختصاصی
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
