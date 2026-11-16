import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import SareeList from './components/SareeList';
import CategoryList from './components/CategoryList';
import OrderList from './components/OrderList';
import SareeModal from './components/SareeModal';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';
import { api } from './api/client';
import { Loader2 } from 'lucide-react';

export default function App() {
  const getInitialTab = () => {
    try {
      const search = new URLSearchParams(window.location.search);
      const tab = search.get('tab');
      if (['overview', 'sarees', 'categories', 'orders'].includes(tab)) {
        return tab;
      }
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'sarees', 'categories', 'orders'].includes(hash)) {
        return hash;
      }
    } catch {}
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const targetUrl = tab === 'overview' ? window.location.pathname : `?tab=${tab}`;
    if (window.location.search !== (tab === 'overview' ? '' : `?tab=${tab}`)) {
      window.history.pushState({ tab }, '', targetUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [sarees, setSarees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaree, setEditingSaree] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const [sareesRes, ordersRes, categoriesRes, statsRes, healthRes] =
        await Promise.allSettled([
          api.getSarees(),
          api.getOrders(),
          api.getCategories(),
          api.getStats(),
          api.getHealth(),
        ]);

      if (sareesRes.status === 'fulfilled') setSarees(sareesRes.value);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value);
      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (healthRes.status === 'fulfilled') setSystemHealth(healthRes.value);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast('Could not reach backend server. Please make sure Backend is running.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData(false);
    // Auto-poll updates every 4 seconds so database changes show up immediately
    const interval = setInterval(() => {
      loadAllData(true);
    }, 4000);

    // Instant refresh when user switches tabs or focuses the dashboard window
    const handleFocus = () => {
      loadAllData(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadAllData]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingSaree(null);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (saree) => {
    setEditingSaree(saree);
    setIsModalOpen(true);
  };

  // Notify storefront website in real-time
  const notifyStoreUpdated = () => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('nandani_store_sync');
        channel.postMessage({ type: 'SAREES_UPDATED', timestamp: Date.now() });
        channel.close();
      }
      localStorage.setItem('nandani_store_sync', Date.now().toString());
    } catch (e) {
      // ignore
    }
  };

  // Save / Update Saree
  const handleSaveSaree = async (payload) => {
    if (editingSaree) {
      await api.updateSaree(editingSaree.id, payload);
      showToast(`Saree "${payload.name}" updated successfully!`);
    } else {
      await api.createSaree(payload);
      showToast(`New saree "${payload.name}" added to catalog!`);
    }
    notifyStoreUpdated();
    loadAllData(true);
  };

  // Toggle Saree Field (inStock, isBestseller, isNew)
  const handleToggleField = async (id, field, value) => {
    // Optimistic UI update
    setSarees((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    try {
      await api.toggleSareeField(id, field, value);
      showToast('Saree status updated');
      notifyStoreUpdated();
      loadAllData(true);
    } catch (err) {
      showToast(`Failed to update: ${err.message}`, 'error');
      loadAllData(true);
    }
  };

  // Delete Saree
  const handleDeleteSaree = async (id) => {
    try {
      await api.deleteSaree(id);
      showToast('Saree deleted from catalog', 'info');
      notifyStoreUpdated();
      loadAllData(true);
    } catch (err) {
      showToast(`Failed to delete saree: ${err.message}`, 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id, status) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    try {
      await api.updateOrderStatus(id, status);
      showToast(`Order status updated to "${status}"`);
      loadAllData(true);
    } catch (err) {
      showToast(`Failed to update order status: ${err.message}`, 'error');
      loadAllData(true);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    try {
      await api.deleteOrder(id);
      showToast('Order record removed', 'info');
      loadAllData(true);
    } catch (err) {
      showToast(`Failed to delete order: ${err.message}`, 'error');
    }
  };

  // Category Handlers
  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (payload) => {
    if (editingCategory) {
      await api.updateCategory(editingCategory.id, payload);
      showToast(`Category "${payload.name}" updated successfully!`);
    } else {
      await api.createCategory(payload);
      showToast(`New category "${payload.name}" created!`);
    }
    notifyStoreUpdated();
    loadAllData(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await api.deleteCategory(id);
      showToast(res.message || 'Category deleted successfully', 'info');
      notifyStoreUpdated();
      loadAllData(true);
    } catch (err) {
      showToast(`Failed to delete category: ${err.message}`, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1120] text-slate-300 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center text-[#0a1120] font-serif font-black text-xl shadow-xs">
          N
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Loader2 size={14} className="animate-spin text-brand-gold" />
          <span>Loading operations data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#f8fafc] text-slate-800 overflow-hidden relative">
      {/* Sidebar - Responsive Drawer on Mobile, Sticky on Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area - Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          activeTab={activeTab}
          onRefresh={() => loadAllData(false)}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <Overview
              stats={stats}
              orders={orders}
              sarees={sarees}
              setActiveTab={setActiveTab}
              onOpenAddModal={handleOpenAddModal}
              systemHealth={systemHealth}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onToggleField={handleToggleField}
            />
          )}

          {activeTab === 'sarees' && (
            <SareeList
              sarees={sarees}
              categories={categories}
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onToggleField={handleToggleField}
              onDeleteSaree={handleDeleteSaree}
              onNavigateToCategories={() => setActiveTab('categories')}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryList
              categories={categories}
              sarees={sarees}
              onOpenAddModal={handleOpenAddCategoryModal}
              onOpenEditModal={handleOpenEditCategoryModal}
              onDeleteCategory={handleDeleteCategory}
              onViewCategorySarees={() => setActiveTab('sarees')}
            />
          )}

          {activeTab === 'orders' && (
            <OrderList
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Saree Modal */}
      <SareeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingSaree}
        categories={categories}
        onSave={handleSaveSaree}
      />

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialData={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
