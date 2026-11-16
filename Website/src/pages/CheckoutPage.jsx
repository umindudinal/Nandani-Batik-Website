import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle,
  Copy,
  MessageCircle,
  Building,
  CreditCard,
  Lock,
  Phone,
  Check,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartGrandTotal,
    clearCart,
    navigateTo,
    setActivePage,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    address: '',
    district: 'Colombo',
    city: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' | 'bank' | 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const refCode = `NB-${Math.floor(100000 + Math.random() * 900000)}`;

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
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.warn('Backend order sync offline, continuing with local confirmation:', err);
    }

    setConfirmedOrder({
      ...orderPayload,
      placedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    });
    setOrderConfirmed(true);
    clearCart();
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (confirmedOrder?.orderReference) {
      navigator.clipboard.writeText(confirmedOrder.orderReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackToShop = () => {
    if (navigateTo) {
      navigateTo('shop');
    } else {
      setActivePage('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ORDER CONFIRMED RECEIPT SCREEN
  if (orderConfirmed && confirmedOrder) {
    const whatsappReceiptText = encodeURIComponent(
      `Hello Nandani Batik! 🌸 I have just placed an order on your website:\n\n` +
        `• Order Ref: ${confirmedOrder.orderReference}\n` +
        `• Name: ${confirmedOrder.customerName}\n` +
        `• Phone: ${confirmedOrder.phone}\n` +
        `• Delivery: ${confirmedOrder.address}, ${confirmedOrder.city}, ${confirmedOrder.district}\n` +
        `• Payment: ${
          confirmedOrder.paymentMethod === 'cod'
            ? 'Cash on Delivery (COD)'
            : confirmedOrder.paymentMethod === 'bank'
            ? 'Direct Bank Transfer'
            : 'Card Payment'
        }\n` +
        `• Total Amount: Rs. ${confirmedOrder.grandTotal.toLocaleString()}\n\n` +
        `Please confirm receipt and islandwide dispatch schedule!`
    );

    return (
      <div className="bg-brand-cream min-h-screen py-12 lg:py-20 text-stone-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold block mb-1">
                Order Received
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto font-light">
                We have received your order and our atelier will begin preparing your handcrafted saree parcel for islandwide delivery.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between max-w-sm mx-auto">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                  Order Reference
                </span>
                <span className="font-mono text-base font-bold text-stone-900">
                  {confirmedOrder.orderReference}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-600 hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Copy reference code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Order Summary Breakdown */}
            <div className="border-t border-stone-100 pt-6 text-left space-y-3 text-xs">
              <h3 className="font-serif text-sm font-semibold text-stone-900">
                Delivery & Payment Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-stone-600">
                <div>
                  <span className="text-stone-400 block text-[11px]">Customer</span>
                  <strong className="text-stone-900 font-medium">{confirmedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Phone</span>
                  <strong className="text-stone-900 font-medium">{confirmedOrder.phone}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 block text-[11px]">Delivery Address</span>
                  <span className="text-stone-800">
                    {confirmedOrder.address}, {confirmedOrder.city}, {confirmedOrder.district}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Payment Method</span>
                  <span className="font-medium text-stone-900 capitalize">
                    {confirmedOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : confirmedOrder.paymentMethod === 'bank'
                      ? 'Direct Bank Transfer'
                      : 'Card Payment'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Total Amount</span>
                  <strong className="text-stone-900 text-sm font-serif">
                    Rs. {confirmedOrder.grandTotal.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                  Items Ordered ({confirmedOrder.items.length})
                </span>
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-stone-800">
                      {item.name} <span className="text-stone-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-stone-900 font-serif">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: WhatsApp Confirmation & Back to Shop */}
            <div className="space-y-3 pt-4">
              <a
                href={`https://wa.me/94778924115?text=${whatsappReceiptText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Order via WhatsApp</span>
              </a>

              <button
                onClick={handleBackToShop}
                className="w-full border border-stone-300 hover:border-stone-800 text-stone-800 hover:text-stone-900 py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BAG STATE
  if (cart.length === 0) {
    return (
      <div className="bg-brand-cream min-h-[70vh] flex flex-col items-center justify-center p-8 text-center text-stone-900">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl text-stone-800">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm">
          Please select your favorite handcrafted batik saree from our atelier catalog before proceeding to checkout.
        </p>
        <button
          onClick={handleBackToShop}
          className="mt-6 px-6 py-3.5 bg-[#0b1a30] hover:bg-stone-800 text-white rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Saree Collection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-8 lg:py-14 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200/80 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => (navigateTo ? navigateTo('home') : setActivePage('home'))}
              className="hover:text-stone-900 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
              className="hover:text-stone-900 transition-colors"
            >
              Collection
            </button>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Proceed to Checkout</span>
          </div>

          <button
            onClick={handleBackToShop}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-widest text-amber-800 font-medium mb-1">
            Atelier Checkout
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
            Secure Delivery & Order Details
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Islandwide Doorstep Delivery (Rs. 350) with Cash on Delivery (COD) or Bank Transfer options.
          </p>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Form Details (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact & Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b1a30] text-white text-xs font-bold flex items-center justify-center font-mono">
                    1
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900">
                    Delivery Address & Contact
                  </h2>
                </div>
                <span className="text-[11px] text-stone-400">Islandwide Dispatch</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your recipient name"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50"
                  />
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1.5">
                      Phone Number (Call) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 077 123 4567"
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1.5">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="e.g. 077 123 4567"
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">
                    Delivery Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House / Apartment number, Street name, Landmark"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50 resize-none"
                  />
                </div>

                {/* District & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1.5">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50 cursor-pointer"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1.5">
                      City / Postal Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharagama, Moratuwa"
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">
                    Special Notes for Courier (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Call before delivery, Deliver after 2 PM"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b1a30] text-white text-xs font-bold flex items-center justify-center font-mono">
                    2
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900">
                    Payment Method
                  </h2>
                </div>
                <span className="text-[11px] text-stone-400">Secure Islandwide</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Option 1: COD */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#0b1a30] bg-[#0b1a30]/5 ring-1 ring-[#0b1a30]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#0b1a30] focus:ring-[#0b1a30]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-medium text-stone-900 text-sm">
                        Cash on Delivery (COD)
                      </strong>
                    </div>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      Pay safely in cash directly to the courier when your saree parcel is delivered to your doorstep anywhere in Sri Lanka.
                    </p>
                  </div>
                </label>

                {/* Option 2: Bank Transfer */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'bank'
                      ? 'border-[#0b1a30] bg-[#0b1a30]/5 ring-1 ring-[#0b1a30]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#0b1a30] focus:ring-[#0b1a30]"
                  />
                  <div className="flex-1">
                    <strong className="font-medium text-stone-900 text-sm">
                      Direct Bank Transfer / Online Banking
                    </strong>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      Deposit or transfer directly to our Commercial Bank / Bank of Ceylon atelier account. WhatsApp your deposit slip to confirm dispatch.
                    </p>

                    {formData.paymentMethod === 'bank' && (
                      <div className="mt-3 p-3.5 bg-white border border-stone-200 rounded-xl text-[11px] text-stone-700 space-y-1">
                        <p>
                          <strong>Bank:</strong> Commercial Bank of Ceylon
                        </p>
                        <p>
                          <strong>Account Name:</strong> Nandani Batik Atelier
                        </p>
                        <p>
                          <strong>Account Number:</strong> 1000 8924 1150
                        </p>
                        <p>
                          <strong>Branch:</strong> Moratuwa / Colombo
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Option 3: Card / Installments */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#0b1a30] bg-[#0b1a30]/5 ring-1 ring-[#0b1a30]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#0b1a30] focus:ring-[#0b1a30]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-medium text-stone-900 text-sm">
                        Visa, MasterCard, or Installments
                      </strong>
                      <span className="text-[10px] text-stone-500">Koko & Mintpay</span>
                    </div>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      Complete payment via secure credit/debit card link or split into 3 monthly interest-free payments via Koko or Mintpay.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0b1a30] hover:bg-brand-blue-800 active:scale-99 text-white py-4 px-6 rounded-2xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>
                {isSubmitting
                  ? 'Placing Order...'
                  : `Place Order • Rs. ${cartGrandTotal.toLocaleString()}`}
              </span>
            </button>

            <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-600" />
                Islandwide Delivery (Rs. 350)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                Authentic Batik Guarantee
              </span>
            </div>
          </form>

          {/* Right Column: Order Summary (5 cols, Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900">
                  Shopping Bag Summary
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-95 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3.5 items-start">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80">
                      <img
                        src={item.image && item.image.trim() ? item.image.trim() : '/sarees/saree 1.1.png'}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = '/sarees/saree 1.1.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-semibold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      {item.sinhalaName && (
                        <p className="text-[11px] text-stone-500 font-serif italic truncate">
                          {item.sinhalaName}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Qty: <strong className="text-stone-700">{item.quantity}</strong>
                      </p>
                      <p className="text-xs font-medium text-stone-900 mt-1 font-serif">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-stone-900 font-serif">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Islandwide Shipping</span>
                  <span className="font-medium text-stone-900 font-serif">
                    Rs. {shippingFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-semibold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-xl">
                    Rs. {cartGrandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Concierge Assistance Card */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-medium">
                <Phone className="w-3.5 h-3.5 text-stone-700" />
                <span>Need assistance with your order?</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                Our atelier styling team is available via WhatsApp to guide you on color matching, blouse stitching, or order status.
              </p>
              <a
                href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20have%20a%20question%20about%20checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline pt-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat with WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
