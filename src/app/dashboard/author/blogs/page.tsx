'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import BlogStats from '@/components/blog/BlogStats';
import { formatBlogDate } from '@/lib/blog-utils';

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

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Mock author ID - in production, get from session
    const authorId = 'mock-author-id';

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                authorId,
                ...(filter !== 'all' && { published: filter === 'published' ? 'true' : 'false' }),
            });

            const response = await fetch(`/api/blog/posts?${params}`);
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.isPublished).length,
        draftPosts: posts.filter((p) => !p.isPublished).length,
        totalViews: posts.reduce((sum, p) => sum + p.viewCount, 0),
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-brown-900">My Blogs</h1>
                    <p className="text-neutral-brown-700 mt-1">
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
            <BlogStats {...stats} />

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-500/10'
                                }`}
                        >
                            All ({stats.totalPosts})
                        </button>
                        <button
                            onClick={() => setFilter('published')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'published'
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-500/10'
                                }`}
                        >
                            Published ({stats.publishedPosts})
                        </button>
                        <button
                            onClick={() => setFilter('draft')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'draft'
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-500/10'
                                }`}
                        >
                            Drafts ({stats.draftPosts})
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-700" size={18} />
                        <input
                            type="search"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-cream border-b border-neutral-brown-500/10">
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
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-neutral-brown-700">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredPosts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-neutral-brown-700">
                                    No blog posts found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            filteredPosts.map((post) => (
                                <tr key={post.id} className="border-b border-neutral-brown-500/10 hover:bg-neutral-cream/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-16 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-12 bg-neutral-cream rounded flex items-center justify-center">
                                                    <span className="text-2xl">📝</span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-neutral-brown-900">{post.title}</p>
                                                <p className="text-sm text-neutral-brown-700">/{post.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.isPublished ? (
                                            <span className="px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-neutral-brown-500/20 text-neutral-brown-700 text-sm font-medium rounded-full">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-brown-900">
                                        {post.viewCount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-brown-700 text-sm">
                                        {post.publishedAt ? formatBlogDate(post.publishedAt) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blogs/${post.id}`}
                                                className="p-2 text-neutral-brown-700 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/dashboard/author/blogs/${post.id}/edit`}
                                                className="p-2 text-neutral-brown-700 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-neutral-brown-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
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
    );
}
