import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  ShoppingBag,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories } from '../data/categories';
import SareeCard from '../components/sarees/SareeCard';

export default function ShopPage({ selectedCategory, setSelectedCategory }) {
  const { sarees, categories: liveCategories, isSareesLoading } = useCart();
  const categoryList = liveCategories && liveCategories.length > 0 ? liveCategories : categories;
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Sync with prop if it changes
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const colors = [
    { name: 'all', label: 'All Colors', hex: '#ffffff' },
    { name: 'Dark Blue', label: 'Dark Blue (Signature)', hex: '#0b1a30' },
    { name: 'Emerald Green', label: 'Emerald Green', hex: '#047857' },
    { name: 'Crimson Red', label: 'Crimson Red', hex: '#991b1b' },
    { name: 'Mustard Gold', label: 'Mustard Gold', hex: '#b45309' },
    { name: 'Turquoise', label: 'Turquoise Blue', hex: '#0891b2' },
    { name: 'Midnight Black', label: 'Obsidian Black', hex: '#18181b' },
    { name: 'Pastel Pink', label: 'Pastel Rose', hex: '#f472b6' },
  ];

  const fabrics = [
    'all',
    '100% Pure Mulberry Silk',
    'Raw Silk & Handloom Blend',
    '100% Handspun Ceylon Cotton',
    'Super-combed Pure Cotton',
    'Pure Georgette Silk',
    'Heavy Bridal Raw Silk',
  ];

  const filteredSarees = useMemo(() => {
    return (sarees || [])
      .filter((saree) => {
        if (!saree) return false;
        // Category Filter
        if (activeCategory !== 'all' && saree.category !== activeCategory) {
          return false;
        }
        // Color Filter
        if (selectedColor !== 'all' && saree.primaryColor !== selectedColor) {
          return false;
        }
        // Fabric Filter
        if (selectedFabric !== 'all' && saree.fabric !== selectedFabric) {
          return false;
        }
        // Max Price Filter
        if (saree.price && Number(saree.price) > maxPrice) {
          return false;
        }
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            (saree.name && saree.name.toLowerCase().includes(q)) ||
            (saree.sinhalaName && saree.sinhalaName.toLowerCase().includes(q)) ||
            (saree.fabric && saree.fabric.toLowerCase().includes(q)) ||
            (saree.primaryColor && saree.primaryColor.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'price-high') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // 'featured' retains original order
      });
  }, [sarees, activeCategory, selectedColor, selectedFabric, maxPrice, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    if (setSelectedCategory) setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedFabric('all');
    setMaxPrice(10000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const isFiltered =
    activeCategory !== 'all' ||
    selectedColor !== 'all' ||
    selectedFabric !== 'all' ||
    maxPrice < 10000 ||
    searchQuery.trim() !== '';

  return (
    <div className="bg-[#fcfbf9] min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-2">
            Home / <span className="text-[#0b1a30] font-semibold">Saree Collection</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b1a30]">
                Handcrafted Batik Saree Catalog
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                අතින් නිමවූ උසස්ම ප්‍රමිතියේ ශ්‍රී ලාංකික බතික් සාරි එකතුව
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs self-start md:self-auto">
              Showing <strong className="text-[#0b1a30]">{filteredSarees.length}</strong> designs
            </div>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by saree name, color, fabric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {isFiltered && '(Active)'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none bg-white cursor-pointer"
              >
                <option value="featured">Featured Collection</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-red-600 hover:text-red-700 underline underline-offset-2 ml-1"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Left Sidebar Filter (Clean Sticky, No Internal Scrollbar) */}
          <aside className="hidden lg:block lg:sticky lg:top-24 self-start space-y-6">
            {/* Categories */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#0b1a30] mb-3 pb-2 border-b border-slate-100">
                Saree Categories
              </h3>
              <div className="space-y-1 text-xs">
                {categoryList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCategory(c.id);
                      if (setSelectedCategory) setSelectedCategory(c.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
                      activeCategory === c.id
                        ? 'bg-[#0b1a30] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-70">
                      {c.id === 'all'
                        ? sarees.length
                        : sarees.filter((s) => s.category === c.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#0b1a30] mb-3 pb-2 border-b border-slate-100">
                Max Price
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0b1a30] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Rs. 1,000</span>
                  <span className="text-[#0b1a30] font-bold">
                    Up to Rs. {maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Swatch Filter */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#0b1a30] mb-3 pb-2 border-b border-slate-100">
                Color Palette
              </h3>
              <div className="space-y-2 text-xs">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all ${
                      selectedColor === color.name
                        ? 'bg-[#0b1a30]/10 font-bold text-[#0b1a30]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {color.name === 'all' ? (
                      <div className="w-4 h-4 rounded-full border border-slate-300 bg-linear-to-tr from-blue-900 via-amber-400 to-rose-500" />
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-xs"
                        style={{ backgroundColor: color.hex }}
                      />
                    )}
                    <span className="flex-1 text-left">{color.label}</span>
                    {selectedColor === color.name && (
                      <Check className="w-3.5 h-3.5 text-[#0b1a30]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3">
            {isSareesLoading ? (
              <div className="flex items-center justify-center py-24 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#0b1a30]" />
              </div>
            ) : filteredSarees.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-800 mb-1">
                  No Sarees Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  {sarees.length === 0
                    ? 'There are currently no sarees in the collection. Sarees published via the Dashboard will appear here.'
                    : "We couldn't find any sarees matching your selected filters. Try adjusting your color, fabric, or price options."}
                </p>
                {sarees.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="bg-[#0b1a30] hover:bg-brand-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSarees.map((saree) => (
                  <SareeCard key={saree.id} saree={saree} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Slide Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-serif text-lg font-bold text-[#0b1a30]">
                  Filter Sarees
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  {categoryList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCategory(c.id);
                        if (setSelectedCategory) setSelectedCategory(c.id);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                        activeCategory === c.id
                          ? 'bg-[#0b1a30] text-white font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Mobile */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Max Price
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#0b1a30] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>Rs. 1,000</span>
                    <span className="text-[#0b1a30] font-bold">
                      Up to Rs. {maxPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Color
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`text-left p-2 rounded-lg text-[11px] border flex items-center gap-1.5 ${
                        selectedColor === c.name
                          ? 'border-[#0b1a30] bg-[#0b1a30]/10 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="truncate">{c.name === 'all' ? 'All' : c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#0b1a30] text-white py-3 rounded-xl text-xs font-bold"
            >
              Apply Filters ({filteredSarees.length} Designs)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
