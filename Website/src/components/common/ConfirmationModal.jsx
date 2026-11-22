import React, { useEffect } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  LogOut,
  X,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ConfirmationModal() {
  const { dialogState, closeDialog } = useCart();

  useEffect(() => {
    if (!dialogState?.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (dialogState.onCancel) {
          dialogState.onCancel();
        } else {
          closeDialog();
        }
      } else if (e.key === 'Enter') {
        if (dialogState.onConfirm) {
          dialogState.onConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogState, closeDialog]);

  if (!dialogState || !dialogState.isOpen) return null;

  const {
    title = 'Confirmation',
    message = '',
    type = 'confirm', // 'confirm' | 'danger' | 'error' | 'success' | 'info'
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
  } = dialogState;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    else closeDialog();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else closeDialog();
  };

  const renderIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0">
            <LogOut className="w-5 h-5 stroke-[1.75]" />
          </div>
        );
      case 'error':
        return (
          <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle className="w-5 h-5 stroke-[1.75]" />
          </div>
        );
      case 'success':
        return (
          <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[1.75]" />
          </div>
        );
      case 'info':
        return (
          <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
            <Info className="w-5 h-5 stroke-[1.75]" />
          </div>
        );
      case 'confirm':
      default:
        return (
          <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[1.75]" />
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white border border-stone-200/90 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Luxury Top Accent Bar */}
        <div
          className={`h-1 w-full ${
            type === 'danger' || type === 'error'
              ? 'bg-[#c1272d]'
              : type === 'success'
              ? 'bg-emerald-600'
              : 'bg-[#0b1a30]'
          }`}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-4">
          {/* Header with Icon and Title */}
          <div className="flex items-start gap-3.5">
            {renderIcon()}
            <div className="space-y-1 pr-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                Nandani Batik Atelier
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
                {title}
              </h3>
            </div>
          </div>

          {/* Message Text */}
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans pl-0.5">
            {message}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            {cancelText && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              autoFocus
              className={`px-5 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs ${
                type === 'danger'
                  ? 'bg-[#c1272d] hover:bg-[#a61c22] text-white shadow-rose-900/15'
                  : 'bg-[#0b1a30] hover:bg-stone-900 text-white'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
