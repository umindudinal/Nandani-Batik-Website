import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  PhoneCall,
  ChevronDown,
  User,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar({ activePage, setActivePage, selectedCategory, setSelectedCategory }) {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    customerProfile,
    sarees = [],
    categories: liveCategories = [],
    navigateTo,
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sareeDropdownOpen, setSareeDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (pageId, categoryId = null) => {
    if (navigateTo) {
      navigateTo(pageId, categoryId);
    } else {
      if (categoryId !== null && setSelectedCategory) {
        setSelectedCategory(categoryId);
      }
      setActivePage(pageId);
    }
    setMobileMenuOpen(false);
    setSareeDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 ${isScrolled
        ? 'shadow-md shadow-[#0b1a30]/8 py-1.5'
        : 'border-b border-slate-100 py-2'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 lg:gap-4 flex-nowrap">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#0b1a30] hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-[#0b1a30]/80 shadow-xs group-hover:scale-105 transition-transform duration-200 bg-white shrink-0">
              <img
                src="/nandani-logo.jpg"
                alt="Nandani Batik Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#0b1a30] leading-tight group-hover:text-brand-blue-800 transition-colors whitespace-nowrap">
                Nandani Batik
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Single row, no line wraps */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-nowrap whitespace-nowrap">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activePage === 'home'
                ? 'text-[#0b1a30] bg-[#0b1a30]/8 font-bold'
                : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100/80'
                }`}
            >
              Home
            </button>

            {/* Sarees Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSareeDropdownOpen(true)}
              onMouseLeave={() => setSareeDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('shop', 'all')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activePage === 'shop'
                  ? 'text-[#0b1a30] bg-[#0b1a30]/8 font-bold'
                  : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100/80'
                  }`}
              >
                <span>Saree Collection</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {sareeDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 z-50 animate-fadeIn">
                  <div className="w-64 bg-white border border-slate-100 shadow-xl rounded-xl py-2">
                    <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      By Fabric & Style
                    </div>
                    <button
                      onClick={() => handleNavClick('shop', 'all')}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30] flex items-center justify-between"
                    >
                      <span className="font-semibold">All Sarees</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {sarees.length > 0 ? `${sarees.length} Designs` : 'View All'}
                      </span>
                    </button>
                    {liveCategories && liveCategories.length > 0 ? (
                      liveCategories
                        .filter((c) => c.id !== 'all')
                        .map((cat) => {
                          const count = sarees.filter((s) => s.category === cat.id).length;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => handleNavClick('shop', cat.id)}
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30] flex items-center justify-between"
                            >
                              <span>{cat.name}</span>
                              {count > 0 && (
                                <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                              )}
                            </button>
                          );
                        })
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavClick('shop', 'pure-silk')}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30] flex items-center justify-between"
                        >
                          <span>Pure Silk Batik</span>
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Luxury</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('shop', 'handloom-cotton')}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30] flex items-center justify-between"
                        >
                          <span>Handloom Cotton</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Tropical</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('shop', 'bridal-kandyan')}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30] flex items-center justify-between"
                        >
                          <span>Bridal & Kandyan</span>
                          <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">Wedding</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('shop', 'party-wear')}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30]"
                        >
                          Party & Festive Sarees
                        </button>
                        <button
                          onClick={() => handleNavClick('shop', 'office-daily')}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#0b1a30]/5 hover:text-[#0b1a30]"
                        >
                          Office & Daily Wear
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('bridal')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activePage === 'bridal'
                ? 'text-[#0b1a30] bg-[#0b1a30]/8 font-bold'
                : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100/80'
                }`}
            >
              Bridal & Bespoke
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activePage === 'about'
                ? 'text-[#0b1a30] bg-[#0b1a30]/8 font-bold'
                : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100/80'
                }`}
            >
              Our Heritage
            </button>

            <button
              onClick={() => handleNavClick('care')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activePage === 'care'
                ? 'text-[#0b1a30] bg-[#0b1a30]/8 font-bold'
                : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100/80'
                }`}
            >
              Saree Care Guide
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activePage === 'contact'
                ? 'text-[#0b1a30] bg-[#0b1a30]/8 font-bold'
                : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100/80'
                }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Icons & Direct Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-nowrap">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100 rounded-full transition-colors shrink-0"
              title="Search Sarees"
              aria-label="Search Sarees"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-1.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-full relative transition-colors shrink-0"
              title="Saved Sarees"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Customer Login / Account Trigger */}
            <button
              onClick={() => handleNavClick('login')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                customerProfile
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  : 'text-slate-700 hover:text-[#0b1a30] hover:bg-slate-100'
              }`}
              title={
                customerProfile
                  ? `Signed in as ${customerProfile.fullName}`
                  : 'Customer Login / පාරිභෝගික ගිණුමට පිවිසෙන්න'
              }
              aria-label="Customer Account"
            >
              <User className={`w-4 h-4 ${customerProfile ? 'text-amber-600' : 'text-slate-600'}`} />
              <span className="hidden sm:inline font-sans text-xs">
                {customerProfile
                  ? customerProfile.fullName.split(' ')[0]
                  : 'Login'}
              </span>
            </button>

            {/* Cart Drawer Trigger - Single sleek horizontal badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#0b1a30] hover:bg-brand-blue-800 text-white px-3 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 whitespace-nowrap shrink-0"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-semibold tracking-wide">Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2.5 pb-5 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${activePage === 'home'
                ? 'bg-[#0b1a30] text-white'
                : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${activePage === 'shop'
                ? 'bg-[#0b1a30] text-white'
                : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              All Saree Collections
            </button>
            <div className="pl-4 space-y-1 border-l-2 border-[#0b1a30]/20 ml-3 my-0.5">
              {liveCategories && liveCategories.length > 0 ? (
                liveCategories
                  .filter((c) => c.id !== 'all')
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleNavClick('shop', cat.id)}
                      className="w-full text-left py-1 text-[11px] font-medium text-slate-600 hover:text-[#0b1a30]"
                    >
                      • {cat.name}
                    </button>
                  ))
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('shop', 'pure-silk')}
                    className="w-full text-left py-1 text-[11px] font-medium text-slate-600 hover:text-[#0b1a30]"
                  >
                    • Pure Silk Batik Sarees
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', 'handloom-cotton')}
                    className="w-full text-left py-1 text-[11px] font-medium text-slate-600 hover:text-[#0b1a30]"
                  >
                    • Handloom Cotton Sarees
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', 'bridal-kandyan')}
                    className="w-full text-left py-1 text-[11px] font-medium text-slate-600 hover:text-[#0b1a30]"
                  >
                    • Bridal & Kandyan Sarees
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', 'party-wear')}
                    className="w-full text-left py-1 text-[11px] font-medium text-slate-600 hover:text-[#0b1a30]"
                  >
                    • Party & Festive Sarees
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => handleNavClick('bridal')}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${activePage === 'bridal'
                ? 'bg-[#0b1a30] text-white'
                : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              Bridal & Bespoke Orders
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${activePage === 'about'
                ? 'bg-[#0b1a30] text-white'
                : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              Our Heritage & Artisan Story
            </button>
            <button
              onClick={() => handleNavClick('care')}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${activePage === 'care'
                ? 'bg-[#0b1a30] text-white'
                : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              Saree Care Guide
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${activePage === 'contact'
                ? 'bg-[#0b1a30] text-white'
                : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              Contact Us & Showroom
            </button>

            {/* Mobile Customer Login Link */}
            <button
              onClick={() => handleNavClick('login')}
              className="text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>
                  {customerProfile
                    ? `පාරිභෝගික ගිණුම (${customerProfile.fullName.split(' ')[0]})`
                    : 'Customer Login / පාරිභෝගික පිවිසුම'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-700">
                {customerProfile ? 'Account' : 'Sign In'}
              </span>
            </button>

            {/* Direct WhatsApp Callout in Mobile Menu */}
            <div className="pt-2.5 border-t border-slate-100">
              <a
                href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20am%20interested%20in%20your%20sarees"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat with Saree Consultant (WhatsApp)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
