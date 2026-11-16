import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FolderOpen,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';

export default function CategoryList({
  categories,
  sarees,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteCategory,
  onViewCategorySarees,
}) {
  const [search, setSearch] = useState('');
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null);

  // Compute saree counts per category
  const sareeCountMap = useMemo(() => {
    const map = {};
    (sarees || []).forEach((s) => {
      const cat = s.category || 'pure-silk';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [sarees]);

  const filteredCategories = useMemo(() => {
    return (categories || []).filter((cat) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const matchesName = cat.name?.toLowerCase().includes(q);
      const matchesSinhala = (cat.sinhalaName || cat.sinhala_name)?.toLowerCase().includes(q);
      const matchesId = cat.id?.toLowerCase().includes(q);
      const matchesDesc = cat.description?.toLowerCase().includes(q);
      return matchesName || matchesSinhala || matchesId || matchesDesc;
    });
  }, [categories, search]);

  const countForCat = (catId) => {
    if (catId === 'all') return (sarees || []).length;
    return sareeCountMap[catId] || 0;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 max-w-7xl mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name, sinhala, key..."
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

        {/* Add Category Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1120] hover:bg-[#16233b] text-white text-xs font-medium rounded-lg transition-colors shadow-xs active:scale-[0.98] self-start sm:self-center"
        >
          <Plus size={14} className="text-[#c59b27]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FolderOpen size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-600">No categories found</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {search ? 'Try adjusting your search query' : 'Create your first saree category above'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Identifier (Key)</th>
                  <th className="px-4 py-3">Sarees in Catalog</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const count = countForCat(cat.id);
                  const isAll = cat.id === 'all';

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Photo */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                            {cat.image && cat.image.trim() ? (
                              <img
                                src={cat.image.trim()}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/sarees/saree 1.1.png';
                                }}
                              />
                            ) : (
                              <FolderOpen size={16} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{cat.name}</div>
                            {(cat.sinhalaName || cat.sinhala_name) && (
                              <div className="text-[11px] text-slate-500">
                                {cat.sinhalaName || cat.sinhala_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Key */}
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {cat.id}
                        </span>
                      </td>

                      {/* Saree Count */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="font-semibold text-slate-900">{count}</span>
                          <span className="text-slate-500 text-[11px]">
                            {count === 1 ? 'saree' : 'sarees'}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-slate-500 text-[11px] max-w-xs truncate">
                        {cat.description || '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenEditModal(cat)}
                            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit Category Details"
                          >
                            <Edit2 size={14} />
                          </button>

                          {!isAll ? (
                            <button
                              onClick={() => setDeleteConfirmCat(cat)}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <span
                              className="p-1.5 text-slate-300 cursor-not-allowed"
                              title="Default category cannot be deleted"
                            >
                              <Trash2 size={14} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Delete Category "{deleteConfirmCat.name}"?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {countForCat(deleteConfirmCat.id) > 0 ? (
                    <>
                      <strong className="text-slate-700">
                        {countForCat(deleteConfirmCat.id)} sarees
                      </strong>{' '}
                      currently belong to this category. If you delete it, those sarees will be safely reassigned to Pure Silk so they remain visible on the store.
                    </>
                  ) : (
                    'This category currently has 0 sarees and will be permanently removed from the storefront.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmCat(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCategory(deleteConfirmCat.id);
                  setDeleteConfirmCat(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-xs transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
