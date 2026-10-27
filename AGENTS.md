# AGENTS.md — Pars Vitrin

Luxury Persian (RTL) marketing/e‑commerce site for a jewelry-display maker.
React + Vite (frontend) · Express + PostgreSQL (backend) · Docker Compose.

## Run

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web entry point: **host port 3000** (Vite dev server on 5173 inside the container).
- API: host port 8000, also proxied through Vite at `/api` so the browser only ever
  talks to one origin (session/cookie-free, but keeps CORS out of the picture).
- `db` (postgres:16-alpine) → `migrate` (one-shot schema + seed) → `api` → `web`.
- Source is bind-mounted; both app services run watchers (`node --watch`, Vite HMR).
  `node_modules` lives in a named volume, hydrated by `npm install` at container start.

## Content lives in the database

Nothing is hard-coded in JSX except section structure and static UI copy.

| Table | Edited in | Notes |
| --- | --- | --- |
| `site_settings` | `backend/src/seed-data.js` → `settings` | contact details, brand name, `contact_placeholder` flag |
| `categories` | `…/seed-data.js` → `categories` | 6 categories, order via `sort_order` |
| `products` | `…/seed-data.js` → `products` | `price_label = null` renders «استعلام قیمت» |
| `projects` | `…/seed-data.js` → `projects` | `is_demo` renders the «نمونه طراحی» badge |
| `articles` | `…/seed-data.js` → `articles` | `body` is a JSON array of `{type: p\|h2\|h3\|ul\|quote}` blocks |
| `leads` | runtime | written by `POST /api/leads`; no admin UI yet |

Apply content edits with:

```bash
docker compose -f docker-compose.base44.yml run --rm migrate
```

The seed is idempotent (`ON CONFLICT (slug) DO UPDATE`), so it is safe to re-run;
it never drops the `leads` table.

## API

`GET /api/health` · `GET /api/settings` · `GET /api/categories`
`GET /api/products?category=&q=&featured=1&limit=` · `GET /api/products/:slug`
`GET /api/projects` · `GET /api/projects/:slug`
`GET /api/articles` · `GET /api/articles/:slug`
`POST /api/leads` → `201 {lead: id}`, `422 {message, fields}` on validation errors

## Things that are easy to get wrong

- **Images are local, not remote.** All photography is downloaded into
  `frontend/public/images/*.webp` and referenced by path. Never swap in an
  external hotlink — the site must render offline.
- **No slider in the hero.** That is a hard product rule, not an oversight.
- **Fonts:** `--font-fa` asks for `IRANYekan` first, but the licensed files are
  not in the repo. Vazirmatn (self-hosted in `frontend/public/fonts`) is the
  working face. `src/styles/iranyekan.css` holds the commented `@font-face`
  block; uncomment it and import the file once the licensed woff2 files exist.
- **Placeholders:** phone/email/address/social/testimonials are demo values and
  are labelled as such in the UI (`contact_placeholder`). Prices are intentionally
  `null`. Do not present these as real business facts.
- **Host allowlist:** `vite.config.js` only appends
  `.<BASE44_SANDBOX_HOST_DOMAIN>` when `BASE44_PREVIEW_MODE === '1'`, so the
  dev server accepts proxied hostnames in the sandbox and stays strict elsewhere.
  Pass `BASE44_PREVIEW_MODE`, `BASE44_SANDBOX_HOST_DOMAIN` and
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` through Compose (already wired).

## Verify

```bash
curl -s localhost:3000/api/health                 # {"ok":true}
curl -s localhost:3000/api/products | head -c 120 # seeded catalogue
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/products/vitrin-divari-arka  # 200 via SPA fallback
docker compose -f docker-compose.base44.yml exec -T web npx vite build  # compiles every page
```

Form round trip (creates a row — delete it afterwards):

```bash
curl -s -X POST localhost:3000/api/leads -H 'Content-Type: application/json' \
  -d '{"full_name":"تست","phone":"09123456789","request_type":"مشاوره و استعلام قیمت","city":"تهران"}'
docker compose -f docker-compose.base44.yml exec -T db psql -U parsvitrin -d parsvitrin \
  -c "DELETE FROM leads WHERE full_name='تست';"
```
