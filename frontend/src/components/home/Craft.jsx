import { Flame } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ScrollVideoSection from '../cinema/ScrollVideoSection';

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

/** World 04 — the art of fire. The most intense, most shadowed world. */
export default function Craft() {
  return (
    <ScrollVideoSection
      id="craft"
      index={4}
      name="هنر آتش"
      src="/videos/charcoal-grilling.mp4"
      mobileSrc="/videos/charcoal-grilling-mobile.mp4"
      poster="/images/grill.webp"
      travel="215vh"
      veil="deep"
      transition="warm"
      focus="50% 55%"
      mobileFocus="50% 50%"
      eyebrow="هنر کباب، از نزدیک"
      title="راز یک کباب دل‌چسب، در جزئیات است"
      text="صدای زغال، حرارت آتش و لحظه‌ای که کباب به رنگ دلخواه می‌رسد؛ گاهی لذت غذا از همان لحظه‌های قبل از اولین لقمه شروع می‌شود."
    >
      <div className="container world-block">
        <h3 className="world-subtitle">از زغال تا بشقاب، سه قدم</h3>

        <div className="craft__grid">
          {STEPS.map((step, index) => (
            <Reveal className="craft-step" key={step.title} delay={index * 90}>
              <span className="craft-step__num" aria-hidden="true">
                {String(index + 1).padStart(2, '۰')}
              </span>
              <h4 className="craft-step__title">{step.title}</h4>
              <p className="craft-step__text">{step.text}</p>
              <span className="craft-step__icon" aria-hidden="true">
                <Flame size={16} />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </ScrollVideoSection>
  );
}
