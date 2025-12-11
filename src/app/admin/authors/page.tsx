'use client';

import { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, Clock, Mail, Phone, Book, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AuthorApplication {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string;
  phoneNumber: string;
  paymentMethod: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

// Mock data - in production this comes from API
const mockApplications: AuthorApplication[] = [
  {
    id: '1',
    name: 'John Kipchoge',
    email: 'john.kipchoge@gmail.com',
    image: null,
    bio: 'I am a passionate writer from Eldoret with a deep love for Kalenjin folklore and traditions. I have been writing stories for over 10 years.',
    phoneNumber: '+254 712 345 678',
    paymentMethod: 'mpesa',
    status: 'PENDING',
    appliedAt: '2024-12-10T10:30:00',
  },
  {
    id: '2',
    name: 'Mary Chebet',
    email: 'mary.chebet@gmail.com',
    image: null,
    bio: 'Children\'s book author specializing in educational content that teaches young readers about African culture and values.',
    phoneNumber: '+254 723 456 789',
    paymentMethod: 'mpesa',
    status: 'PENDING',
    appliedAt: '2024-12-09T14:15:00',
  },
  {
    id: '3',
    name: 'David Korir',
    email: 'david.korir@gmail.com',
    image: null,
    bio: 'Historian and researcher documenting the rich heritage of the Kalenjin community.',
    phoneNumber: '+254 734 567 890',
    paymentMethod: 'bank',
    status: 'APPROVED',
    appliedAt: '2024-12-08T09:00:00',
  },
];

export default function AdminAuthorsPage() {
  const [applications, setApplications] = useState<AuthorApplication[]>(mockApplications);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [selectedApp, setSelectedApp] = useState<AuthorApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      // In production, call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, status: 'APPROVED' as const } : app
        )
      );
      setSelectedApp(null);
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsProcessing(true);
    try {
      // In production, call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, status: 'REJECTED' as const } : app
        )
      );
      setSelectedApp(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Admin</span>
            </Link>
            <Link href="/admin" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary">
              <ArrowLeft size={20} />
              Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">Author Applications</h1>
            <p className="text-neutral-brown-600 mt-1">
              Review and manage author registration requests
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full font-semibold">
              {pendingCount} Pending
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-brown-700 hover:bg-primary/10'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              {status !== 'all' && (
                <span className="ml-2 text-sm opacity-70">
                  ({applications.filter(a => a.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <User size={48} className="text-neutral-brown-300 mx-auto mb-4" />
              <p className="text-neutral-brown-600">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center overflow-hidden">
                    {app.image ? (
                      <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-neutral-brown-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-neutral-brown-900 text-lg">{app.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-brown-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {app.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {app.phoneNumber}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'PENDING' ? 'bg-accent-gold/10 text-accent-gold' :
                        app.status === 'APPROVED' ? 'bg-accent-green/10 text-accent-green' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {app.status === 'PENDING' && <Clock size={14} className="inline mr-1" />}
                        {app.status === 'APPROVED' && <CheckCircle size={14} className="inline mr-1" />}
                        {app.status === 'REJECTED' && <XCircle size={14} className="inline mr-1" />}
                        {app.status}
                      </div>
                    </div>
                    
                    <p className="text-neutral-brown-600 mt-3 line-clamp-2">{app.bio}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-brown-100">
                      <span className="text-sm text-neutral-brown-500">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      
                      {app.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-4 py-2 bg-neutral-brown-100 text-neutral-brown-700 rounded-lg hover:bg-neutral-brown-200 transition-colors text-sm font-medium"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green/90 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-brown-100">
              <h2 className="text-2xl font-bold text-neutral-brown-900">Review Application</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
                  <User size={36} className="text-neutral-brown-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-brown-900">{selectedApp.name}</h3>
                  <p className="text-neutral-brown-600">{selectedApp.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-neutral-brown-900 mb-2">Bio</h4>
                <p className="text-neutral-brown-600 bg-neutral-cream p-4 rounded-lg">{selectedApp.bio}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-neutral-brown-900 mb-2">Phone</h4>
                  <p className="text-neutral-brown-600">{selectedApp.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-brown-900 mb-2">Payment Method</h4>
                  <p className="text-neutral-brown-600 capitalize">{selectedApp.paymentMethod}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-neutral-brown-900 mb-2">Rejection Reason (if rejecting)</h4>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-neutral-brown-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setRejectionReason('');
                }}
                className="px-6 py-3 text-neutral-brown-700 hover:bg-neutral-brown-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedApp.id)}
                disabled={isProcessing}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedApp.id)}
                disabled={isProcessing}
                className="px-6 py-3 bg-accent-green text-white rounded-lg hover:bg-accent-green/90 transition-colors font-medium disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
