import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  LogOut,
  Save,
  Heart,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CustomerProfilePage() {
  const {
    customerProfile,
    saveCustomerProfile,
    navigateTo,
    setActivePage,
    wishlist,
    showToast,
    showConfirm,
    showAlert,
  } = useCart();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'details' | 'wishlist'
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Editable Profile Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    district: 'Colombo',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Hydrate form data when customerProfile changes
  useEffect(() => {
    if (customerProfile) {
      setFormData({
        fullName: customerProfile.fullName || '',
        phone: customerProfile.phone || '',
        whatsapp: customerProfile.whatsapp || customerProfile.phone || '',
        email: customerProfile.email || '',
        address: customerProfile.address || '',
        district: customerProfile.district || 'Colombo',
        city: customerProfile.city || '',
        postalCode: customerProfile.postalCode || '',
        notes: customerProfile.notes || '',
      });
      fetchCustomerOrders(customerProfile.phone, customerProfile.email);
    }
  }, [customerProfile]);

  // Fetch orders matching customer's phone or email
  const fetchCustomerOrders = async (phone, email) => {
    if (!phone && !email) return;
    setIsLoadingOrders(true);
    setOrderError('');

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const cleanPhone = (phone || '').replace(/[\s-+]/g, '');
      const params = new URLSearchParams();
      if (cleanPhone) params.append('phone', cleanPhone);
      if (email) params.append('email', email);
      const res = await fetch(`${apiBase}/orders?${params.toString()}`);

      if (!res.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Error fetching customer orders:', err);
      setOrderError('Orders could not be loaded at this moment. You can contact us via WhatsApp.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveSuccess(false);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const payload = {
        ...formData,
        id: customerProfile?.id,
      };
      const res = await fetch(`${apiBase}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      const updated = data.customer || formData;
      if (typeof saveCustomerProfile === 'function') {
        saveCustomerProfile(updated);
      }
      setSaveSuccess(true);
      if (showToast) showToast('Profile details updated successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      showAlert({
        title: 'Could Not Update Profile',
        message: err.message || 'Server error while saving details. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    const confirmed = await showConfirm({
      title: 'Sign Out from Nandani Batik',
      message: 'Are you sure you want to sign out from your Nandani Batik client account?',
      confirmText: 'Sign Out',
      cancelText: 'Stay Signed In',
      type: 'danger',
    });

    if (confirmed) {
      if (typeof saveCustomerProfile === 'function') {
        saveCustomerProfile(null);
      }
      if (showToast) showToast('Signed out successfully');
      if (navigateTo) {
        navigateTo('home');
      } else if (setActivePage) {
        setActivePage('home');
      }
    }
  };

  // Helper for Order Status Badge
  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Confirmed',
          sinhala: 'තහවුරු කර ඇත',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200/80',
        };
      case 'processing':
        return {
          icon: <Package className="w-3.5 h-3.5 text-amber-600" />,
          label: 'In Atelier Production',
          sinhala: 'සූදානම් කෙරෙමින් පවතී',
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/80',
        };
      case 'shipped':
        return {
          icon: <Truck className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Out for Delivery',
          sinhala: 'බෙදාහැරීමට භාර දී ඇත',
          badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200/80',
        };
      case 'delivered':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Delivered',
          sinhala: 'භාර දෙන ලදී',
          badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Cancelled',
          sinhala: 'අවලංගු කරන ලදී',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-stone-600" />,
          label: 'Order Received',
          sinhala: 'ඇණවුම ලැබී ඇත',
          badgeClass: 'bg-stone-100 text-stone-800 border-stone-200',
        };
    }
  };

  // IF NOT SIGNED IN -> Show friendly editorial login prompt
  if (!customerProfile) {
    return (
      <div className="min-h-[75vh] bg-[#fbfaf8] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 shadow-sm border border-stone-200/80 text-center space-y-6">
          <div className="w-14 h-14 bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-700">
            <User className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-stone-400">
              Nandani Batik Atelier
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Customer Account
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Sign in to view your placed orders, track courier delivery status, and manage your delivery address.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => (navigateTo ? navigateTo('login') : setActivePage('login'))}
              className="w-full bg-[#c1272d] hover:bg-[#a61c22] text-white py-3 px-6 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Sign In / Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
              className="w-full border border-stone-200 hover:border-stone-400 text-stone-700 py-3 px-6 text-xs font-medium transition-colors cursor-pointer"
            >
              Return to Saree Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EDITORIAL ATELIER CLIENT HEADER (Natural, Non-AI, Elegant) */}
        <div className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-stone-400">
                <span>Nandani Client Portal</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-normal tracking-tight">
                Welcome, {customerProfile.fullName || 'Valued Customer'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {customerProfile.phone}
                </span>
                {customerProfile.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    {customerProfile.email}
                  </span>
                )}
                {customerProfile.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {customerProfile.city}, {customerProfile.district}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-stone-800 text-white px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                <span>Shop Sarees</span>
              </button>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Understated Editorial Tabs */}
          <div className="pt-4 flex items-center gap-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-[#c1272d] text-[#c1272d]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Bespoke Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'border-[#c1272d] text-[#c1272d]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Delivery Address</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`pb-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'wishlist'
                  ? 'border-[#c1272d] text-[#c1272d]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Saved Wishlist ({wishlist.length})</span>
            </button>
          </div>
        </div>

        {/* MAIN BODY - 2 COLUMN LUXURY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: CLIENT SUMMARY & ATELIER ASSISTANCE */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Primary Delivery Address Card */}
            <div className="bg-white border border-stone-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-wider uppercase text-stone-400 font-semibold">
                  Default Delivery Address
                </span>
                <button
                  onClick={() => setActiveTab('details')}
                  className="text-xs text-[#c1272d] hover:underline font-medium cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-1 text-xs text-stone-600">
                <p className="font-medium text-stone-900">{customerProfile.fullName}</p>
                <p className="text-stone-700 leading-relaxed">
                  {customerProfile.address || 'No primary street address registered'}
                </p>
                <p className="text-stone-700">
                  {customerProfile.city ? `${customerProfile.city}, ` : ''}{customerProfile.district || 'Sri Lanka'}
                </p>
                <p className="text-stone-500 pt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {customerProfile.phone}
                </p>
              </div>
            </div>

            {/* Atelier Concierge & WhatsApp Assistance */}
            <div className="bg-[#faf8f5] border border-[#ede7df] p-5 sm:p-6 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 font-semibold block">
                  Artisan Support
                </span>
                <h3 className="font-serif text-base text-stone-900">
                  Custom Inquiries & In-Store Appointments
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Need color customization, bridal draping consultation, or instant updates regarding your package?
              </p>
              <a
                href={`https://wa.me/94778924115?text=${encodeURIComponent(
                  `Hello Nandani Batik Atelier! I am inquiring about my orders / account as ${customerProfile.fullName} (${customerProfile.phone}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 text-xs font-medium transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat via WhatsApp (+94 77 892 4115)</span>
              </a>
            </div>

          </div>

          {/* RIGHT AREA: ORDERS, DETAILS FORM, OR WISHLIST */}
          <div className="lg:col-span-8">
            
            {/* VIEW 1: BESPOKE ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                      Order History
                    </h2>
                    <p className="text-xs text-stone-500">
                      View all orders placed under {customerProfile.phone || customerProfile.email}
                    </p>
                  </div>

                  <button
                    onClick={() => fetchCustomerOrders(customerProfile.phone, customerProfile.email)}
                    disabled={isLoadingOrders}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
                    title="Refresh order history"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>

                {orderError && (
                  <div className="p-4 bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{orderError}</span>
                  </div>
                )}

                {isLoadingOrders ? (
                  <div className="p-12 text-center bg-white border border-stone-200/80 space-y-3">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-stone-400" />
                    <p className="text-xs text-stone-500">Retrieving order details from atelier records...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-stone-200/80 space-y-4">
                    <div className="w-14 h-14 bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg text-stone-900">No Orders Placed Yet</h3>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        You have not placed any saree orders with <strong>{customerProfile.phone || customerProfile.email}</strong> yet.
                      </p>
                    </div>
                    <button
                      onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
                      className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>Explore Handcrafted Sarees</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusInfo = getStatusBadge(order.status);
                      const items = Array.isArray(order.items) ? order.items : [];
                      const waMessage = encodeURIComponent(
                        `Hello Nandani Batik! I would like to inquire regarding my order #${order.orderReference} (${customerProfile.fullName}).`
                      );
                      const waUrl = `https://wa.me/94778924115?text=${waMessage}`;

                      return (
                        <div
                          key={order.id || order.orderReference}
                          className="bg-white border border-stone-200/80 shadow-xs overflow-hidden"
                        >
                          {/* Order Card Header */}
                          <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-xs sm:text-sm font-semibold text-stone-900">
                                  #{order.orderReference}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium border ${statusInfo.badgeClass}`}
                                >
                                  {statusInfo.icon}
                                  <span>{statusInfo.label}</span>
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })
                                  : 'Recent Order'}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                                  Total
                                </span>
                                <span className="font-mono text-sm sm:text-base font-bold text-stone-900">
                                  Rs. {(Number(order.grandTotal) || 0).toLocaleString()}
                                </span>
                              </div>

                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 text-xs font-medium transition-colors shrink-0"
                                title="Chat regarding this order"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Inquire</span>
                              </a>
                            </div>
                          </div>

                          {/* Ordered Sarees List */}
                          <div className="p-4 sm:p-5 divide-y divide-stone-100">
                            {items.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className="w-12 h-14 bg-stone-100 overflow-hidden shrink-0 border border-stone-200/80">
                                    <img
                                      src={item.image || '/sarees/saree 1.1.png'}
                                      alt={item.title || 'Saree'}
                                      className="w-full h-full object-cover object-top"
                                    />
                                  </div>

                                  <div className="min-w-0 space-y-0.5">
                                    <h4 className="font-serif text-xs sm:text-sm font-medium text-stone-900 truncate">
                                      {item.title || item.name || 'Handcrafted Batik Saree'}
                                    </h4>
                                    <p className="text-[11px] text-stone-500">
                                      Qty: {item.quantity || 1} • Rs. {(Number(item.price) || 0).toLocaleString()} each
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-mono text-xs sm:text-sm font-semibold text-stone-900">
                                    Rs. {((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Address Details */}
                          <div className="p-3.5 sm:p-4 bg-stone-50/40 border-t border-stone-100 text-[11px] text-stone-500 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 truncate max-w-md">
                              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="truncate">
                                Delivering to: {order.address || customerProfile.address}, {order.city || customerProfile.city}, {order.district || customerProfile.district}
                              </span>
                            </div>

                            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 font-medium text-[10px]">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: PROFILE & DELIVERY ADDRESS FORM */}
            {activeTab === 'details' && (
              <div className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-1 pb-4 border-b border-stone-100">
                  <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                    Personal & Delivery Details
                  </h2>
                  <p className="text-xs text-stone-500">
                    Keep your contact phone and primary street address updated for seamless checkout.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your details have been updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Full Name (සම්පූර්ණ නම)
                      </label>
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none transition-all"
                      />
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Contact Phone (දුරකථන අංකය)
                      </label>
                      <input
                        type="tel"
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none transition-all"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none transition-all"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Primary Delivery Address (බෙදාහැරීමේ ලිපිනය)
                      </label>
                      <input
                        type="text"
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleProfileChange}
                        placeholder="House No, Road / Street"
                        className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none transition-all"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        District (දිස්ත්‍රික්කය)
                      </label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleProfileChange}
                          className="w-full h-11 px-4 pr-10 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none appearance-none cursor-pointer transition-all"
                        >
                          {districts.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        City / Town (නගරය)
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleProfileChange}
                        placeholder="e.g. Maharagama"
                        className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-stone-800 text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 3: SAVED WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="pb-1">
                  <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                    Saved Wishlist
                  </h2>
                  <p className="text-xs text-stone-500">
                    Sarees you have saved to your private curation ({wishlist.length})
                  </p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-stone-200/80 space-y-4">
                    <div className="w-14 h-14 bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      <Heart className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg text-stone-900">Your Wishlist is Empty</h3>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Save the sarees you admire to easily find them later.
                      </p>
                    </div>
                    <button
                      onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
                      className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>Explore Saree Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlist.map((saree) => (
                      <div
                        key={saree.id}
                        className="bg-white border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-sm transition-shadow group"
                      >
                        <div className="aspect-3/4 overflow-hidden bg-stone-100 relative">
                          <img
                            src={saree.images?.[0] || saree.image || '/sarees/saree 1.1.png'}
                            alt={saree.title}
                            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-serif text-sm font-medium text-stone-900 truncate">
                            {saree.title}
                          </h4>
                          <p className="font-mono text-sm font-semibold text-stone-900">
                            Rs. {(Number(saree.price) || 0).toLocaleString()}
                          </p>
                          <button
                            onClick={() => {
                              if (navigateTo) {
                                navigateTo('saree-detail', null, saree);
                              } else if (setActivePage) {
                                setActivePage('saree-detail');
                              }
                            }}
                            className="w-full mt-1 inline-flex items-center justify-center gap-1.5 bg-[#1a1a1a] hover:bg-stone-800 text-white py-2 px-3 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <span>View Saree</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
