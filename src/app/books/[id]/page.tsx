'use client';

export const runtime = 'edge';

import { Star, Book, ArrowLeft, User, Package, FileText, Calendar, Globe, Share2, BookOpen, Heart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBookById, type Book as BookType } from '@/lib/api/books';
import ShareButtons from '@/components/ShareButtons';

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEF3E7' }}>
            <Book size={48} style={{ color: '#D97846' }} />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
            Book Not Found
          </h1>
          <p className="mb-8" style={{ color: '#5B4F42' }}>The book you're looking for doesn't exist.</p>
          <Link
            href="/books"
            className="inline-block px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
          >
            Browse All Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #D97846 0%, transparent 40%), radial-gradient(circle at 80% 70%, #7A9B76 0%, transparent 40%)',
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 mb-10 transition-colors hover:gap-3"
            style={{ color: '#E4D9C4' }}
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">All Books</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Cover */}
            <div className="flex justify-center lg:col-span-2">
              <div className="relative w-64 md:w-80">
                <div className="relative aspect-[3/4] rounded-xl shadow-2xl overflow-hidden" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#3A2E22' }}>
                      <Book size={64} className="mb-4" style={{ color: 'rgba(228,217,196,0.4)' }} />
                      <p className="font-bold text-2xl text-center line-clamp-4" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
                        {book.title}
                      </p>
                    </div>
                  )}
                </div>
                {/* Free reading badge */}
                <div className="absolute -top-3 -right-3 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg rotate-3" style={{ backgroundColor: '#7A9B76', color: '#FFFCF5' }}>
                  Read Free
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left lg:col-span-3">
              {book.category && (
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5" style={{ backgroundColor: 'rgba(217,120,70,0.2)', color: '#E89B77', border: '1px solid rgba(217,120,70,0.4)' }}>
                  {book.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
                {book.title}
              </h1>

              {book.author?.user?.name && (
                <Link
                  href={`/authors/${book.author.id}`}
                  className="inline-flex items-center gap-3 mb-6 group"
                >
                  <img
                    src={book.author.profileImage || book.author.user.image || ''}
                    alt={book.author.user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 group-hover:ring-offset-1 transition-all"
                    style={{ boxShadow: '0 0 0 2px #D97846', display: book.author.profileImage || book.author.user.image ? undefined : 'none' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div
                    className="w-9 h-9 rounded-full hidden items-center justify-center"
                    style={{ backgroundColor: 'rgba(217,120,70,0.25)', border: '2px solid #D97846', display: book.author.profileImage || book.author.user.image ? 'none' : undefined } as any}
                  >
                    <User size={18} style={{ color: '#E89B77' }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#A89888' }}>Written by</p>
                    <p className="font-bold group-hover:underline" style={{ color: '#FFFCF5' }}>{book.author.user.name}</p>
                  </div>
                </Link>
              )}

              {/* Rating + meta */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-7 text-sm" style={{ color: '#E4D9C4' }}>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(book.rating || 0) ? 'fill-yellow-400 text-yellow-400' : ''}
                        style={{ color: i < Math.floor(book.rating || 0) ? '#facc15' : '#5B4F42' }}
                      />
                    ))}
                  </span>
                  <span className="font-bold" style={{ color: '#FFFCF5' }}>{book.rating?.toFixed(1) || '0.0'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe size={15} /> {book.language || 'English'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} /> {book.publishedAt ? new Date(book.publishedAt).getFullYear() : '2024'}
                </span>
              </div>

              <p className="text-base md:text-lg leading-relaxed mb-8 max-w-2xl" style={{ color: '#E4D9C4' }}>
                {book.description?.slice(0, 260) || 'Discover the rich cultural heritage and stories through this captivating piece of Kalenjin literature.'}
                {book.description && book.description.length > 260 && '…'}
              </p>

              {/* CTAs — Read free / Donate */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
                <Link
                  href={`/book/viewer/${book.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-full transition-all hover:-translate-y-0.5 shadow-lg"
                  style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                >
                  <BookOpen size={20} />
                  Read Free
                </Link>
                <Link
                  href={`/payment?type=donation&bookId=${book.id}&author=${encodeURIComponent(book.author?.user?.name || '')}&title=${encodeURIComponent(book.title)}&price=200`}
                  className="flex-1 inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-full transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'rgba(255,252,245,0.08)', color: '#FFFCF5', border: '2px solid rgba(217,120,70,0.6)' }}
                >
                  <Heart size={20} style={{ color: '#E89B77' }} />
                  Support Author
                </Link>
              </div>

              <p className="mt-4 inline-flex items-center gap-2 text-xs" style={{ color: '#A89888' }}>
                <ShieldCheck size={14} style={{ color: '#7A9B76' }} />
                Protected in-browser reader — content cannot be downloaded or printed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Options strip: Hard Copy only */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF3E7' }}>
            <Package size={30} style={{ color: '#D97846' }} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
              Prefer a Physical Copy?
            </h3>
            <p className="text-sm md:text-base" style={{ color: '#5B4F42' }}>
              Get the hard copy of "{book.title}" delivered to your doorstep. The author will confirm pricing and delivery with you personally.
            </p>
          </div>
          <Link
            href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
            className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-full whitespace-nowrap transition-all hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
          >
            <Package size={18} />
            Request Hard Copy
          </Link>
        </div>

        {/* Description + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                About This Book
              </h3>
              <p className="leading-relaxed text-lg whitespace-pre-line" style={{ color: '#5B4F42' }}>
                {book.description || 'No description available for this book. Discover the rich cultural heritage and stories through this captivating piece of Kalenjin literature.'}
              </p>

              {('tags' in book && typeof book.tags === 'string') && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E4D9C4' }}>
                  <h4 className="font-bold text-sm mb-3" style={{ color: '#2C2416' }}>Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.split(',').map((tag: string) => (
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
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <h4 className="font-bold mb-5" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Book Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3E7' }}>
                    <FileText size={19} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#A89888' }}>Pages</p>
                    <p className="font-bold" style={{ color: '#2C2416' }}>{book.previewPages * 5 || '~150'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3E7' }}>
                    <Globe size={19} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#A89888' }}>Language</p>
                    <p className="font-bold" style={{ color: '#2C2416' }}>{book.language || 'English'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3E7' }}>
                    <Calendar size={19} style={{ color: '#D97846' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#A89888' }}>Published</p>
                    <p className="font-bold" style={{ color: '#2C2416' }}>
                      {book.publishedAt ? new Date(book.publishedAt).getFullYear() : '2024'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <h4 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <Share2 size={17} />
                Share This Book
              </h4>
              <ShareButtons title={`${book.title} - KaleeReads`} />
            </div>

            {/* Author CTA */}
            {book.author?.user?.name && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#2C2416' }}>
                <h4 className="font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
                  More from {book.author.user.name.split(' ')[0]}
                </h4>
                <p className="text-sm mb-4" style={{ color: '#A89888' }}>
                  Discover more books and stories from this author.
                </p>
                <Link
                  href={`/authors/${book.author.id}`}
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                >
                  View Profile <ArrowLeft size={17} className="rotate-180" />
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
