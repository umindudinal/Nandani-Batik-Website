import { supabase, isSupabaseConfigured, getLocalDb, saveLocalDb } from '../config/db.js';
import { mapDbSareeToJs, mapJsSareeToDb } from '../utils/mappers.js';

// 1. List All Sarees (with filters)
export async function getSarees(req, res) {
  try {
    const { category, fabricType, designType, colourType, mainColour, inStock, search } = req.query;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('sarees').select('*').order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.or(`category.eq.${category},fabric_type.eq.${category}`);
      }
      if (fabricType && fabricType !== 'all') {
        query = query.eq('fabric_type', fabricType);
      }
      if (designType && designType !== 'all') {
        query = query.eq('design_type', designType);
      }
      if (colourType && colourType !== 'all') {
        query = query.eq('colour_type', colourType);
      }
      if (mainColour && mainColour !== 'all') {
        query = query.or(`main_colour.eq.${mainColour},primary_color.eq.${mainColour}`);
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
            (item.fabricType && item.fabricType.toLowerCase().includes(s)) ||
            (item.designType && item.designType.toLowerCase().includes(s)) ||
            (item.colourType && item.colourType.toLowerCase().includes(s)) ||
            (item.mainColour && item.mainColour.toLowerCase().includes(s)) ||
            (item.fabric && item.fabric.toLowerCase().includes(s))
        );
      }
      return res.json(result);
    }

    // Local DB fallback
    const db = getLocalDb();
    let list = db.sarees || [];

    if (category && category !== 'all') {
      list = list.filter((s) => s.category === category || s.fabricType === category);
    }
    if (fabricType && fabricType !== 'all') {
      list = list.filter((s) => s.fabricType === fabricType);
    }
    if (designType && designType !== 'all') {
      list = list.filter((s) => s.designType === designType);
    }
    if (colourType && colourType !== 'all') {
      list = list.filter((s) => s.colourType === colourType);
    }
    if (mainColour && mainColour !== 'all') {
      list = list.filter((s) => s.mainColour === mainColour || s.primaryColor === mainColour);
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
          (item.fabricType && item.fabricType.toLowerCase().includes(s)) ||
          (item.designType && item.designType.toLowerCase().includes(s)) ||
          (item.colourType && item.colourType.toLowerCase().includes(s)) ||
          (item.mainColour && item.mainColour.toLowerCase().includes(s)) ||
          (item.fabric && item.fabric.toLowerCase().includes(s))
      );
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Get Single Saree
export async function getSareeById(req, res) {
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
}

// 3. Create Saree
export async function createSaree(req, res) {
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
}

// 4. Update Saree
export async function updateSaree(req, res) {
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
}

// 5. Quick Toggle Saree Field
export async function toggleSaree(req, res) {
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
}

// 6. Delete Saree
export async function deleteSaree(req, res) {
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
}
