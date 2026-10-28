import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, Utensils } from 'lucide-react';
import ScrollVideoSection from '../cinema/ScrollVideoSection';
import { telHref } from '../../lib/site';

/** World 09 — the final impression. The copy holds while the film closes. */
export default function Closing({ settings }) {
  return (
    <ScrollVideoSection
      id="closing"
      index={9}
      name="پایان سفر"
      src="/videos/footer-closing.mp4"
      mobileSrc="/videos/footer-closing-mobile.mp4"
      poster="/images/closing.webp"
      travel="160vh"
      veil="deep"
      transition="dissolve"
      focus="50% 50%"
      mobileFocus="50% 46%"
      layout="stage"
      eyebrow="مستر کباب"
      title="یک طعم آشنا، برای لحظه‌هایی که تکرار می‌شوند"
      text="برای دیدن منو، آشنایی بیشتر با انتخاب‌ها یا ارتباط با مجموعه، از اینجا ادامه بده."
      actions={
        <>
          <Link className="btn btn--amber" to="/menu">
            <span className="btn__icon">
              <Utensils size={16} aria-hidden="true" />
            </span>
            <span>مشاهده منو</span>
          </Link>
          <a className="btn btn--outline" href={telHref(settings?.phone)}>
            <span className="btn__icon">
              <PhoneCall size={16} aria-hidden="true" />
            </span>
            <span>تماس با مستر کباب</span>
          </a>
          <Link className="btn btn--ghost" to="/reservation">
            <span>رزرو میز</span>
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </>
      }
      meta={
        <span className="world__hint">
          {settings?.hours} — {settings?.address}
        </span>
      }
    />
  );
}
