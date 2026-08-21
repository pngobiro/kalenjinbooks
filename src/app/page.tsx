'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Star, Clock, Eye, Users, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

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

export default function HomePage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const [booksRes, blogsRes, authorsRes] = await Promise.all([
          fetchBooks({ limit: 20 }).catch(() => null),
          fetchBlogPosts({ published: true, limit: 20 }).catch(() => null),
          fetchAuthors({ limit: 12 }).catch(() => null),
        ]);
        setBooks(booksRes?.data || []);
        setBlogPosts(blogsRes?.data?.posts || []);
        setAuthors(authorsRes?.data || []);
      } catch (err) {
        console.error('Error loading homepage content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2C2416 0%, #3A2E57 100%)',
          minHeight: '500px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: '#FFFCF5', lineHeight: '1.15' }}
            >
              Discover Authentic Kalenjin Literature
            </h1>
            <p 
              className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 252, 245, 0.9)', lineHeight: '1.6' }}
            >
              Explore books, stories, and cultural narratives from talented local authors. 
              Preserving our heritage one page at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/books"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 shadow-lg"
                style={{ backgroundColor: '#D97846', color: '#FFFCF5' }}
              >
                Explore Books
              </Link>
              <Link
                href="/authors"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 border-2"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#FFFCF5',
                  borderColor: 'rgba(255, 252, 245, 0.3)',
                }}
              >
                Meet Authors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
              <div className="absolute inset-0 border-4 rounded-full animate-spin" style={{ borderColor: '#D97846', borderTopColor: 'transparent' }}></div>
            </div>
          </div>
        ) : (
          <div className="space-y-20 py-16">
            {/* Featured Authors Section */}
            <section>
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2C2416' }}>
                  Meet Our Storytellers
                </h2>
                <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#5B4F42' }}>
                  Talented local authors preserving Kalenjin heritage through their words
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                {authors.slice(0, 6).map((author) => (
                  <Link
                    key={author.id}
                    href={`/authors/${author.id}`}
                    className="group w-full max-w-xs"
                  >
                    <div
                      className="rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{ backgroundColor: '#FFFCF5' }}
                    >
                      <div className="relative w-40 h-40 mx-auto mb-5">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorSchemes[0]} overflow-hidden ring-4 transition-transform duration-300 group-hover:scale-105`} style={{ '--tw-ring-color': '#D97846' } as React.CSSProperties}>
                          {author.profileImage ? (
                            <img
                              src={author.profileImage}
                              alt={author.name || 'Author'}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl font-bold text-white">
                                {author.name?.charAt(0) || 'A'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <h3 className="font-heading text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors" style={{ color: '#2C2416' }}>
                        {author.name || 'Unknown Author'}
                      </h3>
                      {author.bio && (
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#5B4F42' }}>
                          {author.bio}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full" style={{ color: '#7A9B76', backgroundColor: '#F5F1E8' }}>
                        <BookOpen size={16} />
                        <span>{author.booksCount} {author.booksCount === 1 ? 'book' : 'books'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {authors.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href="/authors"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                    style={{ color: '#D97846' }}
                  >
                    View All Authors →
                  </Link>
                </div>
              )}
            </section>

            {/* Latest Books Section */}
            <section style={{ backgroundColor: '#F5F1E8', margin: '0 -1.5rem', padding: '4rem 1.5rem', borderRadius: '1.5rem' }}>
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2C2416' }}>
                  Latest Books
                </h2>
                <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#5B4F42' }}>
                  Fresh releases from our talented authors
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {books.slice(0, 8).map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group w-full max-w-[220px]"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br" style={{ backgroundColor: '#E4D9C4' }}>
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={32} className="text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center justify-between text-white text-sm">
                          <span className="font-bold">KES {book.price}</span>
                          {book.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star size={12} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{book.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors mb-1" style={{ color: '#2C2416' }}>
                      {book.title}
                    </h3>
                    <p className="text-xs md:text-sm" style={{ color: '#5B4F42' }}>
                      {book.author?.user?.name || 'Unknown Author'}
                    </p>
                  </Link>
                ))}
              </div>

              {books.length > 8 && (
                <div className="text-center mt-8">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold transition-all hover:-translate-y-0.5 shadow-lg"
                    style={{ backgroundColor: '#D97846', color: '#FFFCF5' }}
                  >
                    View All Books
                  </Link>
                </div>
              )}
            </section>

            {/* Blog Posts Section */}
            {blogPosts.length > 0 && (
              <section>
                <div className="text-center mb-12">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2C2416' }}>
                    Stories & Insights
                  </h2>
                  <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#5B4F42' }}>
                    Dive into engaging posts about Kalenjin culture, literature, and life
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.slice(0, 6).map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blogs/${post.id}`}
                      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      style={{ backgroundColor: '#FFFCF5' }}
                    >
                      <div className={`relative aspect-[16/10] bg-gradient-to-br ${colorSchemes[index % colorSchemes.length]} overflow-hidden`}>
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : post.coverType === 'video' && post.coverVideoUrl ? (
                          <VideoThumbnail videoUrl={post.coverVideoUrl} title={post.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={32} className="text-white/30" />
                          </div>
                        )}
                        {post.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded text-xs font-semibold uppercase" style={{ backgroundColor: 'rgba(217, 120, 70, 0.95)', color: '#FFFCF5' }}>
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{ color: '#2C2416' }}>
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm line-clamp-2 mb-4" style={{ color: '#5B4F42' }}>
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs" style={{ color: '#A89888' }}>
                          <span>{post.author?.user?.name || 'KaleeReads'}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {calculateReadTime(post.content).text}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={11} />
                              {post.viewCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {blogPosts.length > 6 && (
                  <div className="text-center mt-8">
                    <Link
                      href="/blogs"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                      style={{ color: '#D97846' }}
                    >
                      Read All Stories →
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Stats Section */}
            <section 
              className="rounded-2xl p-8 md:p-12 text-center"
              style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #FFFCF5 100%)' }}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8" style={{ color: '#2C2416' }}>
                Growing Community
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: '#D97846' }}>
                    {books.length}+
                  </div>
                  <div className="text-sm md:text-base font-medium" style={{ color: '#5B4F42' }}>
                    Books Available
                  </div>
                </div>
                <div>
                  <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: '#D97846' }}>
                    {authors.length}+
                  </div>
                  <div className="text-sm md:text-base font-medium" style={{ color: '#5B4F42' }}>
                    Active Authors
                  </div>
                </div>
                <div>
                  <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: '#D97846' }}>
                    {blogPosts.length}+
                  </div>
                  <div className="text-sm md:text-base font-medium" style={{ color: '#5B4F42' }}>
                    Stories Published
                  </div>
                </div>
                <div>
                  <div className="font-heading text-4xl md:text-5xl font-bold mb-2" style={{ color: '#D97846' }}>
                    98%
                  </div>
                  <div className="text-sm md:text-base font-medium" style={{ color: '#5B4F42' }}>
                    Reader Satisfaction
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section 
              className="rounded-2xl p-8 md:p-16 text-center"
              style={{ backgroundColor: '#2C2416' }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FFFCF5' }}>
                Start Your Reading Journey
              </h2>
              <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255, 252, 245, 0.85)' }}>
                Join our community of readers and authors preserving Kalenjin heritage through literature
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/books"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 shadow-lg"
                  style={{ backgroundColor: '#D97846', color: '#FFFCF5' }}
                >
                  Browse Books
                </Link>
                <Link
                  href="/dashboard/author/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 border-2"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#FFFCF5',
                    borderColor: 'rgba(255, 252, 245, 0.3)',
                  }}
                >
                  Become an Author
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
