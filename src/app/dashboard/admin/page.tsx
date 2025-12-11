'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Book, TrendingUp, DollarSign, UserCheck, UserX, 
  Star, Eye, Edit, Trash2, CheckCircle, XCircle, Clock,
  Search, Filter, MoreVertical, Shield
} from 'lucide-react';

// Mock data - would come from API
const stats = {
  totalAuthors: 24,
  pendingApplications: 5,
  totalBooks: 156,
  featuredBooks: 8,
  totalRevenue: 2450000,
  monthlyGrowth: 18.5,
};

const pendingAuthors = [
  {
    id: '1',
    name: 'Sarah Chebet',
    email: 'sarah.chebet@email.com',
    appliedAt: '2024-12-10T10:30:00',
    bio: 'Passionate storyteller with 10 years of experience writing Kalenjin folklore...',
    booksSubmitted: 2,
    status: 'pending'
  },
  {
    id: '2', 
    name: 'John Kiplagat',
    email: 'j.kiplagat@email.com',
    appliedAt: '2024-12-09T14:20:00',
    bio: 'Academic researcher specializing in Kalenjin history and culture...',
    booksSubmitted: 1,
    status: 'pending'
  },
  {
    id: '3',
    name: 'Mary Rotich',
    email: 'mary.rotich@email.com', 
    appliedAt: '2024-12-08T09:15:00',
    bio: 'Children\'s book author with focus on educational content...',
    booksSubmitted: 3,
    status: 'pending'
  }
];

const allAuthors = [
  {
    id: '1',
    name: 'Dr. Kibet Kitur',
    email: 'kibet.kitur@email.com',
    status: 'approved',
    booksCount: 4,
    totalSales: 342,
    totalEarnings: 187200,
    joinedAt: '2024-01-15',
    isVerified: true
  },
  {
    id: '2',
    name: 'Grace Chepkemoi',
    email: 'grace.chepkemoi@email.com',
    status: 'approved',
    booksCount: 2,
    totalSales: 156,
    totalEarnings: 89400,
    joinedAt: '2024-03-20',
    isVerified: false
  },
  {
    id: '3',
    name: 'Peter Langat',
    email: 'peter.langat@email.com',
    status: 'suspended',
    booksCount: 1,
    totalSales: 23,
    totalEarnings: 12600,
    joinedAt: '2024-06-10',
    isVerified: false
  }
];

const allBooks = [
  {
    id: '1',
    title: 'Immortal Knowledge',
    author: 'Dr. Kibet Kitur',
    category: 'Non-Fiction',
    price: 1200,
    sales: 156,
    rating: 4.9,
    isFeatured: true,
    isPublished: true,
    publishedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Kalenjin Folklore Tales',
    author: 'Grace Chepkemoi',
    category: 'Folklore',
    price: 500,
    sales: 89,
    rating: 4.5,
    isFeatured: false,
    isPublished: true,
    publishedAt: '2024-04-15'
  },
  {
    id: '3',
    title: 'Children Stories',
    author: 'Mary Rotich',
    category: 'Children',
    price: 400,
    sales: 67,
    rating: 4.7,
    isFeatured: true,
    isPublished: true,
    publishedAt: '2024-05-22'
  }
];

