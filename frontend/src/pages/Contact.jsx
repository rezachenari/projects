import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import LeadForm from '../components/forms/LeadForm';
import { useSite } from '../lib/site-context';
import { useDocumentMeta } from '../lib/utils';

export default function Contact() {
  const { settings } = useSite();

  useDocumentMeta({
    title: 'تماس با ما | پارس ویترین',
    description: 'برای مشاوره طراحی ویترین، استعلام قیمت یا هماهنگی بازدید از فضای فروشگاه با ما در تماس باشید.',
  });

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'تماس با ما' }]} />
          <h1>با ما در تماس باشید</h1>
          <p className="lead">
            نیازتان را بگویید تا برای انتخاب یا ساخت ویترین مناسب راهنمایی‌تان کنیم. اگر ابعاد فضا مشخص نیست، همین‌جا
            توضیح دهید؛ در ادامه با هم مرور می‌کنیم.
          </p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="contact-layout">
            <div>
              <h2 style={{ marginBottom: '1.25rem' }}>راه‌های ارتباطی</h2>
              <div className="contact-info">
                {settings?.phone_primary ? (
                  <div className="contact-info__row" style={{ borderColor: 'rgba(8,10,13,0.12)' }}>
                    <Phone size={18} strokeWidth={1.4} aria-hidden="true" style={{ color: '#9C713A' }} />
                    <div>
                      <span className="contact-info__label" style={{ color: '#6a7078' }}>
                        شماره تماس
                      </span>
                      <span className="contact-info__value" style={{ color: '#080A0D' }}>
                        {settings.phone_link ? (
                          <a href={`tel:${settings.phone_link}`}>{settings.phone_primary}</a>
                        ) : (
                          settings.phone_primary
                        )}
                      </span>
                    </div>
                  </div>
                ) : null}

                {settings?.email ? (
                  <div className="contact-info__row" style={{ borderColor: 'rgba(8,10,13,0.12)' }}>
                    <Mail size={18} strokeWidth={1.4} aria-hidden="true" style={{ color: '#9C713A' }} />
                    <div>
                      <span className="contact-info__label" style={{ color: '#6a7078' }}>
                        ایمیل
                      </span>
                      <span className="contact-info__value" style={{ color: '#080A0D' }}>
                        {settings.email}
                      </span>
                    </div>
                  </div>
                ) : null}

                {settings?.address ? (
                  <div className="contact-info__row" style={{ borderColor: 'rgba(8,10,13,0.12)' }}>
                    <MapPin size={18} strokeWidth={1.4} aria-hidden="true" style={{ color: '#9C713A' }} />
                    <div>
                      <span className="contact-info__label" style={{ color: '#6a7078' }}>
                        نشانی
                      </span>
                      <span className="contact-info__value" style={{ color: '#080A0D' }}>
                        {settings.address}
                      </span>
                    </div>
                  </div>
                ) : null}

                {settings?.hours ? (
                  <div className="contact-info__row" style={{ borderColor: 'rgba(8,10,13,0.12)' }}>
                    <Clock size={18} strokeWidth={1.4} aria-hidden="true" style={{ color: '#9C713A' }} />
                    <div>
                      <span className="contact-info__label" style={{ color: '#6a7078' }}>
                        ساعات پاسخ‌گویی
                      </span>
                      <span className="contact-info__value" style={{ color: '#080A0D' }}>
                        {settings.hours}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {settings?.contact_placeholder ? (
                <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#6a7078' }}>
                  اطلاعات تماس بالا نمونه است و باید با اطلاعات واقعی مجموعه جایگزین شود.
                </p>
              ) : null}
            </div>

            <div className="contact-card">
              <h2 style={{ marginBottom: '0.5rem' }}>فرم درخواست مشاوره</h2>
              <p style={{ fontSize: '0.88rem', color: '#565c64', marginBottom: '1.25rem', lineHeight: 1.9 }}>
                فیلدهای ستاره‌دار الزامی هستند. درخواست شما در سیستم ثبت می‌شود و برای پیگیری قابل ارجاع است.
              </p>
              <LeadForm variant="light" submitLabel="ارسال درخواست" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
