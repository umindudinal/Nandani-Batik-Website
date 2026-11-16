import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { categories as staticCategories } from '../../data/categories';

export default function FeaturedCategories({ setActivePage, setSelectedCategory }) {
  const { categories: liveCategories } = useCart();
  const categoryList = liveCategories && liveCategories.length > 0 ? liveCategories : staticCategories;

  // Exclude 'all' from the grid cards
  const displayCategories = categoryList.filter((c) => c.id !== 'all');

  const defaultCategoryImages = {
    'pure-silk': '/sarees/saree 2.1.png',
    'handloom-cotton': '/sarees/saree 3.2.png',
    'bridal-kandyan': '/sarees/saree 1.1.png',
    'party-wear': '/sarees/saree 4.1.png',
    'office-daily': '/sarees/saree 5.1.png',
  };

  const getCategoryImage = (cat) => {
    if (cat.image && typeof cat.image === 'string' && cat.image.trim() !== '') {
      return cat.image.trim();
    }
    const staticMatch = staticCategories.find((sc) => sc.id === cat.id)?.image;
    if (staticMatch && typeof staticMatch === 'string' && staticMatch.trim() !== '') {
      return staticMatch;
    }
    return defaultCategoryImages[cat.id] || '/sarees/saree 1.1.png';
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-20 bg-[#fcfbf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b1a30] mt-3 mb-2">
            Explore Sarees by Fabric & Occasion
          </h2>
          <p className="text-sm text-slate-500">
            සෑම අවස්ථාවකටම ගැලපෙන අසමසම බතික් සාරි විලාසිතා එකතුව නන්දනී බතික් වෙතින්.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image */}
              <img
                src={getCategoryImage(cat)}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = '/sarees/saree 1.1.png';
                }}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a30] via-[#0b1a30]/40 to-transparent group-hover:via-[#0b1a30]/60 transition-colors" />


              {/* Content bottom */}
              <div className="absolute bottom-4 inset-x-4 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold group-hover:text-amber-300 transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-[#0b1a30] flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                  {cat.sinhalaName || cat.sinhala_name}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-1 opacity-90">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
