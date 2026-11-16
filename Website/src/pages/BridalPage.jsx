import React, { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  Heart,
  Check,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  Palette,
  Scissors,
  Phone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import SareeCard from '../components/sarees/SareeCard';
import bg_2 from '../assets/images/sarees/saree 5.1.png';

export default function BridalPage({ setActivePage }) {
  const { sarees, navigateTo } = useCart();
  const [troupeType, setTroupeType] = useState('kandyan-osariya');
  const [troupeSize, setTroupeSize] = useState('4');
  const [weddingDate, setWeddingDate] = useState('');
  const [colorTheme, setColorTheme] = useState('Champagne Gold & Royal Navy');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const goToShop = () => {
    if (navigateTo) {
      navigateTo('shop', 'bridal-kandyan');
    } else if (setActivePage) {
      setActivePage('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find bridal sarees or fall back gracefully to silk pieces
  const bridalSarees = sarees.filter(
    (s) =>
      s.category === 'bridal-kandyan' ||
      s.category === 'bridal' ||
      (Array.isArray(s.tags) && (s.tags.includes('Bridal Collection') || s.tags.includes('Bridal')))
  );
  const displayedSarees = bridalSarees.length > 0 ? bridalSarees : sarees.slice(0, 3);

  const handleConsultation = (e) => {
    e.preventDefault();
    const typeLabels = {
      'kandyan-osariya': 'Traditional Kandyan Osariya (උඩරට මංගල ඔසරිය)',
      'reception-saree': 'Going-Away / Reception Drape (දෙවන ගමන සාරිය)',
      'bridesmaid-troupe': 'Synchronized Bridesmaid Troupe (දෙවෙනි මනමාලියන්)',
      'full-bridal-package': 'Full Bridal Ensemble (Bride + Bridesmaids)',
    };

    const msg = encodeURIComponent(
      `Hello Nandani Batik Bridal Atelier! 🌸\n\n` +
        `I would like to book a Bespoke Bridal Consultation for our upcoming wedding:\n\n` +
        `• Wedding / Event Date: ${weddingDate || 'To be decided'}\n` +
        `• Attire Type: ${typeLabels[troupeType] || troupeType}\n` +
        `• Number of Sarees (Troupe Size): ${troupeSize} Saree(s)\n` +
        `• Color Inspiration / Theme: ${colorTheme}\n` +
        (additionalNotes.trim() ? `• Special Requests / Notes: ${additionalNotes}\n` : '') +
        `\nPlease let me know how we can proceed with color swatches or schedule an atelier meeting!`
    );
    window.open(`https://wa.me/94778924115?text=${msg}`, '_blank');
  };

  const silhouettes = [
    {
      title: 'The Royal Kandyan Osariya',
      sinhalaTitle: 'රාජකීය උඩරට මංගල ඔසරිය',
      description:
        'Crafted with the traditional scalloped frill (නෙරිය), majestic worked pallu (පොට), and ornamental borders engineered to frame traditional 7-malaya necklaces and padakkam jewelry with flawless balance.',
      fabrics: 'Pure Mulberry Silk & Heavy Raw Silk',
      leadTime: '4 to 6 Weeks',
      highlight: 'Tailored for Traditional Poruwa Ceremonies',
    },
    {
      title: 'Modern Reception & Going-Away',
      sinhalaTitle: 'දෙවන ගමන සහ රිසෙප්ෂන් සාරි',
      description:
        'Fluid, luminous drapes featuring rich jewel tones (Maroon, Emerald, Champagne, Royal Sapphire) and signature crackle wax veining for the evening celebration and homecoming reception.',
      fabrics: 'Pure Silk Georgette & Tussar Silk',
      leadTime: '3 to 5 Weeks',
      highlight: 'Dramatic Flow & Contemporary Elegance',
    },
    {
      title: 'Synchronized Bridesmaid Troupes',
      sinhalaTitle: 'දෙවෙනි මනමාලියන්ගේ සාරි කට්ටල',
      description:
        'Custom-dyed in synchronized single-lot dye vats to ensure 100% color harmony across all 4, 6, or 8 sarees. Delivered with matching unstitched blouse fabric for each retinue member.',
      fabrics: 'Pure Ceylon Handloom Cotton or Soft Silk Blend',
      leadTime: '4 to 8 Weeks',
      highlight: 'Flawless Palette Consistency Guaranteed',
    },
  ];

  const journeySteps = [
    {
      num: '01',
      title: 'Palette & Moodboard Exchange',
      sinhala: 'මූලික සාකච්ඡාව හා වර්ණ තේරීම',
      description:
        'Share your wedding date, Nilame attire colors, invitation palette, or floral arrangements with our chief atelier stylist.',
    },
    {
      num: '02',
      title: 'Textile & Weight Selection',
      sinhala: 'සේද හෝ කපු රෙදි තෝරාගැනීම',
      description:
        'Select between pure Mulberry silk, raw silk, Tussar, or fine Ceylon handloom cotton depending on your desired drape and ceremony setting.',
    },
    {
      num: '03',
      title: 'Custom Swatch & Motif Approval',
      sinhala: 'වර්ණ සාම්පල අනුමත කරගැනීම',
      description:
        'We prepare physical or high-definition video color swatches dyed with fiber-reactive pigments for your personal sign-off before full waxing begins.',
    },
    {
      num: '04',
      title: '14 to 21 Days of Artisan Immersion',
      sinhala: 'අතින් ඉටි ඇඳීම හා සායම් ස්නානය',
      description:
        'Our master women artisans draw every motif freehand with molten beeswax and immerse the fabric through multiple temperature-controlled dye baths.',
    },
    {
      num: '05',
      title: 'Atelier Inspection & Gift Box Delivery',
      sinhala: 'අවසන් නිමාව හා සුරක්ෂිතව බෙදාහැරීම',
      description:
        'Delicately steamed, folded in breathable muslin inside signature Nandani keepsake gift boxes, and delivered safely to your doorstep islandwide or worldwide.',
    },
  ];

  return (
    <div className="bg-brand-cream min-h-screen text-stone-800 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Editorial Bridal Hero */}
      <section className="relative border-b border-stone-200/80 bg-white/70 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Atelier Kicker */}
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                <span>Nandani Bridal Atelier • Bespoke Commissions</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline font-serif italic capitalize">
                  මංගල බතික් ඔසරි හා සාරි
                </span>
              </div>

              {/* Grand Title */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.12]">
                Bespoke Bridal & Kandyan Osariya
              </h1>

              {/* Sinhala Subtitle */}
              <p className="font-serif italic text-base sm:text-lg text-amber-900/85">
                ඔබේ සිහින මංගල දිනය රාජකීය ලාංකික බතික් කලාවෙන් සරසා ගන්න
              </p>

              {/* Lead Paragraph */}
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                A wedding is a sacred milestone of love and heritage. At Nandani Batik Atelier, every bridal drape is hand-painted with molten beeswax on pure mulberry silk, meticulously harmonized with traditional Nilame attire, wedding themes, and family traditions.
              </p>

              {/* Atelier Pillars */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[11px] uppercase tracking-wider text-stone-500 font-medium border-t border-stone-200/70">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-stone-700" />
                  Custom Dye Lot Matching
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-stone-700" />
                  Matching Blouse Fabric Included
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-stone-700" />
                  Synchronized Retinue Sets
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a
                  href="#consultation-suite"
                  className="w-full sm:w-auto bg-[#0b1a30] hover:bg-stone-800 text-white px-7 py-3 text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Book Atelier Consultation</span>
                </a>

                <button
                  onClick={goToShop}
                  className="w-full sm:w-auto border border-stone-300 hover:border-stone-900 text-stone-800 px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Bridal Drapes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Photo Frame — Authentic Sri Lankan Photoshoot Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-3/4 bg-stone-100 overflow-hidden border border-stone-300/80 shadow-lg">
                <img
                  src={bg_2}
                  alt="Nandani Batik Bespoke Bridal Saree"
                  className="w-full h-full object-cover object-top filter contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-[11px] font-light tracking-wide bg-black/40 backdrop-blur-xs p-3 border border-white/20">
                  <span className="font-serif italic block text-amber-200 text-xs">
                    The Bridal Atelier
                  </span>
                  Handcrafted Kandyan Osariya in Pure Mulberry Silk
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 sm:space-y-28">
        {/* SECTION 1: The Three Grand Bridal Traditions */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Atelier Silhouettes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              The Three Bridal Traditions
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              ඔබේ මංගල උත්සවයේ එක් එක් අවස්ථාව සඳහා විශේෂිත වූ නිර්මාණ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {silhouettes.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 border border-stone-200/90 hover:border-stone-400/80 transition-colors flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-amber-800 font-medium bg-amber-50/90 px-2.5 py-1 border border-amber-200/60 inline-block">
                    {item.highlight}
                  </span>

                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium">
                      {item.title}
                    </h3>
                    <p className="font-serif italic text-xs text-amber-900/80 mt-0.5">
                      {item.sinhalaTitle}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100 space-y-2 text-[11px]">
                  <div className="flex justify-between text-stone-500">
                    <span>Fabric Base:</span>
                    <span className="font-medium text-stone-800">{item.fabrics}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Atelier Lead Time:</span>
                    <span className="font-medium text-stone-800">{item.leadTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Curated Signature Bridal Pieces Showcase */}
        {displayedSarees.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
                  Atelier Showcase
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                  Signature Bridal & Ceremonial Drapes
                </h2>
                <p className="text-xs text-stone-500 font-light mt-1">
                  ස්වභාවික මල්බෙරි සිල්ක් සහ ටසර් සිල්ක් මත නිමවූ විශිෂ්ටතම සාරි
                </p>
              </div>

              <button
                onClick={goToShop}
                className="text-xs uppercase tracking-widest text-stone-800 hover:text-stone-500 transition-colors flex items-center gap-1.5 shrink-0 font-medium cursor-pointer"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedSarees.map((saree) => (
                <SareeCard key={saree.id} saree={saree} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: The 5-Step Bespoke Journey */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              The Commissioning Process
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              The Bespoke Bridal Journey
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              ඔබේ මංගල සාරිය සැලසුම් කිරීමේ සිට සුරැකිව ලැබීම දක්වා පියවර පහ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-5 border border-stone-200/90 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="font-serif text-2xl font-light text-stone-300 block mb-2">
                    {step.num}
                  </span>
                  <h4 className="font-serif text-sm text-stone-900 font-medium leading-snug">
                    {step.title}
                  </h4>
                  <p className="font-serif italic text-[11px] text-amber-900/80 mt-0.5">
                    {step.sinhala}
                  </p>
                </div>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed pt-2 border-t border-stone-100">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Interactive Bespoke Consultation Suite */}
        <section id="consultation-suite" className="scroll-mt-24">
          <div className="bg-white border border-stone-300/80 p-8 sm:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: What's Included & Atelier Notes */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
                    Personalized Service
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                    Book an Atelier Consultation
                  </h3>
                  <p className="font-serif italic text-xs sm:text-sm text-amber-900/80 mt-1">
                    අපගේ ප්‍රධාන නිර්මාණ ශිල්පීන් සමඟ සාකච්ඡා කර ඇණවුම් කරන්න
                  </p>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  We offer one-on-one bridal consultations via WhatsApp Video, telephone, or in-person swatch review. Discuss color harmonies, motif scales, and retinue coordination directly with our design team.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-stone-700">
                      <strong>Exclusive Dye Lots:</strong> Synchronized color batches for bridal troupes.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-stone-700">
                      <strong>Handcrafted Blouse Length:</strong> 1.0m to 1.5m matching fabric included with each piece.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-stone-700">
                      <strong>Lead Time Recommendation:</strong> 4 to 8 weeks for complete bridal ensembles.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-stone-700">
                      <strong>Worldwide Courier:</strong> Express DHL delivery available for diaspora brides.
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                    Direct Atelier Hotline
                  </span>
                  <a
                    href="tel:+94778924115"
                    className="font-serif text-base text-stone-900 hover:text-amber-800 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-stone-600" />
                    <span>+94 (77) 892 4115</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Refined Booking Form */}
              <div className="lg:col-span-7 bg-stone-50/70 p-6 sm:p-8 border border-stone-200/80">
                <form onSubmit={handleConsultation} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Attire Silhouette / Ceremony Type
                    </label>
                    <select
                      value={troupeType}
                      onChange={(e) => setTroupeType(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    >
                      <option value="kandyan-osariya">Traditional Kandyan Osariya (උඩරට ඔසරිය)</option>
                      <option value="reception-saree">Reception / Going-Away Drape (දෙවන ගමන)</option>
                      <option value="bridesmaid-troupe">Synchronized Bridesmaid Troupe (දෙවෙනි මනමාලියන්)</option>
                      <option value="full-bridal-package">Complete Bridal Ensemble (Bride + Troupe)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                        Wedding / Event Date
                      </label>
                      <input
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                        Number of Sarees Needed
                      </label>
                      <select
                        value={troupeSize}
                        onChange={(e) => setTroupeSize(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                      >
                        <option value="1">1 Saree (Bride Only)</option>
                        <option value="2">2 Sarees (Bride + Maid of Honor)</option>
                        <option value="4">4 Sarees (Bridal Troupe)</option>
                        <option value="6">6 Sarees (Full Retinue)</option>
                        <option value="8+">8+ Sarees (Large Wedding Party)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Preferred Color Theme or Inspiration
                    </label>
                    <input
                      type="text"
                      value={colorTheme}
                      onChange={(e) => setColorTheme(e.target.value)}
                      placeholder="e.g. Champagne Gold & Navy / Royal Maroon & Pearl Ivory"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Special Requests / Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Matching Nilame belt swatch, specific floral motif, church or poruwa details..."
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0b1a30] hover:bg-stone-800 text-white py-3.5 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Send Consultation Details via WhatsApp</span>
                  </button>
                  <p className="text-[10px] text-stone-400 text-center font-light">
                    Direct connection to Nandani Atelier Chief Stylist • No obligation to purchase
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Real Bride Testimonial & Heritage Seal */}
        <section className="bg-white border border-stone-200/90 p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border-2 border-stone-300 mx-auto overflow-hidden shadow-xs">
            <img
              src="/nandani-logo.jpg"
              alt="Nandani Batik Seal"
              className="w-full h-full object-cover"
            />
          </div>

          <blockquote className="space-y-3 max-w-xl mx-auto">
            <p className="font-serif italic text-base sm:text-lg text-stone-900 leading-relaxed">
              "අපගේ මංගල දිනයේ සියලු දෙනාගේම නෙත් සිත් ඇදගත් සුන්දරම මතකය වූයේ නන්දනී බතික් වෙතින් අපටම අනන්‍යව සායම් ගන්වා නිර්මාණය කර දුන් මෙම සුවිශේෂී ඔසරියයි."
            </p>
            <cite className="block text-xs uppercase tracking-[0.2em] text-stone-500 font-medium not-italic">
              — Dilini & Chathura • Colombo, Sri Lanka
            </cite>
          </blockquote>
        </section>
      </div>
    </div>
  );
}
