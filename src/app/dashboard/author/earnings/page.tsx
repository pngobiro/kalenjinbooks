'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, ShoppingCart, Clock, 
  Calendar, Download, Eye, Book, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';

interface EarningsData {
  totalEarnings: number;
  pendingPayout: number;
  lastPayoutAmount: number;
  lastPayoutDate: string | null;
  totalSales: number;
  thisMonthEarnings: number;
  booksSold: number;
}

interface Sale {
  id: string;
  bookTitle: string;
  amount: number;
  platformFee: number;
  authorEarning: number;
  purchasedAt: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  method: string;
  reference: string | null;
  createdAt: string;
  paidAt: string | null;
}

export default function AuthorEarningsPage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        'https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/earnings',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch earnings data');
      }

      const result = await response.json() as {
        data: {
          earnings: EarningsData;
          sales: Sale[];
          payouts: Payout[];
        }
      };
      const data = result.data;
      
      setEarnings(data.earnings);
      setSales(data.sales);
      setPayouts(data.payouts);
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load earnings data');
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
            onClick={fetchEarningsData}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!earnings) return null;

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
              <h1 className="text-3xl font-bold text-neutral-brown-900">Earnings & Payouts</h1>
              <p className="text-neutral-brown-600 mt-1">Track your sales and earnings</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-brown-200 rounded-lg hover:bg-white">
            <Download size={18} />
            Download Report
          </button>
        </div>

        {/* Author Profile */}
        <div className="mb-6">
          <AuthorProfileHeader variant="compact" showEmail={false} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {earnings.totalEarnings.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Earnings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {earnings.pendingPayout.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Pending Payout</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {earnings.thisMonthEarnings.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">This Month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{earnings.booksSold}</h3>
            <p className="text-neutral-brown-600 text-sm">Books Sold</p>
          </div>
        </div>

        {/* Last Payout Info */}
        {earnings.lastPayoutDate && (
          <div className="bg-gradient-to-r from-primary/10 to-accent-green/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-brown-600 text-sm mb-1">Last Payout</p>
                <p className="text-2xl font-bold text-neutral-brown-900">KES {earnings.lastPayoutAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-brown-600 text-sm mb-1">Date</p>
                <p className="font-medium text-neutral-brown-900">
                  {new Date(earnings.lastPayoutDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sales History */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6 border-b border-neutral-brown-100">
            <h3 className="text-lg font-bold text-neutral-brown-900">Recent Sales</h3>
          </div>
          <div className="p-6">
            {sales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Book</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Sale Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Platform Fee</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Your Earning</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-brown-100">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-neutral-cream/50">
                        <td className="px-4 py-4">
                          <p className="font-medium text-neutral-brown-900">{sale.bookTitle}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-neutral-brown-900">KES {sale.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-neutral-brown-600">KES {sale.platformFee.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-green-600">KES {sale.authorEarning.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-neutral-brown-600">
                            {new Date(sale.purchasedAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="text-neutral-brown-300 mx-auto mb-4" />
                <p className="text-neutral-brown-600 mb-2">No sales yet</p>
                <p className="text-sm text-neutral-brown-500">Your sales will appear here once customers purchase your books</p>
              </div>
            )}
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-neutral-brown-100">
            <h3 className="text-lg font-bold text-neutral-brown-900">Payout History</h3>
          </div>
          <div className="p-6">
            {payouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Method</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Reference</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Requested</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-brown-100">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-neutral-cream/50">
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
            ) : (
              <div className="text-center py-12">
                <Calendar size={48} className="text-neutral-brown-300 mx-auto mb-4" />
                <p className="text-neutral-brown-600 mb-2">No payouts yet</p>
                <p className="text-sm text-neutral-brown-500">Payout history will appear here once processed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
