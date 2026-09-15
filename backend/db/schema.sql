-- Schema bootstrap. Every statement is IF NOT EXISTS, so this file is safe to
-- run on every boot: it creates whatever is missing and leaves existing tables
-- (and their data) untouched.

-- Single-row table. The id CHECK keeps it that way — there is only ever one
-- set of hero/company content.
CREATE TABLE IF NOT EXISTS hero_content (
  id               INTEGER PRIMARY KEY CHECK (id = 1),
  description      TEXT,
  email_primary    TEXT,
  email_secondary  TEXT,
  phone_primary    TEXT,
  phone_secondary  TEXT,
  address_display  TEXT,
  map_link         TEXT,
  updated_at       TIMESTAMPTZ
);

-- Socials are a table rather than columns on hero_content so an admin can add
-- or delete platforms later without a migration. icon_key maps to the SVG set
-- in the frontend; sort_order controls the row order in the footer.
CREATE TABLE IF NOT EXISTS socials (
  id          SERIAL PRIMARY KEY,
  platform    TEXT NOT NULL UNIQUE,
  label       TEXT,
  icon_key    TEXT NOT NULL,
  url         TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS services (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- location and apply_link support the admin "jobs" API, which presents jobs
-- and internships as one merged list (see routes/admin.routes.js).
CREATE TABLE IF NOT EXISTS jobs (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  location     TEXT,
  apply_link   TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS internships (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  location     TEXT,
  apply_link   TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- Single admin account. email is unique so ensureAdmin.js can safely check
-- "does this email already exist" on every boot without ever duplicating a
-- row. password_hash is a bcrypt hash — the plaintext password is never
-- stored, only emailed once at creation time.
CREATE TABLE IF NOT EXISTS admin (
  id             SERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe to re-run: only applies if this schema.sql already ran once before
-- these columns existed.
ALTER TABLE jobs        ADD COLUMN IF NOT EXISTS location   TEXT;
ALTER TABLE jobs        ADD COLUMN IF NOT EXISTS apply_link TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS location   TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS apply_link TEXT;

CREATE INDEX IF NOT EXISTS idx_services_sort    ON services (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_jobs_sort        ON jobs (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_internships_sort ON internships (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_socials_sort     ON socials (is_active, sort_order);
