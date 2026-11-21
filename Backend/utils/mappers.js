/**
 * Data mappers for converting between Supabase snake_case and JavaScript camelCase models
 */

export function mapDbSareeToJs(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    sinhalaName: item.sinhala_name || item.sinhalaName,
    category: item.category,
    categoryLabel: item.category_label || item.categoryLabel || item.fabricType,
    fabricType: item.fabric_type || item.fabricType || item.category_label || item.categoryLabel,
    designType: item.design_type || item.designType,
    colourType: item.colour_type || item.colourType,
    mainColour: item.main_colour || item.mainColour || item.primary_color || item.primaryColor,
    fabric: item.fabric,
    primaryColor: item.primary_color || item.primaryColor || item.main_colour || item.mainColour,
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

export function mapJsSareeToDb(item) {
  return {
    id: item.id,
    name: item.name,
    sinhala_name: item.sinhalaName || null,
    category: item.category || 'silk-batik',
    category_label: item.categoryLabel || item.fabricType || null,
    fabric_type: item.fabricType || item.categoryLabel || null,
    design_type: item.designType || null,
    colour_type: item.colourType || null,
    main_colour: item.mainColour || item.primaryColor || null,
    fabric: item.fabric || null,
    primary_color: item.primaryColor || item.mainColour || null,
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

export function mapDbOrderToJs(item) {
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

export function mapJsOrderToDb(item) {
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

export function mapDbCustomerToJs(item) {
  if (!item) return null;
  return {
    id: item.id,
    fullName: item.full_name || item.fullName || '',
    phone: item.phone || '',
    whatsapp: item.whatsapp || item.phone || '',
    email: item.email || '',
    address: item.address || '',
    district: item.district || 'Colombo',
    city: item.city || '',
    postalCode: item.postal_code || item.postalCode || '',
    notes: item.notes || '',
    ordersCount: Number(item.orders_count || item.ordersCount || 0),
    totalSpent: Number(item.total_spent || item.totalSpent || 0),
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    updatedAt: item.updated_at || item.updatedAt || new Date().toISOString(),
  };
}

export function mapJsCustomerToDb(item) {
  return {
    full_name: item.fullName,
    phone: item.phone,
    whatsapp: item.whatsapp || item.phone || null,
    email: item.email || null,
    password: item.password || null,
    address: item.address,
    district: item.district || 'Colombo',
    city: item.city || null,
    postal_code: item.postalCode || null,
    notes: item.notes || null,
    orders_count: Number(item.ordersCount || 0),
    total_spent: Number(item.totalSpent || 0),
    updated_at: new Date().toISOString(),
  };
}
