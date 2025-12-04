'use client';

import KaleeReadsLogo from '@/components/KaleeReadsLogo';
import { ArrowLeft, BookOpen, Star, User, Book } from 'lucide-react';
import Link from 'next/link';

const authors = [
  {
    id: 1,
    name: "Dr. Kibet Kitur",
    role: "Author & Thought Leader",
    bio: "Dr. Kibet Kitur delivers powerful messages to the African grassroots, calling for unity, economic freedom, and a mental revolution.",
    booksCount: 1,
    rating: 4.9,
    image: "/images/author-kibet-kitur.png",
  },
  {
    id: 2,
    name: "Dr. Kiprop Lagat",
    role: "Cultural Historian",
    bio: "Dr. Lagat has spent over 20 years documenting the oral traditions of the Kalenjin people.",
    booksCount: 5,
    rating: 4.9,
    image: "/images/author-kiprop.png",
  },
  {
    id: 3,
    name: "Chebet Rotich",
    role: "Children's Author",
    bio: "Chebet weaves magical tales that introduce young readers to African folklore.",
    booksCount: 8,
    rating: 4.8,
    image: "/images/author-chebet.png",
  },
  {
    id: 4,
    name: "Kipchoge Keino",
    role: "Biographer",
    bio: "A legendary athlete turned writer, sharing inspiring stories from the Rift Valley.",
    booksCount: 3,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Jepkorir Tanui",
    role: "Poet",
    bio: "Jepkorir's poetry captures the beauty of the Nandi Hills and the spirit of its people.",
    booksCount: 4,
    rating: 4.9,
  }
];

export default function AuthorsPage() {
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
              <Link href="/authors" className="text-primary font-medium">Authors</Link>
              <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors">About</Link>
            </div>

            <Link href="/" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">Meet Our Authors</h1>
          <p className="text-lg text-neutral-brown-600 max-w-2xl mx-auto">
            The brilliant minds and voices behind the stories we love.
          </p>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link key={author.id} href={`/authors/${author.id}`} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
                      {author.image ? (
                        <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={28} className="text-neutral-brown-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-brown-900 group-hover:text-primary transition-colors">{author.name}</h3>
                      <p className="text-sm text-primary">{author.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-neutral-brown-600 text-sm mb-4 line-clamp-2">{author.bio}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-brown-100">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} className="text-accent-green" />
                      <span className="text-sm font-medium">{author.booksCount} books</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-accent-gold text-accent-gold" />
                      <span className="text-sm font-medium">{author.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Join Card */}
            <div className="bg-neutral-brown-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <User size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Become an Author</h3>
              <p className="text-neutral-brown-400 text-sm mb-6">Share your story with the world</p>
              <Link href="/dashboard/author" className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
