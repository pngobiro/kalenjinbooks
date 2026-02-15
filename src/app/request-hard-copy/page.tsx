'use client';

import { ArrowLeft, Package, MapPin, User, BookOpen, CheckCircle, Book, Truck, Sparkles } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/hard-copy-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          requesterName: formData.fullName,
          requesterEmail: formData.email,
          requesterPhone: formData.phone,
          deliveryAddress: formData.address,
          city: formData.city,
          country: 'Kenya',
          postalCode: formData.county,
          quantity: formData.quantity,
          message: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit request' })) as { error?: string };
        throw new Error(errorData.error || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-neutral-cream flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-accent-green/20 to-accent-green/5 p-12 text-center">
              <div className="w-20 h-20 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-3">Request Submitted!</h1>
              <p className="text-neutral-brown-600 text-lg">
                We'll contact you within 2-3 business days about <strong className="text-primary">{bookTitle}</strong>.
              </p>
            </div>
            <div className="p-8 text-center">
              <Link href={bookId ? `/books/${bookId}` : '/books'} className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full inline-block transition-all hover:shadow-lg hover:-translate-y-0.5">
                Back to Book
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="44" height="44">
                <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" fill="#E07856"></path>
                <path d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" fill="#D4AF37"></path>
                <path d="M12 8C12 8 11 9.5 11 11C11 11.8 11.4 12.4 12 12.5C12.6 12.4 13 11.8 13 11C13 9.5 12 8 12 8Z" fill="#C85D3A"></path>
              </svg>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <Link href={bookId ? `/books/${bookId}` : '/books'} className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-accent-green rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Package size={16} className="text-accent-gold" />
            <span className="text-white/90 text-sm font-medium">Hard Copy Request</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
            Request Physical Copy
          </h1>
          <p className="text-lg text-neutral-brown-200 max-w-2xl mx-auto">
            Get a physical copy of <strong className="text-primary">{bookTitle}</strong> delivered to your doorstep
          </p>

          {/* Delivery Info Cards */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3">
              <Truck size={24} className="text-accent-green" />
              <span className="text-white font-medium">Island-wide Delivery</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3">
              <Package size={24} className="text-primary" />
              <span className="text-white font-medium">Quality Packaging</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
          </svg>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Personal Info */}
            <div className="p-8 border-b border-neutral-brown-100">
              <h2 className="font-bold text-xl text-neutral-brown-900 font-heading mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-neutral-cream/30" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-neutral-cream/30" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-neutral-cream/30" placeholder="+254 700 000 000" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="p-8 border-b border-neutral-brown-100 bg-neutral-cream/30">
              <h2 className="font-bold text-xl text-neutral-brown-900 font-heading mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-green/10 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-accent-green" />
                </div>
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Street Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-white" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-white" placeholder="Eldoret" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">County *</label>
                    <input type="text" name="county" value={formData.county} onChange={handleChange} required
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-white" placeholder="Uasin Gishu" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order */}
            <div className="p-8">
              <h2 className="font-bold text-xl text-neutral-brown-900 font-heading mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-accent-gold" />
                </div>
                Order Details
              </h2>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Quantity</label>
                  <select name="quantity" value={formData.quantity} onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-white appearance-none cursor-pointer">
                    {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'copy' : 'copies'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Book</label>
                  <div className="w-full px-4 py-3.5 rounded-xl bg-neutral-cream text-neutral-brown-700 font-medium truncate">
                    {bookTitle}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-brown-700 mb-2 block">Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-neutral-brown-100 focus:border-primary focus:outline-none transition-colors bg-neutral-cream/30 resize-none" placeholder="Special delivery instructions..."></textarea>
              </div>
            </div>

            <div className="px-8 pb-8">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Package size={22} /> 
                    Submit Request
                  </>
                )}
              </button>
              <p className="text-center text-neutral-brown-500 text-sm mt-4">
                We'll contact you within 2-3 business days with delivery details
              </p>
            </div>
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