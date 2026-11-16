import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured, uploadImageToSupabase } from './supabaseClient.js';
import { initialSarees, initialCategories } from './data/initialData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Local JSON DB fallback path
const dbPath = path.join(__dirname, 'data', 'db.json');

function getLocalDb() {
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      sarees: [...initialSarees],
      categories: [...initialCategories],
      orders: [
        {
          id: 'ord-demo-01',
          orderReference: 'NB-842109',
          customerName: 'Kavindi Perera',
          phone: '077 123 4567',
          whatsapp: '077 123 4567',
          address: 'No 45, Temple Road',
          district: 'Colombo',
          city: 'Nugegoda',
          notes: 'Please deliver on Saturday morning if possible.',
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          items: [
            {
              id: 'nb-saree-01',
              name: 'Nil Manel Royal Indigo Silk Batik Saree',
              price: 28500,
              quantity: 1,
              image: '/sarees/saree 1.1.png'
            }
          ],
          subtotal: 28500,
          shippingFee: 0,
          grandTotal: 28500,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'ord-demo-02',
          orderReference: 'NB-519382',
          customerName: 'Anuki Fernando',
          phone: '071 987 6543',
          whatsapp: '071 987 6543',
          address: '24/B, Flower Road',
          district: 'Kandy',
          city: 'Kandy',
          notes: 'Gift wrapping requested.',
          paymentMethod: 'bank',
          paymentStatus: 'paid',
          items: [
            {
              id: 'nb-saree-04',
              name: 'Amber Sunburst Handloom Cotton Batik Saree',
              price: 16500,
              quantity: 1,
              image: '/sarees/saree 4.1.png'
            }
          ],
          subtotal: 16500,
          shippingFee: 0,
          grandTotal: 16500,
          status: 'processing',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ]
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db:', err);
    return { sarees: initialSarees, categories: initialCategories, orders: [] };
  }
}

function saveLocalDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving local db:', err);
  }
}

// Multer Storage Configuration (for file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, 'saree-' + uniqueSuffix + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Helper functions for mapping Supabase snake_case <-> camelCase
function mapDbSareeToJs(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    sinhalaName: item.sinhala_name || item.sinhalaName,
    category: item.category,
    categoryLabel: item.category_label || item.categoryLabel,
    fabric: item.fabric,
    primaryColor: item.primary_color || item.primaryColor,
    colorHex: item.color_hex || item.colorHex,
    price: Number(item.price),
    originalPrice: item.original_price != null ? Number(item.original_price) : Number(item.price),
    discountPercent: Number(item.discount_percent || 0),
    inStock: Boolean(item.in_stock ?? true),
    isNew: Boolean(item.is_new ?? false),
    isBestseller: Boolean(item.is_bestseller ?? false),
    rating: Number(item.rating || 5.0),
    reviewsCount: Number(item.reviews_count || 0),
    image: item.image,
    hoverImage: item.hover_image || item.image,
    additionalImages: item.additional_images || (item.image ? [item.image] : []),
    description: item.description,
    palluDetails: item.pallu_details || item.palluDetails,
    blousePiece: item.blouse_piece || item.blousePiece,
    length: item.length,
    washCare: item.wash_care || item.washCare,
    craftTime: item.craft_time || item.craftTime,
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: item.created_at || item.createdAt,
    updatedAt: item.updated_at || item.updatedAt,
  };
}

function mapJsSareeToDb(item) {
  return {
    id: item.id,
    name: item.name,
    sinhala_name: item.sinhalaName || null,
    category: item.category || 'pure-silk',
    category_label: item.categoryLabel || null,
    fabric: item.fabric || null,
    primary_color: item.primaryColor || null,
    color_hex: item.colorHex || null,
    price: item.price ? Number(item.price) : 0,
    original_price: item.originalPrice ? Number(item.originalPrice) : null,
    discount_percent: item.discountPercent ? Number(item.discountPercent) : 0,
    in_stock: item.inStock !== undefined ? Boolean(item.inStock) : true,
    is_new: item.isNew !== undefined ? Boolean(item.isNew) : false,
    is_bestseller: item.isBestseller !== undefined ? Boolean(item.isBestseller) : false,
    rating: item.rating ? Number(item.rating) : 5.0,
    reviews_count: item.reviewsCount ? Number(item.reviewsCount) : 0,
    image: item.image || '',
    hover_image: item.hoverImage || item.image || '',
    additional_images: item.additionalImages || (item.image ? [item.image] : []),
    description: item.description || null,
    pallu_details: item.palluDetails || null,
    blouse_piece: item.blousePiece || null,
    length: item.length || null,
    wash_care: item.washCare || null,
    craft_time: item.craftTime || null,
    tags: Array.isArray(item.tags) ? item.tags : [],
    updated_at: new Date().toISOString(),
  };
}

