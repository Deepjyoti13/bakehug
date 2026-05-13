-- Run this in the Supabase SQL editor to set up the BakeHug schema

CREATE TABLE IF NOT EXISTS categories (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  description TEXT,
  icon      TEXT DEFAULT '🎂',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id          SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2),
  image_path  TEXT,
  is_available INTEGER DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  discount    TEXT,
  item_id     INTEGER REFERENCES items(id) ON DELETE SET NULL,
  is_active   INTEGER DEFAULT 1,
  valid_until TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
