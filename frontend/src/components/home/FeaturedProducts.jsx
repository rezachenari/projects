import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import ProductCard from '../cards/ProductCard';

export default function FeaturedProducts({ products, loading }) {
  return (
    <section className="section section--dark" aria-labelledby="featured-title">
      <div className="container">
        <SectionHeading
          eyebrow="محصولات منتخب"
          title={<span id="featured-title">محصولات منتخب</span>}
          lead="انتخاب‌هایی برای نمایش شایسته‌تر طلا و جواهرات شما"
          action={
            <Link className="link-arrow" to="/products">
              <span>مشاهده همه محصولات</span>
              <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        {loading ? (
          <div className="featured__grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton" key={index} style={{ minHeight: 360 }} />
            ))}
          </div>
        ) : (
          <div className="featured__grid">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 3) * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