type TabType = 'overview' | 'authors' | 'applications' | 'books';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApproveAuthor = (authorId: string) => {
    console.log('Approving author:', authorId);
    // API call to approve author
  };

  const handleRejectAuthor = (authorId: string) => {
    console.log('Rejecting author:', authorId);
    // API call to reject author
  };

  const handleToggleFeatured = (bookId: string) => {
    console.log('Toggling featured status for book:', bookId);
    // API call to toggle featured status
  };

  const tabs: Array<{id: TabType, label: string, icon: any, badge?: number}> = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: UserCheck, badge: pendingAuthors.length },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'books', label: 'Books', icon: Book },
  ];

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Shield className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">Admin Panel</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-brown-600">Super Admin</span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">SA</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">Admin Dashboard</h1>
          <p className="text-neutral-brown-600 mt-1">Manage authors, books, and platform operations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-brown-700 hover:bg-neutral-brown-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.badge && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-white text-primary' : 'bg-red-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary" size={24} />
                  </div>
                  <span className="text-accent-green text-sm font-medium">+12%</span>
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
                  <span className="text-accent-green text-sm font-medium">+8%</span>
                </div>
                <p className="text-sm text-neutral-brown-600 mb-1">Total Books</p>
                <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalBooks}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-primary" size={24} />
                  </div>
                  <span className="text-accent-green text-sm font-medium">+{stats.monthlyGrowth}%</span>
                </div>
                <p className="text-sm text-neutral-brown-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-neutral-brown-900">KES {stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">Recent Applications</h2>
                <div className="space-y-3">
                  {pendingAuthors.slice(0, 3).map((author) => (
                    <div key={author.id} className="flex items-center justify-between p-3 bg-neutral-cream rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-brown-900">{author.name}</p>
                        <p className="text-sm text-neutral-brown-600">{author.booksSubmitted} books submitted</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveAuthor(author.id)}
                          className="p-2 text-accent-green hover:bg-accent-green/10 rounded transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectAuthor(author.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
                >
                  View All Applications →
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">Top Performing Books</h2>
                <div className="space-y-3">
                  {allBooks.slice(0, 3).map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-neutral-cream rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-brown-900">{book.title}</p>
                        <p className="text-sm text-neutral-brown-600">{book.sales} sales • {book.rating}★</p>
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(book.id)}
                        className={`p-2 rounded transition-colors ${
                          book.isFeatured 
                            ? 'text-accent-gold bg-accent-gold/10' 
                            : 'text-neutral-brown-400 hover:bg-neutral-brown-100'
                        }`}
                      >
                        <Star size={16} fill={book.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('books')}
                  className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
                >
                  Manage All Books →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-brown-900">Author Applications</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
                  <input
                    type="search"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Applicant</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Applied</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Books</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Bio</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-brown-100">
                    {pendingAuthors.map((author) => (
                      <tr key={author.id} className="hover:bg-neutral-cream/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-neutral-brown-900">{author.name}</p>
                            <p className="text-sm text-neutral-brown-600">{author.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-brown-900">
                            {new Date(author.appliedAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {author.booksSubmitted} books
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-neutral-brown-600 truncate">{author.bio}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded">
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleApproveAuthor(author.id)}
                              className="p-2 text-accent-green hover:bg-accent-green/10 rounded"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectAuthor(author.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Authors Tab */}
        {activeTab === 'authors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-brown-900">All Authors</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
                  <input
                    type="search"
                    placeholder="Search authors..."
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Books</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Sales</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Earnings</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-brown-100">
                    {allAuthors.map((author) => (
                      <tr key={author.id} className="hover:bg-neutral-cream/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-bold text-sm">
                                {author.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-brown-900 flex items-center gap-2">
                                {author.name}
                                {author.isVerified && (
                                  <CheckCircle size={14} className="text-accent-green" />
                                )}
                              </p>
                              <p className="text-sm text-neutral-brown-600">{author.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            author.status === 'approved' 
                              ? 'bg-accent-green/20 text-accent-green'
                              : author.status === 'suspended'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-neutral-brown-100 text-neutral-brown-600'
                          }`}>
                            {author.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-brown-900">{author.booksCount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-brown-900">{author.totalSales}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-accent-green">KES {author.totalEarnings.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-primary hover:bg-primary/10 rounded">
                              <Edit size={16} />
                            </button>
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
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-brown-900">All Books</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
                  <input
                    type="search"
                    placeholder="Search books..."
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Book</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Sales</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Rating</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-brown-100">
                    {allBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-neutral-cream/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-16 bg-neutral-cream rounded overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-brown-900 flex items-center gap-2">
                                {book.title}
                                {book.isFeatured && (
                                  <Star size={14} className="text-accent-gold fill-current" />
                                )}
                              </p>
                              <p className="text-sm text-neutral-brown-600">
                                Published {new Date(book.publishedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-brown-900">{book.author}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-brown-900">KES {book.price}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-brown-900">{book.sales}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-accent-gold fill-current" />
                            <span className="font-medium text-neutral-brown-900">{book.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded">
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleFeatured(book.id)}
                              className={`p-2 rounded transition-colors ${
                                book.isFeatured 
                                  ? 'text-accent-gold bg-accent-gold/10' 
                                  : 'text-neutral-brown-400 hover:bg-neutral-brown-100'
                              }`}
                            >
                              <Star size={16} fill={book.isFeatured ? 'currentColor' : 'none'} />
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}