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
import {
  categories,
  FABRIC_TYPES,
  DESIGN_TYPES,
  COLOUR_TYPES,
  MAIN_COLOURS,
} from '../data/categories';
import SareeCard from '../components/sarees/SareeCard';

export default function ShopPage({ selectedCategory, setSelectedCategory }) {
  const { sarees, isSareesLoading } = useCart();
  const categoryList = categories;

  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [selectedFabricType, setSelectedFabricType] = useState('all');
  const [selectedDesignType, setSelectedDesignType] = useState('all');
  const [selectedColourType, setSelectedColourType] = useState('all');
  const [selectedMainColour, setSelectedMainColour] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(60000);

  // Sync with prop if it changes
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
      if (selectedCategory === 'all') {
        setSelectedFabricType('all');
      } else {
        const catObj = categoryList.find((c) => c.id === selectedCategory);
        if (catObj && catObj.fabricType) {
          setSelectedFabricType(catObj.fabricType);
        }
      }
    }
  }, [selectedCategory, categoryList]);

  const handleSelectFabricCategory = (catId) => {
    setActiveCategory(catId);
    if (setSelectedCategory) setSelectedCategory(catId);
    if (catId === 'all') {
      setSelectedFabricType('all');
    } else {
      const catObj = categoryList.find((c) => c.id === catId);
      setSelectedFabricType(catObj?.fabricType || catObj?.name || 'all');
    }
  };

  const filteredSarees = useMemo(() => {
    return (sarees || [])
      .filter((saree) => {
        if (!saree) return false;

        // Fabric Type / Category Filter
        if (activeCategory !== 'all') {
          const matchCat =
            saree.category === activeCategory ||
            saree.fabricType === activeCategory ||
            (activeCategory === 'normal-voil' && saree.fabricType === 'Normal Voil Sarees') ||
            (activeCategory === 'super-voil' && saree.fabricType === 'Super Voil Sarees') ||
            (activeCategory === 'cotton-batik' && saree.fabricType === 'Cotton Batik Sarees') ||
            (activeCategory === 'silk-batik' && saree.fabricType === 'Silk Batik Sarees');
          if (!matchCat) return false;
        }

        // Dedicated Fabric Type Filter
        if (selectedFabricType !== 'all') {
          const matchFabric =
            saree.fabricType === selectedFabricType ||
            saree.categoryLabel === selectedFabricType ||
            (selectedFabricType === 'Normal Voil Sarees' && saree.category === 'normal-voil') ||
            (selectedFabricType === 'Super Voil Sarees' && saree.category === 'super-voil') ||
            (selectedFabricType === 'Cotton Batik Sarees' && saree.category === 'cotton-batik') ||
            (selectedFabricType === 'Silk Batik Sarees' && saree.category === 'silk-batik');
          if (!matchFabric) return false;
        }

        // Design Type Filter
        if (selectedDesignType !== 'all') {
          if (saree.designType !== selectedDesignType) return false;
        }

        // Colour Type Filter
        if (selectedColourType !== 'all') {
          if (saree.colourType !== selectedColourType) return false;
        }

        // Main Colour Filter
        if (selectedMainColour !== 'all') {
          const target = selectedMainColour.toLowerCase();
          const sareeMain = (saree.mainColour || '').toLowerCase();
          const sareePrimary = (saree.primaryColor || '').toLowerCase();
          const sareePalette = sareeMain.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);

          const matchColor =
            sareePalette.includes(target) ||
            sareeMain === target ||
            sareePrimary === target ||
            sareeMain.includes(target) ||
            sareePrimary.includes(target) ||
            (selectedMainColour === 'Navy Blue' && (sareePrimary.includes('dark blue') || sareeMain.includes('navy blue'))) ||
            (selectedMainColour === 'Maroon' && (sareePrimary.includes('royal maroon') || sareeMain.includes('maroon')));
          if (!matchColor) return false;
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
            (saree.fabricType && saree.fabricType.toLowerCase().includes(q)) ||
            (saree.designType && saree.designType.toLowerCase().includes(q)) ||
            (saree.colourType && saree.colourType.toLowerCase().includes(q)) ||
            (saree.mainColour && saree.mainColour.toLowerCase().includes(q)) ||
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
  }, [
    sarees,
    activeCategory,
    selectedFabricType,
    selectedDesignType,
    selectedColourType,
    selectedMainColour,
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
    setMaxPrice(60000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const isFiltered =
    activeCategory !== 'all' ||
    selectedFabricType !== 'all' ||
    selectedDesignType !== 'all' ||
    selectedColourType !== 'all' ||
    selectedMainColour !== 'all' ||
    maxPrice < 60000 ||
    searchQuery.trim() !== '';

  const activeCategoryObj = categoryList.find((c) => c.id === activeCategory);

  return (
    <div className="bg-brand-cream min-h-screen text-stone-800 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Editorial Header Section */}
      <section className="relative border-b border-stone-200/80 bg-white/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-amber-800 font-semibold mb-2 block">
              Authentic Handcrafted Drape Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-medium tracking-tight">
              Saree Atelier
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed font-light">
              නන්දනී බතික් ආයතනයෙන් අතින් නිමවූ උසස්ම ප්‍රමිතියේ සාම්ප්‍රදායික සහ නවීන බතික් සාරි එකතුව.
              රෙදි වර්ගය, මෝස්තරය සහ වර්ණ සංයෝජනය අනුව ඔබේ කැමැත්ත පරිදි පහසුවෙන් තෝරාගන්න.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Controls Bar: Search, Quick Sort, Mobile Trigger */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200/80">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, motif, fabric, colour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 pl-10 pr-9 py-2 text-xs focus:outline-none focus:border-stone-800 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Tools: Result count & Sort */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="text-xs text-stone-500 font-mono">
              Showing <strong className="text-stone-900 font-bold">{filteredSarees.length}</strong> Pieces
            </span>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 text-stone-800 text-xs font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
              <span>Filters {isFiltered ? '(Active)' : ''}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative min-w-36 hidden sm:block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-stone-200 hover:border-stone-400 text-stone-800 text-xs pl-3 pr-7 py-2 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Drapes</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                <span>Fabric: {activeCategoryObj ? activeCategoryObj.name : activeCategory}</span>
                <button
                  onClick={() => handleSelectFabricCategory('all')}
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-stone-400 shrink-0"
                  style={{
                    backgroundColor:
                      MAIN_COLOURS.find((c) => c.name === selectedMainColour)?.hex || '#0b1a30',
                  }}
                />
                <span>Colour: {selectedMainColour}</span>
                <button
                  onClick={() => setSelectedMainColour('all')}
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {maxPrice < 60000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px] font-medium">
                <span>Up to Rs. {maxPrice.toLocaleString()}</span>
                <button
                  onClick={() => setMaxPrice(60000)}
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

        {/* Catalog Grid with Desktop Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          {/* Desktop Left Sidebar Filter */}
          <aside className="hidden lg:block lg:sticky lg:top-24 self-start bg-white border border-stone-200/90 p-5 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 font-medium">
                Refine Selection
              </h3>
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-stone-400 hover:text-stone-900 uppercase tracking-widest cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* 1. Fabric Type Filter (රෙදි වර්ගය) */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block">
                1. Fabric Type (රෙදි වර්ගය)
              </span>
              <div className="space-y-1 text-xs">
                {categoryList.map((c) => {
                  const count =
                    c.id === 'all'
                      ? sarees.length
                      : sarees.filter(
                          (s) =>
                            s.category === c.id ||
                            s.fabricType === c.name ||
                            (c.id === 'normal-voil' && s.fabricType === 'Normal Voil Sarees') ||
                            (c.id === 'super-voil' && s.fabricType === 'Super Voil Sarees') ||
                            (c.id === 'cotton-batik' && s.fabricType === 'Cotton Batik Sarees') ||
                            (c.id === 'silk-batik' && s.fabricType === 'Silk Batik Sarees')
                        ).length;
                  const isActive = activeCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectFabricCategory(c.id)}
                      className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
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

            {/* 2. Design Type Filter (මෝස්තර වර්ගය) */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block">
                2. Design Type (මෝස්තරය)
              </span>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedDesignType('all')}
                  className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between cursor-pointer ${
                    selectedDesignType === 'all'
                      ? 'bg-[#0b1a30] text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span>All Designs (සියලු මෝස්තර)</span>
                  {selectedDesignType === 'all' && <Check className="w-3 h-3" />}
                </button>
                {DESIGN_TYPES.map((d) => {
                  const isSelected = selectedDesignType === d;
                  const count = sarees.filter((s) => s.designType === d).length;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDesignType(isSelected ? 'all' : d)}
                      className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0b1a30] text-white font-medium'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span className="truncate">{d}</span>
                      <span className="text-[10px] opacity-75 font-mono">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Colour Type Filter (වර්ණ වර්ගය) */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block">
                3. Colour Type (වර්ණ සංයෝජනය)
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => setSelectedColourType('all')}
                  className={`p-1.5 text-[11px] border text-center transition-colors cursor-pointer ${
                    selectedColourType === 'all'
                      ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  All Types
                </button>
                {COLOUR_TYPES.map((ct) => {
                  const isSelected = selectedColourType === ct;
                  return (
                    <button
                      key={ct}
                      onClick={() => setSelectedColourType(isSelected ? 'all' : ct)}
                      className={`p-1.5 text-[11px] border text-center transition-colors cursor-pointer truncate ${
                        isSelected
                          ? 'bg-[#0b1a30] text-white border-[#0b1a30] font-medium'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {ct.replace(' Colour', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Main Colours (ප්‍රධාන වර්ණ - 12 Shades) */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block">
                  4. Main Colours (ප්‍රධාන වර්ණ)
                </span>
                {selectedMainColour !== 'all' && (
                  <button
                    onClick={() => setSelectedMainColour('all')}
                    className="text-[10px] text-stone-400 hover:text-stone-800"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MAIN_COLOURS.map((col) => {
                  const isSelected = selectedMainColour === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedMainColour(isSelected ? 'all' : col.name)}
                      title={`${col.name} (${col.sinhala})`}
                      className={`flex items-center gap-1.5 p-1.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0b1a30] bg-stone-50 shadow-xs font-semibold'
                          : 'border-stone-200/80 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] text-stone-800 truncate leading-tight">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
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
                min="10000"
                max="60000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0b1a30] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                <span>Rs. 10,000</span>
                <span>Rs. 60,000</span>
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
                    We could not find any drapes matching your exact filter selection. Try adjusting your fabric type, design motif, or colour choice.
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

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 font-medium">
                  Refine Sarees
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Fabric Type Mobile */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                  1. Fabric Type (රෙදි වර්ගය)
                </h4>
                <div className="space-y-1">
                  {categoryList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectFabricCategory(c.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        activeCategory === c.id
                          ? 'bg-[#0b1a30] text-white font-medium'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{c.name}</span>
                      {activeCategory === c.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Design Type Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                  2. Design Type (මෝස්තරය)
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedDesignType('all')}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      selectedDesignType === 'all'
                        ? 'bg-[#0b1a30] text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>All Designs</span>
                    {selectedDesignType === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {DESIGN_TYPES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDesignType(selectedDesignType === d ? 'all' : d)}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        selectedDesignType === d
                          ? 'bg-[#0b1a30] text-white font-medium'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDesignType === d && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Colour Type Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                  3. Colour Type (වර්ණ සංයෝජනය)
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedColourType('all')}
                    className={`p-2 text-xs border text-center ${
                      selectedColourType === 'all'
                        ? 'bg-[#0b1a30] text-white border-[#0b1a30]'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    All Types
                  </button>
                  {COLOUR_TYPES.map((ct) => (
                    <button
                      key={ct}
                      onClick={() =>
                        setSelectedColourType(selectedColourType === ct ? 'all' : ct)
                      }
                      className={`p-2 text-xs border text-center truncate ${
                        selectedColourType === ct
                          ? 'bg-[#0b1a30] text-white border-[#0b1a30]'
                          : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Main Colours Mobile */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                  4. Main Colours (ප්‍රධාන වර්ණ)
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {MAIN_COLOURS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() =>
                        setSelectedMainColour(selectedMainColour === col.name ? 'all' : col.name)
                      }
                      className={`p-1.5 border text-left flex items-center gap-1.5 text-[11px] ${
                        selectedMainColour === col.name
                          ? 'border-[#0b1a30] bg-stone-50 font-bold'
                          : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.name}</span>
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
                  min="10000"
                  max="60000"
                  step="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0b1a30] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                  <span>Rs. 10,000</span>
                  <span>Rs. 60,000</span>
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
