'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, Eye, ArrowLeft, User, PlayCircle } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';
import VideoThumbnail from '@/components/blog/VideoThumbnail';
import { fetchBlogPost, fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { calculateReadTime, formatBlogDate, getYouTubeEmbedUrl } from '@/lib/blog-utils';
import { toneBackground } from '@/lib/editorial';

export default function BlogDetailPage() {
    const params = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const result = await fetchBlogPost(params.id);
                setPost(result.data || null);
                setError(null);
                if (result.data?.id) {
                    import('@/lib/analytics').then((m) => m.trackBlogView(result.data!.id, result.data!.authorId));
                }
                if (result.data) {
                    const authorPostsRes = await fetchBlogPosts({
                        authorId: result.data.authorId,
                        published: true,
                        limit: 8,
                    }).catch(() => null);
                    const other = (authorPostsRes?.data?.posts || []).filter((p) => p.id !== result.data!.id);
                    setAuthorPosts(other.slice(0, 6));
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-cream">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-neutral-brown-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-neutral-brown-600">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-neutral-cream">
                <Navbar />
                <div className="page-container py-24 max-w-3xl">
                    <div className="editorial-card p-12 text-center">
                        <h1
                            className="font-heading text-2xl font-bold mb-3"
                            style={{ color: '#2C2416' }}
                        >
                            Post not found
                        </h1>
                        <p className="mb-8" style={{ color: '#5B4F42' }}>
                            {error || 'This blog post may have been removed or unpublished.'}
                        </p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all"
                        >
                            <ArrowLeft size={18} /> Back to Blog
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const isVideo = post.coverType === 'video' && post.coverVideoUrl;
    // Empty string when the URL is not a recognisable YouTube video; the hero
    // then renders a link out instead of a permanently blank iframe.
    const embedUrl = isVideo ? getYouTubeEmbedUrl(post.coverVideoUrl!) : '';
    const readTime = calculateReadTime(post.content);
    const authorName = post.author?.user?.name || 'Mama Africa Library Author';
    const authorImage = post.author?.user?.image || post.author?.profileImage;
    const authorId = post.author?.id;
    // A post only gets a separate title block when it has no cover art; with
    // imagery or a player, the media is the anchor and the title sits under it.
    const hasHeroMedia = isVideo || !!post.coverImage;

    return (
        <div className="min-h-screen bg-neutral-cream">
            <Navbar />

            {/* Running head */}
            <div className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
                <div
                    className="absolute inset-0 opacity-15"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 50%, #B4502A 0%, transparent 45%), radial-gradient(circle at 85% 50%, #A8762B 0%, transparent 40%)',
                    }}
                    aria-hidden="true"
                />
                <div className="relative page-container py-4 flex items-center justify-between gap-4">
                    <Link
                        href="/blogs"
                        className="group inline-flex items-center gap-2.5 text-sm font-semibold transition-colors"
                        style={{ color: '#E4D9C4' }}
                    >
                        <span
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={{ backgroundColor: '#B4502A' }}
                        >
                            <ArrowLeft size={15} className="text-white" />
                        </span>
                        All Blog Posts
                    </Link>
                    {post.category && (
                        <Link
                            href={`/blogs?category=${encodeURIComponent(post.category)}`}
                            className="hidden sm:inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                            style={{
                                backgroundColor: 'rgba(217,120,70,0.18)',
                                color: '#E8A87C',
                                border: '1px solid rgba(217,120,70,0.4)',
                            }}
                        >
                            {post.category}
                        </Link>
                    )}
                </div>
            </div>

            <main id="main-content" className="page-container py-12">
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
                    <article className="max-w-3xl">
                        {/* Hero. Posts without cover art get a typographic hero
                            so the page still has a strong top instead of opening
                            straight into a wall of body text. */}
                        {hasHeroMedia ? null : (
                            <header className="mb-10">
                                <p className="editorial-eyebrow editorial-eyebrow-rule mb-5">
                                    {post.category || 'Essay'}
                                </p>
                                <h1
                                    className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.12] mb-6"
                                    style={{ color: '#2C2416' }}
                                >
                                    {post.title}
                                </h1>
                                {post.excerpt && (
                                    <p
                                        className="text-lg md:text-xl leading-relaxed mb-8"
                                        style={{ color: '#5B4F42' }}
                                    >
                                        {post.excerpt}
                                    </p>
                                )}
                            </header>
                        )}
                        {/* Hero Media */}
                        {isVideo && (
                            embedUrl ? (
                                <div className="relative overflow-hidden rounded-xl mb-8 shadow-sm bg-ink">
                                    <iframe
                                        src={`${embedUrl}?rel=0`}
                                        title={post.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className="w-full aspect-video"
                                    />
                                    {/* Shown when the owner has disabled embedding for this
                                        video. YouTube renders a blank frame in that case, so
                                        this gives the reader a working way to watch instead. */}
                                    <noscript>
                                        <a
                                            href={post.coverVideoUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center text-warm-white text-sm font-semibold hover:underline"
                                        >
                                            Watch this video on YouTube
                                        </a>
                                    </noscript>
                                </div>
                            ) : (
                                <a
                                    href={post.coverVideoUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative overflow-hidden rounded-xl mb-8 shadow-sm bg-ink group"
                                >
                                    <div className="aspect-video flex flex-col items-center justify-center gap-2 text-center px-6">
                                        <PlayCircle size={48} className="text-warm-white/80 group-hover:scale-110 transition-transform" />
                                        <span className="text-warm-white/80 text-sm font-semibold">
                                            Watch this video on the original site
                                        </span>
                                    </div>
                                </a>
                            )
                        )}
                        {!isVideo && post.coverImage && (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full rounded-lg mb-8 aspect-[16/9] object-cover"
                            />
                        )}

                        {/* Title — only rendered here when there is hero media;
                            otherwise the typographic header above owns it. */}
                        {hasHeroMedia && (
                            <header className="mb-8">
                                <h1
                                    className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.12] mb-5"
                                    style={{ color: '#2C2416' }}
                                >
                                    {post.title}
                                </h1>
                                {post.excerpt && (
                                    <p
                                        className="text-lg leading-relaxed"
                                        style={{ color: '#5B4F42' }}
                                    >
                                        {post.excerpt}
                                    </p>
                                )}
                            </header>
                        )}

                        {/* Byline */}
                        <div
                            className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b"
                            style={{ borderColor: '#E4D9C4' }}
                        >
                            <div className="flex items-center gap-4">
                                {authorImage ? (
                                    <img
                                        src={authorImage}
                                        alt=""
                                        loading="lazy"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="tile-primary w-12 h-12 rounded-full flex items-center justify-center">
                                        <User size={22} />
                                    </div>
                                )}
                                <div>
                                    {authorId ? (
                                        <Link
                                            href={`/authors/${authorId}`}
                                            className="font-semibold hover:text-primary transition-colors"
                                            style={{ color: '#2C2416' }}
                                        >
                                            {authorName}
                                        </Link>
                                    ) : (
                                        <p className="font-semibold" style={{ color: '#2C2416' }}>
                                            {authorName}
                                        </p>
                                    )}
                                    <div
                                        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mt-0.5"
                                        style={{ color: '#6B5D52' }}
                                    >
                                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                                        <span aria-hidden="true" style={{ color: '#E4D9C4' }}>
                                            /
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock size={13} />
                                            {readTime.text}
                                        </span>
                                        <span aria-hidden="true" style={{ color: '#E4D9C4' }}>
                                            /
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Eye size={13} />
                                            {post.viewCount} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ShareButtons title={post.title} type="blog" />
                        </div>

                        {/* Content */}
                        <BlogPostRenderer content={post.content} />
                    </article>

                    {/* Right sidebar — more from this author */}
                    <aside className="mt-12 lg:mt-0">
                        <div
                            className="editorial-card p-6 lg:sticky lg:top-24"
                            style={{ backgroundColor: '#FFFCF5' }}
                        >
                            <p className="editorial-eyebrow editorial-eyebrow-rule mb-3">
                                More from
                            </p>
                            <h3
                                className="font-heading font-bold text-lg mb-1"
                                style={{ color: '#2C2416' }}
                            >
                                {authorName}
                            </h3>
                            <p className="text-xs mb-5" style={{ color: '#6B5D52' }}>
                                {authorPosts.length > 0
                                    ? `${authorPosts.length} other ${authorPosts.length === 1 ? 'story' : 'stories'}`
                                    : 'No other blogs by this author yet.'}
                            </p>
                            <div className="space-y-4">
                                {authorPosts.map((p, i) => (
                                    <Link
                                        key={p.id}
                                        href={`/blogs/${p.slug || p.id}`}
                                        className="group flex gap-3"
                                    >
                                        <div
                                            className="w-24 h-16 rounded-lg overflow-hidden shrink-0"
                                            style={{ backgroundColor: '#E4D9C4' }}
                                        >
                                            {p.coverType === 'video' && p.coverVideoUrl ? (
                                                <VideoThumbnail videoUrl={p.coverVideoUrl} title={p.title} />
                                            ) : p.coverImage ? (
                                                <img
                                                    src={p.coverImage}
                                                    alt=""
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center font-heading font-bold text-xl"
                                                    style={{ background: toneBackground(i) }}
                                                    aria-hidden="true"
                                                >
                                                    <span className="text-white/90">
                                                        {p.title.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4
                                                className="font-heading font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug"
                                                style={{ color: '#2C2416' }}
                                            >
                                                {p.title}
                                            </h4>
                                            <div
                                                className="flex items-center gap-3 text-xs mt-1"
                                                style={{ color: '#6B5D52' }}
                                            >
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock size={11} />
                                                    {calculateReadTime(p.content).text}
                                                </span>
                                                <span>{formatBlogDate(p.publishedAt || p.createdAt)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}