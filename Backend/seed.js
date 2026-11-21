import dotenv from 'dotenv';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { initialSarees } from './data/initialData.js';

dotenv.config();

async function runSeed() {
  console.log('--- Nandani Batik Supabase Seeder ---');
  if (!isSupabaseConfigured() || !supabase) {
    console.error('ERROR: Supabase is not configured in .env file!');
    console.error('Please add SUPABASE_URL and SUPABASE_ANON_KEY to Backend/.env');
    process.exit(1);
  }

  console.log('Connecting to Supabase at:', process.env.SUPABASE_URL);

  // 1. Seed Sarees
  console.log('\nSeeding sarees...');
  for (const s of initialSarees) {
    const payload = {
      id: s.id,
      name: s.name,
      sinhala_name: s.sinhalaName,
      category: s.category,
      category_label: s.categoryLabel,
      fabric: s.fabric,
      primary_color: s.primaryColor,
      color_hex: s.colorHex,
      price: s.price,
      original_price: s.originalPrice,
      discount_percent: s.discountPercent,
      in_stock: s.inStock,
      is_new: s.isNew,
      is_bestseller: s.isBestseller,
      rating: s.rating,
      reviews_count: s.reviewsCount,
      image: s.image,
      hover_image: s.hoverImage,
      additional_images: s.additionalImages,
      description: s.description,
      pallu_details: s.palluDetails,
      blouse_piece: s.blousePiece,
      length: s.length,
      wash_care: s.washCare,
      craft_time: s.craftTime,
      tags: s.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('sarees').upsert(payload);
    if (error) {
      console.warn(`Saree ${s.name} error:`, error.message);
    } else {
      console.log(`✓ Saree: ${s.name}`);
    }
  }

  console.log('\nDatabase seeding completed successfully!');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
