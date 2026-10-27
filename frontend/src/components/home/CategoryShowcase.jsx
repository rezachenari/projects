import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import CategoryCard from '../cards/CategoryCard';

export default function CategoryShowcase({ categories, loading }) {
  return (
    <section className="section section--dark" aria-labelledby="categories-title">
      <div className="container">
        <SectionHeading
          eyebrow="دسته‌بندی محصولات و خدمات"
          title={<span id="categories-title">برای هر گالری، یک ویترین متفاوت</span>}
          lead="از مانکن‌های ظریف نمایش طلا تا ویترین‌های سفارشی؛ راهکار مناسب فضای خود را پیدا کنید."
          action={
            <Link className="link-arrow" to="/products">
              <span>مشاهده همه محصولات</span>
              <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        {loading ? (
          <div className="state-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="skeleton" key={index} style={{ minHeight: 420 }} />
            ))}
          </div>
        ) : (
          <div className="categories__grid">
            {categories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 60}>
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
