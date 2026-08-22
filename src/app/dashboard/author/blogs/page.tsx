'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, Search, PlayCircle, Tag, ChevronLeft, ChevronRight, CheckSquare, Square, Trash } from 'lucide-react';
import BlogStats from '@/components/blog/BlogStats';
import { fetchBlogPosts, deleteBlogPost, type BlogPost } from '@/lib/api/blogs';
import { getMyAuthorProfile } from '@/lib/api/authors';
import { BLOG_CATEGORIES } from '@/lib/constants/blog';

function formatBlogDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

type StatusFilter = 'all' | 'published' | 'draft';
const statusFilters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
];

const categoryFilters = BLOG_CATEGORIES.map(c => ({
    id: c.id === 'all' ? 'all' : c.id,
    label: c.id === 'all' ? 'All Categories' : c.label,
}));

export default function AuthorBlogsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authorId, setAuthorId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
    const postsPerPage = 10;

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const token = localStorage.getItem('kaleereads_token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const result = await getMyAuthorProfile() as any;
                setAuthorId(result.data.id);
            } catch (err: any) {
                console.error('Error fetching author profile:', err);
                const msg = err?.message || '';
                // Only redirect on auth errors; otherwise the user is logged in but has no author profile (e.g. admin account)
                if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
                    router.push('/login');
                } else if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
                    // Logged in but no author record (e.g. admin visiting author area)
                    setError('No author profile found for this account. Switch to the Admin dashboard or apply as an author.');
                    setIsLoading(false);
                } else {
                    setError('Unable to load your author profile. Please try again.');
                    setIsLoading(false);
                }
            }
        };
        fetchAuthor();
    }, [router]);

    const loadPosts = useCallback(async () => {
        if (!authorId) return;
        try {
            setIsLoading(true);
            setError(null);
            const result = await fetchBlogPosts({ authorId, limit: 100 });
            const all = (result as any).data?.posts || [];
            setPosts(all);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load blog posts.');
            setIsLoading(false);
        }
    }, [authorId]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const filtered = posts.filter((p) => {
        const matchesStatus = statusFilter === 'all'
            || (statusFilter === 'published' && p.isPublished)
            || (statusFilter === 'draft' && !p.isPublished);
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const paginatedPosts = filtered.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const stats = {
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.isPublished).length,
        draftPosts: posts.filter((p) => !p.isPublished).length,
        totalViews: posts.reduce((sum, p) => sum + p.viewCount, 0),
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this blog post? This cannot be undone.')) return;
        try {
            setDeletingId(id);
            await deleteBlogPost(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete blog post');
        } finally {
            setDeletingId(null);
        }
    };

    const handleFilterChange = (setter: (v: any) => void) => (value: any) => {
        setter(value);
        setCurrentPage(1);
    };

    const toggleSelectAll = () => {
        if (selectedPosts.size === paginatedPosts.length) {
            setSelectedPosts(new Set());
        } else {
            setSelectedPosts(new Set(paginatedPosts.map(p => p.id)));
        }
    };

    const toggleSelectPost = (id: string) => {
        const newSelected = new Set(selectedPosts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedPosts(newSelected);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedPosts.size} posts? This cannot be undone.`)) return;
        try {
            for (const id of selectedPosts) {
                await deleteBlogPost(id);
            }
            setPosts(prev => prev.filter(p => !selectedPosts.has(p.id)));
            setSelectedPosts(new Set());
        } catch (err: any) {
            alert(err.message || 'Failed to delete posts');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-cream p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-brown-900">
                        My Blog Posts
                    </h1>
                    <p className="text-neutral-brown-600 mt-1">
                        Write and publish articles for your readers
                    </p>
                </div>
                <Link
                    href="/dashboard/author/blogs/new"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-full transition-all"
                >
                    <Plus size={18} /> New Post
                </Link>
            </div>

            {/* Stats */}
            <BlogStats {...stats} />

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                {/* Row 1: Status filters + Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-neutral-brown-100">
                    <div className="flex items-center gap-2">
                        {statusFilters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => handleFilterChange(setStatusFilter)(f.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f.id
                                    ? 'bg-primary text-white'
                                    : 'bg-neutral-cream text-neutral-brown-700 hover:bg-primary/10'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search size={16} className="text-neutral-brown-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search posts..."
                            className="w-full pl-9 pr-4 py-2 rounded-full bg-neutral-cream focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                    </div>
                </div>

                {/* Row 2: Category filters */}
                <div className="flex items-center gap-2 p-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    <Tag size={14} className="text-neutral-brown-500 shrink-0" />
                    {categoryFilters.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleFilterChange(setCategoryFilter)(cat.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${categoryFilter === cat.id
                                ? 'bg-accent-green text-white'
                                : 'bg-neutral-cream text-neutral-brown-600 hover:bg-accent-green/10'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => loadPosts()}
                        className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-full text-sm transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading */}
            {isLoading && !error && (
                <div className="flex items-center justify-center py-20">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-neutral-brown-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            )}

            {/* Posts Table */}
            {!isLoading && !error && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-4">
                                <PlayCircle size={32} className="text-neutral-brown-400" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-neutral-brown-900 mb-2">
                                {posts.length === 0 ? 'Start blogging' : 'No posts match your filters'}
                            </h3>
                            <p className="text-neutral-brown-600 mb-6">
                                {posts.length === 0
                                    ? 'Write your first blog post to connect with your readers.'
                                    : 'Try adjusting your filters or search term.'}
                            </p>
                            {posts.length === 0 && (
                                <Link
                                    href="/dashboard/author/blogs/new"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-full transition-all"
                                >
                                    <Plus size={18} /> Create First Post
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                        <div className="overflow-x-auto">
                            {/* Bulk Actions */}
                            {selectedPosts.size > 0 && (
                                <div className="flex items-center gap-3 px-5 py-3 bg-primary/5 border-b border-primary/20">
                                    <span className="text-sm text-primary font-medium">{selectedPosts.size} selected</span>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash size={14} />
                                        Delete Selected
                                    </button>
                                    <button
                                        onClick={() => setSelectedPosts(new Set())}
                                        className="text-sm text-neutral-brown-600 hover:text-neutral-brown-900"
                                    >
                                        Clear selection
                                    </button>
                                </div>
                            )}
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-neutral-brown-100 text-sm text-neutral-brown-600">
                                        <th className="px-5 py-4 font-medium w-10">
                                            <button onClick={toggleSelectAll} className="text-neutral-brown-400 hover:text-primary">
                                                {selectedPosts.size === paginatedPosts.length && paginatedPosts.length > 0 ? (
                                                    <CheckSquare size={18} />
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-5 py-4 font-medium">Title</th>
                                        <th className="px-5 py-4 font-medium">Category</th>
                                        <th className="px-5 py-4 font-medium">Status</th>
                                        <th className="px-5 py-4 font-medium">Views</th>
                                        <th className="px-5 py-4 font-medium">Published</th>
                                        <th className="px-5 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedPosts.map((post) => (
                                        <tr key={post.id} className={`border-b border-neutral-brown-50 hover:bg-neutral-cream/50 transition-colors ${selectedPosts.has(post.id) ? 'bg-primary/5' : ''}`}>
                                            <td className="px-5 py-4">
                                                <button onClick={() => toggleSelectPost(post.id)} className="text-neutral-brown-400 hover:text-primary">
                                                    {selectedPosts.has(post.id) ? (
                                                        <CheckSquare size={18} />
                                                    ) : (
                                                        <Square size={18} />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Media thumbnail if available */}
                                                    {(post.coverImage || (post.coverType === 'video' && post.coverVideoUrl)) ? (
                                                        <div className="w-14 h-10 shrink-0 rounded-lg overflow-hidden bg-neutral-brown-100 relative">
                                                            {post.coverImage ? (
                                                                <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img
                                                                    src={(() => {
                                                                        const m = post.coverVideoUrl?.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
                                                                        return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : '';
                                                                    })()}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                            {post.coverType === 'video' && (
                                                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                                                    <PlayCircle size={16} className="text-white drop-shadow" fill="white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/blogs/${post.slug || post.id}`}
                                                            className="font-semibold text-neutral-brown-900 hover:text-primary transition-colors line-clamp-1"
                                                        >
                                                            {post.title}
                                                        </Link>
                                                        <p className="text-xs text-neutral-brown-500 mt-1 line-clamp-1">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                {post.category ? (
                                                    <span className="inline-block px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-medium rounded-full">
                                                        {post.category}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-neutral-brown-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${post.isPublished
                                                    ? 'bg-accent-green/10 text-accent-green'
                                                    : 'bg-neutral-brown-500/10 text-neutral-brown-600'
                                                    }`}>
                                                    {post.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-neutral-brown-700">
                                                {post.viewCount}
                                            </td>
                                            <td className="px-5 py-4 text-neutral-brown-700 text-sm">
                                                {post.publishedAt
                                                    ? formatBlogDate(String(post.publishedAt))
                                                    : '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/blogs/${post.slug || post.id}`}
                                                        className="p-2 rounded-lg hover:bg-neutral-cream text-neutral-brown-700 transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard/author/blogs/${post.id}/edit`}
                                                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        disabled={deletingId === post.id}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-brown-100">
                                <p className="text-sm text-neutral-brown-600">
                                    Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, filtered.length)} of {filtered.length} posts
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg hover:bg-neutral-cream text-neutral-brown-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? 'bg-primary text-white'
                                                    : 'text-neutral-brown-700 hover:bg-neutral-cream'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg hover:bg-neutral-cream text-neutral-brown-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                </div>
            )}
        </div>
    );
}
