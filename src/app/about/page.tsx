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
        <div className="relative page-container py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] mb-5" style={{ color: '#E8A87C' }}>
              Our Story
            </p>
            <h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]"
              style={{ color: '#FFFCF5' }}
            >
              About Mama Africa Library
            </h1>
            <div className="w-16 h-[3px] mb-6" style={{ backgroundColor: '#B4502A' }} aria-hidden="true" />
            <p className="text-xl sm:text-2xl leading-relaxed" style={{ color: '#E4D9C4' }}>
              Preserving and celebrating African stories, one book at a time
            </p>
          </div>
        </div>
      </section>

      <main id="main-content" className="page-container">
        {/* 01 — Mission, set as a wide editorial column rather than a centred card */}
        <section className="editorial-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <p className="editorial-eyebrow editorial-eyebrow-rule mb-5">Our Mission</p>
              <div className="max-w-3xl space-y-6">
                <p className="text-lg leading-relaxed" style={{ color: '#5B4F42' }}>
                  Mama Africa Library was born from a simple yet powerful idea:
                  that African stories deserve a global stage. Our roots lie
                  with the Kalenjin community of Kenya — its storytellers,
                  elders, and authors showed us the power of narrative to
                  educate, inspire, and unite across generations and borders.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: '#5B4F42' }}>
                  From those roots we have grown into a home for voices from
                  across the continent. Our platform enables authors to share
                  their stories, connect with readers worldwide, and earn from
                  their work — while preserving the rich oral and written
                  traditions that make African literature unlike any other.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: '#5B4F42' }}>
                  Whether you&apos;re a reader seeking authentic voices or an
                  aspiring author ready to share your story, there&apos;s a place
                  for you in our growing community. Together, we&apos;re
                  building something meaningful — a digital library that honors
                  the past and embraces the future.
                </p>
              </div>
            </div>
            <p className="editorial-numeral hidden lg:block" aria-hidden="true">
              01
            </p>
          </div>
        </section>

        <hr className="editorial-rule" />

        {/* 02 — Values */}
        <section className="editorial-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end mb-14">
            <div>
              <p className="editorial-eyebrow editorial-eyebrow-rule mb-5">
                Principles
              </p>
              <h2
                className="font-heading text-3xl md:text-4xl font-bold"
                style={{ color: '#2C2416' }}
              >
                What We Stand For
              </h2>
            </div>
            <p className="editorial-numeral hidden lg:block" aria-hidden="true">
              02
            </p>
          </div>

          {/* Cards are not interactive, so they carry no hover affordance. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value 1 */}
            <div className="editorial-card p-7">
              <div className="tile-primary w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <BookOpen size={26} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2.5"
                style={{ color: '#2C2416' }}
              >
                Authentic Stories
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5B4F42' }}>
                We celebrate genuine voices and authentic narratives from across
                Africa
              </p>
            </div>

            {/* Value 2 */}
            <div className="editorial-card p-7">
              <div className="tile-green w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <Users size={26} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2.5"
                style={{ color: '#2C2416' }}
              >
                Community First
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5B4F42' }}>
                Building a supportive space where authors and readers connect
                meaningfully
              </p>
            </div>

            {/* Value 3 */}
            <div className="editorial-card p-7">
              <div className="tile-gold w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <Globe size={26} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2.5"
                style={{ color: '#2C2416' }}
              >
                Global Reach
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5B4F42' }}>
                Making African literature accessible to readers around the world
              </p>
            </div>

            {/* Value 4 */}
            <div className="editorial-card p-7">
              <div className="tile-ink w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <Heart size={26} />
              </div>
              <h3
                className="font-heading text-lg font-bold mb-2.5"
                style={{ color: '#2C2416' }}
              >
                Cultural Pride
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5B4F42' }}>
                Preserving heritage while embracing contemporary storytelling
                methods
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-8 md:pb-12">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-16 md:py-20 text-center"
            style={{ backgroundColor: '#2C2416' }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 25%, #B4502A 0%, transparent 45%), radial-gradient(circle at 80% 75%, #A8762B 0%, transparent 45%)',
              }}
              aria-hidden="true"
            />
            <div className="relative max-w-2xl mx-auto">
              <h2
                className="font-heading text-3xl sm:text-4xl font-bold mb-5"
                style={{ color: '#FFFCF5' }}
              >
                Join Our Journey
              </h2>
              <p
                className="text-lg mb-9 leading-relaxed"
                style={{ color: 'rgba(255, 252, 245, 0.85)' }}
              >
                Be part of a community that values stories, celebrates culture,
                and empowers voices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
                >
                  Browse Books <ArrowRight size={20} />
                </Link>
                <Link
                  href="/authors"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-colors"
                  style={{
                    border: '1px solid rgba(255,252,245,0.35)',
                    color: '#FFFFFF',
                  }}
                >
                  Meet Authors <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
