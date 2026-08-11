'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Star, User, Search } from 'lucide-react';
import Link from 'next/link';
import { fetchAuthors, Author } from '@/lib/api/authors';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const colorSchemes = [
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-red-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
];

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAuthors() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAuthors({ limit: 50 });
        setAuthors(response?.data || []);
      } catch (e) {
        console.error('Failed to fetch authors:', e);
        setError(e instanceof Error ? e.message : 'Failed to load authors');
      } finally {
        setLoading(false);
      }
    }

    loadAuthors();
  }, []);

  const filteredAuthors = authors.filter((author) =>
    author.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-neutral-brown-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">KaleeReads</p>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-brown-900">
            Our Authors
          </h1>
          <p className="mt-1 text-sm text-neutral-brown-600">
            Discover the brilliant minds behind the stories
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" />
            <input
              type="text"
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-brown-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-neutral-brown-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Error loading authors</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Authors Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author, index) => {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <Link key={author.id} href={`/authors/${author.id}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      {/* Cover */}
                      <div className={`h-20 bg-gradient-to-br ${colorScheme}`}></div>

                      {/* Avatar */}
                      <div className="px-4 pb-4">
                        <div className="relative -mt-8 mb-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-lg border-2 border-white">
                            {author.profileImage ? (
                              <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                                <User size={24} className="text-white/80" />
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="font-semibold text-sm text-neutral-brown-900 group-hover:text-primary transition-colors mb-1">
                          {author.name || 'Unknown Author'}
                        </h3>

                        <p className="text-neutral-brown-600 text-xs mb-3 line-clamp-2">
                          {author.bio || 'Author on KaleeReads'}
                        </p>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-neutral-brown-600">
                            <BookOpen size={13} className="text-primary" />
                            {author.booksCount} books
                          </span>
                          <span className="flex items-center gap-1 text-neutral-brown-600">
                            <Star size={13} className="fill-accent-gold text-accent-gold" />
                            {author.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-neutral-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="text-neutral-brown-400" />
                </div>
                <p className="text-neutral-brown-600">
                  {searchQuery ? 'No authors found matching your search.' : 'No authors available yet.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
