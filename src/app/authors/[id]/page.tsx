'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, BookOpen, Star, User, MapPin, Globe,
  Twitter, Facebook, Instagram, Linkedin,
  Clock, Eye, ArrowRight, FileText, Share2,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#F5E6D3' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="rounded-xl p-12 text-center max-w-md shadow-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEE2E2' }}>
            <User size={40} className="text-red-500" />
          </div>
          <p className="text-red-600 font-bold text-xl mb-3">Author Not Found</p>
          <p className="text-red-500 mb-8">{error || 'The author you\'re looking for doesn\'t exist.'}</p>
          <Link 
            href="/authors" 
            className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
          >
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  const colorScheme = colorSchemes[(author.name?.length || 0) % colorSchemes.length];
  const allBooks = author.books || [];
  const topByViews = [...blogPosts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  const initials = (author.name || 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      <Navbar />

      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${colorScheme} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link 
            href="/authors" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Authors</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50">
                {author.profileImage ? (
                  <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {author.name || 'Unknown Author'}
              </h1>

              {author.bio && (
                <p className="text-lg text-white/95 leading-relaxed max-w-3xl mb-6">
                  {author.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span className="font-bold text-xl">{author.booksCount || 0}</span>
                  <span>Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="fill-yellow-300 text-yellow-300" />
                  <span className="font-bold text-xl">{author.rating?.toFixed(1) || '0.0'}</span>
                  <span>Rating</span>
                </div>
                {(author.location || author.nationality) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{author.location || author.nationality}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <ShareButtons title={author.name || 'Author'} type="author" />
                {author.website && (
                  <a 
                    href={author.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                  >
                    <Globe size={18} className="text-white" />
                  </a>
                )}
                {author.twitter && (
                  <a 
                    href={`https://twitter.com/${author.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-[#1DA1F2] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                  >
                    <Twitter size={18} className="text-white" />
                  </a>
                )}
                {author.facebook && (
                  <a 
                    href={`https://facebook.com/${author.facebook}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-[#1877F2] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                  >
                    <Facebook size={18} className="text-white" />
                  </a>
                )}
                {author.instagram && (
                  <a 
                    href={`https://instagram.com/${author.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-[#E4405F] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                  >
                    <Instagram size={18} className="text-white" />
                  </a>
                )}
                {author.linkedin && (
                  <a 
                    href={`https://linkedin.com/in/${author.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 hover:bg-[#0A66C2] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                  >
                    <Linkedin size={18} className="text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Books */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Books by {author.name?.split(' ')[0]}
              </h2>
              {allBooks.length > 6 && (
                <Link 
                  href={`/books?author=${authorId}`} 
                  className="flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all"
                >
                  View All <ArrowRight size={16} />
                </Link>
              )}
            </div>

            {allBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {allBooks.slice(0, 6).map((book, index) => {
                  const bookColor = colorSchemes[index % colorSchemes.length];
                  return (
                    <Link key={book.id} href={`/books/${book.id}`} className="group">
                      <div className="rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col" style={{ backgroundColor: '#FFFCF5' }}>
                        <div className={`relative aspect-[3/4] overflow-hidden ${!book.coverImage ? `bg-gradient-to-br ${bookColor}` : ''}`}>
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen size={48} className="text-white/40" />
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                            {book.title}
                          </h3>
                          {book.description && (
                            <p className="text-sm text-gray-700 line-clamp-2 mb-3 flex-1">{book.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold" style={{ color: '#D97846' }}>
                              KES {book.price.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1 text-sm">
                              <Star size={14} className="fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold" style={{ color: '#2C2416' }}>{book.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl p-16 text-center shadow-md" style={{ backgroundColor: '#FFFCF5' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5E6D3' }}>
                  <BookOpen size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                  No Books Yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  This author hasn&apos;t published any books yet. Check back soon for new releases!
                </p>
              </div>
            )}
          </section>

          {/* Sidebar: Blog Posts */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Recent Blog Posts */}
            <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: '#FFFCF5' }}>
              <div className="px-6 py-4" style={{ backgroundColor: '#D97846' }}>
                <h3 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <FileText size={18} />
                  Blog Posts
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: '#E5D5C3' }}>
                {blogPosts.length > 0 ? blogPosts.slice(0, 5).map((post, i) => (
                  <Link key={post.id} href={`/blogs/${post.id}`} className="flex items-start gap-3 p-4 hover:bg-orange-50 transition-colors group">
                    <div className={`w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br ${colorSchemes[i % colorSchemes.length]} flex items-center justify-center overflow-hidden`}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={20} className="text-white/70" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold line-clamp-2 group-hover:text-orange-600 transition-colors mb-2" style={{ color: '#2C2416' }}>
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-600 flex items-center gap-3">
                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                        <span className="flex items-center gap-1"><Eye size={11} /> {post.viewCount}</span>
                      </p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-500 p-6">No blog posts yet.</p>
                )}
              </div>
            </div>

            {/* Popular Posts */}
            {topByViews.length > 0 && (
              <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: '#FFFCF5' }}>
                <div className="px-6 py-4" style={{ backgroundColor: '#2C2416' }}>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <Eye size={18} style={{ color: '#C9A354' }} />
                    Most Read
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: '#E5D5C3' }}>
                  {topByViews.map((post, i) => (
                    <Link key={post.id} href={`/blogs/${post.id}`} className="flex items-start gap-3 p-4 hover:bg-orange-50 transition-colors group">
                      <span className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold line-clamp-2 group-hover:text-orange-600 transition-colors mb-1" style={{ color: '#2C2416' }}>
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-600 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye size={11} /> {post.viewCount}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#2C2416' }}>
              <h3 className="text-white font-bold text-xl mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Explore More
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Discover more books and stories from talented Kalenjin authors.
              </p>
              <Link 
                href="/books" 
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
              >
                Browse All Books <ArrowRight size={18} />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
