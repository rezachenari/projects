import Reveal from '../ui/Reveal';
import LeadForm from '../forms/LeadForm';

export default function FinalCta() {
  return (
    <section className="section lead-section" aria-labelledby="lead-title">
      <div className="container">
        <div className="lead-section__layout">
          <div className="lead-section__form">
            <Reveal className="lead-section__form-head">
              <span className="eyebrow">درخواست سفارش اختصاصی</span>
              <h2 id="lead-title">برای طلافروشی شما، چه ویترینی طراحی کنیم؟</h2>
              <p className="lead">
                فضای فروشگاه و سلیقه شما را بشناسیم تا برای طراحی و ساخت یک ویترین اختصاصی، راهکار مناسب‌تری پیشنهاد
                دهیم.
              </p>
            </Reveal>
            <LeadForm />
          </div>

          <Reveal className="lead-section__media" delay={80}>
            <img
              src="/images/boutique-interior.webp"
              alt="نمای داخلی یک گالری طلا با ویترین‌های شیشه‌ای و نورپردازی گرم"
              loading="lazy"
              decoding="async"
              width="1200"
              height="900"
            />
            <p className="lead-section__media-note">
              اگر ابعاد دقیق فضا را نمی‌دانید، همین‌جا توضیح دهید؛ در مرحله بررسی، ابعاد و شرایط نصب را با هم مرور
              می‌کنیم.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
