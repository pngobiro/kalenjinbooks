import { Star, Book, ArrowLeft, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchBookById, fetchBooks } from '@/lib/api/books';
import BookPurchaseOptions from '@/components/BookPurchaseOptions';
import ShareButtons from '@/components/ShareButtons';

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let bookData;
  try {
    const response = await fetchBookById(id);
    bookData = response.data;
  } catch (error) {
    console.error('Error fetching book:', error);
  }

  // Fetch related books (just fetch recent ones for now)
  let relatedBooks: any[] = [];
  try {
    const relatedResponse = await fetchBooks({ limit: 3 });
    relatedBooks = relatedResponse?.data || [];
  } catch (e) {
    console.error('Failed to fetch related books:', e);
  }

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
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Books</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">About</Link>
            </div>

            <Link href="/books" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back</span>
            </Link>
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
                {bookData.coverImage ? (
                  <img src={bookData.coverImage} alt={bookData.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent-green/20">
                    <Book size={64} className="text-neutral-brown-300" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full mb-4">
              {bookData.category || 'General'}
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-brown-900 font-heading mb-4">
              {bookData.title}
            </h1>

            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-brown-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <span className="text-neutral-brown-700">by <strong>{bookData.author?.user?.name || 'Unknown Author'}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-accent-gold text-accent-gold" />
                  <span className="font-bold">4.8</span>
                  <span className="text-neutral-brown-500 text-sm">(12)</span>
                </div>
              </div>
              <ShareButtons title={`${bookData.title} - KaleeReads`} />
            </div>

            <BookPurchaseOptions book={bookData} />
          </div>
        </div>
      </div>

      {/* Related Books */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedBooks.filter(b => b.id !== id).map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="group">
                <div className="bg-neutral-cream rounded-xl p-4 hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-white">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Book size={32} className="text-neutral-brown-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-neutral-brown-900 mb-1 truncate">{book.title}</h3>
                  <p className="text-sm text-neutral-brown-600 mb-2">{book.author?.user?.name || 'Unknown Author'}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">KES {book.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-accent-gold text-accent-gold" />
                      <span className="text-sm">4.8</span>
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
