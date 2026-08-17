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
      <main className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="max-w-md w-full">
          <div className="rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
            <div className="p-12 text-center" style={{ backgroundColor: '#E8F5E9' }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#7A9B76' }}>
                <CheckCircle size={48} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Request Submitted!
              </h1>
              <p className="text-lg text-gray-700">
                We'll contact you within 2-3 business days about <strong style={{ color: '#D97846' }}>{bookTitle}</strong>.
              </p>
            </div>
            <div className="p-8 text-center">
              <Link href={bookId ? `/books/${bookId}` : '/books'} className="inline-block px-8 py-4 rounded-xl font-bold text-white transition-all hover:shadow-lg" style={{ backgroundColor: '#D97846' }}>
                Back to Book
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b shadow-sm" style={{ borderColor: '#E5D5C3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D97846' }}>
                <Book size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:inline" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>KaleeReads</span>
            </Link>

            <Link href={bookId ? `/books/${bookId}` : '/books'} className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors font-medium">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Package size={18} style={{ color: '#C9A354' }} />
            <span className="text-white/95 text-sm font-bold">Hard Copy Request</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Request Physical Copy
          </h1>
          <p className="text-lg text-white/95 max-w-2xl mx-auto mb-8">
            Get a physical copy of <strong style={{ color: '#C9A354' }}>{bookTitle}</strong> delivered to your doorstep
          </p>

          {/* Delivery Info Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-3 rounded-xl px-5 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Truck size={24} style={{ color: '#7A9B76' }} />
              <span className="text-white font-semibold">Kenya-wide Delivery</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-5 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Package size={24} style={{ color: '#D97846' }} />
              <span className="text-white font-semibold">Quality Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
            {/* Personal Info */}
            <div className="p-8 border-b" style={{ borderColor: '#E5D5C3' }}>
              <h2 className="font-bold text-2xl mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3E7' }}>
                  <User size={24} style={{ color: '#D97846' }} />
                </div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                    style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                    style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                    placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                    style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                    placeholder="+254 700 000 000" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="p-8 border-b" style={{ borderColor: '#E5D5C3', backgroundColor: '#F5E6D3' }}>
              <h2 className="font-bold text-2xl mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                  <MapPin size={24} style={{ color: '#7A9B76' }} />
                </div>
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Street Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required
                    className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                    style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                    placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required
                      className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                      style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                      placeholder="Eldoret" />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>County *</label>
                    <input type="text" name="county" value={formData.county} onChange={handleChange} required
                      className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                      style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                      placeholder="Uasin Gishu" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order */}
            <div className="p-8">
              <h2 className="font-bold text-2xl mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF9E5' }}>
                  <BookOpen size={24} style={{ color: '#C9A354' }} />
                </div>
                Order Details
              </h2>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Quantity</label>
                  <select name="quantity" value={formData.quantity} onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all cursor-pointer"
                    style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}>
                    {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'copy' : 'copies'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Book</label>
                  <div className="w-full px-4 py-3.5 rounded-xl font-medium truncate" style={{ backgroundColor: '#F5E6D3', color: '#2C2416' }}>
                    {bookTitle}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block" style={{ color: '#2C2416' }}>Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all resize-none"
                  style={{ borderColor: '#E5D5C3', backgroundColor: '#FFFFFF' }}
                  placeholder="Special delivery instructions..."></textarea>
              </div>
            </div>

            <div className="px-8 pb-8">
              {error && (
                <div className="mb-4 p-4 rounded-xl text-red-600 text-sm font-medium" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#D97846' }}
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
              <p className="text-center text-gray-600 text-sm mt-4">
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