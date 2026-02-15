'use client';

import { Star, Book, ArrowLeft, User, ChevronRight, Sparkles, FileText, Calendar, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchBookById, fetchBooks, type Book as BookType } from '@/lib/api/books';
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
  const [relatedBooks, setRelatedBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      loadBook(p.id);
    });
  }, [params]);

  async function loadBook(bookId: string) {
    try {
      setLoading(true);
      const [bookResponse, relatedResponse] = await Promise.all([
        fetchBookById(bookId),
        fetchBooks({ limit: 4 })
      ]);
      setBook(bookResponse.data);
      setRelatedBooks(relatedResponse.data?.filter((b: BookType) => b.id !== bookId) || []);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-brown-200 rounded-full mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-brown-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <Book size={64} className="text-neutral-brown-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2 font-heading">Book Not Found</h1>
          <Link href="/books" className="text-primary hover:underline">Browse all books</Link>
        </div>
      </div>
    );
  }

  const rentalPrice = Math.floor(book.price * 0.1);
  const colorScheme = colorSchemes[book.title.length % colorSchemes.length];

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
              <Link href="/books" className="text-primary font-medium">Books</Link>
              <Link href="/blogs" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Blogs</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">About</Link>
            </div>

            <Link href="/books" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Books</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-green rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-brown-300 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/books" className="hover:text-white">Books</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium truncate max-w-[200px]">{book.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="relative w-64 md:w-80 aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                      <div className="text-center p-6">
                        <Book size={64} className="text-white/80 mx-auto mb-2" />
                        <p className="text-white font-heading font-bold text-xl line-clamp-3">{book.title}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Decorative shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-full"></div>
              </div>
            </div>

            {/* Book Info */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Sparkles size={16} className="text-accent-gold" />
                <span className="text-white/90 text-sm font-medium">{book.category || 'Kalenjin Literature'}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4 leading-tight">
                {book.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-neutral-brown-300 text-sm">Author</p>
                    <p className="text-white font-semibold">{book.author?.user?.name || 'Unknown Author'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="fill-accent-gold text-accent-gold" />
                  <span className="text-white font-bold">{book.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-neutral-brown-400">({book.reviewCount || 0} reviews)</span>
                </div>
              </div>

              <p className="text-neutral-brown-200 text-lg mb-8 max-w-xl">
                {book.description?.slice(0, 200) || 'Discover the rich cultural heritage and stories through this captivating piece of Kalenjin literature.'}
                {book.description && book.description.length > 200 && '...'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="text-4xl font-bold text-white">KES {book.price}</div>
                {book.price > 100 && (
                  <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-sm font-medium">
                    Best Value
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
          </svg>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="py-8 -mt-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Purchase Options */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-2xl text-neutral-brown-900 font-heading mb-6">Purchase Options</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* 24-Hour Access */}
                  <div className="rounded-2xl p-6 border-2 border-accent-green bg-accent-green/5 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent-green">
                        <FileText size={24} className="text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-lg text-neutral-brown-900">24-Hour Access</span>
                        <p className="text-xs text-neutral-brown-500">Read online • Perfect for sampling</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-accent-green mb-4">
                      KES {rentalPrice}
                    </div>
                    <Link
                      href={`/payment?bookId=${book.id}&author=${encodeURIComponent(book.author?.user?.name || '')}&type=temporary&price=${rentalPrice}&title=${encodeURIComponent(book.title)}`}
                      className="w-full inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-full shadow-md text-white transition-all hover:shadow-lg hover:-translate-y-0.5 bg-accent-green hover:bg-[#7A8C74]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Buy Now
                    </Link>
                  </div>

                  {/* Request Hard Copy */}
                  <div className="rounded-2xl p-6 border-2 border-primary bg-primary/5 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                          <path d="m3.3 7 8.7 5 8.7-5"></path>
                          <path d="M12 22V12"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-lg text-neutral-brown-900">Hard Copy</span>
                        <p className="text-xs text-neutral-brown-500">Physical book • Delivered to you</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-4">
                      Request
                    </div>
                    <Link
                      href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-full shadow-md text-white transition-all hover:shadow-lg hover:-translate-y-0.5 bg-primary hover:bg-primary-dark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Request Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="border-l border-neutral-brown-200 pl-8">
                <h4 className="font-bold text-neutral-brown-900 mb-4">Book Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-cream flex items-center justify-center">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-brown-500">Pages</p>
                      <p className="font-semibold text-neutral-brown-900">{book.previewPages * 5 || '~150'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-cream flex items-center justify-center">
                      <Globe size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-brown-500">Language</p>
                      <p className="font-semibold text-neutral-brown-900">{book.language || 'English'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-cream flex items-center justify-center">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-brown-500">Published</p>
                      <p className="font-semibold text-neutral-brown-900">
                        {book.publishedAt ? new Date(book.publishedAt).getFullYear() : '2024'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-brown-200">
                  <ShareButtons title={`${book.title} - KaleeReads`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h3 className="font-bold text-2xl text-neutral-brown-900 font-heading mb-6">About This Book</h3>
            <div className="prose prose-brown max-w-none">
              <p className="text-neutral-brown-700 leading-relaxed text-lg whitespace-pre-line">
                {book.description || 'No description available for this book. Discover the rich cultural heritage and stories through this captivating piece of Kalenjin literature.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="font-bold text-3xl text-neutral-brown-900 font-heading mb-8 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.slice(0, 4).map((relatedBook, index) => {
                const relatedColorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <Link key={relatedBook.id} href={`/books/${relatedBook.id}`} className="group">
                    <div className="bg-neutral-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className={`aspect-[2/3] relative overflow-hidden ${!relatedBook.coverImage ? `bg-gradient-to-br ${relatedColorScheme}` : ''}`}>
                        {relatedBook.coverImage ? (
                          <img src={relatedBook.coverImage} alt={relatedBook.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-neutral-brown-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedBook.title}
                        </h4>
                        <p className="text-sm text-neutral-brown-600 mb-3">{relatedBook.author?.user?.name || 'Unknown Author'}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">KES {relatedBook.price}</span>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-accent-gold text-accent-gold" />
                            <span className="text-sm">{relatedBook.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}