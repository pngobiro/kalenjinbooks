'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Search, FileText, TrendingUp, Book } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
    isPublished: boolean;
    publishedAt?: string;
    viewCount: number;
    createdAt: string;
}

function formatBlogDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function BlogsPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authorId, setAuthorId] = useState<string | null>(null);

    // Fetch author profile to get authorId
    useEffect(() => {
        const fetchAuthorProfile = async () => {
            try {
                const token = localStorage.getItem('kaleereads_token');
                if (!token) return;

                const response = await fetch(
                    'https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/me',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const result: any = await response.json();
                    setAuthorId(result.data.id);
                }
            } catch (err) {
                console.error('Error fetching author profile:', err);
            }
        };

        fetchAuthorProfile();
    }, []);

    // Fetch blog posts
    useEffect(() => {
        if (!authorId) return;

        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/blog/posts?authorId=${authorId}&limit=100`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }

                const data: any = await response.json();
                setPosts(data.posts || []);
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError(err instanceof Error ? err.message : 'Failed to load blog posts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [authorId]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const response = await fetch(`/api/blog/posts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog post');
            }

            setPosts(posts.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting blog post:', err);
            alert('Failed to delete blog post. Please try again.');
        }
    };

    const filteredPosts = posts
        .filter((post) => {
            if (filter === 'published') return post.isPublished;
            if (filter === 'draft') return !post.isPublished;
            return true;
        })
        .filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const stats = {
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.isPublished).length,
        draftPosts: posts.filter((p) => !p.isPublished).length,
        totalViews: posts.reduce((sum, p) => sum + p.viewCount, 0),
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/dashboard/author" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                                <Book className="text-primary" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">My Blogs</h1>
                        <p className="text-neutral-brown-600 mt-1">
                            Create and manage your blog posts
                        </p>
                    </div>
                    <Link
                        href="/dashboard/author/blogs/new"
                        className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <Plus size={20} />
                        New Blog Post
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileText className="text-primary" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-600">Total Posts</p>
                                <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalPosts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
                                <Eye className="text-accent-green" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-600">Published</p>
                                <p className="text-2xl font-bold text-neutral-brown-900">{stats.publishedPosts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent-gold/10 rounded-lg flex items-center justify-center">
                                <Edit className="text-accent-gold" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-600">Drafts</p>
                                <p className="text-2xl font-bold text-neutral-brown-900">{stats.draftPosts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-600">Total Views</p>
                                <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalViews.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
                                }`}
                            >
                                All ({stats.totalPosts})
                            </button>
                            <button
                                onClick={() => setFilter('published')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'published'
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
                                }`}
                            >
                                Published ({stats.publishedPosts})
                            </button>
                            <button
                                onClick={() => setFilter('draft')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'draft'
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
                                }`}
                            >
                                Drafts ({stats.draftPosts})
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
                            <input
                                type="search"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-brown-900">
                                    Post
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-brown-900">
                                    Status
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-brown-900">
                                    Views
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-brown-900">
                                    Published
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-brown-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-neutral-brown-600">
                                        No blog posts found. Create your first one!
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="border-b border-neutral-brown-50 hover:bg-neutral-cream/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {post.coverImage ? (
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-16 h-12 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-12 bg-neutral-cream rounded-lg flex items-center justify-center">
                                                        <FileText size={20} className="text-neutral-brown-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-neutral-brown-900">{post.title}</p>
                                                    <p className="text-sm text-neutral-brown-500">/{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {post.isPublished ? (
                                                <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-sm font-medium rounded-full">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-neutral-brown-100 text-neutral-brown-600 text-sm font-medium rounded-full">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-brown-900 font-medium">
                                            {post.viewCount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-brown-600 text-sm">
                                            {post.publishedAt ? formatBlogDate(post.publishedAt) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/blogs/${post.slug}`}
                                                    className="p-2 text-neutral-brown-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/author/blogs/${post.id}/edit`}
                                                    className="p-2 text-neutral-brown-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-neutral-brown-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
