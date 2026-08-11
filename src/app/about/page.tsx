'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-neutral-brown-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">About Us</p>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-brown-900">
            About KaleeReads
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8">
          <p className="text-neutral-brown-700 text-sm leading-relaxed mb-4">
            KaleeReads was born from a simple yet powerful idea: that African stories, particularly those from the Kalenjin community, deserve a global stage. We believe in the power of storytelling to educate, inspire, and unite.
          </p>
          <p className="text-neutral-brown-700 text-sm leading-relaxed mb-4">
            Our platform enables authors to share their stories, connect with readers, and earn from their work while preserving the rich oral and written traditions of the Kalenjin community.
          </p>
          <p className="text-neutral-brown-700 text-sm leading-relaxed mb-6">
            Whether you&apos;re a reader or an aspiring author, there&apos;s a place for you in our community. Together, we&apos;re building something meaningful.
          </p>
          <Link href="/books" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-full transition-all text-sm">
            Browse Books <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
