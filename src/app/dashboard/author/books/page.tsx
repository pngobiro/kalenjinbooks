'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, MoreVertical, Image as ImageIcon, Plus, Book, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface BookData {
    id: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    price: number;
    rentalPrice: number | null;
    category: string | null;
    language: string;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    // Sales data would come from separate API
    sales?: number;
    earnings?: number;
}

interface BookStats {
    totalBooks: number;
    publishedBooks: number;
    draftBooks: number;
    totalSales: number;
    totalEarnings: number;
}

export default function MyBooksPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [books, setBooks] = useState<BookData[]>([]);
    const [stats, setStats] = useState<BookStats>({
        totalBooks: 0,
        publishedBooks: 0,
        draftBooks: 0,
        totalSales: 0,
        totalEarnings: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch author's books
    useEffect(() => {
        async function fetchBooks() {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                setError(null);

                const token = localStorage.getItem('kaleereads_token');
                if (!token) {
                    setError('Authentication required');
                    return;
                }

                // Get author ID first
                const authorResponse = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!authorResponse.ok) {
                    throw new Error('Failed to get author profile');
                }

                const authorData: any = await authorResponse.json();
                const authorId = authorData.data?.id;

                if (!authorId) {
                    throw new Error('Author profile not found');
                }

                // Fetch books for this author
                const booksResponse = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books?authorId=${authorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!booksResponse.ok) {
                    throw new Error('Failed to fetch books');
                }

                const booksData: any = await booksResponse.json();
                const authorBooks = booksData.data || [];

                setBooks(authorBooks);

                // Calculate stats
                const publishedBooks = authorBooks.filter((book: BookData) => book.isPublished).length;
                const draftBooks = authorBooks.filter((book: BookData) => !book.isPublished).length;
                
                setStats({
                    totalBooks: authorBooks.length,
                    publishedBooks,
                    draftBooks,
                    totalSales: 0, // TODO: Get from sales API
                    totalEarnings: 0, // TODO: Get from sales API
                });

            } catch (err) {
                console.error('Error fetching books:', err);
                setError(err instanceof Error ? err.message : 'Failed to load books');
            } finally {
                setIsLoading(false);
            }
        }

        fetchBooks();
    }, [user?.id]);

    const handleDeleteBook = async (bookId: string) => {
        if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('kaleereads_token');
            if (!token) {
                alert('Authentication required');
                return;
            }

            const response = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete book');
            }

            // Remove book from local state
            setBooks(books.filter(book => book.id !== bookId));
            
            // Update stats
            const deletedBook = books.find(book => book.id === bookId);
            if (deletedBook) {
                setStats(prev => ({
                    ...prev,
                    totalBooks: prev.totalBooks - 1,
                    publishedBooks: deletedBook.isPublished ? prev.publishedBooks - 1 : prev.publishedBooks,
                    draftBooks: !deletedBook.isPublished ? prev.draftBooks - 1 : prev.draftBooks,
                }));
            }

            alert('Book deleted successfully');
        } catch (err) {
            console.error('Error deleting book:', err);
            alert('Failed to delete book');
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-medium mb-2">Error loading books</p>
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
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
                    className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Upload New Book
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Book size={16} className="text-primary" />
                        <p className="text-sm text-neutral-brown-700">Total Books</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-brown-900">{stats.totalBooks}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-accent-green" />
                        <p className="text-sm text-neutral-brown-700">Published</p>
                    </div>
                    <p className="text-2xl font-bold text-accent-green">{stats.publishedBooks}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Edit size={16} className="text-neutral-brown-500" />
                        <p className="text-sm text-neutral-brown-700">Drafts</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-brown-500">{stats.draftBooks}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-accent-gold">💰</span>
                        <p className="text-sm text-neutral-brown-700">Total Earnings</p>
                    </div>
                    <p className="text-2xl font-bold text-accent-green">
                        KES {stats.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-brown-500 mt-1">Coming soon</p>
                </div>
            </div>

            {/* Books List */}
            {books.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Book size={48} className="mx-auto text-neutral-brown-300 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">No books yet</h3>
                    <p className="text-neutral-brown-600 mb-6">
                        Start sharing your stories with the world by uploading your first book.
                    </p>
                    <Link
                        href="/dashboard/author/books/new"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all"
                    >
                        <Plus size={20} />
                        Upload Your First Book
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-cream border-b-2 border-neutral-brown-500/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                    Book
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
                                    Price
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
                                                {book.coverImage ? (
                                                    <img 
                                                        src={book.coverImage} 
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                                        <Book size={16} className="text-primary/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-brown-900">{book.title}</p>
                                                <p className="text-sm text-neutral-brown-600 line-clamp-1">
                                                    {book.description || 'No description'}
                                                </p>
                                                {book.publishedAt && (
                                                    <p className="text-xs text-neutral-brown-500">
                                                        Published {new Date(book.publishedAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                                            {book.category || 'Uncategorized'}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-neutral-brown-900">
                                                KES {book.price.toLocaleString()}
                                            </p>
                                            {book.rentalPrice && (
                                                <p className="text-xs text-neutral-brown-500">
                                                    Rental: KES {book.rentalPrice}/day
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        {book.isPublished ? (
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
                                                onClick={() => handleDeleteBook(book.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
            )}
        </div>
    );
}
