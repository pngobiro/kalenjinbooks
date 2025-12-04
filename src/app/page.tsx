import Link from 'next/link';
import { ArrowRight, Search, Star, Book } from 'lucide-react';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';

const featuredBooks = [
  { id: '1', title: 'Immortal Knowledge', author: 'Dr. Kibet Kitur', price: 1200, rating: 4.9, image: '/books/immortalknowledge.jpg' },
  { id: '2', title: 'Kalenjin Folklore Tales', author: 'John Kamau', price: 500, rating: 4.5, image: '/books/folklore-tales.png' },
  { id: '3', title: 'Traditional Wisdom', author: 'Jane Kiplagat', price: 750, rating: 4.8, image: '/books/traditional-wisdom.png' },
  { id: '4', title: 'Children Stories', author: 'Sarah Chebet', price: 400, rating: 4.7, image: '/books/children-stories.png' },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <KaleeReadsLogo size={44} />
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium">Books</Link>
              <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium">About</Link>
            </div>

            <button className="p-2.5 hover:bg-primary/10 rounded-lg" aria-label="Search">
              <Search size={22} className="text-neutral-brown-900" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-neutral-brown-900 mb-6 font-heading leading-tight">
            Discover Kalenjin<br />
            <span className="text-primary">Literature</span>
          </h1>
          <p className="text-xl text-neutral-brown-700 mb-10 max-w-2xl mx-auto">
            Explore a curated collection of vibrant stories, history, and voices from the Kalenjin community and across Africa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/books" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2">
              Shop Kalenjin Books <ArrowRight size={20} />
            </Link>
            <Link href="/books" className="w-full sm:w-auto bg-accent-green hover:bg-accent-green/90 text-white font-semibold px-10 py-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2">
              Explore Collection <Book size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="bg-neutral-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-3">Featured Books</h2>
            <p className="text-lg text-neutral-brown-700">Discover our curated collection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="group">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-neutral-cream">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-bold text-neutral-brown-900 mb-1 truncate">{book.title}</h3>
                  <p className="text-sm text-neutral-brown-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">KES {book.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-accent-gold text-accent-gold" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/books" className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-4 rounded-full shadow-lg">
              View All Books →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">For Authors</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">Ready to Share Your Story?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join our community of authors and start publishing your Kalenjin books today
          </p>
          <Link href="/dashboard/author" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-10 py-4 rounded-full shadow-xl text-lg">
            Start Publishing Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-brown-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <KaleeReadsLogo size={44} />
                <span className="text-2xl font-bold font-heading">KaleeReads</span>
              </div>
              <p className="text-neutral-brown-500 text-sm">Preserving Kalenjin culture through literature.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-neutral-brown-500">
                <li><Link href="/books" className="hover:text-primary">Browse Books</Link></li>
                <li><Link href="/authors" className="hover:text-primary">Authors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Authors</h4>
              <ul className="space-y-2 text-sm text-neutral-brown-500">
                <li><Link href="/dashboard/author" className="hover:text-primary">Dashboard</Link></li>
                <li><Link href="/dashboard/author/books" className="hover:text-primary">My Books</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-brown-500">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-neutral-brown-500 text-sm">
            <p>© 2024 KaleeReads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
