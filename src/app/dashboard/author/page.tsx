'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Book, ShoppingCart, TrendingUp, Plus, Clock, CheckCircle, XCircle, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getAuthorById } from '@/lib/api/authors';

// This would come from API/database
const initialStats = {
  totalEarnings: 0,
  earningsTrend: 0,
  booksPublished: 0,
  totalSales: 0,
  salesTrend: 0,
  pendingPayouts: 0,
  rating: 0
};

export default function AuthorDashboardPage() {
  const { user, isLoading: authLoading, googleLogin, registerAuthor } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    async function loadStats() {
      if (user?.id) {
        setIsLoadingStats(true);
        try {
          // Placeholder for fetching author stats
          // const author = await getAuthorById(user.id); // This might fail if user ID != author ID
          // setStats(...)
        } catch (e) {
          console.error("Failed to load stats", e);
        } finally {
          setIsLoadingStats(false);
        }
      }
    }
    loadStats();

    // Google Sign In Init
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Add-Your-Client-ID-Here",
        callback: (response: any) => {
          googleLogin(response.credential);
        }
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    }
  }, [googleLogin, user?.id]);

  if (authLoading || isLoadingStats) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not registered / Not Logged In
  if (!user || (user.role !== 'AUTHOR' && user.role !== 'ADMIN')) {
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

            <div className="max-w-sm mx-auto mb-8">
              {user ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm text-neutral-brown-700 mb-2">Signed in as <span className="font-semibold">{user.email}</span></p>
                    <button
                      onClick={() => registerAuthor()}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Activate Author Account <ArrowRight size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-brown-500">By activating, you agree to our Author Terms of Service.</p>
                </div>
              ) : (
                <>
                  <div id="google-signin-button"></div>
                  {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                    <div className="text-xs text-red-500 mt-2 text-left bg-red-50 p-2 rounded border border-red-100">
                      <p className="font-bold">Setup Required:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Set <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in .env.local</li>
                        <li>Add <code className="bg-red-100 px-1 rounded">http://localhost:3000</code> and <code className="bg-red-100 px-1 rounded">http://localhost:3001</code> to <strong>Authorized JavaScript origins</strong> in Google Cloud Console</li>
                      </ul>
                    </div>
                  )}
                  <div className="text-sm text-neutral-brown-500 mt-4">
                    Or <Link href="/login" className="text-primary hover:underline">sign in with email</Link>
                  </div>
                </>
              )}
            </div>

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
          </div>
        </div>
      </div>
    );
  }

  // Approved - show full dashboard
  if (user && (user.role === 'AUTHOR' || user.role === 'ADMIN')) {
    if (user.authorStatus === 'PENDING') {
      return (
        <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-brown-900 mb-2">Application Pending</h2>
            <p className="text-neutral-brown-600 mb-6">
              Thanks for applying to become an author! Our team is reviewing your details.
              You will be notified once your account is approved.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline text-sm font-medium"
            >
              Check Status Again
            </button>
          </div>
        </div>
      );
    }

    // If approved (or undefined/legacy), show dashboard
    return (
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900">Dashboard</h1>
            <p className="text-neutral-brown-700 mt-1">
              Welcome back, {user.name}! Here's your overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                className="bg-neutral-brown-800 hover:bg-neutral-brown-900 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <User size={20} />
                Admin Panel
              </Link>
            )}
            <Link
              href="/dashboard/author/books/new"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Upload New Book
            </Link>
          </div>
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
                Coming Soon
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
                Coming Soon
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

        <div className="bg-neutral-cream p-4 rounded-lg border border-neutral-brown-200">
          <p className="text-sm text-neutral-brown-600 text-center">
            More analytics and sales data will be available soon as we connect to the payment processing system.
          </p>
        </div>

      </div>
    );
  }

  // Not Logged In OR Reader -> Show Landing Page
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

          <div className="max-w-sm mx-auto mb-8 text-left">
            {user ? (
              <AuthorApplicationForm onSubmit={registerAuthor} email={user.email} />
            ) : (
              <div className="text-center">
                <div id="google-signin-button"></div>
                {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                  <p className="text-xs text-red-500 mt-2">
                    Warning: NEXT_PUBLIC_GOOGLE_CLIENT_ID not set in .env.local
                  </p>
                )}
                <div className="text-sm text-neutral-brown-500 mt-4">
                  Or <Link href="/login" className="text-primary hover:underline">sign in with email</Link>
                </div>
              </div>
            )}
          </div>

          {!user && (
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
          )}
        </div>
      </div>
    </div>
  );
}

function AuthorApplicationForm({ onSubmit, email }: { onSubmit: (bio?: string, phone?: string) => Promise<any>, email: string }) {
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(bio, phone);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-4">
        <p className="text-sm text-neutral-brown-700">Applying as <span className="font-semibold">{email}</span></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Phone Number</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g +254 7..."
          className="w-full rounded-lg border-neutral-brown-200 focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Short Bio</label>
        <textarea
          required
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a bit about yourself and your writing..."
          rows={3}
          className="w-full rounded-lg border-neutral-brown-200 focus:ring-primary focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Application'} <ArrowRight size={18} />
      </button>
      <p className="text-xs text-neutral-brown-500 text-center">
        By submitting, your account will be pending approval.
      </p>
    </form>
  );
}
