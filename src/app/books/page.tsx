'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Book, SlidersHorizontal, X, Star, ArrowLeft } from 'lucide-react';

const books = [
  { id: '1', title: 'Kalenjin Folklore Tales', author: 'John Kamau', price: 500, rating: 4.5, category: 'Folklore', language: 'Kalenjin', image: '/books/folklore-tales.png' },
  { id: '2', title: 'Traditional Wisdom', author: 'Jane Kiplagat', price: 750, rating: 4.8, category: 'Non-Fiction', language: 'Bilingual', image: '/books/traditional-wisdom.png' },
  { id: '3', title: 'Cultural Heritage', author: 'Mike Korir', price: 600, rating: 4.3, category: 'History', language: 'English', image: '/books/cultural-heritage.png' },
  { id: '4', title: 'Children Stories', author: 'Sarah Chebet', price: 400, rating: 4.7, category: 'Children', language: 'Kalenjin', image: '/books/children-stories.png' },
  { id: '5', title: 'Modern Kalenjin Poetry', author: 'David Ruto', price: 550, rating: 4.6, category: 'Poetry', language: 'Kalenjin' },
  { id: '6', title: 'Educational Guide', author: 'Mary Jepkoech', price: 800, rating: 4.9, category: 'Education', language: 'Bilingual' },
  { id: '7', title: 'Historical Narratives', author: 'Peter Kibet', price: 650, rating: 4.4, category: 'History', language: 'English' },
  { id: '8', title: 'Fiction Adventures', author: 'Grace Chepkemoi', price: 700, rating: 4.5, category: 'Fiction', language: 'Kalenjin' },
];

const categories = ['All', 'Fiction', 'Non-Fiction', 'Folklore', 'History', 'Poetry', 'Children', 'Education'];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
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
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-brown-700 hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-neutral-brown-600 mb-6">
            Showing <strong>{filteredBooks.length}</strong> books
          </p>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="group">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className={`aspect-[3/4] rounded-xl mb-4 overflow-hidden ${book.image ? 'bg-neutral-cream' : 'bg-gradient-to-br from-primary/20 to-accent-green/20'}`}>
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Book size={48} className="text-neutral-brown-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-neutral-brown-900 mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-neutral-brown-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">KES {book.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-accent-gold text-accent-gold" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-accent-green/10 text-accent-green rounded-full">{book.category}</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{book.language}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredBooks.length === 0 && (
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
