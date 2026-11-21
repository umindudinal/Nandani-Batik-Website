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

// 4 Primary Fabric Types
export const FABRIC_TYPES = [
  'Normal Voil Sarees',
  'Super Voil Sarees',
  'Cotton Batik Sarees',
  'Silk Batik Sarees',
];

// 7 Saree Design Types
export const DESIGN_TYPES = [
  'Floral Design',
  'Traditional Design',
  'Peacock Design',
  'Elephant Design',
  'Abstract Design',
  'Geometric Design',
  'Nature Design',
];

// 4 Colour Combination Types
export const COLOUR_TYPES = [
  'Single Colour',
  'Two Colour',
  'Three Colour',
  'Multi Colour',
];

// 12 Main Atelier Colours with hex codes
export const MAIN_COLOURS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Brown', hex: '#78350f' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Navy Blue', hex: '#0b1a30' },
];

export default function SareeModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    sinhalaName: '',
    fabricType: 'Normal Voil Sarees',
    designType: 'Floral Design',
    colourType: 'Single Colour',
    mainColour: 'Navy Blue',
    category: 'normal-voil',
    categoryLabel: 'Normal Voil Sarees',
    fabric: 'Normal Voile Cotton',
    primaryColor: 'Navy Blue',
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
    washCare: 'Gentle hand wash or dry clean recommended to preserve batik vibrancy',
    craftTime: '3-4 days of handcrafted wax resist batik',
    tags: 'Normal Voile, Handmade Batik, Nandani Signature',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isHoverUploading, setIsHoverUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState(null);

  useEffect(() => {
    if (initialData) {
      const ft = initialData.fabricType || initialData.categoryLabel || 'Normal Voil Sarees';
      const mc = initialData.mainColour || initialData.primaryColor || 'Navy Blue';
      setFormData({
        ...initialData,
        fabricType: ft,
        designType: initialData.designType || 'Floral Design',
        colourType: initialData.colourType || 'Single Colour',
        mainColour: mc,
        primaryColor: initialData.primaryColor || mc,
        colorHex: initialData.colorHex || '#0b1a30',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
      });
    } else {
      setFormData({
        name: '',
        sinhalaName: '',
        fabricType: 'Normal Voil Sarees',
        designType: 'Floral Design',
        colourType: 'Single Colour',
        mainColour: 'Navy Blue',
        category: 'normal-voil',
        categoryLabel: 'Normal Voil Sarees',
        fabric: 'Normal Voile Cotton',
        primaryColor: 'Navy Blue',
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
        washCare: 'Gentle hand wash or dry clean recommended to preserve batik vibrancy',
        craftTime: '3-4 days of artisan wax batik',
        tags: 'Normal Voile, Handmade Wax Batik',
      });
    }
    setCurrentStep(1);
    setStepError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFabricTypeChange = (fabricName) => {
    const slugMap = {
      'Normal Voil Sarees': 'normal-voil',
      'Super Voil Sarees': 'super-voil',
      'Cotton Batik Sarees': 'cotton-batik',
      'Silk Batik Sarees': 'silk-batik',
    };
    const catId = slugMap[fabricName] || 'normal-voil';
    setFormData((prev) => ({
      ...prev,
      fabricType: fabricName,
      category: catId,
      categoryLabel: fabricName,
    }));
  };

  const handleMainColourChange = (colorName) => {
    const colObj = MAIN_COLOURS.find((c) => c.name === colorName);
    setFormData((prev) => ({
      ...prev,
      mainColour: colorName,
      primaryColor: colorName,
      colorHex: colObj ? colObj.hex : prev.colorHex,
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
                  Local Title / Sub-title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nil Manel Royal Indigo Silk Saree"
                  value={formData.sinhalaName || ''}
                  onChange={(e) => setFormData({ ...formData, sinhalaName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              {/* 3 Classification Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ">
                {/* 1. Fabric Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    1. Fabric Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.fabricType}
                    onChange={(e) => handleFabricTypeChange(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {FABRIC_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Design Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    2. Design Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.designType}
                    onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {DESIGN_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Colour Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    3. Colour Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.colourType}
                    onChange={(e) => setFormData({ ...formData, colourType: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {COLOUR_TYPES.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
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
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              {/* Dual Photo Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Primary Photo */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-800">
                      Primary Cover Photo <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Cover
                    </span>
                  </div>

                  <div className="flex gap-3 items-start">
                    {/* Thumbnail preview */}
                    <div className="relative w-24 h-28 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
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
                        <div className="text-center p-1.5 text-slate-400">
                          <ImageIcon size={22} className="mx-auto mb-1 opacity-40" />
                          <span className="text-[10px] block">No photo</span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                          <Loader2 size={18} className="animate-spin text-brand-gold" />
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-1.5">
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-xs">
                          <Upload size={12} className="text-slate-500" />
                          <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={(e) => handleFileUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-slate-400 ml-1.5">or paste URL</span>
                      </div>

                      <input
                        type="text"
                        placeholder="e.g. /sarees/saree 1.1.png or URL"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image: e.target.value,
                            hoverImage: formData.hoverImage || e.target.value,
                          })
                        }
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono text-[11px]"
                      />
                      <p className="text-[10px] text-slate-400">Main catalog photo</p>
                    </div>
                  </div>
                </div>

                {/* 2. Secondary Hover Photo */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-800">
                      Secondary / Hover Angle Photo
                    </label>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                      Hover
                    </span>
                  </div>

                  <div className="flex gap-3 items-start">
                    {/* Thumbnail preview */}
                    <div className="relative w-24 h-28 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                      {formData.hoverImage && formData.hoverImage.trim() ? (
                        <img
                          src={formData.hoverImage.trim()}
                          alt="Hover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/sarees/saree 1.2.png';
                          }}
                        />
                      ) : (
                        <div className="text-center p-1.5 text-slate-400">
                          <ImageIcon size={22} className="mx-auto mb-1 opacity-40" />
                          <span className="text-[10px] block">No photo</span>
                        </div>
                      )}
                      {isHoverUploading && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                          <Loader2 size={18} className="animate-spin text-brand-gold" />
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-1.5">
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-xs">
                          <Upload size={12} className="text-slate-500" />
                          <span>{isHoverUploading ? 'Uploading...' : 'Choose File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isHoverUploading}
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-slate-400 ml-1.5">or paste URL</span>
                      </div>

                      <input
                        type="text"
                        placeholder="e.g. /sarees/saree 1.2.png or URL"
                        value={formData.hoverImage || ''}
                        onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono text-[11px]"
                      />
                      <p className="text-[10px] text-slate-400">Card hover & detail angle</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SELECT MAIN COLOUR PALETTE (12 COLOURS) */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    SELECT MAIN COLOUR PALETTE (12 COLOURS) <span className="text-rose-500">*</span>
                  </label>
                  {formData.mainColour && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                      <span className="text-slate-400 text-[11px]">Selected:</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block shrink-0"
                        style={{
                          backgroundColor:
                            MAIN_COLOURS.find((c) => c.name === formData.mainColour)?.hex || formData.colorHex || '#0b1a30',
                        }}
                      />
                      <span className="font-semibold text-slate-800 text-[11px]">{formData.mainColour}</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Look at your saree photos above and select the matching primary colour:
                </p>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {MAIN_COLOURS.map((col) => {
                    const isSelected = formData.mainColour === col.name;
                    const isWhite = col.name === 'White' || col.hex === '#ffffff';
                    return (
                      <button
                        type="button"
                        key={col.name}
                        onClick={() => handleMainColourChange(col.name)}
                        title={col.name}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] border transition-all ${
                          isSelected
                            ? 'border-[#0a1120] bg-[#0a1120] text-white font-medium shadow-xs scale-105'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isWhite ? 'border border-slate-300' : isSelected ? 'border border-white/60' : 'border border-transparent'
                          }`}
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
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
              {/* Summary Banner of Chosen Product Style & Color */}
              <div className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Selected Style:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-800">
                    {formData.fabricType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-800">
                    {formData.designType}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[11px]">Primary Colour:</span>
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                    style={{ backgroundColor: formData.colorHex || '#0b1a30' }}
                  />
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {formData.mainColour || formData.primaryColor}
                  </span>
                </div>
              </div>

              {/* Dimensions & Draping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Saree Length
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6.0 Meters (includes unstitched blouse piece)"
                    value={formData.length || ''}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blouse Piece Included
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0.8m Hand-batik matching blouse fabric included"
                    value={formData.blousePiece || ''}
                    onChange={(e) => setFormData({ ...formData, blousePiece: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Fabric & Craftsmanship Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fabric Material & Weave
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Pure Voile Cotton"
                    value={formData.fabric || ''}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
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

              {/* Pallu & Border Art Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pallu & Border Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Intricate dual-tone hand-waxed floral chandelier with fine crackle effect"
                  value={formData.palluDetails || ''}
                  onChange={(e) => setFormData({ ...formData, palluDetails: e.target.value })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wash & Maintenance Care
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gentle hand wash or dry clean recommended to preserve batik vibrancy"
                  value={formData.washCare || ''}
                  onChange={(e) => setFormData({ ...formData, washCare: e.target.value })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Search & Filter Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Normal Voile, Handmade Wax Batik, Casual Chic"
                  value={formData.tags || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono text-[11px]"
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
