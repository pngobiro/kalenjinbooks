import Link from 'next/link';
import { Book, ArrowRight, Search } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
            </Link>

            {/* Centered Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                Books
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/books#categories" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                Authors
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </div>

            {/* Search */}
            <button className="p-2.5 hover:bg-primary/10 rounded-lg transition-colors" aria-label="Search">
              <Search size={22} className="text-neutral-brown-900" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-white via-neutral-cream/30 to-primary/5 py-24 lg:py-32">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-green/8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-brown-900 mb-6 font-heading leading-tight">
              Discover Kalenjin<br />
              <span className="text-primary">Literature</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-brown-700 mb-10 leading-relaxed">
              Explore a curated collection of vibrant stories, history, and voices from the Kalenjin community and across Africa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/books"
                className="group w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                Shop Kalenjin Books
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/books"
                className="group w-full sm:w-auto bg-accent-green hover:bg-[#7A8C74] text-white font-semibold px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                Explore Collection
                <Book size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <FeaturedBooks books={featuredBooks} />
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary-dark to-primary py-20">
        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            For Authors
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl lg:text-2xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our community of authors and start publishing your Kalenjin books today
          </p>
          <Link
            href="/dashboard/author"
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-neutral-cream font-semibold px-10 py-5 rounded-full transition-all hover:-translate-y-1 shadow-2xl text-lg"
          >
            Start Publishing Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-brown-900 text-white">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Book className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold font-heading">AfriReads</span>
              </div>
              <p className="text-neutral-brown-500 text-sm leading-relaxed">
                Preserving Kalenjin culture through literature and empowering African voices.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 font-heading">Explore</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/books" className="text-neutral-brown-500 hover:text-primary transition-colors">Browse Books</Link></li>
                <li><Link href="/authors" className="text-neutral-brown-500 hover:text-primary transition-colors">Authors</Link></li>
                <li><Link href="/books#categories" className="text-neutral-brown-500 hover:text-primary transition-colors">Categories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 font-heading">For Authors</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/dashboard/author" className="text-neutral-brown-500 hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/author/books" className="text-neutral-brown-500 hover:text-primary transition-colors">My Books</Link></li>
                <li><Link href="/dashboard/author/earnings" className="text-neutral-brown-500 hover:text-primary transition-colors">Earnings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 font-heading">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-neutral-brown-500 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-neutral-brown-500 hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="text-neutral-brown-500 hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-brown-500 text-sm">
              &copy; 2024 AfriReads. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-brown-500">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
