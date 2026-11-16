import React from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartGrandTotal,
    navigateTo,
    setActivePage,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (navigateTo) {
      navigateTo('checkout');
    } else {
      setActivePage('checkout');
    }
  };

  const cartWhatsAppText = encodeURIComponent(
    `Hello Nandani Batik! 🌸 I would like to place an order for the items in my shopping bag:\n\n` +
      cart
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.name} (${item.fabric})\n   Quantity: ${
              item.quantity
            } × Rs. ${item.price.toLocaleString()} = Rs. ${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join('\n\n') +
      `\n\n• Subtotal: Rs. ${cartSubtotal.toLocaleString()}` +
      `\n• Delivery: FREE (Islandwide Doorstep)` +
      `\n• Grand Total: Rs. ${cartGrandTotal.toLocaleString()}` +
      `\n\nPlease let me know how to proceed with delivery!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-brand-cream shadow-2xl flex flex-col text-stone-900 border-l border-stone-200/80">
          {/* Editorial Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
                Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 font-sans">
                ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Understated Delivery Reassurance Strip */}
          <div className="py-2.5 px-6 bg-white/60 border-b border-stone-200/60 text-center text-[11px] text-stone-500 uppercase tracking-widest font-medium">
            Complimentary Islandwide Doorstep Delivery
          </div>

          {/* Bag Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-stone-200/70">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                  <ShoppingBag className="w-7 h-7 stroke-1" />
                </div>
                <h3 className="font-serif text-lg text-stone-700 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6 font-light">
                  Explore our handcrafted pure silk and handloom cotton sarees to add timeless elegance to your collection.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (navigateTo) navigateTo('shop');
                    else setActivePage('shop');
                  }}
                  className="bg-[#0b1a30] hover:bg-stone-800 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-colors"
                >
                  Explore Saree Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex gap-4 items-start">
                  {/* Portrait Thumbnail */}
                  <div className="w-20 h-26 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80">
                    <img
                      src={item.image && item.image.trim() ? item.image.trim() : '/sarees/saree 1.1.png'}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = '/sarees/saree 1.1.png';
                      }}
                    />
                  </div>

                  {/* Saree Info & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm text-stone-900 font-normal leading-snug truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-wider shrink-0"
                          title="Remove item"
                        >
                          Remove
                        </button>
                      </div>

                      {item.sinhalaName && (
                        <p className="font-serif italic text-[11px] text-stone-500 mt-0.5 truncate">
                          {item.sinhalaName}
                        </p>
                      )}

                      <p className="text-[11px] text-stone-400 mt-1 truncate">
                        {item.fabric}
                      </p>

                      <p className="text-xs font-serif font-medium text-stone-900 mt-1.5">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Stepper & Item Total */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
                      <div className="flex items-center border border-stone-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-serif font-medium text-stone-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-200/80 bg-white space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Bag Subtotal</span>
                  <span className="font-serif text-stone-800 text-sm">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Islandwide Shipping</span>
                  <span className="text-emerald-700 font-medium uppercase text-[11px] tracking-wider">
                    Complimentary (Free)
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-normal text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total</span>
                  <span className="font-medium text-lg">
                    Rs. {cartGrandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#0b1a30] hover:bg-stone-800 active:scale-99 text-white py-4 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://wa.me/94778924115?text=${cartWhatsAppText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-stone-300 hover:border-stone-800 hover:bg-stone-50 text-stone-800 py-3 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              <div className="text-[11px] text-center text-stone-400 pt-1">
                Free Islandwide Delivery • Cash on Delivery (COD) Available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
