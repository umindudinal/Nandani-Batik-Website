import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Truck,
  Building,
  CreditCard,
  MessageCircle,
  Phone,
  ShieldCheck,
  Receipt,
  Copy,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    shippingFee,
    cartGrandTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    address: '',
    district: 'Colombo',
    city: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' | 'bank' | 'koko'
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCheckoutOpen) return null;

  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const refCode = `NB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderReference(refCode);

    // Save order to Backend API (Supabase / Database)
    const orderPayload = {
      orderReference: refCode,
      customerName: formData.fullName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      address: formData.address,
      district: formData.district,
      city: formData.city,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: cartSubtotal,
      shippingFee: shippingFee,
      grandTotal: cartGrandTotal,
    };

    try {
      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.warn('Backend order sync:', err);
    }

    setOrderConfirmed(true);
    clearCart();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderConfirmed(false);
    setOrderReference('');
  };

  const whatsappReceiptText = encodeURIComponent(
    `Hello Nandani Batik! 🌸 I have just placed an order on your website:\n\n` +
      `• Order Ref: ${orderReference}\n` +
      `• Name: ${formData.fullName}\n` +
      `• Phone: ${formData.phone}\n` +
      `• Delivery Address: ${formData.address}, ${formData.city}, ${formData.district}\n` +
      `• Payment Method: ${
        formData.paymentMethod === 'cod'
          ? 'Cash on Delivery (COD)'
          : formData.paymentMethod === 'bank'
          ? 'Direct Bank Transfer'
          : 'Koko / Mintpay'
      }\n• Total Amount: Rs. ${cartGrandTotal.toLocaleString()}\n\nPlease verify and confirm dispatch!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-[#0b1a30] text-white">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                {orderConfirmed ? 'Order Received!' : 'Islandwide Checkout'}
              </h2>
              <p className="text-xs text-slate-300">
                {orderConfirmed
                  ? 'Thank you for choosing Nandani Batik'
                  : 'Fast doorstep delivery with Cash on Delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {orderConfirmed ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Order Successfully Placed
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0b1a30] mt-2 mb-1">
                  Thank you, {formData.fullName}!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your handcrafted batik saree order has been registered in our system. Our team will contact you shortly to confirm packaging and dispatch.
                </p>
              </div>

              {/* Order Reference Card */}
              <div className="max-w-sm mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Order Reference:</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[#0b1a30] font-semibold hover:underline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-xl font-bold text-[#0b1a30] tracking-wider text-center py-1 bg-white rounded-lg border border-slate-200">
                  {orderReference}
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                  <span>Total Payable:</span>
                  <strong className="text-slate-900">
                    Rs. {cartGrandTotal.toLocaleString()} ({formData.paymentMethod.toUpperCase()})
                  </strong>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Delivery to:</span>
                  <span className="text-slate-700 font-medium truncate max-w-[180px]">
                    {formData.city}, {formData.district}
                  </span>
                </div>
              </div>

              {/* Bank Details if Bank Transfer selected */}
              {formData.paymentMethod === 'bank' && (
                <div className="max-w-sm mx-auto p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Bank Transfer Details:</p>
                  <p>• Bank: Commercial Bank of Ceylon</p>
                  <p>• Account Name: Nandani Batik</p>
                  <p>• Account No: 1000 2489 5721</p>
                  <p>• Branch: Colombo Main / Moratuwa</p>
                  <p className="text-[11px] text-amber-800 pt-1">
                    * Please send your payment receipt slip to our WhatsApp.
                  </p>
                </div>
              )}

              {/* Next Steps Buttons */}
              <div className="max-w-sm mx-auto space-y-2 pt-2">
                <a
                  href={`https://wa.me/94778924115?text=${whatsappReceiptText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>
                <button
                  onClick={handleClose}
                  className="w-full bg-[#0b1a30] hover:bg-[#162d52] text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Items Preview */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Order Summary:</span>
                  <strong className="text-slate-900 ml-1.5 font-bold">
                    {cart.length} {cart.length === 1 ? 'Design' : 'Designs'}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Grand Total:</span>
                  <strong className="text-[#0b1a30] text-sm ml-1.5 font-extrabold">
                    Rs. {cartGrandTotal.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0b1a30]" />
                  <span>1. Contact & Customer Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anusha Wickramasinghe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0b1a30] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Phone Number (for Courier Call) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0b1a30] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>2. Delivery Address in Sri Lanka</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Street Address / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. No. 24, Temple Road, Nugegoda"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0b1a30] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        District *
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0b1a30] focus:outline-none bg-white"
                      >
                        {districts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nugegoda / Kandy"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0b1a30] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0b1a30]" />
                  <span>3. Preferred Payment Method</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#0b1a30] bg-[#0b1a30]/5 text-[#0b1a30]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="sr-only"
                    />
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>Cash on Delivery</span>
                      {formData.paymentMethod === 'cod' && (
                        <CheckCircle className="w-4 h-4 text-[#0b1a30]" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Pay cash to courier when receiving saree
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                      formData.paymentMethod === 'bank'
                        ? 'border-[#0b1a30] bg-[#0b1a30]/5 text-[#0b1a30]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="sr-only"
                    />
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>Bank Transfer</span>
                      {formData.paymentMethod === 'bank' && (
                        <CheckCircle className="w-4 h-4 text-[#0b1a30]" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      BOC, Commercial or Sampath Bank deposit
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                      formData.paymentMethod === 'koko'
                        ? 'border-[#0b1a30] bg-[#0b1a30]/5 text-[#0b1a30]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="koko"
                      checked={formData.paymentMethod === 'koko'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="sr-only"
                    />
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>Koko / Mintpay</span>
                      {formData.paymentMethod === 'koko' && (
                        <CheckCircle className="w-4 h-4 text-[#0b1a30]" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Pay in 3 interest-free installments
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0b1a30] hover:bg-[#162d52] text-white py-3.5 rounded-2xl text-sm font-bold tracking-wide shadow-lg hover:shadow-xl transition-all"
                >
                  Confirm & Place Order (Rs. {cartGrandTotal.toLocaleString()})
                </button>
                <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Guaranteed Handcrafted Ceylon Batik Heritage</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
