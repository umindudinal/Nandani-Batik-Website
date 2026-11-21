import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured, uploadImageToSupabase } from '../supabaseClient.js';
import { initialSarees } from '../data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local JSON DB fallback path (stored in Backend/data/db.json)
export const dbPath = path.join(__dirname, '..', 'data', 'db.json');

export function getLocalDb() {
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      sarees: [...initialSarees],
      orders: [],
      customers: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.sarees) parsed.sarees = [];
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.customers) parsed.customers = [];
    return parsed;
  } catch (err) {
    console.error('Error reading local db:', err);
    return { sarees: initialSarees, orders: [], customers: [] };
  }
}

export function saveLocalDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving local db:', err);
  }
}

export { supabase, isSupabaseConfigured, uploadImageToSupabase };
