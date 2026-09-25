'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Globe, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
        <img
          src="/images/about-illustration.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(44,36,22,0.82) 0%, rgba(44,36,22,0.6) 60%, rgba(44,36,22,0.78) 100%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: '#D97846' }}>
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
              About Mama Africa Library
            </h1>
            <p className="text-xl sm:text-2xl leading-relaxed" style={{ color: '#E4D9C4' }}>
              Preserving and celebrating African stories, one book at a time
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="rounded-2xl p-10 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
            <h2 className="text-4xl font-bold mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#5B4F42' }}>
              Mama Africa Library was born from a simple yet powerful idea: that African stories deserve a global stage. Our roots lie with the Kalenjin community of Kenya — its storytellers, elders, and authors showed us the power of narrative to educate, inspire, and unite across generations and borders.
            </p>
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#5B4F42' }}>
              From those roots we have grown into a home for voices from across the continent. Our platform enables authors to share their stories, connect with readers worldwide, and earn from their work — while preserving the rich oral and written traditions that make African literature unlike any other.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: '#5B4F42' }}>
              Whether you&apos;re a reader seeking authentic voices or an aspiring author ready to share your story, there&apos;s a place for you in our growing community. Together, we&apos;re building something meaningful — a digital library that honors the past and embraces the future.
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
            <div className="rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF3E7' }}>
                <BookOpen size={32} style={{ color: '#D97846' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Authentic Stories
              </h3>
              <p className="leading-relaxed" style={{ color: '#5B4F42' }}>
                We celebrate genuine voices and authentic narratives from across Africa
              </p>
            </div>

            {/* Value 2 */}
            <div className="rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E8F5E9' }}>
                <Users size={32} style={{ color: '#7A9B76' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Community First
              </h3>
              <p className="leading-relaxed" style={{ color: '#5B4F42' }}>
                Building a supportive space where authors and readers connect meaningfully
              </p>
            </div>

            {/* Value 3 */}
            <div className="rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E3F2FD' }}>
                <Globe size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Global Reach
              </h3>
              <p className="leading-relaxed" style={{ color: '#5B4F42' }}>
                Making African literature accessible to readers around the world
              </p>
            </div>

            {/* Value 4 */}
            <div className="rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FCE4EC' }}>
                <Heart size={32} className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Cultural Pride
              </h3>
              <p className="leading-relaxed" style={{ color: '#5B4F42' }}>
                Preserving heritage while embracing contemporary storytelling methods
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 shadow-xl" style={{ backgroundColor: '#2C2416' }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Join Our Journey
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#E4D9C4' }}>
            Be part of a community that values stories, celebrates culture, and empowers voices. Explore our collection or share your own story.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
            >
              Browse Books <ArrowRight size={20} />
            </Link>
            <Link
              href="/authors"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:shadow-lg border-2"
              style={{ borderColor: 'rgba(255,252,245,0.3)', color: '#FFFFFF' }}
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
