'use client';

import { Mail, Phone, MapPin, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
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
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading mb-4">Get in Touch</h1>
                    <p className="text-xl text-neutral-brown-700 max-w-2xl mx-auto">
                        Have a question about an order, a book suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-brown-500/10 mb-8">
                            <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6">Contact Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-brown-900 mb-1">Email Us</h3>
                                        <p className="text-neutral-brown-600 mb-1">For general inquiries:</p>
                                        <a href="mailto:hello@afrireads.com" className="text-primary font-medium hover:underline">hello@afrireads.com</a>
                                        <p className="text-neutral-brown-600 mt-2 mb-1">For author support:</p>
                                        <a href="mailto:authors@afrireads.com" className="text-primary font-medium hover:underline">authors@afrireads.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="text-accent-green" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-brown-900 mb-1">Call Us</h3>
                                        <p className="text-neutral-brown-600 mb-1">Mon-Fri from 8am to 5pm.</p>
                                        <a href="tel:+254700000000" className="text-accent-green font-medium hover:underline">+254 700 000 000</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center shrink-0">
                                        <MapPin className="text-accent-gold" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-brown-900 mb-1">Visit Us</h3>
                                        <p className="text-neutral-brown-600">
                                            AfriReads HQ<br />
                                            Kiptagich House, 3rd Floor<br />
                                            Eldoret, Kenya
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Teaser */}
                        <div className="bg-neutral-brown-900 text-white p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold font-heading mb-2">Frequently Asked Questions</h3>
                                <p className="text-neutral-brown-300 mb-4 text-sm">
                                    Find quick answers to common questions about shipping, payments, and author submissions.
                                </p>
                                <a href="/faq" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                                    Visit FAQ Page <MessageSquare size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-neutral-brown-500/10">
                        <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-bold text-neutral-brown-700">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-bold text-neutral-brown-700">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-neutral-brown-700">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-bold text-neutral-brown-700">Subject</label>
                                <select
                                    id="subject"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="order">Order Inquiry</option>
                                    <option value="author">Author Submission</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-neutral-brown-700">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button type="button" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
