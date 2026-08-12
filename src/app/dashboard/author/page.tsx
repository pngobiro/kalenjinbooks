'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Book, Plus, Clock, CheckCircle, XCircle, User, ArrowRight, FileText, Eye, Edit, PenTool, Star, Sparkles, Target, Users, PlayCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  coverType?: string;
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
}

interface BookItem {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  price: number;
  category: string | null;
  isPublished: boolean;
  rating: number;
  publishedAt: string | null;
}

const initialStats = {
  totalEarnings: 0,
  booksPublished: 0,
  totalSales: 0,
  pendingPayouts: 0
};

export default function AuthorDashboardPage() {
  const { user, isLoading: authLoading, googleLogin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [authorStatus, setAuthorStatus] = useState<any>(null);
  const [isLoadingAuthorStatus, setIsLoadingAuthorStatus] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);

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
        
        const maxRetries = 3;
        const retryDelay = 1000; // 1 second
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const token = localStorage.getItem('kaleereads_token');
            if (!token) {
              console.log('No auth token found');
              setAuthorStatus(null);
              break;
            }

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
                // Load blogs after getting author ID
                loadBlogs(data.data.id);
                loadBooks(data.data.id);
              }
              break; // Success, exit retry loop
            } else if (response.status === 404) {
              // User doesn't have an author profile yet - not an error
              console.log('No author profile found for user');
              setAuthorStatus(null);
              break; // Don't retry for 404
            } else if (response.status === 401) {
              // Invalid token - user needs to log in again
              console.log('Authentication required');
              setAuthorStatus(null);
              break; // Don't retry for auth errors
            } else if (response.status >= 400 && response.status < 500) {
              // Client errors (400-499) - don't retry, log details
              const errorText = await response.text().catch(() => 'Unable to read error');
              console.error(`Client error ${response.status}:`, errorText);
              setAuthorStatus(null);
              break; // Don't retry for client errors
            } else if (response.status >= 500) {
              // Server error - retry
              console.log(`Server error (attempt ${attempt}/${maxRetries}):`, response.status);
              if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
              }
            } else {
              // Other errors - don't retry
              console.log('Unexpected response status:', response.status);
              break;
            }
          } catch (e) {
            // Network error - retry
            console.log(`Network error loading author status (attempt ${attempt}/${maxRetries}):`, e);
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            } else {
              console.error('Failed to load author status after retries:', e);
            }
          }
        }
        
        setIsLoadingAuthorStatus(false);
      }
    }

    async function loadBlogs(authorId: string) {
      setIsLoadingBlogs(true);
      try {
        const { getApiBaseUrl } = await import('@/lib/api/blogs');
        const response = await fetch(`${getApiBaseUrl()}/api/blog/posts?authorId=${authorId}&limit=5`);
        if (response.ok) {
          const data: any = await response.json();
          setRecentBlogs(data.posts || []);
        }
      } catch (e) {
        console.error('Failed to load blogs', e);
      } finally {
        setIsLoadingBlogs(false);
      }
    }

    async function loadBooks(authorId: string) {
      setIsLoadingBooks(true);
      try {
        const response = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books?authorId=${authorId}&limit=4`);
        if (response.ok) {
          const data: any = await response.json();
          const items = (data.data || []).map((b: any) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            coverImage: b.coverImage,
            price: b.price,
            category: b.category,
            isPublished: b.isPublished,
            rating: b.rating || 0,
            publishedAt: b.publishedAt,
          }));
          setBooks(items);
        }
      } catch (e) {
        console.error('Failed to load books', e);
      } finally {
        setIsLoadingBooks(false);
      }
    }

    loadStats();
    loadAuthorStatus();

    // Google Sign In Init
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '465353510096-rsifs9pc2r1cesh7uucgq2pqs2ne1392.apps.googleusercontent.com',
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
    const totalBlogViews = recentBlogs.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const publishedBooks = books.filter((b) => b.isPublished).length;
    const authorName = authorStatus?.user?.name || authorStatus?.name || user?.name || 'Author';
    const authorBio = authorStatus?.bio || 'Storyteller on KaleeReads.';

    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <SuccessMessage />

        {/* Author Spotlight Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-primary-dark rounded-2xl text-white mb-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-accent-gold rounded-full blur-3xl" />
          </div>
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Author identity */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-white/20 bg-white/10 flex items-center justify-center">
                    {authorStatus?.profileImage || authorStatus?.user?.image ? (
                      <img
                        src={authorStatus.profileImage || authorStatus.user.image}
                        alt={authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-white/70" />
                    )}
                  </div>
                  {authorStatus?.status === 'APPROVED' && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent-green rounded-full flex items-center justify-center ring-2 ring-white">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-primary-light/80 font-medium">Welcome back,</p>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold truncate">{authorName}</h1>
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">{authorBio}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${
                      authorStatus?.status === 'APPROVED' ? 'bg-accent-green/20 text-accent-green-light' :
                      authorStatus?.status === 'PENDING' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-red-400/20 text-red-300'
                    }`}>
                      {authorStatus?.status === 'APPROVED' ? <CheckCircle size={12} /> : null}
                      {authorStatus?.status || 'Author'}
                    </span>
                    <Link href="/dashboard/author/profile" className="text-xs text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                      Edit profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-3 flex-shrink-0">
                <Link
                  href="/dashboard/author/blogs/new"
                  className="inline-flex items-center gap-2 bg-white text-neutral-brown-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-cream transition-all"
                >
                  <PenTool size={18} />
                  Write a Post
                </Link>
                <Link
                  href="/dashboard/author/books/new"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  <Plus size={18} />
                  Upload Book
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip - real data */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border-b-2 border-primary flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Book className="text-primary" size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-brown-600 truncate">Books</p>
              <p className="text-xl font-bold text-neutral-brown-900">{books.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-b-2 border-accent-green flex items-center gap-3">
            <div className="w-11 h-11 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-accent-green" size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-brown-600 truncate">Published</p>
              <p className="text-xl font-bold text-accent-green">{publishedBooks}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-b-2 border-blue-500 flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="text-blue-600" size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-brown-600 truncate">Blog Posts</p>
              <p className="text-xl font-bold text-neutral-brown-900">{recentBlogs.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-b-2 border-accent-gold flex items-center gap-3">
            <div className="w-11 h-11 bg-accent-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="text-accent-gold" size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-brown-600 truncate">Blog Views</p>
              <p className="text-xl font-bold text-neutral-brown-900">{totalBlogViews.toLocaleString()}</p>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-accent-green to-emerald-700 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-white" size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/80 truncate">Earnings</p>
              <p className="text-xl font-bold text-white">KES {stats.totalEarnings?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Action hero banner when empty */}
        {books.length === 0 && recentBlogs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-primary" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-heading font-bold text-neutral-brown-900">Your readers are waiting</h3>
              <p className="text-neutral-brown-600 mt-1 text-sm max-w-xl">
                Publish your first book or write a blog post to start building your audience on KaleeReads.
                Authors keep 70% of every sale.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/dashboard/author/books/new" className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2">
                <Plus size={18} /> Publish a Book
              </Link>
              <Link href="/dashboard/author/blogs/new" className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2">
                <PenTool size={18} /> Start Blogging
              </Link>
            </div>
          </div>
        )}

        {/* Recent Blog Posts + Recent Books */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Recent Blog Posts */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-brown-100">
              <div>
                <h2 className="text-lg font-heading font-bold text-neutral-brown-900 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Recent Blog Posts
                </h2>
              </div>
              <Link
                href="/dashboard/author/blogs"
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {isLoadingBlogs ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentBlogs.length > 0 ? (
              <div className="divide-y divide-neutral-brown-100">
                {recentBlogs.map((post) => (
                  <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-cream/40 transition-colors">
                    <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-cream relative">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {post.coverType === 'video' ? (
                            <PlayCircle className="text-primary" size={22} />
                          ) : (
                            <FileText size={22} className="text-neutral-brown-400" />
                          )}
                        </div>
                      )}
                      {post.coverType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <PlayCircle className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-brown-900 truncate text-sm">{post.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.isPublished ? 'bg-accent-green/10 text-accent-green' : 'bg-neutral-brown-100 text-neutral-brown-600'
                        }`}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-neutral-brown-500 flex items-center gap-1">
                          <Eye size={12} /> {post.viewCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-neutral-brown-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`/blogs/${post.id}`} className="p-2 text-neutral-brown-600 hover:bg-primary/10 hover:text-primary rounded-lg" title="View">
                        <Eye size={16} />
                      </Link>
                      <Link href={`/dashboard/author/blogs/${post.id}/edit`} className="p-2 text-neutral-brown-600 hover:bg-primary/10 hover:text-primary rounded-lg" title="Edit">
                        <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-14 px-6">
                <div className="w-14 h-14 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText size={24} className="text-neutral-brown-400" />
                </div>
                <p className="text-neutral-brown-600 text-sm mb-4">No blog posts yet — share your journey with readers</p>
                <Link href="/dashboard/author/blogs/new" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                  <Plus size={16} /> Create First Post
                </Link>
              </div>
            )}
          </div>

          {/* Recent Books */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-brown-100">
              <div>
                <h2 className="text-lg font-heading font-bold text-neutral-brown-900 flex items-center gap-2">
                  <Book size={20} className="text-primary" />
                  My Books
                </h2>
              </div>
              <Link
                href="/dashboard/author/books"
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {isLoadingBooks ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : books.length > 0 ? (
              <div className="divide-y divide-neutral-brown-100">
                {books.map((book) => (
                  <div key={book.id} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-cream/40 transition-colors">
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-cream">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Book size={18} className="text-primary/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-brown-900 truncate text-sm">{book.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          book.isPublished ? 'bg-accent-green/10 text-accent-green' : 'bg-neutral-brown-100 text-neutral-brown-600'
                        }`}>
                          {book.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-neutral-brown-500 flex items-center gap-1">
                          <Star size={12} className="text-accent-gold" /> {book.rating ? book.rating.toFixed(1) : 'New'}
                        </span>
                        <span className="text-xs text-neutral-brown-500 font-medium">
                          KES {book.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`/books/${book.id}`} className="p-2 text-neutral-brown-600 hover:bg-primary/10 hover:text-primary rounded-lg" title="View">
                        <Eye size={16} />
                      </Link>
                      <Link href={`/dashboard/author/books/${book.id}/edit`} className="p-2 text-neutral-brown-600 hover:bg-primary/10 hover:text-primary rounded-lg" title="Edit">
                        <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-14 px-6">
                <div className="w-14 h-14 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-3">
                  <Book size={24} className="text-neutral-brown-400" />
                </div>
                <p className="text-neutral-brown-600 text-sm mb-4">No books yet — start sharing your stories</p>
                <Link href="/dashboard/author/books/new" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                  <Plus size={16} /> Upload First Book
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Growth tips strip */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-2">
          <h3 className="text-base font-heading font-bold text-neutral-brown-900 flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-accent-gold" />
            Grow your readership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <PenTool size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-brown-900">Write consistently</p>
                <p className="text-xs text-neutral-brown-600 mt-0.5">Post weekly blogs to keep readers engaged with your voice.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target size={18} className="text-accent-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-brown-900">Publish thoughtful books</p>
                <p className="text-xs text-neutral-brown-600 mt-0.5">High-quality stories earn the best ratings and repeat readers.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 bg-accent-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-accent-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-brown-900">Earn 70% of every sale</p>
                <p className="text-xs text-neutral-brown-600 mt-0.5">Your work pays off — track performance in Analytics as it connects.</p>
              </div>
            </div>
          </div>
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
