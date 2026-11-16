import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik!%20I%20would%20like%20to%20inquire%20about%20your%20batik%20sarees."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        title="Chat with Nandani Batik on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
      </a>
    </div>
  );
}
