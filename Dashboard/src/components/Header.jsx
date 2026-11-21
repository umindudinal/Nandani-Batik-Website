import React from 'react';
import { RefreshCw, Menu, LogOut } from 'lucide-react';

export default function Header({
  activeTab,
  onRefresh,
  isRefreshing,
  onToggleMobileMenu,
  onLogout,
}) {
  const titles = {
    overview: {
      title: 'Operations Overview',
      subtitle: 'Real-time sales performance, inventory status, and recent orders',
    },
    sarees: {
      title: 'Saree Catalog & Inventory',
      subtitle: 'Manage batik collections, pricing, photos, and stock availability',
    },
    orders: {
      title: 'Customer Orders',
      subtitle: 'Review and process incoming website orders and customer dispatches',
    },
    customers: {
      title: 'Customer Directory & Profiles',
      subtitle: 'Review registered clients, contact numbers, primary delivery locations, and order histories',
    },
  };

  const current = titles[activeTab] || titles.overview;

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors shrink-0"
          title="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
            {current.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data from Server"
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
        </button>

        {/* Admin Avatar & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-white shadow-xs shrink-0">
            <img
              src="/nandani-logo.jpg"
              alt="Nandani Batik"
              className="w-full h-full object-cover"
            />
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5 shrink-0"
              title="Sign Out of Dashboard"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
