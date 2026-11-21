import saree_1_1 from '../assets/images/sarees/saree 1.1.png';
import saree_2_1 from '../assets/images/sarees/saree 2.1.png';
import saree_3_2 from '../assets/images/sarees/saree 3.2.png';
import saree_4_1 from '../assets/images/sarees/saree 4.1.png';

// 4 Primary Fabric Types as requested
export const FABRIC_TYPES = [
  'Normal Voil Sarees',
  'Super Voil Sarees',
  'Cotton Batik Sarees',
  'Silk Batik Sarees',
];

// 7 Saree Design Types
export const DESIGN_TYPES = [
  'Floral Design',
  'Traditional Design',
  'Peacock Design',
  'Elephant Design',
  'Abstract Design',
  'Geometric Design',
  'Nature Design',
];

// 4 Colour Combination Types
export const COLOUR_TYPES = [
  'Single Colour',
  'Two Colour',
  'Three Colour',
  'Multi Colour',
];

// 12 Main Atelier Colours with hex codes and Sinhala names
export const MAIN_COLOURS = [
  { name: 'Black', hex: '#000000', sinhala: 'කළු' },
  { name: 'Red', hex: '#dc2626', sinhala: 'රතු' },
  { name: 'Blue', hex: '#2563eb', sinhala: 'නිල්' },
  { name: 'Green', hex: '#16a34a', sinhala: 'කොළ' },
  { name: 'Purple', hex: '#9333ea', sinhala: 'දම්' },
  { name: 'Pink', hex: '#ec4899', sinhala: 'රෝස' },
  { name: 'Yellow', hex: '#eab308', sinhala: 'කහ' },
  { name: 'Brown', hex: '#78350f', sinhala: 'දුඹුරු' },
  { name: 'White', hex: '#ffffff', sinhala: 'සුදු' },
  { name: 'Maroon', hex: '#800000', sinhala: 'මැරූන්' },
  { name: 'Orange', hex: '#ea580c', sinhala: 'තැඹිලි' },
  { name: 'Navy Blue', hex: '#0b1a30', sinhala: 'නාවික නිල්' },
];

export const categories = [
  {
    id: 'all',
    name: 'All Sarees',
    sinhalaName: 'සියලුම සාරි',
    fabricType: 'All',
    description: 'Explore the full bespoke Nandani Batik saree collection',
    image: '',
  },
  {
    id: 'normal-voil',
    name: 'Normal Voil Sarees',
    sinhalaName: 'නෝමල් වොයිල් සාරි',
    fabricType: 'Normal Voil Sarees',
    description: 'Lightweight, airy, everyday elegant voile batik sarees',
    image: saree_3_2,
  },
  {
    id: 'super-voil',
    name: 'Super Voil Sarees',
    sinhalaName: 'සුපර් වොයිල් සාරි',
    fabricType: 'Super Voil Sarees',
    description: 'Premium ultra-soft voile sarees with refined artisan motifs',
    image: saree_4_1,
  },
  {
    id: 'cotton-batik',
    name: 'Cotton Batik Sarees',
    sinhalaName: 'කොටන් බතික් සාරි',
    fabricType: 'Cotton Batik Sarees',
    description: '100% breathable pure cotton batik sarees crafted for all occasions',
    image: saree_1_1,
  },
  {
    id: 'silk-batik',
    name: 'Silk Batik Sarees',
    sinhalaName: 'සිල්ක් බතික් සාරි',
    fabricType: 'Silk Batik Sarees',
    description: 'Luxurious authentic silk batik sarees with rich hand-waxed lustre',
    image: saree_2_1,
  },
];
