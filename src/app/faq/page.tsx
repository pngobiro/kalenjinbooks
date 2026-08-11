'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const faqs = [
  {
    category: "Ordering & Shipping",
    questions: [
      { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide. Shipping costs vary by location." },
      { q: "How long will delivery take?", a: "Kenya: 2-3 business days. International: 7-14 business days." },
      { q: "Can I change my shipping address?", a: "Yes, if not shipped yet. Contact us at hello@kaleereads.com." },
    ]
  },
  {
    category: "Digital Books",
    questions: [
      { q: "How do I access my e-books?", a: "After purchase, access them in 'My Library'. Permanent purchases include PDF download." },
      { q: "What's the difference between Permanent and 24-Hour Access?", a: "Permanent: lifetime ownership + PDF download. 24-Hour: read online for one day at lower price." },
      { q: "Can I print PDF books?", a: "Yes, for personal use. Commercial printing is prohibited." },
    ]
  },
  {
    category: "For Authors",
    questions: [
      { q: "How can I publish on KaleeReads?", a: "Create an author account and submit your manuscript. We review within 2 weeks." },
      { q: "What royalties do authors receive?", a: "Authors keep up to 70% of sales revenue." },
    ]
  }
];

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [a]);

  return (
    <div className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${isOpen ? 'border-primary shadow-md' : 'border-neutral-brown-200'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-neutral-brown-900 hover:text-primary transition-colors"
        aria-expanded={isOpen}
      >
        <span className="pr-4">{q}</span>
        <span className="flex-shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown className={`transition-colors ${isOpen ? 'text-primary' : 'text-neutral-brown-400'}`} size={20} />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${height}px` : '0px' }}
      >
        <div ref={contentRef} className="px-5 pb-5 text-neutral-brown-600 text-sm border-t border-neutral-brown-100 pt-4">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  return (
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">FAQ</h1>
          <p className="text-lg text-neutral-brown-600 max-w-xl mx-auto">
            Everything you need to know about KaleeReads
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-10">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 pb-2 border-b border-neutral-brown-200">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((faq, faqIndex) => {
                  const id = `${sectionIndex}-${faqIndex}`;
                  return (
                    <AccordionItem
                      key={faqIndex}
                      q={faq.q}
                      a={faq.a}
                      isOpen={openIndex === id}
                      onToggle={() => setOpenIndex(openIndex === id ? null : id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg mt-12">
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">Still have questions?</h3>
            <p className="text-neutral-brown-600 mb-6">Can&apos;t find what you&apos;re looking for? Contact us.</p>
            <a href="/contact" className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all inline-block">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
