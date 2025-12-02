import { DollarSign, Book, ShoppingCart, TrendingUp, Plus, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// This would come from API/database
const stats = {
    totalEarnings: 145250,
    earningsTrend: 12,
    booksPublished: 8,
    totalSales: 342,
    salesTrend: 8,
    pendingPayouts: 25000,
};

const recentSales = [
    {
        id: '1',
        book: 'Kalenjin Folklore Tales',
        customer: 'John Doe',
        amount: 500,
        date: '2024-12-02T10:30:00',
    },
    {
        id: '2',
        book: 'Traditional Wisdom',
        customer: 'Jane Smith',
        amount: 750,
        date: '2024-12-02T09:15:00',
    },
    {
        id: '3',
        book: 'Cultural Heritage',
        customer: 'Mike Johnson',
        amount: 600,
        date: '2024-12-01T16:45:00',
    },
];

const topBooks = [
    { title: 'Kalenjin Folklore Tales', sales: 125, earnings: 56250 },
    { title: 'Traditional Wisdom', sales: 98, earnings: 44100 },
    { title: 'Cultural Heritage', sales: 76, earnings: 34200 },
];

const mockupImages = [
    { id: '1', src: '/mockup-1.png', alt: 'Book Mockup 1' },
    { id: '2', src: '/mockup-2.png', alt: 'Book Mockup 2' },
    { id: '3', src: '/mockup-3.png', alt: 'Book Mockup 3' },
];

export default function AuthorDashboardPage() {
    return (
        <div className="p-8">
            {/* UI Mockup Reference */}
            <details className="mb-6 bg-white rounded-xl p-4 shadow-sm border-l-4 border-accent-gold">
                <summary className="cursor-pointer font-semibold text-neutral-brown-900 flex items-center gap-2">
                    <ImageIcon size={20} className="text-accent-gold" />
                    View UI Design Mockup
                </summary>
                <div className="mt-4 border-t border-neutral-brown-500/10 pt-4">
                    <p className="text-sm text-neutral-brown-700 mb-3">
                        Reference design for this dashboard page:
                    </p>
                    <Image
                        src="/mockups/afrireads_author_dashboard_1764672335838.png"
                        alt="Author Dashboard Mockup"
                        width={1200}
                        height={800}
                        className="rounded-lg border border-neutral-brown-500/20"
                    />
                </div>
            </details>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-brown-900">Dashboard</h1>
                    <p className="text-neutral-brown-700 mt-1">
                        Welcome back! Here's your overview
                    </p>
                </div>
                <Link
                    href="/dashboard/author/books/new"
                    className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Upload New Book
                </Link>
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
                            +{stats.earningsTrend}%
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
                            +{stats.salesTrend}%
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sales */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-neutral-brown-900">Recent Sales</h2>
                        <Link
                            href="/dashboard/author/analytics"
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentSales.map((sale) => (
                            <div
                                key={sale.id}
                                className="flex items-center justify-between p-4 bg-neutral-cream rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-neutral-brown-900">{sale.book}</p>
                                    <p className="text-sm text-neutral-brown-700">{sale.customer}</p>
                                    <p className="text-xs text-neutral-brown-700 mt-1">
                                        {new Date(sale.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">KES {sale.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Books */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-neutral-brown-900">
                            Top Performing Books
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {topBooks.map((book, index) => (
                            <div key={book.title} className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-brown-900">{book.title}</p>
                                    <p className="text-sm text-neutral-brown-700">{book.sales} sales</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-accent-green">
                                        KES {book.earnings.toLocaleString()}
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
