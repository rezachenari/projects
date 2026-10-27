import { Gem, Ruler, Lightbulb, Handshake } from 'lucide-react';
import Reveal from '../ui/Reveal';

const ITEMS = [
  {
    Icon: Gem,
    title: 'طراحی متناسب با هویت برند',
    desc: 'هر فضا، یک امضای اختصاصی',
  },
  {
    Icon: Ruler,
    title: 'ساخت سفارشی و دقیق',
    desc: 'جزئیات حساب‌شده، اجرای تمیز',
  },
  {
    Icon: Lightbulb,
    title: 'متریال و نورپردازی حرفه‌ای',
    desc: 'نمایش بهتر زیبایی و درخشش طلا',
  },
  {
    Icon: Handshake,
    title: 'همراهی از ایده تا اجرا',
    desc: 'از طرح اولیه تا نصب نهایی',
  },
];

export default function Advantages() {
  return (
    <section className="advantages" aria-label="مزیت‌های کلیدی">
      <div className="container">
        <div className="advantages__grid">
          {ITEMS.map(({ Icon, title, desc }, index) => (
            <Reveal className="advantages__item" key={title} delay={index * 70}>
              <Icon className="advantages__icon" size={26} strokeWidth={1.3} aria-hidden="true" />
              <h2 className="advantages__title">{title}</h2>
              <p className="advantages__desc">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
