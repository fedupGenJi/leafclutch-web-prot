require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

const REQUIRED_TABLES = [
  'hero_content',
  'socials',
  'services',
  'jobs',
  'internships',
];

// Prefer a single DATABASE_URL (what most hosted Postgres providers give you),
// but fall back to discrete PG* vars if that's what's in the env instead.
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      // Most hosted providers (Supabase, Neon, RDS, etc.) require SSL and use
      // a self-signed/chain cert that Node won't validate by default. Set
      // PGSSL=false in .env to disable this for a local Postgres instance.
      ssl:
        process.env.PGSSL === 'false'
          ? false
          : { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'leafclutch',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(connectionConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

async function listTables() {
  const { rows } = await pool.query(
    `SELECT table_name AS name
       FROM information_schema.tables
      WHERE table_schema = 'public'`
  );
  return rows.map((row) => row.name);
}

/**
 * Checks which of the required tables already exist, runs the schema to create
 * anything missing, then verifies the result. Returns a report so the caller
 * can log exactly what happened on boot.
 */
async function ensureTables() {
  const before = new Set(await listTables());
  const missing = REQUIRED_TABLES.filter((t) => !before.has(t));

  await pool.query(fs.readFileSync(SCHEMA_FILE, 'utf-8'));

  const after = new Set(await listTables());
  const stillMissing = REQUIRED_TABLES.filter((t) => !after.has(t));

  if (stillMissing.length) {
    throw new Error(`Schema bootstrap failed, still missing: ${stillMissing.join(', ')}`);
  }

  return {
    existing: REQUIRED_TABLES.filter((t) => before.has(t)),
    created: missing,
  };
}

module.exports = { pool, ensureTables, REQUIRED_TABLES };
