'use client';

import { Users, Book, Clock, Star, CheckCircle, XCircle } from 'lucide-react';

type TabType = 'overview' | 'authors' | 'applications' | 'rejected' | 'books' | 'pending-books';

interface Stats {
  totalAuthors: number;
  pendingApplications: number;
  totalBooks: number;
  pendingBooks: number;
  featuredBooks: number;
  totalRevenue: number;
}

interface Author {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface PendingBook {
  id: string;
  title: string;
  coverImage: string | null;
  author: {
    name: string | null;
  };
}

interface BookData {
  id: string;
  title: string;
  isFeatured: boolean;
  featuredOrder: number | null;
  author: {
    user: {
      name: string | null;
    };
  };
}

interface AdminOverviewProps {
  stats: Stats;
  pendingAuthors: Author[];
  pendingBooks: PendingBook[];
  allBooks: BookData[];
  onApproveAuthor: (authorId: string) => void;
  onRejectAuthor: (authorId: string) => void;
  onApproveBook: (bookId: string) => void;
  onRejectBook: (bookId: string, reason: string) => void;
  onToggleFeatured: (bookId: string, isFeatured: boolean) => void;
  onSetActiveTab: (tab: TabType) => void;
}

export default function AdminOverview({
  stats,
  pendingAuthors,
  pendingBooks,
  allBooks,
  onApproveAuthor,
  onRejectAuthor,
  onApproveBook,
  onRejectBook,
  onToggleFeatured,
  onSetActiveTab,
}: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-sm text-neutral-brown-600 mb-1">Total Authors</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalAuthors}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-gold/10 rounded-lg flex items-center justify-center">
              <Clock className="text-accent-gold" size={24} />
            </div>
            {stats.pendingApplications > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.pendingApplications}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-brown-600 mb-1">Pending Applications</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.pendingApplications}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
              <Book className="text-accent-green" size={24} />
            </div>
          </div>
          <p className="text-sm text-neutral-brown-600 mb-1">Total Books</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalBooks}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
            {stats.pendingBooks > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.pendingBooks}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-brown-600 mb-1">Pending Books</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.pendingBooks}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Star className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-sm text-neutral-brown-600 mb-1">Featured Books</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.featuredBooks}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {pendingAuthors.length > 0 ? (
              pendingAuthors.slice(0, 3).map((author) => (
                <div key={author.id} className="flex items-center justify-between p-3 bg-neutral-cream rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-brown-900">{author.user.name || 'Unknown'}</p>
                    <p className="text-sm text-neutral-brown-600">{author.user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveAuthor(author.id)}
                      className="p-2 text-accent-green hover:bg-accent-green/10 rounded transition-colors"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => onRejectAuthor(author.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-brown-500 text-center py-4">No pending applications</p>
            )}
          </div>
          <button
            onClick={() => onSetActiveTab('applications' as any)}
            className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
          >
            View All Applications →
          </button>
        </div>

        {/* Books Pending Approval */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">Books Pending Approval</h2>
          <div className="space-y-3">
            {pendingBooks.length > 0 ? (
              pendingBooks.slice(0, 3).map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-neutral-cream rounded overflow-hidden">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-brown-900">{book.title}</p>
                      <p className="text-sm text-neutral-brown-600">by {book.author.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveBook(book.id)}
                      className="p-2 text-accent-green hover:bg-accent-green/10 rounded transition-colors"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejecting this book:');
                        if (reason) onRejectBook(book.id, reason);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-brown-500 text-center py-4">No books pending approval</p>
            )}
          </div>
          <button
            onClick={() => onSetActiveTab('pending-books' as any)}
            className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
          >
            View All Pending Books →
          </button>
        </div>

        {/* Featured Books */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">Featured Books</h2>
          <div className="space-y-3">
            {allBooks.filter(book => book.isFeatured).length > 0 ? (
              allBooks
                .filter(book => book.isFeatured)
                .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))
                .slice(0, 3)
                .map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-accent-gold/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star size={16} className="text-accent-gold fill-current" />
                    <div>
                      <p className="font-medium text-neutral-brown-900">{book.title}</p>
                      <p className="text-sm text-neutral-brown-600">by {book.author.user.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {book.featuredOrder && (
                      <span className="bg-accent-gold/20 text-accent-gold px-2 py-1 rounded text-xs font-medium">
                        #{book.featuredOrder}
                      </span>
                    )}
                    <button
                      onClick={() => onToggleFeatured(book.id, book.isFeatured)}
                      className="p-1 text-accent-gold hover:bg-accent-gold/10 rounded transition-colors"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-brown-500 text-center py-4">No featured books</p>
            )}
          </div>
          <button
            onClick={() => onSetActiveTab('books' as any)}
            className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
          >
            Manage Featured Books →
          </button>
        </div>

        {/* Recent Books */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">Recent Books</h2>
          <div className="space-y-3">
            {allBooks.length > 0 ? (
              allBooks.slice(0, 3).map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-neutral-cream rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-brown-900">{book.title}</p>
                    <p className="text-sm text-neutral-brown-600">by {book.author.user.name || 'Unknown'}</p>
                  </div>
                  <button
                    onClick={() => onToggleFeatured(book.id, book.isFeatured)}
                    className={`p-2 rounded transition-colors ${
                      book.isFeatured 
                        ? 'text-accent-gold bg-accent-gold/10' 
                        : 'text-neutral-brown-400 hover:bg-neutral-brown-100'
                    }`}
                  >
                    <Star size={16} fill={book.isFeatured ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-neutral-brown-500 text-center py-4">No books available</p>
            )}
          </div>
          <button
            onClick={() => onSetActiveTab('books' as any)}
            className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
          >
            Manage All Books →
          </button>
        </div>
      </div>
    </div>
  );
}