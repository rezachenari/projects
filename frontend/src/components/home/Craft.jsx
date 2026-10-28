import { Flame } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ScrollVideo from '../ui/ScrollVideo';

const STEPS = [
  {
    title: 'انتخاب گوشت تازه',
    text: 'هر روز صبح، راسته و گردن گوسفند از قصابی آشنا انتخاب می‌شود؛ بدون فریزر، بدون میان‌بر.',
  },
  {
    title: 'حرارت زغال بلوط',
    text: 'زغال بلوط دو ساعت قبل روشن می‌شود تا حرارت یکنواخت شود و دودش فقط عطر بدهد، نه تلخی.',
  },
  {
    title: 'دم‌کشیدن آرام برنج',
    text: 'برنج هاشمی در دیگ مسی با کره محلی و زعفران قائنات دم می‌کشد؛ زمانش دقیق و بی‌تعجیل است.',
  },
];

export default function Craft() {
  return (
    <section className="section section--dark craft" id="craft" aria-labelledby="craft-title">
      <ScrollVideo src="/videos/charcoal-grilling.mp4" poster="/images/grill.webp" veil="deep" />

      <div className="container">
        <Reveal className="section-head craft__head">
          <span className="eyebrow">دستور و حرارت</span>
          <h2 id="craft-title">از زغال تا بشقاب، سه قدم</h2>
          <p className="section-head__text">
            چیزی که در مستر کباب می‌چشید حاصل سه تصمیم ساده است: گوشت تازه، حرارت درست و زمان کافی.
          </p>
        </Reveal>

        <div className="craft__grid">
          {STEPS.map((step, index) => (
            <Reveal className="craft-step" key={step.title} delay={index * 90}>
              <span className="craft-step__num" aria-hidden="true">
                {String(index + 1).padStart(2, '۰')}
              </span>
              <h3 className="craft-step__title">{step.title}</h3>
              <p className="craft-step__text">{step.text}</p>
              <span className="craft-step__icon" aria-hidden="true">
                <Flame size={16} />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
