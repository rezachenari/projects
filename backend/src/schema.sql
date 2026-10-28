-- Mister Kebab — schema.
-- The seed (src/seed.js) is idempotent and never drops user data tables.

CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_categories (
  slug        TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dishes (
  slug         TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES menu_categories (slug) ON UPDATE CASCADE,
  description  TEXT NOT NULL DEFAULT '',
  price_label  TEXT,
  image_url    TEXT NOT NULL,
  image_alt    TEXT NOT NULL DEFAULT '',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT '',
  quote      TEXT NOT NULL,
  rating     INTEGER NOT NULL DEFAULT 5,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reservations (
  id           SERIAL PRIMARY KEY,
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  guests       INTEGER NOT NULL,
  reserved_for DATE NOT NULL,
  reserved_time TEXT NOT NULL,
  note         TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
