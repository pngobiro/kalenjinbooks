'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Star, ArrowRight, Sparkles, ShoppingCart, Package } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';
import { trackBookClick } from '@/lib/analytics';

const categories = ['All', 'Fiction', 'Non-Fiction', 'Folklore', 'History', 'Poetry', 'Children', 'Education'];

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

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        const params: any = { limit: 50 };

        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== 'All') params.category = selectedCategory;

        const response = await fetchBooks(params);
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load books. Please try again.');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(loadBooks, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-green rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-white/90 text-sm font-medium">Authentic Kalenjin Literature</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
              Discover Our Books
            </h1>
            <p className="text-lg text-neutral-brown-200 mb-8">
              Explore our curated collection of stories, wisdom, and cultural heritage
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="text-neutral-brown-400" size={22} />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 text-neutral-brown-900 text-lg shadow-xl"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all shadow-sm ${selectedCategory === category
                    ? 'bg-primary text-white shadow-primary/30'
                    : 'bg-white text-neutral-brown-700 hover:bg-primary/5 hover:shadow-md'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <div className="flex items-center justify-between mb-8">
              <p className="text-neutral-brown-700">
                Showing <strong className="text-neutral-brown-900">{books.length}</strong> books
                {selectedCategory !== 'All' && (
                  <span className="ml-1"> in <span className="text-primary font-medium">{selectedCategory}</span></span>
                )}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-neutral-brown-500 hover:text-primary flex items-center gap-1"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-neutral-brown-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-neutral-brown-600 font-medium">Loading books...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Books Grid */}
          {!loading && !error && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book, index) => {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <Link 
                    key={book.id} 
                    href={`/books/${book.id}`} 
                    className="group"
                    onClick={() => trackBookClick(book.id, { category: book.category, price: book.price })}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      {/* Book Cover */}
                      <div className={`aspect-[2/3] relative overflow-hidden ${!book.coverImage ? `bg-gradient-to-br ${colorScheme}` : ''}`}>
                        {book.coverImage ? (
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-primary">KES {book.price}</span>
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="fill-accent-gold text-accent-gold" />
                                  <span className="text-sm font-medium text-neutral-brown-700">{book.rating?.toFixed(1) || '0.0'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-neutral-brown-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-sm text-neutral-brown-600 mb-3">{book.author?.user?.name || 'Unknown Author'}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">KES {book.price}</span>
                          <div className="flex items-center gap-1">
                            <Star size={16} className="fill-accent-gold text-accent-gold" />
                            <span className="text-sm font-medium text-neutral-brown-700">{book.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          {book.category && (
                            <span className="text-xs px-3 py-1.5 bg-accent-green/10 text-accent-green rounded-full font-medium">
                              {book.category}
                            </span>
                          )}
                          {book.language && (
                            <span className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                              {book.language}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/payment?bookId=${book.id}&author=${encodeURIComponent(book.author?.user?.name || '')}&type=temporary&price=${Math.floor(book.price * 0.1)}&title=${encodeURIComponent(book.title)}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-accent-green text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#7A8C74] transition-colors shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShoppingCart size={13} />
                            Buy Now
                          </Link>
                          <Link
                            href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-xl font-bold text-xs hover:bg-primary-dark transition-colors shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Package size={13} />
                            Hard Copy
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && books.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={36} className="text-neutral-brown-400" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-brown-900 mb-2 font-heading">No books found</h3>
              <p className="text-neutral-brown-600 mb-6">Try adjusting your search or filters to find what you&apos;re looking for</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all hover:shadow-lg"
                >
                  Clear Filters
                </button>
                <Link
                  href="/authors"
                  className="text-primary hover:text-primary-dark font-semibold flex items-center gap-2"
                >
                  Browse Authors <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
