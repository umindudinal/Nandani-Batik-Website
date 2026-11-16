import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  HelpCircle,
  ChevronDown,
  Navigation,
  Globe,
  Check,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { faqs } from '../data/testimonials';
import { useCart } from '../context/CartContext';

export default function ContactPage() {
  const { navigateTo, setActivePage } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Saree Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const goToShop = () => {
    if (navigateTo) {
      navigateTo('shop');
    } else if (setActivePage) {
      setActivePage('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBridal = () => {
    if (navigateTo) {
      navigateTo('bridal');
    } else if (setActivePage) {
      setActivePage('bridal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Generate formatted WhatsApp message so the inquiry is actually delivered in real time
    const msg = encodeURIComponent(
      `Hello Nandani Batik Atelier! 🌸\n\n` +
        `New Inquiry from Website:\n` +
        `• Name: ${formData.name}\n` +
        `• Contact Phone / WhatsApp: ${formData.phone}\n` +
        (formData.email ? `• Email: ${formData.email}\n` : '') +
        `• Inquiry Nature: ${formData.subject}\n` +
        `• Message: ${formData.message}\n\n` +
        `Please assist me at your earliest convenience!`
    );

    // Open WhatsApp in a new tab
    window.open(`https://wa.me/94778924115?text=${msg}`, '_blank');
  };

  const contactPoints = [
    {
      title: 'Colombo Atelier & Saree Pavilion',
      sinhalaTitle: 'ප්‍රධාන ප්‍රදර්ශනාගාරය හා නිර්මාණ මැදිරිය',
      icon: MapPin,
      lines: [
        'No. 142 Galle Road, Moratuwa / Colombo, Sri Lanka',
        'Directly along the Galle coastal avenue. Dedicated private customer parking available.',
      ],
      actionText: 'View on Google Maps',
      actionUrl: 'https://maps.google.com/?q=Galle+Road+Moratuwa+Sri+Lanka',
    },
    {
      title: 'Personal Stylist Hotlines',
      sinhalaTitle: 'පාරිභෝගික සත්කාර හා ක්ෂණික සහය',
      icon: Phone,
      lines: [
        'WhatsApp Concierge: +94 (77) 892 4115 (Instant Swatch & Video Drapes)',
        'Showroom Direct: +94 (11) 264 5890',
        'Official Email: atelier@nandanibatik.lk',
      ],
      actionText: 'Chat on WhatsApp',
      actionUrl: 'https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20have%20an%20inquiry%20regarding%20your%20sarees.',
    },
    {
      title: 'Pavilion Viewing Hours',
      sinhalaTitle: 'විවෘත වේලාවන්',
      icon: Clock,
      lines: [
        'Monday – Saturday: 9:30 AM – 7:00 PM',
        'Sundays & Mercantile Holidays: 10:00 AM – 5:00 PM',
        'Private after-hours bridal viewings available upon prior reservation.',
      ],
    },
    {
      title: 'Worldwide Diaspora Desk',
      sinhalaTitle: 'විදේශගත ඇණවුම් හා කුරියර් සේවාව',
      icon: Globe,
      lines: [
        'Express Doorstep Delivery via DHL Express (3–5 business days).',
        'Serving brides and saree connoisseurs across Australia, UK, USA, Canada, UAE & Europe.',
        'Custom currency invoicing and video inspections available.',
      ],
    },
  ];

  return (
    <div className="bg-brand-cream min-h-screen text-stone-800 antialiased selection:bg-[#0b1a30] selection:text-white">
      {/* Editorial Header */}
      <section className="relative border-b border-stone-200/80 bg-white/70 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20 text-center">
          {/* Atelier Kicker */}
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            <span>Nandani Atelier Concierge • The Pavilion & Inquiries</span>
            <span>•</span>
            <span className="font-serif italic capitalize">පාරිභෝගික සත්කාර සේවය</span>
          </div>

          {/* Grand Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.15] mb-4 max-w-3xl mx-auto">
            Visit Our Atelier or Speak with a Stylist
          </h1>

          {/* Sinhala Subtitle */}
          <p className="font-serif italic text-base sm:text-lg text-amber-900/85 mb-6">
            නන්දනී බතික් ප්‍රධාන ප්‍රදර්ශනාගාරය සහ පාරිභෝගික සත්කාර සේවය වෙත ඔබව සාදරයෙන් පිළිගනිමු
          </p>

          {/* Lead Paragraph */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Whether you are curating a bespoke bridal trousseau, selecting a signature drape for a cultural ceremony, or arranging international DHL courier dispatch, our atelier team provides dedicated, personalized guidance with traditional Sri Lankan warmth.
          </p>

          {/* Atelier Reassurance Badges */}
          <div className="mt-8 pt-6 border-t border-stone-200/70 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              Private Bridal Appointments
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-stone-700" />
              Dedicated Customer Parking
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-700" />
              Worldwide DHL Express
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        {/* Contact Points Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {contactPoints.map((point, idx) => {
            const IconComponent = point.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-stone-400/80 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-amber-800 font-medium bg-amber-50/80 px-2.5 py-1 border border-amber-200/60">
                      Point 0{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-700">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium">
                      {point.title}
                    </h3>
                    <p className="font-serif italic text-xs text-amber-900/80 mt-0.5">
                      {point.sinhalaTitle}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs text-stone-600 font-light leading-relaxed">
                    {point.lines.map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </div>
                </div>

                {point.actionText && point.actionUrl && (
                  <div className="pt-6 mt-4 border-t border-stone-100">
                    <a
                      href={point.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-900 hover:text-amber-800 font-medium transition-colors cursor-pointer"
                    >
                      <span>{point.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Interactive Atelier Inquiry Suite */}
        <section className="bg-white border border-stone-300/80 p-8 sm:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block">
                Atelier Correspondence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                Send an Atelier Inquiry
              </h2>
              <p className="font-serif italic text-xs sm:text-sm text-amber-900/80">
                අප වෙත ඔබගේ විමසීම යොමු කරන්න — අපගේ ශිල්පීන් කඩිනමින් ඔබ හා සම්බන්ධ වනු ඇත
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-stone-50 border border-stone-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#0b1a30] text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-2" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-stone-900 font-medium">
                    Thank You, {formData.name}
                  </h4>
                  <p className="text-xs text-stone-600 font-light max-w-md mx-auto leading-relaxed">
                    Your inquiry has been prepared for WhatsApp dispatch. Our saree stylist will attend to your color palette and requirements promptly.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'General Saree Inquiry',
                        message: '',
                      });
                    }}
                    className="text-xs uppercase tracking-widest text-stone-700 hover:text-stone-900 underline font-medium cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Dilini Samarasekara"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="e.g. 077 892 4115"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="e.g. name@example.com"
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                      Nature of Inquiry
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none"
                    >
                      <option value="General Saree Inquiry">General Saree Inquiry (සාමාන්‍ය විමසීම්)</option>
                      <option value="Bespoke Bridal / Kandyan Osariya">Bespoke Bridal / Kandyan Osariya (මංගල ඔසරි)</option>
                      <option value="Bridesmaid Group Coordination">Bridesmaid Troupe Coordination (දෙවෙනි මනමාලියන්)</option>
                      <option value="Overseas DHL Shipping">Overseas Courier Shipping (DHL විදේශගත ඇණවුම්)</option>
                      <option value="Saree Care & Restoration">Saree Care & Preservation (සත්කාර උපදෙස්)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                    Your Message / Saree Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us about the sarees you are interested in, wedding colors, or specific event dates..."
                    className="w-full bg-white border border-stone-300 rounded-none px-3.5 py-2.5 text-stone-800 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#0b1a30] hover:bg-stone-800 text-white py-3.5 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Send Inquiry to Nandani Atelier via WhatsApp</span>
                  </button>
                  <p className="text-[10px] text-stone-400 text-center font-light mt-2">
                    Direct connection to our senior saree consultants • Instant response during atelier hours
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-1">
              Atelier Guidance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              Frequently Inquired Details
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              පාරිභෝගිකයින් නිතර විමසන ප්‍රශ්න සහ පිළිතුරු
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 divide-y max-w-3xl mx-auto shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-5 sm:p-6 transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="font-serif text-sm sm:text-base text-stone-900 group-hover:text-stone-600 transition-colors font-medium">
                      {faq.question}
                    </span>
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
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Concierge Interlude */}
        <section className="bg-white border border-stone-300/80 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full border border-stone-200 mx-auto flex items-center justify-center text-stone-700 bg-stone-50">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block">
              Atelier Collections
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
              Experience the Craftsmanship of Ceylon
            </h3>
            <p className="text-xs text-stone-500 font-light max-w-lg mx-auto pt-1 leading-relaxed">
              Discover our latest collection of handcrafted pure silk, bridal Kandyan Osariyas, and breathable handloom cotton sarees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={goToShop}
              className="w-full sm:w-auto bg-[#0b1a30] hover:bg-stone-800 text-white px-7 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore Saree Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={goToBridal}
              className="w-full sm:w-auto border border-stone-300 hover:border-stone-900 text-stone-800 px-6 py-3 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Bridal & Bespoke Atelier</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
