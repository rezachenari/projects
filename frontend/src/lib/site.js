/* Static fallbacks + shared site content (navigation, gallery). */

export const FALLBACK_SETTINGS = {
  brand_name: 'مستر کباب',
  tagline: 'عطر زغال، طعم اصالت',
  phone: '۰۲۱-۸۸۷۷۶۶۵۵',
  address: 'تهران، خیابان ولیعصر، نبش کوچه بهار، پلاک ۱۲۴',
  hours: 'هر روز از ۱۲:۰۰ تا ۲۳:۳۰',
  email: 'hello@misterkebab.example',
  instagram: '@misterkebab',
  reservation_note: 'رزرو تلفنی تا ساعت ۲۲ و پذیرش میز تا ۲۳:۰۰',
};

export const NAV_LINKS = [
  { label: 'خانه', to: '/' },
  { label: 'منو', to: '/menu' },
  { label: 'گالری', to: '/gallery' },
  { label: 'درباره ما', to: '/#story' },
  { label: 'رزرو میز', to: '/reservation' },
];

export const GALLERY = [
  { src: '/images/gallery-1.webp', alt: 'سینی کباب تازه از زغال', caption: 'از زغال تا میز', span: 'wide' },
  { src: '/images/gallery-2.webp', alt: 'فضای داخلی گرم رستوران', caption: 'سالن اصلی' },
  { src: '/images/gallery-3.webp', alt: 'حرارت زغال و دود کباب', caption: 'حرارت زغال' },
  { src: '/images/gallery-4.webp', alt: 'سرو غذا روی میز چوبی', caption: 'سرو میز' },
  { src: '/images/gallery-5.webp', alt: 'میز مهمانان در نور گرم', caption: 'مهمان‌نوازی', span: 'tall' },
  { src: '/images/gallery-6.webp', alt: 'بشقاب کباب در نور شب', caption: 'شب‌های مستر' },
  { src: '/images/gallery-7.webp', alt: 'پیش‌غذای تازه ایرانی', caption: 'پیش‌غذا' },
  { src: '/images/gallery-8.webp', alt: 'گوشه‌ای از سالن رستوران', caption: 'گوشه دنج' },
];

export const RESERVATION_TIMES = [
  '12:30',
  '13:30',
  '14:30',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

/** Persian/Arabic digits in the configured phone number → a usable `tel:` link. */
export function telHref(phone = '') {
  const digits = '۰۱۲۳۴۵۶۷۸۹';
  const ascii = String(phone)
    .replace(/[۰-۹]/g, (digit) => String(digits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
  return `tel:${ascii.replace(/[^\d+]/g, '')}`;
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
