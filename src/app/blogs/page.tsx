'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import { Search, ArrowLeft } from 'lucide-react';
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

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 to-accent-green/10 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-neutral-brown-900 mb-4">
                            Blog
                        </h1>
                        <p className="text-xl text-neutral-brown-700 max-w-2xl mx-auto">
                            Discover stories, insights, and perspectives from our community of authors
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-700" size={20} />
                            <input
                                type="search"
                                placeholder="Search blog posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-md focus:shadow-lg focus:outline-none text-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters and Sort Options */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <p className="text-neutral-brown-700">
                            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                        </p>

                        {/* Author Filter */}
                        <select
                            onChange={(e) => {
                                const authorId = e.target.value;
                                if (authorId) {
                                    setLoading(true);
                                    fetch(`/api/blog/posts?published=true&authorId=${authorId}`)
                                        .then(res => res.json())
                                        .then(data => setPosts(data.posts || []))
                                        .finally(() => setLoading(false));
                                } else {
                                    fetchPosts();
                                }
                            }}
                            className="px-4 py-2 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none bg-white"
                        >
                            <option value="">All Authors</option>
                            {Array.from(new Set(posts.map(p => p.author.user.name))).map(authorName => (
                                <option key={authorName} value={posts.find(p => p.author.user.name === authorName)?.author.id}>
                                    {authorName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('latest')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${sortBy === 'latest'
                                ? 'bg-primary text-white'
                                : 'bg-white text-neutral-brown-700 hover:bg-neutral-brown-500/10'
                                }`}
                        >
                            Latest
                        </button>
                        <button
                            onClick={() => setSortBy('views')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${sortBy === 'views'
                                ? 'bg-primary text-white'
                                : 'bg-white text-neutral-brown-700 hover:bg-neutral-brown-500/10'
                                }`}
                        >
                            Most Viewed
                        </button>
                    </div>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-brown-700">Loading...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-brown-700">No blog posts found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
