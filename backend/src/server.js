import express from 'express';
import { query } from './db.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

const PORT = Number(process.env.PORT || 8000);

/* ---------------- helpers ---------------- */

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

const dishSelect = `
  SELECT d.slug, d.name, d.category_slug, d.description, d.price_label, d.image_url,
         d.image_alt, d.is_available, d.is_featured, d.tags, d.sort_order
  FROM dishes d
`;

/* Simple per-IP throttle for the reservation form. */
const hits = new Map();
function throttle(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const record = hits.get(key);
  if (!record || now - record.start > windowMs) {
    hits.set(key, { start: now, count: 1 });
    return next();
  }
  record.count += 1;
  if (record.count > 8) {
    return res.status(429).json({ message: 'تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه بعد دوباره تلاش کنید.' });
  }
  return next();
}

/* ---------------- reference data ---------------- */

app.get(
  '/api/health',
  asyncRoute(async (_req, res) => {
    await query('SELECT 1');
    res.json({ ok: true });
  }),
);

app.get(
  '/api/settings',
  asyncRoute(async (_req, res) => {
    const { rows } = await query('SELECT key, value FROM site_settings ORDER BY key');
    const settings = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json({ settings });
  }),
);

/* ---------------- menu ---------------- */

app.get(
  '/api/menu',
  asyncRoute(async (_req, res) => {
    const [categoryResult, dishResult] = await Promise.all([
      query('SELECT slug, title, description, sort_order FROM menu_categories ORDER BY sort_order ASC'),
      query(`${dishSelect} ORDER BY d.sort_order ASC, d.name ASC`),
    ]);

    const categories = categoryResult.rows.map((category) => ({
      ...category,
      dishes: dishResult.rows.filter((dish) => dish.category_slug === category.slug),
    }));

    res.json({ categories });
  }),
);

app.get(
  '/api/categories',
  asyncRoute(async (_req, res) => {
    const { rows } = await query(`
      SELECT c.slug, c.title, c.description,
             COUNT(d.id) FILTER (WHERE d.is_available)::int AS dish_count
      FROM menu_categories c
      LEFT JOIN dishes d ON d.category_slug = c.slug
      GROUP BY c.slug, c.title, c.description, c.sort_order
      ORDER BY c.sort_order ASC
    `);
    res.json({ categories: rows });
  }),
);

app.get(
  '/api/dishes',
  asyncRoute(async (req, res) => {
    const { category, featured, limit } = req.query;
    const filters = [];
    const params = [];

    if (category) {
      params.push(category);
      filters.push(`d.category_slug = $${params.length}`);
    }
    if (featured === '1' || featured === 'true') filters.push('d.is_featured = TRUE');

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const max = Math.min(60, Math.max(1, Number(limit) || 60));
    params.push(max);

    const { rows } = await query(`${dishSelect} ${where} ORDER BY d.sort_order ASC LIMIT $${params.length}`, params);
    res.json({ dishes: rows });
  }),
);

app.get(
  '/api/testimonials',
  asyncRoute(async (_req, res) => {
    const { rows } = await query(
      'SELECT id, name, role, quote, rating FROM testimonials ORDER BY sort_order ASC, id ASC',
    );
    res.json({ testimonials: rows });
  }),
);

/* ---------------- reservations ---------------- */

const PHONE_RE = /^0\d{9,10}$/;

app.post(
  '/api/reservations',
  throttle,
  asyncRoute(async (req, res) => {
    const body = req.body || {};
    const full_name = String(body.full_name || '').trim();
    const phone = String(body.phone || '').replace(/[^\d]/g, '');
    const guests = Number(body.guests);
    const reserved_for = String(body.reserved_for || '').trim();
    const reserved_time = String(body.reserved_time || '').trim();
    const note = String(body.note || '').trim().slice(0, 500);

    const fields = {};
    if (full_name.length < 3) fields.full_name = 'نام و نام خانوادگی را کامل وارد کنید.';
    if (!PHONE_RE.test(phone)) fields.phone = 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.';
    if (!Number.isInteger(guests) || guests < 1 || guests > 20) fields.guests = 'تعداد نفرات بین ۱ تا ۲۰ باشد.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reserved_for)) fields.reserved_for = 'تاریخ رزرو را انتخاب کنید.';
    if (!/^\d{2}:\d{2}$/.test(reserved_time)) fields.reserved_time = 'ساعت رزرو را انتخاب کنید.';

    if (Object.keys(fields).length) {
      return res.status(422).json({ message: 'اطلاعات رزرو کامل نیست.', fields });
    }

    const { rows } = await query(
      `INSERT INTO reservations (full_name, phone, guests, reserved_for, reserved_time, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [full_name, phone, guests, reserved_for, reserved_time, note],
    );

    return res.status(201).json({ reservation: rows[0].id });
  }),
);

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'مسیر یافت نشد.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'خطای غیرمنتظره در سرور.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`mister-kebab api listening on ${PORT}`);
});
