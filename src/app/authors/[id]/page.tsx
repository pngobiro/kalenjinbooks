'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, BookOpen, Star, User, Calendar, MapPin, Globe,
  Twitter, Facebook, Instagram, Linkedin, Sparkles,
  PlayCircle, Clock, Eye, ArrowRight, FileText, Users,
} from 'lucide-react';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import { getAuthorById, Author } from '@/lib/api/authors';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';

interface AuthorWithBooks extends Author {
  books?: Array<{
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    price: number;
    rentalPrice?: number | null;
    category: string;
    language: string;
    publishedAt: string;
    rating: number;
    tags?: string;
    amazonUrl?: string | null;
    readOnlineUrl?: string | null;
  }>;
}

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

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<AuthorWithBooks | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthor() {
      try {
        setLoading(true);
        setError(null);
        const [authorRes, blogsRes] = await Promise.all([
          getAuthorById(authorId),
          fetchBlogPosts({ authorId, published: true, limit: 20 }).catch(() => null),
        ]);
        setAuthor(authorRes.data || null);
        setBlogPosts(blogsRes?.data?.posts || []);
      } catch (e) {
        console.error('Failed to fetch author:', e);
        setError(e instanceof Error ? e.message : 'Failed to load author');
      } finally {
        setLoading(false);
      }
    }
    if (authorId) loadAuthor();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-neutral-brown-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-red-500" />
          </div>
          <p className="text-red-600 font-medium mb-2">Error loading author</p>
          <p className="text-red-500 text-sm mb-6">{error || 'Author not found'}</p>
          <Link href="/authors" className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors">
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  const colorScheme = colorSchemes[(author.name?.length || 0) % colorSchemes.length];
  const allBooks = author.books || [];
  const topByViews = [...blogPosts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>
            <Link href="/authors" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors text-sm">
              <ArrowLeft size={16} />
              <span>All Authors</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-2xl">
                {author.profileImage ? (
                  <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                    <User size={48} className="text-white/80" />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-3">
                <Sparkles size={13} className="text-accent-gold" />
                <span className="text-white/90 text-xs font-medium">Author</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-3">
                {author.name || 'Unknown Author'}
              </h1>

              {author.bio && (
                <p className="text-neutral-brown-200 leading-relaxed max-w-2xl mb-4">
                  {author.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-white/80">
                  <BookOpen size={15} />
                  <span className="font-semibold">{author.booksCount}</span> books
                </div>
                <div className="flex items-center gap-1.5 text-white/80">
                  <Star size={15} className="text-accent-gold" />
                  <span className="font-semibold">{author.rating?.toFixed(1) || '0.0'}</span> rating
                </div>
                {(author.location || author.nationality) && (
                  <div className="flex items-center gap-1.5 text-neutral-brown-400">
                    <MapPin size={14} />
                    {author.location || author.nationality}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                <ShareButtons title={author.name || 'Author'} type="author" />
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                    <Globe size={16} className="text-white" />
                  </a>
                )}
                {author.twitter && (
                  <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 bg-white/10 hover:bg-[#1DA1F2] rounded-lg flex items-center justify-center transition-colors">
                    <Twitter size={16} className="text-white" />
                  </a>
                )}
                {author.facebook && (
                  <a href={`https://facebook.com/${author.facebook}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 bg-white/10 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-colors">
                    <Facebook size={16} className="text-white" />
                  </a>
                )}
                {author.instagram && (
                  <a href={`https://instagram.com/${author.instagram}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 bg-white/10 hover:bg-[#E4405F] rounded-lg flex items-center justify-center transition-colors">
                    <Instagram size={16} className="text-white" />
                  </a>
                )}
                {author.linkedin && (
                  <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 bg-white/10 hover:bg-[#0A66C2] rounded-lg flex items-center justify-center transition-colors">
                    <Linkedin size={16} className="text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content: Books */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading">Books</h2>
              {allBooks.length > 0 && (
                <Link href={`/books?author=${authorId}`} className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {allBooks.length > 0 ? (
              <div className="space-y-5">
                {allBooks.map((book, index) => {
                  const bookColor = colorSchemes[index % colorSchemes.length];
                  return (
                    <Link key={book.id} href={`/books/${book.id}`} className="group">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]">
                        <div className={`relative aspect-[2/3] sm:h-full overflow-hidden ${!book.coverImage ? `bg-gradient-to-br ${bookColor}` : ''}`}>
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen size={28} className="text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-base text-neutral-brown-900 line-clamp-1 group-hover:text-primary transition-colors mb-1">
                              {book.title}
                            </h3>
                            {book.description && (
                              <p className="text-sm text-neutral-brown-600 line-clamp-2 mb-2">{book.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-neutral-brown-500">
                              {book.category && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{book.category}</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Star size={12} className="fill-accent-gold text-accent-gold" /> {book.rating?.toFixed(1) || '0.0'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-lg font-bold text-primary">KES {book.price.toLocaleString()}</span>
                            {book.amazonUrl && (
                              <span className="px-2 py-0.5 bg-accent-gold/10 text-accent-gold text-xs font-semibold rounded-full">
                                Amazon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <BookOpen size={32} className="text-neutral-brown-300 mx-auto mb-3" />
                <p className="text-neutral-brown-600">No published books yet.</p>
              </div>
            )}
          </section>

          {/* Sidebar: Blog Posts + Popular */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Blog Posts */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-primary rounded-t-2xl">
                <h3 className="text-white font-heading font-bold flex items-center gap-2">
                  <FileText size={16} />
                  Blog Posts
                </h3>
              </div>
              <div className="divide-y divide-neutral-brown-100">
                {blogPosts.length > 0 ? blogPosts.slice(0, 6).map((post, i) => (
                  <Link key={post.id} href={`/blogs/${post.id}`} className="flex items-start gap-3 p-4 hover:bg-neutral-cream/60 transition-colors group">
                    <div className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${colorSchemes[i % colorSchemes.length]} flex items-center justify-center overflow-hidden`}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={16} className="text-white/70" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-brown-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-neutral-brown-500 mt-1 flex items-center gap-2">
                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                        <span className="flex items-center gap-1"><Eye size={11} /> {post.viewCount}</span>
                      </p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-neutral-brown-500 p-6">No posts yet.</p>
                )}
              </div>
            </div>

            {/* Popular Posts */}
            {topByViews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-neutral-brown-900 rounded-t-2xl">
                  <h3 className="text-white font-heading font-bold flex items-center gap-2">
                    <Eye size={16} className="text-accent-gold" />
                    Popular Posts
                  </h3>
                </div>
                <div className="divide-y divide-neutral-brown-100">
                  {topByViews.map((post, i) => (
                    <Link key={post.id} href={`/blogs/${post.id}`} className="flex items-start gap-3 p-4 hover:bg-neutral-cream/60 transition-colors group">
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 text-primary font-heading font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-neutral-brown-900 line-clamp-1 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-neutral-brown-500 mt-1 flex items-center gap-2">
                          <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                          <span className="flex items-center gap-1"><Eye size={11} /> {post.viewCount}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Write for us */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-3">
                <Users size={18} />
              </div>
              <h3 className="font-heading font-bold text-base mb-2">Read More</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Explore more books and posts from Kalenjin authors.
              </p>
              <Link href="/books" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-4 py-2 rounded-xl hover:bg-neutral-cream transition-all text-sm">
                Browse Books <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-neutral-brown-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-neutral-brown-400 text-sm">&copy; {new Date().getFullYear()} KaleeReads</p>
        </div>
      </footer>
    </div>
  );
}
