import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function CategoryModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: '',
    sinhalaName: '',
    description: '',
    image: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sinhalaName: initialData.sinhalaName || initialData.sinhala_name || '',
        description: initialData.description || '',
        image: initialData.image || '',
      });
    } else {
      setFormData({
        name: '',
        sinhalaName: '',
        description: '',
        image: '',
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a category name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {initialData ? `Edit Category: ${initialData.name}` : 'New Saree Category'}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {initialData ? `Identifier: ${initialData.id}` : 'Create a new collection category'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-4 sm:px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800">
              <X size={13} />
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Category Name (English) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Silk Batik, Handloom Cotton..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Sinhala Name (සිංහල නම)
            </label>
            <input
              type="text"
              placeholder="e.g. පිරිසිදු සිල්ක් බතික්, හැන්ඩ්ලූම් කපු..."
              value={formData.sinhalaName}
              onChange={(e) => setFormData({ ...formData, sinhalaName: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of fabrics, motifs, or suitable occasions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 leading-relaxed"
            />
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Category Cover Photo
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                {formData.image && formData.image.trim() ? (
                  <img
                    src={formData.image.trim()}
                    alt="Category Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/sarees/saree 1.1.png';
                    }}
                  />
                ) : (
                  <ImageIcon size={20} className="text-slate-300" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                    <Loader2 size={16} className="animate-spin text-[#c59b27]" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-xs">
                  <Upload size={12} className="text-slate-500" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  placeholder="or enter image URL (e.g. /sarees/saree 1.1.png)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-[#0a1120] hover:bg-[#16233b] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin text-[#c59b27]" />}
              <span>{initialData ? 'Update Category' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
