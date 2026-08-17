'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormState('success');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEF3E7' }}>
                    <Mail size={24} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#2C2416' }}>Email</h3>
                    <a href="mailto:hello@kaleereads.com" className="text-orange-600 hover:underline font-medium">
                      hello@kaleereads.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#E8F5E9' }}>
                    <MapPin size={24} style={{ color: '#7A9B76' }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#2C2416' }}>Location</h3>
                    <p className="text-gray-700">Eldoret, Kenya</p>
                    <p className="text-sm text-gray-600 mt-1">East Africa</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#E3F2FD' }}>
                    <MessageCircle size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#2C2416' }}>Follow Us</h3>
                    <p className="text-gray-700">Stay updated on social media</p>
                    <p className="text-sm text-gray-600 mt-1">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#2C2416' }}>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Need Quick Answers?
              </h3>
              <p className="text-gray-300 mb-6">
                Check out our frequently asked questions or browse our books collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/books" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                >
                  Browse Books
                </Link>
                <Link 
                  href="/blogs" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-all border-2"
                  style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
                >
                  Read Blog
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
              Send a Message
            </h2>
            
            {formState === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle size={64} className="mx-auto mb-6" style={{ color: '#7A9B76' }} />
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                  Message Sent!
                </h3>
                <p className="text-gray-700 mb-8 text-lg">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => { 
                    setFormState('idle'); 
                    setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' }); 
                  }}
                  className="px-6 py-3 rounded-lg font-bold transition-all hover:shadow-md"
                  style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="author">Author Submission</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none resize-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-70"
                  style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                >
                  {formState === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
