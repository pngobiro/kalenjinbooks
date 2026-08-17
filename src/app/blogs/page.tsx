'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Clock, Eye, ArrowRight, FileText, Users, BookOpen, Search, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';
import { BLOG_CATEGORIES } from '@/lib/constants/blog';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

const sortOptions = [
  { id: 'latest', label: 'Latest' },
  { id: 'most-viewed', label: 'Most Viewed' },
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

function getGradientForIndex(index: number): string {
  const gradients = [
    'from-emerald-400 via-teal-400 to-cyan-500',
    'from-rose-400 via-pink-400 to-fuchsia-500',
    'from-amber-400 via-orange-400 to-red-500',
    'from-violet-400 via-purple-400 to-indigo-500',
    'from-blue-400 via-indigo-400 to-purple-500',
    'from-cyan-400 via-blue-400 to-indigo-500',
    'from-pink-400 via-rose-400 to-red-500',
    'from-lime-400 via-green-400 to-emerald-500',
  ];
  return gradients[index % gradients.length];
}

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [showFilters, setShowFilters] = useState(false);

    const loadPosts = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = { published: true, limit: 24, sort: sortBy };
            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }
            if (selectedAuthor !== 'all') {
                params.authorId = selectedAuthor;
            }
            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }
            const [blogRes, authorRes] = await Promise.all([
                fetchBlogPosts(params).catch(() => null),
                fetchAuthors({ limit: 50 }).catch(() => null),
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
    }, [selectedCategory, selectedAuthor, searchQuery, sortBy]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadPosts();
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedAuthor('all');
        setSearchQuery('');
        setSortBy('latest');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedAuthor !== 'all' || searchQuery !== '' || sortBy !== 'latest';

    const [featured, ...rest] = posts;
    const topByViews = [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Stories & Insights
                        </h1>
                        <p className="text-lg sm:text-xl text-white/95 leading-relaxed mb-8">
                            Explore thoughts, stories, and perspectives from our community of Kalenjin writers
                        </p>
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative max-w-2xl">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search blog posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                                style={{ backgroundColor: '#FFFCF5' }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                    {BLOG_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all shadow-sm hover:shadow-md"
                            style={{
                                backgroundColor: selectedCategory === cat.id ? '#D97846' : '#FFFCF5',
                                color: selectedCategory === cat.id ? '#FFFFFF' : '#2C2416',
                                border: selectedCategory === cat.id ? 'none' : '1px solid #E5D5C3'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 rounded-xl" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    >
                        <option value="all">All Authors</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.name || 'Unknown'}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
                            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                        >
                            <X size={16} />
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="rounded-xl p-12 text-center mb-10 shadow-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                        <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
                        <button
                            onClick={loadPosts}
                            className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
                            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#F5E6D3' }}></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">Loading blog posts...</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Featured Post */}
                            {featured && (
                                <article className="mb-8">
                                    <Link
                                        href={`/blogs/${featured.slug || featured.id}`}
                                        className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                        style={{ backgroundColor: '#FFFCF5' }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                                            <div className="md:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
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
                                                        <span className="text-7xl text-white/20 font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>K</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="md:col-span-3 p-8 flex flex-col justify-center">
                                                {featured.category && (
                                                    <span className="inline-block w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                                                        {featured.category}
                                                    </span>
                                                )}
                                                <h2 className="text-3xl font-bold mb-4 leading-tight group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                                                    {featured.title}
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                                                    {featured.excerpt}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                                                    <span className="font-semibold flex items-center gap-2" style={{ color: '#2C2416' }}>
                                                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                                                            {featured.author?.user?.name?.charAt(0) || 'K'}
                                                        </span>
                                                        {featured.author?.user?.name || 'KaleeReads'}
                                                    </span>
                                                    <span>{formatBlogDate(featured.publishedAt || featured.createdAt)}</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={14} />
                                                        {calculateReadTime(featured.content).text}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Eye size={14} />
                                                        {featured.viewCount}
                                                    </span>
                                                </div>
                                                <span className="inline-flex items-center gap-2 font-bold text-orange-600 group-hover:gap-3 transition-all">
                                                    Read More <ArrowRight size={20} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            )}

                            {/* Blog Post Grid */}
                            {rest.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {rest.map((post, index) => (
                                        <article key={post.id}>
                                            <Link
                                                href={`/blogs/${post.slug || post.id}`}
                                                className="group block rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full"
                                                style={{ backgroundColor: '#FFFCF5' }}
                                            >
                                                <div className={`relative aspect-[16/9] bg-gradient-to-br ${getGradientForIndex(index)} overflow-hidden`}>
                                                    {post.coverType === 'video' && post.coverVideoUrl ? (
                                                        <VideoThumbnail
                                                            videoUrl={post.coverVideoUrl}
                                                            title={post.title}
                                                            className="w-full h-full"
                                                        />
                                                    ) : post.coverImage ? (
                                                        <img
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-6xl text-white/30 font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>K</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                                                        <span className="font-semibold flex items-center gap-2" style={{ color: '#2C2416' }}>
                                                            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                                                                {post.author?.user?.name?.charAt(0) || 'K'}
                                                            </span>
                                                            {post.author?.user?.name || 'KaleeReads'}
                                                        </span>
                                                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                                                    </div>
                                                    {post.category && (
                                                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                                                            {post.category}
                                                        </span>
                                                    )}
                                                    <h3 className="text-xl font-bold mb-3 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-4">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={13} />
                                                            {calculateReadTime(post.content).text}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye size={13} />
                                                            {post.viewCount}
                                                        </span>
                                                    </div>
                                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all">
                                                        Read More <ArrowRight size={16} />
                                                    </span>
                                                </div>
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {posts.length === 0 && (
                                <div className="rounded-xl p-16 text-center shadow-md" style={{ backgroundColor: '#FFFCF5' }}>
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5E6D3' }}>
                                        <FileText size={36} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                                        {hasActiveFilters ? 'No matching posts found' : 'No blog posts yet'}
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        {hasActiveFilters
                                            ? 'Try adjusting your filters or search query.'
                                            : 'Our authors haven\'t published anything yet. Check back soon!'}
                                    </p>
                                    {hasActiveFilters ? (
                                        <button
                                            onClick={clearFilters}
                                            className="px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
                                            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                                        >
                                            Clear Filters
                                        </button>
                                    ) : (
                                        <Link
                                            href="/books"
                                            className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
                                            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
                                        >
                                            Browse Books
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-6">
                            {/* Most Read */}
                            <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: '#FFFCF5' }}>
                                <div className="px-6 py-4" style={{ backgroundColor: '#2C2416' }}>
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        <Eye size={18} style={{ color: '#C9A354' }} />
                                        Most Read
                                    </h3>
                                </div>
                                <div className="divide-y" style={{ borderColor: '#E5D5C3' }}>
                                    {topByViews.length > 0 ? topByViews.map((post, i) => (
                                        <Link 
                                            key={post.id} 
                                            href={`/blogs/${post.slug || post.id}`} 
                                            className="flex items-start gap-3 p-4 hover:bg-orange-50 transition-colors group"
                                        >
                                            <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#F5E6D3' }}>
                                                {post.coverType === 'video' && post.coverVideoUrl ? (
                                                    <VideoThumbnail videoUrl={post.coverVideoUrl} title={post.title} />
                                                ) : post.coverImage ? (
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-300" style={{ fontFamily: 'Playfair Display, serif' }}>
                                                        {post.title.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <span className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                                                        {i + 1}
                                                    </span>
                                                    <h4 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors" style={{ color: '#2C2416' }}>
                                                        {post.title}
                                                    </h4>
                                                </div>
                                                <p className="text-xs text-gray-600 flex items-center gap-3">
                                                    <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={11} /> {post.viewCount}
                                                    </span>
                                                </p>
                                            </div>
                                        </Link>
                                    )) : (
                                        <p className="text-sm text-gray-500 p-6">No posts yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Our Authors */}
                            <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: '#FFFCF5' }}>
                                <div className="px-6 py-4" style={{ backgroundColor: '#7A9B76' }}>
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        <Users size={18} />
                                        Our Authors
                                    </h3>
                                </div>
                                <div className="p-4 space-y-2">
                                    {authors.length > 0 ? authors.slice(0, 8).map((author, i) => (
                                        <Link 
                                            key={author.id} 
                                            href={`/authors/${author.id}`} 
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
                                        >
                                            <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br ${colorSchemeFor(i)} flex items-center justify-center shrink-0 shadow-md`}>
                                                {author.profileImage ? (
                                                    <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-bold text-lg">{author.name?.charAt(0) || 'A'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-bold truncate group-hover:text-orange-600 transition-colors" style={{ color: '#2C2416' }}>
                                                    {author.name || 'Unknown Author'}
                                                </h4>
                                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                                    <BookOpen size={11} /> {author.booksCount || 0} books
                                                </p>
                                            </div>
                                            <ArrowRight size={14} className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                                        </Link>
                                    )) : (
                                        <p className="text-sm text-gray-500 p-4">No authors yet.</p>
                                    )}
                                </div>
                                {authors.length > 0 && (
                                    <div className="px-4 pb-4">
                                        <Link 
                                            href="/authors" 
                                            className="flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-lg border-2 transition-all hover:shadow-md"
                                            style={{ borderColor: '#D97846', color: '#D97846' }}
                                        >
                                            View All Authors <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}