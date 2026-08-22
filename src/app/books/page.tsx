'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Star, ArrowRight, Compass, Package, SlidersHorizontal, ChevronDown, Mountain, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';
import { trackBookClick } from '@/lib/analytics';

const categories = ['All', 'Fiction', 'Non-Fiction', 'Folklore', 'History', 'Poetry', 'Children', 'Education'];

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const priceRanges = [
  { value: 'all', label: 'Any price' },
  { value: 'under-500', label: 'Under KES 500' },
  { value: '500-1000', label: 'KES 500 – 1,000' },
  { value: '1000-3000', label: 'KES 1,000 – 3,000' },
  { value: 'over-3000', label: 'Over KES 3,000' },
];

const ratingOptions = [
  { value: 0, label: 'Any rating' },
  { value: 3, label: '3★ & up' },
  { value: 4, label: '4★ & up' },
  { value: 4.5, label: '4.5★ & up' },
];

// Rift Valley highlands gradients — matches the rest of the trail.

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        const params: any = { limit: 100 };

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

  const languages = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.language) set.add(b.language);
    });
    return Array.from(set).sort();
  }, [books]);

  const visibleBooks = useMemo(() => {
    let result = books;

    if (selectedLanguage !== 'All') {
      result = result.filter((b) => b.language === selectedLanguage);
    }

    if (priceRange !== 'all') {
      if (priceRange === 'under-500') {
        result = result.filter((b) => b.price < 500);
      } else if (priceRange === 'over-3000') {
        result = result.filter((b) => b.price > 3000);
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        result = result.filter((b) => b.price >= min && b.price <= max);
      }
    }

    if (minRating > 0) {
      result = result.filter((b) => (b.rating || 0) >= minRating);
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        sorted.sort((a, b) => {
          const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return bt - at;
        });
    }
    return sorted;
  }, [books, selectedLanguage, priceRange, minRating, sortBy]);

  const hasClientFilters = selectedLanguage !== 'All' || priceRange !== 'all' || minRating > 0;

  function resetClientFilters() {
    setSelectedLanguage('All');
    setPriceRange('all');
    setMinRating(0);
    setSortBy('newest');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2C2416 0%, #3A2E57 100%)',
          minHeight: '400px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: '#FFFCF5', lineHeight: '1.15' }}
            >
              Explore Our Book Collection
            </h1>
            <p 
              className="text-sm md:text-base mb-8 max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 252, 245, 0.9)', lineHeight: '1.6' }}
            >
              Discover authentic Kalenjin literature from folklore to modern fiction. Browse our growing library of books by local authors.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#A89888' }} />
              <input
                type="search"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-xl focus:outline-none focus:ring-2 text-base shadow-lg"
                style={{ 
                  backgroundColor: '#FFFCF5',
                  color: '#2C2416',
                  borderColor: '#E4D9C4',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

          {/* Categories */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all shadow-sm border ${
                  selectedCategory === category
                    ? 'bg-[#A8451F] text-white border-[#A8451F] shadow-[#A8451F]/30'
                    : 'bg-[#FBF7EE] text-[#5B4F42] border-[#E4D9C4] hover:bg-white hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="kr-mono text-[10px] tracking-[0.25em] text-[#8A7B68]">
                {visibleBooks.length} VOLUME{visibleBooks.length === 1 ? '' : 'S'} ON THE SHELF
                {selectedCategory !== 'All' && (
                  <span className="ml-1">· {selectedCategory.toUpperCase()}</span>
                )}
                {searchQuery && (
                  <span className="ml-1">· MATCHING “{searchQuery.toUpperCase()}”</span>
                )}
              </p>
            {(searchQuery || hasClientFilters) && (
              <button
                onClick={() => { setSearchQuery(''); resetClientFilters(); }}
                className="text-sm font-semibold transition-colors"
                style={{ color: '#D97846' }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center gap-3 mb-10 p-6 rounded-xl" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
            <div className="flex items-center gap-2 mr-2" style={{ color: '#5B4F42' }}>
              <SlidersHorizontal size={16} />
              <span className="text-sm font-semibold">Filters:</span>
            </div>

            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer"
                style={{
                  backgroundColor: '#F5F1E8',
                  color: '#2C2416',
                  borderColor: '#E4D9C4',
                }}
              >
                <option value="All">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A89888' }} />
            </div>

            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer"
                style={{
                  backgroundColor: '#F5F1E8',
                  color: '#2C2416',
                  borderColor: '#E4D9C4',
                }}
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A89888' }} />
            </div>

            <div className="relative">
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer"
                style={{
                  backgroundColor: '#F5F1E8',
                  color: '#2C2416',
                  borderColor: '#E4D9C4',
                }}
              >
                {ratingOptions.map((rating) => (
                  <option key={rating.value} value={rating.value}>{rating.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A89888' }} />
            </div>

            <div className="relative ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer"
                style={{
                  backgroundColor: '#F5F1E8',
                  color: '#2C2416',
                  borderColor: '#E4D9C4',
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A89888' }} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
              <div className="absolute inset-0 border-4 rounded-full animate-spin" style={{ borderColor: '#D97846', borderTopColor: 'transparent' }}></div>
            </div>
            <p className="text-sm font-medium" style={{ color: '#5B4F42' }}>Loading books...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && visibleBooks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6">
              {visibleBooks.map((book) => {
                return (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group w-full max-w-[270px]"
                    onClick={() => trackBookClick(book.id, { category: book.category, price: book.price })}
                  >
                    <div className="h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col" style={{ backgroundColor: '#FFFCF5' }}>
                      {/* Book Cover */}
                      <div className="relative aspect-[2/3] overflow-hidden" style={{ backgroundColor: '#E4D9C4' }}>
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <BookOpen size={34} className="text-white/40" />
                            <p className="kr-display italic text-white/70 px-4 text-center text-sm line-clamp-3">
                              {book.title}
                            </p>
                          </div>
                        )}

                        {book.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded text-xs font-semibold uppercase" style={{ backgroundColor: 'rgba(217, 120, 70, 0.95)', color: '#FFFCF5' }}>
                              {book.category}
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="rounded-lg p-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(255, 252, 245, 0.95)' }}>
                              <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: '#7A9B76' }}>
                                <BookOpen size={14} />
                                Free to Read
                              </span>
                              <span className="flex items-center gap-1 text-xs" style={{ color: '#5B4F42' }}>
                                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                                {book.rating?.toFixed(1) || '0.0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-heading text-lg font-bold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors" style={{ color: '#2C2416' }}>
                          {book.title}
                        </h3>
                        <p className="text-xs mb-3" style={{ color: '#A89888' }}>
                          {book.author?.user?.name || 'Unknown Author'}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: '#7A9B76' }}>
                            <BookOpen size={15} />
                            Free to Read
                          </span>
                          <span className="flex items-center gap-1 text-sm" style={{ color: '#5B4F42' }}>
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {book.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>

                        {book.language && (
                          <div className="flex gap-2 mb-4">
                            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#F5F1E8', color: '#5B4F42' }}>
                              {book.language}
                            </span>
                          </div>
                        )}

                        <div className="mt-auto flex gap-2">
                          <Link
                            href={`/book/viewer/${book.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-xs transition-colors shadow-sm"
                            style={{ backgroundColor: '#7A9B76', color: '#FFFCF5' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookOpen size={13} />
                            Read Free
                          </Link>
                          <Link
                            href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-xs transition-colors shadow-sm"
                            style={{ backgroundColor: '#D97846', color: '#FFFCF5' }}
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
        {!loading && !error && visibleBooks.length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5F1E8' }}>
              <BookOpen size={36} style={{ color: '#D97846' }} />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-2" style={{ color: '#2C2416' }}>
              No books found
            </h3>
            <p className="text-sm mb-6" style={{ color: '#5B4F42' }}>
              Try adjusting your search or filters to find what you're looking for
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); resetClientFilters(); }}
                className="px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                style={{ backgroundColor: '#D97846', color: '#FFFCF5' }}
              >
                Clear Filters
              </button>
              <Link
                href="/authors"
                className="flex items-center gap-2 font-semibold transition-colors"
                style={{ color: '#D97846' }}
              >
                Browse Authors <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
