import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Feather,
  Droplets,
  Flame,
  Wind,
  Layers,
  Users,
  ArrowRight,
  MessageCircle,
  Heart,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import bg_1 from '../assets/images/sarees/saree 1.2.png';
import bg_2 from '../assets/images/sarees/saree 3.1.png';

export default function AboutPage({ setActivePage }) {
  const { navigateTo } = useCart();

  const handleShopNavigation = (category = 'all') => {
    if (navigateTo) {
      navigateTo('shop', category);
    } else if (setActivePage) {
      setActivePage('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBridalNavigation = () => {
    if (navigateTo) {
      navigateTo('bridal');
    } else if (setActivePage) {
      setActivePage('bridal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      num: '01',
      title: 'Molten Wax & The Canting Pen',
      sinhala: 'උණු කළ මී ඉටි හා කැන්ටින් උපකරණයෙන් සිත්තම් කිරීම',
      body: 'Our master illustrators draw freehand on raw mulberry silk using hot beeswax and paraffin. Flowing from brass canting pens, the molten wax penetrates deep into the natural fibers to create an impenetrable barrier that resists subsequent dyes.',
      tag: 'Freehand Illustration',
    },
    {
      num: '02',
      title: 'Cold Reactive Dye Bath',
      sinhala: 'ප්‍රතික්‍රියාශීලී සායම් ස්නානය',
      body: 'The waxed silk is carefully immersed in temperature-regulated cold reactive dyes. Because wax would melt in hot water, cold-bath chemistry is essential, bonding molecularly with silk proteins to guarantee permanent, unfading color depth.',
      tag: 'Fiber-Reactive Alchemy',
    },
    {
      num: '03',
      title: 'The Signature Wax Crackle',
      sinhala: 'අනන්‍ය බතික් ක්‍රැකල් (Crackle Veining) රටා',
      body: 'The cooled wax is hand-cracked in controlled patterns before the next dye bath. Fine micro-fissures allow the darker dye to seep through, creating the delicate marble-like veins that define authentic Ceylon wax batik and make every piece impossible to duplicate.',
      tag: 'Inimitable Veining',
    },
    {
      num: '04',
      title: 'The Dewaxing & River Rinse',
      sinhala: 'උණු වතුරෙන් ඉටි ඉවත් කර සේදීම',
      body: 'Finally, the saree is submerged in rolling cauldrons of boiling water to release every trace of wax. Once cleansed and rinsed in pure water, the saree reveals its soft, featherlight handfeel and breathtaking, vibrant motifs.',
      tag: 'Purity & Luster',
    },
  ];

  const pillars = [
    {
      title: '100% Hand-Drawn Wax Resist',
      sinhala: 'මුළුමනින්ම අතින් අඳින ලද සැබෑ ඉටි බතික්',
      description:
        'We never use machine roller prints or digital screen transfers. Every line, swirl, and border is drawn by human hands, carrying the breath and soul of Sri Lankan craftsmanship.',
    },
    {
      title: 'Pure Natural Fibers Only',
      sinhala: 'ස්වභාවික මල්බෙරි සිල්ක් සහ දේශීය අත්යන්ත්‍ර කපු',
      description:
        'We reject synthetic polyester blends. Our canvases are pure mulberry silk, tussar silk, and Ceylon combed handloom cotton that breathe naturally in tropical heat.',
    },
    {
      title: 'Sustaining Female Artisan Clusters',
      sinhala: 'ග්‍රාමීය කාන්තා ශිල්පිනියන් සවිබල ගැන්වීම',
      description:
        'Over 70% of our batik illustrators and dyers are women from rural cottage communities. We ensure dignified working environments, fair living wages, and generational skill transfer.',
    },
    {
      title: 'Heirlooms Crafted to Endure',
      sinhala: 'පරපුරෙන් පරපුරට උරුම වන සදාතනික වටිනාකම',
      description:
        'A Nandani saree is not designed for a fleeting season. Our reactive dye bonds and hand-finished hems ensure these drapes will be worn by mothers and cherished by daughters.',
    },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen text-stone-800 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Editorial Header / Hero */}
      <section className="relative border-b border-stone-200/80 bg-white/70 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20 text-center">
          {/* Atelier Kicker */}
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            <span>Nandani Batik Atelier • Est. in Ceylon</span>
            <span>•</span>
            <span className="font-serif italic capitalize">අපගේ ඉතිහාසය හා ශිල්පීය උරුමය</span>
          </div>

          {/* Grand Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.15] mb-4 max-w-3xl mx-auto">
            The Living Art of Ceylon Wax Batik
          </h1>

          {/* Sinhala Subtitle */}
          <p className="font-serif italic text-base sm:text-lg text-amber-900/85 mb-6">
            නන්දනී බතික් — ශ්‍රී ලාංකික කාන්තා අභිමානය සහ පරපුරක හස්ත කර්මාන්ත විශිෂ්ටත්වය
          </p>

          {/* Lead Paragraph */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            In an era flooded with machine-printed synthetic polyesters, Nandani Batik preserves the sacred patience of authentic wax-resist textile art. Every drape begins as virgin natural silk or handspun Ceylon cotton, transformed by master artisans through hot molten beeswax, brass canting pens, and generational intuition.
          </p>

          {/* Heritage Seals */}
          <div className="mt-8 pt-6 border-t border-stone-200/70 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              100% Hand-Drawn Wax
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-stone-700" />
              Pure Silk & Handloom Cotton
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-stone-700" />
              Ethically Handcrafted
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 sm:space-y-28">
        {/* SECTION 1: Editorial Split — Story & Brand Seal */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Portrait Image Showcase with Luxury Frame */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden border border-stone-300/80 shadow-md">
              <img
                src={bg_1}
                alt="Handcrafted Nandani Batik Saree in Sri Lanka"
                className="w-full h-full object-cover object-top filter contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-[11px] font-light tracking-wide bg-black/40 backdrop-blur-xs p-2.5 border border-white/20">
                <span className="font-serif italic block text-amber-200 text-xs">
                  The Handloom Atelier
                </span>
                Pure Mulberry silk with hand-drawn beeswax flora
              </div>
            </div>

            {/* Circular Atelier Seal Accent */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white border border-stone-200 shadow-lg p-1.5 hidden sm:flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-stone-300 flex flex-col items-center justify-center text-center p-1 bg-[#faf8f5]">
                <span className="font-serif text-[9px] font-semibold tracking-wider text-stone-900 leading-none">
                  NANDANI
                </span>
                <span className="text-[7px] uppercase tracking-widest text-amber-800 font-sans mt-0.5">
                  CEYLON
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block">
                The Atelier Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 leading-snug">
                Why Authentic Wax Batik Is Irreplaceable
              </h2>
              <p className="font-serif italic text-xs sm:text-sm text-amber-900/80">
                යන්ත්‍රයකට කිසිදා කළ නොහැකි දෑතේ නිමැවුමක අසිරිය
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              <p>
                When you drape a Nandani saree, you are wearing an original oil-and-dye painting created over dozens of hours. Unlike flat industrial printing, authentic wax-resist batik penetrates through both sides of the fabric, ensuring that the back of the saree mirrors the radiant richness of the front.
              </p>
              <p>
                The distinctive micro-crackle veins running through our motifs are born from the natural flexing of dried beeswax during cold dyeing. No two sarees can ever be identical; every single piece holds subtle, unrepeatable variations that serve as the fingerprint of its maker.
              </p>
              <p>
                From bespoke Kandyan Osariyas for brides walking down the poruwa to featherweight handloom cottons for daily grace, our creations carry forward a proud legacy of Sri Lankan cultural identity.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleShopNavigation('all')}
                className="bg-[#0b1a30] hover:bg-stone-800 text-white px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>View Atelier Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>

              <button
                onClick={handleBridalNavigation}
                className="border border-stone-300 hover:border-stone-900 text-stone-800 px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
              >
                Bridal & Osariya
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: The 4 Stages of the Craft (The Artisan Process) */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Atelier Craftsmanship
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              The Four Stages of Creation
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              අමු සේද රෙදි කඩක සිට පරිපූර්ණ බතික් සාරියක් දක්වා වන නිර්මාණ ක්‍රියාවලිය
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 border border-stone-200/90 hover:border-stone-400/80 transition-colors flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="font-serif text-3xl font-light text-stone-300">
                      {step.num}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-amber-800 font-medium bg-amber-50/80 px-2.5 py-1 border border-amber-200/60">
                      {step.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium">
                      {step.title}
                    </h3>
                    <p className="font-serif italic text-xs text-amber-900/75 mt-0.5">
                      {step.sinhala}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Visual Editorial Interlude — Bridal Heritage */}
        <section className="relative bg-[#0b1a30] text-white overflow-hidden p-8 sm:p-14 border border-stone-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold block">
                Bridal & Ceremonial Legacy
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
                Bespoke Bridal Drapes & Kandyan Osariya
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-amber-200/80">
                ඔබේ මංගල දිනයට අනන්‍ය වූ සුවිශේෂී බතික් ඔසරියක්
              </p>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl pt-1">
                For over a decade, Nandani Batik has hand-crafted bespoke wedding sarees for brides seeking deep cultural authenticity. Each bridal ensemble is custom-dyed to harmonize with traditional Nilame attires, bridal jewelry, and floral themes.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleBridalNavigation}
                  className="bg-white hover:bg-stone-100 text-[#0b1a30] px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Bridal Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-900" />
                </button>
              </div>
            </div>

            <div className="md:col-span-5 relative">
              <div className="aspect-[4/5] bg-stone-900 overflow-hidden border border-white/20 shadow-lg">
                <img
                  src={bg_2}
                  alt="Nandani Batik Bridal Saree"
                  className="w-full h-full object-cover object-top filter brightness-95"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: The Nandani Atelier Pledge (Authentic Values) */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Ethical Standards
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              The Atelier Pledge
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              අපගේ ශිල්පීය ප්‍රමිතිය සහ සාරධර්ම
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3"
              >
                <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-800">
                  <Check className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-stone-900 font-medium">
                    {pillar.title}
                  </h3>
                  <p className="font-serif italic text-xs text-amber-900/75 mt-0.5">
                    {pillar.sinhala}
                  </p>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Master Artisan Quote & WhatsApp Concierge */}
        <section className="bg-white border border-stone-300/80 p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {/* Brand Seal */}
          <div className="w-16 h-16 rounded-full border-2 border-stone-300 mx-auto overflow-hidden shadow-xs">
            <img
              src="/nandani-logo.jpg"
              alt="Nandani Batik Seal"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quotation */}
          <blockquote className="space-y-3 max-w-xl mx-auto">
            <p className="font-serif italic text-base sm:text-lg text-stone-900 leading-relaxed">
              "බතික් සාරියක් යනු හුදෙක් ඇඳුමක් පමණක් නොවේ; එය ලාංකික ශිල්පිනියකගේ ඉවසීම, දහඩිය සහ හදවතේ නිර්මාණශීලීත්වය කැටි වූ ජීවමාන සිත්තමකි."
            </p>
            <cite className="block text-xs uppercase tracking-[0.2em] text-stone-500 font-medium not-italic">
              — The Master Artisans of Nandani Batik
            </cite>
          </blockquote>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20would%20like%20to%20learn%20more%20about%20your%20handcrafted%20sarees%20and%20heritage."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#0b1a30] hover:bg-stone-800 text-white px-7 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Inquire with Our Atelier on WhatsApp</span>
            </a>

            <button
              onClick={() => handleShopNavigation('all')}
              className="w-full sm:w-auto border border-stone-300 hover:border-stone-900 text-stone-800 px-6 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
