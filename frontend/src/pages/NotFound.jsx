import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <span className="eyebrow">خطای ۴۰۴</span>
        <h1>این میز وجود ندارد</h1>
        <p className="lead">صفحه‌ای که سراغش را گرفته‌اید پیدا نشد؛ شاید بهتر است سراغ منو برویم.</p>
        <div className="hero__actions">
          <Link className="btn btn--amber" to="/menu">
            منوی مستر کباب
          </Link>
          <Link className="btn btn--outline" to="/">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </section>
  );
}
