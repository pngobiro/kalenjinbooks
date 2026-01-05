'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Star, User, Book, Calendar, MapPin, Globe, Phone, Mail, Award, GraduationCap, Briefcase, Heart, Target, Users, Twitter, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getAuthorById, Author } from '@/lib/api/authors';

interface AuthorWithBooks extends Author {
  // Personal Information
  dateOfBirth?: string;
  nationality?: string;
  location?: string;
  phoneNumber?: string;
  
  // Professional Background
  education?: string;
  occupation?: string;
  writingExperience?: string;
  previousPublications?: string;
  awards?: string;
  
  // Writing Details
  genres?: string;
  languages?: string;
  writingStyle?: string;
  inspirations?: string;
  targetAudience?: string;
  publishingGoals?: string;
  
  // Social Media & Contact
  website?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  
  // Additional Info
  totalEarnings?: number;
  status?: string;
  appliedAt?: string;
  approvedAt?: string;
  
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
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">Error loading author</p>
          <p className="text-red-500 text-sm mb-4">{error || 'Author not found'}</p>
          <Link 
            href="/authors"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <Link href="/authors" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back to Authors</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Author Header */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Author Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center flex-shrink-0">
              {author.profileImage ? (
                <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-neutral-brown-400" />
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-2">
                    {author.name || 'Unknown Author'}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-neutral-brown-600 mb-2">
                    <span className="text-lg text-primary font-medium">Author</span>
                    {author.status && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        author.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        author.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {author.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center gap-3">
                  {author.website && (
                    <a href={author.website} target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 bg-neutral-brown-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <Globe size={18} />
                    </a>
                  )}
                  {author.twitter && (
                    <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-neutral-brown-100 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <Twitter size={18} />
                    </a>
                  )}
                  {author.facebook && (
                    <a href={`https://facebook.com/${author.facebook}`} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-neutral-brown-100 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <Facebook size={18} />
                    </a>
                  )}
                  {author.instagram && (
                    <a href={`https://instagram.com/${author.instagram}`} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-neutral-brown-100 hover:bg-pink-500 hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <Instagram size={18} />
                    </a>
                  )}
                  {author.linkedin && (
                    <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-neutral-brown-100 hover:bg-blue-700 hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
              
              {author.bio && (
                <p className="text-neutral-brown-600 mb-6 leading-relaxed">
                  {author.bio}
                </p>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-accent-green" />
                  <span className="font-medium">{author.booksCount} Books Published</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="fill-accent-gold text-accent-gold" />
                  <span className="font-medium">{author.rating?.toFixed(1) || '0.0'} Average Rating</span>
                </div>
                {author.totalEarnings !== undefined && (
                  <div className="flex items-center gap-2">
                    <Award size={20} className="text-primary" />
                    <span className="font-medium">KES {author.totalEarnings.toLocaleString()} Earned</span>
                  </div>
                )}
              </div>

              {/* Basic Info Row */}
              <div className="flex flex-wrap gap-6 text-sm text-neutral-brown-600">
                {author.nationality && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{author.nationality}</span>
                  </div>
                )}
                {author.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{author.location}</span>
                  </div>
                )}
                {author.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <span>{author.occupation}</span>
                  </div>
                )}
                {author.approvedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Joined {new Date(author.approvedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Details */}
      <section className="py-12 bg-neutral-cream/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Professional Background */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-primary" />
                Professional Background
              </h3>
              
              <div className="space-y-4">
                {author.education && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Education</h4>
                    <p className="text-sm text-neutral-brown-600">{author.education}</p>
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
                      Awards & Recognition
                    </h4>
                    <p className="text-sm text-neutral-brown-600">{author.awards}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Writing Style & Preferences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <Heart size={20} className="text-primary" />
                Writing Style
              </h3>
              
              <div className="space-y-4">
                {author.genres && (
                  <div>
                    <h4 className="font-medium text-neutral-brown-800 mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        try {
                          const genres = JSON.parse(author.genres);
                          return genres.length > 0 ? genres.map((genre: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
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
                            <span key={index} className="bg-accent-green/10 text-accent-green px-2 py-1 rounded-full text-xs">
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
                    <h4 className="font-medium text-neutral-brown-800 mb-1">Writing Style</h4>
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
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Goals & Audience
              </h3>
              
              <div className="space-y-4">
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
                
                {/* Contact Information */}
                <div className="pt-4 border-t border-neutral-brown-100">
                  <h4 className="font-medium text-neutral-brown-800 mb-3">Connect</h4>
                  <div className="space-y-2">
                    {author.website && (
                      <a href={author.website} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors">
                        <ExternalLink size={14} />
                        Visit Website
                      </a>
                    )}
                    
                    <div className="flex items-center gap-3 pt-2">
                      {author.twitter && (
                        <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                           className="text-neutral-brown-400 hover:text-blue-500 transition-colors">
                          <Twitter size={16} />
                        </a>
                      )}
                      {author.facebook && (
                        <a href={`https://facebook.com/${author.facebook}`} target="_blank" rel="noopener noreferrer"
                           className="text-neutral-brown-400 hover:text-blue-600 transition-colors">
                          <Facebook size={16} />
                        </a>
                      )}
                      {author.instagram && (
                        <a href={`https://instagram.com/${author.instagram}`} target="_blank" rel="noopener noreferrer"
                           className="text-neutral-brown-400 hover:text-pink-500 transition-colors">
                          <Instagram size={16} />
                        </a>
                      )}
                      {author.linkedin && (
                        <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer"
                           className="text-neutral-brown-400 hover:text-blue-700 transition-colors">
                          <Linkedin size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author's Books */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-8">
            Books by {author.name}
          </h2>

          {author.books && author.books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {author.books.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                    {/* Book Cover */}
                    <div className="aspect-3/4 bg-gradient-to-br from-primary/10 to-accent-green/10 relative overflow-hidden">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Book size={48} className="text-neutral-brown-300" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-neutral-brown-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-brown-600 mb-3 line-clamp-2">
                        {book.description}
                      </p>

                      {/* Tags */}
                      {book.tags && (
                        <div className="mb-3">
                          {(() => {
                            try {
                              const tags = JSON.parse(book.tags);
                              return tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {tags.slice(0, 2).map((tag: string, index: number) => (
                                    <span key={index} className="bg-neutral-brown-100 text-neutral-brown-600 px-2 py-1 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {tags.length > 2 && (
                                    <span className="text-xs text-neutral-brown-400">+{tags.length - 2} more</span>
                                  )}
                                </div>
                              ) : null;
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      )}

                      <div className="space-y-2">
                        {/* Purchase Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            KES {book.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-accent-gold text-accent-gold" />
                            <span className="text-sm font-medium">{book.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>

                        {/* Rental Price */}
                        {book.rentalPrice && (
                          <div className="text-sm text-neutral-brown-600">
                            <span>24h Rental: </span>
                            <span className="font-medium text-accent-green">KES {book.rentalPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-brown-100">
                        <div className="flex items-center justify-between text-sm text-neutral-brown-500">
                          <div className="flex items-center gap-2">
                            <span className="bg-neutral-brown-100 px-2 py-1 rounded-full text-xs">
                              {book.category}
                            </span>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              {book.language}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(book.publishedAt).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-neutral-brown-300 mx-auto mb-4" />
              <p className="text-neutral-brown-600">No published books yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}