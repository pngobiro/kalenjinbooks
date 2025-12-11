'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Book, TrendingUp, TrendingDown, DollarSign, 
  ShoppingCart, Eye, Users, Calendar, Download, Filter,
  ChevronDown, BarChart3
} from 'lucide-react';

// Mock analytics data - in production this comes from API
const overviewStats = {
  totalRevenue: 245750,
  revenueTrend: 18.5,
  totalSales: 487,
  salesTrend: 12.3,
  totalViews: 15420,
  viewsTrend: 25.8,
  conversionRate: 3.16,
  conversionTrend: -2.1,
};

const revenueByMonth = [
  { month: 'Jul', revenue: 18500, sales: 42 },
  { month: 'Aug', revenue: 22300, sales: 51 },
  { month: 'Sep', revenue: 19800, sales: 45 },
  { month: 'Oct', revenue: 28400, sales: 63 },
  { month: 'Nov', revenue: 35200, sales: 78 },
  { month: 'Dec', revenue: 42100, sales: 92 },
];

const bookPerformance = [
  { 
    id: '1', 
    title: 'Immortal Knowledge', 
    cover: '/books/immortalknowledge.jpg',
    sales: 156, 
    revenue: 187200, 
    views: 4520,
    rating: 4.9,
    trend: 15.2 
  },
  { 
    id: '2', 
    title: 'Kalenjin Folklore Tales', 
    cover: '/books/folklore-tales.png',
    sales: 125, 
    revenue: 62500, 
    views: 3890,
    rating: 4.5,
    trend: 8.7 
  },
  { 
    id: '3', 
    title: 'Traditional Wisdom', 
    cover: '/books/traditional-wisdom.png',
    sales: 98, 
    revenue: 73500, 
    views: 2840,
    rating: 4.8,
    trend: -3.2 
  },
  { 
    id: '4', 
    title: 'Children Stories', 
    cover: '/books/children-stories.png',
    sales: 108, 
    revenue: 43200, 
    views: 4170,
    rating: 4.7,
    trend: 22.5 
  },
];

const recentTransactions = [
  { id: '1', book: 'Immortal Knowledge', customer: 'John M.', amount: 1200, type: 'purchase', date: '2024-12-11T10:30:00' },
  { id: '2', book: 'Children Stories', customer: 'Sarah K.', amount: 50, type: 'rental', date: '2024-12-11T09:15:00' },
  { id: '3', book: 'Kalenjin Folklore Tales', customer: 'Mike O.', amount: 500, type: 'purchase', date: '2024-12-10T16:45:00' },
  { id: '4', book: 'Traditional Wisdom', customer: 'Jane W.', amount: 90, type: 'rental', date: '2024-12-10T14:20:00' },
  { id: '5', book: 'Immortal Knowledge', customer: 'Peter N.', amount: 1200, type: 'purchase', date: '2024-12-10T11:00:00' },
  { id: '6', book: 'Children Stories', customer: 'Lucy A.', amount: 400, type: 'purchase', date: '2024-12-09T15:30:00' },
];

const topCountries = [
  { country: 'Kenya', flag: '🇰🇪', sales: 312, percentage: 64 },
  { country: 'United States', flag: '🇺🇸', sales: 89, percentage: 18 },
  { country: 'United Kingdom', flag: '🇬🇧', sales: 45, percentage: 9 },
  { country: 'Tanzania', flag: '🇹🇿', sales: 28, percentage: 6 },
  { country: 'Other', flag: '🌍', sales: 13, percentage: 3 },
];

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';

