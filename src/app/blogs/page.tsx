'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Clock, Eye, ArrowRight, FileText, PenTool, Users, BookOpen, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

const blogCategories = [
  { id: 'all', label: 'All Posts' },
  { id: 'Culture', label: 'Culture' },
  { id: 'Stories', label: 'Stories' },
  { id: 'News', label: 'News' },
  { id: 'Guides', label: 'Guides' },
  { id: 'History', label: 'History' },
  { id: 'Poetry', label: 'Poetry' },
];

function colorSchemeFor(index: number): string {
  const schemes = [
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-red-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-fuchsia-500 to-purple-600',
  ];
  return schemes[index % schemes.length];
}

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const loadPosts = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = { published: true, limit: 24, sort: 'latest' };
            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }
            const [blogRes, authorRes] = await Promise.all([
                fetchBlogPosts(params).catch(() => null),
                fetchAuthors({ limit: 6 }).catch(() => null),
            ]);
            setPosts(blogRes?.data?.posts || []);
            setAuthors(authorRes?.data || []);
            setError(null);
        } catch (err) {
            console.error('Error loading blogs:', err);
            setError('Failed to load blog posts. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const [featured, ...rest] = posts;
    const topByViews = [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    return (
        <div className="min-h-screen bg-neutral-cream">
            <Navbar />

            {/* Page header */}
            <header className="bg-white border-b border-neutral-brown-200">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">KaleeReads Blog</p>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-brown-900">
                        News &amp; Articles
                    </h1>
                    <p className="mt-3 text-lg text-neutral-brown-600 max-w-2xl">
                        Stories, insights and culture from our Kalenjin authors
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Category Filter */}
                <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {blogCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm ${
                                selectedCategory === cat.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-neutral-brown-700 hover:bg-primary/5 border border-neutral-brown-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mb-10">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={loadPosts}
                            className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-full transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-neutral-brown-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-6 text-neutral-brown-600">Loading blog posts...</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main content column */}
                        <div className="lg:col-span-2">
                            {/* Featured Post */}
                            {featured && (
                                <article className="mb-12">
                                    <Link
                                        href={`/blogs/${featured.id}`}
                                        className="group grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative aspect-[16/10] md:h-full bg-gradient-to-br from-neutral-brown-900 to-neutral-brown-800 overflow-hidden">
                                            {featured.coverType === 'video' && featured.coverVideoUrl ? (
                                                <VideoThumbnail
                                                    videoUrl={featured.coverVideoUrl}
                                                    title={featured.title}
                                                    showLabel
                                                    className="w-full h-full"
                                                />
                                            ) : featured.coverImage ? (
                                                <img
                                                    src={featured.coverImage}
                                                    alt={featured.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-6xl text-white/30 font-heading font-bold">K</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-7 md:p-8 flex flex-col justify-center">
                                            {featured.category && (
                                                <span className="inline-block w-fit px-3 py-1 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wide rounded-full mb-4">
                                                    {featured.category}
                                                </span>
                                            )}
                                            <h2 className="font-heading font-bold text-2xl text-neutral-brown-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                                                {featured.title}
                                            </h2>
                                            <p className="text-neutral-brown-700 leading-relaxed mb-5 line-clamp-3">
                                                {featured.excerpt}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-brown-600 mb-5">
                                                <span className="font-medium text-neutral-brown-900 flex items-center gap-2">
                                                    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                                                        {featured.author?.user?.name?.charAt(0) || 'K'}
                                                    </span>
                                                    {featured.author?.user?.name || 'KaleeReads'}
                                                </span>
                                                <span>{formatBlogDate(featured.publishedAt || featured.createdAt)}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {calculateReadTime(featured.content).text}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={14} />
                                                    {featured.viewCount}
                                                </span>
                                            </div>
                                            <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                                                More... <ArrowRight size={18} />
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            )}

                            {/* Blog Item List */}
                            {rest.length > 0 && (
                                <div className="space-y-8">
                                    {rest.map((post, index) => (
                                        <article key={post.id}>
                                            <Link
                                                href={`/blogs/${post.id}`}
                                                className="group grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className={`relative aspect-[16/10] sm:aspect-auto sm:h-full bg-gradient-to-br ${colorSchemeFor(index)} overflow-hidden`}>
                                                    {post.coverType === 'video' && post.coverVideoUrl ? (
                                                        <VideoThumbnail
                                                            videoUrl={post.coverVideoUrl}
                                                            title={post.title}
                                                        />
                                                    ) : post.coverImage ? (
                                                        <img
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-5xl text-white/40 font-heading font-bold">K</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col justify-center">
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-brown-500 mb-3">
                                                        <span className="font-medium text-neutral-brown-900 flex items-center gap-2">
                                                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                                                                {post.author?.user?.name?.charAt(0) || 'K'}
                                                            </span>
                                                            {post.author?.user?.name || 'KaleeReads'}
                                                        </span>
                                                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={13} />
                                                            {calculateReadTime(post.content).text}
                                                        </span>
                                                        {post.category && (
                                                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                                                                {post.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-heading font-bold text-xl text-neutral-brown-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-sm text-neutral-brown-700 leading-relaxed line-clamp-2 mb-4">
                                                        {post.excerpt}
                                                    </p>
                                                    <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                                                        More... <ArrowRight size={16} />
                                                    </span>
                                                </div>
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {posts.length === 0 && (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FileText size={28} className="text-neutral-brown-400" />
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold text-neutral-brown-900 mb-2">
                                        {selectedCategory !== 'all' ? `No ${selectedCategory} posts yet` : 'No blog posts yet'}
                                    </h3>
                                    <p className="text-neutral-brown-600 mb-6">
                                        {selectedCategory !== 'all'
                                            ? 'Try selecting a different category.'
                                            : 'Our authors haven\'t published anything yet. Check back soon!'}
                                    </p>
                                    {selectedCategory !== 'all' ? (
                                        <button
                                            onClick={() => setSelectedCategory('all')}
                                            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all"
                                        >
                                            View All Posts
                                        </button>
                                    ) : (
                                        <Link
                                            href="/books"
                                            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all"
                                        >
                                            Browse Books
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar modules */}
                        <aside className="lg:col-span-1 space-y-6">
                            {/* Most Read */}
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 bg-neutral-brown-900 rounded-t-2xl">
                                    <h3 className="text-white font-heading font-bold flex items-center gap-2">
                                        <Eye size={16} className="text-accent-gold" />
                                        Most Read
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
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={11} /> {post.viewCount}
                                                    </span>
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
                                    {authors.length > 0 ? authors.map((author, i) => (
                                        <Link key={author.id} href={`/authors/${author.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-cream/60 transition-colors group">
                                            <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${colorSchemeFor(i)} flex items-center justify-center shrink-0`}>
                                                {author.profileImage ? (
                                                    <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-bold">{author.name?.charAt(0) || 'A'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-semibold text-neutral-brown-900 truncate group-hover:text-primary transition-colors">
                                                    {author.name || 'Unknown Author'}
                                                </h4>
                                                <p className="text-xs text-neutral-brown-500 flex items-center gap-1">
                                                    <BookOpen size={11} /> {author.booksCount} books
                                                </p>
                                            </div>
                                            <ArrowRight size={14} className="text-neutral-brown-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                        </Link>
                                    )) : (
                                        <p className="text-sm text-neutral-brown-500 p-2">No authors yet.</p>
                                    )}
                                </div>
                                <div className="px-4 pb-4">
                                    <Link href="/authors" className="flex items-center justify-center gap-2 text-sm text-primary font-semibold py-2.5 rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors">
                                        View All Authors <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            {/* Write for us prompt */}
                            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
                                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                                    <PenTool size={22} />
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-2">Become an Author</h3>
                                <p className="text-white/80 text-sm leading-relaxed mb-4">
                                    Share your stories and insights with our community. Reach readers who love Kalenjin literature.
                                </p>
                                <Link
                                    href="/dashboard/author/register"
                                    className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-cream transition-all"
                                >
                                    Get Started <ArrowRight size={16} />
                                </Link>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}