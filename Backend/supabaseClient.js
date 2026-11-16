import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseKey &&
    supabaseKey.length > 20
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Upload an image buffer to Supabase Storage 'saree-images' bucket
 */
export async function uploadImageToSupabase(fileBuffer, fileName, mimeType) {
  if (!supabase) {
    throw new Error('Supabase is not configured yet');
  }

  const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const bucketName = 'saree-images';

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(cleanFileName, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
