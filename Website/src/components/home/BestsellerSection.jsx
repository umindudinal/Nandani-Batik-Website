import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SareeCard from '../sarees/SareeCard';

export default function BestsellerSection({ setActivePage, setSelectedCategory }) {
  const { sarees, isSareesLoading } = useCart();
  const [activeTab, setActiveTab] = useState('all');

  const categoriesList = [
    { id: 'all', label: 'All Sarees (සියල්ල)' },
    { id: 'pure-silk', label: 'Pure Silk (සිල්ක්)' },
    { id: 'handloom-cotton', label: 'Handloom Cotton (කපු)' },
    { id: 'bridal-kandyan', label: 'Bridal & Kandyan (මංගල)' },
    { id: 'party-wear', label: 'Party & Festive (සාද)' },
    { id: 'office-daily', label: 'Office & Casual (කාර්යාලීය)' },
  ];

  const filteredSarees =
    activeTab === 'all'
      ? sarees.slice(0, 8)
      : sarees.filter((s) => s.category === activeTab).slice(0, 8);

  const handleViewAll = () => {
    if (setSelectedCategory) {
      setSelectedCategory(activeTab);
    }
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Simple Dropdown Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-stone-200/80">
          <div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-amber-800 mb-1">
              Atelier Catalog
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-900 leading-tight">
              Featured Saree Collection
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              අතින් නිමවූ උසස්ම ප්‍රමිතියේ ශ්‍රී ලාංකික බතික් සාරි එකතුව
            </p>
          </div>

          {/* Clean Minimal Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Filter:
            </span>
            <div className="relative min-w-50 sm:min-w-55">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 hover:border-stone-400 text-stone-900 font-medium text-xs sm:text-sm pl-3.5 pr-8 py-2 focus:outline-none cursor-pointer transition-colors"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isSareesLoading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#0b1a30]" />
          </div>
        ) : filteredSarees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSarees.map((saree) => (
              <SareeCard key={saree.id} saree={saree} />
            ))}
          </div>
        ) : sarees.length === 0 ? (
          <div className="text-center py-16 px-4 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-stone-800 text-sm font-serif font-bold">නව සාරි එකතුව ළඟදීම</p>
            <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
              දැනට වෙළඳසැලේ ප්‍රදර්ශනයට සාරි ඇතුළත් කර නොමැත. Dashboard හරහා සාරි ඇතුළත් කළ පසු මෙහි ස්වයංක්‍රීයව දිස්වේ.
            </p>
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 max-w-lg mx-auto">
            <p className="text-stone-700 text-sm font-medium">මෙම වර්ගයේ සාරි දැනට සූදානම් කරමින් පවතී.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-3 px-4 py-2 bg-[#0b1a30] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              සියලුම සාරි පෙන්වන්න
            </button>
          </div>
        )}

        {/* View All Button */}
        {sarees.length > 0 && (
          <div className="mt-14 text-center">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-900 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              <span>View Full Saree Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
