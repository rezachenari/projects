import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { postJSON } from '../../lib/api';
import { requestTypes } from '../../lib/nav';
import { toFaDigits } from '../../lib/utils';

const EMPTY = {
  full_name: '',
  phone: '',
  request_type: '',
  city: '',
  project_details: '',
  budget: '',
};

function normalizeDigits(value) {
  return value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

function normalizePhone(value) {
  const raw = normalizeDigits(value).replace(/[^\d+]/g, '');
  if (raw.startsWith('+98')) return `0${raw.slice(3)}`;
  if (raw.startsWith('0098')) return `0${raw.slice(4)}`;
  if (raw.startsWith('98') && raw.length === 12) return `0${raw.slice(2)}`;
  if (raw.length === 10 && raw.startsWith('9')) return `0${raw}`;
  return raw;
}

function validate(values) {
  const errors = {};
  if (values.full_name.trim().length < 3) errors.full_name = 'نام و نام خانوادگی را کامل وارد کنید.';
  const phone = normalizePhone(values.phone);
  if (!/^0?(9\d{9}|[1-8]\d{9})$/.test(phone)) errors.phone = 'شماره تماس معتبر وارد کنید؛ مثلاً ۰۹۱۲۳۴۵۶۷۸۹.';
  if (!values.request_type) errors.request_type = 'نوع درخواست را انتخاب کنید.';
  if (values.city.trim().length < 2) errors.city = 'شهر محل پروژه را وارد کنید.';
  if (values.project_details.trim() && values.project_details.trim().length < 10) {
    errors.project_details = 'توضیحات پروژه را کمی کامل‌تر بنویسید (حداقل ۱۰ کاراکتر).';
  }
  return errors;
}

export default function LeadForm({
  variant = 'dark',
  defaultRequestType = '',
  productName = '',
  submitLabel = 'درخواست مشاوره اختصاصی',
  onDone = null,
}) {
  const initialValues = useMemo(
    () => ({
      ...EMPTY,
      request_type: defaultRequestType || '',
      project_details: productName
        ? `درخواست استعلام قیمت و مشاوره برای «${productName}».\n\nابعاد تقریبی فضای من: `
        : '',
    }),
    [defaultRequestType, productName],
  );

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [ticket, setTicket] = useState(null);
  const [serverMessage, setServerMessage] = useState('');

  const update = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus('idle');
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`lead-${firstField}`)?.focus();
      return;
    }

    setStatus('submitting');
    setServerMessage('');
    try {
      const payload = {
        full_name: values.full_name.trim(),
        phone: normalizePhone(values.phone),
        request_type: values.request_type,
        city: values.city.trim(),
        project_details: values.project_details.trim(),
        budget: values.budget.trim(),
      };
      const result = await postJSON('/leads', payload);
      setTicket(result.lead || null);
      setStatus('success');
      setValues(EMPTY);
      if (onDone) onDone(result);
    } catch (error) {
      if (error.fields) setErrors(error.fields);
      setServerMessage(error.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-status" role="status">
        <span className="form-status__title" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <CheckCircle2 size={18} aria-hidden="true" />
          درخواست شما ثبت شد.
        </span>
        <span className="form-status__body">
          درخواست شما در سیستم ثبت و برای بررسی کارشناسان ذخیره شد
          {ticket ? ` (شماره پیگیری: ${toFaDigits(ticket)}).` : '.'} برای تکمیل اطلاعات یا تغییر درخواست، همین شماره را
          اعلام کنید.
        </span>
        <button className="btn btn--ghost" type="button" onClick={() => setStatus('idle')} style={{ justifySelf: 'start' }}>
          ثبت درخواست دیگر
        </button>
      </div>
    );
  }

  return (
    <form className={`form ${variant === 'light' ? 'form--light' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="form__grid">
        <div className={`field ${errors.full_name ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor="lead-full_name">
            نام و نام خانوادگی <span className="field__req" aria-hidden="true">*</span>
          </label>
          <input
            id="lead-full_name"
            name="full_name"
            className="field__control"
            value={values.full_name}
            onChange={update('full_name')}
            placeholder="مثلاً سارا محمدی"
            aria-required="true"
            aria-invalid={Boolean(errors.full_name)}
            aria-describedby={errors.full_name ? 'lead-full_name-error' : undefined}
            autoComplete="name"
          />
          {errors.full_name ? (
            <span className="field__error" id="lead-full_name-error">
              <AlertCircle size={13} aria-hidden="true" />
              {errors.full_name}
            </span>
          ) : null}
        </div>

        <div className={`field ${errors.phone ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor="lead-phone">
            شماره موبایل <span className="field__req" aria-hidden="true">*</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            className="field__control"
            value={values.phone}
            onChange={update('phone')}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            inputMode="tel"
            dir="ltr"
            style={{ textAlign: 'right' }}
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
            autoComplete="tel"
          />
          {errors.phone ? (
            <span className="field__error" id="lead-phone-error">
              <AlertCircle size={13} aria-hidden="true" />
              {errors.phone}
            </span>
          ) : null}
        </div>

        <div className={`field ${errors.request_type ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor="lead-request_type">
            نوع درخواست <span className="field__req" aria-hidden="true">*</span>
          </label>
          <select
            id="lead-request_type"
            name="request_type"
            className="field__control"
            value={values.request_type}
            onChange={update('request_type')}
            aria-required="true"
            aria-invalid={Boolean(errors.request_type)}
            aria-describedby={errors.request_type ? 'lead-request_type-error' : undefined}
          >
            <option value="">انتخاب کنید…</option>
            {requestTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.request_type ? (
            <span className="field__error" id="lead-request_type-error">
              <AlertCircle size={13} aria-hidden="true" />
              {errors.request_type}
            </span>
          ) : null}
        </div>

        <div className={`field ${errors.city ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor="lead-city">
            شهر محل پروژه <span className="field__req" aria-hidden="true">*</span>
          </label>
          <input
            id="lead-city"
            name="city"
            className="field__control"
            value={values.city}
            onChange={update('city')}
            placeholder="مثلاً تهران"
            aria-required="true"
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'lead-city-error' : undefined}
            autoComplete="address-level2"
          />
          {errors.city ? (
            <span className="field__error" id="lead-city-error">
              <AlertCircle size={13} aria-hidden="true" />
              {errors.city}
            </span>
          ) : null}
        </div>

        <div className={`field field--wide ${errors.project_details ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor="lead-project_details">
            ابعاد تقریبی یا توضیحات پروژه
          </label>
          <textarea
            id="lead-project_details"
            name="project_details"
            className="field__control"
            value={values.project_details}
            onChange={update('project_details')}
            placeholder="مثلاً یک ویترین دیواری به عرض ۳ متر برای فروشگاه ۶۰ متری با سبک مدرن."
            aria-invalid={Boolean(errors.project_details)}
            aria-describedby={errors.project_details ? 'lead-project_details-error' : 'lead-project_details-hint'}
          />
          {errors.project_details ? (
            <span className="field__error" id="lead-project_details-error">
              <AlertCircle size={13} aria-hidden="true" />
              {errors.project_details}
            </span>
          ) : (
            <span className="field__hint" id="lead-project_details-hint">
              هرچه فضای فروشگاه را دقیق‌تر توضیح دهید، پیشنهاد اولیه دقیق‌تر خواهد بود.
            </span>
          )}
        </div>

        <div className="field field--wide">
          <label className="field__label" htmlFor="lead-budget">
            بودجه تقریبی (اختیاری)
          </label>
          <input
            id="lead-budget"
            name="budget"
            className="field__control"
            value={values.budget}
            onChange={update('budget')}
            placeholder="مثلاً تا ۱۵۰ میلیون تومان"
          />
        </div>
      </div>

      {status === 'error' ? (
        <div className="form-status form-status--error" role="alert">
          <span className="form-status__title">درخواست ثبت نشد.</span>
          <span className="form-status__body">
            {serverMessage || 'ارتباط با سرور برقرار نشد. لطفاً چند لحظه بعد دوباره تلاش کنید.'}
          </span>
        </div>
      ) : null}

      <button className="btn btn--gold" type="submit" disabled={status === 'submitting'}>
        <span>{status === 'submitting' ? 'در حال ارسال…' : submitLabel}</span>
        <span className="btn__icon">
          <Send size={16} aria-hidden="true" />
        </span>
      </button>
    </form>
  );
}
