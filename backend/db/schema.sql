-- Schema bootstrap. Every statement is IF NOT EXISTS, so this file is safe to
-- run on every boot: it creates whatever is missing and leaves existing tables
-- (and their data) untouched.

-- Single-row table. The id CHECK keeps it that way — there is only ever one
-- set of hero/company content.
CREATE TABLE IF NOT EXISTS hero_content (
  id               INTEGER PRIMARY KEY CHECK (id = 1),
  description      TEXT,
  email            TEXT,
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

CREATE TABLE IF NOT EXISTS jobs (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS internships (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_services_sort    ON services (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_jobs_sort        ON jobs (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_internships_sort ON internships (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_socials_sort     ON socials (is_active, sort_order);
