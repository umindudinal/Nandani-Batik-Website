import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  Download,
  Trash2,
  AlertTriangle,
  X,
  Package,
  TrendingUp,
  Map,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';

export default function CustomerList({
  customers = [],
  orders = [],
  onDeleteCustomer,
}) {
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'spent' | 'orders' | 'name'
  const [copiedPhones, setCopiedPhones] = useState(false);
  const [selectedCustomerForOrders, setSelectedCustomerForOrders] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Sri Lanka Districts
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

  // Helper: clean international phone for WhatsApp / Tel
  const getCleanPhone = (phone) => {
    if (!phone) return '';
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '94' + p.substring(1);
    if (!p.startsWith('94') && p.length === 9) p = '94' + p;
    return p;
  };

  // Helper: format registered date
  const formatDate = (dateVal) => {
    if (!dateVal) return 'Recent';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return 'Recent';
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  // Helper: Status badge for customer orders in modal
  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'confirmed':
        return { label: 'Confirmed', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'processing':
        return { label: 'Processing', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'shipped':
        return { label: 'Out for Delivery', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'delivered':
        return { label: 'Delivered', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'cancelled':
        return { label: 'Cancelled', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'pending':
      default:
        return { label: 'Pending Review', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  // Helper: get customer's placed orders from the orders list
  const getCustomerOrders = (phone) => {
    if (!phone || !Array.isArray(orders)) return [];
    const clean = phone.replace(/[\s-+]/g, '');
    return orders.filter((o) => (o.phone || '').replace(/[\s-+]/g, '') === clean);
  };

  // Calculate live customer orders count & spend dynamically
  const customerListWithComputedStats = useMemo(() => {
    return (customers || []).map((c) => {
      const custOrders = getCustomerOrders(c.phone);
      const ordersCount = custOrders.length > 0 ? custOrders.length : (Number(c.ordersCount) || 0);
      const computedSpent = custOrders.length > 0
        ? custOrders
            .filter((o) => o.status !== 'cancelled')
            .reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0)
        : (Number(c.totalSpent) || 0);

      return {
        ...c,
        computedOrdersCount: ordersCount,
        computedTotalSpent: computedSpent,
        activeOrders: custOrders,
      };
    });
  }, [customers, orders]);

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    let result = customerListWithComputedStats.filter((customer) => {
      // District filter
      if (districtFilter !== 'all' && customer.district !== districtFilter) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = customer.fullName?.toLowerCase().includes(q);
        const matchesPhone = customer.phone?.toLowerCase().includes(q);
        const matchesWa = customer.whatsapp?.toLowerCase().includes(q);
        const matchesEmail = customer.email?.toLowerCase().includes(q);
        const matchesCity = customer.city?.toLowerCase().includes(q);
        const matchesDistrict = customer.district?.toLowerCase().includes(q);
        const matchesAddress = customer.address?.toLowerCase().includes(q);

        if (
          !matchesName &&
          !matchesPhone &&
          !matchesWa &&
          !matchesEmail &&
          !matchesCity &&
          !matchesDistrict &&
          !matchesAddress
        ) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'spent') {
        return b.computedTotalSpent - a.computedTotalSpent;
      }
      if (sortBy === 'orders') {
        return b.computedOrdersCount - a.computedOrdersCount;
      }
      if (sortBy === 'name') {
        return (a.fullName || '').localeCompare(b.fullName || '');
      }
      // 'recent' by default
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return result;
  }, [customerListWithComputedStats, search, districtFilter, sortBy]);

  // Overall statistics
  const totalCustomersCount = customers.length;
  const totalOrdersCount = customerListWithComputedStats.reduce(
    (sum, c) => sum + c.computedOrdersCount,
    0
  );
  const totalCustomerSpend = customerListWithComputedStats.reduce(
    (sum, c) => sum + c.computedTotalSpent,
    0
  );
  const uniqueDistrictsCount = new Set(
    customers.map((c) => c.district).filter(Boolean)
  ).size;

  // Copy phone numbers to clipboard
  const handleCopyPhones = () => {
    const phoneList = filteredCustomers
      .map((c) => `${c.fullName}: ${c.phone}`)
      .filter(Boolean)
      .join('\n');

    if (!phoneList) return;
    navigator.clipboard.writeText(phoneList);
    setCopiedPhones(true);
    setTimeout(() => setCopiedPhones(false), 2500);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) return;

    const headers = [
      'Full Name',
      'Contact Phone',
      'WhatsApp Number',
      'Email Address',
      'Delivery Address',
      'City / Town',
      'District',
      'Total Orders Placed',
      'Total Lifetime Spend (LKR)',
      'Joined Date',
      'Notes',
    ];

    const rows = filteredCustomers.map((c) => [
      `"${(c.fullName || '').replace(/"/g, '""')}"`,
      `"${c.phone || ''}"`,
      `"${c.whatsapp || c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${c.city || ''}"`,
      `"${c.district || ''}"`,
      c.computedOrdersCount,
      c.computedTotalSpent,
      `"${formatDate(c.createdAt)}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nandani_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto select-none">
      
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Patrons */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Customers
            </span>
            <span className="text-slate-400">
              <Users size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              {totalCustomersCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Registered patrons & buyers
            </p>
          </div>
        </div>

        {/* Total Placed Orders */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Customer Orders
            </span>
            <span className="text-slate-400">
              <Package size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              {totalOrdersCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Across registered customer accounts
            </p>
          </div>
        </div>

        {/* Customer Lifetime Spend */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Customer Spend (LKR)
            </span>
            <span className="text-slate-400">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              Rs. {totalCustomerSpend.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Total sales from client accounts
            </p>
          </div>
        </div>

        {/* Regional Reach */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Districts Reached
            </span>
            <span className="text-slate-400">
              <Map size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-bold text-slate-900">
              {uniqueDistrictsCount} <span className="text-xs font-normal text-slate-500">/ 25</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Active delivery destinations
            </p>
          </div>
        </div>
      </div>

      {/* FILTER, SEARCH & ACTIONS BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, city, address..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Actions (Copy & Export) */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleCopyPhones}
              disabled={filteredCustomers.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Copy customer phone numbers for marketing or SMS broadcast"
            >
              {copiedPhones ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedPhones ? 'Copied to Clipboard!' : 'Copy Contact List'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredCustomers.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Export customer list to CSV spreadsheet"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* District Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Districts ({customers.length})</option>
              {districts.map((d) => {
                const count = customers.filter((c) => c.district === d).length;
                return (
                  <option key={d} value={d}>
                    {d} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="recent">Recently Registered</option>
              <option value="spent">Highest Spend (LKR)</option>
              <option value="orders">Most Orders Placed</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <div className="ml-auto text-slate-400 text-[11px]">
            Showing <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> customers
          </div>
        </div>
      </div>

      {/* CUSTOMERS LIST / CARDS */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Users size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">No Customers Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || districtFilter !== 'all'
                ? 'No registered customers match your current filter criteria.'
                : 'Customer records will automatically appear as patrons register or place orders on the website.'}
            </p>
          </div>
          {(search || districtFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setDistrictFilter('all');
              }}
              className="text-xs text-brand-gold hover:underline font-medium cursor-pointer"
            >
              Reset Search & Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => {
            const cleanPhone = getCleanPhone(customer.phone);
            const waPhone = getCleanPhone(customer.whatsapp || customer.phone);
            const waUrl = waPhone
              ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
                  `Hello ${customer.fullName || 'Valued Customer'}, thank you for connecting with Nandani Batik!`
                )}`
              : '#';

            const initials = customer.fullName
              ? customer.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'NB';

            return (
              <div
                key={customer.id || customer.phone}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                {/* Customer Card Header */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-brand-gold flex items-center justify-center font-serif text-sm font-bold shrink-0 border border-slate-700">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 truncate">
                          {customer.fullName || 'Valued Customer'}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Calendar size={11} />
                          <span>Joined {formatDate(customer.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete action */}
                    {onDeleteCustomer && (
                      <button
                        onClick={() => setDeleteConfirmId(customer.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete customer record"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Contact Badges */}
                  <div className="space-y-2 pt-1 text-xs">
                    {/* Phone */}
                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 truncate">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-900 font-medium">
                          {customer.phone || 'No phone'}
                        </span>
                      </div>
                      {cleanPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="text-[11px] text-blue-600 hover:underline font-medium shrink-0 ml-2"
                        >
                          Call
                        </a>
                      )}
                    </div>

                    {/* WhatsApp */}
                    {waPhone && (
                      <div className="flex items-center justify-between text-slate-600 bg-emerald-50/60 px-3 py-2 rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-2 truncate">
                          <MessageCircle size={13} className="text-emerald-600 shrink-0" />
                          <span className="font-mono text-emerald-950 text-xs">
                            {customer.whatsapp || customer.phone}
                          </span>
                        </div>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 hover:underline font-medium shrink-0 ml-2 flex items-center gap-1"
                        >
                          <span>Chat</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-slate-600 px-3 py-1.5 text-xs truncate">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-slate-700 hover:underline truncate"
                        >
                          {customer.email}
                        </a>
                      </div>
                    )}

                    {/* Primary Address */}
                    <div className="flex items-start gap-2 text-slate-600 px-3 py-1.5 text-xs">
                      <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="leading-snug truncate">
                        <p className="truncate text-slate-700">
                          {customer.address || 'No street address'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {customer.city ? `${customer.city}, ` : ''}{customer.district || 'Sri Lanka'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Orders count, total spent & Action */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      Lifetime Spend
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      Rs. {customer.computedTotalSpent.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCustomerForOrders(customer)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-medium transition-colors cursor-pointer text-xs shadow-2xs"
                  >
                    <ShoppingBag size={13} className="text-brand-gold" />
                    <span>{customer.computedOrdersCount} {customer.computedOrdersCount === 1 ? 'Order' : 'Orders'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CUSTOMER ORDER HISTORY */}
      {selectedCustomerForOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-brand-gold flex items-center justify-center font-serif text-sm font-bold">
                  {selectedCustomerForOrders.fullName
                    ? selectedCustomerForOrders.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'NB'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedCustomerForOrders.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order History for {selectedCustomerForOrders.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerForOrders(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Order List */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {(() => {
                const custOrders = getCustomerOrders(selectedCustomerForOrders.phone);
                if (custOrders.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <ShoppingBag size={28} className="mx-auto text-slate-300" />
                      <p className="text-xs text-slate-500">No placed orders found matching this phone number.</p>
                    </div>
                  );
                }

                return custOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  const items = Array.isArray(order.items) ? order.items : [];

                  return (
                    <div
                      key={order.id || order.orderReference}
                      className="bg-slate-50/60 rounded-xl border border-slate-200 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            #{order.orderReference}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-slate-100 text-xs">
                        {items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between">
                            <span className="text-slate-800 font-medium">
                              {item.title || item.name} × {item.quantity || 1}
                            </span>
                            <span className="font-mono text-slate-600">
                              Rs. {((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>Total Paid / Payable:</span>
                        <span className="font-mono text-sm">
                          Rs. {(Number(order.grandTotal) || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomerForOrders(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Delete Customer Record?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this customer record? Their placed order history will remain preserved.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteCustomer) {
                    onDeleteCustomer(deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
