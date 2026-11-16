import React from 'react';
import { Palette, Layers, Sparkles, Truck } from 'lucide-react';

export default function FeaturesBar() {
  const features = [
    {
      title: 'Handcrafted Wax Batik',
      sinhala: '100% අතින් නිමවූ බතික් කලාව',
      description: 'Drawn with molten beeswax and canting pens by master Sri Lankan artisans. Zero digital prints.',
    },
    {
      title: 'Pure Silk & Ceylon Handloom',
      sinhala: 'ස්වභාවික උසස්ම රෙදිපිළි',
      description: 'Lustrous mulberry silks and breathable combed cottons dyed in rich, colorfast reactive baths.',
    },
    {
      title: 'Bespoke Bridal Sarees',
      sinhala: 'අභිරුචි මංගල නිර්මාණ',
      description: 'Custom color matching, tailored Osariya drapes, and synchronized bridesmaid collections.',
    },
    {
      title: 'Doorstep Islandwide Delivery',
      sinhala: 'දිවයින පුරා බෙදාහැරීම',
      description: 'Fast, secure parcel dispatch with Cash on Delivery (COD) available across all 25 districts.',
    },
  ];

  return (
    <section className="bg-[#faf8f5] border-y border-stone-200/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex flex-col justify-start ${i !== 0 ? 'pt-6 sm:pt-0 sm:pl-8 lg:pl-10' : ''}`}
            >
              <div className="text-[10px] font-mono tracking-widest text-amber-700 uppercase mb-1">
                0{i + 1}
              </div>
              <h4 className="font-serif text-base font-semibold text-stone-900 leading-snug">
                {f.title}
              </h4>
              <p className="text-xs text-amber-800/90 font-medium mt-0.5 mb-2">
                {f.sinhala}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
