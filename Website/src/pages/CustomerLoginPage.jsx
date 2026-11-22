import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

      const profileToSave = data.customer;
      if (typeof saveCustomerProfile === 'function') {
        saveCustomerProfile(profileToSave);
      } else {
        try {
          localStorage.setItem('nandani_customer_profile', JSON.stringify(profileToSave));
        } catch (err) {
          console.error(err);
        }
      }
      if (showToast) showToast(`සාදරයෙන් පිළිගනිමු, ${data.customer.fullName}!`);
      setSuccessMessage('පිවිසීම සාර්ථකයි! (Login successful)');

      // Redirect back to shop or checkout after a brief moment
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

      const profileToSave = data.customer || payload;
      if (typeof saveCustomerProfile === 'function') {
        saveCustomerProfile(profileToSave);
      } else {
        try {
          localStorage.setItem('nandani_customer_profile', JSON.stringify(profileToSave));
        } catch (err) {
          console.error(err);
        }
      }
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

  // Social Login Mock / Notification
  const handleSocialMock = (provider) => {
    if (provider === 'google') {
      handleGoogleSignIn();
      return;
    }
    if (showToast) {
      showToast('Facebook login is coming soon. Please use Google Login or Email/Phone.');
    }
  };

  // Real Google Sign-In with Firebase Authentication
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user || !user.email) {
        throw new Error('Google did not provide an email address.');
      }

      const payload = {
        email: user.email,
        fullName: user.displayName || user.email.split('@')[0] || 'Valued Customer',
        photoURL: user.photoURL || '',
        phone: user.phoneNumber || '',
        googleUid: user.uid,
      };

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/customers/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate with Google on server.');
      }

      const profileToSave = data.customer || payload;
      if (typeof saveCustomerProfile === 'function') {
        saveCustomerProfile(profileToSave);
      } else {
        try {
          localStorage.setItem('nandani_customer_profile', JSON.stringify(profileToSave));
        } catch (err) {
          console.error(err);
        }
      }

      if (showToast) {
        showToast(`Welcome, ${profileToSave.fullName}!`);
      }
      setSuccessMessage(data.isNew ? 'Google account registered successfully!' : 'Login successful!');

      setTimeout(() => {
        if (navigateTo) {
          navigateTo('shop');
        } else if (setActivePage) {
          setActivePage('shop');
        }
      }, 700);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // Closed without completing
        return;
      }
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Please allow popups for this site.');
        return;
      }
      if (err.code === 'auth/unauthorized-domain') {
        setErrorMessage('Domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).');
        return;
      }
      setErrorMessage(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
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
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-linear-to-br from-[#f8ece6] via-[#fbf7f4] to-[#f4e6de] flex items-center justify-center p-2 sm:p-4 lg:p-6 text-stone-900 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Outer Card Wrapper */}
      <div className="w-full max-w-5xl max-h-[96vh] bg-white shadow-2xl shadow-stone-900/10 border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Clean Form Area */}
        <div className="p-5 sm:p-7 lg:p-7 flex flex-col justify-between overflow-y-auto max-h-[96vh] space-y-3.5 scrollbar-thin">
          {/* Top atelier breadcrumb & back */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToShop}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </button>

            <button
              type="button"
              onClick={() => (navigateTo ? navigateTo('home') : setActivePage && setActivePage('home'))}
              className="flex items-center gap-2 group cursor-pointer text-left"
              title="Return to Home"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-500/40 group-hover:border-amber-600 transition-colors">
                <img
                  src="/nandani-logo.jpg"
                  alt="Nandani Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xs font-semibold tracking-wider uppercase text-stone-700 group-hover:text-stone-900 transition-colors">
                Nandani Batik
              </span>
            </button>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-0.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h1>
            <p className="text-[11px] text-stone-500">
              {mode === 'login'
                ? 'Enter details to login'
                : 'Enter details to register with Nandani Atelier'}
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* If already logged in, show logged in banner with direct link to profile */}
          {customerProfile && (
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  Signed in as {customerProfile.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => (saveCustomerProfile ? saveCustomerProfile(null) : localStorage.removeItem('nandani_customer_profile'))}
                  className="text-amber-800 underline hover:text-stone-900 cursor-pointer text-[11px]"
                >
                  Sign Out
                </button>
              </div>
              <p className="text-stone-600 text-[11px]">
                {customerProfile.phone} • {customerProfile.district}
              </p>
              <button
                type="button"
                onClick={() => (navigateTo ? navigateTo('profile') : setActivePage('profile'))}
                className="w-full bg-[#0b1a30] hover:bg-stone-900 text-white py-1.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Go to My Profile & Orders (මගේ ඇණවුම්)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* LOGIN VIEW */}
          {mode === 'login' ? (
            <div className="space-y-4">

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 px-3.5 pr-11 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600 hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      alert('To reset your password, please contact our atelier directly via WhatsApp: +94 77 892 4115');
                    }}
                    className="text-stone-500 hover:text-stone-900 transition-colors cursor-pointer text-xs"
                  >
                    Forgot Your Password?
                  </button>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 bg-[#c1272d] hover:bg-[#a61c22] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-900/15 cursor-pointer mt-1"
                >
                  <span>{isLoading ? 'Signing In...' : 'Log In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[10px] uppercase font-mono tracking-widest text-stone-400">
                  OR
                </span>
                <div className="border-t border-stone-200 w-full" />
              </div>

              {/* Social Login Buttons (Google & Facebook) - Exactly like user's reference image */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-stone-200 hover:border-stone-300 bg-[#f8f9fa] hover:bg-white text-xs font-medium text-stone-700 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span className="truncate">{isGoogleLoading ? 'Connecting...' : 'Login with Google'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialMock('facebook')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-stone-200 hover:border-stone-300 bg-[#f8f9fa] hover:bg-white text-xs font-medium text-stone-700 transition-all shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="truncate">Login with Facebook</span>
                </button>
              </div>
              
            </div>
          ) : (
            /* REGISTER VIEW */
            <div className="space-y-3.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 border border-stone-200 hover:border-stone-300 bg-[#f8f9fa] hover:bg-white text-xs font-medium text-stone-700 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span className="font-semibold text-stone-800">
                  {isGoogleLoading ? 'Connecting...' : 'Sign up instantly with Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[10px] uppercase font-mono tracking-widest text-stone-400">
                  OR WITH DETAILS BELOW
                </span>
                <div className="border-t border-stone-200 w-full" />
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Row 1: Full Name */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    Full Name <span className="text-stone-400 font-normal">(සම්පූර්ණ නම)</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    placeholder="Your Full Name (ඔබගේ නම)"
                    className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Row 1: Contact Phone */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    Phone Number <span className="text-stone-400 font-normal">(දුරකථන අංකය)</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="07X XXXXXXX"
                    className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Row 2: Delivery Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    Delivery Address <span className="text-stone-400 font-normal">(බෙදාහැරීමේ ලිපිනය)</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    placeholder="House No, Road / Street"
                    className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Row 3: District */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="district"
                      value={registerData.district}
                      onChange={handleRegisterChange}
                      className="w-full h-10 sm:h-11 px-3.5 pr-8 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none appearance-none cursor-pointer transition-all shadow-2xs"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3: City */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    City / Town <span className="text-stone-400 font-normal">(නගරය)</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={registerData.city}
                    onChange={handleRegisterChange}
                    placeholder="e.g. Maharagama"
                    className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Row 4: Password */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    Password <span className="text-stone-400 font-normal">(මුරපදය)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Create password"
                      className="w-full h-10 sm:h-11 px-3.5 pr-10 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Row 4: Email */}
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    Email <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="name@email.com"
                    className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* WhatsApp Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 hover:text-stone-900">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="w-3.5 h-3.5 text-rose-600 focus:ring-rose-500 border-stone-300"
                  />
                  <span>WhatsApp number is the same as contact phone</span>
                </label>

                {!sameAsPhone && (
                  <div className="mt-2 space-y-1">
                    <label className="block text-xs font-medium text-stone-800 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={registerData.whatsapp}
                      onChange={handleRegisterChange}
                      placeholder="077 123 4567"
                      className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-stone-200 focus:ring-1 focus:ring-stone-900/15 text-stone-900 text-xs sm:text-sm focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                )}
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 sm:h-12 bg-[#c1272d] hover:bg-[#a61c22] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-900/15 cursor-pointer mt-1"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

          {/* Toggle between Login and Register */}
          <div className="text-center pt-1.5 border-t border-stone-100 text-xs text-stone-600">
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
        <div className="relative hidden lg:block bg-stone-100 overflow-hidden h-full min-h-0">
          {/* Main Saree Model Image */}
          <img
            src="/sarees/saree 1.1.png"
            alt="Nandani Batik Pure Silk Saree"
            className="w-full h-full object-cover object-top"
          />

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

          {/* Luxury Atelier Caption at Bottom */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5 z-10">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300 font-semibold block">
              100% Hand-Drawn Sri Lankan Artistry
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug drop-shadow-sm">
              Nil Manel Royal Indigo Silk Saree
            </h3>
            <p className="font-serif italic text-[11px] text-stone-300 font-light max-w-sm">
              Authentic hand-waxed Sri Lankan batik drapes, created for life's most cherished celebrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
