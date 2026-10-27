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

const productSelect = `
  SELECT p.slug, p.name, p.category_slug, p.summary, p.description, p.spec_line,
         p.price_label, p.image_url, p.image_alt, p.features, p.specs, p.featured,
         c.title AS category_title
  FROM products p
  JOIN categories c ON c.slug = p.category_slug
`;

const productCardSelect = `
  SELECT p.slug, p.name, p.category_slug, p.summary, p.spec_line, p.price_label,
         p.image_url, p.image_alt, p.featured, c.title AS category_title
  FROM products p
  JOIN categories c ON c.slug = p.category_slug
`;

/* ---------------- simple lead throttle ---------------- */
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

app.get('/api/health', asyncRoute(async (_req, res) => {
  await query('SELECT 1');
  res.json({ ok: true });
}));

app.get('/api/settings', asyncRoute(async (_req, res) => {
  const { rows } = await query('SELECT key, value FROM site_settings ORDER BY key');
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.key === 'contact_placeholder' ? row.value === 'true' : row.value;
  }
  res.json({ settings });
}));

app.get('/api/categories', asyncRoute(async (_req, res) => {
  const { rows } = await query(`
    SELECT c.slug, c.title, c.short_description, c.long_description, c.image_url, c.image_alt,
           COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_slug = c.slug
    GROUP BY c.slug, c.title, c.short_description, c.long_description, c.image_url, c.image_alt, c.sort_order
    ORDER BY c.sort_order ASC
  `);
  res.json({ categories: rows });
}));

/* ---------------- products ---------------- */

app.get('/api/products', asyncRoute(async (req, res) => {
  const { category, q, featured, limit } = req.query;
  const clauses = [];
  const params = [];

  if (category) {
    params.push(String(category));
    clauses.push(`p.category_slug = $${params.length}`);
  }
  if (q) {
    params.push(`%${String(q).trim()}%`);
    clauses.push(
      `(p.name ILIKE $${params.length} OR p.summary ILIKE $${params.length} OR p.spec_line ILIKE $${params.length} OR c.title ILIKE $${params.length})`,
    );
  }
  if (featured === '1' || featured === 'true') {
    clauses.push('p.featured = TRUE');
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const filterParams = params.slice();
  let limitSql = '';
  const parsedLimit = Number.parseInt(String(limit ?? ''), 10);
  if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
    params.push(Math.min(parsedLimit, 48));
    limitSql = `LIMIT $${params.length}`;
  }

  const { rows } = await query(
    `${productCardSelect} ${where} ORDER BY p.sort_order ASC ${limitSql}`,
    params,
  );

  const totalResult = await query(
    `SELECT COUNT(*)::int AS total FROM products p JOIN categories c ON c.slug = p.category_slug ${where}`,
    filterParams,
  );

  res.json({ products: rows, total: totalResult.rows[0]?.total ?? rows.length });
}));

app.get('/api/products/:slug', asyncRoute(async (req, res) => {
  const { rows } = await query(`${productSelect} WHERE p.slug = $1`, [req.params.slug]);
  if (!rows.length) {
    return res.status(404).json({ message: 'محصول مورد نظر پیدا نشد.' });
  }
  const product = rows[0];
  const related = await query(
    `${productCardSelect} WHERE p.category_slug = $1 AND p.slug <> $2 ORDER BY p.sort_order ASC LIMIT 3`,
    [product.category_slug, product.slug],
  );

  // A thin category would leave the "related" row empty, so top it up with
  // featured products from the rest of the catalogue.
  let relatedRows = related.rows;
  if (relatedRows.length < 3) {
    const exclude = [product.slug, ...relatedRows.map((row) => row.slug)];
    const filler = await query(
      `${productCardSelect}
       WHERE p.slug <> ALL($1::text[])
       ORDER BY p.featured DESC, p.sort_order ASC
       LIMIT $2`,
      [exclude, 3 - relatedRows.length],
    );
    relatedRows = relatedRows.concat(filler.rows);
  }

  return res.json({ product, related: relatedRows });
}));

/* ---------------- projects ---------------- */

