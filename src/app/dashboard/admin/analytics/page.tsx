'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Eye, MousePointer, ShoppingCart, Users, 
  Calendar, ArrowUp, ArrowDown, Book, DollarSign 
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface DailyStat {
  date: string;
  totalViews: number;
  totalClicks: number;
  totalPurchases: number;
  totalRevenue: number;
  uniqueVisitors: number;
  newUsers: number;
}

interface BookAnalytics {
  bookId: string;
  views: number;
  clicks: number;
  purchases: number;
  revenue: number;
  book: {
    id: string;
    title: string;
    coverImage: string | null;
    price?: number;
    author: {
      user: {
        name: string | null;
      };
    };
  };
}

interface AnalyticsData {
  dailyStats: DailyStat[];
  topBooksByViews: BookAnalytics[];
  topBooksByPurchases: BookAnalytics[];
  totals: {
    totalViews: number;
    totalClicks: number;
    totalPurchases: number;
    totalRevenue: number;
    newUsers: number;
  };
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

const COLORS = ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460'];

export default function AnalyticsPage() {
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
        `https://kalenjin-books-worker.pngobiro.workers.dev/api/analytics/dashboard?days=${period}`,
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

  const { dailyStats, topBooksByViews, topBooksByPurchases, totals } = data;

  // Calculate trends (compare last 7 days vs previous 7 days)
  const last7Days = dailyStats.slice(-7);
  const previous7Days = dailyStats.slice(-14, -7);
  
  const last7Total = last7Days.reduce((sum, day) => sum + day.totalViews, 0);
  const prev7Total = previous7Days.reduce((sum, day) => sum + day.totalViews, 0);
  const viewsTrend = prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total) * 100 : 0;

  return (
    <div className="min-h-screen bg-neutral-cream p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900">Analytics Dashboard</h1>
            <p className="text-neutral-brown-600 mt-1">Track your platform performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${viewsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {viewsTrend >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(viewsTrend).toFixed(1)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{totals.totalViews.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Views</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MousePointer className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{totals.totalClicks.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Clicks</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">{totals.totalPurchases.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Purchases</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-accent-gold" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-brown-900">KES {totals.totalRevenue.toLocaleString()}</h3>
            <p className="text-neutral-brown-600 text-sm">Total Revenue</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Views Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalViews" stroke="#8B4513" name="Views" />
                <Line type="monotone" dataKey="totalClicks" stroke="#D2691E" name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Purchases Over Time */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Purchases & Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalPurchases" fill="#10B981" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Books by Views */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Top Books by Views</h3>
            <div className="space-y-4">
              {topBooksByViews.slice(0, 5).map((book, index) => (
                <div key={book.bookId} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="w-12 h-16 bg-neutral-cream rounded overflow-hidden flex-shrink-0">
                    {book.book.coverImage ? (
                      <img src={book.book.coverImage} alt={book.book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-green/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-brown-900 truncate">{book.book.title}</p>
                    <p className="text-sm text-neutral-brown-600">{book.book.author.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-brown-900">{book.views.toLocaleString()}</p>
                    <p className="text-xs text-neutral-brown-600">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Books by Purchases */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Top Books by Purchases</h3>
            <div className="space-y-4">
              {topBooksByPurchases.slice(0, 5).map((book, index) => (
                <div key={book.bookId} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-accent-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-green font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="w-12 h-16 bg-neutral-cream rounded overflow-hidden flex-shrink-0">
                    {book.book.coverImage ? (
                      <img src={book.book.coverImage} alt={book.book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-green/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-brown-900 truncate">{book.book.title}</p>
                    <p className="text-sm text-neutral-brown-600">{book.book.author.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-brown-900">{book.purchases.toLocaleString()}</p>
                    <p className="text-xs text-neutral-brown-600">purchases</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
