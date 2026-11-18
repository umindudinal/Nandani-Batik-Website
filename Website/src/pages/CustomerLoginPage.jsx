import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Lock,
  Mail,
  Building,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CustomerLoginPage() {
  const {
    customerProfile,
    saveCustomerProfile,
    navigateTo,
    setActivePage,
    showToast,
  } = useCart();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    password: '',
    address: '',
    district: 'Colombo',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [sameAsPhone, setSameAsPhone] = useState(true);

  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
  ];

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'phone' && sameAsPhone) {
        next.whatsapp = value;
      }
      return next;
    });
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      saveCustomerProfile(data.customer);
      if (showToast) showToast(`සාදරයෙන් පිළිගනිමු, ${data.customer.fullName}!`);
      setSuccessMessage('පිවිසීම සාර්ථකයි! (Login successful)');

      // Redirect back to shop or checkout after brief moment
      setTimeout(() => {
        if (navigateTo) {
          navigateTo('shop');
        } else if (setActivePage) {
          setActivePage('shop');
        }
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerData.fullName.trim() || !registerData.phone.trim() || !registerData.address.trim()) {
      setErrorMessage('කරුණාකර නම, දුරකථන අංකය සහ බෙදාහැරීමේ ලිපිනය ඇතුළත් කරන්න.');
      return;
    }

    setIsLoading(true);

    const payload = {
      fullName: registerData.fullName.trim(),
      phone: registerData.phone.trim(),
      whatsapp: sameAsPhone ? registerData.phone.trim() : (registerData.whatsapp.trim() || registerData.phone.trim()),
      email: registerData.email.trim(),
      password: registerData.password,
      address: registerData.address.trim(),
      district: registerData.district,
      city: registerData.city.trim(),
      postalCode: registerData.postalCode.trim(),
      notes: registerData.notes.trim(),
    };

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account.');
      }

      saveCustomerProfile(data.customer || payload);
      if (showToast) showToast('Nandani Batik පාරිභෝගික ලියාපදිංචිය සාර්ථකයි!');
      setSuccessMessage('ගිණුම සාර්ථකව නිර්මාණය විය! (Account created successfully)');

      setTimeout(() => {
        if (navigateTo) {
          navigateTo('shop');
        } else if (setActivePage) {
          setActivePage('shop');
        }
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Social Login Mock / Instant fill for demo
  const handleSocialMock = (provider) => {
    if (provider === 'google') {
      setLoginIdentifier('kavindi.perera@gmail.com');
      setLoginPassword('password123');
      if (showToast) showToast('Google account details loaded for testing');
    } else {
      setLoginIdentifier('077 123 4567');
      setLoginPassword('password123');
      if (showToast) showToast('WhatsApp mobile details loaded for testing');
    }
  };

  const handleBackToShop = () => {
    if (navigateTo) {
      navigateTo('shop');
    } else if (setActivePage) {
      setActivePage('shop');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7ede6]/50 flex items-center justify-center p-4 sm:p-6 lg:p-10 text-stone-900 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Outer Card Wrapper */}
      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-900/5 border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Clean Form Area */}
        <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          {/* Top atelier breadcrumb & back */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToShop}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-500/40">
                <img
                  src="/nandani-logo.jpg"
                  alt="Nandani Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xs font-semibold tracking-wider uppercase text-stone-700">
                Nandani Batik
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-1.5 pt-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h1>
            <p className="text-xs text-stone-500">
              {mode === 'login'
                ? 'Enter details to login • පාරිභෝගික ගිණුමට පිවිසෙන්න'
                : 'Enter details to register with Nandani Atelier'}
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* If already logged in, show logged in banner */}
          {customerProfile && (
            <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  Signed in as {customerProfile.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => saveCustomerProfile(null)}
                  className="text-amber-800 underline hover:text-stone-900"
                >
                  Sign Out
                </button>
              </div>
              <p className="text-stone-600 text-[11px]">
                {customerProfile.phone} • {customerProfile.district}
              </p>
            </div>
          )}

          {/* LOGIN VIEW */}
          {mode === 'login' ? (
            <div className="space-y-5">
              {/* Social Login Buttons (Google & Facebook/WhatsApp) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialMock('google')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="truncate">Login with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialMock('facebook')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="truncate">Login with Facebook</span>
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[10px] uppercase font-mono tracking-widest text-stone-400">
                  OR
                </span>
                <div className="border-t border-stone-200 w-full" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                {/* Email or Phone */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Email Address or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="example@gmail.com or 077 123 4567"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 pr-10 py-2.5 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-stone-300"
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      alert('To reset your password, please contact our atelier directly via WhatsApp: +94 77 892 4115');
                    }}
                    className="text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Forgot Your Password?
                  </button>
                </div>

                {/* Submit Action Button (Red / Rose like the screenshot) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#c1272d] hover:bg-[#a61c22] active:scale-99 text-white py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-900/10 cursor-pointer"
                >
                  <span>{isLoading ? 'Signing In...' : 'Log In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            /* REGISTER VIEW */
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Full Name (සම්පූර්ණ නම) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    placeholder="e.g. Kavindi Perera"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="077 123 4567"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    disabled={sameAsPhone}
                    name="whatsapp"
                    value={sameAsPhone ? registerData.phone : registerData.whatsapp}
                    onChange={handleRegisterChange}
                    placeholder="077 123 4567"
                    className="w-full bg-white disabled:bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                  <label className="flex items-center gap-1.5 text-[10px] text-stone-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => setSameAsPhone(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Same as phone</span>
                  </label>
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Email Address <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="kavindi@example.com"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* Delivery Address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Delivery Address (බෙදාහැරීමේ ලිපිනය) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    placeholder="House No, Road / Street"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={registerData.district}
                    onChange={handleRegisterChange}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    City / Town
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={registerData.city}
                    onChange={handleRegisterChange}
                    placeholder="e.g. Maharagama"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-stone-700 font-medium text-[11px] uppercase tracking-wider">
                    Create Password (මුරපදය)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Create a password for fast 1-click login"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-stone-800 font-mono"
                  />
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#c1272d] hover:bg-[#a61c22] active:scale-99 text-white py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-900/10 cursor-pointer pt-3"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-semibold text-stone-900 hover:text-[#c1272d] transition-colors underline cursor-pointer"
                >
                  Create an Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-semibold text-stone-900 hover:text-[#c1272d] transition-colors underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Editorial Saree Fashion Visual */}
        <div className="relative hidden lg:block bg-stone-100 overflow-hidden min-h-[620px]">
          {/* Main Saree Model Image */}
          <img
            src="/sarees/saree 1.1.png"
            alt="Nandani Batik Pure Silk Saree"
            className="w-full h-full object-cover object-top"
          />

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

          {/* Luxury Atelier Caption at Bottom */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2 z-10">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300 font-semibold block">
              100% Hand-Drawn Sri Lankan Artistry
            </span>
            <h3 className="font-serif text-2xl font-normal leading-snug drop-shadow-sm">
              Nil Manel Royal Indigo Silk Saree
            </h3>
            <p className="font-serif italic text-xs text-stone-300 font-light max-w-sm">
              Authentic hand-waxed Sri Lankan batik drapes, created for life's most cherished celebrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
