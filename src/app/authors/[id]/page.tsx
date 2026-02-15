'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Star, User, Book, Calendar, MapPin, Globe, Award, GraduationCap, Briefcase, Heart, Target, Users, Twitter, Facebook, Instagram, Linkedin, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getAuthorById, Author } from '@/lib/api/authors';

interface AuthorWithBooks extends Author {
  books?: Array<{
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    price: number;
    rentalPrice?: number | null;
    category: string;
    language: string;
    publishedAt: string;
    rating: number;
    tags?: string;
  }>;
}

const colorSchemes = [
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-red-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
];

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = params.id as string;
  
  const [author, setAuthor] = useState<AuthorWithBooks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthor() {
      try {
        setLoading(true);
        setError(null);
        const response = await getAuthorById(authorId);
        setAuthor(response.data || null);
      } catch (e) {
        console.error('Failed to fetch author:', e);
        setError(e instanceof Error ? e.message : 'Failed to load author');
      } finally {
        setLoading(false);
      }
    }

    if (authorId) {
      loadAuthor();
    }
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-neutral-brown-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-red-500" />
          </div>
          <p className="text-red-600 font-medium mb-2">Error loading author</p>
          <p className="text-red-500 text-sm mb-6">{error || 'Author not found'}</p>
          <Link href="/authors" className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors">
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  const colorScheme = colorSchemes[(author.name?.length || 0) % colorSchemes.length];

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="44" height="44">
                {/* Traditional Kalenjin Calabash */}
                <path d="M12 3C10 3 8.5 4 8 5.5C7.5 7 7 9 7 11C7 13.5 7.5 16 8.5 18C9.5 20 11 21 12 21C13 21 14.5 20 15.5 18C16.5 16 17 13.5 17 11C17 9 16.5 7 16 5.5C15.5 4 14 3 12 3Z" fill="#8B4513" stroke="#654321" strokeWidth="0.5"/>
                {/* Calabash neck */}
                <ellipse cx="12" cy="4" rx="1.5" ry="1.5" fill="#A0522D"/>
                {/* Traditional patterns */}
                <path d="M9 8C9 8 10 8.5 12 8.5C14 8.5 15 8 15 8" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                <path d="M9 11C9 11 10 11.5 12 11.5C14 11.5 15 11 15 11" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                <path d="M9 14C9 14 10 14.5 12 14.5C14 14.5 15 14 15 14" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                <path d="M9.5 17C9.5 17 10.5 17.5 12 17.5C13.5 17.5 14.5 17 14.5 17" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
                {/* Decorative dots */}
                <circle cx="10" cy="9.5" r="0.4" fill="#E07856"/>
                <circle cx="14" cy="9.5" r="0.4" fill="#E07856"/>
                <circle cx="10" cy="12.5" r="0.4" fill="#E07856"/>
                <circle cx="14" cy="12.5" r="0.4" fill="#E07856"/>
                <circle cx="10" cy="15.5" r="0.4" fill="#E07856"/>
                <circle cx="14" cy="15.5" r="0.4" fill="#E07856"/>
              </svg>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <Link href="/authors" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Authors</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-green rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white shadow-2xl">
                  {author.profileImage ? (
                    <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                      <User size={64} className="text-white/80" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen size={24} className="text-white" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
                <Sparkles size={16} className="text-accent-gold" />
                <span className="text-white/90 text-sm font-medium">Author</span>
                {author.status && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    author.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {author.status}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
                {author.name || 'Unknown Author'}
              </h1>

              {author.bio && (
                <p className="text-neutral-brown-200 text-lg mb-6 max-w-2xl">
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} className="text-accent-green" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{author.booksCount}</p>
                    <p className="text-neutral-brown-400 text-sm">Books</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Star size={24} className="text-accent-gold" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{author.rating?.toFixed(1) || '0.0'}</p>
                    <p className="text-neutral-brown-400 text-sm">Rating</p>
                  </div>
                </div>
                {author.totalEarnings !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Award size={24} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">KES {author.totalEarnings.toLocaleString()}</p>
                      <p className="text-neutral-brown-400 text-sm">Earned</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location & Join Date */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-6">
                {(author.location || author.nationality) && (
                  <div className="flex items-center gap-2 text-neutral-brown-300">
                    <MapPin size={16} />
                    <span>{author.location || author.nationality}</span>
                  </div>
                )}
                {author.approvedAt && (
                  <div className="flex items-center gap-2 text-neutral-brown-300">
                    <Calendar size={16} />
                    <span>Joined {new Date(author.approvedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener noreferrer" 
                   className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                  <Globe size={20} className="text-white" />
                </a>
              )}
              {author.twitter && (
                <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-white/10 hover:bg-[#1DA1F2] rounded-xl flex items-center justify-center transition-colors">
                  <Twitter size={20} className="text-white" />
                </a>
              )}
              {author.facebook && (
                <a href={`https://facebook.com/${author.facebook}`} target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-white/10 hover:bg-[#1877F2] rounded-xl flex items-center justify-center transition-colors">
                  <Facebook size={20} className="text-white" />
                </a>
              )}
              {author.instagram && (
                <a href={`https://instagram.com/${author.instagram}`} target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-white/10 hover:bg-[#E4405F] rounded-xl flex items-center justify-center transition-colors">
                  <Instagram size={20} className="text-white" />
                </a>
              )}
              {author.linkedin && (
                <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer"
                   className="w-12 h-12 bg-white/10 hover:bg-[#0A66C2] rounded-xl flex items-center justify-center transition-colors">
                  <Linkedin size={20} className="text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F1E8"/>
          </svg>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Professional Background */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <GraduationCap size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-neutral-brown-900 font-heading">Background</h3>
              </div>
              
              <div className="space-y-5">
                {author.education && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Education</h4>
                    <p className="text-sm text-neutral-brown-600">{author.education}</p>
                  </div>
                )}
                
                {author.occupation && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Occupation</h4>
                    <p className="text-sm text-neutral-brown-600">{author.occupation}</p>
                  </div>
                )}
                
                {author.writingExperience && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Writing Experience</h4>
                    <p className="text-sm text-neutral-brown-600">{author.writingExperience}</p>
                  </div>
                )}
                
                {author.previousPublications && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Previous Publications</h4>
                    <p className="text-sm text-neutral-brown-600">{author.previousPublications}</p>
                  </div>
                )}
                
                {author.awards && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1 flex items-center gap-1">
                      <Award size={16} className="text-accent-gold" />
                      Awards
                    </h4>
                    <p className="text-sm text-neutral-brown-600">{author.awards}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Writing Style */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center">
                  <Heart size={24} className="text-accent-green" />
                </div>
                <h3 className="text-xl font-bold text-neutral-brown-900 font-heading">Writing</h3>
              </div>
              
              <div className="space-y-5">
                {author.genres && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        try {
                          const genres = JSON.parse(author.genres);
                          return genres.length > 0 ? genres.map((genre: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                              {genre}
                            </span>
                          )) : <span className="text-sm text-neutral-brown-500">Not specified</span>;
                        } catch {
                          return <span className="text-sm text-neutral-brown-500">Not specified</span>;
                        }
                      })()}
                    </div>
                  </div>
                )}
                
                {author.languages && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        try {
                          const languages = JSON.parse(author.languages);
                          return languages.map((language: string, index: number) => (
                            <span key={index} className="bg-accent-green/10 text-accent-green px-3 py-1.5 rounded-full text-sm font-medium">
                              {language}
                            </span>
                          ));
                        } catch {
                          return <span className="text-sm text-neutral-brown-500">Not specified</span>;
                        }
                      })()}
                    </div>
                  </div>
                )}
                
                {author.writingStyle && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Style</h4>
                    <p className="text-sm text-neutral-brown-600">{author.writingStyle}</p>
                  </div>
                )}
                
                {author.inspirations && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Inspirations</h4>
                    <p className="text-sm text-neutral-brown-600">{author.inspirations}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Goals & Audience */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                  <Target size={24} className="text-accent-gold" />
                </div>
                <h3 className="text-xl font-bold text-neutral-brown-900 font-heading">Goals</h3>
              </div>
              
              <div className="space-y-5">
                {author.targetAudience && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1 flex items-center gap-1">
                      <Users size={16} />
                      Target Audience
                    </h4>
                    <p className="text-sm text-neutral-brown-600">{author.targetAudience}</p>
                  </div>
                )}
                
                {author.publishingGoals && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Publishing Goals</h4>
                    <p className="text-sm text-neutral-brown-600">{author.publishingGoals}</p>
                  </div>
                )}

                {/* Connect */}
                <div className="pt-5 border-t border-neutral-brown-100">
                  <h4 className="font-medium text-neutral-brown-800 mb-4">Connect</h4>
                  <div className="flex flex-wrap gap-2">
                    {author.website && (
                      <a href={author.website} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 px-4 py-2 bg-neutral-cream rounded-full text-sm text-neutral-brown-700 hover:bg-primary/10 hover:text-primary transition-colors">
                        <ExternalLink size={14} />
                        Website
                      </a>
                    )}
                    {author.twitter && (
                      <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-neutral-cream rounded-full text-sm text-neutral-brown-700 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors">
                        <Twitter size={14} />
                        Twitter
                      </a>
                    )}
                    {author.linkedin && (
                      <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-neutral-cream rounded-full text-sm text-neutral-brown-700 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-colors">
                        <Linkedin size={14} />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-8 text-center">
            Books by {author.name}
          </h2>

          {author.books && author.books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {author.books.map((book, index) => {
                const bookColorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <Link key={book.id} href={`/books/${book.id}`} className="group">
                    <div className="bg-neutral-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className={`aspect-[2/3] relative overflow-hidden ${!book.coverImage ? `bg-gradient-to-br ${bookColorScheme}` : ''}`}>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-neutral-brown-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xl font-bold text-primary">KES {book.price.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-accent-gold text-accent-gold" />
                            <span className="text-sm font-medium">{book.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-neutral-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={36} className="text-neutral-brown-300" />
              </div>
              <p className="text-neutral-brown-600">No published books yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
