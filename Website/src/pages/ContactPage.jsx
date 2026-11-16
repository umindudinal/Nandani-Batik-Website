import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Building,
  Send,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { faqs } from '../data/testimonials';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b1a30] mt-3 mb-2">
            Visit Our Showroom or Inquire Online
          </h1>
          <p className="text-sm text-slate-500">
            නන්දනී බතික් ප්‍රධාන ප්‍රදර්ශනාගාරය වෙත ඔබව සාදරයෙන් පිළිගනිමු
          </p>
        </div>

        {/* Info Grid & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Showroom Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0b1a30]">
                    Main Saree Pavilion
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    No. 142 Galle Road, Moratuwa / Colombo, Sri Lanka
                  </p>
                  <p className="text-[11px] text-amber-800 font-semibold mt-1">
                    (Parking available for customers)
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0b1a30]">
                    Direct Customer Hotlines
                  </h3>
                  <div className="text-xs space-y-1 mt-1 text-slate-700">
                    <p>
                      WhatsApp: <strong className="text-emerald-700 font-semibold">+94 77 892 4115</strong>
                    </p>
                    <p>
                      Showroom Tel: <strong className="text-slate-900">+94 11 264 5890</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0b1a30]">
                    Boutique Hours
                  </h3>
                  <div className="text-xs text-slate-600 space-y-0.5 mt-1">
                    <p>Monday – Saturday: 9:30 AM – 7:00 PM</p>
                    <p>Sunday & Mercantile Holidays: 10:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action Banner */}
            <div className="p-5 rounded-3xl bg-emerald-600 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Need Instant Assistance?</h4>
                <p className="text-xs text-emerald-100">Direct chat with our saree team</p>
              </div>
              <a
                href="https://wa.me/94778924115?text=Hello%20Nandani%20Batik,%20I%20have%20a%20question%20regarding%20your%20sarees."
                target="_blank"
                rel="noreferrer"
                className="bg-white text-emerald-700 p-2.5 rounded-2xl hover:bg-emerald-50 transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-[#0b1a30] mb-1">
              Send Us a Message
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Inquire about saree availability, international courier shipping, or custom orders
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2 border border-emerald-200">
                <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                <p className="text-xs">
                  Thank you, {formData.name}. Our saree consultant will respond via WhatsApp or email within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-800 underline"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Kasun Fernando"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="e.g. 077 892 4115"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="e.g. name@example.com"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none bg-white"
                    >
                      <option value="General Inquiry">General Saree Inquiry</option>
                      <option value="Custom Bridal Troupe">Custom Bridal / Troupe Order</option>
                      <option value="Overseas Delivery">Overseas Shipping (DHL)</option>
                      <option value="Exchange / Saree Care">Exchange or Saree Care</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Your Message / Saree Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us about the sarees you are interested in, colors, or your wedding date..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0b1a30] hover:bg-brand-blue-800 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Send Message to Nandani Batik</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0b1a30]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 font-semibold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
