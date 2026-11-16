import React from 'react';
import { ShieldCheck, Droplets, Sun, Flame, Wind, AlertCircle } from 'lucide-react';

export default function CareGuidePage() {
  const silkTips = [
    'Always opt for Professional Dry Cleaning for pure mulberry and raw silk batik sarees.',
    'If hand washing at home, use cold water and a mild silk shampoo or baby shampoo.',
    'Never wring or twist the wet saree. Gently roll in a dry cotton towel to absorb moisture.',
    'Always dry in deep shade. Direct harsh tropical sunlight can dry out silk luster.',
    'Iron on the reverse side using medium-low heat with a clean cotton pressing cloth.',
  ];

  const cottonTips = [
    'For the first wash, soak the cotton batik saree in cold water with a teaspoon of common salt to lock the dye.',
    'Wash separately or with similar dark colors using a gentle detergent.',
    'Avoid harsh chlorine bleaching agents under any circumstances.',
    'Dry flat in the shade to preserve vibrant hues.',
    'Warm iron while the cotton saree is slightly damp for a crisp, wrinkle-free fall.',
  ];

  return (
    <div className="bg-[#fcfbf9] min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Preserve Your Heirloom</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b1a30] leading-tight mb-2">
            The Saree Care & Longevity Guide
          </h1>
          <p className="text-sm text-slate-500">
            ඔබේ නන්දනී බතික් සාරිය වසර ගණනාවක් අලුත් ලෙස තබාගැනීමට උපදෙස්
          </p>
        </div>

        {/* Pure Silk Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0b1a30]">
                Pure Silk & Bridal Batik Sarees
              </h2>
              <span className="text-xs text-amber-800 font-semibold">
                Pure Mulberry, Tussar & Raw Silk
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Silk is a natural protein fiber that breathes gracefully. Follow these recommendations to maintain sheen and color depth:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {silkTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Handloom Cotton Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0b1a30]">
                Handloom Cotton & Casual Batik Sarees
              </h2>
              <span className="text-xs text-emerald-800 font-semibold">
                100% Handspun Ceylon Combed Cotton
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ceylon cotton is durable, lightweight, and engineered for high comfort in Sri Lanka's tropical weather:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {cottonTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Wardrobe Storage Tips */}
        <div className="bg-[#0b1a30] text-white p-6 sm:p-8 rounded-3xl space-y-4">
          <h2 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <span>Wardrobe Storage & Preservation</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="font-bold text-amber-300 mb-1">Use Breathable Cotton Bags</h4>
              <p className="leading-relaxed">
                Never store your silk sarees in plastic bags as plastic traps humidity. Use clean muslin cloth or cotton saree covers.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="font-bold text-amber-300 mb-1">Refold Periodically</h4>
              <p className="leading-relaxed">
                Take out your sarees every 3-4 months, unfold them, air them in shade for an hour, and refold along new fold lines to prevent crease tears.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
