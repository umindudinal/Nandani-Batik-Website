import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Star,
  Edit2,
  Trash2,
  List as ListIcon,
  Grid,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  FABRIC_TYPES,
  DESIGN_TYPES,
  COLOUR_TYPES,
  MAIN_COLOURS,
} from './SareeModal';

export default function SareeList({
  sarees,
  onOpenAddModal,
  onOpenEditModal,
  onToggleField,
  onDeleteSaree,
}) {
  const [search, setSearch] = useState('');
  const [selectedFabricType, setSelectedFabricType] = useState('all');
  const [selectedDesignType, setSelectedDesignType] = useState('all');
  const [selectedColourType, setSelectedColourType] = useState('all');
  const [selectedMainColour, setSelectedMainColour] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, inStock, outOfStock
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredSarees = useMemo(() => {
    return (sarees || []).filter((item) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesSinhala = item.sinhalaName?.toLowerCase().includes(q);
        const matchesFabric = item.fabric?.toLowerCase().includes(q);
        const matchesFabricType = item.fabricType?.toLowerCase().includes(q);
        const matchesDesignType = item.designType?.toLowerCase().includes(q);
        const matchesColourType = item.colourType?.toLowerCase().includes(q);
        const matchesMainColour = item.mainColour?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        const matchesId = item.id?.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesSinhala &&
          !matchesFabric &&
          !matchesFabricType &&
          !matchesDesignType &&
          !matchesColourType &&
          !matchesMainColour &&
          !matchesCategory &&
          !matchesId
        ) {
          return false;
        }
      }

      // Fabric Type Filter
      if (selectedFabricType !== 'all') {
        const matchesFabric =
          item.fabricType === selectedFabricType ||
          item.categoryLabel === selectedFabricType ||
          (selectedFabricType === 'Normal Voil Sarees' && item.category === 'normal-voil') ||
          (selectedFabricType === 'Super Voil Sarees' && item.category === 'super-voil') ||
          (selectedFabricType === 'Cotton Batik Sarees' && item.category === 'cotton-batik') ||
          (selectedFabricType === 'Silk Batik Sarees' && item.category === 'silk-batik');
        if (!matchesFabric) return false;
      }

      // Design Type Filter
      if (selectedDesignType !== 'all' && item.designType !== selectedDesignType) {
        return false;
      }

      // Colour Type Filter
      if (selectedColourType !== 'all' && item.colourType !== selectedColourType) {
        return false;
      }

      // Main Colour Filter
      if (selectedMainColour !== 'all') {
        const matchesColor =
          item.mainColour === selectedMainColour ||
          item.primaryColor === selectedMainColour ||
          (selectedMainColour === 'Navy Blue' && (item.primaryColor === 'Dark Blue' || item.mainColour === 'Navy Blue')) ||
          (selectedMainColour === 'Maroon' && (item.primaryColor === 'Royal Maroon' || item.mainColour === 'Maroon'));
        if (!matchesColor) return false;
      }

      // Stock Filter
      if (stockFilter === 'inStock' && !item.inStock) return false;
      if (stockFilter === 'outOfStock' && item.inStock) return false;

      return true;
    });
  }, [
    sarees,
    search,
    selectedFabricType,
    selectedDesignType,
    selectedColourType,
    selectedMainColour,
    stockFilter,
  ]);

  const isAnyFilterActive =
    selectedFabricType !== 'all' ||
    selectedDesignType !== 'all' ||
    selectedColourType !== 'all' ||
    selectedMainColour !== 'all' ||
    stockFilter !== 'all' ||
    search.trim() !== '';

  const handleResetFilters = () => {
    setSelectedFabricType('all');
    setSelectedDesignType('all');
    setSelectedColourType('all');
    setSelectedMainColour('all');
    setStockFilter('all');
    setSearch('');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 max-w-7xl mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sarees by name, sinhala, fabric, design, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-800 transition-colors"
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

          {/* Quick Actions (View toggle & Add Saree) */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
              >
                Reset Filters
              </button>
            )}

            {/* View mode toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <ListIcon size={14} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
            </div>

            {/* Add Saree Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1120] hover:bg-[#16233b] text-white text-xs font-medium rounded-lg transition-colors shadow-xs active:scale-[0.98]"
            >
              <Plus size={14} className="text-[#c59b27]" />
              <span>Add Saree</span>
            </button>
          </div>
        </div>

        {/* 4 Classification Filter Dropdowns Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pr-1">
            Filter:
          </span>

          {/* 1. Fabric Type Filter */}
          <select
            value={selectedFabricType}
            onChange={(e) => setSelectedFabricType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-slate-800"
          >
            <option value="all">Fabric: All</option>
            {FABRIC_TYPES.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </select>

          {/* 2. Design Type Filter */}
          <select
            value={selectedDesignType}
            onChange={(e) => setSelectedDesignType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-slate-800"
          >
            <option value="all">Design: All</option>
            {DESIGN_TYPES.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>

          {/* 3. Colour Type Filter */}
          <select
            value={selectedColourType}
            onChange={(e) => setSelectedColourType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-slate-800"
          >
            <option value="all">Colour Type: All</option>
            {COLOUR_TYPES.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>

          {/* 4. Main Colour Filter */}
          <select
            value={selectedMainColour}
            onChange={(e) => setSelectedMainColour(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-slate-800"
          >
            <option value="all">Main Colour: All</option>
            {MAIN_COLOURS.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name} ({col.sinhala})
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-slate-800"
          >
            <option value="all">Stock: All</option>
            <option value="inStock">In Stock Only</option>
            <option value="outOfStock">Sold Out Only</option>
          </select>
        </div>
      </div>

      {/* Count & Status Row */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-semibold text-slate-800">{filteredSarees.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{sarees.length}</span> total saree products
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{sarees.filter((s) => s.inStock).length} in stock</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c59b27]" />
            <span>{sarees.filter((s) => s.isBestseller).length} bestsellers</span>
          </span>
        </div>
      </div>

      {/* Main Saree Content: Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {filteredSarees.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <p className="font-medium text-slate-700">දැනට කිසිදු සාරියක් ඇතුළත් කර නොමැත.</p>
              <p className="text-slate-400">ඔබේ පළමු සාරි නිෂ්පාදනය එක් කිරීමට ඉහත 'Add Saree' බොත්තම ඔබන්න.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Saree Item</th>
                    <th className="px-4 py-3">Fabric Type</th>
                    <th className="px-4 py-3">Design & Colour</th>
                    <th className="px-4 py-3">Price (LKR)</th>
                    <th className="px-4 py-3">Main Colour</th>
                    <th className="px-4 py-3 text-center">In Stock</th>
                    <th className="px-4 py-3 text-center">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSarees.map((saree) => (
                    <tr key={saree.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Thumbnail & Title */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={saree.image && saree.image.trim() ? saree.image.trim() : '/sarees/saree 1.1.png'}
                            alt={saree.name}
                            className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0 bg-slate-50"
                            onError={(e) => {
                              e.target.src = '/sarees/saree 1.1.png';
                            }}
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-medium text-slate-900 truncate">
                              {saree.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {saree.sinhalaName && (
                                <span className="text-[11px] text-slate-500 truncate">
                                  {saree.sinhalaName}
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-slate-400">
                                #{saree.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Fabric Type */}
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {saree.fabricType || saree.categoryLabel || saree.category}
                        </span>
                      </td>

                      {/* Design & Colour Combination */}
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {saree.designType && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-900 font-medium mr-1">
                              {saree.designType}
                            </span>
                          )}
                          {saree.colourType && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-sky-50 text-sky-800 font-medium">
                              {saree.colourType}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-medium text-slate-900">
                          Rs. {Number(saree.price).toLocaleString()}
                        </div>
                        {saree.originalPrice && saree.originalPrice > saree.price && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5">
                            <span className="text-slate-400 line-through">
                              Rs. {Number(saree.originalPrice).toLocaleString()}
                            </span>
                            <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-medium">
                              -{saree.discountPercent || Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)}%
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Main Colour */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: saree.colorHex || '#0b1a30' }}
                          />
                          <span className="text-slate-700 text-[11px] font-medium">
                            {saree.mainColour || saree.primaryColor || 'Batik'}
                          </span>
                        </div>
                      </td>

                      {/* In Stock Toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onToggleField(saree.id, 'inStock', !saree.inStock)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            saree.inStock ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                          title={saree.inStock ? 'In Stock (Click to set Sold Out)' : 'Sold Out (Click to set In Stock)'}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              saree.inStock ? 'translate-x-4.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Featured (Bestseller & New) */}
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onToggleField(saree.id, 'isBestseller', !saree.isBestseller)}
                            className={`p-1 rounded transition-colors ${
                              saree.isBestseller
                                ? 'text-[#c59b27] hover:text-amber-600 bg-amber-50'
                                : 'text-slate-300 hover:text-slate-500'
                            }`}
                            title="Toggle Bestseller Badge"
                          >
                            <Star size={14} className={saree.isBestseller ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={() => onToggleField(saree.id, 'isNew', !saree.isNew)}
                            className={`p-1 rounded transition-colors ${
                              saree.isNew
                                ? 'text-blue-600 hover:text-blue-700 bg-blue-50'
                                : 'text-slate-300 hover:text-slate-500'
                            }`}
                            title="Toggle New Arrival Badge"
                          >
                            <Sparkles size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenEditModal(saree)}
                            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit Saree Details"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(saree.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Saree"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : filteredSarees.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-400 text-xs space-y-2">
          <p className="font-medium text-slate-700">දැනට කිසිදු සාරියක් ඇතුළත් කර නොමැත.</p>
          <p className="text-slate-400">ඔබේ පළමු සාරි නිෂ්පාදනය එක් කිරීමට ඉහත 'Add Saree' බොත්තම ඔබන්න.</p>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSarees.map((saree) => (
            <div
              key={saree.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                  <img
                    src={saree.image && saree.image.trim() ? saree.image.trim() : '/sarees/saree 1.1.png'}
                    alt={saree.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = '/sarees/saree 1.1.png';
                    }}
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {saree.isBestseller && (
                      <span className="bg-[#c59b27] text-[#0a1120] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Star size={10} className="fill-current" /> Bestseller
                      </span>
                    )}
                    {saree.isNew && (
                      <span className="bg-[#0a1120] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        New
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        saree.inStock
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-rose-600/90 text-white'
                      }`}
                    >
                      {saree.inStock ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold truncate">
                      {saree.fabricType || saree.categoryLabel || saree.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">#{saree.id}</span>
                  </div>

                  <h4 className="font-medium text-slate-900 text-xs truncate">
                    {saree.name}
                  </h4>

                  {/* Attributes Pills */}
                  <div className="flex flex-wrap items-center gap-1">
                    {saree.designType && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-900 font-medium rounded">
                        {saree.designType}
                      </span>
                    )}
                    {saree.colourType && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-sky-50 text-sky-800 font-medium rounded">
                        {saree.colourType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="font-mono text-xs font-bold text-slate-900">
                      Rs. {Number(saree.price).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: saree.colorHex || '#0b1a30' }}
                        title={saree.mainColour || saree.primaryColor}
                      />
                      <span className="text-[10px] text-slate-500 truncate max-w-20">
                        {saree.mainColour || saree.primaryColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onToggleField(saree.id, 'inStock', !saree.inStock)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                    saree.inStock
                      ? 'text-emerald-700 hover:bg-emerald-100/60'
                      : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  {saree.inStock ? 'Mark Sold Out' : 'Mark In Stock'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEditModal(saree)}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(saree.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-rose-50 text-rose-600 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Delete Saree</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete this saree from your atelier catalog? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteSaree(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium shadow-xs"
              >
                Delete Saree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
