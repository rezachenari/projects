import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import ArticleCard from '../cards/ArticleCard';

export default function ArticlesPreview({ articles, loading }) {
  return (
    <section className="section articles-preview" aria-labelledby="articles-title">
      <div className="container">
        <SectionHeading
          eyebrow="مقالات و راهنمای خرید"
          title={<span id="articles-title">راهنمای انتخاب و طراحی ویترین طلا</span>}
          lead="پیش از انتخاب ویترین، با نکاتی آشنا شوید که به تصمیم‌گیری بهتر شما کمک می‌کنند."
          action={
            <Link className="link-arrow" to="/articles">
              <span>همه مقالات</span>
              <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        {loading ? (
          <div className="featured__grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="skeleton" key={index} style={{ minHeight: 340 }} />
            ))}
          </div>
        ) : (
          <div className="articles-preview__grid">
            {articles.map((article, index) => (
              <Reveal key={article.slug} delay={(index % 4) * 60}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
