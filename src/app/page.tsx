import Link from 'next/link';
import { Book, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-brown-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Book className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-neutral-brown-900">AfriReads</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/books"
                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium"
              >
                Browse Books
              </Link>
              <Link
                href="/dashboard/author"
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-all"
              >
                Author Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-brown-900 mb-6">
            Discover Kalenjin Literature
          </h1>
          <p className="text-xl text-neutral-brown-700 mb-8 max-w-2xl mx-auto">
            Explore, purchase, and read authentic Kalenjin books from talented authors.
            Preserve culture through storytelling.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/books"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Browse Books
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/dashboard/author"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-lg transition-all"
            >
              Become an Author
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">
              Rich Collection
            </h3>
            <p className="text-neutral-brown-700">
              Access a growing library of Kalenjin books across various genres and topics.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-accent-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">
              Support Authors
            </h3>
            <p className="text-neutral-brown-700">
              Directly support Kalenjin authors and help preserve cultural heritage.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-accent-gold" size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">
              Earn as Author
            </h3>
            <p className="text-neutral-brown-700">
              Publish your work and earn from sales with transparent payment tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-brown-500/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-neutral-brown-700">
            <p>&copy; 2024 AfriReads. Preserving Kalenjin culture through literature.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
