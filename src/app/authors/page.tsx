'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Feather, X, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAuthors, Author } from '@/lib/api/authors';
import { EDITORIAL_TONES } from '@/lib/editorial';

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
        <img
          src="/images/authors-illustration.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(44,36,22,0.82) 0%, rgba(44,36,22,0.6) 60%, rgba(44,36,22,0.78) 100%)' }}
        />
        <div className="relative page-container py-16 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] mb-5" style={{ color: '#E8A87C' }}>
            The Storytellers
          </p>
          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight max-w-3xl"
            style={{ color: '#FFFCF5' }}
          >
            Meet Our Authors
          </h1>
          <p className="text-lg max-w-2xl mb-8 leading-relaxed" style={{ color: '#E4D9C4' }}>
            The voices preserving African heritage through their words.
          </p>

          {/* Search Bar */}
          <form onSubmit={(e) => e.preventDefault()} className="relative max-w-xl">
            <label htmlFor="author-search" className="sr-only">
              Search authors by name or biography
            </label>
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#6B5D52' }}
            />
            <input
              id="author-search"
              type="search"
              placeholder="Search authors by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-full"
              style={{
                backgroundColor: '#FFFCF5',
                color: '#2C2416',
                border: '1px solid #E4D9C4',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#5B4F42' }}
                aria-label="Clear author search"
              >
                <X size={20} />
              </button>
            )}
          </form>
        </div>
      </section>

      <main id="main-content" className="page-container editorial-section pt-0">
        {/* Section header — left-aligned with a right-rail numeral, matching
            the homepage rhythm instead of a centred pill. */}
        {!loading && !error && filteredAuthors.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end mb-12">
            <div>
              <p className="editorial-eyebrow editorial-eyebrow-rule mb-4">
                {searchQuery ? 'Search results' : 'The roster'}
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold" style={{ color: '#2C2416' }}>
                {filteredAuthors.length}{' '}
                {filteredAuthors.length === 1 ? 'Author' : 'Authors'}
                {searchQuery ? ` matching “${searchQuery}”` : ''}
              </h2>
            </div>
            <p className="editorial-numeral hidden lg:block" aria-hidden="true">
              01
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#B4502A' }}></div>
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
              style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Author grid — real CSS grid, editorial portrait cards.
            The previous version used flex-wrap + max-w-xs, which left a ragged
            last row and wasted the 7xl measure. */}
        {!loading && !error && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author, i) => {
                const initials = (author.name || 'A')
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                const tone = EDITORIAL_TONES[i % EDITORIAL_TONES.length];
                return (
                  <article key={author.id} className="editorial-card group flex flex-col overflow-hidden">
                    {/* Portrait panel */}
                    <div
                      className="relative h-56 overflow-hidden"
                      style={{ background: `linear-gradient(140deg, ${tone.from} 0%, ${tone.to} 100%)` }}
                    >
                      {author.profileImage ? (
                        <img
                          src={author.profileImage}
                          alt={author.name || 'Author'}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-heading text-5xl font-bold text-white/90">
                            {initials}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3
                        className="font-heading text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors"
                        style={{ color: '#2C2416' }}
                      >
                        {/* Title only — the whole panel is not a link, so the
                            nested <a> inside <a> bug cannot recur here. */}
                        <Link href={`/authors/${author.id}`} className="after:absolute after:inset-0">
                          {author.name || 'Unknown Author'}
                        </Link>
                      </h3>

                      {author.bio && (
                        <p
                          className="text-sm leading-relaxed line-clamp-3 mb-5"
                          style={{ color: '#5B4F42' }}
                        >
                          {author.bio}
                        </p>
                      )}

                      {/* Stats set as a data line rather than centred pills */}
                      <dl
                        className="mt-auto pt-4 border-t flex items-center gap-4 text-xs"
                        style={{ borderColor: '#E4D9C4', color: '#6B5D52' }}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          <BookOpen size={14} style={{ color: '#4F6D4C' }} />
                          <dt className="sr-only">Books</dt>
                          <dd>
                            {author.booksCount || 0}{' '}
                            {author.booksCount === 1 ? 'book' : 'books'}
                          </dd>
                        </div>
                        {(author.blogsCount ?? 0) > 0 && (
                          <>
                            <span aria-hidden="true" style={{ color: '#E4D9C4' }}>
                              /
                            </span>
                            <div className="inline-flex items-center gap-1.5">
                              <FileText size={14} style={{ color: '#B4502A' }} />
                              <dt className="sr-only">Stories</dt>
                              <dd>
                                {author.blogsCount}{' '}
                                {author.blogsCount === 1 ? 'story' : 'stories'}
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="w-full text-center py-20">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F7E4D8' }}>
                  <Feather size={36} style={{ color: '#B4502A' }} />
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
                    style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href="/books"
                    className="inline-block px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
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
