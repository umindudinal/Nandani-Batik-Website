import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Sun,
  Flame,
  Wind,
  ShieldCheck,
  Check,
  X,
  ChevronDown,
  MessageCircle,
  ArrowRight,
  Shirt,
  Feather,
  RotateCcw,
  Archive,
  HelpCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CareGuidePage() {
  const { navigateTo, setActivePage } = useCart();
  const [activeFabric, setActiveFabric] = useState('silk');
  const [openFaq, setOpenFaq] = useState(null);

  const goToShop = () => {
    if (navigateTo) {
      navigateTo('shop');
    } else if (setActivePage) {
      setActivePage('shop');
    }
  };

  const fabrics = {
    silk: {
      title: 'Pure Mulberry & Bridal Silk Batik',
      sinhalaTitle: 'මල්බෙරි සහ බ්‍රයිඩල් සේද සාරි',
      description:
        'Pure silk is a natural protein fiber that possesses incomparable drape, natural thermal balance, and a rich, soft sheen. Authentic wax crackles on silk are precious and require gentle, mindful handling.',
      laundering: 'Professional Dry Clean Recommended (or cold water dip with baby shampoo)',
      waterTemp: 'Cold water only (below 25°C)',
      ironing: 'Reverse side, low to medium heat with a damp cotton pressing cloth',
      storage: 'Breathable unbleached cotton or muslin wrap; change folds every 3–4 months',
      keyRules: [
        'Always trust high-grade dry cleaning specialists experienced with natural dyes and wax batik.',
        'If spot-cleaning at home, never rub or scrub the silk fibers. Blot gently with a dry, lint-free white cotton cloth.',
        'Never spray perfumes, hair mist, or alcohol-based deodorants directly on the fabric or zari borders.',
        'Never wring, twist, or tumble-dry. Silk loses up to 20% of its tensile strength when saturated with water.',
        'Store flat or on broad padded wooden hangers. Avoid thin wire hangers that create permanent shoulder dimples.',
      ],
    },
    cotton: {
      title: 'Ceylon Handloom & Combed Cotton',
      sinhalaTitle: 'දේශීය අත්යන්ත්‍ර හා කපු බතික් සාරි',
      description:
        'Woven on traditional Sri Lankan handlooms, our combed cotton sarees are breathable, durable, and naturally soft. Natural vegetable and reactive dyes settle deep into the cotton fibers.',
      laundering: 'Gentle hand wash in cold water (first wash with rock salt to fix dyes)',
      waterTemp: 'Cold to room temperature water',
      ironing: 'Medium-high heat while the saree is slightly damp for a crisp, regal drape',
      storage: 'Cool, well-ventilated wardrobe; avoid airtight non-breathable plastic wrappers',
      keyRules: [
        'First Wash Ritual: Soak in cold water with 1 teaspoon of rock salt (ලුණු කැට) for 10 minutes to lock the reactive dye.',
        'Always wash separately during the first two washes to prevent any surface pigment transfer.',
        'Use mild, pH-neutral detergent free from chlorine bleaching agents or optical brighteners.',
        'Dry in deep, airy shade. Avoid direct harsh tropical noon sun which dries out cotton yarn elasticity.',
        'For an authentic structured look, apply light natural rice starch during the final rinse if desired.',
      ],
    },
    georgette: {
      title: 'Georgette, Chiffon & Light Voile',
      sinhalaTitle: 'ජෝර්ජට්, ෂිෆොන් සහ සැහැල්ලු බතික් සාරි',
      description:
        'Crafted with tightly twisted fine yarns, these ethereal drapes are exceptionally lightweight and fluid. Because the weave is delicate, extra care is taken to preserve both the wax art and fabric texture.',
      laundering: 'Delicate hand dip or gentle dry clean',
      waterTemp: 'Cold water exclusively',
      ironing: 'Very low heat (Silk/Synthetic setting) without steam droplets',
      storage: 'Folded gently inside a muslin sleeve; do not hang for prolonged months to prevent stretching',
      keyRules: [
        'Never soak georgette or chiffon for more than 5 minutes to prevent fabric crinkle contraction.',
        'Use broad safety pins or saree pin guards to prevent sharp pins from tearing delicate yarns.',
        'Never steam press from zero distance; keep the steamer nozzle at least 6 inches away.',
        'Do not hang on wire hangers; the natural weight of the drape will cause the garment to stretch unevenly.',
        'Gently roll inside a clean, dry towel to absorb excess water before laying flat to dry.',
      ],
    },
  };

  const currentFabricData = fabrics[activeFabric];

  const rituals = [
    {
      roman: 'I',
      title: 'Mindful Cleansing',
      sinhala: 'සේදීම හා පිරිසිදු කිරීම',
      icon: Droplets,
      body: 'Pure silk sarees flourish with professional dry cleaning. For handloom cottons, a gentle dip in cold water with mild baby shampoo or gentle liquid soap preserves both the botanical dye vibrancy and the hand-applied beeswax veining.',
    },
    {
      roman: 'II',
      title: 'The Deep Shade Drying',
      sinhala: 'සෙවනේ වියලීම',
      icon: Wind,
      body: 'Never expose wet batik to direct tropical noon sunlight, as ultraviolet rays break down organic dye bonds and silk proteins. Roll the wet saree gently inside a clean terry towel to absorb excess moisture, then dry flat in cool, well-ventilated shade.',
    },
    {
      roman: 'III',
      title: 'Reverse Pressing Secret',
      sinhala: 'පසුපසින් අයන් කිරීම',
      icon: Flame,
      body: 'Always iron your batik saree on the reverse (inner) side. Place a clean, damp unbleached cotton pressing cloth between the iron and fabric. This shields the molten wax crackle patterns from direct heat and restores the original luster.',
    },
    {
      roman: 'IV',
      title: 'Breathing Muslin Storage',
      sinhala: 'මුස්ලින් රෙද්දක ඔතා තැබීම',
      icon: Archive,
      body: 'Discard synthetic plastic dry-cleaning bags immediately, as plastic traps humidity and causes mold in Sri Lanka’s climate. Wrap your heirloom in pure white muslin or soft cotton cloth. Refold along new crease lines every 3 to 4 months.',
    },
  ];

  const dos = [
    'Wrap each saree individually in pure, unbleached white muslin (මුස්ලින් රෙදි) or breathable cotton pouches.',
    'Apply perfume, hairspray, and body lotions at least 10 minutes before draping your saree so alcohol evaporates fully.',
    'Refold stored sarees every 3 to 4 months along fresh lines to relieve tension on the natural yarn creases.',
    'Use broad, smooth wooden or padded fabric hangers for sarees that you wear regularly.',
    'Air out your collection in a shaded, well-ventilated room or air-conditioned space twice a year during monsoon seasons.',
    'Use safety pin protectors or place a small button between the pin and the saree fabric to prevent tears.',
  ];

  const donts = [
    'Never spray perfumes, attar, or deos directly onto the saree, as alcohol dissolves reactive wax pigments and tarnishes zari.',
    'Never store sarees in sealed plastic covers, which trap tropical humidity and promote fungal mildew.',
    'Never place chemical naphthalene balls (mothballs) in direct contact with sarees; use natural cedarwood or dried neem leaves.',
    'Never wring, twist, or scrub handcrafted batik fabric with stiff brushes or washboards.',
    'Never hang heavy silk sarees on thin wire hangers that create permanent fabric distortions at the shoulders.',
    'Never iron directly on the front surface of heavy wax motifs or metallic borders without a pressing cloth.',
  ];

  const faqs = [
    {
      q: 'What should I do if curry, tea, or wine spills on my saree during an event?',
      sinhala: 'මංගල උත්සවයකදී පැල්ලමක් ඇති වුවහොත් කළ යුත්තේ කුමක්ද?',
      a: 'Act swiftly but gently. Never rub the stain, as rubbing drives the pigment deeper into the natural fibers. Blot immediately with a dry white napkin or clean tissue to absorb the liquid. If needed, dab very gently with a damp white cotton cloth dipped in cold water, working from the outside edge of the stain toward the center. Take it to a reputed dry cleaner as soon as possible and specify the nature of the stain.',
    },
    {
      q: 'How do I protect my sarees from high humidity and mildew during Sri Lankan monsoon seasons?',
      sinhala: 'මෝසම් වැසි සමයේ තෙතමනයෙන් සාරි ආරක්ෂා කරගන්නේ කෙසේද?',
      a: 'Sri Lanka’s coastal and southwestern monsoon humidity can reach over 85%, which invites mildew. Never keep wardrobes completely airtight for months. Place silica gel moisture-absorber packs or activated charcoal sachets in your wardrobe corners (away from direct contact with fabrics). Air out your sarees in an air-conditioned room or in breezy shade every 3–4 months.',
    },
    {
      q: 'Why should I avoid using traditional naphthalene balls (mothballs)?',
      sinhala: 'කපුරු බෝල (mothballs) භාවිත නොකළ යුත්තේ ඇයි?',
      a: 'Naphthalene balls release chemical gases that react with natural vegetable and reactive dyes, causing discoloration and dulling fine metallic zari threads. Instead, place dried neem leaves (කොහොඹ කොළ), dried cinnamon quills, cloves, or natural cedarwood blocks wrapped in cotton pouches inside your wardrobe corners.',
    },
    {
      q: 'Can I machine wash my casual Nandani handloom cotton batik saree?',
      sinhala: 'එදිනෙදා අඳින කපු සාරි මැෂින් එකේ සේදිය හැකිද?',
      a: 'While our handloom cotton is naturally durable, we strongly recommend gentle hand washing for the first 3 washes. If using a modern washing machine thereafter, always place the saree inside a protective laundry mesh bag, select the "Delicates" or "Hand Wash" cycle in cold water, and use a mild liquid detergent without bleach.',
    },
    {
      q: 'How do I maintain the crisp, elegant fall of a Kandyan Osariya or pleated pleats?',
      sinhala: 'ඔසරියේ රැළි සහ පල්ලුව නියමිත පරිදි තබාගන්නේ කෙසේද?',
      a: 'After wear, hang the saree on a broad padded hanger in a well-ventilated room for 4 hours to let body heat and moisture dissipate naturally before folding. Press the pleats on the reverse side with a warm iron over a damp pressing cloth. Never iron over safety pins.',
    },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen text-stone-800 antialiased">
      {/* Editorial Hero Section */}
      <section className="relative border-b border-stone-200/80 bg-white/70 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20 text-center">
          {/* Atelier Kicker */}
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            <span>The Atelier Care Handbook</span>
            <span>•</span>
            <span className="font-serif italic capitalize">හස්ත කර්මාන්ත සත්කාර උපදෙස්</span>
          </div>

          {/* Grand Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.15] mb-4 max-w-3xl mx-auto">
            Preserving Ceylon Batik Heirlooms
          </h1>

          {/* Sinhala Subtitle */}
          <p className="font-serif italic text-base sm:text-lg text-amber-900/80 mb-6">
            ඔබේ නන්දනී බතික් සාරිය පරපුරෙන් පරපුරට අලුත් ලෙස සුරැකිව තබාගැනීමේ කලාව
          </p>

          {/* Lead Paragraph */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Every Nandani saree is a living canvas of molten beeswax, hand-blended dyes, and natural woven yarns. Because authentic wax batik breathes with age, mindful laundering and proper storage will preserve its distinctive crackle veining and vibrant luster across generations.
          </p>

          {/* Heritage Reassurance Strip */}
          <div className="mt-8 pt-6 border-t border-stone-200/70 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              100% Hand-Dyed Dyes
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-stone-700" />
              Pure Natural Fibers
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-stone-700" />
              Tropical Longevity
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
        {/* SECTION 1: The 4 Core Pillars of Batik Preservation */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Atelier Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              The Four Golden Rituals
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              සෑම බතික් සාරියක් සඳහාම පොදු අත්‍යවශ්‍ය මූලධර්ම හතර
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {rituals.map((r, i) => {
              const IconComponent = r.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-7 sm:p-8 border border-stone-200/80 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-stone-400/70 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl font-light text-stone-300">
                        {r.roman}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-stone-900 font-medium">
                        {r.title}
                      </h3>
                      <p className="font-serif italic text-xs text-amber-900/70 mt-0.5">
                        {r.sinhala}
                      </p>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed pt-1">
                      {r.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: Fabric-Specific Atelier Guidance (Interactive Switcher) */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Fabric Specifics
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              Care by Textile Weave
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              ඔබගේ සාරියේ රෙදි වර්ගය තෝරා නිවැරදි උපදෙස් ලබාගන්න
            </p>
          </div>

          {/* Textile Selector Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-stone-200/60 border border-stone-300/60 rounded-full max-w-full overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFabric('silk')}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFabric === 'silk'
                    ? 'bg-[#0b1a30] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pure Silk & Bridal
              </button>
              <button
                onClick={() => setActiveFabric('cotton')}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFabric === 'cotton'
                    ? 'bg-[#0b1a30] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Handloom Cotton
              </button>
              <button
                onClick={() => setActiveFabric('georgette')}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFabric === 'georgette'
                    ? 'bg-[#0b1a30] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Georgette & Voile
              </button>
            </div>
          </div>

          {/* Active Textile Deep-Dive Card */}
          <div className="bg-white border border-stone-200/90 p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-8">
            <div className="border-b border-stone-200/70 pb-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                  {currentFabricData.title}
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-amber-900/80 mt-1">
                  {currentFabricData.sinhalaTitle}
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                Atelier Grade Care
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {currentFabricData.description}
            </p>

            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 px-5 bg-stone-50 border border-stone-200/60 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Cleaning Method
                </span>
                <span className="font-medium text-stone-800 leading-snug block">
                  {currentFabricData.laundering}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Water Temperature
                </span>
                <span className="font-medium text-stone-800 leading-snug block">
                  {currentFabricData.waterTemp}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Ironing & Pressing
                </span>
                <span className="font-medium text-stone-800 leading-snug block">
                  {currentFabricData.ironing}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Storage Method
                </span>
                <span className="font-medium text-stone-800 leading-snug block">
                  {currentFabricData.storage}
                </span>
              </div>
            </div>

            {/* Step-by-Step Directives */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-widest text-stone-900 font-semibold">
                Essential Handling Guidelines
              </h4>
              <ul className="space-y-3">
                {currentFabricData.keyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-stone-700 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-800 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: Atelier Do's & Don'ts (Editorial Split) */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Practical Reference
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              The Atelier Do's & Don'ts
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              සාරියේ වටිනාකම හා පැහැය රැකගැනීමට පිළිපැදිය යුතු සහ නොකළ යුතු දේ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Do's Column */}
            <div className="bg-white border border-stone-200/90 p-7 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200/70">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-stone-900 font-medium">
                    Atelier Practices to Embrace
                  </h3>
                  <span className="font-serif italic text-xs text-stone-500">
                    අනුගමනය කළ යුතු දේ
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-600 font-light">
                {dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Don'ts Column */}
            <div className="bg-white border border-stone-200/90 p-7 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200/70">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-stone-900 font-medium">
                    Practices to Strictly Avoid
                  </h3>
                  <span className="font-serif italic text-xs text-stone-500">
                    වැළකිය යුතු දේ
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-600 font-light">
                {donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4: Tropical Climate & Stain Emergency FAQs */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Practical Inquiries
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              Tropical Climate & Emergency Care
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              ශ්‍රී ලංකාවේ දේශගුණයට සාරි ආරක්ෂා කරගැනීම සහ හදිසි පැල්ලම් ඉවත් කිරීම
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 divide-y divide-stone-200/70 max-w-3xl mx-auto shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-5 sm:p-6 transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between text-left gap-4 cursor-pointer group"
                  >
                    <div>
                      <h4 className="font-serif text-sm sm:text-base text-stone-900 group-hover:text-stone-600 transition-colors font-medium">
                        {faq.q}
                      </h4>
                      <p className="font-serif italic text-xs text-amber-900/75 mt-0.5">
                        {faq.sinhala}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-stone-400 group-hover:text-stone-800 transition-colors">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pt-4 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-stone-100 mt-4 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Personal Atelier Consultation & Concierge Strip */}
        <section className="bg-white border border-stone-300/80 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full border border-stone-200 mx-auto flex items-center justify-center text-stone-700 bg-stone-50">
            <MessageCircle className="w-5 h-5 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block">
              Direct Artisan Guidance
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
              Have an Heirloom Nandani Saree Needing Advice?
            </h3>
            <p className="font-serif italic text-xs text-amber-900/80">
              ඔබ සතු නන්දනී සාරියක් පිළිබඳව අපගේ ශිල්පීන්ගෙන් උපදෙස් ලබාගන්න
            </p>
            <p className="text-xs text-stone-500 font-light max-w-lg mx-auto pt-1 leading-relaxed">
              If you are uncertain about laundering an older vintage piece, treating a specific stain, or preparing a bridal Osariya for storage, send our master atelier team a photo on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik%20Atelier,%20I%20have%20a%20question%20regarding%20caring%20for%20my%20saree."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#0b1a30] hover:bg-stone-800 text-white px-7 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Ask Our Master Artisan on WhatsApp</span>
            </a>

            <button
              onClick={goToShop}
              className="w-full sm:w-auto border border-stone-300 hover:border-stone-900 text-stone-800 px-6 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore Saree Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
