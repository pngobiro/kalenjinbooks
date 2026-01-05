'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Book, ShoppingCart, TrendingUp, Plus, Clock, CheckCircle, XCircle, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { getAuthorById } from '@/lib/api/authors';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';

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
  const { user, isLoading: authLoading, googleLogin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [authorStatus, setAuthorStatus] = useState<any>(null);
  const [isLoadingAuthorStatus, setIsLoadingAuthorStatus] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for success parameter from book upload
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setShowSuccessMessage(true);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/author');
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    if (urlParams.get('bookUploaded') === 'true') {
      setShowSuccessMessage(true);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/author');
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, []);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (!authLoading && user && user.role === 'ADMIN') {
      console.log('Admin user detected, redirecting to admin dashboard');
      router.push('/dashboard/admin');
    }
  }, [user, authLoading, router]);

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

    async function loadAuthorStatus() {
      if (user?.id) {
        setIsLoadingAuthorStatus(true);
        try {
          const token = localStorage.getItem('kaleereads_token');
          if (token) {
            const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const data: any = await response.json();
              if (data && data.data) {
                setAuthorStatus(data.data);
              }
            } else if (response.status === 404) {
              // User doesn't have an author profile yet
              setAuthorStatus(null);
            }
          }
        } catch (e) {
          console.error("Failed to load author status", e);
        } finally {
          setIsLoadingAuthorStatus(false);
        }
      }
    }

    loadStats();
    loadAuthorStatus();

    // Google Sign In Init
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Add-Your-Client-ID-Here",
        callback: (response: any) => {
          googleLogin(response.credential);
        }
      });
      const buttonElement = document.getElementById("google-signin-button");
      if (buttonElement) {
        window.google.accounts.id.renderButton(
          buttonElement,
          { theme: "outline", size: "large" }
        );
      }
    }
  }, [googleLogin, user?.id, user?.role]);

  if (authLoading || isLoadingStats || isLoadingAuthorStatus) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Success message for new registrations and book uploads
  const SuccessMessage = () => {
    if (!showSuccessMessage) return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const isBookUpload = urlParams.get('bookUploaded') === 'true';
    
    return (
      <div className="fixed top-4 right-4 z-50 bg-accent-green text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 ease-in-out">
        <CheckCircle size={20} />
        <div>
          <p className="font-semibold">
            {isBookUpload ? 'Book Uploaded Successfully!' : 'Application Submitted Successfully!'}
          </p>
          <p className="text-sm opacity-90">
            {isBookUpload 
              ? 'Your book is now in draft mode. You can publish it when ready.' 
              : 'We\'ll review your application within 24-48 hours.'
            }
          </p>
        </div>
        <button 
          onClick={() => setShowSuccessMessage(false)}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    );
  };

  // Check if user has author profile - if not, show registration page
  if (!user || (!authorStatus && !isLoadingAuthorStatus)) {
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
                    <Link
                      href="/dashboard/author/register"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Complete Author Registration <ArrowRight size={18} />
                    </Link>
                  </div>
                  <p className="text-xs text-neutral-brown-500">Complete your author profile to start publishing books.</p>
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

  // Show author dashboard if user has author profile
  if (user && authorStatus) {
    // Show status notification if author status is available
    if (authorStatus) {
      if (authorStatus.status === 'PENDING') {
        return (
          <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-4">
            <SuccessMessage />
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-brown-900 mb-2">Application Pending</h2>
              <p className="text-neutral-brown-600 mb-6">
                {authorStatus.statusMessage}
              </p>
              <div className="bg-neutral-cream rounded-lg p-4 mb-6">
                <p className="text-sm text-neutral-brown-600">
                  <strong>Applied:</strong> {new Date(authorStatus.appliedAt).toLocaleDateString()}
                </p>
              </div>
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

      if (authorStatus.status === 'REJECTED') {
        return (
          <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-4">
            <SuccessMessage />
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-brown-900 mb-2">Application Not Approved</h2>
              <p className="text-neutral-brown-600 mb-4">
                We're sorry, but your author application was not approved at this time.
              </p>
              {authorStatus.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-red-900 mb-2">Reason:</h3>
                  <p className="text-red-700 text-sm">{authorStatus.rejectionReason}</p>
                </div>
              )}
              <div className="bg-neutral-cream rounded-lg p-4 mb-6">
                <p className="text-sm text-neutral-brown-600">
                  <strong>Applied:</strong> {new Date(authorStatus.appliedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/dashboard/author/register"
                  className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Apply Again
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-primary hover:underline text-sm font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        );
      }

      // If approved but disabled by admin
      if (authorStatus.status === 'APPROVED' && !authorStatus.isActive) {
        return (
          <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-4">
            <SuccessMessage />
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-brown-900 mb-2">Account Disabled</h2>
              <p className="text-neutral-brown-600 mb-6">
                Your author account has been temporarily disabled. Please contact support for assistance.
              </p>
              <Link
                href="/contact"
                className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        );
      }
    }

    // Legacy check for old authorStatus field
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
        <SuccessMessage />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <AuthorProfileHeader 
              variant="page" 
              showEmail={true} 
              showStatus={true}
              className="mb-4"
            />
            <h1 className="text-3xl font-bold text-neutral-brown-900">Dashboard</h1>
            <p className="text-neutral-brown-700 mt-1">
              Here's your author overview and recent activity
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/dashboard/admin"
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
              <div className="text-center">
                <p className="text-neutral-brown-600 mb-4">Ready to become an author?</p>
                <button
                  onClick={() => router.push('/dashboard/author/register')}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Complete Author Application <ArrowRight size={18} />
                </button>
              </div>
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
