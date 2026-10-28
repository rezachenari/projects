import { Quote } from 'lucide-react';
import Reveal from '../ui/Reveal';
import Stars from '../ui/Stars';
import ScrollVideoSection from '../cinema/ScrollVideoSection';

/** World 07 — customer experiences. Restrained footage so the cards can be read. */
export default function Reviews({ testimonials = [], ready = false }) {
  const items = testimonials.slice(0, 3);

  return (
    <ScrollVideoSection
      id="reviews"
      index={7}
      name="تجربه مهمانان"
      src="/videos/testimonials-background.mp4"
      poster="/images/testimonials.webp"
      travel="160vh"
      veil="reading"
      transition="veil"
      focus="50% 50%"
      mobileFocus="50% 46%"
      eyebrow="تجربه مشتریان"
      title="تجربه‌ای که ارزش تعریف کردن دارد"
      text="نظر مشتریان به ما کمک می‌کند تجربه‌ای بهتر و دلنشین‌تر بسازیم."
    >
      <div className="container world-block">
        {!ready ? (
          <div className="reviews__grid" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="review-card review-card--skeleton" key={index} />
            ))}
          </div>
        ) : items.length ? (
          <div className="reviews__grid">
            {items.map((item, index) => (
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
            ))}
          </div>
        ) : (
          <p className="reviews__empty">
            هنوز تجربه‌ای برای انتشار ثبت نشده است. اولین نظر مهمان‌ها همین‌جا منتشر می‌شود.
          </p>
        )}
      </div>
    </ScrollVideoSection>
  );
}
