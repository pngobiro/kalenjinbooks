'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, BookOpen, Star, User, MapPin, Globe,
  Twitter, Facebook, Instagram, Linkedin,
  Clock, Eye, ArrowRight, FileText, Play,
  LayoutGrid, Newspaper,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShareButtons from '@/components/ShareButtons';
import { getAuthorById, Author } from '@/lib/api/authors';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';

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
    amazonUrl?: string | null;
    readOnlineUrl?: string | null;
  }>;
}

type Tab = 'books' | 'articles';

function VideoThumbnail({ videoUrl, title }: { videoUrl: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="absolute inset-0 w-full h-full group/thumb"
      aria-label={`Play video: ${title}`}
    >
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover/thumb:scale-110" style={{ backgroundColor: 'rgba(217,120,70,0.95)' }}>
          <Play size={22} className="text-white ml-1" fill="currentColor" />
        </span>
      </span>
      <span className="absolute bottom-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(44,36,22,0.85)', color: '#FFFCF5' }}>
        Video
      </span>
    </button>
  );
}

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<AuthorWithBooks | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('books');

  useEffect(() => {
    async function loadAuthor() {
      try {
        setLoading(true);
        setError(null);
        const [authorRes, blogsRes] = await Promise.all([
          getAuthorById(authorId),
          fetchBlogPosts({ authorId, published: true, limit: 20 }).catch(() => null),
        ]);
        setAuthor(authorRes.data || null);
        setBlogPosts(blogsRes?.data?.posts || []);
      } catch (e) {
        console.error('Failed to fetch author:', e);
        setError(e instanceof Error ? e.message : 'Failed to load author');
      } finally {
        setLoading(false);
      }
    }
    if (authorId) loadAuthor();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="rounded-xl p-12 text-center max-w-md shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #FCA5A5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEE2E2' }}>
            <User size={40} className="text-red-500" />
          </div>
          <p className="text-red-600 font-bold text-xl mb-3">Author Not Found</p>
          <p className="text-red-500 mb-8">{error || 'The author you\'re looking for doesn\'t exist.'}</p>
          <Link
            href="/authors"
            className="inline-block px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
            style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
          >
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  const allBooks = author.books || [];
  const initials = (author.name || 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const socialLinks = [
    { icon: Globe, href: author.website || '' },
    { icon: Twitter, href: author.twitter ? `https://twitter.com/${author.twitter}` : '' },
    { icon: Facebook, href: author.facebook ? `https://facebook.com/${author.facebook}` : '' },
    { icon: Instagram, href: author.instagram ? `https://instagram.com/${author.instagram}` : '' },
    { icon: Linkedin, href: author.linkedin ? `https://linkedin.com/in/${author.linkedin}` : '' },
  ].filter((l) => l.href);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #D97846 0%, transparent 40%), radial-gradient(circle at 80% 70%, #7A9B76 0%, transparent 40%)',
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Link
            href="/authors"
            className="inline-flex items-center gap-2 mb-10 transition-colors hover:gap-3"
            style={{ color: '#E4D9C4' }}
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">All Authors</span>
          </Link>

          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            {/* Rounded Avatar */}
            <div className="relative w-40 h-40 mb-6">
              <div
                className="absolute inset-0 rounded-full overflow-hidden ring-4"
                style={{ boxShadow: '0 0 0 4px #2C2416, 0 12px 32px rgba(217,120,70,0.35)', ['--tw-ring-color' as string]: '#D97846' }}
              >
                {author.profileImage ? (
                  <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#D97846' }}>
                    <span className="text-6xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{initials}</span>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
              {author.name || 'Unknown Author'}
            </h1>

            {(author.location || author.nationality) && (
              <p className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full mb-5" style={{ color: '#E4D9C4', backgroundColor: 'rgba(255,252,245,0.1)' }}>
                <MapPin size={14} />
                {author.location || author.nationality}
              </p>
            )}

            {author.bio && (
              <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: '#E4D9C4' }}>
                {author.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="px-6 py-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,252,245,0.08)', border: '1px solid rgba(228,217,196,0.2)' }}>
                <div className="flex items-center justify-center gap-2 font-bold text-2xl" style={{ color: '#FFFCF5' }}>
                  <BookOpen size={18} style={{ color: '#D97846' }} />
                  {allBooks.length}
                </div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#A89888' }}>Books</div>
              </div>
              <div className="px-6 py-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,252,245,0.08)', border: '1px solid rgba(228,217,196,0.2)' }}>
                <div className="flex items-center justify-center gap-2 font-bold text-2xl" style={{ color: '#FFFCF5' }}>
                  <FileText size={18} style={{ color: '#D97846' }} />
                  {blogPosts.length}
                </div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#A89888' }}>Articles</div>
              </div>
              <div className="px-6 py-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,252,245,0.08)', border: '1px solid rgba(228,217,196,0.2)' }}>
                <div className="flex items-center justify-center gap-2 font-bold text-2xl" style={{ color: '#FFFCF5' }}>
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  {author.rating?.toFixed(1) || '0.0'}
                </div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#A89888' }}>Rating</div>
              </div>
            </div>

            {/* Social + Share */}
            <div className="flex items-center justify-center gap-3">
              <ShareButtons title={author.name || 'Author'} type="author" />
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'rgba(255,252,245,0.1)', color: '#E4D9C4', border: '1px solid rgba(228,217,196,0.2)' }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
            <button
              onClick={() => setActiveTab('books')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
              style={activeTab === 'books'
                ? { backgroundColor: '#D97846', color: '#FFFCF5', boxShadow: '0 4px 12px rgba(217,120,70,0.35)' }
                : { color: '#5B4F42' }}
            >
              <LayoutGrid size={16} />
              Books
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={activeTab === 'books' ? { backgroundColor: 'rgba(255,252,245,0.25)' } : { backgroundColor: '#F5F1E8', color: '#5B4F42' }}>
                {allBooks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
              style={activeTab === 'articles'
                ? { backgroundColor: '#D97846', color: '#FFFCF5', boxShadow: '0 4px 12px rgba(217,120,70,0.35)' }
                : { color: '#5B4F42' }}
            >
              <Newspaper size={16} />
              Articles
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={activeTab === 'articles' ? { backgroundColor: 'rgba(255,252,245,0.25)' } : { backgroundColor: '#F5F1E8', color: '#5B4F42' }}>
                {blogPosts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Books Tab */}
        {activeTab === 'books' && (
          allBooks.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {allBooks.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`} className="group w-full max-w-[280px]">
                  <div className="h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
                    <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: '#E4D9C4' }}>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={48} style={{ color: '#A89888' }} />
                        </div>
                      )}
                      {book.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded text-xs font-semibold uppercase" style={{ backgroundColor: 'rgba(217,120,70,0.95)', color: '#FFFCF5' }}>
                            {book.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                        {book.title}
                      </h3>
                      {book.description && (
                        <p className="text-sm line-clamp-2 mb-4 flex-1" style={{ color: '#5B4F42' }}>{book.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E4D9C4' }}>
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: '#7A9B76' }}>
                          <BookOpen size={15} />
                          Free to Read
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold" style={{ color: '#2C2416' }}>{book.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-16 text-center max-w-md mx-auto" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEF3E7' }}>
                <BookOpen size={40} style={{ color: '#D97846' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                No Books Yet
              </h3>
              <p className="max-w-xs mx-auto" style={{ color: '#5B4F42' }}>
                This author hasn&apos;t published any books yet. Check back soon for new releases!
              </p>
            </div>
          )
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          blogPosts.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blogs/${post.slug || post.id}`} className="group w-full max-w-[340px]">
                  <div className="h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
                    <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: '#E4D9C4' }}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : post.coverType === 'video' && post.coverVideoUrl ? (
                        <VideoThumbnail videoUrl={post.coverVideoUrl} title={post.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={40} style={{ color: '#A89888' }} />
                        </div>
                      )}
                      {post.category && (
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <span className="px-3 py-1 rounded text-xs font-semibold uppercase" style={{ backgroundColor: 'rgba(217,120,70,0.95)', color: '#FFFCF5' }}>
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm line-clamp-2 mb-4 flex-1" style={{ color: '#5B4F42' }}>
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: '#E4D9C4', color: '#A89888' }}>
                        <span>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {calculateReadTime(post.content).text}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={11} />
                            {post.viewCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-16 text-center max-w-md mx-auto" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEF3E7' }}>
                <FileText size={40} style={{ color: '#D97846' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                No Articles Yet
              </h3>
              <p className="max-w-xs mx-auto" style={{ color: '#5B4F42' }}>
                This author hasn&apos;t published any articles yet. Check back soon!
              </p>
            </div>
          )
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all hover:-translate-y-0.5 shadow-lg"
            style={{ backgroundColor: '#D97846', color: '#FFFCF5' }}
          >
            Explore All Books <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
