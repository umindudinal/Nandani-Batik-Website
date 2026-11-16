import React from 'react';
import { Award, Heart, Layers, Users, Droplets, Sun, Flame, ArrowRight } from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div className="bg-[#fcfbf9] min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>The Nandani Batik Story</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0b1a30] leading-tight mb-3">
            Preserving Ceylon's Handcrafted Batik Legacy
          </h1>

          <p className="text-amber-800 font-semibold text-sm sm:text-base mb-6">
            නන්දනී බතික් - ශ්‍රී ලාංකික කාන්තාවගේ අභිමානය සහ සංස්කෘතික අනන්‍යතාවය
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Founded with a deep reverence for Sri Lanka's indigenous textile crafts, Nandani Batik has grown from a humble family atelier into one of the island's most respected handcrafted batik saree houses.
          </p>
        </div>

        {/* Brand Logo & Mission Showcase */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#0b1a30] shadow-xl bg-white p-1 mb-4">
              <img
                src="/nandani-logo.jpg"
                alt="Nandani Batik Seal"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0b1a30]">
              NANDANI BATIK
            </h3>
            <p className="text-xs text-amber-700 font-medium">
              Authentic Handcrafted Sarees
            </p>
          </div>

          <div className="md:col-span-8 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1a30]">
              Why Authentic Wax Batik Is Irreplaceable
            </h2>
            <p>
              In an era flooded with fast-fashion digital polyester prints, Nandani Batik remains uncompromising in our devotion to the traditional wax-resist process. When you wear a Nandani saree, you are wearing an original canvas painted with hot molten wax and bathed in reactive cold dyes.
            </p>
            <p>
              The distinctive natural crackle veins that run through the fabric can never be replicated by a machine. Each nuance represents the breath, touch, and mastery of a Sri Lankan artisan.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-[#0b1a30]">
              <div>
                <span className="block text-2xl font-black text-amber-600">100%</span>
                <span>Hand-Drawn Batik</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-600">12+</span>
                <span>Exclusive Masterpieces</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-600">25+</span>
                <span>Districts Delivered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl w-fit mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0b1a30] mb-1">
              Pure Silk & Handspun Cottons
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We carefully source high-grade mulberry silk, raw silk, and handloom cotton yarns that absorb batik dye pigments deeply and drape fluidly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0b1a30] mb-1">
              Empowering Female Artisans
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Over 70% of our master wax illustrators and dyers are women from rural Sri Lankan artisan communities who earn fair living wages and preserve cultural heritage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-blue-50 text-[#0b1a30] rounded-xl w-fit mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0b1a30] mb-1">
              Permanent Color Brilliance
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We use premium reactive cold dye chemistry that permanently bonds with natural fibers, ensuring your saree will not fade even after decades of wear.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-[#0b1a30] hover:bg-brand-blue-800 text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
          >
            <span>Explore Handcrafted Sarees</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
