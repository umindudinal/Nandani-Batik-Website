import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function QuickSearchModal() {
  const { sarees, isSearchOpen, setIsSearchOpen, openSareePage } = useCart();
  const [query, setQuery] = useState('');

  const filteredSarees = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sarees.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.sinhalaName.toLowerCase().includes(q) ||
        s.fabric.toLowerCase().includes(q) ||
        s.primaryColor.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-[#0b1a30] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search sarees by name, fabric (silk, cotton), color (blue, red)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-slate-600 bg-white">
          <span className="font-semibold text-slate-400 shrink-0">Popular:</span>
          {['Pure Silk', 'Dark Blue', 'Handloom Cotton', 'Bridal', 'Emerald', 'Nil Manel'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#0b1a30] hover:text-white transition-colors shrink-0"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-5">
          {!query.trim() ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Type keywords above to discover exquisite handcrafted Nandani Batik sarees.
            </div>
          ) : filteredSarees.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No matching sarees found for "{query}". Try searching for "Silk", "Cotton", or "Blue".
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Found {filteredSarees.length} {filteredSarees.length === 1 ? 'saree' : 'sarees'}:
              </div>
              {filteredSarees.map((saree) => (
                <div
                  key={saree.id}
                  onClick={() => openSareePage(saree)}
                  className="flex items-center gap-3.5 p-2.5 rounded-2xl border border-slate-100 hover:border-[#0b1a30]/30 hover:bg-slate-50 cursor-pointer transition-all group"
                >
                  <img
                    src={saree.image && saree.image.trim() ? saree.image.trim() : '/sarees/saree 1.1.png'}
                    alt={saree.name}
                    className="w-14 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    onError={(e) => {
                      e.target.src = '/sarees/saree 1.1.png';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-serif text-sm font-semibold text-slate-900 group-hover:text-[#0b1a30] transition-colors line-clamp-1">
                      {saree.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{saree.fabric}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#0b1a30]">
                        Rs. {saree.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                        {saree.categoryLabel}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0b1a30] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
