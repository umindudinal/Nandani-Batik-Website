import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function SareeCard({ saree }) {
  const { addToCart, toggleWishlist, isInWishlist, openSareePage } = useCart();
  const inWishlist = isInWishlist(saree.id);

  // Secondary hover image
  const primaryImage = saree.image && saree.image.trim() ? saree.image.trim() : '/sarees/saree 1.1.png';
  const rawHover =
    saree.hoverImage ||
    (saree.additionalImages && saree.additionalImages.length > 1
      ? saree.additionalImages[1]
      : null);
  const hoverImage = rawHover && typeof rawHover === 'string' && rawHover.trim() !== ''
    ? rawHover.trim()
    : null;

  return (
    <div
      onClick={() => openSareePage(saree)}
      className="group cursor-pointer flex flex-col bg-transparent transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f4f2ee] mb-4">
        {/* Main Image */}
        <img
          src={primaryImage}
          alt={saree.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            hoverImage
              ? 'group-hover:opacity-0 group-hover:scale-105'
              : 'group-hover:scale-105'
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/sarees/saree 1.1.png';
          }}
        />

        {/* Hover Secondary Image */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${saree.name} Drape`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/sarees/saree 1.2.png';
            }}
          />
        )}

        {/* Minimal Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {!saree.inStock && (
            <span className="bg-stone-900/90 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
              Sold Out
            </span>
          )}
          {saree.inStock && saree.isNew && (
            <span className="bg-[#0b1a30] text-amber-200 text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
              New
            </span>
          )}
          {saree.inStock && saree.isBestseller && (
            <span className="bg-brand-gold text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(saree);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-rose-600 text-white'
              : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600 shadow-xs'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        {saree.inStock && (
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(saree, 1);
              }}
              className="w-full bg-[#0b1a30]/95 hover:bg-[#0b1a30] text-white py-2.5 px-3 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Add to Bag</span>
            </button>
          </div>
        )}
      </div>

      {/* Saree Details */}
      <div className="flex flex-col flex-1 space-y-1">
        {/* Fabric & Code */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-wider">
          <span className="truncate">{saree.fabric || saree.categoryLabel}</span>
          <span className="font-mono text-[10px] text-stone-400 shrink-0 ml-2">
            {saree.id ? saree.id.replace('nb-saree-', '#') : ''}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-serif text-sm sm:text-base font-medium text-stone-900 group-hover:text-[#0b1a30] transition-colors line-clamp-1 leading-snug">
          {saree.name}
        </h3>

        {/* Sinhala Name */}
        {saree.sinhalaName && (
          <p className="text-xs text-stone-500 line-clamp-1 font-normal">
            {saree.sinhalaName}
          </p>
        )}

        {/* Price & Color */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-stone-900 font-serif">
              Rs. {Number(saree.price).toLocaleString()}
            </span>
            {saree.originalPrice && saree.originalPrice > saree.price && (
              <span className="text-xs text-stone-400 line-through">
                Rs. {Number(saree.originalPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Indicator */}
          {saree.colorHex && (
            <span
              className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
              style={{ backgroundColor: saree.colorHex }}
              title={saree.primaryColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}
