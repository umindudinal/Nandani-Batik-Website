import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  Scissors,
  Check,
  Star,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function SareeDetailModal() {
  const {
    selectedSareeForDetail,
    setSelectedSareeForDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!selectedSareeForDetail) return null;

  const saree = selectedSareeForDetail;
  const inWishlist = isInWishlist(saree.id);
  const images = saree.additionalImages && saree.additionalImages.length > 0
    ? saree.additionalImages
    : [saree.image];

  const handleClose = () => {
    setSelectedSareeForDetail(null);
    setActiveImageIndex(0);
    setQuantity(1);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Nandani Batik! 🌸 I would like to inquire / purchase this handcrafted saree:\n\n• Saree: ${saree.name} (${saree.sinhalaName})\n• Saree Code: ${saree.id}\n• Fabric: ${saree.fabric}\n• Price: Rs. ${saree.price.toLocaleString()}\n• Quantity: ${quantity}\n• Delivery Address: [Please confirm availability for delivery]`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-slate-50 flex flex-col justify-between overflow-y-auto">
          {/* Main Display Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white shadow-inner mb-3">
            <img
              src={
                (images[activeImageIndex] && images[activeImageIndex].trim()) ||
                (saree.image && saree.image.trim()) ||
                '/sarees/saree 1.1.png'
              }
              alt={saree.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
              onError={(e) => {
                e.target.src = '/sarees/saree 1.1.png';
              }}
            />
            {saree.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
                -{saree.discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(saree)}
              className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all ${
                inWishlist ? 'bg-red-600 text-white' : 'bg-white/80 text-slate-700 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 justify-center overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#0b1a30] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img && img.trim() ? img.trim() : '/sarees/saree 1.1.png'}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/sarees/saree 1.1.png';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saree Specifications & Order Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {saree.categoryLabel}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Code: {saree.id.toUpperCase()}
              </span>
            </div>

            {/* Title & Sinhala Title */}
            <h2 className="font-serif text-2xl font-bold text-[#0b1a30] leading-tight mb-1">
              {saree.name}
            </h2>
            <p className="text-sm font-medium text-slate-600 mb-3">
              {saree.sinhalaName}
            </p>

            {/* Craft Attribute */}
            <div className="flex items-center gap-2 mb-4 text-xs text-stone-500">
              <span className="font-medium text-stone-700">Artisan Wax Resist Batik</span>
              <span>•</span>
              <span>{saree.fabric}</span>
              <span>•</span>
              <span>Sri Lanka</span>
            </div>

            {/* Price Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0b1a30]">
                Rs. {saree.price.toLocaleString()}
              </span>
              {saree.originalPrice && saree.originalPrice > saree.price && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    Rs. {saree.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save Rs. {(saree.originalPrice - saree.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              {saree.description}
            </p>

            {/* Key Handcraft Specs */}
            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Fabric:</strong> {saree.fabric}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Scissors className="w-4 h-4 text-[#0b1a30] shrink-0 mt-0.5" />
                <span>
                  <strong>Blouse Piece:</strong> {saree.blousePiece}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Total Length:</strong> {saree.length}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Care:</strong> {saree.washCare}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div>
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm hover:bg-slate-100 text-slate-700"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-[#0b1a30]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm hover:bg-slate-100 text-slate-700"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ready for dispatch
              </span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => {
                  addToCart(saree, quantity);
                  handleClose();
                }}
                className="w-full bg-[#0b1a30] hover:bg-[#162d52] text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Add to Bag</span>
              </button>

              <a
                href={`https://wa.me/94778924115?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buy via WhatsApp</span>
              </a>
            </div>

            {/* Shipping Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Islandwide delivery in 1-3 working days | Cash on Delivery available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