function mapDbOrderToJs(item) {
  if (!item) return null;
  return {
    id: item.id,
    orderReference: item.order_reference || item.orderReference,
    customerName: item.customer_name || item.customerName,
    phone: item.phone,
    whatsapp: item.whatsapp,
    address: item.address,
    district: item.district,
    city: item.city,
    notes: item.notes,
    paymentMethod: item.payment_method || item.paymentMethod,
    paymentStatus: item.payment_status || item.paymentStatus,
    items: typeof item.items === 'string' ? JSON.parse(item.items) : (item.items || []),
    subtotal: Number(item.subtotal || 0),
    shippingFee: Number(item.shipping_fee || item.shippingFee || 0),
    grandTotal: Number(item.grand_total || item.grandTotal || 0),
    status: item.status || 'pending',
    createdAt: item.created_at || item.createdAt,
    updatedAt: item.updated_at || item.updatedAt,
  };
}

function mapJsOrderToDb(item) {
  return {
    order_reference: item.orderReference,
    customer_name: item.customerName,
    phone: item.phone,
    whatsapp: item.whatsapp || null,
    address: item.address,
    district: item.district,
    city: item.city || null,
    notes: item.notes || null,
    payment_method: item.paymentMethod || 'cod',
    payment_status: item.paymentStatus || 'pending',
    items: item.items || [],
    subtotal: item.subtotal || 0,
    shipping_fee: item.shippingFee || 0,
    grand_total: item.grandTotal || 0,
    status: item.status || 'pending',
    updated_at: new Date().toISOString(),
  };
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health & Connection Status
app.get('/api/health', async (req, res) => {
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
});

// 2. Statistics for Admin Dashboard
app.get('/api/stats', async (req, res) => {
  try {
    let sarees = [];
    let orders = [];

    if (isSupabaseConfigured() && supabase) {
      const { data: sData } = await supabase.from('sarees').select('*');
      const { data: oData } = await supabase.from('orders').select('*');
      sarees = (sData || []).map(mapDbSareeToJs);
      orders = (oData || []).map(mapDbOrderToJs);
    } else {
      const db = getLocalDb();
      sarees = db.sarees || [];
      orders = db.orders || [];
    }

    const totalSarees = sarees.length;
    const inStockSarees = sarees.filter((s) => s.inStock).length;
    const outOfStockSarees = totalSarees - inStockSarees;
    const bestsellersCount = sarees.filter((s) => s.isBestseller).length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const processingOrders = orders.filter((o) => o.status === 'processing').length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
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
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. SAREES: List All (with optional filter)
app.get('/api/sarees', async (req, res) => {
  try {
    const { category, inStock, search } = req.query;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('sarees').select('*').order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (inStock !== undefined) {
        query = query.eq('in_stock', inStock === 'true');
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = (data || []).map(mapDbSareeToJs);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(s) ||
            (item.sinhalaName && item.sinhalaName.toLowerCase().includes(s)) ||
            (item.fabric && item.fabric.toLowerCase().includes(s))
        );
      }
      return res.json(result);
    }

    // Local DB fallback
    const db = getLocalDb();
    let list = db.sarees || [];

    if (category && category !== 'all') {
      list = list.filter((s) => s.category === category);
    }
    if (inStock !== undefined) {
      list = list.filter((s) => String(s.inStock) === inStock);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(s) ||
          (item.sinhalaName && item.sinhalaName.toLowerCase().includes(s)) ||
          (item.fabric && item.fabric.toLowerCase().includes(s))
      );
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. SAREES: Get Single Saree
app.get('/api/sarees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('sarees').select('*').eq('id', id).single();
      if (error) return res.status(404).json({ error: 'Saree not found' });
      return res.json(mapDbSareeToJs(data));
    }

    const db = getLocalDb();
    const item = (db.sarees || []).find((s) => s.id === id);
    if (!item) return res.status(404).json({ error: 'Saree not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. SAREES: Create New Saree
app.post('/api/sarees', async (req, res) => {
  try {
    const body = req.body;
    const sareeId = body.id || `nb-saree-${Date.now().toString().slice(-6)}`;
    const newSaree = {
      ...body,
      id: sareeId,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      isNew: body.isNew !== undefined ? Boolean(body.isNew) : true,
      isBestseller: body.isBestseller !== undefined ? Boolean(body.isBestseller) : false,
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const dbPayload = mapJsSareeToDb(newSaree);
      dbPayload.created_at = newSaree.createdAt;

      const { data, error } = await supabase.from('sarees').insert([dbPayload]).select().single();
      if (error) throw error;
      return res.status(201).json(mapDbSareeToJs(data));
    }

    // Local DB
    const db = getLocalDb();
    db.sarees.unshift(newSaree);
    saveLocalDb(db);
    res.status(201).json(newSaree);
  } catch (err) {
    console.error('Error creating saree:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. SAREES: Update Saree
app.put('/api/sarees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (isSupabaseConfigured() && supabase) {
      const dbPayload = mapJsSareeToDb({ ...body, id });
      const { data, error } = await supabase
        .from('sarees')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json(mapDbSareeToJs(data));
    }

    // Local DB
    const db = getLocalDb();
    const index = db.sarees.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Saree not found' });

    db.sarees[index] = {
      ...db.sarees[index],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    saveLocalDb(db);
    res.json(db.sarees[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. SAREES: Quick Toggle (inStock, isBestseller, isNew)
app.patch('/api/sarees/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body; // e.g. field: 'inStock', value: false

    if (!['inStock', 'isBestseller', 'isNew'].includes(field)) {
      return res.status(400).json({ error: 'Invalid toggle field' });
    }

    if (isSupabaseConfigured() && supabase) {
      const dbFieldMap = {
        inStock: 'in_stock',
        isBestseller: 'is_bestseller',
        isNew: 'is_new',
      };
      const dbField = dbFieldMap[field];
      const { data, error } = await supabase
        .from('sarees')
        .update({ [dbField]: value, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json(mapDbSareeToJs(data));
    }

    const db = getLocalDb();
    const saree = db.sarees.find((s) => s.id === id);
    if (!saree) return res.status(404).json({ error: 'Saree not found' });

    saree[field] = value;
    saree.updatedAt = new Date().toISOString();
    saveLocalDb(db);
    res.json(saree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. SAREES: Delete Saree
app.delete('/api/sarees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('sarees').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: `Saree ${id} deleted successfully` });
    }

    const db = getLocalDb();
    db.sarees = db.sarees.filter((s) => s.id !== id);
    saveLocalDb(db);
    res.json({ success: true, message: `Saree ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. UPLOAD IMAGE (Supabase Storage with Local Disk Fallback)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Try uploading to Supabase Storage if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const publicUrl = await uploadImageToSupabase(
          fileBuffer,
          req.file.originalname,
          req.file.mimetype
        );
        // Clean up temp local file
        fs.unlink(req.file.path, () => {});
        return res.json({ url: publicUrl, storage: 'supabase' });
      } catch (uploadErr) {
        console.warn('Supabase storage upload failed, keeping local file:', uploadErr.message);
      }
    }

    // Fallback: Return local upload URL
    const localUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: localUrl, storage: 'local' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. ORDERS: List Orders
app.get('/api/orders', async (req, res) => {
  try {
    const { status } = req.query;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        query = query.eq('status', status);
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
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. ORDERS: Create Order (from Website Checkout)
app.post('/api/orders', async (req, res) => {
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
      return res.status(201).json(mapDbOrderToJs(data));
    }

    const db = getLocalDb();
    newOrder.id = `ord-${Date.now()}`;
    db.orders.unshift(newOrder);
    saveLocalDb(db);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
});

// 12. ORDERS: Update Status
app.patch('/api/orders/:id/status', async (req, res) => {
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
});

// 13. ORDERS: Delete Order
app.delete('/api/orders/:id', async (req, res) => {
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
});

// 14. CATEGORIES: List
app.get('/api/categories', async (req, res) => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      const normalized = (data || []).map((c) => ({
        id: c.id,
        name: c.name,
        sinhalaName: c.sinhala_name || c.sinhalaName || '',
        sinhala_name: c.sinhala_name || c.sinhalaName || '',
        description: c.description || '',
        image: c.image || '',
        created_at: c.created_at,
      }));
      return res.json(normalized);
    }
    const db = getLocalDb();
    const categories = db.categories || initialCategories;
    const normalized = categories.map((c) => ({
      id: c.id,
      name: c.name,
      sinhalaName: c.sinhalaName || c.sinhala_name || '',
      sinhala_name: c.sinhalaName || c.sinhala_name || '',
      description: c.description || '',
      image: c.image || '',
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14.1 CATEGORIES: Create
app.post('/api/categories', async (req, res) => {
  try {
    const { name, sinhalaName, description, image, id } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const catId = (id || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (isSupabaseConfigured() && supabase) {
      const payload = {
        id: catId,
        name: name.trim(),
        sinhala_name: sinhalaName?.trim() || '',
        description: description?.trim() || '',
        image: image?.trim() || '',
      };
      const { data, error } = await supabase
        .from('categories')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({
        id: data.id,
        name: data.name,
        sinhalaName: data.sinhala_name || '',
        sinhala_name: data.sinhala_name || '',
        description: data.description || '',
        image: data.image || '',
      });
    }

    const db = getLocalDb();
    if (!db.categories) db.categories = [...initialCategories];
    const newCat = {
      id: catId,
      name: name.trim(),
      sinhalaName: sinhalaName?.trim() || '',
      description: description?.trim() || '',
      image: image?.trim() || '',
    };
    db.categories.push(newCat);
    saveLocalDb(db);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14.2 CATEGORIES: Update
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sinhalaName, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    if (isSupabaseConfigured() && supabase) {
      const updateData = {
        name: name.trim(),
        sinhala_name: sinhalaName?.trim() || '',
        description: description?.trim() || '',
        image: image?.trim() || '',
      };

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      // Update category_label on sarees that have this category
      await supabase
        .from('sarees')
        .update({ category_label: name.trim() })
        .eq('category', id);

      return res.json({
        id: data.id,
        name: data.name,
        sinhalaName: data.sinhala_name || '',
        sinhala_name: data.sinhala_name || '',
        description: data.description || '',
        image: data.image || '',
      });
    }

    const db = getLocalDb();
    if (!db.categories) db.categories = [...initialCategories];
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.categories[idx] = {
      ...db.categories[idx],
      name: name.trim(),
      sinhalaName: sinhalaName?.trim() || '',
      description: description?.trim() || '',
      image: image?.trim() || '',
    };

    if (db.sarees) {
      db.sarees.forEach((s) => {
        if (s.category === id) {
          s.categoryLabel = name.trim();
        }
      });
    }

    saveLocalDb(db);
    res.json(db.categories[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14.3 CATEGORIES: Delete
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      return res.status(400).json({ error: 'Cannot delete default "All Sarees" category' });
    }

    if (isSupabaseConfigured() && supabase) {
      // Find fallback category
      const { data: otherCats } = await supabase
        .from('categories')
        .select('id, name')
        .neq('id', id)
        .neq('id', 'all')
        .limit(1);

      const fallbackId = otherCats?.[0]?.id || 'pure-silk';
      const fallbackLabel = otherCats?.[0]?.name || 'Pure Silk';

      // Reassign sarees to fallback category
      await supabase
        .from('sarees')
        .update({ category: fallbackId, category_label: fallbackLabel })
        .eq('category', id);

      // Delete the category
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;

      return res.json({
        success: true,
        message: `Category "${id}" deleted. Existing sarees were reassigned to "${fallbackLabel}".`,
      });
    }

    const db = getLocalDb();
    if (!db.categories) db.categories = [...initialCategories];
    const initialLen = db.categories.length;
    db.categories = db.categories.filter((c) => c.id !== id);

    if (db.categories.length === initialLen) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const remainingCat = db.categories.find((c) => c.id !== 'all') || {
      id: 'pure-silk',
      name: 'Pure Silk',
    };

    if (db.sarees) {
      db.sarees.forEach((s) => {
        if (s.category === id) {
          s.category = remainingCat.id;
          s.categoryLabel = remainingCat.name;
        }
      });
    }

    saveLocalDb(db);
    res.json({
      success: true,
      message: `Category "${id}" deleted. Existing sarees reassigned to "${remainingCat.name}".`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. SEED: Populate Supabase if empty
app.post('/api/seed', async (req, res) => {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return res.status(400).json({
        error: 'Supabase is not configured yet. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in Backend/.env',
      });
    }

    // Insert categories
    for (const cat of initialCategories) {
      await supabase.from('categories').upsert({
        id: cat.id,
        name: cat.name,
        sinhala_name: cat.sinhalaName,
        description: cat.description,
        image: cat.image,
      });
    }

    // Insert sarees
    for (const s of initialSarees) {
      await supabase.from('sarees').upsert(mapJsSareeToDb(s));
    }

    res.json({ success: true, message: 'Successfully seeded categories and sarees to Supabase!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Nandani Batik Backend API running on port ${PORT}`);
  console.log(` Endpoint: http://localhost:${PORT}/api/health`);
  console.log(` Supabase Configured: ${isSupabaseConfigured()}`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`Another terminal or background server is already running on port ${PORT}.\n`);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
