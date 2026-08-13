'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Star, ArrowRight, Compass, ShoppingCart, Package, SlidersHorizontal, ChevronDown, Mountain, MapPin } from 'lucide-react';
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
const trailGradients = [
  'from-[#A8451F] to-[#E0A83E]',
  'from-[#33502F] to-[#5C7A4E]',
  'from-[#2A2244] to-[#4A3B6B]',
  'from-[#8C3B2E] to-[#C97B3D]',
  'from-[#1F4D3D] to-[#3D7A5C]',
  'from-[#5B3A29] to-[#9C6B3E]',
];

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
    <div className="min-h-screen bg-[#F3EEE2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .kr-display { font-family: 'Instrument Serif', Georgia, serif; }
        .kr-body { font-family: 'Manrope', system-ui, sans-serif; }
        .kr-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .kr-root, .kr-root * { font-family: 'Manrope', system-ui, sans-serif; }

        @keyframes krRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kr-rise { animation: krRise 0.7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .kr-rise { animation: none; }
        }
      `}</style>

      <div className="kr-root">
        <Navbar />

        {/* Hero — dusk over the escarpment */}
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#3A2E57_0%,_#1B1730_55%,_#140F24_100%)]">
          <svg
            className="absolute inset-x-0 bottom-0 w-full h-8 md:h-10 text-[#140F24]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 L120,55 L240,90 L360,40 L480,70 L600,20 L720,60 L840,35 L960,75 L1080,45 L1200,65 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10 md:pt-14 md:pb-12">
            <div className="max-w-3xl mx-auto text-center kr-rise">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <Compass size={13} className="text-[#E0A83E]" />
                <span className="kr-mono text-[10px] tracking-[0.25em] text-[#E0A83E]">
                  THE GRANARY · KERIO VALLEY
                </span>
              </div>
              <h1 className="kr-display italic text-3xl md:text-[2.6rem] lg:text-5xl text-white leading-[1.08] mb-3">
                The shelf that travels with you.
              </h1>
              <p className="text-sm md:text-base text-[#D8CFE8] leading-relaxed mb-6 max-w-2xl mx-auto">
                Folklore carried by firelight, cultural history, and the everyday lives of a
                people who have always known how to cover distance — all waiting on the trail.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A7B68]" />
                <input
                  type="search"
                  placeholder="Search by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-3.5 bg-[#FBF7EE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E0A83E]/40 text-[#241E1A] text-sm shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Waypoint header */}
          <div className="relative py-2 select-none mb-8">
            <svg
              viewBox="0 0 800 44"
              className="w-full h-10 text-[#A8451F]/25"
              preserveAspectRatio="none"
            >
              <path
                d="M0,24 L260,24 L300,8 L336,36 L372,14 L404,24 L800,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="336" cy="24" r="5" fill="#A8451F" />
              <circle cx="336" cy="24" r="9" fill="none" stroke="#A8451F" strokeOpacity="0.35" strokeWidth="1.5" />
            </svg>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 -mt-3">
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">THE GRANARY</span>
              <Mountain size={16} className="text-[#A8451F]" />
              <h2 className="kr-display italic text-3xl md:text-[2.6rem] leading-none text-[#241E1A]">
                Open the Full Shelf
              </h2>
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">1,800M · KERIO VALLEY</span>
            </div>
          </div>

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
                  className="text-xs text-[#8A7B68] hover:text-[#A8451F] flex items-center gap-1 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Filter toolbar */}
          {!loading && !error && (
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <div className="inline-flex items-center gap-2 text-[#5B4F42]">
                <SlidersHorizontal size={15} />
                <span className="kr-mono text-[10px] tracking-[0.2em]">FILTERS</span>
              </div>

              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-[#FBF7EE] rounded-full border border-[#E4D9C4] text-sm font-medium text-[#5B4F42] focus:outline-none focus:ring-2 focus:ring-[#E0A83E]/40 hover:border-[#C9BEA9] transition-colors cursor-pointer"
                >
                  <option value="All">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B68]" />
              </div>

              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-[#FBF7EE] rounded-full border border-[#E4D9C4] text-sm font-medium text-[#5B4F42] focus:outline-none focus:ring-2 focus:ring-[#E0A83E]/40 hover:border-[#C9BEA9] transition-colors cursor-pointer"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B68]" />
              </div>

              <div className="relative">
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-[#FBF7EE] rounded-full border border-[#E4D9C4] text-sm font-medium text-[#5B4F42] focus:outline-none focus:ring-2 focus:ring-[#E0A83E]/40 hover:border-[#C9BEA9] transition-colors cursor-pointer"
                >
                  {ratingOptions.map((rating) => (
                    <option key={rating.value} value={rating.value}>{rating.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B68]" />
              </div>

              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-[#FBF7EE] rounded-full border border-[#E4D9C4] text-sm font-medium text-[#5B4F42] focus:outline-none focus:ring-2 focus:ring-[#E0A83E]/40 hover:border-[#C9BEA9] transition-colors cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B68]" />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-[#e6ded0] rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#A8451F] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">
                UNPACKING THE SHELF…
              </span>
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
          {!loading && !error && visibleBooks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleBooks.map((book, index) => {
                const scheme = trailGradients[index % trailGradients.length];
                return (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group"
                    onClick={() => trackBookClick(book.id, { category: book.category, price: book.price })}
                  >
                    <div className="h-full rounded-3xl bg-[#FBF7EE] border border-[#E4D9C4] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col">
                      {/* Book Cover */}
                      <div className={`relative aspect-[2/3] overflow-hidden ${!book.coverImage ? `bg-gradient-to-br ${scheme}` : ''}`}>
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
                            <span className="px-2.5 py-1 bg-[#FBF7EE]/95 backdrop-blur-sm text-[#241E1A] text-[10px] font-semibold uppercase tracking-wide rounded-full shadow-sm">
                              {book.category}
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#140F24]/85 via-[#140F24]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="bg-[#FBF7EE]/95 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between">
                              <span className="font-bold text-[#A8451F]">KES {book.price.toLocaleString()}</span>
                              <span className="flex items-center gap-1 text-xs text-[#5B4F42]">
                                <Star size={13} className="fill-[#E0A83E] text-[#E0A83E]" />
                                {book.rating?.toFixed(1) || '0.0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="kr-display italic text-xl text-[#241E1A] leading-tight line-clamp-2 group-hover:text-[#A8451F] transition-colors mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#8A7B68] mb-3">{book.author?.user?.name || 'Unknown Author'}</p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-[#A8451F]">KES {book.price.toLocaleString()}</span>
                          <span className="flex items-center gap-1 text-sm text-[#5B4F42]">
                            <Star size={15} className="fill-[#E0A83E] text-[#E0A83E]" />
                            {book.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>

                        <div className="flex gap-2 mb-4">
                          {book.language && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 bg-[#EDE4D0] text-[#5B4F42] rounded-full font-medium">
                              <MapPin size={10} /> {book.language}
                            </span>
                          )}
                          {book.category && (
                            <span className="text-[10px] px-2.5 py-1 bg-[#A8451F]/10 text-[#A8451F] rounded-full font-medium">
                              {book.category}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto flex gap-2">
                          <Link
                            href={`/payment?bookId=${book.id}&author=${encodeURIComponent(book.author?.user?.name || '')}&type=temporary&price=${Math.floor(book.price * 0.1)}&title=${encodeURIComponent(book.title)}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#33502F] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#5C7A4E] transition-colors shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShoppingCart size={13} />
                            Buy Now
                          </Link>
                          <Link
                            href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#A8451F] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#8C3B2E] transition-colors shadow-sm"
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
            <div className="bg-[#FBF7EE] border border-[#E4D9C4] rounded-3xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-[#EDE4D0] flex items-center justify-center mx-auto mb-6">
                <BookOpen size={36} className="text-[#A8451F]" />
              </div>
              <h3 className="kr-display italic text-3xl text-[#241E1A] mb-2">Nothing on this stretch yet.</h3>
              <p className="text-sm text-[#8A7B68] mb-6">Try adjusting your search or filters to find what you&apos;re looking for</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); resetClientFilters(); }}
                  className="bg-[#A8451F] hover:bg-[#8C3B2E] text-white font-semibold px-8 py-3 rounded-full transition-all hover:shadow-lg"
                >
                  Clear Filters
                </button>
                <Link
                  href="/authors"
                  className="text-[#A8451F] hover:text-[#8C3B2E] font-semibold flex items-center gap-2 transition-colors"
                >
                  Browse Authors <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
