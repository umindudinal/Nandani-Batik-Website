import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories as staticCategories } from '../data/categories';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [sarees, setSarees] = useState([]);
  const [categories, setCategories] = useState(staticCategories);
  const [isSareesLoading, setIsSareesLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nandani_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nandani_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Parse initial route from browser URL
  const getInitialRoute = () => {
    try {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      const searchParams = new URLSearchParams(window.location.search);
      const catParam = searchParams.get('category') || 'all';

      if (path === '' || path === '/' || path === '/home') {
        return { page: 'home', category: 'all', sareeId: null };
      }
      if (path === '/shop' || path === '/collection' || path === '/sarees') {
        return { page: 'shop', category: catParam, sareeId: null };
      }
      if (path === '/bridal') {
        return { page: 'bridal', category: 'bridal-kandyan', sareeId: null };
      }
      if (path === '/about' || path === '/heritage') {
        return { page: 'about', category: 'all', sareeId: null };
      }
      if (path === '/care' || path === '/care-guide') {
        return { page: 'care', category: 'all', sareeId: null };
      }
      if (path === '/contact') {
        return { page: 'contact', category: 'all', sareeId: null };
      }
      if (path === '/checkout') {
        return { page: 'checkout', category: 'all', sareeId: null };
      }
      if (path === '/profile' || path === '/my-orders' || path === '/orders') {
        return { page: 'profile', category: 'all', sareeId: null };
      }
      if (path === '/login' || path === '/signin' || path === '/account' || path === '/register') {
        return { page: 'login', category: 'all', sareeId: null };
      }
      if (path.startsWith('/saree/')) {
        const id = decodeURIComponent(path.replace('/saree/', ''));
        return { page: 'saree-detail', category: 'all', sareeId: id };
      }
      if (path === '/saree') {
        const id = searchParams.get('id');
        return { page: 'saree-detail', category: 'all', sareeId: id };
      }
      return { page: 'home', category: 'all', sareeId: null };
    } catch {
      return { page: 'home', category: 'all', sareeId: null };
    }
  };

  const initialRoute = getInitialRoute();
  const [selectedSareeForDetail, setSelectedSareeForDetail] = useState(null);
  const [selectedSaree, setSelectedSaree] = useState(null);
  const [activePage, setActivePageState] = useState(initialRoute.page);
  const [selectedCategory, setSelectedCategoryState] = useState(initialRoute.category);
  const [pendingSareeId, setPendingSareeId] = useState(initialRoute.sareeId);
  const [toast, setToast] = useState(null);

  // Customer Authentication Profile State (persisted in localStorage)
  const [customerProfile, setCustomerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('nandani_customer_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to parse customer profile from localStorage:', err);
      return null;
    }
  });

  const saveCustomerProfile = (profile) => {
    setCustomerProfile(profile);
    try {
      if (profile) {
        localStorage.setItem('nandani_customer_profile', JSON.stringify(profile));
      } else {
        localStorage.removeItem('nandani_customer_profile');
      }
    } catch (err) {
      console.error('Failed to persist customer profile in localStorage:', err);
    }
  };

  // Navigate function that keeps browser URL in sync
  const navigateTo = (page, category = null, saree = null, replace = false) => {
    setActivePageState(page);
    if (category !== null) {
      setSelectedCategoryState(category);
    }
    if (saree !== null) {
      setSelectedSaree(saree);
    }

    let targetUrl = '/';
    if (page === 'home') {
      targetUrl = '/';
    } else if (page === 'shop') {
      const cat = category !== null ? category : selectedCategory;
      targetUrl = cat && cat !== 'all' ? `/shop?category=${encodeURIComponent(cat)}` : '/shop';
    } else if (page === 'bridal') {
      targetUrl = '/bridal';
    } else if (page === 'about') {
      targetUrl = '/about';
    } else if (page === 'care') {
      targetUrl = '/care';
    } else if (page === 'contact') {
      targetUrl = '/contact';
    } else if (page === 'checkout') {
      targetUrl = '/checkout';
    } else if (page === 'profile') {
      targetUrl = '/profile';
    } else if (page === 'login') {
      targetUrl = '/login';
    } else if (page === 'saree-detail') {
      const target = saree || selectedSaree;
      targetUrl = target?.id ? `/saree/${encodeURIComponent(target.id)}` : '/shop';
    }

    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== targetUrl) {
      if (replace) {
        window.history.replaceState({ page, category, sareeId: saree?.id }, '', targetUrl);
      } else {
        window.history.pushState({ page, category, sareeId: saree?.id }, '', targetUrl);
      }
    }
  };

  const setActivePage = (page) => {
    navigateTo(page);
  };

  const setSelectedCategory = (category) => {
    setSelectedCategoryState(category);
    if (activePage === 'shop') {
      const targetUrl = category && category !== 'all' ? `/shop?category=${encodeURIComponent(category)}` : '/shop';
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== targetUrl) {
        window.history.pushState({ page: 'shop', category }, '', targetUrl);
      }
    }
  };

  // Helper to deep compare data arrays and prevent unnecessary React re-renders
  const areDataEqual = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch sarees dynamically from backend (Supabase or Local DB)
  // Silent background refresh prevents UI flickering or loader flashing
  const refreshSarees = async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsSareesLoading(true);
      }
      const res = await fetch(`${API_BASE_URL}/sarees`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSarees((prev) => (areDataEqual(prev, data) ? prev : data));
        }
      }
    } catch (err) {
      console.debug('Backend offline or unreachable:', err);
    } finally {
      if (isInitial) {
        setIsSareesLoading(false);
      }
    }
  };

  // Fetch categories dynamically from backend
  const refreshCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories((prev) => (areDataEqual(prev, data) ? prev : data));
        }
      }
    } catch (err) {
      console.debug('Backend offline, using static categories');
    }
  };

  useEffect(() => {
    // Initial fetch (displays spinner once during first load)
    refreshSarees(true);
    refreshCategories();

    // Cross-tab real-time sync with Dashboard (instant update without polling flicker)
    let channel = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('nandani_store_sync');
        channel.onmessage = (event) => {
          if (event?.data?.type === 'SAREES_UPDATED') {
            refreshSarees(false);
            refreshCategories();
          }
        };
      }
    } catch (e) {
      // BroadcastChannel unsupported
    }

    const handleStorage = (e) => {
      if (e.key === 'nandani_store_sync') {
        refreshSarees(false);
        refreshCategories();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Silently check when user switches back to the website window
    const handleFocus = () => {
      refreshSarees(false);
      refreshCategories();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Resolve saree if opened via direct URL like /saree/nb-saree-01
  useEffect(() => {
    if (pendingSareeId && sarees.length > 0) {
      const found = sarees.find(
        (s) => s.id === pendingSareeId || String(s.id).toLowerCase() === pendingSareeId.toLowerCase()
      );
      if (found) {
        setSelectedSaree(found);
        setPendingSareeId(null);
      }
    }
  }, [sarees, pendingSareeId]);

  // Listen to browser Back and Forward navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setActivePageState(route.page);
      if (route.category) {
        setSelectedCategoryState(route.category);
      }
      if (route.sareeId) {
        if (sarees.length > 0) {
          const found = sarees.find(
            (s) => s.id === route.sareeId || String(s.id).toLowerCase() === route.sareeId.toLowerCase()
          );
          if (found) setSelectedSaree(found);
        } else {
          setPendingSareeId(route.sareeId);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [sarees]);

  const openSareePage = (saree) => {
    setSelectedSaree(saree);
    setSelectedSareeForDetail(null);
    navigateTo('saree-detail', null, saree);
    setIsSearchOpen(false);
    setIsWishlistOpen(false);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('nandani_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nandani_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addToCart = (saree, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === saree.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === saree.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...saree, quantity }];
    });
    showToast(`"${saree.name}" added to cart!`);
  };

  const removeFromCart = (sareeId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== sareeId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (sareeId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === sareeId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (saree) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === saree.id);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prevWishlist.filter((item) => item.id !== saree.id);
      } else {
        showToast(`Added to wishlist! ❤️`);
        return [...prevWishlist, saree];
      }
    });
  };

  const isInWishlist = (sareeId) => {
    return wishlist.some((item) => item.id === sareeId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Islandwide doorstep shipping fee of Rs. 350
  const shippingFee = cart.length === 0 ? 0 : 350;
  const cartGrandTotal = cartSubtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        sarees,
        categories,
        refreshSarees,
        refreshCategories,
        isSareesLoading,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen: (val) => {
          if (val) {
            setIsCartOpen(false);
            navigateTo('checkout');
          } else {
            setIsCheckoutOpen(false);
          }
        },
        isSearchOpen,
        setIsSearchOpen,
        selectedSareeForDetail,
        setSelectedSareeForDetail,
        selectedSaree,
        setSelectedSaree,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        navigateTo,
        openSareePage,
        toast,
        showToast,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartGrandTotal,
        customerProfile,
        saveCustomerProfile,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
