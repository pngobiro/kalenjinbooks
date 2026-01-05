'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Edit, Ban, Power, MoreVertical, Users } from 'lucide-react';

interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalEarnings: number | null;
  isActive?: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

interface AuthorsTabProps {
  allAuthors: Author[];
  onToggleAuthorStatus: (authorId: string, currentStatus: boolean) => void;
}

export default function AuthorsTab({ allAuthors, onToggleAuthorStatus }: AuthorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50">
            <Filter size={18} />
            Filter
          </button>
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
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {author.user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </span>
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
                      <div className="flex items-center gap-2">
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
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-accent-green">KES {(author.totalEarnings || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded">
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
                        <button className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded">
                          <MoreVertical size={16} />
                        </button>
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
    </div>
  );
}