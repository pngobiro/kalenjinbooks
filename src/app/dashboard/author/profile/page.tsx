'use client';

import { User, Mail, Phone, MapPin, Calendar, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMyAuthorProfile, Author } from '@/lib/api/authors';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [author, setAuthor] = useState<Author | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await getMyAuthorProfile();
                if (response.success && response.data) {
                    setAuthor(response.data);
                } else {
                    setError(response.error || 'Failed to load profile');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error || !author) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md mx-auto">
                    <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
                    <p>{error || 'Author profile not found'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-sm font-semibold hover:underline"
                    >
                        Try again
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
                    <h1 className="text-3xl font-bold text-neutral-brown-900">Profile</h1>
                    <p className="text-neutral-brown-700 mt-1">
                        Manage your author profile and settings
                    </p>
                </div>
                <Link href="/dashboard/author/profile/edit" className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
                    <Edit size={20} />
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            {author.profileImage ? (
                                <img
                                    src={author.profileImage}
                                    alt={author.name || ''}
                                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary/20"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <User size={48} className="text-primary" />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-neutral-brown-900">{author.name || authUser?.name}</h2>
                            <p className="text-neutral-brown-700 mt-1">{authUser?.email}</p>
                            <div className="flex items-center gap-2 text-sm text-neutral-brown-700 mt-2">
                                <Calendar size={14} />
                                <span>Member of KaleeReads Author Community</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-neutral-brown-500/10 space-y-3">
                            {(author as any).phoneNumber && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={16} className="text-neutral-brown-700" />
                                    <span className="text-neutral-brown-900">{(author as any).phoneNumber}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-neutral-brown-700" />
                                <span className="text-neutral-brown-900">{authUser?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">About</h3>
                        <p className="text-neutral-brown-700 leading-relaxed">
                            {author.bio || "No biography provided yet. Tell your readers more about yourself!"}
                        </p>
                    </div>

                    {/* Author Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">
                            Author Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Books Published</p>
                                <p className="font-medium text-neutral-brown-900 text-2xl">{author.booksCount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Average Rating</p>
                                <p className="font-medium text-neutral-brown-900 text-2xl">{author.rating.toFixed(1)} / 5.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
