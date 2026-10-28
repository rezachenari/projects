import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://misterkebab:misterkebab_local_dev@db:5432/misterkebab',
  max: 10,
});

export function query(text, params) {
  return pool.query(text, params);
}
