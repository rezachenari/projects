import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import JsonLd from '../components/ui/JsonLd';
import { formatDate, toFaDigits, useApi, useDocumentMeta } from '../lib/utils';
import NotFound from './NotFound';

function Block({ block }) {
  if (block.type === 'h2') return <h2>{block.text}</h2>;
  if (block.type === 'h3') return <h3>{block.text}</h3>;
  if (block.type === 'quote') return <blockquote>{block.text}</blockquote>;
  if (block.type === 'ul') {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data, loading, error, retry } = useApi(`/articles/${encodeURIComponent(slug)}`);
  const article = data?.article || null;

  useDocumentMeta({
    title: article ? `${article.title} | پارس ویترین` : 'مقاله | پارس ویترین',
    description: article?.excerpt || 'مقاله‌ای از پارس ویترین درباره طراحی ویترین طلا.',
  });

  if (loading) {
    return (
      <section className="article-page">
        <div className="container">
          <div className="skeleton" style={{ minHeight: 480 }} />
        </div>
      </section>
    );
  }

  if (error?.status === 404) return <NotFound />;

  if (error || !article) {
    return (
      <section className="article-page">
        <div className="container">
          <div className="empty-state">
            <strong>مقاله بارگذاری نشد.</strong>
            <p>{error?.message}</p>
            <button className="btn btn--outline" type="button" onClick={retry}>
              تلاش دوباره
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.published_at,
          image: [article.image_url],
          author: { '@type': 'Organization', name: 'پارس ویترین' },
        }}
      />

      <article className="article-page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'مقالات', to: '/articles' }, { label: article.title }]} />

          <header className="article-page__head">
            <h1>{article.title}</h1>
            <div className="article-page__meta">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CalendarDays size={14} aria-hidden="true" />
                {formatDate(article.published_at)}
              </span>
              {article.reading_minutes ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} aria-hidden="true" />
                  {toFaDigits(article.reading_minutes)} دقیقه مطالعه
                </span>
              ) : null}
            </div>
            <p className="lead">{article.excerpt}</p>
          </header>

          <figure className="article-page__cover">
            <img
              src={article.image_url}
              alt={article.image_alt || article.title}
              width="1400"
              height="612"
              decoding="async"
            />
          </figure>

          <div className="prose">
            {(article.body || []).map((block, index) => (
              <Block block={block} key={index} />
            ))}
          </div>

          <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)', maxWidth: '74ch' }}>
            <div className="cta-band">
              <div className="cta-band__text">
                <span className="cta-band__title">سؤالی درباره انتخاب ویترین دارید؟</span>
                <span className="cta-band__desc">
                  ابعاد فضا و سبک مورد نظرتان را بگویید تا راهنمایی متناسب با فروشگاه شما ارائه شود.
                </span>
              </div>
              <Link className="btn btn--gold" to="/consultation">
                <span>دریافت مشاوره</span>
                <span className="btn__icon">
                  <ArrowLeft size={16} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
