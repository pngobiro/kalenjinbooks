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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Books Published</p>
                                <p className="font-medium text-neutral-brown-900 text-2xl">{author.booksCount || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Average Rating</p>
                                <p className="font-medium text-neutral-brown-900 text-2xl">{author.rating ? author.rating.toFixed(1) : '0.0'} / 5.0</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Total Earnings</p>
                                <p className="font-medium text-neutral-brown-900 text-2xl">KES {(author as any).totalEarnings?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-brown-700 mb-1">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    (author as any).status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    (author as any).status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {(author as any).status || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    {((author as any).dateOfBirth || (author as any).nationality || (author as any).location || (author as any).occupation) && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(author as any).dateOfBirth && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1">Date of Birth</p>
                                        <p className="text-neutral-brown-900">{new Date((author as any).dateOfBirth).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {(author as any).nationality && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1">Nationality</p>
                                        <p className="text-neutral-brown-900">{(author as any).nationality}</p>
                                    </div>
                                )}
                                {(author as any).location && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1">Location</p>
                                        <p className="text-neutral-brown-900">{(author as any).location}</p>
                                    </div>
                                )}
                                {(author as any).occupation && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1">Occupation</p>
                                        <p className="text-neutral-brown-900">{(author as any).occupation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Professional Background */}
                    {((author as any).education || (author as any).writingExperience || (author as any).previousPublications || (author as any).awards) && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Professional Background</h3>
                            <div className="space-y-4">
                                {(author as any).education && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Education</p>
                                        <p className="text-neutral-brown-900">{(author as any).education}</p>
                                    </div>
                                )}
                                {(author as any).writingExperience && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Writing Experience</p>
                                        <p className="text-neutral-brown-900">{(author as any).writingExperience}</p>
                                    </div>
                                )}
                                {(author as any).previousPublications && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Previous Publications</p>
                                        <p className="text-neutral-brown-900">{(author as any).previousPublications}</p>
                                    </div>
                                )}
                                {(author as any).awards && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Awards & Recognition</p>
                                        <p className="text-neutral-brown-900">{(author as any).awards}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Writing Information */}
                    {((author as any).genres || (author as any).languages || (author as any).writingStyle || (author as any).inspirations) && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Writing Information</h3>
                            <div className="space-y-4">
                                {(author as any).genres && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-2 font-medium">Genres</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                try {
                                                    const genres = JSON.parse((author as any).genres);
                                                    return genres.length > 0 ? genres.map((genre: string, index: number) => (
                                                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                                            {genre}
                                                        </span>
                                                    )) : <span className="text-neutral-brown-500">Not specified</span>;
                                                } catch {
                                                    return <span className="text-neutral-brown-500">Not specified</span>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                                {(author as any).languages && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-2 font-medium">Languages</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                try {
                                                    const languages = JSON.parse((author as any).languages);
                                                    return languages.map((language: string, index: number) => (
                                                        <span key={index} className="bg-accent-green/10 text-accent-green px-3 py-1 rounded-full text-sm">
                                                            {language}
                                                        </span>
                                                    ));
                                                } catch {
                                                    return <span className="text-neutral-brown-500">Not specified</span>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                                {(author as any).writingStyle && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Writing Style</p>
                                        <p className="text-neutral-brown-900">{(author as any).writingStyle}</p>
                                    </div>
                                )}
                                {(author as any).inspirations && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Inspirations</p>
                                        <p className="text-neutral-brown-900">{(author as any).inspirations}</p>
                                    </div>
                                )}
                                {(author as any).targetAudience && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Target Audience</p>
                                        <p className="text-neutral-brown-900">{(author as any).targetAudience}</p>
                                    </div>
                                )}
                                {(author as any).publishingGoals && (
                                    <div>
                                        <p className="text-sm text-neutral-brown-700 mb-1 font-medium">Publishing Goals</p>
                                        <p className="text-neutral-brown-900">{(author as any).publishingGoals}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Social Media & Online Presence */}
                    {((author as any).website || (author as any).twitter || (author as any).facebook || (author as any).instagram || (author as any).linkedin) && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Social Media & Online Presence</h3>
                            <div className="space-y-3">
                                {(author as any).website && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-brown-700 w-20">Website:</span>
                                        <a href={(author as any).website} target="_blank" rel="noopener noreferrer" 
                                           className="text-primary hover:text-primary-dark transition-colors">
                                            {(author as any).website}
                                        </a>
                                    </div>
                                )}
                                {(author as any).twitter && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-brown-700 w-20">Twitter:</span>
                                        <a href={`https://twitter.com/${(author as any).twitter}`} target="_blank" rel="noopener noreferrer"
                                           className="text-primary hover:text-primary-dark transition-colors">
                                            @{(author as any).twitter}
                                        </a>
                                    </div>
                                )}
                                {(author as any).facebook && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-brown-700 w-20">Facebook:</span>
                                        <a href={`https://facebook.com/${(author as any).facebook}`} target="_blank" rel="noopener noreferrer"
                                           className="text-primary hover:text-primary-dark transition-colors">
                                            {(author as any).facebook}
                                        </a>
                                    </div>
                                )}
                                {(author as any).instagram && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-brown-700 w-20">Instagram:</span>
                                        <a href={`https://instagram.com/${(author as any).instagram}`} target="_blank" rel="noopener noreferrer"
                                           className="text-primary hover:text-primary-dark transition-colors">
                                            @{(author as any).instagram}
                                        </a>
                                    </div>
                                )}
                                {(author as any).linkedin && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-brown-700 w-20">LinkedIn:</span>
                                        <a href={`https://linkedin.com/in/${(author as any).linkedin}`} target="_blank" rel="noopener noreferrer"
                                           className="text-primary hover:text-primary-dark transition-colors">
                                            {(author as any).linkedin}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
