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
      id,
      customerId,
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
    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : null;
    const targetId = id || customerId || null;

    if (isSupabaseConfigured() && supabase) {
      // 1. Check for existing customer by PHONE
      const { data: customerByPhone } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();

      // 2. Check for existing customer by EMAIL
      const { data: customerByEmail } = cleanEmail
        ? await supabase
            .from('customers')
            .select('*')
            .ilike('email', cleanEmail)
            .maybeSingle()
        : { data: null };

      // 3. Check for existing customer by ID
      const { data: customerById } = targetId
        ? await supabase
            .from('customers')
            .select('*')
            .eq('id', targetId)
            .maybeSingle()
        : { data: null };

      // Resolve duplicate account conflict / auto-merge if phone & email belong to separate rows
      let targetRecord = null;

      if (customerByPhone && customerByEmail && customerByPhone.id !== customerByEmail.id) {
        // Two separate accounts found!
        // Prioritize the real phone record or the established account
        let keepRecord = customerByPhone;
        let removeRecord = customerByEmail;

        if (customerByPhone.phone && customerByPhone.phone.startsWith('g-')) {
          keepRecord = customerByEmail;
          removeRecord = customerByPhone;
        }

        // Migrate any orders attached to removeRecord before deleting
        try {
          await supabase.from('orders').update({ customer_id: keepRecord.id }).eq('customer_id', removeRecord.id);
        } catch (_) {}

        // Delete the temporary or redundant record to free up unique constraints
        await supabase.from('customers').delete().eq('id', removeRecord.id);
        targetRecord = keepRecord;
      } else if (customerByPhone && customerById && customerByPhone.id !== customerById.id) {
        let keepRecord = customerByPhone;
        let removeRecord = customerById;

        if (customerByPhone.phone && customerByPhone.phone.startsWith('g-')) {
          keepRecord = customerById;
          removeRecord = customerByPhone;
        }

        try {
          await supabase.from('orders').update({ customer_id: keepRecord.id }).eq('customer_id', removeRecord.id);
        } catch (_) {}

        await supabase.from('customers').delete().eq('id', removeRecord.id);
        targetRecord = keepRecord;
      } else if (customerByEmail && customerById && customerByEmail.id !== customerById.id) {
        let keepRecord = customerByEmail;
        let removeRecord = customerById;

        if (customerByEmail.phone && customerByEmail.phone.startsWith('g-')) {
          keepRecord = customerById;
          removeRecord = customerByEmail;
        }

        try {
          await supabase.from('orders').update({ customer_id: keepRecord.id }).eq('customer_id', removeRecord.id);
        } catch (_) {}

        await supabase.from('customers').delete().eq('id', removeRecord.id);
        targetRecord = keepRecord;
      } else {
        targetRecord = customerByPhone || customerByEmail || customerById;
      }

      if (targetRecord) {
        const updatePayload = {
          full_name: fullName.trim(),
          phone: cleanPhone,
          whatsapp: (whatsapp && whatsapp.trim()) || cleanPhone || targetRecord.whatsapp,
          email: cleanEmail || targetRecord.email,
          address: address.trim(),
          district: district || targetRecord.district || 'Colombo',
          city: (city && city.trim()) || targetRecord.city,
          postal_code: (postalCode && postalCode.trim()) || targetRecord.postal_code,
          notes: (notes && notes.trim()) || targetRecord.notes,
          updated_at: new Date().toISOString(),
        };
        if (password) updatePayload.password = password;

        const { data: updated, error: updateErr } = await supabase
          .from('customers')
          .update(updatePayload)
          .eq('id', targetRecord.id)
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
          email: cleanEmail || null,
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

    const phoneIdx = db.customers.findIndex((c) => c.phone && (c.phone === cleanPhone || c.phone.replace(/[\s-]/g, '') === cleanPhone));
    const emailIdx = cleanEmail ? db.customers.findIndex((c) => c.email && c.email.toLowerCase() === cleanEmail) : -1;
    const idIdx = targetId ? db.customers.findIndex((c) => c.id === targetId) : -1;

    let targetIdx = phoneIdx !== -1 ? phoneIdx : (emailIdx !== -1 ? emailIdx : idIdx);

    // Merge if phone and email match two separate entries
    if (phoneIdx !== -1 && emailIdx !== -1 && phoneIdx !== emailIdx) {
      const isEmailTemp = db.customers[emailIdx].phone && db.customers[emailIdx].phone.startsWith('g-');
      const removeIndex = isEmailTemp ? emailIdx : phoneIdx;
      const keepIndex = isEmailTemp ? phoneIdx : emailIdx;
      const keepItem = db.customers[keepIndex];
      db.customers.splice(removeIndex, 1);
      targetIdx = db.customers.indexOf(keepItem);
    }

    if (targetIdx !== -1) {
      const existing = db.customers[targetIdx];
      const updated = {
        ...existing,
        fullName: fullName.trim(),
        phone: cleanPhone,
        whatsapp: (whatsapp && whatsapp.trim()) || cleanPhone || existing.whatsapp,
        email: cleanEmail || existing.email,
        address: address.trim(),
        district: district || existing.district || 'Colombo',
        city: (city && city.trim()) || existing.city,
        postalCode: (postalCode && postalCode.trim()) || existing.postalCode,
        notes: (notes && notes.trim()) || existing.notes,
        updatedAt: new Date().toISOString(),
      };
      if (password) updated.password = password;

      db.customers[targetIdx] = updated;
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
        email: cleanEmail || '',
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

// 6. Customer Google OAuth Sign-In & Sign-Up Handler
export async function googleCustomerAuth(req, res) {
  try {
    const { email, fullName, photoURL, phone } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Valid email address is required from Google' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (fullName && fullName.trim()) || cleanEmail.split('@')[0] || 'Valued Customer';
    const cleanPhone = (phone && phone.trim()) || '';

    if (isSupabaseConfigured() && supabase) {
      // 1. Check if customer already exists by email
      const { data: existing, error: findErr } = await supabase
        .from('customers')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (findErr) throw findErr;

      if (existing) {
        return res.json({
          success: true,
          isNew: false,
          customer: mapDbCustomerToJs(existing),
          token: `nb_client_${Date.now()}`,
          message: 'Welcome back! Login successful',
        });
      }

      // 2. If not found, register new customer from Google account
      const insertPayload = {
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || `g-${Date.now().toString().slice(-8)}`,
        whatsapp: cleanPhone || null,
        address: '',
        district: 'Colombo',
        city: null,
        postal_code: null,
        notes: 'Signed up with Google Authentication',
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

      if (insertErr) {
        if (insertErr.code === '23505') {
          const { data: matched } = await supabase
            .from('customers')
            .select('*')
            .ilike('email', cleanEmail)
            .maybeSingle();
          if (matched) {
            return res.json({
              success: true,
              isNew: false,
              customer: mapDbCustomerToJs(matched),
              token: `nb_client_${Date.now()}`,
              message: 'Welcome back! Login successful',
            });
          }
        }
        throw insertErr;
      }

      return res.status(201).json({
        success: true,
        isNew: true,
        customer: mapDbCustomerToJs(created),
        token: `nb_client_${Date.now()}`,
        message: 'Account created with Google successfully',
      });
    }

    // Local DB Fallback
    const db = getLocalDb();
    if (!db.customers) db.customers = [];

    const existingIdx = db.customers.findIndex(
      (c) => c.email && c.email.toLowerCase() === cleanEmail
    );

    if (existingIdx !== -1) {
      return res.json({
        success: true,
        isNew: false,
        customer: db.customers[existingIdx],
        token: `nb_client_${Date.now()}`,
        message: 'Welcome back! Login successful',
      });
    }

    const newCustomer = {
      id: `cust-g-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '',
      whatsapp: cleanPhone || '',
      address: '',
      district: 'Colombo',
      city: '',
      postalCode: '',
      notes: 'Signed up with Google Authentication',
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
      message: 'Account created with Google successfully',
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: err.message });
  }
}
