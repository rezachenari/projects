CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories (slug) ON DELETE CASCADE,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  spec_line TEXT NOT NULL DEFAULT '',
  price_label TEXT,
  image_url TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  service_type TEXT NOT NULL DEFAULT '',
  style TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  scope JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  reading_minutes INTEGER NOT NULL DEFAULT 4,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  request_type TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  project_details TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_slug);
