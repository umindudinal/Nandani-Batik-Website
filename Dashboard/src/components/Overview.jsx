import React from 'react';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  Plus,
  CreditCard,
} from 'lucide-react';

export default function Overview({
  stats,
  orders,
  sarees,
  setActiveTab,
  onOpenAddModal,
  systemHealth,
  onUpdateOrderStatus,
  onToggleField,
}) {
  const recentOrders = (orders || []).slice(0, 6);
  const outOfStockItems = (sarees || []).filter((s) => !s.inStock);
  const confirmedOrders = (orders || []).filter((o) => o.status !== 'cancelled');
  const avgOrderValue =
    confirmedOrders.length > 0
      ? Math.round((stats?.totalRevenue || 0) / confirmedOrders.length)
      : 0;

  const getCleanPhone = (phone) => {
    if (!phone) return '';
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '94' + p.substring(1);
    return p;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Gross Revenue
            </span>
            <span className="text-slate-400">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              Rs. {(stats?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              From {confirmedOrders.length} orders · Avg Rs. {avgOrderValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <span className="text-slate-400">
              <Package size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              {stats?.totalOrders || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
              <span className="font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {stats?.pendingOrders || 0} Pending
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">
                {stats?.processingOrders || 0} Processing
              </span>
            </div>
          </div>
        </div>

        {/* Saree Catalog */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Saree Catalog
            </span>
            <span className="text-slate-400">
              <ShoppingBag size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              {stats?.totalSarees || 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
              <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {stats?.inStockSarees || 0} In Stock
              </span>
              {stats?.outOfStockSarees > 0 && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    {stats.outOfStockSarees} Sold Out
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg. Order Value
            </span>
            <span className="text-slate-400">
              <CreditCard size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              Rs. {avgOrderValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Across confirmed customer checkouts
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Orders Table & Inventory Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3): Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-500">
                Orders received through the website storefront
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>View all ({orders.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No orders received yet. Once a customer places an order on the website, it will immediately appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Order Ref</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => {
                    const cleanPhone = getCleanPhone(order.phone);
                    const whatsappMsg = encodeURIComponent(
                      `Hello ${order.customerName || ''}, thank you for ordering from Nandani Batik! Regarding your order ${order.orderReference}:`
                    );

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-slate-800">
                          {order.orderReference}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400">{order.city || order.district}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {Array.isArray(order.items) ? `${order.items.length} item(s)` : '1 item'}
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-slate-900">
                          Rs. {Number(order.grandTotal || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(order.id, e.target.value)}
                            className="text-[11px] font-medium rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {cleanPhone ? (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={12} />
                              <span>WhatsApp</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1/3): Inventory Status & Quick Controls */}
        <div className="space-y-4">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Quick Operations
            </h3>
            <div className="space-y-2">
              <button
                onClick={onOpenAddModal}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#0a1120] hover:bg-[#16233b] text-white text-xs font-medium transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Plus size={15} className="text-brand-gold" />
                  <span>Add New Saree to Catalog</span>
                </div>
                <ArrowRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('sarees')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={15} className="text-slate-400" />
                  <span>Manage Saree Prices & Photos</span>
                </div>
                <ArrowRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-slate-400" />
                  <span>Review Customer Orders</span>
                </div>
                <ArrowRight size={13} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Out of Stock Alert / Catalog Health */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Inventory Alerts
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {outOfStockItems.length} out of stock
              </span>
            </div>

            {outOfStockItems.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-900">
                    Catalog Healthy
                  </p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    All sarees are in stock and purchasable.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {outOfStockItems.slice(0, 4).map((saree) => (
                  <div
                    key={saree.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={saree.image && saree.image.trim() ? saree.image.trim() : '/sarees/saree 1.1.png'}
                        alt={saree.name}
                        className="w-9 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.src = '/sarees/saree 1.1.png';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-800 truncate">
                          {saree.name}
                        </div>
                        <div className="text-[10px] text-rose-600 font-medium">
                          Sold Out (Hidden)
                        </div>
                      </div>
                    </div>

                    {onToggleField && (
                      <button
                        onClick={() => onToggleField(saree.id, 'inStock', true)}
                        className="text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 transition-colors shrink-0 ml-2"
                        title="Mark back in stock"
                      >
                        Restock
                      </button>
                    )}
                  </div>
                ))}

                {outOfStockItems.length > 4 && (
                  <button
                    onClick={() => setActiveTab('sarees')}
                    className="w-full text-center text-[11px] font-medium text-slate-500 hover:text-slate-800 py-1"
                  >
                    + {outOfStockItems.length - 4} more sold-out items
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
