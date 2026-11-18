import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import BridalPage from './pages/BridalPage';
import AboutPage from './pages/AboutPage';
import CareGuidePage from './pages/CareGuidePage';
import ContactPage from './pages/ContactPage';
import SareeDetailPage from './pages/SareeDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerProfilePage from './pages/CustomerProfilePage';

// Modals & Common Drawers
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/cart/CheckoutModal';
import QuickSearchModal from './components/common/QuickSearchModal';
import WishlistModal from './components/common/WishlistModal';
import WhatsAppFloat from './components/common/WhatsAppFloat';
import Toast from './components/common/Toast';

function MainApp() {
  const { activePage, setActivePage, selectedCategory, setSelectedCategory } = useCart();
  const isAuthPage = activePage === 'login';

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            setActivePage={setActivePage}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'shop':
        return (
          <ShopPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'bridal':
        return <BridalPage setActivePage={setActivePage} />;
      case 'about':
        return <AboutPage setActivePage={setActivePage} />;
      case 'care':
        return <CareGuidePage />;
      case 'contact':
        return <ContactPage />;
      case 'saree-detail':
        return <SareeDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'profile':
        return <CustomerProfilePage />;
      case 'login':
        return <CustomerLoginPage />;
      default:
        return (
          <HomePage
            setActivePage={setActivePage}
            setSelectedCategory={setSelectedCategory}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#fcfbf9] text-slate-800 selection:bg-[#0b1a30] selection:text-white ${
        isAuthPage ? 'h-screen max-h-screen overflow-hidden' : ''
      }`}
    >
      {/* Top Announcement Bar */}
      {!isAuthPage && <AnnouncementBar />}

      {/* Main Sticky Navbar */}
      {!isAuthPage && (
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Page Content */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      {!isAuthPage && (
        <Footer
          setActivePage={setActivePage}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Global Modals & Floating Elements */}
      <CartDrawer />
      <CheckoutModal />
      <QuickSearchModal />
      <WishlistModal />
      {!isAuthPage && <WhatsAppFloat />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
