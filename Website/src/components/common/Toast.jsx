import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-[#0b1a30] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-300/30 flex items-center gap-3 text-xs sm:text-sm font-semibold">
        {toast.type === 'info' ? (
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
        ) : toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
