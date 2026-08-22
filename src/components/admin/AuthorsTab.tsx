'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit, Ban, Power, Users, Shield, X, Save } from 'lucide-react';

interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalEarnings: number | null;
  isActive?: boolean;
  location?: string | null;
  nationality?: string | null;
  genres?: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    isAdmin?: boolean;
  };
}

interface AuthorsTabProps {
  allAuthors: Author[];
  onToggleAuthorStatus: (authorId: string, currentStatus: boolean) => void;
  onMakeAdmin: (authorId: string, userEmail: string) => void;
  onUpdated?: () => void;
}

const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

export default function AuthorsTab({ allAuthors, onToggleAuthorStatus, onMakeAdmin, onUpdated }: AuthorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Author | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-brown-900">All Authors</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
            <input
              type="search"
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {allAuthors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Earnings</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-brown-100">
                {allAuthors
                  .filter((author) =>
                    !searchQuery ||
                    author.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    author.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((author) => (
                  <tr key={author.id} className="hover:bg-neutral-cream/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                          {author.profileImage ? (
                            <img src={author.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-sm">
                              {author.user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-brown-900">
                            {author.user.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-neutral-brown-600">{author.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          author.status === 'APPROVED'
                            ? 'bg-accent-green/20 text-accent-green'
                            : author.status === 'REJECTED'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {author.status.toLowerCase()}
                        </span>
                        {author.isActive !== undefined && (
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            author.isActive
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {author.isActive ? 'Active' : 'Disabled'}
                          </span>
                        )}
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          author.user.role === 'ADMIN' || author.user.isAdmin
                            ? 'bg-purple-100 text-purple-600'
                            : author.user.role === 'AUTHOR'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {author.user.role === 'ADMIN' || author.user.isAdmin ? 'Admin' : author.user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-accent-green">KES {(author.totalEarnings || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View public profile */}
                        <Link
                          href={`/authors/${author.id}`}
                          target="_blank"
                          className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded"
                          title="View public profile"
                        >
                          <Eye size={16} />
                        </Link>
                        {/* Edit author */}
                        <button
                          onClick={() => setEditing(author)}
                          className="p-2 text-primary hover:bg-primary/10 rounded"
                          title="Edit author"
                        >
                          <Edit size={16} />
                        </button>
                        {author.status === 'APPROVED' && (
                          <button
                            onClick={() => onToggleAuthorStatus(author.id, author.isActive !== false)}
                            className={`p-2 rounded transition-colors ${
                              author.isActive !== false
                                ? 'text-red-600 hover:bg-red-100'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={author.isActive !== false ? 'Disable Author' : 'Enable Author'}
                          >
                            {author.isActive !== false ? <Ban size={16} /> : <Power size={16} />}
                          </button>
                        )}
                        {author.status === 'APPROVED' && author.isActive !== false && author.user.role !== 'ADMIN' && !author.user.isAdmin && (
                          <button
                            onClick={() => onMakeAdmin(author.id, author.user.email)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                            title="Make Admin"
                          >
                            <Shield size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-brown-500">
            <Users size={48} className="mx-auto mb-4 text-neutral-brown-300" />
            <p className="text-lg font-medium mb-2">No authors found</p>
            <p className="text-sm">Authors will appear here once they register.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditAuthorModal
          author={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            setSaving(true);
            try {
              const token = localStorage.getItem('kaleereads_token');
              const res = await fetch(`${WORKER_URL}/api/admin/authors/update`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authorId: editing.id, ...data }),
              });
              if (!res.ok) throw new Error('Failed to update author');
              onUpdated?.();
              setEditing(null);
            } catch (e) {
              alert(e instanceof Error ? e.message : 'Failed to update author');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </div>
  );
}

function EditAuthorModal({
  author,
  saving,
  onClose,
  onSave,
}: {
  author: Author;
  saving: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void | Promise<void>;
}) {
  const [name, setName] = useState(author.user.name || '');
  const [bio, setBio] = useState(author.bio || '');
  const [location, setLocation] = useState(author.location || '');
  const [nationality, setNationality] = useState(author.nationality || '');
  const [genres, setGenres] = useState(
    Array.isArray(author.genres) ? author.genres.join(', ') : (author.genres || '')
  );
  const [status, setStatus] = useState<string>(author.status);

  function parseGenres(input: string): string[] {
    return input.split(',').map((g) => g.trim()).filter(Boolean);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-neutral-brown-900">Edit Author</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-brown-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Email</label>
            <input
              type="email"
              value={author.user.email}
              disabled
              className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm bg-neutral-brown-50 text-neutral-brown-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Eldoret, Kenya"
                className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g. Kenyan"
                className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Genres (comma separated)</label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Fiction, History, Folklore"
              className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-1.5">Account Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-neutral-brown-200 rounded-lg font-semibold text-sm text-neutral-brown-700 hover:bg-neutral-brown-50"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={() =>
              onSave({
                name,
                bio,
                location,
                nationality,
                genres: JSON.stringify(parseGenres(genres)),
                status,
              })
            }
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
