import React from 'react';
import { Phone, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#0b1a30] text-slate-300 text-[11px] py-2 px-4 border-b border-[#1b2f4f]/60 tracking-wider">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 text-center sm:text-left">
        {/* Left: Craft & Delivery Notice */}
        <div className="flex items-center gap-3">
          <span className="text-amber-300 font-medium">
            Handcrafted Batik Sarees of Sri Lanka
          </span>
          <span className="hidden md:inline-block text-slate-600">•</span>
          <span className="hidden md:inline-block text-slate-400">
            Islandwide Delivery | Cash on Delivery (COD) Available
          </span>
        </div>

        {/* Right: Studio WhatsApp Hotline */}
        <div className="flex items-center gap-1 text-slate-300">
          <a
            href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20would%20like%20to%20inquire%20about%20your%20sarees."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Studio WhatsApp:</span>
            <span className="font-semibold text-white tracking-normal">+94 77 892 4115</span>
          </a>
        </div>
      </div>
    </div>
  );
}
