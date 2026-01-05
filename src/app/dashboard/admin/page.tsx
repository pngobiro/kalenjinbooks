'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Users, Book, TrendingUp, UserCheck, 
  Star, Eye, Edit, CheckCircle, XCircle, Clock,
  Search, Filter, MoreVertical, Ban, Power
} from 'lucide-react';
import AdminOverview from '@/components/admin/AdminOverview';
import PendingBooksTab from '@/components/admin/PendingBooksTab';
import ApplicationsTab from '@/components/admin/ApplicationsTab';
import RejectedTab from '@/components/admin/RejectedTab';
import AuthorsTab from '@/components/admin/AuthorsTab';
import BooksTab from '@/components/admin/BooksTab';
import { useAdminData } from '@/components/admin/useAdminData';
import { Author, BookData, PendingBook, Stats } from '@/types/admin';

type TabType = 'overview' | 'authors' | 'applications' | 'rejected' | 'books' | 'pending-books';

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Get active tab from URL parameters
  const activeTab = (searchParams.get('tab') as TabType) || 'overview';

  // Function to change tab and update URL
  const setActiveTab = (tab: TabType) => {
    if (tab === 'overview') {
      router.push('/dashboard/admin');
    } else {
      router.push(`/dashboard/admin?tab=${tab}`);
    }
  };

  const {
    stats,
    pendingAuthors,
    rejectedAuthors,
    allAuthors,
    allBooks,
    pendingBooks,
    isLoading,
    error,
    refetch,
  } = useAdminData();

  // Handler functions
  const handleApproveBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to approve and publish this book?')) return;
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/books/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve book');
      }

      await refetch();
      alert('Book approved and published successfully!');
    } catch (err) {
      console.error('Error approving book:', err);
      alert('Failed to approve book');
    }
  };

  const handleRejectBook = async (bookId: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/books/reject', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookId,
          reason: reason.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject book');
      }

      await refetch();
      alert('Book rejected successfully!');
    } catch (err) {
      console.error('Error rejecting book:', err);
      alert('Failed to reject book');
    }
  };

  const handleApproveAuthor = async (authorId: string) => {
    if (!confirm('Are you sure you want to approve this author?')) return;
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/authors/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorId }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve author');
      }

      await refetch();
      alert('Author approved successfully!');
    } catch (err) {
      console.error('Error approving author:', err);
      alert('Failed to approve author');
    }
  };

  const handleRejectAuthor = async (authorId: string) => {
    setSelectedAuthorId(authorId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmRejectAuthor = async () => {
    if (!selectedAuthorId || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/authors/reject', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          authorId: selectedAuthorId,
          reason: rejectionReason.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject author');
      }

      setShowRejectModal(false);
      setSelectedAuthorId(null);
      setRejectionReason('');
      await refetch();
      alert('Author rejected successfully!');
    } catch (err) {
      console.error('Error rejecting author:', err);
      alert('Failed to reject author');
    }
  };

  const handleToggleAuthorStatus = async (authorId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'disable' : 'enable';
    const message = currentStatus 
      ? 'This will disable the author and all their books. Are you sure?' 
      : 'Are you sure you want to enable this author?';
    
    if (!confirm(message)) return;
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/authors/toggle-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          authorId,
          isActive: !currentStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} author`);
      }

      await refetch();
      alert(`Author ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing author:`, err);
      alert(`Failed to ${action} author`);
    }
  };

  const handleMakeAdmin = async (authorId: string, userEmail: string) => {
    const message = `Are you sure you want to make ${userEmail} an admin? This will give them full administrative privileges.`;
    
    if (!confirm(message)) return;
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/authors/make-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          authorId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to make admin');
      }

      await refetch();
      alert(`${userEmail} has been successfully promoted to admin!`);
    } catch (err) {
      console.error('Error making admin:', err);
      alert(err instanceof Error ? err.message : 'Failed to make admin');
    }
  };

  const handleToggleBookStatus = async (bookId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'disable' : 'enable';
    if (!confirm(`Are you sure you want to ${action} this book?`)) return;
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/books/toggle-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookId,
          isActive: !currentStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} book`);
      }

      await refetch();
      alert(`Book ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing book:`, err);
      alert(`Failed to ${action} book`);
    }
  };

  const handleToggleFeatured = async (bookId: string, currentFeaturedStatus: boolean) => {
    const action = currentFeaturedStatus ? 'unfeature' : 'feature';
    if (!confirm(`Are you sure you want to ${action} this book?`)) return;
    
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/books/toggle-featured', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookId,
          isFeatured: !currentFeaturedStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} book`);
      }

      await refetch();
      alert(`Book ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing book:`, err);
      alert(`Failed to ${action} book`);
    }
  };

  const tabs: Array<{id: TabType, label: string, icon: any, badge?: number}> = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: UserCheck, badge: stats.pendingApplications },
    { id: 'rejected', label: 'Rejected', icon: XCircle, badge: rejectedAuthors.length },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'pending-books', label: 'Pending Books', icon: Clock, badge: stats.pendingBooks },
  ];

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Error loading dashboard</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
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
            {tab.badge && tab.badge > 0 && (
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-white text-primary' : 'bg-red-500 text-white'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <AdminOverview
          stats={stats}
          pendingAuthors={pendingAuthors}
          pendingBooks={pendingBooks}
          allBooks={allBooks}
          onApproveAuthor={handleApproveAuthor}
          onRejectAuthor={handleRejectAuthor}
          onApproveBook={handleApproveBook}
          onRejectBook={handleRejectBook}
          onToggleFeatured={handleToggleFeatured}
          onSetActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'pending-books' && (
        <PendingBooksTab
          pendingBooks={pendingBooks}
          onApproveBook={handleApproveBook}
          onRejectBook={handleRejectBook}
        />
      )}

      {activeTab === 'applications' && (
        <ApplicationsTab
          pendingAuthors={pendingAuthors}
          onApproveAuthor={handleApproveAuthor}
          onRejectAuthor={handleRejectAuthor}
        />
      )}

      {activeTab === 'rejected' && (
        <RejectedTab
          rejectedAuthors={rejectedAuthors}
        />
      )}

      {activeTab === 'authors' && (
        <AuthorsTab
          allAuthors={allAuthors}
          onToggleAuthorStatus={handleToggleAuthorStatus}
          onMakeAdmin={handleMakeAdmin}
        />
      )}

      {activeTab === 'books' && (
        <BooksTab
          allBooks={allBooks}
          onToggleBookStatus={handleToggleBookStatus}
          onToggleFeatured={handleToggleFeatured}
        />
      )}
      
      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-neutral-brown-900 mb-4">Reject Author Application</h3>
            <p className="text-neutral-brown-600 mb-4">
              Please provide a reason for rejecting this author application. This will help the applicant understand the decision.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete application, insufficient writing experience, etc."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAuthorId(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectAuthor}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}