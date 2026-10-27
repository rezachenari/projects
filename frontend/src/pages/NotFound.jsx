import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDocumentMeta } from '../lib/utils';

export default function NotFound() {
  useDocumentMeta({
    title: 'صفحه پیدا نشد | پارس ویترین',
    description: 'صفحه مورد نظر پیدا نشد.',
  });

  return (
    <section className="section section--dark" style={{ minHeight: '60vh', display: 'grid', alignItems: 'center' }}>
      <div className="container" style={{ display: 'grid', gap: '1rem', justifyItems: 'center', textAlign: 'center' }}>
        <span className="eyebrow">خطای ۴۰۴</span>
        <h1>این صفحه پیدا نشد</h1>
        <p className="lead" style={{ textAlign: 'center' }}>
          ممکن است نشانی تغییر کرده باشد یا این صفحه حذف شده باشد. از مسیرهای زیر می‌توانید ادامه دهید.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link className="btn btn--gold" to="/">
            <span>بازگشت به صفحه اصلی</span>
            <span className="btn__icon">
              <ArrowLeft size={16} aria-hidden="true" />
            </span>
          </Link>
          <Link className="btn btn--outline" to="/products">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}
