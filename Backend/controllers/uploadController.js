import fs from 'fs';
import { supabase, isSupabaseConfigured, uploadImageToSupabase } from '../config/db.js';

// Upload image handler (Supabase Storage with Local Disk Fallback)
export async function uploadImage(req, res) {
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
    const PORT = process.env.PORT || 5000;
    const localUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: localUrl, storage: 'local' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
