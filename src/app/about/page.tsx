'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Globe, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              About KaleeReads
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 leading-relaxed">
              Preserving and celebrating Kalenjin stories, one book at a time
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="rounded-xl p-10 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
            <h2 className="text-4xl font-bold mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              KaleeReads was born from a simple yet powerful idea: that African stories, particularly those from the Kalenjin community, deserve a global stage. We believe in the power of storytelling to educate, inspire, and unite across generations and borders.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our platform enables authors to share their stories, connect with readers worldwide, and earn from their work while preserving the rich oral and written traditions of the Kalenjin community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you&apos;re a reader seeking authentic voices or an aspiring author ready to share your story, there&apos;s a place for you in our growing community. Together, we&apos;re building something meaningful—a digital library that honors the past and embraces the future.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF3E7' }}>
                <BookOpen size={32} style={{ color: '#D97846' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Authentic Stories
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We celebrate genuine voices and authentic narratives from the Kalenjin community
              </p>
            </div>

            {/* Value 2 */}
            <div className="rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E8F5E9' }}>
                <Users size={32} style={{ color: '#7A9B76' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Community First
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Building a supportive space where authors and readers connect meaningfully
              </p>
            </div>

            {/* Value 3 */}
            <div className="rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E3F2FD' }}>
                <Globe size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Global Reach
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Making Kalenjin literature accessible to readers around the world
              </p>
            </div>

            {/* Value 4 */}
            <div className="rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FCE4EC' }}>
                <Heart size={32} className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Cultural Pride
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Preserving heritage while embracing contemporary storytelling methods
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center rounded-xl p-12 shadow-xl" style={{ backgroundColor: '#2C2416' }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Join Our Journey
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of a community that values stories, celebrates culture, and empowers voices. Explore our collection or share your own story.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/books" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg"
              style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
            >
              Browse Books <ArrowRight size={20} />
            </Link>
            <Link 
              href="/authors" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
            >
              Meet Authors <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
