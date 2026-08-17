'use client';

import { Star, Book, ArrowLeft, User, ShoppingCart, Package, FileText, Calendar, Globe, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBookById, type Book as BookType } from '@/lib/api/books';
import ShareButtons from '@/components/ShareButtons';

// Color schemes for book covers
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

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      loadBook(p.id);
    });
  }, [params]);

  async function loadBook(bookId: string) {
    try {
      setLoading(true);
      const bookResponse = await fetchBookById(bookId);
      setBook(bookResponse.data || null);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#F5E6D3' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5E6D3' }}>
            <Book size={48} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
            Book Not Found
          </h1>
          <p className="text-gray-600 mb-8">The book you're looking for doesn't exist.</p>
          <Link 
            href="/books" 
            className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
          >
            Browse All Books
          </Link>
        </div>
      </div>
    );
  }

  const rentalPrice = Math.floor(book.price * 0.1);
  const colorScheme = colorSchemes[book.title.length % colorSchemes.length];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      <Navbar />

      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${colorScheme} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            href="/books" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Books</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="relative w-72 md:w-96 aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden ring-4 ring-white/30">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-8">
                      <div className="text-center">
                        <Book size={80} className="text-white/60 mx-auto mb-4" />
                        <p className="text-white font-bold text-2xl line-clamp-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {book.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-black/30 blur-2xl rounded-full"></div>
              </div>
            </div>

            {/* Book Info */}
            <div className="text-center lg:text-left">
              {book.category && (
                <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                  {book.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {book.title}
              </h1>

              {/* Author */}
              {book.author?.user?.name && (
                <Link 
                  href={`/authors/${book.author.id}`}
                  className="inline-flex items-center gap-3 mb-6 group"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <User size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white/80 text-sm">by</p>
                    <p className="text-white font-bold text-lg group-hover:underline">{book.author.user.name}</p>
                  </div>
                </Link>
              )}

              {/* Rating */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={24} 
                      className={i < Math.floor(book.rating || 0) ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'}
                    />
                  ))}
                </div>
                <span className="text-white font-bold text-xl">{book.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-white/80">({book.reviewCount || 0} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-white/95 text-lg leading-relaxed mb-8 max-w-2xl">
                {book.description?.slice(0, 250) || 'Discover the rich cultural heritage and stories through this captivating piece of Kalenjin literature.'}
                {book.description && book.description.length > 250 && '...'}
              </p>

              {/* Price */}
              <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-8">
                <span className="text-5xl font-bold text-white">KES {book.price.toLocaleString()}</span>
                {book.price > 100 && (
                  <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#7A9B76', color: '#FFFFFF' }}>
                    Best Value
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
          Purchase Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 24-Hour Access */}
          <div className="rounded-xl p-8 shadow-lg border-2 transition-all hover:shadow-2xl" style={{ backgroundColor: '#FFFCF5', borderColor: '#7A9B76' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7A9B76' }}>
                <FileText size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                  24-Hour Access
                </h3>
                <p className="text-sm text-gray-600">Read online • Perfect for sampling</p>
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: '#7A9B76' }}>
                KES {rentalPrice.toLocaleString()}
              </span>
            </div>

            <Link
              href={`/payment?bookId=${book.id}&author=${encodeURIComponent(book.author?.user?.name || '')}&type=temporary&price=${rentalPrice}&title=${encodeURIComponent(book.title)}`}
              className="w-full inline-flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: '#7A9B76', color: '#FFFFFF' }}
            >
              <ShoppingCart size={20} />
              Buy Now
            </Link>
          </div>

          {/* Hard Copy */}
          <div className="rounded-xl p-8 shadow-lg border-2 transition-all hover:shadow-2xl" style={{ backgroundColor: '#FFFCF5', borderColor: '#D97846' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D97846' }}>
                <Package size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                  Hard Copy
                </h3>
                <p className="text-sm text-gray-600">Physical book • Delivered to you</p>
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: '#D97846' }}>
                Request
              </span>
            </div>

            <Link
              href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
              className="w-full inline-flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
            >
              <Package size={20} />
              Request Now
            </Link>
          </div>
        </div>

        {/* Book Details & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                About This Book
              </h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {book.description || 'No description available for this book. Discover the rich cultural heritage and stories through this captivating piece of Kalenjin literature. This book offers a unique perspective on Kalenjin culture, traditions, and contemporary life.'}
                </p>
              </div>

              {book.tags && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E5D5C3' }}>
                  <h4 className="font-bold text-sm mb-3" style={{ color: '#2C2416' }}>Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.split(',').map((tag) => (
                      <span 
                        key={tag.trim()} 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
              <h4 className="font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Book Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5E6D3' }}>
                    <FileText size={20} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pages</p>
                    <p className="font-bold" style={{ color: '#2C2416' }}>{book.previewPages * 5 || '~150'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5E6D3' }}>
                    <Globe size={20} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Language</p>
                    <p className="font-bold" style={{ color: '#2C2416' }}>{book.language || 'English'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5E6D3' }}>
                    <Calendar size={20} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Published</p>
                    <p className="font-bold" style={{ color: '#2C2416' }}>
                      {book.publishedAt ? new Date(book.publishedAt).getFullYear() : '2024'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
              <h4 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <Share2 size={18} />
                Share This Book
              </h4>
              <ShareButtons title={`${book.title} - KaleeReads`} />
            </div>

            {/* Author CTA */}
            {book.author?.user?.name && (
              <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#2C2416' }}>
                <h4 className="text-white font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  More from {book.author.user.name.split(' ')[0]}
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Discover more books and stories from this author.
                </p>
                <Link 
                  href={`/authors/${book.author.id}`}
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                >
                  View Profile <ArrowLeft size={18} className="rotate-180" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
