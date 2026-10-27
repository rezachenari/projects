import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Gem, Handshake, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { useDocumentMeta } from '../lib/utils';

const VALUES = [
  { Icon: Compass, title: 'طراحی معماری‌محور', desc: 'ویترین بخشی از معماری داخلی فروشگاه است، نه یک قلم جدا از دکور.' },
  { Icon: Ruler, title: 'دقت در ابعاد', desc: 'هر طرح با اندازه‌های واقعی فضا تنظیم می‌شود تا نصب بدون اصلاح ناگهانی انجام شود.' },
  { Icon: Gem, title: 'انتخاب متریال با هدف', desc: 'متریال بر اساس کاربری، نور و دوام انتخاب می‌شود؛ نه فقط ظاهر اولیه.' },
  { Icon: Handshake, title: 'گفت‌وگوی شفاف', desc: 'دامنه کار، محدودیت‌ها و مرحله‌های اجرا پیش از شروع روشن می‌شود.' },
  { Icon: ShieldCheck, title: 'واقع‌بینی در وعده‌ها', desc: 'زمان‌بندی و هزینه بر اساس دامنه واقعی پروژه اعلام می‌شود.' },
  { Icon: Sparkles, title: 'توجه به جزئیات نهایی', desc: 'درزها، لبه‌ها و محل نور همان چیزی است که کیفیت اجرا را نشان می‌دهد.' },
];

export default function About() {
  useDocumentMeta({
    title: 'درباره ما | پارس ویترین',
    description:
      'مجموعه‌ای تخصصی در طراحی، ساخت و اجرای ویترین طلافروشی، مانکن و استند نمایش طلا با تمرکز بر متریال، نورپردازی و جزئیات اجرایی.',
  });

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'درباره ما' }]} />
          <h1>درباره پارس ویترین</h1>
          <p className="lead">
            ما روی یک نکته ساده تمرکز می‌کنیم: ویترین باید طلا را بهتر نشان دهد و هویت گالری را در نگاه اول منتقل
            کند. بقیه تصمیم‌ها — ابعاد، متریال، نور و جزئیات — از همین اصل بیرون می‌آید.
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="split">
            <Reveal className="split__body">
              <span className="eyebrow">رویکرد ما</span>
              <h2 style={{ marginTop: '0.9rem', marginBottom: '1rem' }}>از فضای واقعی شروع می‌کنیم، نه از کاتالوگ</h2>
              <p className="lead">
                هر فروشگاه محدودیت‌های خودش را دارد: عرض دیوار، مسیر رفت‌وآمد مشتری، نور طبیعی و سبک دکور موجود. طرح
                ویترین وقتی درست کار می‌کند که این شرایط را در نظر بگیرد.
              </p>
              <p className="lead" style={{ marginTop: '1rem' }}>
                به همین دلیل، مسیر همکاری ما با بررسی فضا و نیاز شما آغاز می‌شود؛ سپس گزینه‌های قابل اجرا، متریال و
                برآورد هزینه ارائه می‌شود. اگر گزینه‌ای به فضای شما نخورد، همان‌جا گفته می‌شود.
              </p>
              <div className="stat-row">
                <div className="stat">
                  <span className="stat__value">طراحی اختصاصی</span>
                  <span className="stat__label">بر اساس ابعاد فضا</span>
                </div>
                <div className="stat">
                  <span className="stat__value">ساخت سفارشی</span>
                  <span className="stat__label">متریال و ابعاد انتخابی</span>
                </div>
                <div className="stat">
                  <span className="stat__value">اجرای هماهنگ</span>
                  <span className="stat__label">از ویترین تا دکور</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="split__media" delay={80}>
              <img
                src="/images/workshop-detail.webp"
                alt="کار ساخت و تنظیم جزئیات قاب ویترین در کارگاه"
                loading="lazy"
                decoding="async"
                width="900"
                height="765"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <SectionHeading
            eyebrow="ارزش‌های کاری"
            title="چه چیزی در کار ما ثابت می‌ماند"
            lead="این اصول در همه پروژه‌ها، مستقل از اندازه و بودجه، رعایت می‌شود."
          />
          <div className="why__list" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
            {VALUES.map(({ Icon, title, desc }, index) => (
              <Reveal className="why__item" key={title} delay={index * 50}>
                <div className="why__item-head">
                  <Icon size={19} strokeWidth={1.3} aria-hidden="true" />
                  <h3 className="why__item-title">{title}</h3>
                </div>
                <p className="why__item-desc">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band__text">
              <span className="cta-band__title">درباره پروژه خودتان صحبت کنیم</span>
              <span className="cta-band__desc">
                ابعاد فضا و سبک مورد نظرتان را بگویید تا گزینه‌های اجرایی متناسب با فروشگاه شما بررسی شود.
              </span>
            </div>
            <Link className="btn btn--gold" to="/consultation">
              <span>دریافت مشاوره طراحی</span>
              <span className="btn__icon">
                <ArrowLeft size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
