import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ScrollVideo from '../ui/ScrollVideo';

export default function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <ScrollVideo src="/videos/footer-closing.mp4" poster="/images/closing.webp" veil="deep" />
      <div className="container closing__inner">
        <Reveal className="closing__copy">
          <span className="eyebrow">تا دیدار بعد</span>
          <h2 id="closing-title">مستر کباب؛ جایی برای دوباره چشیدن</h2>
          <p className="lead">هر شب، از ساعت ۱۲ تا ۲۳:۳۰، زغال ما روشن است.</p>
          <div className="closing__actions">
            <Link className="btn btn--amber" to="/reservation">
              <span>رزرو میز امشب</span>
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn--outline" to="/menu">
              منوی کامل
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
