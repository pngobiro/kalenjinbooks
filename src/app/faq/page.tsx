'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const faqs = [
    {
        category: "Ordering & Shipping",
        questions: [
            {
                q: "Do you ship internationally?",
                a: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary depending on your location. You can see the exact shipping cost at checkout."
            },
            {
                q: "How long will it take to receive my order?",
                a: "For orders within Kenya, delivery typically takes 2-3 business days. International orders usually arrive within 7-14 business days. You will receive a tracking number once your order has been dispatched."
            },
            {
                q: "Can I change my shipping address after placing an order?",
                a: "If your order hasn't been shipped yet, we can update the address. Please contact our support team immediately at hello@afrireads.com with your order number."
            }
        ]
    },
    {
        category: "Digital Books & Access",
        questions: [
            {
                q: "How do I access my purchased e-books?",
                a: "After purchase, you can access your e-books immediately in your 'My Library' section. For permanent purchases, you can also download the PDF file."
            },
            {
                q: "What is the difference between Permanent Purchase and 24-Hour Access?",
                a: "Permanent Purchase gives you lifetime ownership of the book and allows you to download the PDF. 24-Hour Access lets you read the book online for one day at a significantly lower price, but you cannot download it."
            },
            {
                q: "Can I print the PDF books?",
                a: "Yes, our PDF books are print-friendly for personal use. However, redistribution or commercial printing is strictly prohibited."
            }
        ]
    },
    {
        category: "For Authors",
        questions: [
            {
                q: "How can I publish my book on AfriReads?",
                a: "We love discovering new talent! Visit our 'Authors' page to create an account and submit your manuscript. Our editorial team reviews all submissions within 2 weeks."
            },
            {
                q: "What royalties do authors receive?",
                a: "We offer competitive royalty rates of up to 70% for e-books and 50% for print books. Detailed terms are provided in the author agreement upon acceptance."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>("0-0");

    const toggleFAQ = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading mb-6">Frequently Asked Questions</h1>
                    <p className="text-xl text-neutral-brown-700 max-w-2xl mx-auto mb-8">
                        Everything you need to know about AfriReads, shipping, and our books.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={20} />
                    </div>
                </div>

                <div className="space-y-12">
                    {faqs.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6 border-b border-neutral-brown-200 pb-2">
                                {section.category}
                            </h2>
                            <div className="space-y-4">
                                {section.questions.map((faq, faqIndex) => {
                                    const id = `${sectionIndex}-${faqIndex}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div
                                            key={faqIndex}
                                            className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${isOpen ? 'border-primary shadow-md' : 'border-neutral-brown-500/10 hover:border-primary/30'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleFAQ(id)}
                                                className="w-full flex items-center justify-between p-6 text-left font-bold text-neutral-brown-900 hover:text-primary transition-colors"
                                            >
                                                <span className="text-lg">{faq.q}</span>
                                                {isOpen ? <ChevronUp className="text-primary shrink-0" /> : <ChevronDown className="text-neutral-brown-400 shrink-0" />}
                                            </button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="p-6 pt-0 text-neutral-brown-700 leading-relaxed border-t border-dashed border-neutral-brown-100">
                                                    {faq.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-20 text-center bg-white p-10 rounded-3xl shadow-lg border border-neutral-brown-500/10">
                    <h3 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-4">Still have questions?</h3>
                    <p className="text-neutral-brown-600 mb-8 max-w-xl mx-auto">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </div>
    );
}
