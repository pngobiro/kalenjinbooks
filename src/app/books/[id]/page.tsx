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
  const [id, setId] = useState<string>('');
  const [book, setBook] = useState<BookType | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseType, setPurchaseType] = useState<'permanent' | 'temporary'>('permanent');

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
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
  const currentPrice = purchaseType === 'permanent' ? book.price : rentalPrice;
  const colorScheme = colorSchemes[book.title.length % colorSchemes.length];

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="44" height="44">
                <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" fill="#E07856"></path>
                <path d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" fill="#D4AF37"></path>
                <path d="M12 8C12 8 11 9.5 11 11C11 11.8 11.4 12.4 12 12.5C12.6 12.4 13 11.8 13 11C13 9.5 12 8 12 8Z" fill="#C85D3A"></path>
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
                <h3 className="font-bold text-2xl text-neutral-brown-900 font-heading mb-6">Choose Your Access</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Permanent */}
                  <div
                    onClick={() => setPurchaseType('permanent')}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${purchaseType === 'permanent'
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-neutral-brown-200 hover:border-primary/50 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${purchaseType === 'permanent' ? 'bg-primary' : 'bg-neutral-brown-100'}`}>
                        <Book size={24} className={purchaseType === 'permanent' ? 'text-white' : 'text-neutral-brown-400'} />
                      </div>
                      <div>
                        <span className="font-bold text-lg text-neutral-brown-900">Permanent Access</span>
                        <p className="text-xs text-neutral-brown-500">Own forever • Download & read anytime</p>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold ${purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-700'}`}>
                      KES {book.price}
                    </div>
                  </div>

                  {/* 24-Hour */}
                  <div
                    onClick={() => setPurchaseType('temporary')}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${purchaseType === 'temporary'
                        ? 'border-accent-green bg-accent-green/5 shadow-lg shadow-accent-green/10'
                        : 'border-neutral-brown-200 hover:border-accent-green/50 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${purchaseType === 'temporary' ? 'bg-accent-green' : 'bg-neutral-brown-100'}`}>
                        <FileText size={24} className={purchaseType === 'temporary' ? 'text-white' : 'text-neutral-brown-400'} />
                      </div>
                      <div>
                        <span className="font-bold text-lg text-neutral-brown-900">24-Hour Access</span>
                        <p className="text-xs text-neutral-brown-500">Read online • Perfect for sampling</p>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold ${purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-700'}`}>
                      KES {rentalPrice}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/payment?bookId=${book.id}&author=${encodeURIComponent(book.author?.user?.name || '')}&type=${purchaseType}&price=${currentPrice}&title=${encodeURIComponent(book.title)}`}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 font-bold py-4 px-8 rounded-full shadow-lg text-white transition-all hover:shadow-xl hover:-translate-y-1 ${purchaseType === 'permanent' ? 'bg-primary hover:bg-primary-dark' : 'bg-accent-green hover:bg-[#7A8C74]'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Proceed to Payment - KES {currentPrice}
                </Link>
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

                <Link
                  href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-700 rounded-full font-semibold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <path d="m3.3 7 8.7 5 8.7-5"></path>
                    <path d="M12 22V12"></path>
                  </svg>
                  Request Hard Copy
                </Link>
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