'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Book, SlidersHorizontal, X, Star, ShoppingCart, ArrowLeft } from 'lucide-react';

// Mock data
const books = [
  {
    id: '1',
    title: 'Kalenjin Folklore Tales',
    author: 'John Kamau',
    price: 500,
    rating: 4.5,
    reviewCount: 24,
    category: 'Folklore',
    language: 'Kalenjin',
    coverImage: '/books/folklore-tales.png',
  },
  {
    id: '2',
    title: 'Traditional Wisdom',
    author: 'Jane Kiplagat',
    price: 750,
    rating: 4.8,
    reviewCount: 18,
    category: 'Non-Fiction',
    language: 'Bilingual',
    coverImage: '/books/traditional-wisdom.png',
  },
  {
    id: '3',
    title: 'Cultural Heritage',
    author: 'Mike Korir',
    price: 600,
    rating: 4.3,
    reviewCount: 31,
    category: 'History',
    language: 'English',
    coverImage: '/books/cultural-heritage.png',
  },
  {
    id: '4',
    title: 'Children Stories',
    author: 'Sarah Chebet',
    price: 400,
    rating: 4.7,
    reviewCount: 42,
    category: 'Children',
    language: 'Kalenjin',
    coverImage: '/books/children-stories.png',
  },
  {
    id: '5',
    title: 'Modern Kalenjin Poetry',
    author: 'David Ruto',
    price: 550,
    rating: 4.6,
    reviewCount: 15,
    category: 'Poetry',
    language: 'Kalenjin',
  },
  {
    id: '6',
    title: 'Educational Guide',
    author: 'Mary Jepkoech',
    price: 800,
    rating: 4.9,
    reviewCount: 28,
    category: 'Education',
    language: 'Bilingual',
  },
  {
    id: '7',
    title: 'Historical Narratives',
    author: 'Peter Kibet',
    price: 650,
    rating: 4.4,
    reviewCount: 19,
    category: 'History',
    language: 'English',
  },
  {
    id: '8',
    title: 'Fiction Adventures',
    author: 'Grace Chepkemoi',
    price: 700,
    rating: 4.5,
    reviewCount: 33,
    category: 'Fiction',
    language: 'Kalenjin',
  },
];

const categories = ['All', 'Fiction', 'Non-Fiction', 'Folklore', 'History', 'Poetry', 'Children', 'Education'];
const languages = ['All Languages', 'Kalenjin', 'English', 'Bilingual'];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [priceRange, setPriceRange] = useState(2000);
  const [showFilters, setShowFilters] = useState(false);

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesPrice = book.price <= priceRange;
    const matchesLanguage = selectedLanguage === 'All Languages' || book.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesPrice && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-neutral-cream w-full">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-brown-500/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Book className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-neutral-brown-900">AfriReads</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium"
              >
                Home
              </Link>
              <Link
                href="/dashboard/author"
                className="hidden sm:block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-all"
              >
                Author Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-accent-green/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-neutral-brown-700 hover:text-primary transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading">
                Browse Books
              </h1>
              <p className="text-lg text-neutral-brown-700 mt-2">
                Discover authentic Kalenjin literature from talented authors
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-700" size={20} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-md focus:shadow-lg focus:outline-none border-2 border-transparent focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-neutral-brown-700 hover:bg-primary/10 border border-neutral-brown-500/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filters Toggle & Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-neutral-brown-700">
            Showing <span className="font-semibold text-neutral-brown-900">{filteredBooks.length}</span> of{' '}
            <span className="font-semibold text-neutral-brown-900">{books.length}</span> books
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 hover:border-primary transition-all"
          >
            <SlidersHorizontal size={18} />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-8 border border-neutral-brown-500/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-neutral-brown-900">Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} className="text-neutral-brown-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Language Filter */}
              <div>
                <h4 className="font-semibold text-neutral-brown-900 mb-3">Language</h4>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        checked={selectedLanguage === lang}
                        onChange={() => setSelectedLanguage(lang)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-neutral-brown-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-neutral-brown-900 mb-3">
                  Price Range (Max: KES {priceRange})
                </h4>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-neutral-brown-700 mt-2">
                  <span>KES 0</span>
                  <span>KES 2,000</span>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedLanguage('All Languages');
                    setPriceRange(2000);
                    setSearchQuery('');
                  }}
                  className="w-full bg-neutral-brown-500/10 hover:bg-neutral-brown-500/20 text-neutral-brown-900 font-medium px-4 py-2 rounded-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    {/* Book Cover */}
                    <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <p className="text-sm font-semibold text-neutral-brown-900 text-center line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-neutral-brown-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <span className="text-white font-semibold">Quick View</span>
                        <div className="flex items-center gap-2">
                          <ShoppingCart size={18} className="text-white" />
                          <span className="text-white text-sm">Add to Cart</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-brown-900 line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-neutral-brown-700 mb-2">{book.author}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(book.rating) ? 'fill-accent-gold text-accent-gold' : 'text-neutral-brown-500/20'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-brown-700">({book.reviewCount})</span>
                      </div>

                      {/* Price and Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary">
                          KES {book.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-accent-green/20 text-accent-green rounded-full">
                          {book.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                          {book.language}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all font-medium">
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all">
                2
              </button>
              <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all">
                3
              </button>
              <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all font-medium">
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Book size={48} className="text-neutral-brown-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">
              No books found
            </h3>
            <p className="text-neutral-brown-700 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLanguage('All Languages');
                setPriceRange(2000);
                setSearchQuery('');
              }}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}