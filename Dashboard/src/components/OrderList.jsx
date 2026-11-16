import React, { useState, useMemo } from 'react';
import {
  Package,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

const formatOrderDate = (dateVal) => {
  if (!dateVal) return 'Recent';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch (e) {
    return 'Recent';
  }
};

export default function OrderList({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const matchesRef = order.orderReference?.toLowerCase().includes(q);
        const matchesName = order.customerName?.toLowerCase().includes(q);
        const matchesPhone = order.phone?.toLowerCase().includes(q);
        const matchesCity = order.city?.toLowerCase().includes(q);
        const matchesDistrict = order.district?.toLowerCase().includes(q);
        if (!matchesRef && !matchesName && !matchesPhone && !matchesCity && !matchesDistrict) {
          return false;
        }
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: (orders || []).length },
    {
      value: 'pending',
      label: 'Pending',
      count: (orders || []).filter((o) => o.status === 'pending').length,
    },
    {
      value: 'confirmed',
      label: 'Confirmed',
      count: (orders || []).filter((o) => o.status === 'confirmed').length,
    },
    {
      value: 'processing',
      label: 'Processing',
      count: (orders || []).filter((o) => o.status === 'processing').length,
    },
    {
      value: 'shipped',
      label: 'Shipped',
      count: (orders || []).filter((o) => o.status === 'shipped').length,
    },
    {
      value: 'delivered',
      label: 'Delivered',
      count: (orders || []).filter((o) => o.status === 'delivered').length,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      count: (orders || []).filter((o) => o.status === 'cancelled').length,
    },
  ];

  const getCleanPhone = (phone) => {
    if (!phone) return '';
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '94' + p.substring(1);
    return p;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 max-w-7xl mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ref, customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === opt.value
                  ? 'bg-[#0a1120] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  statusFilter === opt.value
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-xs">
          <Package size={32} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No Orders Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search
              ? 'No customer orders match your search keyword. Clear the search to view all.'
              : 'Orders placed on the website checkout will show up here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const cleanPhone = getCleanPhone(order.whatsapp || order.phone);
            const whatsappMsg = encodeURIComponent(
              `Hello ${order.customerName || ''}, thank you for ordering from Nandani Batik! Regarding your order ${order.orderReference}:`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 hover:border-slate-300 transition-colors"
              >
                {/* Header Row: Reference, Status, Date & Delete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {order.orderReference}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatOrderDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[11px] font-medium text-slate-500">Status:</span>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                      className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => setDeleteConfirmId(order.id)}
                      className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Order Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Body: Customer Details (Left) + Items & Totals (Right) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3.5">
                  {/* Customer Information (4 cols) */}
                  <div className="md:col-span-4 space-y-2 text-xs">
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      Customer & Shipping
                    </div>
                    <div className="font-semibold text-slate-900">{order.customerName}</div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span className="font-mono">{order.phone}</span>
                    </div>

                    {/* WhatsApp Direct Action */}
                    {cleanPhone && (
                      <div className="pt-0.5">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-medium transition-colors"
                        >
                          <MessageCircle size={12} />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>
                    )}

                    <div className="flex items-start gap-1.5 text-slate-600 pt-1">
                      <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <div>{order.address}</div>
                        <div className="text-slate-500 font-medium">
                          {order.city ? `${order.city}, ` : ''}
                          <span className="text-slate-800">{order.district}</span>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="p-2 rounded bg-amber-50/70 text-[11px] text-amber-900 border border-amber-200/60 mt-1.5">
                        <span className="font-semibold">Note: </span>
                        {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Saree Items List (5 cols) */}
                  <div className="md:col-span-5 space-y-2 text-xs border-t md:border-t-0 md:border-l border-slate-100 md:pl-5 pt-3 md:pt-0">
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      Items Ordered ({(order.items || []).length})
                    </div>

                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 border-b border-slate-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.image && item.image.trim() ? item.image.trim() : '/sarees/saree 1.1.png'}
                              alt={item.name}
                              className="w-9 h-11 rounded object-cover border border-slate-200 shrink-0 bg-slate-50"
                              onError={(e) => {
                                e.target.src = '/sarees/saree 1.1.png';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-slate-800 truncate">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                Rs. {Number(item.price).toLocaleString()} × {item.quantity || 1}
                              </div>
                            </div>
                          </div>
                          <div className="font-mono font-medium text-slate-900 shrink-0 ml-2">
                            Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial & Payment Summary (3 cols) */}
                  <div className="md:col-span-3 space-y-2 text-xs border-t md:border-t-0 md:border-l border-slate-100 md:pl-5 pt-3 md:pt-0 flex flex-col justify-between">
                    <div className="space-y-1.5 font-mono">
                      <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        Payment & Total
                      </div>

                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Subtotal:</span>
                        <span>Rs. {Number(order.subtotal || 0).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Delivery Fee:</span>
                        <span>
                          {Number(order.shippingFee || 0) === 0
                            ? 'FREE'
                            : `Rs. ${Number(order.shippingFee).toLocaleString()}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-slate-900 font-bold text-sm">
                        <span>Grand Total:</span>
                        <span>Rs. {Number(order.grandTotal || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                        <CreditCard size={12} className="text-slate-500" />
                        <span className="capitalize">
                          {order.paymentMethod === 'cod'
                            ? 'Cash on Delivery (COD)'
                            : order.paymentMethod || 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Delete Order Record?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to remove this order from history? This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteOrder(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-xs"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
