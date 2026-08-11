'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, Eye, ArrowLeft, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';
import { fetchBlogPost, type BlogPost } from '@/lib/api/blogs';
import { calculateReadTime, formatBlogDate, getYouTubeEmbedUrl } from '@/lib/blog-utils';

export default function BlogDetailPage() {
    const params = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const result = await fetchBlogPost(params.id);
                setPost(result.data || null);
                setError(null);
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
                <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                    <div className="bg-white rounded-2xl p-12 shadow-sm">
                        <h1 className="text-2xl font-heading font-bold text-neutral-brown-900 mb-3">
                            Post not found
                        </h1>
                        <p className="text-neutral-brown-600 mb-8">
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
    const readTime = calculateReadTime(post.content);
    const authorName = post.author?.user?.name || 'KaleeReads Author';
    const authorImage = post.author?.user?.image || post.author?.profileImage;

    return (
        <div className="min-h-screen bg-neutral-cream">
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-neutral-brown-200">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm text-neutral-brown-600 hover:text-primary transition-colors">
                        <ArrowLeft size={16} />
                        All Blog Posts
                    </Link>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Hero Media */}
                {isVideo && (
                    <div className="relative overflow-hidden rounded-xl mb-8 shadow-sm">
                        <iframe
                            src={getYouTubeEmbedUrl(post.coverVideoUrl!)}
                            title={post.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full aspect-video"
                        />
                    </div>
                )}
                {!isVideo && post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full rounded-xl mb-8 shadow-sm aspect-[16/9] object-cover"
                    />
                )}

                {/* Title */}
                <h1 className="font-heading font-bold text-3xl md:text-5xl text-neutral-brown-900 leading-tight mb-6">
                    {post.title}
                </h1>

                {/* Author Meta */}
                <div className="flex items-center gap-4 pb-8 mb-10 border-b border-neutral-brown-200">
                    {authorImage ? (
                        <img
                            src={authorImage}
                            alt={authorName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={24} className="text-primary" />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-neutral-brown-900">{authorName}</p>
                        <div className="flex items-center gap-3 text-sm text-neutral-brown-600 mt-0.5">
                            <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {readTime.text}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {post.viewCount} views
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <BlogPostRenderer content={post.content} />
            </main>

            <Footer />
        </div>
    );
}