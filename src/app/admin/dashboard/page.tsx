'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getPendingAuthors, approveAuthor, rejectAuthor, PendingAuthor } from '@/lib/api/admin';
import { Check, X, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [authors, setAuthors] = useState<PendingAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/dashboard/author');
                return;
            }
            loadAuthors();
        }
    }, [user, authLoading, router]);

    const loadAuthors = async () => {
        try {
            setLoading(true);
            const data = await getPendingAuthors();
            setAuthors(data.authors);
        } catch (error) {
            console.error('Failed to load authors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (authorId: string) => {
        if (confirm('Are you sure you want to approve this author?')) {
            try {
                await approveAuthor(authorId);
                setAuthors(authors.filter(a => a.id !== authorId));
            } catch (error) {
                alert('Failed to approve author');
            }
        }
    };

    const handleReject = async (authorId: string) => {
        if (confirm('Are you sure you want to REJECT this author?')) {
            try {
                await rejectAuthor(authorId);
                setAuthors(authors.filter(a => a.id !== authorId));
            } catch (error) {
                alert('Failed to reject author');
            }
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen bg-neutral-cream flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-cream p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-brown-900">Admin Dashboard</h1>
                    <p className="text-neutral-brown-600">Manage author applications and content.</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-brown-100">
                        <h2 className="text-xl font-bold text-neutral-brown-900 flex items-center gap-2">
                            Pending Author Applications
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{authors.length}</span>
                        </h2>
                    </div>

                    {authors.length === 0 ? (
                        <div className="p-12 text-center text-neutral-brown-500">
                            No pending applications found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-cream text-neutral-brown-600 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Applied Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-brown-100">
                                    {authors.map((author) => (
                                        <tr key={author.id} className="hover:bg-neutral-cream/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {author.image ? (
                                                        <img src={author.image} alt={author.name || ''} className="w-10 h-10 rounded-full" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-neutral-brown-200 rounded-full flex items-center justify-center">
                                                            <User size={20} className="text-neutral-brown-500" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-neutral-brown-900">{author.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-brown-700">{author.email}</td>
                                            <td className="px-6 py-4 text-neutral-brown-600 text-sm">
                                                {new Date(author.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(author.id)}
                                                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(author.id)}
                                                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
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
            </div>
        </div>
    );
}
