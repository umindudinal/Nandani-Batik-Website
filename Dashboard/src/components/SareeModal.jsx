import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '../api/client';
import {
  FABRIC_TYPES,
  DESIGN_TYPES,
  COLOUR_TYPES,
  MAIN_COLOURS,
} from '../constants/sareeAttributes';

export default function SareeModal({
  isOpen,
  onClose,
  initialData,
  categories,
  onSave,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    sinhalaName: '',
    category: 'pure-silk',
    categoryLabel: 'Pure Silk',
    fabric: '100% Pure Mulberry Silk',
    fabricType: 'Silk Batik Sarees',
    designType: 'Floral Design',
    colourType: 'Single Colour',
    mainColour: 'Navy Blue',
    mainColours: ['Navy Blue'],
    primaryColor: 'Dark Blue',
    colorHex: '#0b1a30',
    price: '',
    originalPrice: '',
    discountPercent: 0,
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: '',
    hoverImage: '',
    additionalImages: [],
    description: '',
    palluDetails: '',
    blousePiece: '0.8m Hand-batik matching blouse fabric included',
    length: '6.0 Meters (includes unstitched blouse piece)',
    washCare: 'Dry clean recommended to preserve pure silk luster',
    craftTime: '3-4 days of handcrafted wax resist batik',
    tags: 'Pure Silk, Handmade Batik, Nandani Signature',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isHoverUploading, setIsHoverUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        fabricType: initialData.fabricType || 'Silk Batik Sarees',
        designType: initialData.designType || 'Floral Design',
        colourType: initialData.colourType || 'Single Colour',
        mainColour: initialData.mainColour || initialData.primaryColor || 'Navy Blue',
        mainColours: Array.isArray(initialData.mainColours) && initialData.mainColours.length
          ? initialData.mainColours
          : [initialData.mainColour || initialData.primaryColor || 'Navy Blue'],
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
      });
    } else {
      setFormData({
        name: '',
        sinhalaName: '',
        category: 'pure-silk',
        categoryLabel: 'Pure Silk',
        fabric: '100% Pure Mulberry Silk',
        fabricType: 'Silk Batik Sarees',
        designType: 'Floral Design',
        colourType: 'Single Colour',
        mainColour: 'Navy Blue',
        mainColours: ['Navy Blue'],
        primaryColor: 'Dark Blue',
        colorHex: '#0b1a30',
        price: '',
        originalPrice: '',
        discountPercent: 0,
        inStock: true,
        isNew: true,
        isBestseller: false,
        image: '',
        hoverImage: '',
        additionalImages: [],
        description: '',
        palluDetails: '',
        blousePiece: '0.8m Hand-batik matching blouse fabric included',
        length: '6.0 Meters (includes unstitched blouse piece)',
        washCare: 'Dry clean recommended to preserve pure silk luster',
        craftTime: '3-4 days of artisan wax batik',
        tags: 'Pure Silk, Handmade Wax Batik',
      });
    }
    setCurrentStep(1);
    setStepError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (catId) => {
    const catObj = categories.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      category: catId,
      categoryLabel: catObj ? catObj.name : catId,
    }));
  };

  const handlePriceChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      const price = Number(field === 'price' ? val : prev.price) || 0;
      const orig = Number(field === 'originalPrice' ? val : prev.originalPrice) || 0;
      if (orig > price && price > 0) {
        next.discountPercent = Math.round(((orig - price) / orig) * 100);
      } else {
        next.discountPercent = 0;
      }
      return next;
    });
  };

  const handleFileUpload = async (e, isHover = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isHover) setIsHoverUploading(true);
    else setIsUploading(true);
    setStepError(null);

    try {
      const res = await api.uploadImage(file);
      if (isHover) {
        setFormData((prev) => ({ ...prev, hoverImage: res.url }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image: res.url,
          hoverImage: prev.hoverImage || res.url,
          additionalImages: prev.additionalImages?.length ? prev.additionalImages : [res.url],
        }));
      }
    } catch (err) {
      setStepError(`Upload failed: ${err.message}`);
    } finally {
      if (isHover) setIsHoverUploading(false);
      else setIsUploading(false);
    }
  };

  // Step Validation & Progression
  const handleNextStep = () => {
    setStepError(null);

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setStepError('Please enter a Saree Name before proceeding to the next step');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.image.trim()) {
        setStepError('Please upload or provide a primary cover photo for the saree');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.price || Number(formData.price) <= 0) {
        setStepError('Please specify a valid selling price in LKR before proceeding');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepNum) => {
    // Only allow clicking to visited or next valid step
    if (stepNum > currentStep) {
      if (currentStep === 1 && !formData.name.trim()) {
        setStepError('Please complete the Saree Name first');
        return;
      }
      if (currentStep === 2 && !formData.image.trim()) {
        setStepError('Please upload a cover photo first');
        return;
      }
      if (currentStep === 3 && (!formData.price || Number(formData.price) <= 0)) {
        setStepError('Please set a valid price first');
        return;
      }
    }
    setStepError(null);
    setCurrentStep(stepNum);
  };

  // Final Form Submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      setCurrentStep(1);
      setStepError('Please provide a Saree Name');
      return;
    }
    if (!formData.image.trim()) {
      setCurrentStep(2);
      setStepError('Please provide a primary cover photo');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setCurrentStep(3);
      setStepError('Please specify a valid selling price');
      return;
    }

    setIsSubmitting(true);
    setStepError(null);

    try {
      const tagsArray = typeof formData.tags === 'string'
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : (formData.tags || []);

      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        tags: tagsArray,
        additionalImages: formData.additionalImages?.length ? formData.additionalImages : [formData.image],
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setStepError(err.message || 'Failed to save saree');
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorsList = [
    { name: 'Dark Blue', hex: '#0b1a30' },
    { name: 'Emerald Green', hex: '#047857' },
    { name: 'Crimson Red', hex: '#991b1b' },
    { name: 'Mustard Gold', hex: '#b45309' },
    { name: 'Turquoise', hex: '#0891b2' },
    { name: 'Midnight Black', hex: '#18181b' },
    { name: 'Pastel Pink', hex: '#f472b6' },
    { name: 'Royal Maroon', hex: '#7f1d1d' },
    { name: 'Terracotta', hex: '#ea580c' },
  ];

  const steps = [
    { num: 1, label: 'General Info', short: 'Info' },
    { num: 2, label: 'Photos & Media', short: 'Photos' },
    { num: 3, label: 'Price & Stock', short: 'Pricing' },
    { num: 4, label: 'Artisan Specs', short: 'Specs' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {initialData ? `Edit Saree: ${initialData.name}` : 'New Saree Product'}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Step {currentStep} of 4 · {steps[currentStep - 1].label}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Step Progress Tracker Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900 transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 92}%` }}
            />

            {steps.map((step) => {
              const isCompleted = step.num < currentStep;
              const isCurrent = step.num === currentStep;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => handleStepClick(step.num)}
                  className="flex flex-col items-center gap-1 relative z-10 group focus:outline-none"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all ${
                      isCurrent
                        ? 'bg-[#0a1120] text-white ring-4 ring-slate-100 shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-400 group-hover:border-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check size={13} /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium tracking-tight whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-slate-900 font-bold'
                        : isCompleted
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="sm:hidden">{step.short}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Warning if any */}
        {stepError && (
          <div className="px-4 sm:px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{stepError}</span>
            </div>
            <button onClick={() => setStepError(null)} className="text-rose-500 hover:text-rose-800">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Step-by-Step Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* STEP 1: GENERAL INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Saree Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Nil Manel Royal Indigo Pure Silk Saree"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sinhala Title (සිංහල නම)
                </label>
                <input
                  type="text"
                  placeholder="e.g. නිල් මානෙල් රාජකීය සිල්ක් බතික් සාරිය"
                  value={formData.sinhalaName || ''}
                  onChange={(e) => setFormData({ ...formData, sinhalaName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Collection Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.sinhalaName || c.sinhala_name ? `(${c.sinhalaName || c.sinhala_name})` : ''}
                      </option>
                    ))}
                </select>
              </div>

              {/* Saree Categorization & Design Attributes (User Requested Taxonomy) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Saree Classification & Style (සාරි වර්ගීකරණය)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Filter Options</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Fabric Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Fabric Type (රෙදි වර්ගය) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.fabricType || 'Silk Batik Sarees'}
                      onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 font-medium text-slate-800"
                    >
                      {FABRIC_TYPES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Design Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Design Type (මෝස්තර වර්ගය) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.designType || 'Floral Design'}
                      onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 font-medium text-slate-800"
                    >
                      {DESIGN_TYPES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Colour Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Colour Type (වර්ණ සංකලනය) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.colourType || 'Single Colour'}
                      onChange={(e) => setFormData({ ...formData, colourType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 font-medium text-slate-800"
                    >
                      {COLOUR_TYPES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Main Colour */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Main Colour (ප්‍රධාන වර්ණය) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.mainColour || 'Navy Blue'}
                      onChange={(e) => {
                        const colObj = MAIN_COLOURS.find((c) => c.name === e.target.value);
                        setFormData({
                          ...formData,
                          mainColour: e.target.value,
                          colorHex: colObj ? colObj.hex : formData.colorHex,
                          primaryColor: e.target.value,
                        });
                      }}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 font-medium text-slate-800"
                    >
                      {MAIN_COLOURS.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Visual Color Palette Picker */}
                <div className="pt-1 border-t border-slate-200/60">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                    Click to Select Main Colour Swatch:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MAIN_COLOURS.map((col) => {
                      const isSelected = formData.mainColour === col.name;
                      return (
                        <button
                          type="button"
                          key={col.name}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              mainColour: col.name,
                              colorHex: col.hex,
                              primaryColor: col.name,
                            })
                          }
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description & Artisan Story
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the wax-resist batik motifs, drape flow, color inspiration, and cultural story..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 2: PHOTOS & MEDIA */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              {/* Primary Photo */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Primary Cover Photo <span className="text-rose-500">*</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  {/* Thumbnail preview */}
                  <div className="relative w-32 h-36 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.image && formData.image.trim() ? (
                      <img
                        src={formData.image.trim()}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/sarees/saree 1.1.png';
                        }}
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <ImageIcon size={28} className="mx-auto mb-1 opacity-40" />
                        <span className="text-[10px] block">No photo</span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                        <Loader2 size={20} className="animate-spin text-brand-gold" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-xs">
                        <Upload size={13} className="text-slate-500" />
                        <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400 ml-2">or paste URL below</span>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. /sarees/saree 1.1.png or https://..."
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value,
                          hoverImage: formData.hoverImage || e.target.value,
                        })
                      }
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono text-[11px]"
                    />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Main photo shown on the website catalog cards and product detail banner.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Hover Photo */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-medium text-slate-700">
                  Secondary / Hover Angle Photo (Optional)
                </label>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shrink-0">
                    <Upload size={12} className="text-slate-500" />
                    <span>{isHoverUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isHoverUploading}
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Hover Image URL (displayed when customers hover over the saree)"
                    value={formData.hoverImage || ''}
                    onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PRICING & INVENTORY */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              {/* Pricing */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700">
                  Pricing (LKR)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Selling Price (LKR) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        autoFocus
                        placeholder="45000"
                        value={formData.price}
                        onChange={(e) => handlePriceChange('price', e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Original / Compare-at Price (LKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        placeholder="50000"
                        value={formData.originalPrice}
                        onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {formData.discountPercent > 0 && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <span>Discount displayed on website:</span>
                    <span className="font-mono font-bold">
                      {formData.discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Inventory Switches */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Storefront Visibility
                </h4>

                {/* In Stock */}
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <div className="font-medium text-slate-800 text-xs">In Stock for Purchase</div>
                    <div className="text-[11px] text-slate-500">Available to add to cart and checkout</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Bestseller */}
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <div>
                    <div className="font-medium text-slate-800 text-xs">Featured Bestseller</div>
                    <div className="text-[11px] text-slate-500">Highlighted on website homepage</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* New Arrival */}
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <div>
                    <div className="font-medium text-slate-800 text-xs">New Arrival</div>
                    <div className="text-[11px] text-slate-500">Flagged as new seasonal collection</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: ARTISAN SPECIFICATIONS */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fabric Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Pure Mulberry Silk"
                    value={formData.fabric || ''}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Saree Length
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6.0 Meters (includes blouse)"
                    value={formData.length || ''}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Blouse Piece Included
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0.8m unstitched matching fabric"
                    value={formData.blousePiece || ''}
                    onChange={(e) => setFormData({ ...formData, blousePiece: e.target.value })}
                    className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Crafting Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3-4 days of artisan wax batik"
                    value={formData.craftTime || ''}
                    onChange={(e) => setFormData({ ...formData, craftTime: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Wash & Maintenance Care
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dry clean recommended to preserve luster and dye vibrancy"
                  value={formData.washCare || ''}
                  onChange={(e) => setFormData({ ...formData, washCare: e.target.value })}
                  className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Color Swatch Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Primary Color Swatch
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {colorsList.map((col) => (
                    <button
                      type="button"
                      key={col.name}
                      onClick={() =>
                        setFormData({ ...formData, primaryColor: col.name, colorHex: col.hex })
                      }
                      title={col.name}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        formData.primaryColor === col.name
                          ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Dark Blue)"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg flex-1"
                  />
                  <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-1 bg-white">
                    <input
                      type="color"
                      value={formData.colorHex || '#0b1a30'}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-500 pr-1">
                      {formData.colorHex}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Pure Silk, Wax Batik, Signature"
                  value={formData.tags || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-[11px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step-by-Step Bottom Footer Navigation */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Discard
          </button>

          <div className="flex items-center gap-2">
            {/* Back Button */}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
            )}

            {/* Next Step or Submit Button */}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-1.5 rounded-lg bg-[#0a1120] hover:bg-[#16233b] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1"
              >
                <span>Next Step</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                <span>{initialData ? 'Update Saree' : 'Publish Saree to Website'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
