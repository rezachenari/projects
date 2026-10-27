import { Quote, Info } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const QUOTES = [
  {
    text: 'برای بازسازی گالری، بیش از هر چیز نگران هماهنگی طرح با فضای موجود بودم. مسیر کار از بررسی ابعاد تا انتخاب متریال روشن بود و نتیجه، همان تصویری شد که در جلسه اول درباره‌اش حرف زدیم.',
    name: 'نمونه نظر — گالری طلا',
    meta: 'طراحی و اجرای دکور · تهران',
    initial: 'گ',
  },
  {
    text: 'ویترین دیواری که سفارش دادیم دقیقاً اندازه فضای ما ساخته شد؛ نه بیشتر، نه کمتر. نکته‌ای که برایم مهم بود، توجه به نورپردازی بود تا رنگ طلاها درست دیده شود.',
    name: 'نمونه نظر — طلافروشی',
    meta: 'ویترین دیواری سفارشی · اصفهان',
    initial: 'ط',
  },
  {
    text: 'پیش از ثبت سفارش، گزینه‌های متریال و محدودیت‌های بودجه را با هم بررسی کردیم. همین شفافیت باعث شد با اطمینان تصمیم بگیریم.',
    name: 'نمونه نظر — گالری جواهر',
    meta: 'مانکن و استند نمایش · شیراز',
    initial: 'ج',
  },
];

export default function Testimonials() {
  return (
    <section className="section testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading
          eyebrow="نظرات مشتریان"
          title={<span id="testimonials-title">اعتمادی که در جزئیات دیده می‌شود</span>}
          lead="تجربه همکاری، از انتخاب طرح تا تحویل سفارش"
          align="center"
        />

        <div className="testimonials__grid">
          {QUOTES.map((quote, index) => (
            <Reveal as="article" className="quote-card" key={quote.meta} delay={index * 80}>
              <Quote className="quote-card__mark" size={26} strokeWidth={1.2} aria-hidden="true" />
              <span className="badge" style={{ alignSelf: 'flex-start', color: '#8a6a34', borderColor: 'rgba(156,113,58,0.4)', background: 'rgba(156,113,58,0.08)' }}>
                نمونه نمایشی
              </span>
              <p className="quote-card__text">{quote.text}</p>
              <div className="quote-card__foot">
                <span className="quote-card__avatar" aria-hidden="true">
                  {quote.initial}
                </span>
                <div>
                  <div className="quote-card__name">{quote.name}</div>
                  <div className="quote-card__meta">{quote.meta}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="testimonials__note">
          <Info size={15} aria-hidden="true" />
          متن‌های بالا نمونه نمایشی ساختار این بخش هستند و به‌عنوان نظر واقعی مشتری منتشر نشده‌اند.
        </p>
      </div>
    </section>
  );
}
