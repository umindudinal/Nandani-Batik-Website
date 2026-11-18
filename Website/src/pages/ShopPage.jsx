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
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories } from '../data/categories';
import {
  FABRIC_TYPES,
  DESIGN_TYPES,
  COLOUR_TYPES,
  MAIN_COLOURS,
} from '../constants/sareeAttributes';
import SareeCard from '../components/sarees/SareeCard';

export default function ShopPage({ selectedCategory, setSelectedCategory }) {
  const { sarees, categories: liveCategories, isSareesLoading } = useCart();
  const categoryList = liveCategories && liveCategories.length > 0 ? liveCategories : categories;
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [selectedFabricType, setSelectedFabricType] = useState('all');
  const [selectedDesignType, setSelectedDesignType] = useState('all');
  const [selectedColourType, setSelectedColourType] = useState('all');
  const [selectedMainColour, setSelectedMainColour] = useState('all');
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
    { name: 'all', label: 'All Tones', hex: '#ffffff' },
    { name: 'Dark Blue', label: 'Indigo Navy', hex: '#0b1a30' },
    { name: 'Emerald Green', label: 'Mayura Emerald', hex: '#047857' },
    { name: 'Crimson Red', label: 'Araliya Crimson', hex: '#991b1b' },
    { name: 'Mustard Gold', label: 'Saffron Gold', hex: '#b45309' },
    { name: 'Turquoise', label: 'Ocean Turquoise', hex: '#0891b2' },
    { name: 'Midnight Black', label: 'Obsidian Black', hex: '#18181b' },
    { name: 'Pastel Pink', label: 'Lotus Rose', hex: '#f472b6' },
  ];

  const fabrics = [
    { id: 'all', label: 'All Textiles' },
    { id: '100% Pure Mulberry Silk', label: 'Pure Mulberry Silk' },
    { id: 'Raw Silk & Handloom Blend', label: 'Raw Silk & Handloom Blend' },
    { id: '100% Handspun Ceylon Cotton', label: 'Handspun Ceylon Cotton' },
    { id: 'Super-combed Pure Cotton', label: 'Super-combed Cotton' },
    { id: 'Pure Georgette Silk', label: 'Pure Georgette Silk' },
  ];

  const filteredSarees = useMemo(() => {
    return (sarees || [])
      .filter((saree) => {
        if (!saree) return false;
        // Category Filter
        if (activeCategory !== 'all' && saree.category !== activeCategory) {
          return false;
        }
        // Fabric Type Filter
        if (selectedFabricType !== 'all' && saree.fabricType !== selectedFabricType) {
          return false;
        }
        // Design Type Filter
        if (selectedDesignType !== 'all' && saree.designType !== selectedDesignType) {
          return false;
        }
        // Colour Type Filter
        if (selectedColourType !== 'all' && saree.colourType !== selectedColourType) {
          return false;
        }
        // Main Colour Filter
        if (selectedMainColour !== 'all') {
          const matchesColor =
            saree.mainColour === selectedMainColour ||
            (Array.isArray(saree.mainColours) && saree.mainColours.includes(selectedMainColour)) ||
            (saree.primaryColor && saree.primaryColor.toLowerCase().includes(selectedMainColour.toLowerCase()));
          if (!matchesColor) return false;
        }
        // Legacy Color Filter
        if (selectedColor !== 'all' && saree.primaryColor !== selectedColor) {
          return false;
        }
        // Legacy Fabric Filter
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
            (saree.fabricType && saree.fabricType.toLowerCase().includes(q)) ||
            (saree.designType && saree.designType.toLowerCase().includes(q)) ||
            (saree.colourType && saree.colourType.toLowerCase().includes(q)) ||
            (saree.mainColour && saree.mainColour.toLowerCase().includes(q)) ||
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
  }, [
    sarees,
    activeCategory,
    selectedFabricType,
    selectedDesignType,
    selectedColourType,
    selectedMainColour,
    selectedColor,
    selectedFabric,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    if (setSelectedCategory) setSelectedCategory('all');
    setSelectedFabricType('all');
    setSelectedDesignType('all');
    setSelectedColourType('all');
    setSelectedMainColour('all');
    setSelectedColor('all');
    setSelectedFabric('all');
    setMaxPrice(10000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const isFiltered =
    activeCategory !== 'all' ||
    selectedFabricType !== 'all' ||
    selectedDesignType !== 'all' ||
    selectedColourType !== 'all' ||
    selectedMainColour !== 'all' ||
    selectedColor !== 'all' ||
    selectedFabric !== 'all' ||
    maxPrice < 10000 ||
    searchQuery.trim() !== '';

  const activeCategoryObj = categoryList.find((c) => c.id === activeCategory);

  return (
    <div className="bg-brand-cream min-h-screen text-stone-800 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Editorial Header Section */}
      <section className="relative border-b border-stone-200/80 bg-white/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16 text-center">
          {/* Atelier Kicker */}
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            <span>Nandani Atelier Catalog • Handcrafted in Ceylon</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline font-serif italic capitalize">
              බතික් සහ සේද සාරි එකතුව
            </span>
          </div>

          {/* Grand Title */}
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 tracking-tight leading-[1.15] mb-3 max-w-2xl mx-auto">
            The Saree Collection
          </h1>

          {/* Sinhala Subtitle */}
          <p className="font-serif italic text-sm sm:text-base text-amber-900/85 mb-4">
            පරපුරක අභිමානය රැඳි උසස්ම ප්‍රමිතියේ ශ්‍රී ලාංකික බතික් සාරි
          </p>

          <p className="max-w-xl mx-auto text-xs text-stone-600 font-light leading-relaxed">
            Each creation is an original canvas of molten beeswax and cold-reactive dyes, hand-drawn on pure mulberry silk and Ceylon combed handloom cotton.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Minimalist Search & Control Strip */}
        <div className="bg-white border border-stone-200/90 p-4 sm:p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by saree title, color, or motif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50/70 border border-stone-300 rounded-none text-stone-900 focus:outline-none focus:border-stone-800 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Count & Sort */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-800 bg-white hover:bg-stone-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {isFiltered && '(Active)'}</span>
            </button>

            <span className="text-xs text-stone-500 font-light hidden sm:inline">
              Showing <strong className="font-medium text-stone-900">{filteredSarees.length}</strong> {filteredSarees.length === 1 ? 'drape' : 'drapes'}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="text-xs text-stone-500 hidden sm:inline font-light">
                Sort:
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-300 rounded-none px-3 py-2 text-xs uppercase tracking-wider text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer"
              >
                <option value="featured">Featured Archive</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {isFiltered && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 text-[11px] uppercase tracking-wider">
              Active Filters:
            </span>

            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>{activeCategoryObj ? activeCategoryObj.name : activeCategory}</span>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    if (setSelectedCategory) setSelectedCategory('all');
                  }}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFabricType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Fabric: {selectedFabricType}</span>
                <button
                  onClick={() => setSelectedFabricType('all')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedDesignType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Design: {selectedDesignType}</span>
                <button
                  onClick={() => setSelectedDesignType('all')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedColourType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Colour Type: {selectedColourType}</span>
                <button
                  onClick={() => setSelectedColourType('all')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedMainColour !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Colour: {selectedMainColour}</span>
                <button
                  onClick={() => setSelectedMainColour('all')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFabric !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Fabric: {selectedFabric}</span>
                <button
                  onClick={() => setSelectedFabric('all')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {maxPrice < 10000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Up to Rs. {maxPrice.toLocaleString()}</span>
                <button
                  onClick={() => setMaxPrice(10000)}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] text-amber-900 hover:text-stone-900 underline underline-offset-2 uppercase tracking-wider ml-2 cursor-pointer font-medium"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Catalog Grid with Unified Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          {/* Desktop Left Sidebar Filter (Unified Atelier Panel) */}
          <aside className="hidden lg:block lg:sticky lg:top-24 self-start bg-white border border-stone-200/90 p-5 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 font-medium">
                Refine Selection
              </h3>
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-amber-900 hover:text-stone-900 uppercase tracking-widest cursor-pointer font-medium"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                Saree Categories
              </span>
              <div className="space-y-1 text-xs">
                {categoryList.map((c) => {
                  const count =
                    c.id === 'all'
                      ? sarees.length
                      : sarees.filter((s) => s.category === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCategory(c.id);
                        if (setSelectedCategory) setSelectedCategory(c.id);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between cursor-pointer rounded-xs ${
                        activeCategory === c.id
                          ? 'bg-[#0b1a30] text-white font-medium'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric Type Filter */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                Fabric Type
              </span>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedFabricType('all')}
                  className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between cursor-pointer rounded-xs ${
                    selectedFabricType === 'all'
                      ? 'bg-[#0b1a30] text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span>All Fabrics</span>
                  {selectedFabricType === 'all' && <Check className="w-3 h-3" />}
                </button>
                {FABRIC_TYPES.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabricType(fab)}
                    className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between cursor-pointer rounded-xs ${
                      selectedFabricType === fab
                        ? 'bg-[#0b1a30] text-white font-medium'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span className="truncate">{fab}</span>
                    {selectedFabricType === fab && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Type Filter */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                Design Motif
              </span>
              <div className="flex flex-wrap gap-1 text-xs">
                <button
                  onClick={() => setSelectedDesignType('all')}
                  className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                    selectedDesignType === 'all'
                      ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  All
                </button>
                {DESIGN_TYPES.map((des) => (
                  <button
                    key={des}
                    onClick={() => setSelectedDesignType(des)}
                    className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                      selectedDesignType === des
                        ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {des.replace(' Design', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Type Filter */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                Colour Scheme
              </span>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button
                  onClick={() => setSelectedColourType('all')}
                  className={`px-2 py-1 text-center rounded text-[11px] border transition-colors cursor-pointer ${
                    selectedColourType === 'all'
                      ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  All Types
                </button>
                {COLOUR_TYPES.map((ct) => (
                  <button
                    key={ct}
                    onClick={() => setSelectedColourType(ct)}
                    className={`px-2 py-1 text-center rounded text-[11px] border transition-colors cursor-pointer truncate ${
                      selectedColourType === ct
                        ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Colours Palette */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                  Main Colours
                </span>
                {selectedMainColour !== 'all' && (
                  <button
                    onClick={() => setSelectedMainColour('all')}
                    className="text-[10px] text-stone-400 hover:text-stone-900"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {MAIN_COLOURS.map((col) => (
                  <button
                    key={col.name}
                    onClick={() =>
                      setSelectedMainColour(selectedMainColour === col.name ? 'all' : col.name)
                    }
                    className={`flex items-center gap-2 px-2 py-1.5 border rounded-xs transition-all cursor-pointer text-left ${
                      selectedMainColour === col.name
                        ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 shadow-xs'
                        : 'border-stone-200/70 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border"
                      style={{
                        backgroundColor: col.hex,
                        borderColor: col.border || '#cbd5e1',
                      }}
                    />
                    <span className="text-[11px] truncate">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                  Price Ceiling
                </span>
                <span className="font-serif text-xs text-stone-900 font-medium">
                  Up to Rs. {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0b1a30] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Rs. 1,000</span>
                <span>Rs. 10,000</span>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3">
            {isSareesLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-stone-400 space-y-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#0b1a30]" />
                <span className="text-xs uppercase tracking-widest font-serif">
                  Loading Atelier Collection...
                </span>
              </div>
            ) : filteredSarees.length === 0 ? (
              <div className="bg-white border border-stone-200/90 p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-stone-900 font-normal">
                    No Sarees Found Matching Criteria
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto font-light leading-relaxed">
                    We could not find any drapes matching your exact filter selection. Try adjusting your color palette or price range.
                  </p>
                </div>
                {isFiltered && (
                  <div className="pt-2">
                    <button
                      onClick={handleResetFilters}
                      className="bg-[#0b1a30] hover:bg-stone-800 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
                {filteredSarees.map((saree) => (
                  <SareeCard key={saree.id} saree={saree} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Refined Mobile Filter Slide Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden flex justify-end animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-stone-200 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif text-lg text-stone-900 font-normal">
                  Refine Collection
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
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
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        activeCategory === c.id
                          ? 'bg-[#0b1a30] text-white font-medium'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                    Max Price
                  </h4>
                  <span className="font-serif text-xs text-stone-900 font-medium">
                    Up to Rs. {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0b1a30] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Rs. 1,000</span>
                  <span>Rs. 10,000</span>
                </div>
              </div>

              {/* Fabric Type Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                  Fabric Type
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedFabricType('all')}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      selectedFabricType === 'all'
                        ? 'bg-[#0b1a30] text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>All Fabric Types</span>
                    {selectedFabricType === 'all' && <Check className="w-3 h-3" />}
                  </button>
                  {FABRIC_TYPES.map((fab) => (
                    <button
                      key={fab}
                      onClick={() => setSelectedFabricType(fab)}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        selectedFabricType === fab
                          ? 'bg-[#0b1a30] text-white font-medium'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{fab}</span>
                      {selectedFabricType === fab && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Type Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                  Design Motif
                </h4>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSelectedDesignType('all')}
                    className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                      selectedDesignType === 'all'
                        ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    All
                  </button>
                  {DESIGN_TYPES.map((des) => (
                    <button
                      key={des}
                      onClick={() => setSelectedDesignType(des)}
                      className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                        selectedDesignType === des
                          ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {des.replace(' Design', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colour Type Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                  Colour Scheme
                </h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <button
                    onClick={() => setSelectedColourType('all')}
                    className={`px-2 py-1 text-center border rounded transition-colors ${
                      selectedColourType === 'all'
                        ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    All Types
                  </button>
                  {COLOUR_TYPES.map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setSelectedColourType(ct)}
                      className={`px-2 py-1 text-center border rounded transition-colors truncate ${
                        selectedColourType === ct
                          ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Colours Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                  Main Colours
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {MAIN_COLOURS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() =>
                        setSelectedMainColour(selectedMainColour === c.name ? 'all' : c.name)
                      }
                      className={`text-left p-1.5 text-[11px] border rounded-xs flex items-center gap-1.5 transition-colors ${
                        selectedMainColour === c.name
                          ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 shadow-xs'
                          : 'border-stone-200/70 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border"
                        style={{ backgroundColor: c.hex, borderColor: c.border || '#cbd5e1' }}
                      />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#0b1a30] text-white py-3 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
              >
                Apply Filters ({filteredSarees.length} Pieces)
              </button>

              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="w-full text-center text-xs text-stone-500 hover:text-stone-900 py-1.5 cursor-pointer underline"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
