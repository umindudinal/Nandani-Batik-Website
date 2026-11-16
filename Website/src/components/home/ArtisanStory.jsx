import React from 'react';
import { Flame, Droplets, Sparkles, Sun, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ArtisanStory({ setActivePage }) {
  const steps = [
    {
      number: '01',
      title: 'Beeswax & Canting Drawing',
      sinhala: 'උණුසුම් ඉටි සහ කැන්ටින් ආලේපනය',
      desc: 'Each drape begins with melted natural beeswax. Master artisans hand-draw traditional motifs using fine-tipped brass canting pens directly onto pure mulberry silk or handloom fabric.',
    },
    {
      number: '02',
      title: 'Multi-Dip Cold Dyeing',
      sinhala: 'සායම් ස්නානය සහ ක්‍රැකල් කලාව',
      desc: 'The waxed fabric is immersed in multiple cold reactive dye baths from delicate tones to deep indigos. Controlled wax fracturing produces the signature batik crackle veins.',
    },
    {
      number: '03',
      title: 'Boiling Water Dewaxing',
      sinhala: 'ඉටි ඉවත් කිරීම සහ සේදීම',
      desc: 'The dyed cloth is immersed in copper cauldrons of boiling water to dissolve and lift the wax resist, unveiling crisp, contrasting patterns preserved beneath.',
    },
    {
      number: '04',
      title: 'Sun Drying & Finishing',
      sinhala: 'හිරු එළියෙන් වියළීම',
      desc: 'Draped under natural tropical sunshine to fix reactive colors permanently. Finished with natural softeners for an effortless, graceful fall.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0b1a30] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pb-14 border-b border-white/10">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300">
              The Living Craft
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mt-2 leading-[1.15]">
              Hand-Drawn, Wax-Resist Batik — Never Machine Printed.
            </h2>
            <p className="text-amber-200/80 text-sm mt-2 font-normal">
              ශ්‍රී ලාංකික පාරම්පරික බතික් කලාවේ සැබෑ අභිමානය
            </p>
          </div>

          <div className="lg:col-span-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <p>
              Unlike mass-manufactured synthetic prints, each Nandani Batik saree is a singular piece of textile art. Our artisan workshop in Sri Lanka spends 3 to 7 days on every 6-yard saree, ensuring no two drapes are ever identical.
            </p>
          </div>
        </div>

        {/* 4-Step Craft Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-14">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col justify-between border-t border-white/15 pt-6">
              <div>
                <span className="font-mono text-xs font-semibold text-amber-400">
                  [{step.number}]
                </span>
                <h3 className="font-serif text-lg font-medium text-white mt-2 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-amber-200/80 mb-3 font-normal">
                  {step.sinhala}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Atelier Note */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ethically handcrafted by local cottage women artisans across Sri Lanka</span>
          </div>

          <button
            onClick={() => {
              setActivePage('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-amber-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Read Our Atelier Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
