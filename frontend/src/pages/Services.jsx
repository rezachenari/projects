import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Lightbulb, PencilRuler, Ruler, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Reveal from '../components/ui/Reveal';
import Process from '../components/home/Process';
import { useDocumentMeta } from '../lib/utils';

const SERVICES = [
  {
    id: 'design',
    eyebrow: 'طراحی ویترین',
    title: 'طرحی که با فضای گالری شما هم‌خوان باشد',
    desc: 'طراحی ویترین از شناخت فضا شروع می‌شود: ابعاد، مسیر حرکت مشتری، نور موجود و سبک دکور. سپس چیدمان طبقات، بازشوها و محل نورپردازی تعریف می‌شود.',
    points: [
      'بررسی ابعاد و محدودیت‌های فضای فروشگاه',
      'تعریف چیدمان طبقات و زاویه دید محصولات',
      'هماهنگی سبک ویترین با دکور و هویت برند',
    ],
    image: '/images/category-showcase.webp',
    alt: 'ویترین شیشه‌ای طلافروشی با نورپردازی گرم',
    Icon: PencilRuler,
  },
  {
    id: 'build',
    eyebrow: 'ساخت سفارشی',
    title: 'ساخت بر اساس ابعاد و متریال انتخابی شما',
    desc: 'ساخت ویترین و استند بر اساس نقشه تأییدشده انجام می‌شود؛ از انتخاب پروفیل و شیشه تا رنگ پوشش و نوع یراق.',
    points: [
      'امکان تعریف طول، عمق و تعداد طبقات',
      'انتخاب متریال بدنه، شیشه و پوشش',
      'کنترل جزئیات اجرایی پیش از تحویل',
    ],
    image: '/images/workshop-detail.webp',
    alt: 'جزئیات ساخت قاب فلزی ویترین در کارگاه',
    Icon: Layers,
  },
  {
    id: 'decor',
    eyebrow: 'دکوراسیون طلافروشی',
    title: 'دکوری که ویترین را تنها نمی‌گذارد',
    desc: 'ویترین بخشی از دکوراسیون است. هماهنگی رنگ، متریال و نور میان ویترین، پیشخوان و دیوارها، تصویر نهایی فروشگاه را یکپارچه می‌کند.',
    points: [
      'هماهنگی ویترین با پیشخوان و دیوارها',
      'انتخاب پالت رنگ و متریال متناسب با برند',
      'توجه به مسیر حرکت و نقاط تمرکز مشتری',
    ],
    image: '/images/boutique-interior.webp',
    alt: 'نمای داخلی گالری طلا با دکور هماهنگ',
    Icon: Sparkles,
  },
  {
    id: 'lighting',
    eyebrow: 'نورپردازی ویترین',
    title: 'نوری که درخشش طلا را نشان می‌دهد',
    desc: 'نور نامناسب، رنگ و درخشش طلا را تغییر می‌دهد. انتخاب دمای رنگ، زاویه تابش و شدت نور بر اساس نوع محصول انجام می‌شود.',
    points: [
      'انتخاب دمای رنگ مناسب نمایش طلا',
      'جلوگیری از بازتاب و خیرگی روی شیشه',
      'تعریف نور پس‌زمینه و نور موضعی',
    ],
    image: '/images/display-lighting.webp',
    alt: 'نورپردازی گرم روی ویترین و زیورآلات',
    Icon: Lightbulb,
  },
  {
    id: 'consult',
    eyebrow: 'مشاوره خرید',
    title: 'پیش از خرید، گزینه‌ها را با هم مرور کنیم',
    desc: 'اگر بین چند گزینه مردد هستید، با بررسی فضای فروشگاه و بودجه، گزینه‌های واقع‌بینانه‌تری پیشنهاد می‌شود.',
    points: [
      'بررسی نیاز و اولویت‌های فروشگاه',
      'مقایسه متریال و تأثیر آن بر ظاهر نهایی',
      'برآورد هزینه متناسب با دامنه پروژه',
    ],
    image: '/images/consultation-desk.webp',
    alt: 'جلسه مشاوره طراحی ویترین',
    Icon: Ruler,
  },
];

export default function Services() {
  useDocumentMeta({
    title: 'خدمات طراحی و ساخت اختصاصی ویترین | پارس ویترین',
    description:
      'طراحی ویترین، ساخت سفارشی، دکوراسیون طلافروشی، نورپردازی ویترین و مشاوره خرید؛ خدمات تخصصی برای گالری‌های طلا و جواهر.',
  });

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'خدمات' }]} />
          <h1>خدمات طراحی و ساخت اختصاصی</h1>
          <p className="lead">
            از طراحی ویترین تا اجرای کامل دکوراسیون؛ هر خدمت با بررسی فضای واقعی فروشگاه شما شروع می‌شود و با اجرای
            هماهنگ جزئیات به پایان می‌رسد.
          </p>
        </div>
      </section>

      {SERVICES.map(({ id, eyebrow, title, desc, points, image, alt, Icon }, index) => {
        const isDark = index % 2 === 0;
        return (
          <section
            key={id}
            id={id}
            className={`section ${isDark ? 'section--dark' : 'section--light'}`}
            style={{ scrollMarginTop: '96px' }}
            aria-labelledby={`${id}-title`}
          >
            <div className="container">
              <div className={`split ${index % 2 === 1 ? 'split--flip' : ''}`}>
                <Reveal className="split__body">
                  <span className="eyebrow">{eyebrow}</span>
                  <h2 id={`${id}-title`} style={{ marginTop: '0.9rem', marginBottom: '1rem' }}>
                    {title}
                  </h2>
                  <p className="lead">{desc}</p>
                  <div className="feature-list" style={{ marginTop: '1.5rem' }}>
                    {points.map((point) => (
                      <div className="feature-list__item" key={point}>
                        <span className="feature-list__icon" aria-hidden="true">
                          <Icon size={18} strokeWidth={1.4} />
                        </span>
                        <p className="feature-list__desc" style={{ alignSelf: 'center' }}>
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link className="btn btn--outline" to="/consultation" style={{ marginTop: '1.6rem' }}>
                    <span>درخواست مشاوره برای این خدمت</span>
                    <span className="btn__icon">
                      <ArrowLeft size={16} aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>

                <Reveal className="split__media" delay={80}>
                  <img src={image} alt={alt} loading="lazy" decoding="async" width="900" height="765" />
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <Process />

      <section className="section section--light">
        <div className="container">
          <div className="cta-band" style={{ background: '#fff', borderColor: 'rgba(8,10,13,0.1)' }}>
            <div className="cta-band__text">
              <span className="cta-band__title" style={{ color: 'var(--ink-900)' }}>
                نمی‌دانید از کجا شروع کنید؟
              </span>
              <span className="cta-band__desc">
                فقط ابعاد تقریبی فضا و سبک مورد نظرتان را بگویید؛ بقیه مسیر را با هم مرور می‌کنیم.
              </span>
            </div>
            <Link className="btn btn--gold" to="/consultation">
              درخواست مشاوره اختصاصی
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
