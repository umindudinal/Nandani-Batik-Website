import { supabase, isSupabaseConfigured, getLocalDb, saveLocalDb } from '../config/db.js';
import { mapDbOrderToJs, mapJsOrderToDb } from '../utils/mappers.js';

// 1. List Orders
export async function getOrders(req, res) {
  try {
    const { status, phone, email } = req.query;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (phone && phone.trim() && email && email.trim()) {
        const clean = phone.replace(/[\s-+]/g, '');
        query = query.or(`phone.ilike.%${clean}%,whatsapp.ilike.%${clean}%,email.ilike.%${email.trim()}%`);
      } else if (phone && phone.trim()) {
        const clean = phone.replace(/[\s-+]/g, '');
        query = query.or(`phone.ilike.%${clean}%,whatsapp.ilike.%${clean}%`);
      } else if (email && email.trim()) {
        query = query.ilike('email', `%${email.trim()}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return res.json((data || []).map(mapDbOrderToJs));
    }

    const db = getLocalDb();
    let orders = db.orders || [];
    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }
    if ((phone && phone.trim()) || (email && email.trim())) {
      const clean = (phone || '').replace(/[\s-+]/g, '');
      const cleanEmail = (email || '').trim().toLowerCase();
      orders = orders.filter((o) => {
        const oPhone = (o.phone || '').replace(/[\s-+]/g, '');
        const oWa = (o.whatsapp || '').replace(/[\s-+]/g, '');
        const oEmail = (o.email || '').toLowerCase();
        const matchPhone = clean && (oPhone.includes(clean) || oWa.includes(clean) || clean.includes(oPhone));
        const matchEmail = cleanEmail && oEmail.includes(cleanEmail);
        return matchPhone || matchEmail;
      });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Create Order (Website Checkout) + auto customer sync
export async function createOrder(req, res) {
  try {
    const body = req.body;
    const orderReference = body.orderReference || `NB-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      ...body,
      orderReference,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const dbPayload = mapJsOrderToDb(newOrder);
      const { data, error } = await supabase.from('orders').insert([dbPayload]).select().single();
      if (error) throw error;

      // Automatically sync customer in Supabase customers table
      try {
        const custPhone = (body.phone || '').trim();
        if (custPhone) {
          const { data: existingCust } = await supabase
            .from('customers')
            .select('*')
            .eq('phone', custPhone)
            .maybeSingle();

          if (existingCust) {
            await supabase
              .from('customers')
              .update({
                full_name: body.customerName || existingCust.full_name,
                whatsapp: body.whatsapp || existingCust.whatsapp,
                email: body.email || existingCust.email,
                address: body.address || existingCust.address,
                district: body.district || existingCust.district,
                city: body.city || existingCust.city,
                notes: body.notes || existingCust.notes,
                orders_count: (Number(existingCust.orders_count) || 0) + 1,
                total_spent: (Number(existingCust.total_spent) || 0) + Number(body.grandTotal || 0),
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingCust.id);
          } else {
            await supabase.from('customers').insert([
              {
                full_name: body.customerName,
                phone: custPhone,
                whatsapp: body.whatsapp || custPhone,
                email: body.email || null,
                address: body.address,
                district: body.district || 'Colombo',
                city: body.city || null,
                notes: body.notes || null,
                orders_count: 1,
                total_spent: Number(body.grandTotal || 0),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);
          }
        }
      } catch (custErr) {
        console.warn('Customer auto-link to Supabase warning:', custErr.message);
      }

      return res.status(201).json(mapDbOrderToJs(data));
    }

    const db = getLocalDb();
    newOrder.id = `ord-${Date.now()}`;
    db.orders.unshift(newOrder);

    // Automatically sync customer in local DB
    try {
      const custPhone = (body.phone || '').trim();
      if (custPhone) {
        if (!db.customers) db.customers = [];
        const existingCust = db.customers.find((c) => c.phone === custPhone);
        if (existingCust) {
          existingCust.fullName = body.customerName || existingCust.fullName;
          existingCust.whatsapp = body.whatsapp || existingCust.whatsapp;
          if (body.email) existingCust.email = body.email;
          existingCust.address = body.address || existingCust.address;
          existingCust.district = body.district || existingCust.district;
          existingCust.city = body.city || existingCust.city;
          existingCust.ordersCount = (Number(existingCust.ordersCount) || 0) + 1;
          existingCust.totalSpent = (Number(existingCust.totalSpent) || 0) + Number(body.grandTotal || 0);
          existingCust.updatedAt = new Date().toISOString();
        } else {
          db.customers.unshift({
            id: `cust-${Date.now()}`,
            fullName: body.customerName,
            phone: custPhone,
            whatsapp: body.whatsapp || custPhone,
            email: body.email || '',
            address: body.address,
            district: body.district || 'Colombo',
            city: body.city || '',
            notes: body.notes || '',
            ordersCount: 1,
            totalSpent: Number(body.grandTotal || 0),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (custErr) {
      console.warn('Customer auto-link to local DB warning:', custErr.message);
    }

    saveLocalDb(db);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
}

// 3. Update Order Status
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (isSupabaseConfigured() && supabase) {
      const updates = { updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json(mapDbOrderToJs(data));
    }

    const db = getLocalDb();
    const order = db.orders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();
    saveLocalDb(db);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 4. Delete Order
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: `Order ${id} deleted` });
    }

    const db = getLocalDb();
    db.orders = db.orders.filter((o) => o.id !== id);
    saveLocalDb(db);
    res.json({ success: true, message: `Order ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
