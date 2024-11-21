import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'payment.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    qr_code_image TEXT,
    total_amount REAL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payment_proofs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initialize settings if not exists
const initSettings = db.prepare(`
  INSERT OR IGNORE INTO settings (id, qr_code_image, total_amount)
  VALUES (1, '', 0)
`);
initSettings.run();

export { db };