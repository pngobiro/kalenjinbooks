'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Book, Star, ArrowLeft } from 'lucide-react';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';

const categories = ['All', 'Fiction', 'Non-Fiction', 'Folklore', 'History', 'Poetry', 'Children', 'Education'];

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

    loadBooks();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <KaleeReadsLogo size={44} />
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/books" className="text-primary font-medium">Books</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">About</Link>
            </div>

            <Link href="/dashboard/author" className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-full transition-all">
              Author Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-neutral-brown-500 hover:text-primary">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading">Browse Books</h1>
              <p className="text-neutral-brown-700 mt-1">Discover authentic Kalenjin literature</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={20} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full pl-12 pr-4 py-4 bg-neutral-cream rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Categories */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-brown-700 hover:bg-primary/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-neutral-brown-600 mb-6">
              Showing <strong>{books.length}</strong> books
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-neutral-brown-600">Loading books...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Books Grid */}
          {!loading && !error && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`} className="group">
                  <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                    <div className={`aspect-[3/4] rounded-xl mb-4 overflow-hidden ${book.coverImage ? 'bg-neutral-cream' : 'bg-gradient-to-br from-primary/20 to-accent-green/20'}`}>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Book size={48} className="text-neutral-brown-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-neutral-brown-900 mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-neutral-brown-600 mb-2">{book.author?.user?.name || 'Unknown Author'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">KES {book.price}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-accent-gold text-accent-gold" />
                        <span className="text-sm">{book.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {book.category && (
                        <span className="text-xs px-2 py-1 bg-accent-green/10 text-accent-green rounded-full">{book.category}</span>
                      )}
                      {book.language && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{book.language}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && books.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center">
              <Book size={48} className="text-neutral-brown-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">No books found</h3>
              <p className="text-neutral-brown-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="bg-primary text-white px-6 py-2 rounded-full"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
