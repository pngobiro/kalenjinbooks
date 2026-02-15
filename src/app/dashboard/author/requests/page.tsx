'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, ArrowLeft, Book, CheckCircle, XCircle, 
  Clock, Mail, Phone, MapPin, MessageSquare, DollarSign,
  Calendar, Filter
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface HardCopyRequest {
  id: string;
  book: {
    id: string;
    title: string;
    coverImage: string | null;
  };
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  deliveryAddress: string;
  city: string;
  country: string;
  postalCode: string | null;
  quantity: number;
  message: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  authorResponse: string | null;
  estimatedPrice: number | null;
  estimatedDelivery: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export default function HardCopyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HardCopyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined' | 'completed'>('all');
  const [selectedRequest, setSelectedRequest] = useState<HardCopyRequest | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseForm, setResponseForm] = useState({
    status: 'ACCEPTED' as 'ACCEPTED' | 'DECLINED',
    authorResponse: '',
    estimatedPrice: '',
    estimatedDelivery: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        'https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/hard-copy-requests',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to fetch requests (${response.status})`);
      }

      const result: any = await response.json();
      setRequests(result.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = (request: HardCopyRequest) => {
    setSelectedRequest(request);
    setResponseForm({
      status: 'ACCEPTED',
      authorResponse: request.authorResponse || '',
      estimatedPrice: request.estimatedPrice?.toString() || '',
      estimatedDelivery: request.estimatedDelivery || '',
    });
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) return;

      const response = await fetch(
        `https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/hard-copy-requests/${selectedRequest.id}/respond`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: responseForm.status,
            authorResponse: responseForm.authorResponse,
            estimatedPrice: responseForm.estimatedPrice ? parseFloat(responseForm.estimatedPrice) : null,
            estimatedDelivery: responseForm.estimatedDelivery || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      setShowResponseModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('Failed to submit response. Please try again.');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return req.status === 'PENDING';
    if (filter === 'accepted') return req.status === 'ACCEPTED';
    if (filter === 'declined') return req.status === 'DECLINED';
    if (filter === 'completed') return req.status === 'COMPLETED';
    return true;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-cream p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/author"
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-neutral-brown-700" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-brown-900 flex items-center gap-3">
                <Package size={32} className="text-primary" />
                Hard Copy Requests
              </h1>
              <p className="text-neutral-brown-600 mt-1">Manage physical book requests from readers</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-brown-600">Total Requests</p>
              <Package size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-brown-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-brown-600">Pending</p>
              <Clock size={20} className="text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-brown-600">Accepted</p>
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-brown-600">Completed</p>
              <CheckCircle size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-neutral-brown-600" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'accepted'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
              }`}
            >
              Accepted ({stats.accepted})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
              {error}
            </div>
          )}

          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <Package size={48} className="text-neutral-brown-300 mx-auto mb-4" />
              <p className="text-neutral-brown-600 mb-2">No requests found</p>
              <p className="text-sm text-neutral-brown-500">
                {filter === 'all' 
                  ? 'You haven\'t received any hard copy requests yet'
                  : `No ${filter} requests at the moment`
                }
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    {request.book.coverImage ? (
                      <img
                        src={request.book.coverImage}
                        alt={request.book.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-32 bg-neutral-cream rounded-lg flex items-center justify-center">
                        <Book size={32} className="text-neutral-brown-400" />
                      </div>
                    )}
                  </div>

                  {/* Request Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-brown-900 mb-1">
                          {request.book.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-brown-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                          <span>Quantity: {request.quantity}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : request.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'DECLINED'
                            ? 'bg-red-100 text-red-700'
                            : request.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-brown-900 mb-2">Requester Info:</p>
                        <div className="space-y-1 text-sm text-neutral-brown-600">
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            {request.requesterName}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            {request.requesterEmail}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone size={14} />
                            {request.requesterPhone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-neutral-brown-900 mb-2">Delivery Address:</p>
                        <div className="space-y-1 text-sm text-neutral-brown-600">
                          <p className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                            <span>
                              {request.deliveryAddress}<br />
                              {request.city}, {request.country}
                              {request.postalCode && ` ${request.postalCode}`}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {request.message && (
                      <div className="bg-neutral-cream rounded-lg p-3 mb-4">
                        <p className="text-sm font-semibold text-neutral-brown-900 mb-1 flex items-center gap-2">
                          <MessageSquare size={14} />
                          Message:
                        </p>
                        <p className="text-sm text-neutral-brown-700">{request.message}</p>
                      </div>
                    )}

                    {request.authorResponse && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
                        <p className="text-sm font-semibold text-primary mb-1">Your Response:</p>
                        <p className="text-sm text-neutral-brown-700 mb-2">{request.authorResponse}</p>
                        {request.estimatedPrice && (
                          <p className="text-sm text-neutral-brown-600 flex items-center gap-2">
                            <DollarSign size={14} />
                            Estimated Price: KES {request.estimatedPrice.toLocaleString()}
                          </p>
                        )}
                        {request.estimatedDelivery && (
                          <p className="text-sm text-neutral-brown-600 flex items-center gap-2">
                            <Calendar size={14} />
                            Estimated Delivery: {request.estimatedDelivery}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {request.status === 'PENDING' && (
                        <button
                          onClick={() => handleRespond(request)}
                          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Respond to Request
                        </button>
                      )}
                      {request.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleRespond(request)}
                          className="bg-white hover:bg-neutral-cream text-primary border-2 border-primary px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Update Response
                        </button>
                      )}
                      <a
                        href={`mailto:${request.requesterEmail}`}
                        className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1"
                      >
                        <Mail size={16} />
                        Email Requester
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-neutral-brown-900 mb-4">
              Respond to Request
            </h2>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                  Response
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setResponseForm({ ...responseForm, status: 'ACCEPTED' })}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      responseForm.status === 'ACCEPTED'
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
                    }`}
                  >
                    <CheckCircle size={20} className="inline mr-2" />
                    Accept Request
                  </button>
                  <button
                    onClick={() => setResponseForm({ ...responseForm, status: 'DECLINED' })}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      responseForm.status === 'DECLINED'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-cream text-neutral-brown-700 hover:bg-neutral-brown-100'
                    }`}
                  >
                    <XCircle size={20} className="inline mr-2" />
                    Decline Request
                  </button>
                </div>
              </div>

              {/* Response Message */}
              <div>
                <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                  Message to Requester
                </label>
                <textarea
                  value={responseForm.authorResponse}
                  onChange={(e) => setResponseForm({ ...responseForm, authorResponse: e.target.value })}
                  placeholder={
                    responseForm.status === 'ACCEPTED'
                      ? 'Provide details about pricing, delivery, and next steps...'
                      : 'Explain why you cannot fulfill this request...'
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {responseForm.status === 'ACCEPTED' && (
                <>
                  {/* Estimated Price */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                      Estimated Price (KES)
                    </label>
                    <input
                      type="number"
                      value={responseForm.estimatedPrice}
                      onChange={(e) => setResponseForm({ ...responseForm, estimatedPrice: e.target.value })}
                      placeholder="e.g., 1500"
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Estimated Delivery */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                      Estimated Delivery Time
                    </label>
                    <input
                      type="text"
                      value={responseForm.estimatedDelivery}
                      onChange={(e) => setResponseForm({ ...responseForm, estimatedDelivery: e.target.value })}
                      placeholder="e.g., 5-7 business days"
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={submitResponse}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Submit Response
                </button>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-neutral-cream hover:bg-neutral-brown-100 text-neutral-brown-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
