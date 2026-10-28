import { readFile } from 'node:fs/promises';
import { pool } from './db.js';
import { settings, categories, dishes, testimonials } from './seed-data.js';

// Idempotent: running it twice keeps the same content and never touches
// `reservations` (guest data).
async function run() {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);

  for (const [key, value] of Object.entries(settings)) {
    await pool.query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, value],
    );
  }

  for (const category of categories) {
    await pool.query(
      `INSERT INTO menu_categories (slug, title, description, sort_order)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE
         SET title = EXCLUDED.title, description = EXCLUDED.description,
             sort_order = EXCLUDED.sort_order`,
      [category.slug, category.title, category.description, category.sort_order],
    );
  }

  for (const dish of dishes) {
    await pool.query(
      `INSERT INTO dishes (slug, name, category_slug, description, price_label, image_url,
                           image_alt, is_available, is_featured, tags, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name, category_slug = EXCLUDED.category_slug,
             description = EXCLUDED.description, price_label = EXCLUDED.price_label,
             image_url = EXCLUDED.image_url, image_alt = EXCLUDED.image_alt,
             is_available = EXCLUDED.is_available, is_featured = EXCLUDED.is_featured,
             tags = EXCLUDED.tags, sort_order = EXCLUDED.sort_order`,
      [
        dish.slug,
        dish.name,
        dish.category_slug,
        dish.description,
        dish.price_label,
        dish.image_url,
        dish.image_alt,
        dish.is_available,
        dish.is_featured,
        dish.tags,
        dish.sort_order,
      ],
    );
  }

  // Testimonials have no natural key, so they are replaced as a set.
  await pool.query('DELETE FROM testimonials');
  for (const item of testimonials) {
    await pool.query(
      `INSERT INTO testimonials (name, role, quote, rating, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [item.name, item.role, item.quote, item.rating, item.sort_order],
    );
  }

  console.log(
    `seed: ${Object.keys(settings).length} settings, ${categories.length} categories, ` +
      `${dishes.length} dishes, ${testimonials.length} testimonials`,
  );
}

run()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error('seed failed:', error);
    await pool.end();
    process.exit(1);
  });
