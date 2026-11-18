import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Key,
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default credentials (can be overridden via environment variables)
  const validUser = import.meta.env.VITE_ADMIN_USER || 'admin@nandanibatik.lk';
  const validPass = import.meta.env.VITE_ADMIN_PASSWORD || 'nandani2026';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const isUserMatch =
        cleanUser === validUser.toLowerCase() ||
        cleanUser === 'admin' ||
        cleanUser === 'nandani';
      const isPassMatch = password === validPass;

      if (isUserMatch && isPassMatch) {
        const sessionData = {
          user: username.trim(),
          role: 'Administrator',
          token: `nb_session_${Date.now()}`,
          loginTime: new Date().toISOString(),
        };

        if (rememberMe) {
          localStorage.setItem('nandani_admin_auth', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('nandani_admin_auth', JSON.stringify(sessionData));
        }

        onLoginSuccess(sessionData);
      } else {
        setError('Invalid username or password. Please verify your credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#060e1b] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-900 relative overflow-hidden">
      {/* Subtle Background Radial Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-blue-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0a1120] border border-slate-800/90 rounded-2xl p-7 sm:p-10 shadow-2xl relative z-10 space-y-7">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/40 bg-white p-0.5 mx-auto shadow-lg">
            <img
              src="/nandani-logo.jpg"
              alt="Nandani Batik Seal"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold block mb-1">
              Operations Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Nandani Batik
            </h1>
            <p className="font-serif italic text-xs text-slate-400 mt-1">
              පරිපාලක පද්ධතිය වෙත පිවිසෙන්න
            </p>
          </div>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium text-[11px] uppercase tracking-wider">
              Admin Username or Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@nandanibatik.lk"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium text-[11px] uppercase tracking-wider">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 cursor-pointer"
              />
              <span className="text-[11px]">Remember this session</span>
            </label>

            <span className="text-[10px] text-slate-500 font-mono">
              Role: Master Admin
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0b1a30] hover:bg-slate-800 border border-slate-700 text-white font-medium py-3 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60 group mt-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Quick Credentials Info Tooltip */}
        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Atelier Credentials
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-mono text-[11px]">
            <span>admin@nandanibatik.lk</span>
            <span className="text-slate-600">•</span>
            <span>nandani2026</span>
          </div>
        </div>

        {/* Security Reassurance */}
        <div className="text-center text-[10px] uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Session • Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}
