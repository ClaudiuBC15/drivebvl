-- =====================================================
-- Start Drive BVL — Cloudflare D1 Schema
-- =====================================================

-- Blog Articles
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT DEFAULT '[]',
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT DEFAULT 'draft',
  author TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- FAQ
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Categorii Auto
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  hero_title TEXT,
  hero_subtitle TEXT,
  description TEXT DEFAULT '[]',
  what_you_can_drive TEXT DEFAULT '[]',
  conditions TEXT DEFAULT '[]',
  documents TEXT DEFAULT '[]',
  duration_info TEXT,
  info_note TEXT,
  testimonials TEXT DEFAULT '[]',
  graduate_images TEXT DEFAULT '[]',
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Instructori
CREATE TABLE IF NOT EXISTS instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  categories TEXT,
  experience TEXT,
  hours TEXT,
  students TEXT,
  tags TEXT DEFAULT '[]',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Galerie
CREATE TABLE IF NOT EXISTS gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  album TEXT DEFAULT 'general',
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  media_type TEXT DEFAULT 'image',
  video_url TEXT,
  layout_size TEXT DEFAULT 'normal',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Lead-uri (Cereri de Înscriere)
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT,
  message TEXT,
  status TEXT DEFAULT 'nou',
  source TEXT DEFAULT 'website',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Uploads (Imagine / Fișiere stocate binar în D1)
CREATE TABLE IF NOT EXISTS uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Mașini (Flotă)
CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model TEXT NOT NULL,
  tag TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Setări Generale Site
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Testimoniale Generale
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  source TEXT DEFAULT 'Google',
  sort_order INTEGER DEFAULT 0
);

