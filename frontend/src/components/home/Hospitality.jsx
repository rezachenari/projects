import { Coffee, HandPlatter, Users } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ScrollVideoSection from '../cinema/ScrollVideoSection';

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

/** World 06 — the spirit of Persian hospitality: warmer, more intimate. */
export default function Hospitality() {
  return (
    <ScrollVideoSection
      id="experience"
      index={6}
      name="روح مهمان‌نوازی"
      src="/videos/persian-hospitality.mp4"
      mobileSrc="/videos/persian-hospitality-mobile.mp4"
      poster="/images/hospitality.webp"
      travel="190vh"
      veil="soft"
      transition="warm"
      focus="50% 45%"
      mobileFocus="50% 42%"
      title="میز ایرانی، بهانه‌ای برای کنار هم بودن"
      text="بعضی طعم‌ها فقط برای سیر شدن نیستند؛ برای ساختن لحظه‌هایی‌اند که دوست داریم دوباره تکرار شوند."
    >
      <div className="container world-block">
        <Reveal>
          <p className="lead hospitality__lead">
            از لحظه‌ای که در را باز می‌کنید، کسی هست که میز را نشان بدهد، نان را تازه نگه دارد و بداند چای
            شما را چه‌وقت بیاورد. مستر کباب همان خانه‌ی قدیمی است، فقط با یک زغال‌دان بزرگ‌تر.
          </p>
        </Reveal>

        <ul className="feature-list feature-list--grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal as="li" className="feature" key={feature.title} delay={index * 70}>
                <span className="feature__icon" aria-hidden="true">
                  <Icon size={17} />
                </span>
                <div>
                  <h4 className="feature__title">{feature.title}</h4>
                  <p className="feature__text">{feature.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </ScrollVideoSection>
  );
}
