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
  Sparkles,
  ArrowRight,
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
    customerProfile,
    saveCustomerProfile,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: customerProfile?.fullName || '',
    phone: customerProfile?.phone || '',
    whatsapp: customerProfile?.whatsapp || customerProfile?.phone || '',
    email: customerProfile?.email || '',
    address: customerProfile?.address || '',
    district: customerProfile?.district || 'Colombo',
    city: customerProfile?.city || '',
    notes: customerProfile?.notes || '',
    paymentMethod: 'cod', // 'cod' | 'bank' | 'card'
  });

  // Keep in sync with logged-in customer profile
  React.useEffect(() => {
    if (customerProfile) {
      setFormData((prev) => ({
        ...prev,
        fullName: customerProfile.fullName || prev.fullName,
        phone: customerProfile.phone || prev.phone,
        whatsapp: customerProfile.whatsapp || customerProfile.phone || prev.whatsapp,
        email: customerProfile.email || prev.email,
        address: customerProfile.address || prev.address,
        district: customerProfile.district || prev.district,
        city: customerProfile.city || prev.city,
        notes: customerProfile.notes || prev.notes,
      }));
    }
  }, [customerProfile]);

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

      // 1. Sync / Save Customer in Supabase & local profile
      try {
        const custRes = await fetch(`${apiBase}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            whatsapp: formData.whatsapp || formData.phone,
            email: formData.email,
            address: formData.address,
            district: formData.district,
            city: formData.city,
            notes: formData.notes,
          }),
        });
        const custData = await custRes.json();
        if (custData && custData.customer) {
          saveCustomerProfile(custData.customer);
        }
      } catch (custErr) {
        console.warn('Customer auto-register error:', custErr);
        saveCustomerProfile({
          fullName: formData.fullName,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          email: formData.email,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          notes: formData.notes,
        });
      }

      // 2. Submit Order
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
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    });

    clearCart();
    setIsSubmitting(false);
    setOrderConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.orderReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToShop = () => {
    if (navigateTo) {
      navigateTo('shop');
    } else if (setActivePage) {
      setActivePage('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paymentLabels = {
    cod: 'Cash on Delivery (COD)',
    bank: 'Direct Bank Transfer',
    card: 'Online Card Payment / Installments',
  };

  const whatsappReceiptText = confirmedOrder
    ? encodeURIComponent(
      `🌸 *NANDANI BATIK ATELIER — ORDER DISPATCH CONFIRMATION* 🌸\n\n` +
      `• Order Ref: *${confirmedOrder.orderReference}*\n` +
      `• Customer: ${confirmedOrder.customerName}\n` +
      `• Contact Phone: ${confirmedOrder.phone}\n` +
      `• Delivery Address: ${confirmedOrder.address}, ${confirmedOrder.city}, ${confirmedOrder.district}\n` +
      `• Payment Method: ${paymentLabels[confirmedOrder.paymentMethod] || confirmedOrder.paymentMethod}\n\n` +
      `*Ordered Sarees:*\n` +
      confirmedOrder.items
        .map(
          (item) =>
            `  - ${item.name} (${item.quantity} × Rs. ${item.price.toLocaleString()})`
        )
        .join('\n') +
      `\n\n• Bag Subtotal: Rs. ${confirmedOrder.subtotal.toLocaleString()}` +
      `\n• Islandwide Shipping: Rs. ${confirmedOrder.shippingFee.toLocaleString()}` +
      `\n• *Grand Total: Rs. ${confirmedOrder.grandTotal.toLocaleString()}*` +
      (confirmedOrder.notes ? `\n• Special Notes: ${confirmedOrder.notes}` : '') +
      `\n\nPlease confirm my order dispatch!`
    )
    : '';

  // ORDER CONFIRMED VIEW (Prestigious Atelier Certificate)
  if (orderConfirmed && confirmedOrder) {
    return (
      <div className="bg-brand-cream min-h-screen py-12 lg:py-20 text-stone-900 antialiased selection:bg-[#0b1a30] selection:text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-stone-200/90 p-8 sm:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8 text-center">
            {/* Atelier Crest Seal */}
            <div className="w-16 h-16 rounded-full border-2 border-stone-300 mx-auto overflow-hidden shadow-xs">
              <img
                src="/nandani-logo.jpg"
                alt="Nandani Batik Seal"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Header Titles */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-amber-800 font-semibold bg-amber-50/90 px-3 py-1 border border-amber-200/60">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Order Registered & Confirmed</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
                Thank You for Your Order
              </h1>
              <p className="font-serif italic text-xs sm:text-sm text-amber-900/80">
                ඔබගේ ඇණවුම අපගේ ශිල්පී මැදිරිය වෙත සාර්ථකව යොමු විය
              </p>
              <p className="text-xs text-stone-600 font-light max-w-md mx-auto pt-1 leading-relaxed">
                We have registered your order. Our atelier team will begin carefully preparing and steaming your handcrafted saree parcel for islandwide doorstep delivery.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-4 bg-stone-50 border border-stone-200 flex items-center justify-between max-w-sm mx-auto">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                  Atelier Order Reference
                </span>
                <span className="font-mono text-base font-bold text-stone-900">
                  {confirmedOrder.orderReference}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 border border-stone-300 hover:border-stone-800 bg-white text-stone-700 hover:text-stone-900 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy reference code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Summary Breakdown */}
            <div className="border-t border-stone-100 pt-6 text-left space-y-4 text-xs">
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold block">
                Delivery & Dispatch Details
              </span>

              <div className="grid grid-cols-2 gap-3 text-stone-600 bg-stone-50/70 p-4 border border-stone-200/80">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Recipient</span>
                  <strong className="text-stone-900 font-medium">{confirmedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Phone</span>
                  <strong className="text-stone-900 font-medium">{confirmedOrder.phone}</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-stone-200/60">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Delivery Address</span>
                  <span className="text-stone-800">
                    {confirmedOrder.address}, {confirmedOrder.city}, {confirmedOrder.district}
                  </span>
                </div>
                <div className="pt-1 border-t border-stone-200/60">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Payment Method</span>
                  <span className="font-medium text-stone-900">
                    {paymentLabels[confirmedOrder.paymentMethod] || confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="pt-1 border-t border-stone-200/60">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Grand Total</span>
                  <strong className="text-stone-900 text-sm font-serif">
                    Rs. {confirmedOrder.grandTotal.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  Enclosed Saree Items ({confirmedOrder.items.length})
                </span>
                <div className="divide-y divide-stone-100">
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 text-xs">
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
            </div>

            {/* Actions: WhatsApp Dispatch & Back to Catalog */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <a
                href={`https://wa.me/94778924115?text=${whatsappReceiptText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0b1a30] hover:bg-stone-800 text-white py-3.5 px-6 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Confirm Dispatch on WhatsApp</span>
              </a>

              <button
                onClick={handleBackToShop}
                className="w-full border border-stone-300 hover:border-stone-900 text-stone-800 py-3 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
              >
                Continue Browsing Catalog
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
      <div className="bg-brand-cream min-h-[70vh] flex flex-col items-center justify-center p-8 text-center text-stone-900 antialiased">
        <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 font-normal">
          Your Shopping Bag is Empty
        </h2>
        <p className="font-serif italic text-xs text-amber-900/80 mt-1">
          සාප්පු සවාරිය ආරම්භ කිරීමට කරුණාකර සාරියක් තෝරාගන්න
        </p>
        <p className="text-xs text-stone-500 mt-2 max-w-sm font-light leading-relaxed">
          Please explore our atelier catalog to select your favorite handcrafted batik saree before proceeding to checkout.
        </p>
        <button
          onClick={handleBackToShop}
          className="mt-6 px-7 py-3 bg-[#0b1a30] hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Saree Collection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-10 lg:py-16 text-stone-900 antialiased selection:bg-[#0b1a30] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Breadcrumb */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-stone-200/80 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => (navigateTo ? navigateTo('home') : setActivePage('home'))}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Collection
            </button>
            <span>/</span>
            <span className="text-stone-900 font-medium">Checkout</span>
          </div>

          <button
            onClick={handleBackToShop}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Editorial Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            <span>Nandani Atelier Checkout</span>
            <span>•</span>
            <span className="font-serif italic capitalize">දිවයින පුරා බෙදාහැරීම</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
            Delivery & Payment Details
          </h1>
          <p className="font-serif italic text-xs sm:text-sm text-amber-900/80 mt-1">
            ඔබගේ නන්දනී බතික් සාරිය නිවසටම ගෙන්වා ගැනීම සඳහා විස්තර ඇතුළත් කරන්න
          </p>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form Details (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Section I: Customer Contact & Delivery Address */}
            <div className="bg-white p-7 sm:p-8 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-normal text-stone-900">
                    I. Recipient & Delivery Address
                  </h2>
                  <p className="font-serif italic text-xs text-amber-900/75 mt-0.5">
                    ලබන්නාගේ විස්තර හා ලිපිනය
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                  Islandwide Dispatch
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Customer Account Pre-fill Banner */}
                {customerProfile ? (
                  <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">
                        {customerProfile.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 block">
                          සාදරයෙන් පිළිගනිමු, {customerProfile.fullName}!
                        </span>
                        <span className="text-[11px] text-stone-600">
                          ඔබගේ ලියාපදිංචි බෙදාහැරීමේ තොරතුරු ස්වයංක්‍රීයව ඇතුළත් කර ඇත.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => (navigateTo ? navigateTo('login') : setActivePage('login'))}
                      className="text-xs font-semibold text-[#0b1a30] hover:underline shrink-0 cursor-pointer"
                    >
                      Edit Details
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-stone-700">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>පෙර ලියාපදිංචි වූ පාරිභෝගික ගිණුමක් තිබේද?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => (navigateTo ? navigateTo('login') : setActivePage('login'))}
                      className="text-xs font-semibold bg-white border border-stone-300 hover:border-stone-800 text-stone-900 px-3.5 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer"
                    >
                      Log In to Auto-Fill (පිවිසෙන්න)
                    </button>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                    Full Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter recipient's full name"
                    className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Phone Number (Call) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                    Delivery Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House / Apartment number, Street name, Nearest landmark..."
                    className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 resize-none"
                  />
                </div>

                {/* District & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      City / Postal Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharagama, Moratuwa"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                    Special Courier Notes (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Call before arrival, deliver after 2 PM"
                    className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>
            </div>

            {/* Section II: Payment Method */}
            <div className="bg-white p-7 sm:p-8 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-normal text-stone-900">
                    II. Atelier Payment Method
                  </h2>
                  <p className="font-serif italic text-xs text-amber-900/75 mt-0.5">
                    ගෙවීම් ක්‍රමය තෝරන්න
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                  Secure Checkout
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Option 1: COD */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${formData.paymentMethod === 'cod'
                    ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#0b1a30] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <strong className="font-medium text-stone-900 text-xs uppercase tracking-wider block">
                      Cash on Delivery (COD)
                    </strong>
                    <p className="text-stone-500 mt-1 leading-relaxed font-light">
                      Pay in cash directly to the courier when your handcrafted saree is safely delivered to your doorstep anywhere in Sri Lanka.
                    </p>
                  </div>
                </label>

                {/* Option 2: Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${formData.paymentMethod === 'bank'
                    ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#0b1a30] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <strong className="font-medium text-stone-900 text-xs uppercase tracking-wider block">
                      Direct Bank Transfer / Online Banking
                    </strong>
                    <p className="text-stone-500 mt-1 leading-relaxed font-light">
                      Transfer directly to our Commercial Bank atelier account. WhatsApp your deposit slip to initiate immediate dispatch.
                    </p>

                    {formData.paymentMethod === 'bank' && (
                      <div className="mt-3 p-3 bg-white border border-stone-200 text-[11px] text-stone-700 space-y-1">
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
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${formData.paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#0b1a30] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-medium text-stone-900 text-xs uppercase tracking-wider block">
                        Credit / Debit Card or 3-Month Installments
                      </strong>
                      <span className="text-[10px] text-stone-400 font-medium">Koko & Mintpay</span>
                    </div>
                    <p className="text-stone-500 mt-1 leading-relaxed font-light">
                      Secure payment link or 3 interest-free monthly installments via Koko or Mintpay.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0b1a30] hover:bg-stone-800 text-white py-4 px-6 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isSubmitting
                  ? 'Confirming Order...'
                  : `Complete Order • Rs. ${cartGrandTotal.toLocaleString()}`}
              </span>
            </button>

            {/* Reassurance Footer */}
            <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-4 pt-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-600" />
                Islandwide Delivery (Rs. 350)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                Authentic Ceylon Wax Batik Guarantee
              </span>
            </div>
          </form>

          {/* Right Column: Order Summary (5 cols, Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-stone-200/90 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-serif text-base font-normal text-stone-900">
                  Atelier Order Manifest
                </h3>
                <span className="text-xs text-stone-500 font-light">
                  {cart.length} {cart.length === 1 ? 'piece' : 'pieces'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3.5 items-start pt-3 first:pt-0">
                    <div className="w-16 h-20 bg-stone-100 shrink-0 border border-stone-200 overflow-hidden">
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
                      <h4 className="font-serif text-xs font-normal text-stone-900 truncate">
                        {item.name}
                      </h4>
                      {item.sinhalaName && (
                        <p className="text-[11px] text-amber-900/70 font-serif italic truncate mt-0.5">
                          {item.sinhalaName}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400 mt-1">
                        Qty: <strong className="text-stone-700 font-medium">{item.quantity}</strong>
                      </p>
                      <p className="text-xs font-medium text-stone-900 mt-1 font-serif">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
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
                <div className="flex justify-between text-base font-serif font-normal text-stone-900 pt-3 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-lg font-medium">
                    Rs. {cartGrandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Footnote */}
              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400 font-light space-y-1">
                <p>• Western Province: 1 to 2 business days</p>
                <p>• Outstation Delivery: 2 to 4 business days</p>
                <p>• Signature protective packaging included</p>
              </div>
            </div>

            {/* Concierge Assistance Card */}
            <div className="bg-white border border-stone-200/90 p-5 text-xs text-stone-600 space-y-2">
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
                className="inline-flex items-center gap-1.5 text-stone-900 hover:text-amber-800 font-medium pt-1 uppercase tracking-wider text-[11px] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat with WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
