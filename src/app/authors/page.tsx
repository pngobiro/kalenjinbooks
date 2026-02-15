'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Star, User, Book, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { fetchAuthors, Author } from '@/lib/api/authors';

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

  useEffect(() => {
    async function loadAuthors() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAuthors({ limit: 20 });
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
              <Link href="/authors" className="text-primary font-medium">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium">About</Link>
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
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-white/90 text-sm font-medium">Talented Writers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
              Meet Our Authors
            </h1>
            <p className="text-lg text-neutral-brown-200 mb-8">
              Discover the brilliant minds and voices behind the stories we love
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
          </svg>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-neutral-brown-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-red-600 font-medium mb-2">Error loading authors</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.length > 0 ? (
                authors.map((author, index) => {
                  const colorScheme = colorSchemes[index % colorSchemes.length];
                  return (
                    <Link key={author.id} href={`/authors/${author.id}`} className="group">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        {/* Cover */}
                        <div className={`h-32 bg-gradient-to-br ${colorScheme} relative`}>
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_150%,rgba(255,255,255,0.8),transparent)]"></div>
                        </div>
                        
                        {/* Avatar */}
                        <div className="relative px-6 pb-6">
                          <div className="absolute -top-12 left-6">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-white">
                              {author.profileImage ? (
                                <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                                  <User size={36} className="text-white/80" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-16">
                            <h3 className="font-bold text-xl text-neutral-brown-900 font-heading group-hover:text-primary transition-colors mb-1">
                              {author.name || 'Unknown Author'}
                            </h3>
                            <p className="text-primary font-medium mb-3">Author</p>
                            
                            <p className="text-neutral-brown-600 text-sm mb-4 line-clamp-2">
                              {author.bio || 'No bio available yet. Discover this author\'s works and learn more about their journey.'}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-brown-100">
                              <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-accent-green" />
                                <span className="font-semibold">{author.booksCount} books</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star size={18} className="fill-accent-gold text-accent-gold" />
                                <span className="font-semibold">{author.rating?.toFixed(1) || '0.0'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-6">
                    <User size={36} className="text-neutral-brown-300" />
                  </div>
                  <p className="text-neutral-brown-600 text-lg">No authors available yet.</p>
                </div>
              )}

              {/* Join Card */}
              <div className="bg-gradient-to-br from-neutral-brown-900 to-neutral-brown-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <User size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-heading">Become an Author</h3>
                <p className="text-neutral-brown-300 mb-6">Share your story with the world</p>
                <Link href="/login?redirect=/dashboard/author" className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all hover:shadow-lg hover:-translate-y-1">
                  Apply Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}