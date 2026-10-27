import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function ArticleCard({ article }) {
  return (
    <article className="card article-card">
      <div className="card__media">
        <img
          src={article.image_url}
          alt={article.image_alt || article.title}
          loading="lazy"
          decoding="async"
          width="720"
          height="450"
        />
      </div>
      <div className="card__body">
        <span className="card__meta article-card__date">{formatDate(article.published_at)}</span>
        <h3 className="card__title">{article.title}</h3>
        <p className="card__desc">{article.excerpt}</p>
        <div className="card__foot">
          <span className="link-arrow">
            <span>مطالعه مقاله</span>
            <ArrowLeft size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
      <Link className="card__link" to={`/articles/${article.slug}`} aria-label={`${article.title} — مطالعه مقاله`} />
    </article>
  );
}
