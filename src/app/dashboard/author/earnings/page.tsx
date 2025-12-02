import { DollarSign, TrendingUp, Download, Calendar, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data
const earnings = {
    total: 145250,
    available: 25000,
    pending: 5000,
    paidOut: 115250,
    trend: 12,
};

const monthlyData = [
    { month: 'Jul', amount: 18500 },
    { month: 'Aug', amount: 22300 },
    { month: 'Sep', amount: 19800 },
    { month: 'Oct', amount: 25400 },
    { month: 'Nov', amount: 28200 },
    { month: 'Dec', amount: 31050 },
];

const transactions = [
    {
        id: '1',
        type: 'sale',
        book: 'Kalenjin Folklore Tales',
        customer: 'John Doe',
        amount: 450,
        platformFee: 50,
        netEarning: 400,
        date: '2024-12-02T10:30:00',
        status: 'completed',
    },
    {
        id: '2',
        type: 'payout',
        description: 'M-Pesa Payout',
        amount: -15000,
        date: '2024-12-01T14:20:00',
        status: 'completed',
    },
    {
        id: '3',
        type: 'sale',
        book: 'Traditional Wisdom',
        customer: 'Jane Smith',
        amount: 675,
        platformFee: 75,
        netEarning: 600,
        date: '2024-12-01T09:15:00',
        status: 'completed',
    },
];

export default function EarningsPage() {
    const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

    return (
        <div className="p-8">
            {/* UI Mockup Reference */}
            <details className="mb-6 bg-white rounded-xl p-4 shadow-sm border-l-4 border-accent-gold">
                <summary className="cursor-pointer font-semibold text-neutral-brown-900 flex items-center gap-2">
                    <ImageIcon size={20} className="text-accent-gold" />
                    View Payment UI Mockups
                </summary>
                <div className="mt-4 border-t border-neutral-brown-500/10 pt-4 space-y-4">
                    <div>
                        <p className="text-sm text-neutral-brown-700 mb-3">
                            Checkout page design:
                        </p>
                        <p className="text-xs text-neutral-brown-700 mb-2 italic">
                            See docs/PAYMENTS.md for detailed payment UI specifications
                        </p>
                    </div>
                </div>
            </details>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-brown-900">Earnings</h1>
                    <p className="text-neutral-brown-700 mt-1">
                        Track your sales and manage payouts
                    </p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
                    <Download size={20} />
                    Export Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-primary" size={20} />
                        <span className="text-sm text-neutral-brown-700">Total Earnings</span>
                    </div>
                    <p className="text-3xl font-bold text-neutral-brown-900">
                        KES {earnings.total.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-accent-green text-sm">
                        <TrendingUp size={14} />
                        <span>+{earnings.trend}% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-neutral-brown-700 mb-2">Available Balance</p>
                    <p className="text-3xl font-bold text-accent-green">
                        KES {earnings.available.toLocaleString()}
                    </p>
                    <Link
                        href="#request-payout"
                        className="text-sm text-primary hover:text-primary-dark font-medium mt-2 inline-block"
                    >
                        Request Payout →
                    </Link>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-neutral-brown-700 mb-2">Pending Payouts</p>
                    <p className="text-3xl font-bold text-primary">
                        KES {earnings.pending.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-neutral-brown-700 mb-2">Total Paid Out</p>
                    <p className="text-3xl font-bold text-neutral-brown-900">
                        KES {earnings.paidOut.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Monthly Earnings Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-brown-900">Monthly Earnings</h2>
                    <div className="flex items-center gap-2 text-sm text-neutral-brown-700">
                        <Calendar size={16} />
                        <span>Last 6 Months</span>
                    </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between gap-4 h-64">
                    {monthlyData.map((data) => {
                        const height = (data.amount / maxAmount) * 100;
                        return (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col justify-end h-full">
                                    <div
                                        className="w-full bg-primary rounded-t-lg hover:bg-primary-dark transition-all cursor-pointer relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-brown-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            KES {data.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-neutral-brown-700">
                                    {data.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Request Payout Section */}
            <div id="request-payout" className="bg-white rounded-xl p-6 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">
                    Request Payout
                </h2>
                <div className="flex items-center justify-between p-4 bg-neutral-cream rounded-lg">
                    <div>
                        <p className="text-sm text-neutral-brown-700 mb-1">Available for Payout</p>
                        <p className="text-2xl font-bold text-accent-green">
                            KES {earnings.available.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-brown-700 mt-1">
                            Minimum payout: KES 1,000
                        </p>
                    </div>
                    <button
                        disabled={earnings.available < 1000}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Request Payout
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-brown-500/10">
                    <h2 className="text-xl font-bold text-neutral-brown-900">
                        Transaction History
                    </h2>
                </div>

                <table className="w-full">
                    <thead className="bg-neutral-cream border-b-2 border-neutral-brown-500/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Description
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-brown-500/10">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-neutral-cream/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-neutral-brown-700">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {transaction.type === 'sale' ? (
                                        <span className="inline-block px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
                                            Sale
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                                            Payout
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-neutral-brown-900">
                                        {transaction.type === 'sale' ? transaction.book : transaction.description}
                                    </p>
                                    {transaction.type === 'sale' && (
                                        <p className="text-xs text-neutral-brown-700">
                                            Customer: {transaction.customer}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p
                                        className={`font-bold ${transaction.type === 'sale' ? 'text-accent-green' : 'text-error'
                                            }`}
                                    >
                                        {transaction.type === 'sale' ? '+' : ''}KES{' '}
                                        {Math.abs(transaction.amount).toLocaleString()}
                                    </p>
                                    {transaction.type === 'sale' && transaction.netEarning && (
                                        <p className="text-xs text-neutral-brown-700">
                                            Net: KES {transaction.netEarning.toLocaleString()}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
                                        {transaction.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
