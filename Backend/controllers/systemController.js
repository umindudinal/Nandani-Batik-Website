import { supabase, isSupabaseConfigured, getLocalDb } from '../config/db.js';
import { initialSarees } from '../data/initialData.js';
import {
  mapDbSareeToJs,
  mapDbOrderToJs,
  mapDbCustomerToJs,
  mapJsSareeToDb,
} from '../utils/mappers.js';

// 1. Health & Connection Status
export async function getHealth(req, res) {
  const configured = isSupabaseConfigured();
  let supabaseConnected = false;
  let supabaseError = null;

  if (configured && supabase) {
    try {
      const { error } = await supabase.from('sarees').select('id', { count: 'exact', head: true });
      if (!error) {
        supabaseConnected = true;
      } else {
        supabaseError = error.message;
      }
    } catch (err) {
      supabaseError = err.message;
    }
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    supabase: {
      configured,
      connected: supabaseConnected,
      url: process.env.SUPABASE_URL || null,
      error: supabaseError,
    },
    mode: supabaseConnected ? 'supabase' : 'local_database',
  });
}

// 2. Statistics for Admin Dashboard
export async function getStats(req, res) {
  try {
    let sarees = [];
    let orders = [];
    let customers = [];

    if (isSupabaseConfigured() && supabase) {
      const { data: sData } = await supabase.from('sarees').select('*');
      const { data: oData } = await supabase.from('orders').select('*');
      const { data: cData } = await supabase.from('customers').select('*');
      sarees = (sData || []).map(mapDbSareeToJs);
      orders = (oData || []).map(mapDbOrderToJs);
      customers = (cData || []).map(mapDbCustomerToJs);
    } else {
      const db = getLocalDb();
      sarees = db.sarees || [];
      orders = db.orders || [];
      customers = db.customers || [];
    }

    const totalSarees = sarees.length;
    const inStockSarees = sarees.filter((s) => s.inStock).length;
    const outOfStockSarees = totalSarees - inStockSarees;
    const bestsellersCount = sarees.filter((s) => s.isBestseller).length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const processingOrders = orders.filter((o) => o.status === 'processing').length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
    const totalCustomers = customers.length;
    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status !== 'cancelled') {
        return sum + Number(o.grandTotal || 0);
      }
      return sum;
    }, 0);

    res.json({
      totalSarees,
      inStockSarees,
      outOfStockSarees,
      bestsellersCount,
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalCustomers,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 3. Seed Supabase Database
export async function seedDatabase(req, res) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return res.status(400).json({
        error: 'Supabase is not configured yet. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in Backend/.env',
      });
    }

    // Insert sarees
    for (const s of initialSarees) {
      await supabase.from('sarees').upsert(mapJsSareeToDb(s));
    }

    res.json({ success: true, message: 'Successfully seeded database!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
