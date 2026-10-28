import Reveal from '../ui/Reveal';

const STATS = [
  { value: '۲۰+', label: 'سال روی زغال' },
  { value: '۳۵۰', label: 'سیخ زغالی در روز' },
  { value: '۹٬۰۰۰', label: 'مهمان در ماه' },
];

export default function Story() {
  return (
    <section className="section section--mid story" id="story" aria-labelledby="story-title">
      <div className="container story__grid">
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
          <span className="eyebrow">قصه‌ی ما</span>
          <h2 id="story-title">آتشی که سال‌هاست خاموش نمی‌شود</h2>
          <p className="lead">
            مستر کباب از یک زغال‌دان کوچک در پاساژ ولیعصر شروع شد؛ جایی که فقط شش میز داشت و همه‌چیز بوی
            چوب و ادویه می‌داد. امروز همان دستور، همان صبر و همان حرارت سر جای خودشان هستند.
          </p>
          <p className="lead">
            گوشت را خودمان انتخاب می‌کنیم، برنج را در دیگ مسی دم می‌کنیم و نان را کنار زغال گرم نگه می‌داریم.
            هیچ‌چیز از پیش پخته نمی‌شود؛ هر سفارش، از همان لحظه شروع می‌شود.
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
    </section>
  );
}
