import React from 'react';
import { Heart } from 'lucide-react';
import { InstagramIcon } from '../common/BrandIcons';

export default function InstagramShowcase() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      caption: 'Royal Nil Manel Silk Batik at Galle Face',
      likes: '482',
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      caption: 'Mayura Peacock Plume draped for an evening gala',
      likes: '629',
    },
    {
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      caption: 'Araliya Red Bridal Osariya in Kandy',
      likes: '915',
    },
    {
      url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
      caption: 'Breathable Amber Handloom Cotton for office elegance',
      likes: '341',
    },
    {
      url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
      caption: 'Midnight Obsidian handcrafted raw silk',
      likes: '512',
    },
    {
      url: 'https://images.unsplash.com/photo-1583391733975-087dd79e848e?auto=format&fit=crop&w=600&q=80',
      caption: 'Ceremonial Kandyan bridal saree by Nandani Batik',
      likes: '1.2k',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider">
              <InstagramIcon className="w-4 h-4" />
              <span>@nandanibatik.lk</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0b1a30] mt-1">
              Draped in Nandani Batik
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-[#0b1a30] hover:text-white hover:border-[#0b1a30] transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {images.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-xs cursor-pointer"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-[#0b1a30]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-pink-300 mb-1">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{item.likes}</span>
                </div>
                <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
