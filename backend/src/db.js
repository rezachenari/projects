import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://parsvitrin:parsvitrin@db:5432/parsvitrin',
  max: 10,
});

export function query(text, params) {
  return pool.query(text, params);
}
