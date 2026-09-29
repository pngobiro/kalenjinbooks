'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Star, ArrowRight, Package, SlidersHorizontal, ChevronDown, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { trackBookClick } from '@/lib/analytics';

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

/** Editorial ordering for categories, so History leads as the strongest shelf. */
const CATEGORY_ORDER = [
  'History',
  'Non-Fiction',
  'Folklore',
  'Fiction',
  'Poetry',
  'Children',
  'Education',
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [books, setBooks] = useState<BookType[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors({ limit: 50 }).then((res) => setAuthors(res?.data || [])).catch(() => {});
  }, []);

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

  /* Only offer filters that can actually change the result set.
     A hardcoded category list showed 6 of 8 tabs that returned zero books, and
     the language / rating dropdowns could never narrow anything because every
     title is English and unrated. Both are now derived from the loaded data,
     so they grow back automatically as the catalogue does. */
  const availableCategories = useMemo(() => {
    const counts = new Map<string, number>();
    books.forEach((b) => {
      const c = b.category?.trim();
      if (c) counts.set(c, (counts.get(c) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a[0]);
        const bi = CATEGORY_ORDER.indexOf(b[0]);
        if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        return a[0].localeCompare(b[0]);
      })
      .map(([name, count]) => ({ name, count }));
  }, [books]);

  /** Hide the language filter unless there is more than one language. */
  const showLanguageFilter = languages.length > 1;

  /** Hide the rating filter unless at least one book carries a real rating. */
  const showRatingFilter = useMemo(
    () => books.some((b) => (b.rating || 0) > 0),
    [books]
  );

  /** Price buckets that overlap the actual price range, so none are dead ends. */
  const availablePriceRanges = useMemo(() => {
    if (books.length === 0) return priceRanges;
    const prices = books.map((b) => b.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return priceRanges.filter((r) => {
      if (r.value === 'all') return true;
      if (r.value === 'under-500') return min < 500;
      if (r.value === 'over-3000') return max > 3000;
      const [lo, hi] = r.value.split('-').map(Number);
      return max >= lo && min <= hi;
    });
  }, [books]);

  /** Access filter is only meaningful when the catalogue has both kinds. */
  const showAccessFilter = useMemo(
    () => books.some((b) => b.isFreeReading) && books.some((b) => !b.isFreeReading),
    [books]
  );

  /** Author filter is only meaningful with more than one author on the shelf. */
  const showAuthorFilter = authors.length > 1;

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

    if (selectedAuthor !== 'All') {
      result = result.filter((b) => b.author?.id === selectedAuthor);
    }

    if (accessFilter !== 'all') {
      result = result.filter((b) => (accessFilter === 'free' ? !!b.isFreeReading : !b.isFreeReading));
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
  }, [books, selectedLanguage, priceRange, minRating, sortBy, selectedAuthor, accessFilter]);

  const hasClientFilters = selectedLanguage !== 'All' || priceRange !== 'all' || minRating > 0 || selectedAuthor !== 'All' || accessFilter !== 'all';

  function resetClientFilters() {
    setSelectedLanguage('All');
    setPriceRange('all');
    setMinRating(0);
    setSortBy('newest');
    setSelectedAuthor('All');
    setAccessFilter('all');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: '#2C2416',
          minHeight: '400px',
        }}
      >
        <img
          src="/images/books-illustration.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,36,22,0.9) 0%, rgba(44,36,22,0.68) 55%, rgba(44,36,22,0.5) 100%)' }}
        />
        <div className="page-container py-16 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.28em] mb-5"
              style={{ color: '#E8A87C' }}
            >
              The Catalogue
            </p>
            <h1
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: '#FFFCF5', lineHeight: '1.15' }}
            >
              Explore Our Book Collection
            </h1>
            <p
              className="text-sm md:text-base mb-8 max-w-2xl"
              style={{ color: 'rgba(255, 252, 245, 0.9)', lineHeight: '1.6' }}
            >
              The history, culture and theology of African peoples, written and
              preserved by African authors.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <label htmlFor="book-search" className="sr-only">
                Search books by title, author or genre
              </label>
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#6B5D52' }}
              />
              <input
                id="book-search"
                type="search"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-xl text-base"
                style={{
                  backgroundColor: '#FFFCF5',
                  color: '#2C2416',
                  border: '1px solid #E4D9C4',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="page-container py-12">

          {/* Shelves — derived from the loaded books, with counts */}
          {availableCategories.length > 0 && (
            <div className="mb-10">
              <p className="kr-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: '#6B5D52' }}>
                BROWSE BY SHELF
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setSelectedCategory('All')}
                  aria-pressed={selectedCategory === 'All'}
                  className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors border"
                  style={
                    selectedCategory === 'All'
                      ? { backgroundColor: '#2C2416', color: '#FFFCF5', borderColor: '#2C2416' }
                      : { backgroundColor: '#FFFCF5', color: '#5B4F42', borderColor: '#E4D9C4' }
                  }
                >
                  All
                  <span className="ml-1.5 opacity-60">{books.length}</span>
                </button>
                {availableCategories.map((cat) => {
                  const active = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      aria-pressed={active}
                      className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors border"
                      style={
                        active
                          ? { backgroundColor: '#2C2416', color: '#FFFCF5', borderColor: '#2C2416' }
                          : { backgroundColor: '#FFFCF5', color: '#5B4F42', borderColor: '#E4D9C4' }
                      }
                    >
                      {cat.name}
                      <span className="ml-1.5 opacity-60">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results count */}
          {!loading && (
            <div className="flex items-center justify-between mb-6">
              <p className="kr-mono text-[10px] tracking-[0.25em] text-[#6B5D52]">
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
                style={{ color: '#B4502A' }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Filters — each control only renders when it can change the results */}
        {!loading && !error && (showLanguageFilter || showAuthorFilter || showAccessFilter || showRatingFilter || availablePriceRanges.length > 1) && (
          <div
            className="flex flex-wrap items-center gap-3 mb-12 p-5 rounded-xl"
            style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}
          >
            <div className="flex items-center gap-2 mr-1" style={{ color: '#5B4F42' }}>
              <SlidersHorizontal size={16} />
              <span className="text-sm font-semibold">Refine</span>
            </div>

            {showAuthorFilter && (
              <div className="relative">
                <label htmlFor="filter-author" className="sr-only">
                  Filter by author
                </label>
                <select
                  id="filter-author"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                  style={{ backgroundColor: '#F5F1E8', color: '#2C2416', borderColor: '#E4D9C4' }}
                >
                  <option value="All">All Authors</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name || 'Unknown Author'}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
              </div>
            )}

            {showAccessFilter && (
              <div className="relative">
                <label htmlFor="filter-access" className="sr-only">
                  Filter by access
                </label>
                <select
                  id="filter-access"
                  value={accessFilter}
                  onChange={(e) => setAccessFilter(e.target.value as 'all' | 'free' | 'paid')}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                  style={{ backgroundColor: '#F5F1E8', color: '#2C2416', borderColor: '#E4D9C4' }}
                >
                  <option value="all">Free &amp; Paid</option>
                  <option value="free">Free to Read</option>
                  <option value="paid">Paid</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
              </div>
            )}

            {availablePriceRanges.length > 1 && (
              <div className="relative">
                <label htmlFor="filter-price" className="sr-only">
                  Filter by price
                </label>
                <select
                  id="filter-price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                  style={{ backgroundColor: '#F5F1E8', color: '#2C2416', borderColor: '#E4D9C4' }}
                >
                  {availablePriceRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
              </div>
            )}

            {showLanguageFilter && (
              <div className="relative">
                <label htmlFor="filter-language" className="sr-only">
                  Filter by language
                </label>
                <select
                  id="filter-language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                  style={{ backgroundColor: '#F5F1E8', color: '#2C2416', borderColor: '#E4D9C4' }}
                >
                  <option value="All">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
              </div>
            )}

            {showRatingFilter && (
              <div className="relative">
                <label htmlFor="filter-rating" className="sr-only">
                  Filter by rating
                </label>
                <select
                  id="filter-rating"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                  style={{ backgroundColor: '#F5F1E8', color: '#2C2416', borderColor: '#E4D9C4' }}
                >
                  {ratingOptions.map((rating) => (
                    <option key={rating.value} value={rating.value}>{rating.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
              </div>
            )}

            <div className="relative ml-auto">
              <label htmlFor="filter-sort" className="sr-only">
                Sort results
              </label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                style={{ backgroundColor: '#F5F1E8', color: '#2C2416', borderColor: '#E4D9C4' }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
              <div className="absolute inset-0 border-4 rounded-full animate-spin" style={{ borderColor: '#B4502A', borderTopColor: 'transparent' }}></div>
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

        {/* Books Grid — cover-forward cards, buy links given real weight */}
        {!loading && !error && visibleBooks.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {visibleBooks.map((book) => {
              // Parse the external purchase links up front so the card can lead
              // with them; every title in the current catalogue has at least one.
              let links: Array<{ label: string; url: string }> = [];
              try {
                const parsed = book.purchaseLinks ? JSON.parse(book.purchaseLinks) : [];
                if (Array.isArray(parsed)) links = parsed.filter((l: any) => l && l.url);
              } catch { /* ignore malformed data */ }

              return (
                <div key={book.id} className="group flex flex-col">
                  {/* Cover */}
                  <Link
                    href={`/books/${book.id}`}
                    onClick={() => trackBookClick(book.id, { category: book.category, price: book.price })}
                    className="relative block aspect-[2/3] rounded-md overflow-hidden"
                    style={{ backgroundColor: '#E4D9C4' }}
                  >
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                        <BookOpen size={30} className="text-white/50" />
                        <p className="kr-display italic text-white/80 text-center text-sm line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                    )}

                    {book.category && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: '#B4502A', color: '#FFFCF5' }}
                        >
                          {book.category}
                        </span>
                      </div>
                    )}

                    {/* Free-reading flag persists on the cover; it is the single
                        most useful signal and was previously hover-only. */}
                    {book.isFreeReading && (
                      <div className="absolute top-3 right-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: '#2C2416', color: '#B6D3B2' }}
                        >
                          <BookOpen size={11} />
                          Free
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex flex-col flex-1 pt-4">
                    <h3
                      className="font-heading text-base font-semibold leading-snug line-clamp-2 mb-1.5"
                      style={{ color: '#2C2416' }}
                    >
                      <Link
                        href={`/books/${book.id}`}
                        onClick={() => trackBookClick(book.id, { category: book.category, price: book.price })}
                        className="hover:text-primary transition-colors"
                      >
                        {book.title}
                      </Link>
                    </h3>

                    <p className="text-xs mb-3 line-clamp-1" style={{ color: '#6B5D52' }}>
                      {book.author?.user?.name || 'Unknown Author'}
                      {book.language ? ` · ${book.language}` : ''}
                    </p>

                    {/* Price + rating shown once, not duplicated by a hover overlay */}
                    <div
                      className="flex items-center justify-between gap-2 mb-4 pb-4 border-b"
                      style={{ borderColor: '#E4D9C4' }}
                    >
                      {book.isFreeReading ? (
                        <span
                          className="inline-flex items-center gap-1.5 text-sm font-bold"
                          style={{ color: '#4F6D4C' }}
                        >
                          <BookOpen size={14} />
                          Free to Read
                        </span>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: '#B4502A' }}>
                          KES {book.price.toLocaleString()}
                        </span>
                      )}
                      {book.rating > 0 && (
                        <span
                          className="inline-flex items-center gap-1 text-xs"
                          style={{ color: '#5B4F42' }}
                        >
                          <Star size={12} className="fill-star text-star" />
                          {book.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Where to actually get it */}
                    <div className="mt-auto flex flex-col gap-2">
                      {links.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {links.map((l, i) => (
                            <a
                              key={i}
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                              style={{
                                backgroundColor: '#F5F1E8',
                                color: '#B4502A',
                                border: '1px solid #E4D9C4',
                              }}
                            >
                              <ExternalLink size={11} />
                              {l.label || 'Buy'}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {book.isFreeReading && (
                          <Link
                            href={`/book/viewer/${book.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-xs transition-colors"
                            style={{ backgroundColor: '#4F6D4C', color: '#FFFCF5' }}
                          >
                            <BookOpen size={13} />
                            Read
                          </Link>
                        )}
                        <Link
                          href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                          className={`${book.isFreeReading ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-xs transition-opacity hover:opacity-90`}
                          style={{ backgroundColor: '#B4502A', color: '#FFFCF5' }}
                        >
                          <Package size={13} />
                          Hard Copy
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visibleBooks.length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5F1E8' }}>
              <BookOpen size={36} style={{ color: '#B4502A' }} />
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
                style={{ backgroundColor: '#B4502A', color: '#FFFCF5' }}
              >
                Clear Filters
              </button>
              <Link
                href="/authors"
                className="flex items-center gap-2 font-semibold transition-colors"
                style={{ color: '#B4502A' }}
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
