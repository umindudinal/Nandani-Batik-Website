import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import bg_1 from '../../assets/images/background/bg 1.png';
import bg_2 from '../../assets/images/background/bg 2.png';
import bg_3 from '../../assets/images/background/bg 3.png';

export default function HeroBanner({ setActivePage, setSelectedCategory }) {
  const slides = [
    {
      title: 'Handcrafted Batik Sarees of Ceylon',
      sinhalaTitle: 'පරපුරක අභිමානය රැඳි නන්දනී බතික් සාරි',
      subtitle: 'Drawn with molten beeswax on pure mulberry silk and Ceylon handloom cotton. Hand-dyed in small artisan batches in Sri Lanka.',
      ctaText: 'Explore Collection',
      ctaPage: 'shop',
      ctaCategory: 'all',
      image: bg_1,
      objectPosition: '85% top',
    },
    {
      title: 'Bespoke Bridal & Kandyan Osariya',
      sinhalaTitle: 'ඔබේ මංගල දිනයට අනන්‍ය බතික් මෝස්තර',
      subtitle: 'Custom-dyed bridal drapes, traditional Osariya, and bridesmaid saree sets created in harmony with your wedding palette.',
      ctaText: 'Bridal Collection',
      ctaPage: 'bridal',
      ctaCategory: 'silk-batik',
      image: bg_2,
      objectPosition: '85% top',
    },
    {
      title: 'Pure Cotton Batik Drapes',
      sinhalaTitle: 'කාර්යාලීය සහ එදිනෙදා විලාසිතා සඳහා කපු සාරි',
      subtitle: 'Featherlight, breathable natural cotton woven on traditional looms with signature crackle wax veining for tropical comfort.',
      ctaText: 'Shop Cotton Batik',
      ctaPage: 'shop',
      ctaCategory: 'cotton-batik',
      image: bg_3,
      objectPosition: '85% top',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCtaClick = (page, cat) => {
    if (cat && setSelectedCategory) {
      setSelectedCategory(cat);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#0b1a30] text-white overflow-hidden min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex items-center">
      {/* Background Images */}
      {slides.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-80' : 'opacity-0'
          }`}
        >
          <img
            src={item.image}
            alt="Nandani Batik Saree Drape"
            className="w-full h-full object-cover filter saturate-105"
            style={{ objectPosition: item.objectPosition || '85% top' }}
          />
        </div>
      ))}

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1a30] via-[#0b1a30]/80 via-50% to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a30]/90 via-transparent via-25% to-transparent pointer-events-none" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 w-full">
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 grid-rows-1">
            {slides.map((item, index) => (
              <div
                key={index}
                className={`col-start-1 row-start-1 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0 z-10'
                    : 'opacity-0 translate-y-3 pointer-events-none z-0'
                }`}
              >
                {/* Brand Monogram Tag */}
                <div className="text-[11px] font-semibold tracking-widest uppercase text-amber-300/90 mb-3">
                  Nandani Batik • Sri Lanka
                </div>

                {/* Main Heading */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1] mb-2">
                  {item.title}
                </h1>

                {/* Sinhala Sub-heading */}
                <p className="text-amber-200/80 font-normal text-sm sm:text-base mb-4">
                  {item.sinhalaTitle}
                </p>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-lg">
                  {item.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => handleCtaClick(item.ctaPage, item.ctaCategory)}
                    className="bg-amber-400 hover:bg-amber-500 text-[#0b1a30] font-semibold px-6 py-3.5 text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20would%20like%20to%20inquire%20about%20your%20batik%20sarees."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-5 py-3.5 text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Atelier</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Understated Trust Strip */}
          <div className="flex flex-wrap items-center gap-6 pt-10 mt-10 border-t border-white/10 text-xs text-slate-300">
            <div>
              <span className="text-white font-medium">100% Wax Batik</span>
              <span className="text-slate-400 ml-1.5">• Hand-drawn canting</span>
            </div>
            <div>
              <span className="text-white font-medium">Included Blouse Piece</span>
              <span className="text-slate-400 ml-1.5">• Matching sleeve borders</span>
            </div>
            <div>
              <span className="text-white font-medium">Islandwide Delivery</span>
              <span className="text-slate-400 ml-1.5">• Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
          className="p-2 border border-white/20 hover:bg-white/10 text-white transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % slides.length)
          }
          className="p-2 border border-white/20 hover:bg-white/10 text-white transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
