'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, BookOpen, Star, User, MapPin, Globe,
  Twitter, Facebook, Instagram, Linkedin,
  Clock, Eye, ArrowRight, FileText, Play,
  Newspaper,
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

  const genresList = Array.isArray(author.genres)
    ? (author.genres as string[])
    : typeof author.genres === 'string' && author.genres.trim()
      ? author.genres.split(',').map((g) => g.trim()).filter(Boolean)
      : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section — portrait left, info right */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#2C2416' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 15% 20%, #D97846 0%, transparent 40%), radial-gradient(circle at 85% 80%, #7A9B76 0%, transparent 40%)',
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/authors"
            className="inline-flex items-center gap-2 mb-10 transition-colors hover:gap-3"
            style={{ color: '#E4D9C4' }}
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">All Authors</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Portrait */}
            <div className="flex justify-center lg:col-span-4">
              <div className="relative w-56 sm:w-64 lg:w-full max-w-xs">
                <div
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                  style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 3px rgba(217,120,70,0.7)' }}
                >
                  {author.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #D97846 0%, #B45A30 100%)' }}>
                      <span className="text-7xl font-bold text-white/90" style={{ fontFamily: 'Playfair Display, serif' }}>{initials}</span>
                      <span className="text-xs uppercase tracking-[0.25em] text-white/60">KaleeReads Author</span>
                    </div>
                  )}
                  {/* subtle bottom gradient for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  {/* name plate on image (mobile only) */}
                  <div className="absolute bottom-3 inset-x-0 text-center lg:hidden">
                    <p className="font-bold text-lg drop-shadow" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
                      {author.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left lg:col-span-8">
              {/* eyebrow */}
              <p className="hidden lg:block text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: '#D97846' }}>
                KaleeReads Author
              </p>

              <h1 className="hidden lg:block text-4xl md:text-5xl xl:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFCF5' }}>
                {author.name || 'Unknown Author'}
              </h1>

              {(author.location || author.nationality) && (
                <p className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full mb-5" style={{ color: '#E4D9C4', backgroundColor: 'rgba(255,252,245,0.08)', border: '1px solid rgba(228,217,196,0.18)' }}>
                  <MapPin size={14} style={{ color: '#D97846' }} />
                  {author.location || author.nationality}
                </p>
              )}

              {author.bio && (
                <p className="text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0" style={{ color: '#E4D9C4' }}>
                  {author.bio}
                </p>
              )}

              {/* Genres */}
              {genresList.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-7">
                  {genresList.slice(0, 5).map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(217,120,70,0.15)', color: '#E89B77', border: '1px solid rgba(217,120,70,0.35)' }}>
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick stats strip */}
              <div className="flex items-stretch justify-center lg:justify-start divide-x mb-7" style={{ borderColor: 'rgba(228,217,196,0.2)' }}>
                <button
                  onClick={() => document.getElementById('author-books')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 first:pl-0 text-center hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-2xl" style={{ color: '#FFFCF5' }}>
                    <BookOpen size={17} style={{ color: '#D97846' }} />{allBooks.length}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#A89888' }}>Books ↓</div>
                </button>
                <button
                  onClick={() => document.getElementById('author-blogs')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 text-center hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-2xl" style={{ color: '#FFFCF5' }}>
                    <Newspaper size={17} style={{ color: '#D97846' }} />{blogPosts.length}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#A89888' }}>Articles ↓</div>
                </button>
                <div className="px-6 text-center">
                  <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-2xl" style={{ color: '#FFFCF5' }}>
                    <Star size={17} className="fill-yellow-400 text-yellow-400" />{author.rating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#A89888' }}>Rating</div>
                </div>
              </div>

              {/* Social + Share */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <ShareButtons title={author.name || 'Author'} type="author" />
                {socialLinks.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: 'rgba(255,252,245,0.08)', color: '#E4D9C4', border: '1px solid rgba(228,217,196,0.18)' }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ── Books ─────────────────────────────────────────── */}
        <section id="author-books" className="scroll-mt-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: '#D97846' }}>The Library</p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Books by {author.name?.split(' ').slice(-1)[0]}
              </h2>
            </div>
            <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
              {allBooks.length}
            </span>
          </div>

          {allBooks.length > 0 ? (
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
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
                      {/* Free reading badge */}
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide shadow" style={{ backgroundColor: '#7A9B76', color: '#FFFCF5' }}>
                        Read Free
                      </div>
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
                      <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: '#E4D9C4' }}>
                        <span className="text-xs font-semibold" style={{ color: '#A89888' }}>Hard copy available</span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold transition-all group-hover:gap-2" style={{ color: '#D97846' }}>
                          Open <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-14 text-center max-w-md" style={{ backgroundColor: '#FFFCF5', border: '1px dashed #E4D9C4' }}>
              <BookOpen size={38} className="mx-auto mb-4" style={{ color: '#D97846' }} />
              <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>No books published yet</p>
              <p className="text-sm" style={{ color: '#5B4F42' }}>New releases will appear here.</p>
            </div>
          )}
        </section>

        {/* ── Articles / Lectures ───────────────────────────── */}
        <section id="author-blogs" className="scroll-mt-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: '#D97846' }}>Insights & Lectures</p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                Articles by {author.name?.split(' ')[0]}
              </h2>
            </div>
            <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
              {blogPosts.length}
            </span>
          </div>

          {blogPosts.length > 0 ? (
            blogPosts.length <= 3 ? (
              /* Few posts: large horizontal feature cards */
              <div className="space-y-5 max-w-3xl">
                {blogPosts.map((post) => (
                  <ArticleRow key={post.id} post={post} />
                ))}
              </div>
            ) : (
              /* Many posts: centered grid */
              <div className="flex flex-wrap justify-center gap-7">
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )
          ) : (
            <div className="rounded-2xl p-14 text-center max-w-md" style={{ backgroundColor: '#FFFCF5', border: '1px dashed #E4D9C4' }}>
              <FileText size={38} className="mx-auto mb-4" style={{ color: '#D97846' }} />
              <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>No articles yet</p>
              <p className="text-sm" style={{ color: '#5B4F42' }}>Essays and lectures will appear here.</p>
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-4 pb-8">
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

/** Horizontal article row — used when there are few posts */
function ArticleRow({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blogs/${post.slug || post.id}`} className="group block">
      <div className="flex flex-col sm:flex-row gap-5 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E4D9C4' }}>
        <div className="relative sm:w-64 aspect-[16/10] sm:aspect-auto sm:h-auto overflow-hidden shrink-0" style={{ backgroundColor: '#E4D9C4' }}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : post.coverType === 'video' && post.coverVideoUrl ? (
            <VideoThumbnail videoUrl={post.coverVideoUrl} title={post.title} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText size={34} style={{ color: '#A89888' }} />
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {post.category && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide" style={{ backgroundColor: '#FEF3E7', color: '#D97846' }}>
                {post.category}
              </span>
            )}
            <span className="text-xs" style={{ color: '#A89888' }}>{formatBlogDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <h3 className="font-bold text-xl leading-snug mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm line-clamp-2 mb-3" style={{ color: '#5B4F42' }}>{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-xs" style={{ color: '#A89888' }}>
            <span className="inline-flex items-center gap-1"><Clock size={12} />{calculateReadTime(post.content).text}</span>
            <span className="inline-flex items-center gap-1"><Eye size={12} />{post.viewCount} views</span>
            <span className="inline-flex items-center gap-1 font-semibold ml-auto transition-all group-hover:gap-2" style={{ color: '#D97846' }}>Read <ArrowRight size={13} /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Compact vertical card — used when there are many posts */
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blogs/${post.slug || post.id}`} className="group w-full max-w-[340px]">
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
  );
}
