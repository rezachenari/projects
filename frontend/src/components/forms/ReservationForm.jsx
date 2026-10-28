import { useState } from 'react';
import { CalendarCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { createReservation } from '../../lib/api';
import { RESERVATION_TIMES, todayISO } from '../../lib/site';

const EMPTY = {
  full_name: '',
  phone: '',
  guests: '2',
  reserved_for: '',
  reserved_time: '',
  note: '',
};

export default function ReservationForm({ compact = false }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [reference, setReference] = useState(null);

  const update = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('saving');
    setMessage('');
    setErrors({});

    try {
      const result = await createReservation({
        ...values,
        guests: Number(values.guests),
      });
      setReference(result?.reservation ?? null);
      setStatus('done');
      setValues(EMPTY);
    } catch (error) {
      setStatus('error');
      setErrors(error.fields || {});
      setMessage(error.message || 'ثبت رزرو ناموفق بود. دوباره تلاش کنید.');
    }
  };

  if (status === 'done') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={30} aria-hidden="true" />
        <h3>میز شما رزرو شد</h3>
        <p>
          درخواست رزرو ثبت شد{reference ? ` (کد پیگیری ${reference})` : ''}. برای تأیید نهایی، همکاران ما
          تا چند دقیقه با شما تماس می‌گیرند.
        </p>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => {
            setStatus('idle');
            setReference(null);
          }}
        >
          ثبت رزرو دیگر
        </button>
      </div>
    );
  }

  return (
    <form className={`reservation-form ${compact ? 'reservation-form--compact' : ''}`} onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label className="form-field">
          <span>نام و نام خانوادگی</span>
          <input
            type="text"
            name="full_name"
            value={values.full_name}
            onChange={update('full_name')}
            placeholder="مثلاً سارا مرادی"
            autoComplete="name"
            aria-invalid={Boolean(errors.full_name)}
          />
          {errors.full_name ? <span className="form-error">{errors.full_name}</span> : null}
        </label>

        <label className="form-field">
          <span>شماره موبایل</span>
          <input
            type="tel"
            name="phone"
            value={values.phone}
            onChange={update('phone')}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
        </label>
      </div>

      <div className="form-row form-row--three">
        <label className="form-field">
          <span>تعداد نفرات</span>
          <select name="guests" value={values.guests} onChange={update('guests')}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} نفر
              </option>
            ))}
            <option value="12">۱۲ نفر</option>
            <option value="16">۱۶ نفر</option>
          </select>
        </label>

        <label className="form-field">
          <span>تاریخ</span>
          <input
            type="date"
            name="reserved_for"
            value={values.reserved_for}
            min={todayISO()}
            onChange={update('reserved_for')}
            aria-invalid={Boolean(errors.reserved_for)}
          />
          {errors.reserved_for ? <span className="form-error">{errors.reserved_for}</span> : null}
        </label>

        <label className="form-field">
          <span>ساعت</span>
          <select
            name="reserved_time"
            value={values.reserved_time}
            onChange={update('reserved_time')}
            aria-invalid={Boolean(errors.reserved_time)}
          >
            <option value="">انتخاب ساعت</option>
            {RESERVATION_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.reserved_time ? <span className="form-error">{errors.reserved_time}</span> : null}
        </label>
      </div>

      <label className="form-field">
        <span>توضیحات (اختیاری)</span>
        <textarea
          name="note"
          value={values.note}
          onChange={update('note')}
          rows={compact ? 2 : 3}
          placeholder="میز کنار پنجره، تولد، حساسیت غذایی…"
        />
      </label>

      {errors.guests ? <p className="form-error">{errors.guests}</p> : null}
      {message ? <p className="form-banner" role="alert">{message}</p> : null}

      <button type="submit" className="btn btn--amber" disabled={status === 'saving'}>
        {status === 'saving' ? (
          <Loader2 size={16} className="spin" aria-hidden="true" />
        ) : (
          <CalendarCheck size={16} aria-hidden="true" />
        )}
        <span>{status === 'saving' ? 'در حال ثبت…' : 'ثبت درخواست رزرو'}</span>
      </button>

      <p className="form-note">
        رزرو پس از تماس تأیید می‌شود. برای جمع‌های بیش از ۱۲ نفر لطفاً تلفنی هماهنگ کنید.
      </p>
    </form>
  );
}
