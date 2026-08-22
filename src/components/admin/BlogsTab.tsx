'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText, Eye, Clock, ExternalLink, Search,
  CheckCircle2, CircleDashed, Trash2, Edit, EyeOff,
} from 'lucide-react';

interface BlogPostRow {
  id: string;
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  coverType?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  viewCount: number;
  createdAt: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  author?: {
    id?: string;
    name?: string | null;
    user?: { name?: string | null };
  } | null;
}

const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

export default function BlogsTab() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'drafts'>('all');

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const token = localStorage.getItem('kaleereads_token');
        const res = await fetch(`${WORKER_URL}/api/blog/posts?limit=100&published=false`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to load blog posts');
        const json: any = await res.json();
        setPosts(json?.data?.posts || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const filtered = posts.filter((p) => {
    if (statusFilter === 'published' && !p.isPublished) return false;
    if (statusFilter === 'drafts' && p.isPublished) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.author?.user?.name?.toLowerCase().includes(q) ||
      p.author?.name?.toLowerCase().includes(q)
    );
  });

  async function handleDelete(postId: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('kaleereads_token');
      const res = await fetch(`${WORKER_URL}/api/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert('Failed to delete post');
    }
  }

  async function handleTogglePublish(post: BlogPostRow) {
    const action = post.isPublished ? 'unpublish' : 'publish';
    if (!confirm(`${action === 'unpublish' ? 'Unpublish' : 'Publish'} "${post.title}"?`)) return;
    try {
      const token = localStorage.getItem('kaleereads_token');
      const res = await fetch(`${WORKER_URL}/api/blog/posts/${post.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      if (!res.ok) throw new Error('Update failed');
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, isPublished: !p.isPublished } : p)));
    } catch {
      alert(`Failed to ${action} post`);
    }
  }

  function formatDate(d?: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading">Author Blog Posts</h2>
          <p className="text-sm text-neutral-brown-600 mt-0.5">{filtered.length} of {posts.length} posts</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="flex bg-white rounded-lg border border-neutral-brown-200 overflow-hidden">
            {(['all', 'published', 'drafts'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  statusFilter === f ? 'bg-primary text-white' : 'text-neutral-brown-700 hover:bg-neutral-brown-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" />
            <input
              type="text"
              placeholder="Search title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-56 rounded-lg border border-neutral-brown-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-neutral-brown-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="mx-auto text-neutral-brown-300 mb-3" />
            <p className="text-neutral-brown-600 font-medium">No blog posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-brown-200 bg-neutral-brown-50">
                  <th className="text-left px-5 py-3 font-semibold text-neutral-brown-700">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-neutral-brown-700">Author</th>
                  <th className="text-left px-5 py-3 font-semibold text-neutral-brown-700">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-neutral-brown-700">Views</th>
                  <th className="text-left px-5 py-3 font-semibold text-neutral-brown-700">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-neutral-brown-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-brown-100">
                {filtered.map((post) => {
                  const authorName = post.author?.user?.name || post.author?.name || 'Unknown';
                  return (
                    <tr key={post.id} className="hover:bg-neutral-brown-50 transition-colors">
                      <td className="px-5 py-3.5 max-w-xs">
                        <p className="font-semibold text-neutral-brown-900 line-clamp-1">{post.title}</p>
                        {post.category && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-orange-50 text-orange-600">
                            {post.category}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-brown-700 whitespace-nowrap">{authorName}</td>
                      <td className="px-5 py-3.5">
                        {post.isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <CheckCircle2 size={13} /> Published
                          </span>
                        ) : post.scheduledAt ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            <Clock size={13} /> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                            <CircleDashed size={13} /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-neutral-brown-600">
                          <Eye size={14} /> {post.viewCount}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-brown-600 whitespace-nowrap">
                        {formatDate(post.publishedAt || post.scheduledAt || post.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className={`p-1.5 rounded-lg transition-colors ${post.isPublished ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
                            title={post.isPublished ? 'Unpublish (hide from public)' : 'Publish'}
                          >
                            {post.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <Link
                            href={`/dashboard/author/blogs/${post.id}/edit`}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            title="Edit post"
                          >
                            <Edit size={15} />
                          </Link>
                          {post.isPublished && (
                            <Link
                              href={`/blogs/${post.slug || post.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              View <ExternalLink size={12} />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete post"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
