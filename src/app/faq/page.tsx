'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Book } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    category: "Ordering & Shipping",
    questions: [
      { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide. Shipping costs vary by location." },
      { q: "How long will delivery take?", a: "Kenya: 2-3 business days. International: 7-14 business days." },
      { q: "Can I change my shipping address?", a: "Yes, if not shipped yet. Contact us at hello@afrireads.com." },
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
      { q: "How can I publish on AfriReads?", a: "Create an author account and submit your manuscript. We review within 2 weeks." },
      { q: "What royalties do authors receive?", a: "Up to 70% for e-books and 50% for print books." },
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">FAQ</h1>
          <p className="text-lg text-neutral-brown-600 max-w-xl mx-auto">
            Everything you need to know about AfriReads
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
                  const isOpen = openIndex === id;

                  return (
                    <div key={faqIndex} className={`bg-white rounded-xl overflow-hidden border transition-all ${isOpen ? 'border-primary shadow-md' : 'border-neutral-brown-200'}`}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-4 text-left font-semibold text-neutral-brown-900 hover:text-primary transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="text-primary" size={20} /> : <ChevronDown className="text-neutral-brown-400" size={20} />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-neutral-brown-600 text-sm border-t border-neutral-brown-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg mt-12">
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">Still have questions?</h3>
            <p className="text-neutral-brown-600 mb-6">Can't find what you're looking for? Contact us.</p>
            <Link href="/contact" className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all inline-block">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
