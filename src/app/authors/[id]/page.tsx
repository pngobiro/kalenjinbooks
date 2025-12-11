import { ArrowLeft, BookOpen, Star, Mail, MapPin, Calendar, User, Book } from 'lucide-react';
import Link from 'next/link';
import { fetchAuthorById, Author } from '@/lib/api/authors';

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    let author: Author | null = null;
    
    try {
        const response = await fetchAuthorById(id);
        author = response?.data || null;
    } catch (e) {
        console.error('Failed to fetch author:', e);
    }

    if (!author) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
                <div className="text-center">
                    <User size={64} className="text-neutral-brown-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2">Author Not Found</h1>
                    <Link href="/authors" className="text-primary hover:underline">
                        Back to Authors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href="/authors"
                        className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span>Back to Authors</span>
                    </Link>
                </div>

                {/* Author Header */}
                <div className="bg-white rounded-3xl shadow-lg border border-neutral-brown-500/10 overflow-hidden mb-12">
                    <div className="bg-gradient-to-r from-primary to-orange-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-16">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
                                {author.profileImage ? (
                                    <img
                                        src={author.profileImage}
                                        alt={author.name || 'Author'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={48} className="text-neutral-brown-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-2">{author.name || 'Unknown Author'}</h1>
                                <p className="text-xl text-primary font-medium mb-4">Author</p>
                                <div className="flex flex-wrap gap-6 text-sm text-neutral-brown-600">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} className="text-primary" />
                                        <span>{author.booksCount} Books Published</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-accent-gold fill-accent-gold" />
                                        <span>{author.rating?.toFixed(1) || '0.0'} Rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Biography */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-brown-500/10 p-8 mb-8">
                            <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6">About</h2>
                            <p className="text-neutral-brown-700 leading-relaxed mb-4">
                                {author.bio || 'No biography available.'}
                            </p>
                        </div>

                        {/* Published Books */}
                        {author.books && author.books.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-brown-500/10 p-8">
                                <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6">Published Books</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {author.books.map((book: any) => (
                                        <Link
                                            key={book.id}
                                            href={`/books/${book.id}`}
                                            className="group flex gap-4 p-4 rounded-xl hover:bg-neutral-cream transition-all border border-transparent hover:border-primary/20"
                                        >
                                            <div className="w-24 h-32 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
                                                {book.coverImage ? (
                                                    <img
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Book size={32} className="text-neutral-brown-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-neutral-brown-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                                    {book.title}
                                                </h3>
                                                <p className="text-primary font-bold text-lg">KES {book.price}</p>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <Star size={14} className="fill-accent-gold text-accent-gold" />
                                                    <span className="text-sm">{book.rating?.toFixed(1) || '0.0'}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-neutral-brown-900 text-white rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold font-heading mb-6">Author Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-brown-300">Total Books</span>
                                        <span className="text-2xl font-bold text-primary">{author.booksCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-brown-300">Average Rating</span>
                                        <span className="text-2xl font-bold text-accent-gold">{author.rating?.toFixed(1) || '0.0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Bio Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-brown-500/10 p-6">
                            <h3 className="text-lg font-bold text-neutral-brown-900 font-heading mb-4">Quick Bio</h3>
                            <p className="text-neutral-brown-700 text-sm leading-relaxed">
                                {author.bio || 'No biography available.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
