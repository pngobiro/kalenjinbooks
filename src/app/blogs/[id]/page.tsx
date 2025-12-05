'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Calendar, Share2, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';
import BlogCard from '@/components/blog/BlogCard';
import { formatBlogDate, calculateReadTime } from '@/lib/blog-utils';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    publishedAt: string;
    viewCount: number;
    author: {
        id: string;
        user: {
            name: string;
        };
        bio?: string;
        profileImage?: string;
    };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [params.id]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blog/posts/${params.id}`);
            if (!response.ok) {
                router.push('/blogs');
                return;
            }
            const data = await response.json();
            setPost(data);

            // Fetch related posts by same author
            const relatedResponse = await fetch(`/api/blog/posts?authorId=${data.author.id}&published=true&limit=3`);
            const relatedData = await relatedResponse.json();
            setRelatedPosts(relatedData.posts.filter((p: any) => p.id !== params.id).slice(0, 3));
        } catch (error) {
            console.error('Error fetching post:', error);
            router.push('/blogs');
        } finally {
            setLoading(false);
        }
    };

    const shareOnTwitter = () => {
        const url = window.location.href;
        const text = `Check out this blog post: ${post?.title}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnFacebook = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
                <p className="text-neutral-brown-700">Loading...</p>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    const readTime = calculateReadTime(post.content);

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-2">
                            <KaleeReadsLogo size={44} />
                            <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium">Books</Link>
                            <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium">Authors</Link>
                            <Link href="/blogs" className="text-primary font-medium">Blogs</Link>
                            <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium">About</Link>
                        </div>

                        <Link
                            href="/dashboard/author"
                            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Back Button */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Blogs
                </Link>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
                <div className="w-full h-96 mt-6">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Article */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Title */}
                <h1 className="text-5xl font-bold text-neutral-brown-900 mb-6">
                    {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-neutral-brown-500/10 mb-8">
                    {/* Author */}
                    <Link href={`/authors/${post.author.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        {post.author.profileImage ? (
                            <img
                                src={post.author.profileImage}
                                alt={post.author.user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-bold text-lg">
                                    {post.author.user.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-neutral-brown-900">{post.author.user.name}</p>
                            <p className="text-sm text-neutral-brown-700">Author</p>
                        </div>
                    </Link>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-neutral-brown-700">
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{formatBlogDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{readTime.text}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{post.viewCount.toLocaleString()} views</span>
                        </div>
                    </div>

                    {/* Share */}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-sm text-neutral-brown-700 mr-2">Share:</span>
                        <button
                            onClick={shareOnTwitter}
                            className="p-2 text-neutral-brown-700 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                            title="Share on Twitter"
                        >
                            <Twitter size={18} />
                        </button>
                        <button
                            onClick={shareOnFacebook}
                            className="p-2 text-neutral-brown-700 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                            title="Share on Facebook"
                        >
                            <Facebook size={18} />
                        </button>
                        <button
                            onClick={copyLink}
                            className="p-2 text-neutral-brown-700 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                            title="Copy link"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <BlogPostRenderer content={post.content} />

                {/* Author Bio */}
                {post.author.bio && (
                    <div className="mt-12 p-6 bg-white rounded-xl border border-neutral-brown-500/10">
                        <h3 className="text-lg font-bold text-neutral-brown-900 mb-3">About the Author</h3>
                        <div className="flex gap-4">
                            {post.author.profileImage && (
                                <img
                                    src={post.author.profileImage}
                                    alt={post.author.user.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <p className="font-semibold text-neutral-brown-900 mb-1">{post.author.user.name}</p>
                                <p className="text-neutral-brown-700 text-sm">{post.author.bio}</p>
                            </div>
                        </div>
                    </div>
                )}
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-neutral-brown-900 mb-8">
                            More from {post.author.user.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard
                                    key={relatedPost.id}
                                    id={relatedPost.id}
                                    title={relatedPost.title}
                                    excerpt={relatedPost.excerpt}
                                    coverImage={relatedPost.coverImage}
                                    author={{
                                        name: relatedPost.author.user.name,
                                        profileImage: relatedPost.author.profileImage,
                                    }}
                                    publishedAt={relatedPost.publishedAt}
                                    viewCount={relatedPost.viewCount}
                                    readTime={calculateReadTime(relatedPost.content).minutes}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
