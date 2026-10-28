import Reveal from '../ui/Reveal';
import ScrollVideoSection from '../cinema/ScrollVideoSection';

const STATS = [
  { value: '۲۰+', label: 'سال روی زغال' },
  { value: '۳۵۰', label: 'سیخ زغالی در روز' },
  { value: '۹٬۰۰۰', label: 'مهمان در ماه' },
];

/** World 03 — the world of hospitality: from the food into the room itself. */
export default function Story() {
  return (
    <ScrollVideoSection
      id="story"
      index={3}
      name="اتاق و آتش"
      src="/videos/restaurant-interior.mp4"
      mobileSrc="/videos/restaurant-interior-mobile.mp4"
      poster="/images/interior.webp"
      travel="190vh"
      veil="soft"
      transition="dissolve"
      focus="50% 50%"
      mobileFocus="50% 46%"
      eyebrow="بیشتر از یک وعده غذا"
      title="جایی برای خوش‌طعم‌تر شدن لحظه‌ها"
      text="برای یک دورهمی صمیمی، یک وعده دلچسب یا زمانی که دلت طعم آشنای غذای ایرانی را می‌خواهد."
    >
      <div className="container world-block">
        <div className="story__grid">
          <Reveal className="story__media">
            <img
              src="/images/interior.webp"
              alt="سالن داخلی گرم مستر کباب با نورپردازی کهربایی"
              loading="lazy"
              decoding="async"
              width="1280"
              height="720"
            />
            <span className="story__media-line" aria-hidden="true" />
          </Reveal>

          <Reveal className="story__body" delay={80}>
            <h3 className="world-subtitle">آتشی که سال‌هاست خاموش نمی‌شود</h3>
            <p className="lead">
              مستر کباب از یک زغال‌دان کوچک در پاساژ ولیعصر شروع شد؛ جایی که فقط شش میز داشت و همه‌چیز بوی
              چوب و ادویه می‌داد. امروز همان دستور، همان صبر و همان حرارت سر جای خودشان هستند.
            </p>
            <p className="lead">
              گوشت را خودمان انتخاب می‌کنیم، برنج را در دیگ مسی دم می‌کنیم و نان را کنار زغال گرم نگه
              می‌داریم. هیچ‌چیز از پیش پخته نمی‌شود؛ هر سفارش، از همان لحظه شروع می‌شود.
            </p>

            <ul className="story__stats">
              {STATS.map((stat) => (
                <li className="stat" key={stat.label}>
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </ScrollVideoSection>
  );
}
