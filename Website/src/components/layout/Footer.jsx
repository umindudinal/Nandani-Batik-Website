import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../common/BrandIcons';

export default function Footer({ setActivePage, setSelectedCategory }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handlePageClick = (pageId, catId = null) => {
    if (catId && setSelectedCategory) {
      setSelectedCategory(catId);
    }
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#071120] text-stone-300 pt-16 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Heritage Reassurance Strip (Clean, understated luxury - no chunky colored boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-stone-800/80 text-xs text-stone-400">
          <div className="flex items-center gap-3.5">
            <span className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-amber-300/90 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-stone-200 uppercase tracking-wider text-[11px]">
                Authentic Ceylon Batik
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Individually hand-waxed & dyed by skilled Sri Lankan artisans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-amber-300/90 shrink-0">
              <Truck className="w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-stone-200 uppercase tracking-wider text-[11px]">
                Islandwide Doorstep Delivery
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Cash on delivery & secure express shipping across Sri Lanka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-amber-300/90 shrink-0">
              <RotateCcw className="w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-stone-200 uppercase tracking-wider text-[11px]">
                Artisan Quality Assurance
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Carefully inspected for flawless drape, fast colors & fabric purity
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14">
          {/* Brand Info & Newsletter (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-300/30 bg-white shrink-0">
                <img
                  src="/nandani-logo.jpg"
                  alt="Nandani Batik"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-xl tracking-wider text-white font-medium block">
                  NANDANI BATIK
                </span>
                <span className="text-[10px] tracking-widest uppercase text-amber-200/80 font-sans block">
                  Handcrafted Saree Atelier • Sri Lanka
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md font-light">
              Nandani Batik celebrates the timeless elegance of Sri Lankan textile artistry. We craft authentic pure silk, handloom cotton, and ceremonial bridal sarees with hot beeswax, immersion dyes, and dedicated master artisans.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-md">
              <span className="text-[11px] uppercase tracking-widest text-stone-300 font-medium block mb-2">
                Atelier Journal & New Arrivals
              </span>
              <p className="text-[11px] text-stone-400 mb-3 font-light">
                Receive private previews of limited-edition sarees and bespoke bridal releases.
              </p>

              {subscribed ? (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400 py-2">
                  <Check className="w-4 h-4" />
                  <span>Thank you for joining our atelier circle.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex items-center border-b border-stone-700 pb-1.5 transition-colors"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="text-xs uppercase tracking-widest text-amber-300 hover:text-white transition-colors shrink-0 font-medium flex items-center gap-1 ml-2"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Saree Collections Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-200">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button
                  onClick={() => handlePageClick('shop', 'normal-voil')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Normal Voil Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('shop', 'super-voil')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Super Voil Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('shop', 'cotton-batik')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Cotton Batik Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('shop', 'silk-batik')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Silk Batik Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('bridal')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Bespoke Bridal Sarees
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Concierge Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-200">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button
                  onClick={() => handlePageClick('care')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Saree Care & Washing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('about')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Our Artisan Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Islandwide Delivery & COD
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Exchange & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('bridal')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Bridal Troupe Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Contact Atelier
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Contact & Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-200">
              Atelier & Concierge
            </h3>
            <ul className="space-y-3 text-xs text-stone-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300/80 shrink-0 mt-0.5" />
                <span>Nandani Batik Studio, Galle Road, Colombo / Moratuwa, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
                <a href="tel:+94778924115" className="hover:text-white transition-colors">
                  +94 77 892 4115
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
                <a href="mailto:info@nandanibatik.lk" className="hover:text-white transition-colors">
                  info@nandanibatik.lk
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-amber-300/80 shrink-0 mt-0.5" />
                <span>Mon – Sat: 9:30 AM – 6:30 PM<br />Sunday: By Appointment</span>
              </li>
            </ul>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-700 hover:border-amber-300 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-700 hover:border-amber-300 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/94778924115"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-700 hover:border-amber-300 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Concierge"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Payment Mentions */}
        <div className="pt-8 border-t border-stone-800 text-[11px] text-stone-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} <span className="text-stone-300 font-medium">Nandani Batik Atelier</span>. All rights reserved. Handcrafted in Sri Lanka.
          </div>

          <div className="flex items-center gap-3 text-stone-400 text-[11px] flex-wrap justify-center">
            <span>Cash on Delivery (COD)</span>
            <span className="text-stone-700">•</span>
            <span>Direct Bank Transfer</span>
            <span className="text-stone-700">•</span>
            <span>Visa & MasterCard</span>
            <span className="text-stone-700">•</span>
            <span>Koko & Mintpay Installments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
