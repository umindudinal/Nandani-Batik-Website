import { supabase, isSupabaseConfigured, getLocalDb, saveLocalDb } from '../config/db.js';
import { mapDbCustomerToJs } from '../utils/mappers.js';

// 1. List All Customers (for Admin Dashboard)
export async function getCustomers(req, res) {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.json((data || []).map(mapDbCustomerToJs));
    }

    const db = getLocalDb();
    if (!db.customers) db.customers = [];

    // Auto-sync customer records from orders if not already present in db.customers
    if (Array.isArray(db.orders) && db.orders.length > 0) {
      let modified = false;
      for (const order of db.orders) {
        if (!order.phone) continue;
        const cleanPhone = (order.phone || '').replace(/[\s-+]/g, '');
        const exists = db.customers.some(
          (c) => (c.phone || '').replace(/[\s-+]/g, '') === cleanPhone
        );
        if (!exists) {
          const custOrders = db.orders.filter(
            (o) => (o.phone || '').replace(/[\s-+]/g, '') === cleanPhone
          );
          const totalSpent = custOrders
            .filter((o) => o.status !== 'cancelled')
            .reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);

          db.customers.push({
            id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            fullName: order.customerName || 'Valued Customer',
            phone: order.phone,
            whatsapp: order.whatsapp || order.phone,
            email: order.email || '',
            address: order.address || '',
            district: order.district || 'Colombo',
            city: order.city || '',
            postalCode: order.postalCode || '',
            notes: order.notes || '',
            ordersCount: custOrders.length,
            totalSpent: totalSpent,
            createdAt: order.createdAt || new Date().toISOString(),
            updatedAt: order.createdAt || new Date().toISOString(),
          });
          modified = true;
        }
      }
      if (modified) {
        saveLocalDb(db);
      }
    }

    res.json(db.customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Fast Lookup by Phone
export async function getCustomerByPhone(req, res) {
  try {
    const rawPhone = (req.params.phone || '').trim();
    const cleanPhone = rawPhone.replace(/[\s-]/g, '');

    if (!cleanPhone) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`phone.eq.${rawPhone},phone.eq.${cleanPhone}`)
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        return res.json({ found: true, customer: mapDbCustomerToJs(data[0]) });
      }
      return res.json({ found: false });
    }

    const db = getLocalDb();
    const customers = db.customers || [];
    const found = customers.find(
      (c) =>
        (c.phone && c.phone.replace(/[\s-]/g, '') === cleanPhone) ||
        c.phone === rawPhone
    );

    if (found) {
      return res.json({ found: true, customer: found });
    }
    return res.json({ found: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 3. Register or Update Customer Profile
export async function registerCustomer(req, res) {
  try {
    const {
      fullName,
      phone,
      whatsapp,
      email,
      password,
      address,
      district,
      city,
      postalCode,
      notes,
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Contact phone number is required' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    const cleanPhone = phone.trim();

    if (isSupabaseConfigured() && supabase) {
      const { data: existing } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existing) {
        const updatePayload = {
          full_name: fullName.trim(),
          whatsapp: (whatsapp && whatsapp.trim()) || cleanPhone,
          email: (email && email.trim()) || existing.email,
          address: address.trim(),
          district: district || existing.district || 'Colombo',
          city: (city && city.trim()) || existing.city,
          postal_code: (postalCode && postalCode.trim()) || existing.postal_code,
          notes: (notes && notes.trim()) || existing.notes,
          updated_at: new Date().toISOString(),
        };
        if (password) updatePayload.password = password;

        const { data: updated, error: updateErr } = await supabase
          .from('customers')
          .update(updatePayload)
          .eq('id', existing.id)
          .select()
          .single();

        if (updateErr) throw updateErr;
        return res.json({
          success: true,
          isNew: false,
          customer: mapDbCustomerToJs(updated),
          token: `nb_client_${Date.now()}`,
          message: 'Customer profile updated successfully',
        });
      } else {
        const insertPayload = {
          full_name: fullName.trim(),
          phone: cleanPhone,
          whatsapp: (whatsapp && whatsapp.trim()) || cleanPhone,
          email: (email && email.trim()) || null,
          password: password || null,
          address: address.trim(),
          district: district || 'Colombo',
          city: (city && city.trim()) || null,
          postal_code: (postalCode && postalCode.trim()) || null,
          notes: (notes && notes.trim()) || null,
          orders_count: 0,
          total_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: created, error: insertErr } = await supabase
          .from('customers')
          .insert([insertPayload])
          .select()
          .single();

        if (insertErr) throw insertErr;
        return res.status(201).json({
          success: true,
          isNew: true,
          customer: mapDbCustomerToJs(created),
          token: `nb_client_${Date.now()}`,
          message: 'Customer registered successfully',
        });
      }
    }

    // Local DB Fallback
    const db = getLocalDb();
    if (!db.customers) db.customers = [];

    const existingIdx = db.customers.findIndex(
      (c) => c.phone && c.phone.trim() === cleanPhone
    );

    if (existingIdx !== -1) {
      const existing = db.customers[existingIdx];
      const updated = {
        ...existing,
        fullName: fullName.trim(),
        whatsapp: (whatsapp && whatsapp.trim()) || cleanPhone,
        email: (email && email.trim()) || existing.email,
        address: address.trim(),
        district: district || existing.district || 'Colombo',
        city: (city && city.trim()) || existing.city,
        postalCode: (postalCode && postalCode.trim()) || existing.postalCode,
        notes: (notes && notes.trim()) || existing.notes,
        updatedAt: new Date().toISOString(),
      };
      if (password) updated.password = password;

      db.customers[existingIdx] = updated;
      saveLocalDb(db);
      return res.json({
        success: true,
        isNew: false,
        customer: updated,
        token: `nb_client_${Date.now()}`,
        message: 'Customer profile updated successfully',
      });
    } else {
      const newCustomer = {
        id: `cust-${Date.now()}`,
        fullName: fullName.trim(),
        phone: cleanPhone,
        whatsapp: (whatsapp && whatsapp.trim()) || cleanPhone,
        email: (email && email.trim()) || '',
        password: password || '',
        address: address.trim(),
        district: district || 'Colombo',
        city: (city && city.trim()) || '',
        postalCode: (postalCode && postalCode.trim()) || '',
        notes: (notes && notes.trim()) || '',
        ordersCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.customers.unshift(newCustomer);
      saveLocalDb(db);
      return res.status(201).json({
        success: true,
        isNew: true,
        customer: newCustomer,
        token: `nb_client_${Date.now()}`,
        message: 'Customer registered successfully',
      });
    }
  } catch (err) {
    console.error('Error saving customer:', err);
    res.status(500).json({ error: err.message });
  }
}

// 4. Delete Customer (Admin only)
export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Customer record deleted successfully' });
    }

    const db = getLocalDb();
    if (!db.customers) db.customers = [];
    db.customers = db.customers.filter((c) => c.id !== id);
    saveLocalDb(db);
    res.json({ success: true, message: 'Customer record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 5. Customer Login Authentication
export async function loginCustomer(req, res) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    const clean = identifier.trim();
    const cleanPhone = clean.replace(/[\s-]/g, '');

    let foundCustomer = null;
    let customerPassword = null;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('customers').select('*');
      if (clean.includes('@')) {
        query = query.ilike('email', clean);
      } else {
        query = query.or(`phone.eq.${clean},phone.eq.${cleanPhone}`);
      }
      const { data, error } = await query.limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        foundCustomer = mapDbCustomerToJs(data[0]);
        customerPassword = data[0].password;
      }
    } else {
      const db = getLocalDb();
      const customers = db.customers || [];
      const match = customers.find((c) => {
        if (clean.includes('@')) {
          return c.email && c.email.toLowerCase() === clean.toLowerCase();
        }
        return (
          c.phone === clean ||
          (c.phone && c.phone.replace(/[\s-]/g, '') === cleanPhone)
        );
      });
      if (match) {
        foundCustomer = match;
        customerPassword = match.password;
      }
    }

    if (!foundCustomer) {
      return res.status(404).json({
        error: 'Account not found. Please create an account.'
      });
    }

    // If account has password and user provided password, check match
    if (customerPassword && password && customerPassword !== password) {
      return res.status(401).json({
        error: 'Incorrect password. Please try again.'
      });
    }

    return res.json({
      success: true,
      customer: foundCustomer,
      token: `nb_client_${Date.now()}`,
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Customer login error:', err);
    res.status(500).json({ error: err.message });
  }
}
