import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function CustomOrderBanner({ setActivePage }) {
  const whatsappCustomMessage = encodeURIComponent(
    'Hello Nandani Batik! I would like to consult with your design team about a custom-made batik saree / wedding troupe design.'
  );

  return (
    <section className="py-16 bg-brand-cream border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b1a30] p-8 sm:p-12 lg:p-16 text-white relative">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300">
              Bespoke Studio
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
              Commission a Custom Colorway or Wedding Troupe Saree
            </h2>

            <p className="text-amber-200/90 text-sm sm:text-base font-normal">
              ඔබේ මංගල උත්සවයට හෝ විශේෂ අවස්ථාවට අනන්‍ය බතික් සාරි නිර්මාණය කරගන්න.
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
              Whether you wish to coordinate a custom Kandyan Osariya, harmonize bridesmaid saree tones, or commission a bespoke pallu motif for a special gala, our atelier craftsmen work directly with your color swatch.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href={`https://wa.me/94778924115?text=${whatsappCustomMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 text-xs uppercase tracking-wider transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setActivePage('bridal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 border border-white/25 hover:bg-white/10 text-white font-medium px-6 py-3.5 text-xs uppercase tracking-wider transition-all"
              >
                <span>View Bridal Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
