'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
        <img
          src="/images/contact-illustration.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,36,22,0.88) 0%, rgba(44,36,22,0.62) 55%, rgba(44,36,22,0.45) 100%)' }}
        />
        <div className="relative page-container py-16 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] mb-5" style={{ color: '#E8A87C' }}>
            Say Hello
          </p>
          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
            style={{ color: '#FFFCF5' }}
          >
            Get in Touch
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255, 252, 245, 0.9)' }}
          >
            Have a question, feedback, or just want to say hello? We&apos;d love
            to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="editorial-card p-8">
              <p className="editorial-eyebrow editorial-eyebrow-rule mb-4">
                Reach us
              </p>
              <h2
                className="font-heading text-2xl font-bold mb-6"
                style={{ color: '#2C2416' }}
              >
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="tile-primary w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#2C2416' }}>Email</h3>
                    <a
                      href="mailto:hello@mamaafricalibrary.com"
                      className="font-medium hover:underline break-all"
                      style={{ color: '#B4502A' }}
                    >
                      hello@mamaafricalibrary.com
                    </a>
                    <p className="text-sm mt-1" style={{ color: '#6B5D52' }}>
                      We&apos;ll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="tile-green w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#2C2416' }}>Location</h3>
                    <p style={{ color: '#2C2416' }}>Eldoret, Kenya</p>
                    <p className="text-sm mt-1" style={{ color: '#6B5D52' }}>
                      East Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="tile-gold w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#2C2416' }}>Follow Us</h3>
                    <p style={{ color: '#2C2416' }}>Stay updated on social media</p>
                    <p className="text-sm mt-1" style={{ color: '#6B5D52' }}>
                      Coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-8" style={{ backgroundColor: '#2C2416' }}>
              <h3
                className="font-heading text-xl font-bold mb-3"
                style={{ color: '#FFFCF5' }}
              >
                Need Quick Answers?
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: 'rgba(255, 252, 245, 0.8)' }}
              >
                Check out our frequently asked questions or browse our books
                collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/books"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
                >
                  Browse Books
                </Link>
                <Link
                  href="/blogs"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-colors"
                  style={{
                    border: '1px solid rgba(255, 252, 245, 0.4)',
                    color: '#FFFFFF',
                  }}
                >
                  Read Blog
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="editorial-card p-8">
            <p className="editorial-eyebrow editorial-eyebrow-rule mb-4">
              Write to us
            </p>
            <h2
              className="font-heading text-2xl font-bold mb-6"
              style={{ color: '#2C2416' }}
            >
              Send a Message
            </h2>
            
            {formState === 'success' ? (
              /* role=status announces the swap to screen readers, which
                 previously happened silently with focus left on a removed node. */
              <div className="text-center py-12" role="status" aria-live="polite">
                <CheckCircle size={64} className="mx-auto mb-6" style={{ color: '#4F6D4C' }} />
                <h3
                  className="font-heading text-2xl font-bold mb-3"
                  style={{ color: '#2C2416' }}
                >
                  Message Sent!
                </h3>
                <p className="mb-8 text-lg" style={{ color: '#5B4F42' }}>
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setFormState('idle');
                    setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-3 rounded-lg font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
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
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2  focus:outline-none transition-all"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E4D9C4', color: '#2C2416' }}
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
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2  focus:outline-none transition-all"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E4D9C4', color: '#2C2416' }}
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
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2  focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4D9C4', color: '#2C2416' }}
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
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2  focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4D9C4', color: '#2C2416' }}
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
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2  focus:outline-none resize-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4D9C4', color: '#2C2416' }}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-70"
                  style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
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
