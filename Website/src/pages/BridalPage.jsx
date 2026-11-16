import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart, PhoneCall, Check, Calendar, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SareeCard from '../components/sarees/SareeCard';

export default function BridalPage({ setActivePage }) {
  const { sarees } = useCart();
  const [troupeSize, setTroupeSize] = useState('4');
  const [weddingDate, setWeddingDate] = useState('');
  const [colorTheme, setColorTheme] = useState('Royal Navy & Champagne Gold');

  const bridalSarees = sarees.filter(
    (s) => s.category === 'bridal-kandyan' || (Array.isArray(s.tags) && s.tags.includes('Bridal Collection'))
  );

  const handleConsultation = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello Nandani Batik Bridal Studio! 🌸 I am planning my wedding and would like to book a bespoke consultation:\n\n` +
        `• Wedding Date: ${weddingDate || 'TBD'}\n` +
        `• Bridesmaid Troupe Size: ${troupeSize} Sarees\n` +
        `• Preferred Color Theme: ${colorTheme}\n\n` +
        `Please let me know how we can meet or schedule a WhatsApp video swatch review!`
    );
    window.open(`https://wa.me/94778924115?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Bridal Hero */}
      <div className="relative bg-[#0b1a30] text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1583391733975-087dd79e848e?auto=format&fit=crop&w=1600&q=80"
            alt="Bridal Saree Drape"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-[#0b1a30] via-[#0b1a30]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-2xl">
            <div className="text-[11px] font-mono tracking-widest uppercase text-amber-300 mb-3">
              Bridal & Kandyan Atelier
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium leading-tight mb-2">
              Bespoke Bridal Batik Sarees
            </h1>

            <p className="text-amber-200 font-medium text-sm sm:text-base mb-4">
              ඔබේ සිහින මංගල දිනය රාජකීය බතික් කලාවෙන් සරසා ගන්න
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
              From majestic Kandyan Osariya drapes with heavy worked pallus to perfectly synchronized bridesmaid batik sarees, Nandani Batik creates timeless wedding saree masterpieces tailored to your palette.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-amber-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Custom Color Dye Swatch Matching
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Matching Handcrafted Blouse Fabric Included
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Special Rates on Bridal Troupe Saree Orders (4+ Sarees)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Bridal Sarees */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0b1a30]">
              Signature Bridal & Ceremonial Drapes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hand-waxed on luxurious Tussar silk, pure mulberry silk, and heavy raw silk
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bridalSarees.map((saree) => (
              <SareeCard key={saree.id} saree={saree} />
            ))}
          </div>
        </div>

        {/* Interactive Bespoke Consultation Booking Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-lg max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Personal Saree Stylist
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0b1a30] mt-2 mb-1">
              Book a Free Bridal Consultation
            </h3>
            <p className="text-xs text-slate-500">
              Speak directly with our chief designer to select colors, motifs, and fabric weights
            </p>
          </div>

          <form onSubmit={handleConsultation} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Wedding / Function Date
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Number of Sarees Needed (Troupe Size)
                </label>
                <select
                  value={troupeSize}
                  onChange={(e) => setTroupeSize(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none bg-white"
                >
                  <option value="1">1 Saree (Bride / Individual)</option>
                  <option value="2">2 Sarees (Bride + Maid of Honor)</option>
                  <option value="4">4 Sarees (Bridal Troupe)</option>
                  <option value="6">6 Sarees (Full Troupe)</option>
                  <option value="8+">8+ Sarees (Large Wedding Party)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Your Preferred Color Theme or Inspiration
              </label>
              <input
                type="text"
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value)}
                placeholder="e.g. Royal Navy Blue & Champagne Gold / Emerald Green & Coral"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0b1a30] hover:bg-brand-blue-800 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Connect with Designer on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
