import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
    error: <AlertTriangle size={16} className="text-rose-400 shrink-0" />,
    info: <Info size={16} className="text-blue-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-4 sm:bottom-5 right-4 sm:right-5 left-4 sm:left-auto z-50 animate-in slide-in-from-bottom-3 duration-150">
      <div className="bg-[#0a1120] text-white px-3.5 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 border border-slate-800 w-full sm:max-w-sm text-xs">
        {icons[toast.type || 'success']}
        <p className="font-medium text-slate-200 flex-1">{toast.message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
