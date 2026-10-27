import { useSearchParams } from 'react-router-dom';
import { Clock3, FileText, Ruler, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import LeadForm from '../components/forms/LeadForm';
import Reveal from '../components/ui/Reveal';
import { useSite } from '../lib/site-context';
import { useDocumentMeta } from '../lib/utils';
import { requestTypes } from '../lib/nav';

const GUIDES = [
  { Icon: Ruler, title: 'ابعاد فضا', desc: 'عرض و عمق تقریبی محلی که ویترین در آن قرار می‌گیرد.' },
  { Icon: FileText, title: 'سبک مورد نظر', desc: 'مدرن، کلاسیک یا هم‌خوان با دکور موجود فروشگاه.' },
  { Icon: Clock3, title: 'زمان‌بندی', desc: 'اگر افتتاح یا بازسازی در تاریخ مشخصی انجام می‌شود، اعلام کنید.' },
];

export default function Consultation() {
  const [searchParams] = useSearchParams();
  const { settings } = useSite();
  const product = searchParams.get('product') || '';
  const typeParam = searchParams.get('type') || '';
  const defaultType = requestTypes.includes(typeParam) ? typeParam : '';

  useDocumentMeta({
    title: 'درخواست مشاوره و استعلام قیمت | پارس ویترین',
    description:
      'فرم درخواست مشاوره طراحی ویترین، استعلام قیمت و سفارش ساخت اختصاصی برای گالری‌های طلا و جواهر.',
  });

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'درخواست مشاوره' }]} />
          <h1>درخواست مشاوره و استعلام قیمت</h1>
          <p className="lead">
            {product
              ? `برای «${product}» درخواست شما ثبت می‌شود؛ اگر ابعاد یا جزئیات خاصی مد نظر دارید، در توضیحات بنویسید.`
              : 'چند خط درباره فضا و نیازتان بنویسید تا گزینه‌های متناسب با فروشگاه شما بررسی شود.'}
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="contact-layout">
            <Reveal>
              <h2 style={{ marginBottom: '1rem' }}>چه اطلاعاتی کمک می‌کند؟</h2>
              <div className="feature-list">
                {GUIDES.map(({ Icon, title, desc }) => (
                  <div className="feature-list__item" key={title}>
                    <span className="feature-list__icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.4} />
                    </span>
                    <div>
                      <p className="feature-list__title">{title}</p>
                      <p className="feature-list__desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="detail__note" style={{ marginTop: '1.75rem' }}>
                <ShieldCheck size={17} aria-hidden="true" />
                اطلاعات این فرم فقط برای بررسی درخواست شما ذخیره می‌شود و در اختیار تیم فروش قرار می‌گیرد.
              </div>

              {settings?.hours ? (
                <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--steel-400)' }}>
                  ساعات پاسخ‌گویی: {settings.hours}
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={80}>
              <div className="contact-card" style={{ background: 'var(--ink-850)', borderColor: 'rgba(214,173,98,0.2)' }}>
                <h2 style={{ marginBottom: '1.25rem' }}>فرم درخواست</h2>
                <LeadForm
                  defaultRequestType={defaultType}
                  productName={product}
                  submitLabel="ثبت درخواست مشاوره"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
