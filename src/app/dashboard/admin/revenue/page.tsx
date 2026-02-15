'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Users, Clock, 
  CheckCircle, AlertCircle, Download, Filter,
  ArrowUp, ArrowDown, Calendar, CreditCard
} from 'lucide-react';
import Link from 'next/link';

interface RevenueStats {
  totalRevenue: number;
  platformRevenue: number;
  authorEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  totalTransactions: number;
}

interface AuthorEarning {
  authorId: string;
  authorName: string;
  authorEmail: string;
  totalEarnings: number;
  pendingPayout: number;
  lastPayoutDate: string | null;
  booksSold: number;
}

interface Transaction {
  id: string;
  bookTitle: string;
  authorName: string;
  amount: number;
  platformFee: number;
  authorEarning: number;
  status: string;
  purchasedAt: string;
}

interface Payout {
  id: string;
  authorName: string;
  amount: number;
  status: string;
  method: string;
  reference: string | null;
  createdAt: string;
  paidAt: string | null;
}

export default function RevenuePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [authorEarnings, setAuthorEarnings] = useState<AuthorEarning[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        'https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/revenue',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }

      const result = await response.json() as { 
        data: {
          stats: RevenueStats;
          authorEarnings: AuthorEarning[];
          recentTransactions: Transaction[];
          recentPayouts: Payout[];
        }
      };
      const data = result.data;
      
      setStats(data.stats);
      setAuthorEarnings(data.authorEarnings);
      setTransactions(data.recentTransactions);
      setPayouts(data.recentPayouts);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load revenue data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRevenueData}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-neutral-cream p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900">Revenue Management</h1>
            <p className="text-neutral-brown-600 mt-1">Track earnings, payouts, and transactions</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50">
              <Download size={18} />
              Export Report
            </button>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {stats.platformRevenue.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Platform Revenue</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {stats.authorEarnings.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Author Earnings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {stats.pendingPayouts.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Pending Payouts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-neutral-brown-100">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-brown-600 hover:text-neutral-brown-900'
                }`}
              >
                Author Earnings
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-brown-600 hover:text-neutral-brown-900'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('payouts')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'payouts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-brown-600 hover:text-neutral-brown-900'
                }`}
              >
                Payouts
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Author Earnings Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-brown-900">Author Earnings Overview</h3>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Total Earnings</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Pending Payout</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Books Sold</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Last Payout</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-brown-100">
                      {authorEarnings.map((author) => (
                        <tr key={author.authorId} className="hover:bg-neutral-cream/50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-neutral-brown-900">{author.authorName}</p>
                              <p className="text-sm text-neutral-brown-600">{author.authorEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-neutral-brown-900">KES {author.totalEarnings.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-yellow-600">KES {author.pendingPayout.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-neutral-brown-900">{author.booksSold}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-neutral-brown-600">
                              {author.lastPayoutDate 
                                ? new Date(author.lastPayoutDate).toLocaleDateString()
                                : 'Never'}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            {author.pendingPayout > 0 && (
                              <button className="text-primary hover:text-primary-dark font-medium text-sm">
                                Process Payout
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-brown-900">Recent Transactions</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Book</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Platform Fee</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Author Earning</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-brown-100">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-neutral-cream/50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-neutral-brown-900">{transaction.bookTitle}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-neutral-brown-900">{transaction.authorName}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-neutral-brown-900">KES {transaction.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-neutral-brown-600">KES {transaction.platformFee.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-green-600 font-medium">KES {transaction.authorEarning.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-700'
                                : transaction.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-neutral-brown-600">
                              {new Date(transaction.purchasedAt).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-brown-900">Payout History</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    New Payout
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Method</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Reference</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Created</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-brown-100">
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-neutral-cream/50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-neutral-brown-900">{payout.authorName}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-neutral-brown-900">KES {payout.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-neutral-brown-900 capitalize">{payout.method}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-neutral-brown-600">{payout.reference || '-'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              payout.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-700'
                                : payout.status === 'PROCESSING'
                                ? 'bg-blue-100 text-blue-700'
                                : payout.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-neutral-brown-600">
                              {new Date(payout.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-neutral-brown-600">
                              {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : '-'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
