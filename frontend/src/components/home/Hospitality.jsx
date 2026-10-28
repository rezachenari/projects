import { Coffee, HandPlatter, Users } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ScrollVideo from '../ui/ScrollVideo';

const FEATURES = [
  {
    icon: Users,
    title: 'میزهای خانوادگی',
    text: 'بخش‌های جدا برای جمع‌های خانوادگی و میزهای کاری، با فاصله‌ی کافی و آرامش کامل.',
  },
  {
    icon: HandPlatter,
    title: 'سرو در لحظه',
    text: 'هر سیخ بعد از سفارش روی زغال می‌رود و مستقیم از گریل به میز شما می‌رسد.',
  },
  {
    icon: Coffee,
    title: 'چای و دسر مهمان‌نوازی',
    text: 'پایان غذا با چای زعفرانی و دسر خانگی؛ رسم قدیمی خانه‌های ایرانی.',
  },
];

export default function Hospitality() {
  return (
    <section className="section section--mid hospitality" id="experience" aria-labelledby="hospitality-title">
      <div className="container hospitality__grid">
        <Reveal className="hospitality__body">
          <span className="eyebrow">مهمان‌نوازی ایرانی</span>
          <h2 id="hospitality-title">اینجا فقط غذا سرو نمی‌شود</h2>
          <p className="lead">
            از لحظه‌ای که در را باز می‌کنید، کسی هست که میز را نشان بدهد، نان را تازه نگه دارد و بداند
            چای شما را چه‌وقت بیاورد. مستر کباب همان خانه‌ی قدیمی است، فقط با یک زغال‌دان بزرگ‌تر.
          </p>

          <ul className="feature-list">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li className="feature" key={feature.title}>
                  <span className="feature__icon" aria-hidden="true">
                    <Icon size={17} />
                  </span>
                  <div>
                    <h3 className="feature__title">{feature.title}</h3>
                    <p className="feature__text">{feature.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal className="hospitality__media" delay={90}>
          <ScrollVideo
            variant="panel"
            src="/videos/persian-hospitality.mp4"
            poster="/images/hospitality.webp"
            veil="soft"
          />
          <span className="media-panel__frame" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}
