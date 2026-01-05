'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PendingBook {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  language: string;
  price: number;
  rentalPrice: number | null;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface PendingBooksTabProps {
  pendingBooks: PendingBook[];
  onApproveBook: (bookId: string) => void;
  onRejectBook: (bookId: string, reason: string) => void;
}

export default function PendingBooksTab({
  pendingBooks,
  onApproveBook,
  onRejectBook,
}: PendingBooksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-brown-900">Books Pending Approval</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
            <input
              type="search"
              placeholder="Search pending books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {pendingBooks.length > 0 ? (
          <div className="divide-y divide-neutral-brown-100">
            {pendingBooks
              .filter((book) => 
                !searchQuery || 
                book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((book) => (
              <div key={book.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-neutral-cream rounded overflow-hidden">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-brown-900">{book.title}</h3>
                      <p className="text-neutral-brown-600">by {book.author.name || 'Unknown Author'}</p>
                      <p className="text-sm text-neutral-brown-500">
                        Submitted {new Date(book.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                          {book.category || 'Uncategorized'}
                        </span>
                        <span className="text-sm text-neutral-brown-600">
                          KES {book.price}
                        </span>
                        <span className="text-sm text-neutral-brown-600">
                          {book.language}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveBook(book.id)}
                      className="flex items-center gap-2 bg-accent-green text-white px-4 py-2 rounded-lg hover:bg-accent-green/90 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejecting this book:');
                        if (reason) onRejectBook(book.id, reason);
                      }}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Book Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-brown-900">Book Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-neutral-brown-600">Author Email:</span> {book.author.email}</p>
                      <p><span className="text-neutral-brown-600">Language:</span> {book.language}</p>
                      <p><span className="text-neutral-brown-600">Price:</span> KES {book.price}</p>
                      {book.rentalPrice && (
                        <p><span className="text-neutral-brown-600">Rental Price:</span> KES {book.rentalPrice}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-brown-900">Tags & Category</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-neutral-brown-600">Category:</span> {book.category || 'Not specified'}</p>
                      {book.tags && book.tags.length > 0 && (
                        <div>
                          <span className="text-neutral-brown-600">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {book.tags.map((tag: string) => (
                              <span key={tag} className="bg-accent-green/10 text-accent-green px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div className="mt-4 p-4 bg-neutral-cream rounded-lg">
                    <h4 className="font-semibold text-neutral-brown-900 mb-2">Description</h4>
                    <p className="text-sm text-neutral-brown-700">{book.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-brown-500">
            <Clock size={48} className="mx-auto mb-4 text-neutral-brown-300" />
            <p className="text-lg font-medium mb-2">No books pending approval</p>
            <p className="text-sm">Books awaiting approval will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}