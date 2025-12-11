'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Book, ShoppingCart, TrendingUp, Plus, Clock, CheckCircle, XCircle, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type AuthorStatus = 'not_registered' | 'pending' | 'approved' | 'rejected';

// Mock auth state - in production this comes from session/auth context
const mockAuthState = {
  isLoggedIn: false,
  user: null as { name: string; email: string; image: string } | null,
  authorStatus: 'not_registered' as AuthorStatus,
};

// This would come from API/database
const stats = {
  totalEarnings: 145250,
  earningsTrend: 12,
  booksPublished: 8,
  totalSales: 342,
  salesTrend: 8,
  pendingPayouts: 25000,
};

const recentSales = [
  { id: '1', book: 'Kalenjin Folklore Tales', customer: 'John Doe', amount: 500, date: '2024-12-02T10:30:00' },
  { id: '2', book: 'Traditional Wisdom', customer: 'Jane Smith', amount: 750, date: '2024-12-02T09:15:00' },
  { id: '3', book: 'Cultural Heritage', customer: 'Mike Johnson', amount: 600, date: '2024-12-01T16:45:00' },
];

const topBooks = [
  { title: 'Kalenjin Folklore Tales', sales: 125, earnings: 56250 },
  { title: 'Traditional Wisdom', sales: 98, earnings: 44100 },
  { title: 'Cultural Heritage', sales: 76, earnings: 34200 },
];

export default function AuthorDashboardPage() {
  const [authState, setAuthState] = useState(mockAuthState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status - in production this would check session
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo, check localStorage for mock auth
        const savedAuth = localStorage.getItem('kaleereads_author_auth');
        if (savedAuth) {
          setAuthState(JSON.parse(savedAuth));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not registered - show registration prompt
  if (!authState.isLoggedIn || authState.authorStatus === 'not_registered') {
    return (
      <div className="min-h-screen bg-neutral-cream">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">
              Become a KaleeReads Author
            </h1>
            <p className="text-lg text-neutral-brown-600 mb-8 max-w-2xl mx-auto">
              Share your stories with thousands of readers. Join our community of authors and start earning from your writing today.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-neutral-cream rounded-xl p-6">
                <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-accent-green" size={24} />
                </div>
                <h3 className="font-bold text-neutral-brown-900 mb-2">70% Revenue</h3>
                <p className="text-sm text-neutral-brown-600">Keep most of your earnings from every sale</p>
              </div>
              <div className="bg-neutral-cream rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="text-primary" size={24} />
                </div>
                <h3 className="font-bold text-neutral-brown-900 mb-2">Easy Publishing</h3>
                <p className="text-sm text-neutral-brown-600">Upload and manage your books with ease</p>
              </div>
              <div className="bg-neutral-cream rounded-xl p-6">
                <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-accent-gold" size={24} />
                </div>
                <h3 className="font-bold text-neutral-brown-900 mb-2">Full Analytics</h3>
                <p className="text-sm text-neutral-brown-600">Track your sales and reader engagement</p>
              </div>
            </div>
            
            <Link
              href="/dashboard/author/register"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              Register as Author
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pending approval
  if (authState.authorStatus === 'pending') {
    return (
      <div className="min-h-screen bg-neutral-cream">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-accent-gold" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-4">
              Application Under Review
            </h1>
            <p className="text-neutral-brown-600 mb-8">
              Your author application is being reviewed by our team. We'll notify you via email once a decision has been made.
            </p>
            
            <div className="bg-neutral-cream rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-neutral-brown-600">Status</span>
                <span className="bg-accent-gold/10 text-accent-gold px-3 py-1 rounded-full text-sm font-medium">
                  Pending Review
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-brown-600">Estimated Time</span>
                <span className="font-medium text-neutral-brown-900">24-48 hours</span>
              </div>
            </div>
            
            <Link href="/" className="text-primary hover:text-primary-dark font-medium">
              Return to Homepage →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Rejected
  if (authState.authorStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-neutral-cream">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-4">
              Application Not Approved
            </h1>
            <p className="text-neutral-brown-600 mb-8">
              Unfortunately, your author application was not approved at this time. You can reapply after addressing the feedback.
            </p>
            
            <div className="bg-red-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-neutral-brown-900 mb-2">Reason:</h3>
              <p className="text-neutral-brown-600">
                Please provide more details about your writing experience and the type of content you plan to publish.
              </p>
            </div>
            
            <Link
              href="/dashboard/author/register"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all"
            >
              Reapply
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Approved - show full dashboard
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-brown-900">Dashboard</h1>
          <p className="text-neutral-brown-700 mt-1">
            Welcome back! Here's your overview
          </p>
        </div>
        <Link
          href="/dashboard/author/books/new"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Upload New Book
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="text-primary" size={24} />
            </div>
            <span className="text-accent-green text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} />
              +{stats.earningsTrend}%
            </span>
          </div>
          <p className="text-sm text-neutral-brown-700 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-neutral-brown-900">
            KES {stats.totalEarnings.toLocaleString()}
          </p>
        </div>

        {/* Books Published */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
              <Book className="text-accent-green" size={24} />
            </div>
          </div>
          <p className="text-sm text-neutral-brown-700 mb-1">Books Published</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.booksPublished}</p>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-primary" size={24} />
            </div>
            <span className="text-accent-green text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} />
              +{stats.salesTrend}%
            </span>
          </div>
          <p className="text-sm text-neutral-brown-700 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalSales}</p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-gold/10 rounded-lg flex items-center justify-center">
              <DollarSign className="text-accent-gold" size={24} />
            </div>
          </div>
          <p className="text-sm text-neutral-brown-700 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-neutral-brown-900">
            KES {stats.pendingPayouts.toLocaleString()}
          </p>
          <Link
            href="/dashboard/author/earnings"
            className="text-sm text-primary hover:text-primary-dark font-medium mt-2 inline-block"
          >
            Request Payout →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-brown-900">Recent Sales</h2>
            <Link
              href="/dashboard/author/analytics"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 bg-neutral-cream rounded-lg"
              >
                <div>
                  <p className="font-medium text-neutral-brown-900">{sale.book}</p>
                  <p className="text-sm text-neutral-brown-700">{sale.customer}</p>
                  <p className="text-xs text-neutral-brown-700 mt-1">
                    {new Date(sale.date).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">KES {sale.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Books */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-brown-900">
              Top Performing Books
            </h2>
          </div>

          <div className="space-y-4">
            {topBooks.map((book, index) => (
              <div key={book.title} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-brown-900">{book.title}</p>
                  <p className="text-sm text-neutral-brown-700">{book.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent-green">
                    KES {book.earnings.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-primary/10 to-accent-green/10 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-2">
                Quick Actions
              </h2>
              <div className="space-y-3 mt-4">
                <Link
                  href="/dashboard/author/books/new"
                  className="block bg-white hover:bg-primary hover:text-white text-neutral-brown-900 font-medium px-4 py-3 rounded-lg transition-all"
                >
                  📚 Upload New Book
                </Link>
                <Link
                  href="/dashboard/author/earnings"
                  className="block bg-white hover:bg-primary hover:text-white text-neutral-brown-900 font-medium px-4 py-3 rounded-lg transition-all"
                >
                  💰 Request Payout
                </Link>
                <Link
                  href="/dashboard/author/profile"
                  className="block bg-white hover:bg-primary hover:text-white text-neutral-brown-900 font-medium px-4 py-3 rounded-lg transition-all"
                >
                  👤 Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
