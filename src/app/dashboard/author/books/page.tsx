import { Edit, Trash2, Eye, MoreVertical, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - would come from API
const books = [
    {
        id: '1',
        title: 'Kalenjin Folklore Tales',
        coverImage: '/mockups/afrireads_landing_page_1764672267589.png',
        price: 500,
        sales: 125,
        earnings: 56250,
        status: 'published',
        publishedAt: '2024-01-15',
    },
    {
        id: '2',
        title: 'Traditional Wisdom',
        coverImage: '/mockups/afrireads_landing_page_1764672267589.png',
        price: 750,
        sales: 98,
        earnings: 44100,
        status: 'published',
        publishedAt: '2024-03-20',
    },
    {
        id: '3',
        title: 'Cultural Heritage',
        coverImage: '/mockups/afrireads_landing_page_1764672267589.png',
        price: 600,
        sales: 76,
        earnings: 34200,
        status: 'published',
        publishedAt: '2024-05-10',
    },
    {
        id: '4',
        title: 'Modern Kalenjin Stories',
        coverImage: '/mockups/afrireads_landing_page_1764672267589.png',
        price: 450,
        sales: 0,
        earnings: 0,
        status: 'draft',
        publishedAt: null,
    },
];

export default function MyBooksPage() {
    return (
        <div className="p-8">
            {/* UI Mockup Reference */}
            <details className="mb-6 bg-white rounded-xl p-4 shadow-sm border-l-4 border-accent-gold">
                <summary className="cursor-pointer font-semibold text-neutral-brown-900 flex items-center gap-2">
                    <ImageIcon size={20} className="text-accent-gold" />
                    View UI Design Mockup (Books Catalog)
                </summary>
                <div className="mt-4 border-t border-neutral-brown-500/10 pt-4">
                    <p className="text-sm text-neutral-brown-700 mb-3">
                        Reference design for books catalog layout:
                    </p>
                    <Image
                        src="/mockups/afrireads_books_catalog_1764672292136.png"
                        alt="Books Catalog Mockup"
                        width={1200}
                        height={800}
                        className="rounded-lg border border-neutral-brown-500/20"
                    />
                </div>
            </details>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-brown-900">My Books</h1>
                    <p className="text-neutral-brown-700 mt-1">
                        Manage your published books and drafts
                    </p>
                </div>
                <Link
                    href="/dashboard/author/books/new"
                    className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all"
                >
                    Upload New Book
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-neutral-brown-700">Total Books</p>
                    <p className="text-2xl font-bold text-neutral-brown-900">{books.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-neutral-brown-700">Published</p>
                    <p className="text-2xl font-bold text-accent-green">
                        {books.filter((b) => b.status === 'published').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-neutral-brown-700">Total Sales</p>
                    <p className="text-2xl font-bold text-primary">
                        {books.reduce((sum, b) => sum + b.sales, 0)}
                    </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-neutral-brown-700">Total Earnings</p>
                    <p className="text-2xl font-bold text-accent-green">
                        KES {books.reduce((sum, b) => sum + b.earnings, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-cream border-b-2 border-neutral-brown-500/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Book
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Price
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Sales
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Earnings
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-brown-500/10">
                        {books.map((book) => (
                            <tr key={book.id} className="hover:bg-neutral-cream/50 transition-colors">
                                {/* Book Info */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 bg-neutral-cream rounded overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-brown-900">{book.title}</p>
                                            {book.publishedAt && (
                                                <p className="text-xs text-neutral-brown-700">
                                                    Published {new Date(book.publishedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="px-6 py-4">
                                    <p className="font-medium text-neutral-brown-900">
                                        KES {book.price.toLocaleString()}
                                    </p>
                                </td>

                                {/* Sales */}
                                <td className="px-6 py-4">
                                    <p className="font-medium text-neutral-brown-900">{book.sales}</p>
                                </td>

                                {/* Earnings */}
                                <td className="px-6 py-4">
                                    <p className="font-bold text-accent-green">
                                        KES {book.earnings.toLocaleString()}
                                    </p>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    {book.status === 'published' ? (
                                        <span className="inline-block px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 bg-neutral-brown-500/20 text-neutral-brown-700 text-sm font-medium rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/books/${book.id}`}
                                            className="p-2 text-neutral-brown-700 hover:bg-neutral-brown-500/10 rounded transition-colors"
                                            title="View Book"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            href={`/dashboard/author/books/${book.id}/edit`}
                                            className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                                            title="Edit Book"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                                            title="Delete Book"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
