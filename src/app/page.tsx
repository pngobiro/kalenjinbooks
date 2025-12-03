import Link from 'next/link';
import { Book, Users, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { FeaturedBooks } from '@/components/home/FeaturedBooks';

// Mock featured books data
const featuredBooks = [
  {
    id: '1',
    title: 'Kalenjin Folklore Tales',
    author: 'John Kamau',
    price: 500,
    rating: 4.5,
    category: 'Folklore',
    image: '/books/folklore-tales.png',
  },
  {
    id: '2',
    title: 'Traditional Wisdom',
    author: 'Jane Kiplagat',
    price: 750,
    rating: 4.8,
    category: 'Non-Fiction',
    image: '/books/traditional-wisdom.png',
  },
  {
    id: '3',
    title: 'Cultural Heritage',
    author: 'Mike Korir',
    price: 600,
    rating: 4.3,
    category: 'History',
    image: '/books/cultural-heritage.png',
  },
  {
    id: '4',
    title: 'Children Stories',
    author: 'Sarah Chebet',
    price: 400,
    rating: 4.7,
    category: 'Children',
    image: '/books/children-stories.png',
  },
  {
    id: '5',
    title: 'Modern Poetry',
    author: 'David Ruto',
    price: 550,
    rating: 4.6,
    category: 'Poetry',
  },
  {
    id: '6',
    title: 'Educational Guide',
    author: 'Mary Jepkoech',
    price: 800,
    rating: 4.9,
    category: 'Education',
  },
  {
    id: '7',
    title: 'Historical Narratives',
    author: 'Peter Kibet',
    price: 650,
    rating: 4.4,
    category: 'History',
  },
  {
    id: '8',
    title: 'Fiction Adventures',
    author: 'Grace Chepkemoi',
    price: 700,
    rating: 4.5,
    category: 'Fiction',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-cream w-full">
      {/* Navigation */}
      <nav className="bg-transparent w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20 relative">
            {/* Logo - Absolute positioned to left */}
            <Link href="/" className="absolute left-4 sm:left-6 lg:left-8 flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-transparent">
                <Book className="text-accent-green" size={24} />
              </div>
              <span className="text-xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
            </Link>

            {/* Centered Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/books"
                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium transition-colors"
              >
                Books
              </Link>
              <Link
                href="/books#categories"
                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/authors"
                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium transition-colors"
              >
                Authors
              </Link>
              <Link
                href="/about"
                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium transition-colors"
              >
                About
              </Link>
            </div>

            {/* Search - Absolute positioned to right */}
            <button className="absolute right-4 sm:right-6 lg:right-8 p-2 hover:bg-neutral-cream rounded-nav transition-colors cursor-pointer" aria-label="Search">
              <Search size={24} className="text-neutral-brown-900 w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-white via-neutral-cream/50 to-neutral-cream py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-green/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-neutral-brown-900 mb-6 font-heading leading-tight">
            Discover Kalenjin<br />
            <span className="text-primary">Literature</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-brown-700 max-w-3xl mx-auto mb-10 leading-relaxed font-body">
            Explore a curated collection of vibrant stories, history, and voices from the Kalenjin community and across Africa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/books"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-base sm:text-lg text-center"
            >
              Shop Kalenjin Books
            </Link>
            <Link
              href="/books"
              className="w-full sm:w-auto bg-accent-green hover:bg-accent-green/90 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-base sm:text-lg text-center"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Books */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedBooks books={featuredBooks} />
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-r from-primary to-primary-dark py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of authors and start publishing your Kalenjin books today
          </p>
          <Link
            href="/dashboard/author"
            className="inline-block bg-white text-primary hover:bg-neutral-cream font-semibold px-8 py-4 rounded-lg transition-all hover:-translate-y-0.5 shadow-lg"
          >
            Start Publishing Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-neutral-brown-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Book className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-neutral-brown-900">AfriReads</span>
              </div>
              <p className="text-neutral-brown-700 text-sm">
                Preserving Kalenjin culture through literature
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-brown-900 mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/books" className="text-neutral-brown-700 hover:text-primary">Browse Books</Link></li>
                <li><Link href="/authors" className="text-neutral-brown-700 hover:text-primary">Authors</Link></li>
                <li><Link href="/books?category=folklore" className="text-neutral-brown-700 hover:text-primary">Categories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-brown-900 mb-4">For Authors</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard/author" className="text-neutral-brown-700 hover:text-primary">Dashboard</Link></li>
                <li><Link href="/dashboard/author/books" className="text-neutral-brown-700 hover:text-primary">My Books</Link></li>
                <li><Link href="/dashboard/author/earnings" className="text-neutral-brown-700 hover:text-primary">Earnings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-brown-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-neutral-brown-700 hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="text-neutral-brown-700 hover:text-primary">Contact</Link></li>
                <li><Link href="/faq" className="text-neutral-brown-700 hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-brown-500/10 pt-8 text-center text-neutral-brown-700 text-sm">
            <p>&copy; 2024 AfriReads. All rights reserved. Preserving Kalenjin culture through literature.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}