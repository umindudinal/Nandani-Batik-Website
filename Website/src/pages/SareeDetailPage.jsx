import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  Share2,
  Sparkles,
  Scissors,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import SareeCard from '../components/sarees/SareeCard';

export default function SareeDetailPage() {
  const {
    sarees,
    selectedSaree,
    setActivePage,
    setSelectedCategory,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('details');

  // Active saree
  const saree = selectedSaree || sarees[0];

  // Reset active image and quantity when saree changes
  useEffect(() => {
    if (saree?.id) {
      setActiveImageIndex(0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [saree?.id]);

  if (!saree) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-brand-cream">
        <h2 className="font-serif text-2xl text-stone-800">Saree Not Found</h2>
        <p className="text-sm text-stone-500 mt-2">Please select a saree from our atelier collection.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-6 px-6 py-3 bg-[#0b1a30] text-white rounded-full text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors"
        >
          View All Sarees
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(saree.id);

  // Gallery images
  const galleryImages = [
    saree.image,
    ...(saree.hoverImage && saree.hoverImage !== saree.image ? [saree.hoverImage] : []),
    ...(saree.additionalImages || []).filter(
      (img) => img !== saree.image && img !== saree.hoverImage
    ),
  ].filter(Boolean);

  const currentImage =
    (galleryImages[activeImageIndex] && galleryImages[activeImageIndex].trim()) ||
    (saree.image && saree.image.trim()) ||
    '/sarees/saree 1.1.png';

  const whatsappMessage = encodeURIComponent(
    `Hello Nandani Batik! 🌸 I would like to inquire about this saree:\n\n` +
      `• Saree: ${saree.name} (${saree.sinhalaName || ''})\n` +
      `• Code: ${saree.id.toUpperCase()}\n` +
      `• Fabric: ${saree.fabric}\n` +
      `• Price: Rs. ${saree.price.toLocaleString()}\n` +
      `• Quantity: ${quantity}\n\n` +
      `Please let me know if this piece is available for islandwide delivery!`
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    showToast('Saree link copied to clipboard');
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  // Related sarees
  const relatedSarees = sarees
    .filter((s) => s.id !== saree.id && s.category === saree.category)
    .slice(0, 4);

  return (
    <div className="bg-brand-cream text-stone-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Editorial Breadcrumb Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200/70 text-xs tracking-wider uppercase text-stone-500">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActivePage('home')}
              className="hover:text-stone-900 transition-colors"
            >
              Home
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={() => {
                if (setSelectedCategory) setSelectedCategory('all');
                setActivePage('shop');
              }}
              className="hover:text-stone-900 transition-colors"
            >
              Collection
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={() => {
                if (setSelectedCategory) setSelectedCategory(saree.category);
                setActivePage('shop');
              }}
              className="hover:text-stone-900 transition-colors"
            >
              {saree.categoryLabel || saree.category}
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900 font-semibold normal-case truncate max-w-55">
              {saree.name}
            </span>
          </div>

          <button
            onClick={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors tracking-normal normal-case font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </button>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Photography Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-24 sm:w-20 sm:h-28 overflow-hidden bg-stone-100 transition-all duration-200 shrink-0 ${
                      activeImageIndex === idx
                        ? 'ring-1 ring-stone-900 opacity-100'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img && img.trim() ? img.trim() : '/sarees/saree 1.1.png'}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = '/sarees/saree 1.1.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Showcase Image */}
            <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f4f2ee] shadow-xs group">
              <img
                src={currentImage}
                alt={saree.name}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
                onError={(e) => {
                  e.target.src = '/sarees/saree 1.1.png';
                }}
              />

              {/* Minimal Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {saree.isNew && (
                  <span className="bg-[#0b1a30] text-amber-200 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
                    New Arrival
                  </span>
                )}
                {saree.isBestseller && (
                  <span className="bg-brand-gold text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
                    Bestseller
                  </span>
                )}
                {saree.discountPercent > 0 && (
                  <span className="bg-stone-900 text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
                    -{saree.discountPercent}%
                  </span>
                )}
              </div>

              {/* Floating Action Icons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 flex items-center justify-center shadow-xs transition-all"
                  title="Share Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(saree)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all ${
                    inWishlist
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600'
                  }`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Saree Details & Ordering */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium">
                  {saree.categoryLabel || saree.category}
                </span>
                {saree.fabricType && (
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
                    {saree.fabricType}
                  </span>
                )}
                {saree.designType && (
                  <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/70 px-2 py-0.5 rounded font-medium">
                    {saree.designType}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight leading-snug">
                {saree.name}
              </h1>

              {saree.sinhalaName && (
                <p className="font-serif italic text-stone-500 text-base sm:text-lg mt-1">
                  {saree.sinhalaName}
                </p>
              )}
            </div>

            {/* Price Presentation */}
            <div className="pb-4 border-b border-stone-200">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">
                  Rs. {saree.price.toLocaleString()}
                </span>
                {saree.originalPrice && saree.originalPrice > saree.price && (
                  <span className="text-base text-stone-400 line-through">
                    Rs. {saree.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1.5">
                Price inclusive of all taxes. Islandwide doorstep delivery (Rs. 350).
              </p>
            </div>

            {/* Natural Garment Description */}
            {saree.description && (
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                {saree.description}
              </p>
            )}

            {/* Key Garment Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 py-4 border-y border-stone-200/80 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-0.5">
                  Fabric Type
                </span>
                <span className="font-medium text-stone-800">{saree.fabricType || saree.fabric}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-0.5">
                  Design Motif
                </span>
                <span className="font-medium text-stone-800">{saree.designType || 'Hand-drawn Batik Motif'}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-0.5">
                  Colour Type
                </span>
                <span className="font-medium text-stone-800">{saree.colourType || 'Batik Multi'}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-0.5">
                  Main Colour
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {saree.colorHex && (
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300 shrink-0 inline-block"
                      style={{ backgroundColor: saree.colorHex }}
                    />
                  )}
                  <span className="font-medium text-stone-800">
                    {saree.mainColour || saree.primaryColor || 'Batik Tone'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-0.5">
                  Blouse Piece
                </span>
                <span className="font-medium text-stone-800">{saree.blousePiece || '1.0m matching fabric included'}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-0.5">
                  Total Length
                </span>
                <span className="font-medium text-stone-800">{saree.length || '6.0 Meters (with blouse)'}</span>
              </div>
            </div>

            {/* Quantity & Purchase Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-stone-500">Quantity</span>
                <div className="flex items-center border border-stone-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => addToCart(saree, quantity)}
                  className="w-full bg-[#0b1a30] hover:bg-[#152e54] text-white py-4 px-6 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-200"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Add to Shopping Bag</span>
                </button>

                <a
                  href={`https://wa.me/94778924115?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-stone-800 hover:bg-stone-900 hover:text-white text-stone-800 py-3.5 px-6 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Inquire / Order via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Refined Luxury Accordions */}
            <div className="border-t border-stone-200 pt-2 space-y-0 text-xs">
              {/* Garment Details & Craft */}
              <div className="border-b border-stone-200">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-4 flex items-center justify-between text-left font-medium text-stone-900 uppercase tracking-wider text-xs"
                >
                  <span>Saree & Craftsmanship Details</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="pb-4 text-stone-600 space-y-2 font-light leading-relaxed">
                    <p>
                      <strong className="font-medium text-stone-800">Technique:</strong> Hand-drawn wax resist batik, dyed through layered immersion.
                    </p>
                    {saree.palluDetails && (
                      <p>
                        <strong className="font-medium text-stone-800">Pallu Work:</strong> {saree.palluDetails}
                      </p>
                    )}
                    <p>
                      <strong className="font-medium text-stone-800">Origin:</strong> Nandani Batik Atelier, Sri Lanka.
                    </p>
                    <p className="text-stone-400 text-[11px] pt-1">
                      * As each saree is individually waxed and dyed by hand, slight organic variations in wax crackle lines are natural hallmarks of genuine batik artistry.
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery & Payment */}
              <div className="border-b border-stone-200">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-4 flex items-center justify-between text-left font-medium text-stone-900 uppercase tracking-wider text-xs"
                >
                  <span>Delivery & Payment Methods</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-stone-600 space-y-2 font-light leading-relaxed">
                    <p>
                      • <strong className="font-medium text-stone-800">Islandwide Doorstep Delivery:</strong> 1 to 3 business days within Sri Lanka (Rs. 350 flat rate).
                    </p>
                    <p>
                      • <strong className="font-medium text-stone-800">Payment Options:</strong> Cash on Delivery (COD), Direct Bank Transfer, or Online Card Checkout.
                    </p>
                    <p>
                      • <strong className="font-medium text-stone-800">Packaging:</strong> Carefully wrapped in signature protective packaging suitable for gifting.
                    </p>
                  </div>
                )}
              </div>

              {/* Care Guide */}
              <div className="border-b border-stone-200">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-4 flex items-center justify-between text-left font-medium text-stone-900 uppercase tracking-wider text-xs"
                >
                  <span>Care & Maintenance</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-4 text-stone-600 space-y-2 font-light leading-relaxed">
                    <p>
                      {saree.washCare ||
                        'Dry clean recommended for silk drapes. If washing at home, hand wash gently in cold water with mild silk detergent. Do not wring or soak. Dry in shade.'}
                    </p>
                    <p>
                      Warm iron on reverse side under a clean pressing cloth to protect the batik luster.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reassurance Bar */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-700" />
                Islandwide COD
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-700" />
                100% Handcrafted Batik
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                Authentic Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Brand Heritage Note (Refined, authentic quote instead of generic tutorial) */}
        <div className="my-20 py-12 border-y border-stone-200 text-center max-w-3xl mx-auto">
          <p className="font-serif italic text-lg sm:text-xl text-stone-700 leading-relaxed">
            "Each Nandani Batik saree is individually handcrafted by skilled Sri Lankan women artisans using centuries-old wax-resist techniques. No two creations are ever identical, giving you a truly unique piece of wearable island art."
          </p>
          <span className="block mt-4 text-[11px] tracking-widest uppercase font-semibold text-stone-400">
            Nandani Batik Atelier • Heritage Craftsmanship
          </span>
        </div>

        {/* Related Sarees Recommendations */}
        {relatedSarees.length > 0 && (
          <div className="mb-12">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                  Curated Collection
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory(saree.category);
                  setActivePage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs uppercase tracking-wider text-stone-900 hover:text-stone-600 font-medium transition-colors"
              >
                View Collection →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedSarees.map((relSaree) => (
                <SareeCard key={relSaree.id} saree={relSaree} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
