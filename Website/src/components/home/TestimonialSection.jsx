import React from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-[#faf8f5] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="text-[11px] font-semibold tracking-widest uppercase text-amber-800 mb-2">
            Client Words
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
            Treasured in Living Wardrobes
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            නන්දනී බතික් සාරි පිළිබඳව අපගේ පාරිභෝගිකයින්ගේ අදහස්
          </p>
        </div>

        {/* Testimonials Grid without fake stock photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-7 border border-stone-200/80 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                <Quote className="w-6 h-6 text-stone-300 mb-4" />

                {/* Saree Bought Tag */}
                <div className="text-[11px] font-mono font-medium text-amber-800 bg-amber-50 px-2.5 py-1 inline-block mb-3 border border-amber-200/50">
                  {t.sareeBought}
                </div>

                {/* Comment */}
                <p className="text-xs text-stone-700 leading-relaxed font-normal mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-stone-900">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {t.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Drape</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