app.get('/api/projects', asyncRoute(async (req, res) => {
  const parsedLimit = Number.parseInt(String(req.query.limit ?? ''), 10);
  const limitSql = Number.isFinite(parsedLimit) && parsedLimit > 0 ? `LIMIT ${Math.min(parsedLimit, 24)}` : '';
  const { rows } = await query(
    `SELECT slug, title, location, service_type, style, summary, image_url, image_alt, is_demo
     FROM projects ORDER BY sort_order ASC ${limitSql}`,
  );
  res.json({ projects: rows });
}));

app.get('/api/projects/:slug', asyncRoute(async (req, res) => {
  const { rows } = await query(
    `SELECT slug, title, location, service_type, style, summary, body, scope, image_url, image_alt, is_demo
     FROM projects WHERE slug = $1`,
    [req.params.slug],
  );
  if (!rows.length) {
    return res.status(404).json({ message: 'پروژه مورد نظر پیدا نشد.' });
  }
  return res.json({ project: rows[0] });
}));

/* ---------------- articles ---------------- */

app.get('/api/articles', asyncRoute(async (req, res) => {
  const parsedLimit = Number.parseInt(String(req.query.limit ?? ''), 10);
  const limitSql = Number.isFinite(parsedLimit) && parsedLimit > 0 ? `LIMIT ${Math.min(parsedLimit, 24)}` : '';
  const { rows } = await query(
    `SELECT slug, title, excerpt, reading_minutes, published_at, image_url, image_alt
     FROM articles ORDER BY published_at DESC ${limitSql}`,
  );
  res.json({ articles: rows });
}));

app.get('/api/articles/:slug', asyncRoute(async (req, res) => {
  const { rows } = await query(
    `SELECT slug, title, excerpt, body, reading_minutes, published_at, image_url, image_alt
     FROM articles WHERE slug = $1`,
    [req.params.slug],
  );
  if (!rows.length) {
    return res.status(404).json({ message: 'مقاله مورد نظر پیدا نشد.' });
  }
  return res.json({ article: rows[0] });
}));

/* ---------------- leads ---------------- */

function normalizeDigits(value) {
  return String(value)
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

const REQUEST_TYPES = new Set([
  'خرید مانکن و استند طلا',
  'سفارش ویترین طلافروشی',
  'طراحی و اجرای دکور کامل',
  'بازسازی یا تغییر دکور',
  'مشاوره و استعلام قیمت',
  'سایر موارد',
]);

function validateLead(body) {
  const fields = {};
  const fullName = String(body.full_name ?? '').trim();
  const phone = normalizePhone(body.phone ?? '');
  const requestType = String(body.request_type ?? '').trim();
  const city = String(body.city ?? '').trim();
  const projectDetails = String(body.project_details ?? '').trim();
  const budget = String(body.budget ?? '').trim();

  if (fullName.length < 3 || fullName.length > 120) fields.full_name = 'نام و نام خانوادگی را کامل وارد کنید.';
  if (!/^0?(9\d{9}|[1-8]\d{9})$/.test(phone)) fields.phone = 'شماره تماس معتبر وارد کنید؛ مثلاً ۰۹۱۲۳۴۵۶۷۸۹.';
  if (!REQUEST_TYPES.has(requestType)) fields.request_type = 'نوع درخواست را انتخاب کنید.';
  if (city.length < 2 || city.length > 80) fields.city = 'شهر محل پروژه را وارد کنید.';
  if (projectDetails.length > 4000) fields.project_details = 'توضیحات پروژه بیش از حد طولانی است.';

  return {
    fields,
    values: { fullName, phone, requestType, city, projectDetails, budget: budget.slice(0, 120) },
  };
}

app.post('/api/leads', throttle, asyncRoute(async (req, res) => {
  const { fields, values } = validateLead(req.body ?? {});
  if (Object.keys(fields).length) {
    return res.status(422).json({ message: 'اطلاعات فرم کامل نیست. موارد مشخص‌شده را اصلاح کنید.', fields });
  }

  const { rows } = await query(
    `INSERT INTO leads (full_name, phone, request_type, city, project_details, budget)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [values.fullName, values.phone, values.requestType, values.city, values.projectDetails, values.budget],
  );

  return res.status(201).json({ lead: rows[0].id });
}));

/* ---------------- errors ---------------- */

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'این مسیر وجود ندارد.' });
});

app.use((error, _req, res, _next) => {
  console.error('API error:', error);
  res.status(500).json({ message: 'خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on :${PORT}`);
});
