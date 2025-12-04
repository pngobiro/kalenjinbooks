'use client';

import KaleeReadsLogo from '@/components/KaleeReadsLogo';
import { ArrowLeft, Package, MapPin, User, BookOpen, CheckCircle, Book } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function RequestHardCopyContent() {
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('book') || 'Selected Book';
  const bookId = searchParams.get('id') || '';

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', county: '', quantity: 1, notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-neutral-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-accent-green" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2">Request Submitted!</h1>
          <p className="text-neutral-brown-600 mb-6">
            We'll contact you within 2-3 business days about <strong className="text-primary">{bookTitle}</strong>.
          </p>
          <Link href={bookId ? `/books/${bookId}` : '/books'} className="bg-primary text-white font-semibold px-6 py-3 rounded-full inline-block">
            Back to Book
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-cream w-full">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10 w-full">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <Link href={bookId ? `/books/${bookId}` : '/books'} className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-12 w-full">
        <div className="w-full max-w-6xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Request Hard Copy</h1>
          <p className="text-neutral-brown-600">
            Get a physical copy of <strong className="text-primary">{bookTitle}</strong>
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 w-full">
        <div className="w-full max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
            {/* Personal Info */}
            <div className="mb-6">
              <h2 className="font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="+254 700 000 000" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-6 pt-6 border-t border-neutral-brown-100">
              <h2 className="font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Street Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="Eldoret" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">County *</label>
                    <input type="text" name="county" value={formData.county} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none" placeholder="Uasin Gishu" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order */}
            <div className="mb-6 pt-6 border-t border-neutral-brown-100">
              <h2 className="font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" /> Order Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Quantity</label>
                  <select name="quantity" value={formData.quantity} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none bg-white">
                    {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Book</label>
                  <div className="px-4 py-3 rounded-lg bg-neutral-cream text-neutral-brown-700 text-sm truncate">{bookTitle}</div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-brown-700 mb-1 block">Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-brown-200 focus:border-primary focus:outline-none resize-none" placeholder="Special requests..."></textarea>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all">
              <Package size={20} /> Submit Request
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function RequestHardCopyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-brown-600">Loading form...</p>
        </div>
      </div>
    }>
      <RequestHardCopyContent />
    </Suspense>
  );
}
