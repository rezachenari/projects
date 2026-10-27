import Breadcrumbs from '../components/ui/Breadcrumbs';
import ArticleCard from '../components/cards/ArticleCard';
import Reveal from '../components/ui/Reveal';
import { useApi, useDocumentMeta } from '../lib/utils';

export default function Articles() {
  const { data, loading, error, retry } = useApi('/articles');
  const articles = data?.articles || [];

  useDocumentMeta({
    title: 'مقالات و راهنمای خرید ویترین طلا | پارس ویترین',
    description:
      'راهنمای انتخاب ویترین طلافروشی، نکات نورپردازی ویترین طلا، تفاوت مانکن و استند نمایش و ایده‌های دکوراسیون گالری مدرن.',
  });

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'مقالات' }]} />
          <h1>راهنمای انتخاب و طراحی ویترین طلا</h1>
          <p className="lead">
            پیش از انتخاب ویترین، با نکاتی آشنا شوید که به تصمیم‌گیری بهتر شما کمک می‌کنند؛ از ابعاد و نورپردازی تا
            تفاوت مانکن و استند نمایش.
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          {loading ? (
            <div className="shop__grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="skeleton" key={index} style={{ minHeight: 360 }} />
              ))}
            </div>
          ) : error ? (
            <div className="empty-state">
              <strong>فهرست مقالات بارگذاری نشد.</strong>
              <p>{error.message}</p>
              <button className="btn btn--outline" type="button" onClick={retry}>
                تلاش دوباره
              </button>
            </div>
          ) : (
            <div className="shop__grid">
              {articles.map((article, index) => (
                <Reveal key={article.slug} delay={(index % 3) * 60}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
