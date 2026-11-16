const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Health & System
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Failed to fetch health status');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async seedDatabase() {
    const res = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to seed database');
    }
    return res.json();
  },

  // Sarees
  async getSarees(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.inStock !== undefined && params.inStock !== 'all') query.append('inStock', params.inStock);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/sarees?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch sarees');
    return res.json();
  },

  async getSaree(id) {
    const res = await fetch(`${API_BASE_URL}/sarees/${id}`);
    if (!res.ok) throw new Error('Failed to fetch saree details');
    return res.json();
  },

  async createSaree(data) {
    const res = await fetch(`${API_BASE_URL}/sarees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create saree');
    }
    return res.json();
  },

  async updateSaree(id, data) {
    const res = await fetch(`${API_BASE_URL}/sarees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update saree');
    }
    return res.json();
  },

  async toggleSareeField(id, field, value) {
    const res = await fetch(`${API_BASE_URL}/sarees/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    });
    if (!res.ok) throw new Error('Failed to toggle field');
    return res.json();
  },

  async deleteSaree(id) {
    const res = await fetch(`${API_BASE_URL}/sarees/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete saree');
    return res.json();
  },

  // File Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload image');
    }
    return res.json();
  },

  // Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);

    const res = await fetch(`${API_BASE_URL}/orders?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async updateOrderStatus(id, status, paymentStatus) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create category');
    }
    return res.json();
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update category');
    }
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete category');
    }
    return res.json();
  },
};
