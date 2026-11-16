import React from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function WishlistModal() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    openSareePage,
    navigateTo,
    setActivePage,
  } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-brand-cream shadow-2xl flex flex-col text-stone-900 border-l border-stone-200/80">
          {/* Editorial Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
                Wishlist
              </h2>
              <span className="text-xs text-stone-500 font-sans">
                ({wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'})
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Understated Sub-header */}
          <div className="py-2.5 px-6 bg-white/60 border-b border-stone-200/60 text-center text-[11px] text-stone-500 uppercase tracking-widest font-medium">
            Your Curated Favorites & Saved Pieces
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-stone-200/70">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                  <Heart className="w-7 h-7 stroke-1" />
                </div>
                <h3 className="font-serif text-lg text-stone-700 mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6 font-light">
                  Save your favorite handcrafted sarees here while browsing our atelier catalog to keep track of designs you adore.
                </p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    if (navigateTo) navigateTo('shop');
                    else setActivePage('shop');
                  }}
                  className="bg-[#0b1a30] hover:bg-stone-800 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-colors"
                >
                  Explore Saree Collection
                </button>
              </div>
            ) : (
              wishlist.map((saree) => (
                <div key={saree.id} className="py-5 first:pt-0 last:pb-0 flex gap-4 items-start">
                  {/* Portrait Thumbnail */}
                  <div
                    onClick={() => {
                      setIsWishlistOpen(false);
                      openSareePage(saree);
                    }}
                    className="w-20 h-26 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 cursor-pointer group"
                  >
                    <img
                      src={saree.image && saree.image.trim() ? saree.image.trim() : '/sarees/saree 1.1.png'}
                      alt={saree.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/sarees/saree 1.1.png';
                      }}
                    />
                  </div>

                  {/* Saree Info & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            openSareePage(saree);
                          }}
                          className="font-serif text-sm text-stone-900 font-normal leading-snug truncate hover:text-stone-600 cursor-pointer"
                        >
                          {saree.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(saree)}
                          className="text-[11px] text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-wider shrink-0"
                          title="Remove from wishlist"
                        >
                          Remove
                        </button>
                      </div>

                      {saree.sinhalaName && (
                        <p className="font-serif italic text-[11px] text-stone-500 mt-0.5 truncate">
                          {saree.sinhalaName}
                        </p>
                      )}

                      <p className="text-[11px] text-stone-400 mt-1 truncate">
                        {saree.fabric}
                      </p>

                      <p className="text-xs font-serif font-medium text-stone-900 mt-1.5">
                        Rs. {saree.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Move to Bag Button */}
                    <div className="pt-3 mt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          addToCart(saree, 1);
                          toggleWishlist(saree);
                        }}
                        className="w-full bg-[#0b1a30] hover:bg-stone-800 text-white py-2.5 px-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {wishlist.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-200/80 bg-white">
              <button
                onClick={() => {
                  wishlist.forEach((s) => addToCart(s, 1));
                  setIsWishlistOpen(false);
                  if (navigateTo) navigateTo('checkout');
                  else setActivePage('checkout');
                }}
                className="w-full border border-stone-300 hover:border-stone-800 hover:bg-stone-50 text-stone-800 py-3 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-center cursor-pointer"
              >
                <span>Move All to Bag & Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
