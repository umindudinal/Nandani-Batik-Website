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
      fetchCustomerOrders(customerProfile.phone);
    }
  }, [customerProfile]);

  // Fetch orders matching customer's phone
  const fetchCustomerOrders = async (phone) => {
    if (!phone) return;
    setIsLoadingOrders(true);
    setOrderError('');

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const cleanPhone = phone.replace(/[\s-+]/g, '');
      const res = await fetch(`${apiBase}/orders?phone=${encodeURIComponent(cleanPhone)}`);
      
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
      const res = await fetch(`${apiBase}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      alert('Could not update profile: ' + (err.message || 'Server error'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out from Nandani Batik?')) {
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
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'processing':
        return {
          icon: <Package className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Processing',
          sinhala: 'සූදානම් කෙරෙමින් පවතී',
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'shipped':
        return {
          icon: <Truck className="w-3.5 h-3.5 text-purple-600" />,
          label: 'Out for Delivery',
          sinhala: 'බෙදාහැරීමට භාර දී ඇත',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'delivered':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Delivered',
          sinhala: 'භාණ්ඩය භාර දෙන ලදී',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Cancelled',
          sinhala: 'අවලංගු කරන ලදී',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Pending Review',
          sinhala: 'ඇණවුම ලැබී ඇත',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
    }
  };

  // IF NOT SIGNED IN -> Show friendly Login prompt
  if (!customerProfile) {
    return (
      <div className="min-h-[70vh] bg-[#fcfbf9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Customer Portal
            </h1>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Please sign in to your Nandani Atelier account to view your placed orders and delivery status.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => (navigateTo ? navigateTo('login') : setActivePage('login'))}
              className="w-full bg-[#c1272d] hover:bg-[#a61c22] text-white py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-900/10 cursor-pointer"
            >
              <span>Log In or Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
              className="w-full border border-stone-200 hover:border-stone-400 text-stone-700 py-3 px-6 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Back to Saree Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalOrdersPlaced = orders.length;
  const totalSpentCalculated = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);

  // Initials for avatar
  const initials = customerProfile.fullName
    ? customerProfile.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'NB';

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* TOP PROFILE HERO BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0b1a30] via-[#12233c] to-[#1c3252] text-white p-6 sm:p-10 shadow-2xl overflow-hidden border border-amber-500/20">
          {/* Subtle Atelier Watermark */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
            <img src="/nandani-logo.jpg" alt="Watermark" className="w-96 h-96 object-cover rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-[#0b1a30] rounded-[14px] flex items-center justify-center text-amber-300 font-serif text-xl sm:text-2xl font-bold">
                  {initials}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                    {customerProfile.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                    Atelier Patron
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    {customerProfile.phone}
                  </span>
                  {customerProfile.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      {customerProfile.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {customerProfile.district}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Shop Sarees</span>
              </button>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Orders Placed
              </span>
              <span className="font-serif text-2xl font-bold text-amber-300">
                {totalOrdersPlaced}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Total Purchased
              </span>
              <span className="font-serif text-2xl font-bold text-amber-300">
                Rs. {totalSpentCalculated.toLocaleString()}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Saved Wishlist
              </span>
              <span className="font-serif text-2xl font-bold text-amber-300">
                {wishlist.length} {wishlist.length === 1 ? 'Saree' : 'Sarees'}
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-stone-200 gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#0b1a30] text-[#0b1a30] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders (මගේ ඇණවුම්)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#0b1a30] text-[#0b1a30] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Delivery Address (මගේ තොරතුරු)</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-[#0b1a30] text-[#0b1a30] font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS LIST */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                Your Placed Orders
              </h2>
              <button
                onClick={() => fetchCustomerOrders(customerProfile.phone)}
                disabled={isLoadingOrders}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
                title="Refresh order history"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>

            {orderError && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{orderError}</span>
              </div>
            )}

            {isLoadingOrders ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600" />
                <p className="text-xs text-stone-500">Loading your order history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200/80 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-stone-900">No Orders Placed Yet</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    You haven't placed any saree orders with phone number <strong>{customerProfile.phone}</strong> yet.
                  </p>
                </div>
                <button
                  onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
                  className="inline-flex items-center gap-2 bg-[#0b1a30] hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Explore Handcrafted Sarees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
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
                      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-6 bg-stone-50/80 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs sm:text-sm font-bold text-stone-900">
                              #{order.orderReference}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
                            >
                              {statusInfo.icon}
                              <span>{statusInfo.label}</span>
                              <span className="text-[10px] font-normal opacity-80 hidden sm:inline">
                                ({statusInfo.sinhala})
                              </span>
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : 'Recent'}
                          </p>
                        </div>

                        {/* Grand Total & WhatsApp Direct Action */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                              Total Amount
                            </span>
                            <span className="font-serif text-lg font-bold text-[#0b1a30]">
                              Rs. {(Number(order.grandTotal) || 0).toLocaleString()}
                            </span>
                          </div>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-2xs transition-colors shrink-0"
                            title="Chat with atelier on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp Us</span>
                          </a>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="p-4 sm:p-6 divide-y divide-stone-100">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-14 h-16 sm:w-16 sm:h-20 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                                <img
                                  src={item.image || '/sarees/saree 1.1.png'}
                                  alt={item.title || 'Saree'}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>

                              <div className="min-w-0 space-y-1">
                                <h4 className="font-serif text-sm font-medium text-stone-900 truncate">
                                  {item.title || item.name || 'Silk Batik Saree'}
                                </h4>
                                <p className="text-xs text-stone-500">
                                  Qty: {item.quantity || 1} • Rs. {(Number(item.price) || 0).toLocaleString()} each
                                </p>
                                {item.fabric && (
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-600 font-mono">
                                    {item.fabric}
                                  </span>
                                )}
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

                      {/* Shipping & Payment Footer Info */}
                      <div className="p-4 sm:p-5 bg-stone-50/50 border-t border-stone-100 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-start gap-2 max-w-md">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <span className="truncate">
                            Delivering to: {order.address || customerProfile.address}, {order.city || customerProfile.city}, {order.district || customerProfile.district}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium text-[11px]">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE DETAILS & DELIVERY ADDRESS FORM */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900">
                Personal & Delivery Details
              </h2>
              <p className="text-xs text-stone-500">
                Keep your delivery address and contact information up-to-date for fast 1-click checkout.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your profile details have been saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    Full Name (සම්පූර්ණ නම)
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    Contact Phone Number (දුරකථන අංකය)
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleProfileChange}
                    className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* Delivery Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    Primary Delivery Address (බෙදාහැරීමේ ලිපිනය)
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    placeholder="House No, Road / Street"
                    className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    District
                  </label>
                  <div className="relative">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 pr-10 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none appearance-none cursor-pointer transition-all"
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
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    City / Town (නගරය)
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleProfileChange}
                    placeholder="e.g. Maharagama"
                    className="w-full h-11 px-4 bg-[#f8f9fa] focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 rounded-xl text-stone-900 text-sm focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 bg-[#0b1a30] hover:bg-stone-900 text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SAVED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl text-stone-900">
              Your Saved Wishlist ({wishlist.length})
            </h2>

            {wishlist.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200/80 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-stone-900">Your Wishlist is Empty</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Save the sarees you adore to revisit or order anytime.
                  </p>
                </div>
                <button
                  onClick={() => (navigateTo ? navigateTo('shop') : setActivePage('shop'))}
                  className="inline-flex items-center gap-2 bg-[#0b1a30] hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Explore Saree Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((saree) => (
                  <div
                    key={saree.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-3/4 overflow-hidden bg-stone-100 relative">
                      <img
                        src={saree.images?.[0] || saree.image || '/sarees/saree 1.1.png'}
                        alt={saree.title}
                        className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
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
                        className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-[#0b1a30] hover:bg-stone-900 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
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
  );
}
