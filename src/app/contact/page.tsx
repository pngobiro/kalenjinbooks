'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">Get in Touch</h1>
          <p className="text-lg text-neutral-brown-600 max-w-xl mx-auto">
            Have a question or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
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
                      <a href="mailto:hello@kaleereads.com" className="text-primary hover:underline">hello@kaleereads.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-accent-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-brown-900 mb-1">Location</h3>
                      <p className="text-neutral-brown-600 text-sm">Eldoret, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-brown-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Need Quick Answers?</h3>
                <p className="text-neutral-brown-400 text-sm mb-4">Check our FAQ for common questions.</p>
                <Link href="/faq" className="text-primary font-semibold hover:underline">Visit FAQ &rarr;</Link>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-neutral-brown-900 mb-6">Send a Message</h2>
              
              {formState === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-accent-green mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">Message Sent!</h3>
                  <p className="text-neutral-brown-600 mb-6">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => { setFormState('idle'); setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' }); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="text-sm font-medium text-neutral-brown-700 mb-1 block">First Name</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm font-medium text-neutral-brown-700 mb-1 block">Last Name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-neutral-brown-700 mb-1 block">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-neutral-brown-700 mb-1 block">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="author">Author Submission</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-neutral-brown-700 mb-1 block">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none transition-colors"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
