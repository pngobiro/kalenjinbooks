'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, BookOpen, Star, Feather, ArrowRight, X, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAuthors, Author } from '@/lib/api/authors';

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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #D97846 0%, transparent 40%), radial-gradient(circle at 80% 70%, #7A9B76 0%, transparent 40%)',
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: '#D97846' }}>
            The Storytellers
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
            Meet Our Authors
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: '#E4D9C4' }}>
            Discover the voices preserving Kalenjin heritage through their words
          </p>

          {/* Search Bar */}
          <form onSubmit={(e) => e.preventDefault()} className="relative max-w-xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#5B4F42' }} />
            <input
              type="text"
              placeholder="Search by name, genre, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-full shadow-lg focus:ring-2 focus:ring-orange-400 outline-none"
              style={{ backgroundColor: '#FFFCF5', color: '#2C2416' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#5B4F42' }}
              >
                <X size={20} />
              </button>
            )}
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        {!loading && !error && filteredAuthors.length > 0 && (
          <div className="mb-10 text-center">
            <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
              {filteredAuthors.length} {filteredAuthors.length === 1 ? 'Author' : 'Authors'}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
            </div>
            <p className="mt-6 font-medium" style={{ color: '#5B4F42' }}>Loading authors...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl p-12 text-center max-w-md mx-auto shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #FCA5A5' }}>
            <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full font-semibold transition-all hover:shadow-md"
              style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Authors Grid — centered, wraps as more authors are added */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-8">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => {
                const initials = (author.name || 'A')
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                return (
                  <Link key={author.id} href={`/authors/${author.id}`} className="group w-full max-w-xs">
                    <div
                      className="h-full rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}
                    >
                      {/* Rounded Avatar */}
                      <div className="relative w-36 h-36 mx-auto mb-5">
                        <div
                          className="absolute inset-0 rounded-full overflow-hidden ring-4 transition-transform duration-300 group-hover:scale-105"
                          style={{ boxShadow: '0 0 0 4px #FFFCF5, 0 8px 24px rgba(217,120,70,0.25)', ['--tw-ring-color' as string]: '#D97846' }}
                        >
                          {author.profileImage ? (
                            <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#D97846' }}>
                              <span className="text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{initials}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="text-2xl font-bold mb-1.5 leading-tight group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                        {author.name || 'Unknown Author'}
                      </h3>

                      {/* Location */}
                      {(author.location || author.nationality) && (
                        <p className="inline-flex items-center gap-1.5 text-sm mb-4 px-3 py-1 rounded-full" style={{ color: '#7A9B76', backgroundColor: '#F5F1E8' }}>
                          <MapPin size={14} />
                          {author.location || author.nationality}
                        </p>
                      )}

                      {/* Bio */}
                      <p className="text-sm leading-relaxed line-clamp-3 mb-5" style={{ color: '#5B4F42' }}>
                        {author.bio || 'A talented storyteller on KaleeReads, sharing their unique voice and perspective.'}
                      </p>

                      {/* Genres */}
                      {author.genres && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                          {author.genres.split(',').slice(0, 3).map((genre) => (
                            <span key={genre.trim()} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                              {genre.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="w-full pt-4 border-t flex items-center justify-around" style={{ borderColor: '#E4D9C4' }}>
                        <div className="flex items-center gap-1.5 text-sm">
                          <BookOpen size={16} style={{ color: '#D97846' }} />
                          <span className="font-semibold" style={{ color: '#2C2416' }}>{author.booksCount || 0}</span>
                          <span style={{ color: '#5B4F42' }}>books</span>
                        </div>
                        {(author.blogsCount ?? 0) > 0 ? (
                          <Link
                            href={`/blogs?author=${author.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-medium transition-all hover:shadow-md"
                            style={{ color: '#D97846', backgroundColor: '#FEF3E7' }}
                          >
                            <FileText size={15} />
                            <span className="font-semibold">{author.blogsCount}</span>
                            <span>{author.blogsCount === 1 ? 'blog' : 'blogs'}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold" style={{ color: '#2C2416' }}>{author.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        )}
                        {(author.blogsCount ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold" style={{ color: '#2C2416' }}>{author.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3" style={{ color: '#D97846' }}>
                        View Profile <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="w-full text-center py-20">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEF3E7' }}>
                  <Feather size={36} style={{ color: '#D97846' }} />
                </div>
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                  {searchQuery ? 'No Authors Found' : 'No Authors Yet'}
                </h3>
                <p className="mb-8 max-w-md mx-auto" style={{ color: '#5B4F42' }}>
                  {searchQuery
                    ? 'Try adjusting your search query or browse all authors.'
                    : 'No authors have joined yet. Check back soon for new voices!'}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href="/books"
                    className="inline-block px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
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
