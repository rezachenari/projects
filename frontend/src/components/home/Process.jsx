import { ClipboardList, Ruler, PencilRuler, FileCheck2, Hammer } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const STEPS = [
  { Icon: ClipboardList, title: 'ثبت درخواست مشاوره', desc: 'نیاز، فضای فروشگاه و سبک مورد نظر را برای ما بنویسید.' },
  { Icon: Ruler, title: 'بررسی نیاز و ابعاد فضا', desc: 'ابعاد، مسیر حرکت مشتری و محدودیت‌های فضا بررسی می‌شود.' },
  { Icon: PencilRuler, title: 'طراحی و انتخاب متریال', desc: 'طرح اولیه همراه با گزینه‌های متریال و نورپردازی ارائه می‌شود.' },
  { Icon: FileCheck2, title: 'تأیید طرح و برآورد هزینه', desc: 'پس از تأیید جزئیات، زمان‌بندی و برآورد هزینه نهایی می‌شود.' },
  { Icon: Hammer, title: 'ساخت، تحویل یا اجرای پروژه', desc: 'ساخت در کارگاه و نصب نهایی طبق طرح تأییدشده انجام می‌شود.' },
];

export default function Process() {
  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="process__bg" aria-hidden="true">
        <img src="/images/workshop-detail.webp" alt="" loading="lazy" decoding="async" width="1600" height="900" />
      </div>
      <div className="container">
        <SectionHeading
          eyebrow="مراحل همکاری"
          title={<span id="process-title">از ایده شما تا ویترین نهایی</span>}
          lead="فرآیند همکاری روشن و مرحله‌به‌مرحله است؛ می‌دانید هر مرحله چه چیزی تحویل می‌گیرید."
        />

        <ol className="process__steps">
          {STEPS.map(({ Icon, title, desc }, index) => (
            <li className="step" key={title}>
              <Reveal as="span" className="step__num" delay={index * 70} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </Reveal>
              <Icon className="step__icon" size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3 className="step__title">{title}</h3>
              <p className="step__desc">{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
