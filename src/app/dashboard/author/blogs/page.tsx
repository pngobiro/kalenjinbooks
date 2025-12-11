'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Search, FileText, TrendingUp, Book } from 'lucide-react';

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

// Mock data - in production this comes from API
const mockPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Rich Heritage of Kalenjin Oral Traditions',
        slug: 'kalenjin-oral-traditions',
        coverImage: '/books/folklore-tales.png',
        isPublished: true,
        publishedAt: '2024-12-05T10:00:00',
        viewCount: 1245,
        createdAt: '2024-12-01T08:00:00',
    },
    {
        id: '2',
        title: 'Writing Tips for Aspiring African Authors',
        slug: 'writing-tips-african-authors',
        coverImage: '/books/traditional-wisdom.png',
        isPublished: true,
        publishedAt: '2024-11-28T14:30:00',
        viewCount: 892,
        createdAt: '2024-11-25T09:00:00',
    },
    {
        id: '3',
        title: 'Preserving Indigenous Languages Through Literature',
        slug: 'preserving-indigenous-languages',
        isPublished: false,
        viewCount: 0,
        createdAt: '2024-12-10T11:00:00',
    },
    {
        id: '4',
        title: 'My Journey as a Kalenjin Author',
        slug: 'my-journey-kalenjin-author',
        coverImage: '/books/immortalknowledge.jpg',
        isPublished: true,
        publishedAt: '2024-11-15T09:00:00',
        viewCount: 2156,
        createdAt: '2024-11-10T10:00:00',
    },
];

function formatBlogDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        setPosts(posts.filter(p => p.id !== id));
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
