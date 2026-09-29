'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock, Eye, ArrowRight, FileText, Users, BookOpen, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toneBackground } from '@/lib/editorial';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';
import { BLOG_CATEGORIES } from '@/lib/constants/blog';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

const sortOptions = [
  { id: 'latest', label: 'Latest' },
  { id: 'most-viewed', label: 'Most Viewed' },
];

export default function BlogsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
                <Navbar />
                <div className="flex justify-center py-32">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
                        <div className="absolute inset-0 border-4 rounded-full animate-spin" style={{ borderColor: '#B4502A', borderTopColor: 'transparent' }}></div>
                    </div>
                </div>
                <Footer />
            </div>
        }>
            <BlogsContent />
        </Suspense>
    );
}

function BlogsContent() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    const searchParams = useSearchParams();

    useEffect(() => {
        const authorParam = searchParams.get('author');
        if (authorParam) setSelectedAuthor(authorParam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
    }, [selectedCategory, selectedAuthor, sortBy]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedAuthor('all');
        setSortBy('latest');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedAuthor !== 'all' || sortBy !== 'latest';

    /* The lead post was purely positional, so switching sort to "Most
       Viewed" silently changed who was featured. Honour the editor's
       isFeatured flag first, and only then fall back to the first post. */
    const leadIndex = posts.findIndex((p) => p.isFeatured);
    const featured = leadIndex >= 0 ? posts[leadIndex] : posts[0];
    const rest = posts.filter((p) => p.id !== featured?.id);
    const topByViews = [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
                <img
                  src="/images/blogs-illustration.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(100deg, rgba(44,36,22,0.92) 0%, rgba(44,36,22,0.65) 55%, rgba(44,36,22,0.35) 100%)' }}
                />
                <div className="relative page-container py-16 sm:py-20">
                    <div className="max-w-3xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] mb-5" style={{ color: '#E8A87C' }}>
                            The Journal
                        </p>
                        <h1
                            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
                            style={{ color: '#FFFCF5' }}
                        >
                            Stories &amp; Insights
                        </h1>
                        <p
                            className="text-lg leading-relaxed max-w-2xl"
                            style={{ color: 'rgba(255, 252, 245, 0.9)' }}
                        >
                            Thoughts, stories and perspectives from our community
                            of African writers.
                        </p>
                    </div>
                </div>
            </section>

            <main id="main-content" className="page-container editorial-section pt-0">
                {/* Category Filter Pills */}
                <p className="kr-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: '#6B5D52' }}>
                    BROWSE BY TOPIC
                </p>
                <div className="flex flex-wrap gap-2.5 mb-10">
                    {BLOG_CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                aria-pressed={active}
                                className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors border"
                                style={
                                    active
                                        ? { backgroundColor: '#2C2416', color: '#FFFCF5', borderColor: '#2C2416' }
                                        : { backgroundColor: '#FFFCF5', color: '#5B4F42', borderColor: '#E4D9C4' }
                                }
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 p-5 rounded-xl" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
                    <div className="flex items-center gap-2 sm:mr-1" style={{ color: '#5B4F42' }}>
                        <SlidersHorizontal size={16} />
                        <span className="text-sm font-semibold">Refine</span>
                    </div>
                    <div className="relative">
                        <label htmlFor="blog-filter-author" className="sr-only">
                            Filter by author
                        </label>
                        <select
                            id="blog-filter-author"
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                            style={{ backgroundColor: '#F5F1E8', borderColor: '#E4D9C4', color: '#2C2416' }}
                        >
                            <option value="all">All Authors</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name || 'Unknown'}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
                    </div>

                    <div className="relative">
                        <label htmlFor="blog-filter-sort" className="sr-only">
                            Sort posts
                        </label>
                        <select
                            id="blog-filter-sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium cursor-pointer"
                            style={{ backgroundColor: '#F5F1E8', borderColor: '#E4D9C4', color: '#2C2416' }}
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B5D52' }} />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
                            style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
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
                            <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#B4502A' }}></div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">Loading blog posts...</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Section header — matches the editorial rhythm
                                used on the homepage and the other pages. */}
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                                <div>
                                    <p className="editorial-eyebrow editorial-eyebrow-rule mb-4">
                                        Latest
                                    </p>
                                    <h2
                                        className="font-heading text-2xl md:text-3xl font-bold"
                                        style={{ color: '#2C2416' }}
                                    >
                                        {posts.length} {posts.length === 1 ? 'Story' : 'Stories'}
                                    </h2>
                                </div>
                                <p className="editorial-numeral hidden lg:block" aria-hidden="true">
                                    01
                                </p>
                            </div>

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
                                                    <span className="inline-block w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4" style={{ backgroundColor: '#F7E4D8', color: '#B4502A' }}>
                                                        {featured.category}
                                                    </span>
                                                )}
                                                <h2 className="text-3xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                                                    {featured.title}
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                                                    {featured.excerpt}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                                                    <span className="font-semibold flex items-center gap-2" style={{ color: '#2C2416' }}>
                                                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F7E4D8', color: '#B4502A' }}>
                                                            {featured.author?.user?.name?.charAt(0) || 'K'}
                                                        </span>
                                                        {featured.author?.user?.name || 'Mama Africa Library'}
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
                                                <span className="inline-flex items-center gap-2 font-bold text-[#B4502A] group-hover:gap-3 transition-all">
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
                                                <div className="relative aspect-[16/9] overflow-hidden" style={{ background: toneBackground(index) }}>
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
                                                            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F7E4D8', color: '#B4502A' }}>
                                                                {post.author?.user?.name?.charAt(0) || 'K'}
                                                            </span>
                                                            {post.author?.user?.name || 'Mama Africa Library'}
                                                        </span>
                                                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                                                    </div>
                                                    {post.category && (
                                                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3" style={{ backgroundColor: '#F7E4D8', color: '#B4502A' }}>
                                                            {post.category}
                                                        </span>
                                                    )}
                                                    <h3 className="text-xl font-bold mb-3 leading-tight line-clamp-2 group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
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
                                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#B4502A] group-hover:gap-3 transition-all">
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
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#E4D9C4' }}>
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
                                            style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
                                        >
                                            Clear Filters
                                        </button>
                                    ) : (
                                        <Link
                                            href="/books"
                                            className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
                                            style={{ backgroundColor: '#B4502A', color: '#FFFFFF' }}
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
                                <div className="px-6 py-4 flex items-center gap-2" style={{ backgroundColor: '#2C2416' }}>
                                    <Eye size={18} style={{ color: '#A8762B' }} />
                                    <h3
                                        className="font-heading font-bold text-lg"
                                        style={{ color: '#FFFCF5' }}
                                    >
                                        Most Read
                                    </h3>
                                </div>
                                {/* divide-y takes its colour from currentColor, so a
                                    borderColor on the wrapper never reached the pixels. */}
                                <div className="divide-y" style={{ borderColor: '#E4D9C4', color: '#E4D9C4' }}>
                                    {topByViews.length > 0 ? topByViews.map((post, i) => (
                                        <Link
                                            key={post.id}
                                            href={`/blogs/${post.slug || post.id}`}
                                            className="flex items-start gap-3 p-4 transition-colors group"
                                            style={{ backgroundColor: 'transparent' }}
                                        >
                                            <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#E4D9C4' }}>
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
                                                    <span className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F7E4D8', color: '#B4502A' }}>
                                                        {i + 1}
                                                    </span>
                                                    <h4 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors" style={{ color: '#2C2416' }}>
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
                                <div className="px-6 py-4" style={{ backgroundColor: '#4F6D4C' }}>
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
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F1E8] transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-md" style={{ background: toneBackground(i) }}>
                                                {author.profileImage ? (
                                                    <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-bold text-lg">{author.name?.charAt(0) || 'A'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors" style={{ color: '#2C2416' }}>
                                                    {author.name || 'Unknown Author'}
                                                </h4>
                                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                                    <BookOpen size={11} /> {author.booksCount || 0} books
                                                </p>
                                            </div>
                                            <ArrowRight size={14} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
                                            style={{ borderColor: '#B4502A', color: '#B4502A' }}
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