export default function AuthorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customLabel, setCustomLabel] = useState('');

  const timeRangeLabels: Record<TimeRange, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '1y': 'Last year',
    'all': 'All time',
    'custom': customLabel || 'Custom Range',
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setCustomLabel(`${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
      setTimeRange('custom');
      setShowCustomPicker(false);
      setShowTimeDropdown(false);
    }
  };

  const maxRevenue = Math.max(...revenueByMonth.map(m => m.revenue));

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard/author" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <Link href="/dashboard/author" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">Analytics</h1>
            <p className="text-neutral-brown-600 mt-1">Track your book performance and sales</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="flex items-center gap-2 bg-white border border-neutral-brown-200 px-4 py-2.5 rounded-lg hover:border-primary transition-colors"
              >
                <Calendar size={18} className="text-neutral-brown-500" />
                <span className="font-medium">{timeRangeLabels[timeRange]}</span>
                <ChevronDown size={18} className="text-neutral-brown-400" />
              </button>
              
              {showTimeDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-neutral-brown-100 py-2 z-10">
                  {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setShowTimeDropdown(false);
                        setShowCustomPicker(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-neutral-cream transition-colors ${
                        timeRange === range ? 'text-primary font-medium' : 'text-neutral-brown-700'
                      }`}
                    >
                      {timeRangeLabels[range]}
                    </button>
                  ))}
                  
                  <div className="border-t border-neutral-brown-100 my-2" />
                  
                  <button
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    className={`w-full text-left px-4 py-2 hover:bg-neutral-cream transition-colors flex items-center justify-between ${
                      timeRange === 'custom' ? 'text-primary font-medium' : 'text-neutral-brown-700'
                    }`}
                  >
                    <span>Custom Range</span>
                    <ChevronDown size={16} className={`transition-transform ${showCustomPicker ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCustomPicker && (
                    <div className="px-4 py-3 bg-neutral-cream/50">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-brown-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-brown-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <button
                          onClick={handleCustomDateApply}
                          disabled={!startDate || !endDate}
                          className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply Range
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-primary" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${overviewStats.revenueTrend >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                {overviewStats.revenueTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(overviewStats.revenueTrend)}%
              </div>
            </div>
            <p className="text-sm text-neutral-brown-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-neutral-brown-900">KES {overviewStats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-accent-green" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${overviewStats.salesTrend >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                {overviewStats.salesTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(overviewStats.salesTrend)}%
              </div>
            </div>
            <p className="text-sm text-neutral-brown-600 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-neutral-brown-900">{overviewStats.totalSales}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${overviewStats.viewsTrend >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                {overviewStats.viewsTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(overviewStats.viewsTrend)}%
              </div>
            </div>
            <p className="text-sm text-neutral-brown-600 mb-1">Page Views</p>
            <p className="text-2xl font-bold text-neutral-brown-900">{overviewStats.totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-gold/10 rounded-lg flex items-center justify-center">
                <Users className="text-accent-gold" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${overviewStats.conversionTrend >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                {overviewStats.conversionTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(overviewStats.conversionTrend)}%
              </div>
            </div>
            <p className="text-sm text-neutral-brown-600 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-neutral-brown-900">{overviewStats.conversionRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-brown-900">Revenue Overview</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-neutral-brown-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                  <span className="text-neutral-brown-600">Sales</span>
                </div>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-48">
              {revenueByMonth.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden"
                      style={{ height: `${(month.revenue / maxRevenue) * 160}px` }}
                    >
                      <div 
                        className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all"
                        style={{ height: '100%' }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-neutral-brown-500 font-medium">{month.month}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-brown-100 flex justify-between text-sm">
              <div>
                <span className="text-neutral-brown-500">Avg. Monthly Revenue:</span>
                <span className="font-bold text-neutral-brown-900 ml-2">
                  KES {Math.round(revenueByMonth.reduce((a, b) => a + b.revenue, 0) / revenueByMonth.length).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-brown-500">Total Sales:</span>
                <span className="font-bold text-neutral-brown-900 ml-2">
                  {revenueByMonth.reduce((a, b) => a + b.sales, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-brown-900 mb-6">Sales by Country</h2>
            <div className="space-y-4">
              {topCountries.map((country) => (
                <div key={country.country}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium text-neutral-brown-900">{country.country}</span>
                    </div>
                    <span className="text-sm text-neutral-brown-600">{country.sales} sales</span>
                  </div>
                  <div className="w-full bg-neutral-brown-100 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Book Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-brown-900">Book Performance</h2>
            <button className="flex items-center gap-2 text-neutral-brown-600 hover:text-primary transition-colors">
              <Filter size={18} />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-brown-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-brown-600">Book</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-brown-600">Sales</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-brown-600">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-brown-600">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-brown-600">Rating</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-brown-600">Trend</th>
                </tr>
              </thead>
              <tbody>
                {bookPerformance.map((book) => (
                  <tr key={book.id} className="border-b border-neutral-brown-50 hover:bg-neutral-cream/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-brown-100 flex-shrink-0">
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-neutral-brown-900">{book.title}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-medium text-neutral-brown-900">{book.sales}</td>
                    <td className="text-right py-4 px-4 font-bold text-primary">KES {book.revenue.toLocaleString()}</td>
                    <td className="text-right py-4 px-4 text-neutral-brown-600">{book.views.toLocaleString()}</td>
                    <td className="text-right py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-accent-gold">
                        ⭐ {book.rating}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${book.trend >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                        {book.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(book.trend)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-brown-900">Recent Transactions</h2>
            <Link href="/dashboard/author/transactions" className="text-primary hover:text-primary-dark text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-neutral-cream rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'purchase' ? 'bg-accent-green/10' : 'bg-blue-100'
                  }`}>
                    {tx.type === 'purchase' ? (
                      <ShoppingCart size={18} className="text-accent-green" />
                    ) : (
                      <Eye size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-brown-900">{tx.book}</p>
                    <p className="text-sm text-neutral-brown-500">{tx.customer} • {tx.type === 'purchase' ? 'Purchase' : 'Rental'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">+KES {tx.amount}</p>
                  <p className="text-xs text-neutral-brown-500">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
