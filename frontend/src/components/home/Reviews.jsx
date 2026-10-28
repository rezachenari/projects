import { Quote } from 'lucide-react';
import Reveal from '../ui/Reveal';
import Stars from '../ui/Stars';
import ScrollVideo from '../ui/ScrollVideo';

export default function Reviews({ testimonials = [] }) {
  const items = testimonials.slice(0, 3);

  return (
    <section className="section section--dark reviews" id="reviews" aria-labelledby="reviews-title">
      <ScrollVideo src="/videos/testimonials-background.mp4" poster="/images/testimonials.webp" veil="deep" />

      <div className="container">
        <Reveal className="section-head section-head--center reviews__head">
          <span className="eyebrow">از زبان مهمان‌ها</span>
          <h2 id="reviews-title">آنچه سر میزها شنیده می‌شود</h2>
        </Reveal>

        <div className="reviews__grid">
          {(items.length ? items : Array.from({ length: 3 }, () => null)).map((item, index) =>
            item ? (
              <Reveal className="review-card" key={item.id ?? item.name} delay={index * 80}>
                <span className="review-card__mark" aria-hidden="true">
                  <Quote size={18} />
                </span>
                <p className="review-card__quote">{item.quote}</p>
                <div className="review-card__person">
                  <span className="review-card__name">{item.name}</span>
                  <span className="review-card__role muted">{item.role}</span>
                </div>
                <Stars rating={item.rating} />
              </Reveal>
            ) : (
              <div className="review-card review-card--skeleton" key={`skeleton-${index}`} aria-hidden="true" />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
