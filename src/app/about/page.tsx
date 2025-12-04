'use client';

import { Users, Heart, Sparkles, ArrowLeft, Book } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Books</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Authors</Link>
              <Link href="/about" className="text-primary font-medium">About</Link>
            </div>

            <Link href="/" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-neutral-brown-900 font-heading mb-4">Our Story</h1>
          <p className="text-xl text-neutral-brown-600 max-w-2xl mx-auto">
            Preserving culture, empowering authors, and connecting the world to the richness of Kalenjin literature.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">Our Mission</span>
              <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-6">
                Bridging Tradition and Technology
              </h2>
              <p className="text-neutral-brown-700 mb-4 leading-relaxed">
                AfriReads was born from a simple yet powerful idea: that African stories, particularly those from the Kalenjin community, deserve a global stage.
              </p>
              <p className="text-neutral-brown-700 leading-relaxed">
                We believe in the power of storytelling to educate, inspire, and unite. By providing a platform for local authors, we are nurturing a cultural renaissance.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <Image 
                src="/images/kalenjin-spirit.png" 
                alt="Kalenjin cultural heritage" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Core Values</h2>
            <p className="text-neutral-brown-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Cultural Pride", description: "We celebrate the depth and beauty of Kalenjin traditions.", color: "text-primary" },
              { icon: Users, title: "Community First", description: "We exist to serve our community of authors and readers.", color: "text-accent-green" },
              { icon: Sparkles, title: "Excellence", description: "We are committed to high-quality publishing standards.", color: "text-accent-gold" },
            ].map((value, index) => (
              <div key={index} className="bg-neutral-cream rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                  <value.icon size={28} className={value.color} />
                </div>
                <h3 className="font-bold text-neutral-brown-900 mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-brown-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-neutral-brown-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Books Published" },
              { number: "10k+", label: "Happy Readers" },
              { number: "150+", label: "Local Authors" },
              { number: "50+", label: "Schools Partnered" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-neutral-brown-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 w-full">
        <div className="w-full max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-4">Join Our Journey</h2>
          <p className="text-neutral-brown-600 mb-8 max-w-xl mx-auto">
            Whether you're a reader or an aspiring author, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/books" className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-all">
              Browse Books
            </Link>
            <Link href="/dashboard/author" className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-full transition-all">
              Become an Author
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
