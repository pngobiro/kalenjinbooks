'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, BookOpen, Star, Feather, ArrowRight, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAuthors, Author } from '@/lib/api/authors';

const colorGradients = [
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

  const filteredAuthors = authors.filter((author) => {
    const q = searchQuery.toLowerCase();
    return (
      author.name?.toLowerCase().includes(q) ||
      author.bio?.toLowerCase().includes(q) ||
      author.location?.toLowerCase().includes(q) ||
      author.genres?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Meet Our Authors
            </h1>
            <p className="text-lg sm:text-xl text-white/95 leading-relaxed mb-8">
              Discover the voices and talents behind our collection of Kalenjin literature
            </p>
            
            {/* Search Bar */}
            <form onSubmit={(e) => e.preventDefault()} className="relative max-w-2xl">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by author name, genre, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                style={{ backgroundColor: '#FFFCF5' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-8 text-center">
            <p className="text-gray-600 font-medium">
              {filteredAuthors.length} {filteredAuthors.length === 1 ? 'Author' : 'Authors'} Found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#F5E6D3' }}></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading authors...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl p-12 text-center shadow-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Authors Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author, index) => {
                const gradient = colorGradients[index % colorGradients.length];
                const initials = (author.name || 'A')
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                return (
                  <Link key={author.id} href={`/authors/${author.id}`} className="group">
                    <div className="h-full rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col" style={{ backgroundColor: '#FFFCF5' }}>
                      {/* Gradient Header */}
                      <div className={`h-24 bg-gradient-to-br ${gradient} relative`}>
                        <div className="absolute inset-0 bg-black/5"></div>
                      </div>

                      {/* Content */}
                      <div className="relative px-6 pb-6 -mt-12 flex flex-col items-center text-center flex-1">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl mb-4" style={{ boxShadow: '0 0 0 4px #FFFCF5' }}>
                          {author.profileImage ? (
                            <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                              <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{initials}</span>
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="text-2xl font-bold mb-2 leading-tight group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                          {author.name || 'Unknown Author'}
                        </h3>

                        {/* Location */}
                        {(author.location || author.nationality) && (
                          <p className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                            <MapPin size={14} />
                            {author.location || author.nationality}
                          </p>
                        )}

                        {/* Bio */}
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4 flex-1">
                          {author.bio || 'A talented storyteller on KaleeReads, sharing their unique voice and perspective.'}
                        </p>

                        {/* Genres */}
                        {author.genres && (
                          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                            {author.genres.split(',').slice(0, 3).map((genre) => (
                              <span key={genre.trim()} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                                {genre.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="w-full pt-4 border-t flex items-center justify-around" style={{ borderColor: '#E5D5C3' }}>
                          <div className="flex items-center gap-1.5 text-sm">
                            <BookOpen size={16} style={{ color: '#D97846' }} />
                            <span className="font-semibold" style={{ color: '#2C2416' }}>{author.booksCount || 0}</span>
                            <span className="text-gray-600">books</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold" style={{ color: '#2C2416' }}>{author.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all">
                          View Profile <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5E6D3' }}>
                  <Feather size={36} className="text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                  {searchQuery ? 'No Authors Found' : 'No Authors Yet'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Try adjusting your search query or browse all authors.' 
                    : 'No authors have joined yet. Check back soon for new voices!'}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href="/books"
                    className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                  >
                    Browse Books
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
