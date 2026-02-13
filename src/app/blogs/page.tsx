'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import { Search, ArrowLeft, PenLine, Sparkles } from 'lucide-react';
import { calculateReadTime } from '@/lib/blog-utils';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    author: {
        id: string;
        user: {
            name: string;
        };
        profileImage?: string;
    };
    publishedAt: string;
    viewCount: number;
    content: string;
}

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/blog/posts?published=true');
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts
        .filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            }
            return b.viewCount - a.viewCount;
        });

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="44" height="44">
                                <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" fill="#E07856"></path>
                                <path d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" fill="#D4AF37"></path>
                                <path d="M12 8C12 8 11 9.5 11 11C11 11.8 11.4 12.4 12 12.5C12.6 12.4 13 11.8 13 11C13 9.5 12 8 12 8Z" fill="#C85D3A"></path>
                            </svg>
                            <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium">Books</Link>
                            <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium">Authors</Link>
                            <Link href="/blogs" className="text-primary font-medium">Blogs</Link>
                            <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium">About</Link>
                        </div>

                        <Link href="/books" className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                            Browse Books
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-green rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                            <PenLine size={16} className="text-accent-gold" />
                            <span className="text-white/90 text-sm font-medium">Latest Stories</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
                            Blog
                        </h1>
                        <p className="text-lg text-neutral-brown-200 mb-8">
                            Discover stories, insights, and perspectives from our community of authors
                        </p>

                        {/* Search */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={22} />
                            <input
                                type="search"
                                placeholder="Search blog posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 text-neutral-brown-900 text-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
                    </svg>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Filters */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                    <p className="text-neutral-brown-700 font-medium">
                        <span className="font-bold text-primary">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'} found
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('latest')}
                            className={`px-5 py-2.5 rounded-full font-medium transition-all ${sortBy === 'latest'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-white text-neutral-brown-700 hover:bg-primary/5'
                                }`}
                        >
                            Latest
                        </button>
                        <button
                            onClick={() => setSortBy('views')}
                            className={`px-5 py-2.5 rounded-full font-medium transition-all ${sortBy === 'views'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-white text-neutral-brown-700 hover:bg-primary/5'
                                }`}
                        >
                            Most Viewed
                        </button>
                    </div>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="relative mx-auto">
                            <div className="w-16 h-16 border-4 border-neutral-brown-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-6 text-neutral-brown-600">Loading blog posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl">
                        <div className="w-20 h-20 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-6">
                            <PenLine size={36} className="text-neutral-brown-300" />
                        </div>
                        <p className="text-neutral-brown-600 text-lg">No blog posts found.</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-primary hover:text-primary-dark font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                excerpt={post.excerpt}
                                coverImage={post.coverImage}
                                author={{
                                    name: post.author.user.name,
                                    profileImage: post.author.profileImage,
                                }}
                                publishedAt={post.publishedAt}
                                viewCount={post.viewCount}
                                readTime={calculateReadTime(post.content).minutes}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}