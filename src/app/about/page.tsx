'use client';

import { Users, Heart, Sparkles, ArrowLeft, Book, Globe, Award, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const stats = [
  { number: "500+", label: "Books Published" },
  { number: "10k+", label: "Happy Readers" },
  { number: "150+", label: "Local Authors" },
  { number: "50+", label: "Schools Partnered" },
];

const values = [
  { 
    icon: Heart, 
    title: "Cultural Pride", 
    description: "We celebrate the depth and beauty of Kalenjin traditions, preserving our heritage for future generations.",
    color: "bg-primary/10 text-primary"
  },
  { 
    icon: Users, 
    title: "Community First", 
    description: "We exist to serve our community of authors and readers, fostering meaningful connections.",
    color: "bg-accent-green/10 text-accent-green"
  },
  { 
    icon: Sparkles, 
    title: "Excellence", 
    description: "We are committed to high-quality publishing standards and exceptional storytelling.",
    color: "bg-accent-gold/10 text-accent-gold"
  },
  { 
    icon: Globe, 
    title: "Global Reach", 
    description: "Connecting Kalenjin literature with readers around the world through technology.",
    color: "bg-blue-500/10 text-blue-500"
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="44" height="44">
                {/* Traditional Kalenjin Calabash */}
                <path d="M12 3C10 3 8.5 4 8 5.5C7.5 7 7 9 7 11C7 13.5 7.5 16 8.5 18C9.5 20 11 21 12 21C13 21 14.5 20 15.5 18C16.5 16 17 13.5 17 11C17 9 16.5 7 16 5.5C15.5 4 14 3 12 3Z" fill="#8B4513" stroke="#654321" strokeWidth="0.5"/>
                {/* Calabash neck */}
                <ellipse cx="12" cy="4" rx="1.5" ry="1.5" fill="#A0522D"/>
                {/* Traditional patterns */}
                <path d="M9 8C9 8 10 8.5 12 8.5C14 8.5 15 8 15 8" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                <path d="M9 11C9 11 10 11.5 12 11.5C14 11.5 15 11 15 11" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                <path d="M9 14C9 14 10 14.5 12 14.5C14 14.5 15 14 15 14" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                <path d="M9.5 17C9.5 17 10.5 17.5 12 17.5C13.5 17.5 14.5 17 14.5 17" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                {/* Decorative dots */}
                <circle cx="10" cy="9.5" r="0.4" fill="#E07856"/>
                <circle cx="14" cy="9.5" r="0.4" fill="#E07856"/>
                <circle cx="10" cy="12.5" r="0.4" fill="#E07856"/>
                <circle cx="14" cy="12.5" r="0.4" fill="#E07856"/>
                <circle cx="10" cy="15.5" r="0.4" fill="#E07856"/>
                <circle cx="14" cy="15.5" r="0.4" fill="#E07856"/>
              </svg>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium">Books</Link>
              <Link href="/blogs" className="text-neutral-brown-700 hover:text-primary font-medium">Blogs</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium">Authors</Link>
              <Link href="/about" className="text-primary font-medium">About</Link>
            </div>

            <Link href="/books" className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">
              Browse Books
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-green rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-white/90 text-sm font-medium">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-heading mb-6">
              Preserving Culture, Empowering Authors
            </h1>
            <p className="text-xl text-neutral-brown-200 leading-relaxed">
              KaleeReads was born from a simple yet powerful idea: that African stories, particularly those from the Kalenjin community, deserve a global stage. We believe in the power of storytelling to educate, inspire, and unite.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-brown-900 font-heading mb-6">
                Bridging Tradition and Technology
              </h2>
              <p className="text-neutral-brown-700 text-lg leading-relaxed mb-6">
                We believe in the power of storytelling to educate, inspire, and unite. By providing a platform for local authors, we are nurturing a cultural renaissance that brings Kalenjin literature to the world stage.
              </p>
              <p className="text-neutral-brown-700 leading-relaxed">
                Our platform enables authors to share their stories, connect with readers, and earn from their work while preserving the rich oral and written traditions of the Kalenjin community.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/kalenjin-spirit.png" 
                  alt="Kalenjin cultural heritage" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Award size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-brown-900">5+ Years</p>
                    <p className="text-neutral-brown-600 text-sm">of service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star size={20} className="text-accent-gold" />
                  <span className="text-4xl md:text-5xl font-bold text-white">{stat.number}</span>
                </div>
                <div className="text-neutral-brown-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-brown-900 font-heading">
              Core Values
            </h2>
            <p className="text-neutral-brown-600 mt-4 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-neutral-cream rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <value.icon size={32} />
                </div>
                <h3 className="font-bold text-xl text-neutral-brown-900 mb-3">{value.title}</h3>
                <p className="text-neutral-brown-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-brown-900 font-heading mb-6">
            Join Our Journey
          </h2>
          <p className="text-neutral-brown-600 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're a reader or an aspiring author, there's a place for you in our community. Together, we're building something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/books" className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-4 rounded-full transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2">
              Browse Books <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard/author" className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-10 py-4 rounded-full transition-all flex items-center gap-2">
              Become an Author
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}