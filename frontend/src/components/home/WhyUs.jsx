import { Lightbulb, Layers, Gem, Armchair, PenTool, ClipboardCheck } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const REASONS = [
  { Icon: PenTool, title: 'طراحی متناسب با فضای فروشگاه', desc: 'طرح بر اساس ابعاد، مسیر حرکت و سبک گالری شما شکل می‌گیرد.' },
  { Icon: Layers, title: 'امکان انتخاب ابعاد و جزئیات سفارشی', desc: 'طول، عمق، تعداد طبقات و نوع بازشو قابل تعریف است.' },
  { Icon: Lightbulb, title: 'توجه به نورپردازی و زاویه دید', desc: 'چیدمان نور طوری انتخاب می‌شود که درخشش طلا دیده شود.' },
  { Icon: Gem, title: 'انتخاب متریال متناسب با پروژه', desc: 'شیشه، فلز و پوشش‌ها بر اساس کاربری و بودجه پیشنهاد می‌شوند.' },
  { Icon: Armchair, title: 'هماهنگی در طراحی و اجرای نهایی', desc: 'جزئیات دکور، ویترین و نور با هم هماهنگ می‌شوند.' },
  { Icon: ClipboardCheck, title: 'امکان مشاوره پیش از ثبت سفارش', desc: 'قبل از تصمیم نهایی، گزینه‌ها و محدودیت‌ها را بررسی می‌کنیم.' },
];

export default function WhyUs() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <div className="why__layout">
          <Reveal className="why__media">
            <img
              src="/images/craft-detail.webp"
              alt="جزئیات کار ساخت قاب فلزی طلایی‌رنگ ویترین در کارگاه"
              loading="lazy"
              decoding="async"
              width="900"
              height="1000"
            />
            <span className="why__caption">متریال واقعی، اجرای دقیق، جزئیات کنترل‌شده</span>
          </Reveal>

          <div className="why__content">
            <SectionHeading
              eyebrow="چرا ما را انتخاب کنید؟"
              title={<span id="why-title">جزئیاتی که تفاوت را می‌سازند</span>}
              lead="یک ویترین حرفه‌ای فقط محل نمایش محصول نیست؛ بخشی از هویت برند شما و اولین برداشت مشتری از کیفیت مجموعه شماست."
            />

            <div className="why__list">
              {REASONS.map(({ Icon, title, desc }, index) => (
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
        </div>
      </div>
    </section>
  );
}
