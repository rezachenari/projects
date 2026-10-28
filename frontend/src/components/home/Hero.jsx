import { ArrowLeft, ChefHat, MousePointerClick } from 'lucide-react';
import ScrollVideoSection from '../cinema/ScrollVideoSection';
import { scrollToSection } from '../../lib/scroll';

/** In-page jump that enters a pinned world at the right scroll position. */
function jumpTo(id) {
  return (event) => {
    event.preventDefault();
    scrollToSection(id);
    window.history.replaceState(null, '', `#${id}`);
  };
}

/** World 01 — the awakening of flavour. The one world whose copy stays pinned. */
export default function Hero() {
  return (
    <ScrollVideoSection
      id="hero"
      index={1}
      name="آغاز طعم"
      src="/videos/hero-kebab.mp4"
      mobileSrc="/videos/hero-kebab-mobile.mp4"
      poster="/images/hero-poster.webp"
      travel="240vh"
      veil="hero"
      transition="warm"
      focus="50% 50%"
      mobileFocus="50% 42%"
      layout="stage"
      priority
      headingLevel={1}
      eyebrow="عطر زغال، طعم اصالت"
      title={
        <>
          کبابی که عطرش، <span className="world__accent">اشتها را بیدار می‌کند</span>
        </>
      }
      text="از حرارت زغال تا عطر برنج زعفرانی؛ تجربه‌ای از طعم ایرانی که برای دوباره چشیدن ساخته شده است."
      actions={
        <>
          <a className="btn btn--amber" href="#menu" onClick={jumpTo('menu')}>
            <span className="btn__icon">
              <ChefHat size={17} aria-hidden="true" />
            </span>
            <span>منوی مستر کباب</span>
          </a>
          <a className="btn btn--outline" href="#reservation" onClick={jumpTo('reservation')}>
            <span>شروع یک تجربه خوشمزه</span>
            <span className="btn__icon">
              <ArrowLeft size={16} aria-hidden="true" />
            </span>
          </a>
        </>
      }
      meta={
        <div className="world__foot">
          <span className="world__cue">
            <MousePointerClick size={15} aria-hidden="true" />
            <span>برای آغاز، اسکرول کنید</span>
          </span>
          <span className="world__hint">یک تجربه سینمایی از عطر زغال</span>
        </div>
      }
    />
  );
}
