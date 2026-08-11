'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Star, ArrowRight, Clock, Eye, User, Users, FileText, PenTool } from 'lucide-react';
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
          fetchBooks({ limit: 4 }).catch(() => null),
          fetchBlogPosts({ published: true, limit: 8 }).catch(() => null),
          fetchAuthors({ limit: 6 }).catch(() => null),
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

  const [featured, ...latestPosts] = blogPosts;
  const topByViews = [...blogPosts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Hero - simple welcome */}
      <section className="bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-3">
              KaleeReads
            </h1>
            <p className="text-base text-neutral-brown-200 mb-5">
              Books, stories, culture, and heritage from Kalenjin authors. Read, explore, and support local writers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/blogs" className="bg-white hover:bg-neutral-cream text-neutral-brown-900 font-semibold px-6 py-2.5 rounded-full transition-all text-sm">
                Read the Blog
              </Link>
              <Link href="/books" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2.5 rounded-full transition-all text-sm">
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Blog Post */}
        {featured && (
          <section className="mb-14">
            <Link
              href={`/blogs/${featured.id}`}
              className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/10] md:aspect-auto md:h-full bg-gradient-to-br from-neutral-brown-900 to-neutral-brown-800 overflow-hidden">
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : featured.coverType === 'video' && featured.coverVideoUrl ? (
                  <VideoThumbnail
                    videoUrl={featured.coverVideoUrl}
                    title={featured.title}
                    showLabel
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl text-white/30 font-heading font-bold">K</span>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                {featured.category && (
                  <span className="inline-block w-fit px-3 py-1 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wide rounded-full mb-4">
                    {featured.category}
                  </span>
                )}
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-brown-900 mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                  {featured.title}
                </h2>
                <p className="text-neutral-brown-700 leading-relaxed mb-6 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-brown-600">
                  <span className="font-medium text-neutral-brown-900">{featured.author?.user?.name || 'KaleeReads'}</span>
                  <span>{formatBlogDate(featured.publishedAt || featured.createdAt)}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {calculateReadTime(featured.content).text}</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {featured.viewCount}</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">Continue Reading <ArrowRight size={18} /></span>
              </div>
            </Link>
          </section>
        )}

        {/* Blog Posts + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Latest posts - main */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Latest Posts</h2>
                <p className="text-neutral-brown-600">Fresh stories and insights</p>
              </div>
              <Link href="/blogs" className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors">
                All Posts <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-neutral-brown-200 rounded-full"></div>
                <div className="absolute top-0 w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : latestPosts.length > 0 ? (
              <div className="space-y-6">
                {latestPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.id}`}
                    className="group grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`relative aspect-[16/10] sm:aspect-auto sm:h-full bg-gradient-to-br ${colorSchemes[index % colorSchemes.length]} overflow-hidden`}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : post.coverType === 'video' && post.coverVideoUrl ? (
                        <VideoThumbnail
                          videoUrl={post.coverVideoUrl}
                          title={post.title}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={32} className="text-white/50" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-neutral-brown-500 mb-2">
                        <span className="font-medium text-neutral-brown-900">{post.author?.user?.name || 'KaleeReads'}</span>
                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                        <span className="flex items-center gap-1"><Eye size={12} /> {post.viewCount}</span>
                        {post.category && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{post.category}</span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-lg text-neutral-brown-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-brown-700 line-clamp-2 mb-3">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                        Continue Reading <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="text-center mt-8 md:hidden">
              <Link href="/blogs" className="inline-flex items-center gap-2 text-primary font-semibold">
                View All Posts <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Popular Posts */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-neutral-brown-900 rounded-t-2xl">
                <h3 className="text-white font-heading font-bold flex items-center gap-2">
                  <Eye size={16} className="text-accent-gold" />
                  Popular Posts
                </h3>
              </div>
              <div className="divide-y divide-neutral-brown-100">
                {topByViews.length > 0 ? topByViews.map((post, i) => (
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
                )) : (
                  <p className="text-sm text-neutral-brown-500 p-6">No posts yet.</p>
                )}
              </div>
            </div>

            {/* Authors */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-accent-green rounded-t-2xl">
                <h3 className="text-white font-heading font-bold flex items-center gap-2">
                  <Users size={16} />
                  Our Authors
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {loading ? (
                  <p className="text-sm text-neutral-brown-500 p-2">Loading...</p>
                ) : authors.length > 0 ? (
                  authors.map((author, i) => (
                    <Link key={author.id} href={`/authors/${author.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-cream/60 transition-colors group">
                      <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${colorSchemes[i % colorSchemes.length]} flex items-center justify-center shrink-0`}>
                        {author.profileImage ? (
                          <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-sm">{author.name?.charAt(0) || 'A'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-brown-900 truncate group-hover:text-primary transition-colors">
                          {author.name || 'Unknown Author'}
                        </h4>
                        <p className="text-xs text-neutral-brown-500">{author.booksCount} books</p>
                      </div>
                      <ArrowRight size={14} className="text-neutral-brown-300 group-hover:text-primary transition-colors" />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-neutral-brown-500 p-2">No authors yet.</p>
                )}
              </div>
              <div className="px-4 pb-4">
                <Link href="/authors" className="flex items-center justify-center gap-2 text-sm text-primary font-semibold py-2.5 rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors">
                  View All Authors <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Featured Books - small module */}
            {books.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-primary rounded-t-2xl">
                  <h3 className="text-white font-heading font-bold flex items-center gap-2">
                    <BookOpen size={16} />
                    Featured Books
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {books.slice(0, 3).map((book, i) => (
                    <Link key={book.id} href={`/books/${book.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-cream/60 transition-colors group">
                      <div className={`w-10 h-14 rounded-lg overflow-hidden bg-gradient-to-br ${colorSchemes[i % colorSchemes.length]} flex items-center justify-center shrink-0`}>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen size={14} className="text-white/70" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-brown-900 truncate group-hover:text-primary transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-xs text-neutral-brown-500">{book.author?.user?.name || 'Unknown'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-primary">KES {book.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <Link href="/books" className="flex items-center justify-center gap-2 text-sm text-primary font-semibold py-2.5 rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors">
                    Browse All Books <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
