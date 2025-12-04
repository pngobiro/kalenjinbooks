'use client';

import { Star, ShoppingCart, Share2, BookOpen, Clock, ChevronRight, User, ArrowLeft, Package, Book } from 'lucide-react';
import Link from 'next/link';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getBookById, getAllBooks } from '@/lib/data';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [purchaseType, setPurchaseType] = useState<'permanent' | 'temporary'>('permanent');
  const router = useRouter();
  
  const bookData = getBookById(id);
  const allBooks = getAllBooks();
  const relatedBooks = allBooks.filter(b => b.id !== id).slice(0, 3);
  
  if (!bookData) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <Book size={64} className="text-neutral-brown-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2">Book Not Found</h1>
          <Link href="/books" className="text-primary hover:underline">Browse all books</Link>
        </div>
      </div>
    );
  }
  
  const currentPrice = purchaseType === 'permanent' ? bookData.price : bookData.rentalPrice;

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
              <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Books</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">About</Link>
            </div>

            <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-brown-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/books" className="hover:text-primary">Books</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-brown-900 font-medium">{bookData.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Image */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-cream">
                <img src={bookData.image} alt={bookData.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full mb-4">
              {bookData.category}
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-brown-900 font-heading mb-4">
              {bookData.title}
            </h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-brown-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <span className="text-neutral-brown-700">by <strong>{bookData.author}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-accent-gold text-accent-gold" />
                <span className="font-bold">{bookData.rating}</span>
                <span className="text-neutral-brown-500 text-sm">({bookData.reviewCount})</span>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="font-bold text-neutral-brown-900 mb-4">Select Access Type</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Permanent */}
                <div
                  onClick={() => setPurchaseType('permanent')}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                    purchaseType === 'permanent'
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-brown-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={20} className={purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-400'} />
                    <span className="font-semibold text-sm">Permanent</span>
                  </div>
                  <div className={`text-2xl font-bold ${purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-700'}`}>
                    KES {bookData.price}
                  </div>
                  <p className="text-xs text-neutral-brown-500 mt-1">Own forever</p>
                </div>

                {/* 24-Hour */}
                <div
                  onClick={() => setPurchaseType('temporary')}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                    purchaseType === 'temporary'
                      ? 'border-accent-green bg-accent-green/5'
                      : 'border-neutral-brown-200 hover:border-accent-green/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} className={purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-400'} />
                    <span className="font-semibold text-sm">24-Hour</span>
                  </div>
                  <div className={`text-2xl font-bold ${purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-700'}`}>
                    KES {bookData.rentalPrice}
                  </div>
                  <p className="text-xs text-neutral-brown-500 mt-1">Read online</p>
                </div>
              </div>

              <Link
                href={`/payment?bookId=${bookData.id}&author=${encodeURIComponent(bookData.author)}&type=${purchaseType}&price=${currentPrice}&title=${encodeURIComponent(bookData.title)}`}
                className={`w-full font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2 text-white ${
                  purchaseType === 'permanent' ? 'bg-primary hover:bg-primary-dark' : 'bg-accent-green hover:bg-[#7A8C74]'
                } transition-all`}
              >
                <ShoppingCart size={20} />
                Choose Payment - KES {currentPrice}
              </Link>
            </div>

            <p className="text-neutral-brown-700 leading-relaxed mb-6">{bookData.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-neutral-brown-200">
              <div>
                <div className="text-xs text-neutral-brown-500 uppercase">Pages</div>
                <div className="font-bold text-neutral-brown-900">{bookData.pages}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-brown-500 uppercase">Language</div>
                <div className="font-bold text-neutral-brown-900 text-sm">{bookData.language}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-brown-500 uppercase">Published</div>
                <div className="font-bold text-neutral-brown-900">{bookData.published}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href={`/request-hard-copy?book=${encodeURIComponent(bookData.title)}&id=${bookData.id}`}
                className="flex-1 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full flex items-center justify-center gap-2 font-medium transition-all"
              >
                <Package size={18} /> Hard Copy
              </Link>
              <button className="flex-1 py-3 border-2 border-neutral-brown-200 text-neutral-brown-500 hover:border-blue-500 hover:text-blue-500 rounded-full flex items-center justify-center gap-2 font-medium transition-all">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="group">
                <div className="bg-neutral-cream rounded-xl p-4 hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-bold text-neutral-brown-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-neutral-brown-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">KES {book.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-accent-gold text-accent-gold" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
