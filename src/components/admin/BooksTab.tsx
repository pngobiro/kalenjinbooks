'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Edit, Ban, Power, Star, Book } from 'lucide-react';

interface BookData {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  fileKey: string;
  fileType: string;
  price: number;
  rentalPrice: number | null;
  category: string | null;
  language: string;
  isPublished: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  rating: number;
  reviewCount: number;
  publishedAt: string | null;
  isActive?: boolean;
  author: {
    id: string;
    user: {
      name: string | null;
    };
  };
}

interface BooksTabProps {
  allBooks: BookData[];
  onToggleBookStatus: (bookId: string, currentStatus: boolean) => void;
  onToggleFeatured: (bookId: string, currentFeaturedStatus: boolean) => void;
}

export default function BooksTab({ 
  allBooks, 
  onToggleBookStatus, 
  onToggleFeatured 
}: BooksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-brown-900">All Books</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
            <input
              type="search"
              placeholder="Search books..."
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
        {allBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Featured</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-brown-100">
                {allBooks
                  .filter((book) => 
                    !searchQuery || 
                    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((book) => (
                  <tr key={book.id} className="hover:bg-neutral-cream/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-neutral-cream rounded overflow-hidden">
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-brown-900 flex items-center gap-2">
                            {book.title}
                            {book.isFeatured && (
                              <Star size={14} className="text-accent-gold fill-current" />
                            )}
                          </p>
                          <p className="text-sm text-neutral-brown-600">
                            {book.publishedAt ? new Date(book.publishedAt).toLocaleDateString() : 'Not published'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-brown-900">{book.author.user.name || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {book.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-brown-900">KES {book.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                          book.isPublished 
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {book.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {book.isActive !== undefined && (
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            book.isActive 
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {book.isActive ? 'Active' : 'Disabled'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {book.isFeatured ? (
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-accent-gold fill-current" />
                            <span className="text-sm font-medium text-accent-gold">
                              Featured
                            </span>
                            {book.featuredOrder && (
                              <span className="bg-accent-gold/10 text-accent-gold px-2 py-1 rounded text-xs font-medium">
                                #{book.featuredOrder}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-brown-500">Not Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/book/viewer/${book.id}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title={`View ${book.fileType.toUpperCase()} securely`}
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onToggleFeatured(book.id, book.isFeatured)}
                          className={`p-2 rounded transition-colors ${
                            book.isFeatured 
                              ? 'text-accent-gold bg-accent-gold/10' 
                              : 'text-neutral-brown-400 hover:bg-neutral-brown-100'
                          }`}
                          title={book.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                        >
                          <Star size={16} fill={book.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => onToggleBookStatus(book.id, book.isActive !== false)}
                          className={`p-2 rounded transition-colors ${
                            book.isActive !== false
                              ? 'text-red-600 hover:bg-red-100'
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={book.isActive !== false ? 'Disable Book' : 'Enable Book'}
                        >
                          {book.isActive !== false ? <Ban size={16} /> : <Power size={16} />}
                        </button>
                        <button className="p-2 text-primary hover:bg-primary/10 rounded">
                          <Edit size={16} />
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
            <Book size={48} className="mx-auto mb-4 text-neutral-brown-300" />
            <p className="text-lg font-medium mb-2">No books found</p>
            <p className="text-sm">Books will appear here once authors upload them.</p>
          </div>
        )}
      </div>
    </div>
  );
}