import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  isMobileOpen,
  onCloseMobile,
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'sarees',
      label: 'Saree Catalog',
      icon: ShoppingBag,
      badge: stats?.totalSarees,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Layers,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      badge: stats?.pendingOrders ? `${stats.pendingOrders} New` : stats?.totalOrders,
      badgeVariant: stats?.pendingOrders ? 'alert' : 'neutral',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-64 bg-[#0a1120] text-slate-300 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none overflow-hidden fixed lg:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-5 py-4 sm:py-5 border-b border-slate-800/80 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-white shadow-sm shrink-0">
              <img
                src="/nandani-logo.jpg"
                alt="Nandani Batik Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-base font-bold text-white tracking-wide truncate">
                Nandani Batik
              </h1>
              <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400 truncate">
                Operations Portal
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
            title="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-500">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-slate-800/90 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={16}
                    className={isActive ? 'text-brand-gold' : 'text-slate-400'}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                      item.badgeVariant === 'alert'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badgeVariant === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.badgeVariant === 'warning'
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/20'
                        : isActive
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin User Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-white shrink-0">
            <img
              src="/nandani-logo.jpg"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">Nandani Batik</div>
            <div className="text-[10px] text-slate-400 truncate">Store Administrator</div>
          </div>
        </div>
      </aside>
    </>
  );
}
