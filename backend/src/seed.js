import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';
import { settings, categories, products, projects, articles } from './seed-data.js';

const here = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = await readFile(path.join(here, 'schema.sql'), 'utf8');
  await pool.query(sql);
}

async function seedSettings() {
  for (const [key, value] of Object.entries(settings)) {
    await pool.query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, String(value)],
    );
  }
}

async function seedCategories() {
  for (const category of categories) {
    await pool.query(
      `INSERT INTO categories (slug, title, short_description, long_description, image_url, image_alt, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         short_description = EXCLUDED.short_description,
         long_description = EXCLUDED.long_description,
         image_url = EXCLUDED.image_url,
         image_alt = EXCLUDED.image_alt,
         sort_order = EXCLUDED.sort_order`,
      [
        category.slug,
        category.title,
        category.short_description,
        category.long_description,
        category.image_url,
        category.image_alt,
        category.sort_order,
      ],
    );
  }
}

async function seedProducts() {
  for (const product of products) {
    await pool.query(
      `INSERT INTO products
         (slug, name, category_slug, summary, description, spec_line, price_label,
          image_url, image_alt, features, specs, featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         category_slug = EXCLUDED.category_slug,
         summary = EXCLUDED.summary,
         description = EXCLUDED.description,
         spec_line = EXCLUDED.spec_line,
         price_label = EXCLUDED.price_label,
         image_url = EXCLUDED.image_url,
         image_alt = EXCLUDED.image_alt,
         features = EXCLUDED.features,
         specs = EXCLUDED.specs,
         featured = EXCLUDED.featured,
         sort_order = EXCLUDED.sort_order`,
      [
        product.slug,
        product.name,
        product.category_slug,
        product.summary,
        product.description,
        product.spec_line,
        product.price_label ?? null,
        product.image_url,
        product.image_alt,
        JSON.stringify(product.features ?? []),
        JSON.stringify(product.specs ?? []),
        Boolean(product.featured),
        product.sort_order,
      ],
    );
  }
}

async function seedProjects() {
  for (const project of projects) {
    await pool.query(
      `INSERT INTO projects
         (slug, title, location, service_type, style, summary, body, scope, image_url, image_alt, is_demo, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         location = EXCLUDED.location,
         service_type = EXCLUDED.service_type,
         style = EXCLUDED.style,
         summary = EXCLUDED.summary,
         body = EXCLUDED.body,
         scope = EXCLUDED.scope,
         image_url = EXCLUDED.image_url,
         image_alt = EXCLUDED.image_alt,
         is_demo = EXCLUDED.is_demo,
         sort_order = EXCLUDED.sort_order`,
      [
        project.slug,
        project.title,
        project.location,
        project.service_type,
        project.style,
        project.summary,
        JSON.stringify(project.body ?? []),
        JSON.stringify(project.scope ?? []),
        project.image_url,
        project.image_alt,
        Boolean(project.is_demo),
        project.sort_order,
      ],
    );
  }
}

async function seedArticles() {
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles
         (slug, title, excerpt, body, reading_minutes, published_at, image_url, image_alt, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         body = EXCLUDED.body,
         reading_minutes = EXCLUDED.reading_minutes,
         published_at = EXCLUDED.published_at,
         image_url = EXCLUDED.image_url,
         image_alt = EXCLUDED.image_alt,
         sort_order = EXCLUDED.sort_order`,
      [
        article.slug,
        article.title,
        article.excerpt,
        JSON.stringify(article.body ?? []),
        article.reading_minutes,
        article.published_at,
        article.image_url,
        article.image_alt,
        article.sort_order ?? 0,
      ],
    );
  }
}

async function main() {
  await migrate();
  await seedSettings();
  await seedCategories();
  await seedProducts();
  await seedProjects();
  await seedArticles();
  const counts = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM categories)::int AS categories,
       (SELECT COUNT(*) FROM products)::int AS products,
       (SELECT COUNT(*) FROM projects)::int AS projects,
       (SELECT COUNT(*) FROM articles)::int AS articles`,
  );
  console.log('Seed complete:', counts.rows[0]);
  await pool.end();
}

main().catch(async (error) => {
  console.error('Seed failed:', error);
  await pool.end().catch(() => {});
  process.exit(1);
});
