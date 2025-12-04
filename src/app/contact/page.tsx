'use client';

import { Mail, Phone, MapPin, Send, ArrowLeft, Book } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
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
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
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
          <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">Get in Touch</h1>
          <p className="text-lg text-neutral-brown-600 max-w-xl mx-auto">
            Have a question or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="font-bold text-neutral-brown-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-brown-900 mb-1">Email</h3>
                      <a href="mailto:hello@afrireads.com" className="text-primary hover:underline">hello@afrireads.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                      <Phone size={20} className="text-accent-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-brown-900 mb-1">Phone</h3>
                      <a href="tel:+254700000000" className="text-accent-green hover:underline">+254 700 000 000</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent-gold/10 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-brown-900 mb-1">Address</h3>
                      <p className="text-neutral-brown-600 text-sm">Kiptagich House, Eldoret, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-brown-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Need Quick Answers?</h3>
                <p className="text-neutral-brown-400 text-sm mb-4">Check our FAQ for common questions.</p>
                <Link href="/faq" className="text-primary font-semibold hover:underline">Visit FAQ →</Link>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-neutral-brown-900 mb-6">Send a Message</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Subject</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none bg-white">
                    <option>Select a topic</option>
                    <option>Order Inquiry</option>
                    <option>Author Submission</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none resize-none" placeholder="How can we help?"></textarea>
                </div>

                <button type="button" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all">
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
