'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, MousePointer, ShoppingCart, TrendingUp, 
  Book, ArrowLeft, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface BookAnalytics {
  bookId: string;
  bookTitle: string;
  views: number;
  clicks: number;
  previews: number;
  purchases: number;
  downloads: number;
  revenue: number;
  lastViewedAt: string | null;
}

interface DailyStats {
  date: string;
  views: number;
  clicks: number;
  purchases: number;
}

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalPurchases: number;
  totalRevenue: number;
  bookAnalytics: BookAnalytics[];
  dailyStats: DailyStats[];
}

export default function AuthorAnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        `https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/analytics?days=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
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
            onClick={fetchAnalytics}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

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
              <h1 className="text-3xl font-bold text-neutral-brown-900">Analytics</h1>
              <p className="text-neutral-brown-600 mt-1">Track your book performance</p>
            </div>
          </div>
          
          <select
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            className="px-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Author Profile */}
        <div className="mb-6">
          <AuthorProfileHeader variant="compact" showEmail={false} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{data.totalViews.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Views</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MousePointer className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{data.totalClicks.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Clicks</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{data.totalPurchases.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Purchases</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-accent-gold" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {data.totalRevenue.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Revenue</p>
          </div>
        </div>

        {/* Charts */}
        {data.dailyStats.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Views Over Time */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Views & Clicks Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#8B4513" name="Views" />
                  <Line type="monotone" dataKey="clicks" stroke="#D2691E" name="Clicks" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Purchases Over Time */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Purchases Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="purchases" fill="#10B981" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Book Performance */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-neutral-brown-100">
            <h3 className="text-lg font-bold text-neutral-brown-900">Book Performance</h3>
          </div>
          <div className="p-6">
            {data.bookAnalytics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Book</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Views</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Clicks</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Previews</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Purchases</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Revenue</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-brown-900">Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-brown-100">
                    {data.bookAnalytics.map((book) => (
                      <tr key={book.bookId} className="hover:bg-neutral-cream/50">
                        <td className="px-4 py-4">
                          <p className="font-medium text-neutral-brown-900">{book.bookTitle}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Eye size={16} className="text-blue-600" />
                            <span className="text-neutral-brown-900">{book.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <MousePointer size={16} className="text-purple-600" />
                            <span className="text-neutral-brown-900">{book.clicks.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-neutral-brown-900">{book.previews.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <ShoppingCart size={16} className="text-green-600" />
                            <span className="font-medium text-neutral-brown-900">{book.purchases.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-green-600">KES {book.revenue.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-neutral-brown-600">
                            {book.lastViewedAt 
                              ? new Date(book.lastViewedAt).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book size={48} className="text-neutral-brown-300 mx-auto mb-4" />
                <p className="text-neutral-brown-600 mb-2">No analytics data yet</p>
                <p className="text-sm text-neutral-brown-500">Analytics will appear once your books start getting views</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
