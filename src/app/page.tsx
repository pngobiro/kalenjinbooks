'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Star, Clock, Eye, FileText, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { calculateReadTime, formatBlogDate } from '@/lib/blog-utils';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

/* Editorial palette for author avatars and blog covers.
   Previously eight stock Tailwind gradients (emerald/rose/violet/fuchsia) that
   fought the warm earth brand. These are all drawn from the site palette so a
   card never looks like it came from a different product. */
const editorialTones = [
  { from: '#8A4B2A', to: '#5C3218' }, // burnt sienna
  { from: '#4F6D4C', to: '#2F452D' }, // deep sage
  { from: '#A8762B', to: '#6E4C18' }, // ochre
  { from: '#7A4B5C', to: '#4A2B36' }, // plum clay
  { from: '#3F5A6B', to: '#24353F' }, // slate teal
  { from: '#9C5A3C', to: '#5F3320' }, // terracotta
  { from: '#5B5340', to: '#33301F' }, // olive ash
  { from: '#6B4A2F', to: '#3B2917' }, // bark
];

export default function HomePage() {
  const [books, setBooks] = useState<BookType[]>([]);

  // Fair rotation: round-robin across authors so no single author dominates
  // the shelf. Each author gets an equal share of the 8 slots; leftover slots
  // (when an author has fewer books) go to the newest remaining books.
  const shelfBooks = useMemo(() => {
    const MAX = 8;
    if (books.length <= MAX) return books;
    const byAuthor = new Map<string, BookType[]>();
    for (const b of books) {
      const key = b.author?.id || '__unknown__';
      if (!byAuthor.has(key)) byAuthor.set(key, []);
      byAuthor.get(key)!.push(b);
    }
    if (byAuthor.size <= 1) return books.slice(0, MAX);
    const queues = [...byAuthor.values()];
    const picked: BookType[] = [];
    let progress = true;
    while (picked.length < MAX && progress) {
      progress = false;
      for (const q of queues) {
        if (picked.length >= MAX) break;
        const next = q.shift();
        if (next) {
          picked.push(next);
          progress = true;
        }
      }
    }
    return picked;
  }, [books]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const [booksRes, blogsRes, authorsRes] = await Promise.all([
          fetchBooks({ limit: 20 }).catch(() => null),
          fetchBlogPosts({ published: true, limit: 20 }).catch(() => null),
          fetchAuthors({ limit: 12 }).catch(() => null),
        ]);
        setBooks(booksRes?.data || []);
        setBlogPosts(blogsRes?.data?.posts || []);
        setAuthors(authorsRes?.data || []);
      } catch (err) {
        console.error('Error loading homepage content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: '#2C2416',
          minHeight: '500px',
        }}
      >
        {/* Nano Banana generated illustration */}
        <img
          src="/images/hero-illustration.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Readability overlay — heavier on the left where the text column sits,
            so the display type stays legible over the illustration. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(44,36,22,0.94) 0%, rgba(44,36,22,0.86) 38%, rgba(58,46,87,0.62) 68%, rgba(44,36,22,0.42) 100%)',
          }}
        />
        <div className="page-container relative z-10 flex min-h-[520px] items-center py-20 md:py-24">
          <div className="max-w-2xl">
            <p
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] mb-7"
              style={{ color: '#E8A87C' }}
            >
              An independent African press
            </p>

            <h1
              className="font-heading font-bold mb-7 text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-7xl"
              style={{ color: '#FFFCF5' }}
            >
              Stories that
              <br />
              <span className="italic" style={{ color: '#F0BE94' }}>
                outlast
              </span>{' '}
              the telling.
            </h1>

            <div
              className="w-16 h-[3px] mb-7"
              style={{ backgroundColor: '#B4502A' }}
              aria-hidden="true"
            />

            <p
              className="text-base md:text-lg mb-10 max-w-xl leading-relaxed"
              style={{ color: 'rgba(255, 252, 245, 0.88)' }}
            >
              Books, oral histories and cultural writing from Kenyan authors —
              preserved, published and read on your own terms.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/books"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-base transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#B4502A',
                  color: '#FFFCF5',
                  boxShadow: '0 10px 30px rgba(44,36,22,0.35)',
                }}
              >
                Explore the Library
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/authors"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-base transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFFCF5',
                  border: '1px solid rgba(255, 252, 245, 0.35)',
                }}
              >
                Meet the Authors
              </Link>
            </div>

            {/* Live counts read as a masthead line rather than filler stats. */}
            <dl
              className="mt-14 pt-8 grid grid-cols-3 gap-6 max-w-lg border-t"
              style={{ borderColor: 'rgba(255, 252, 245, 0.18)' }}
            >
              {[
                { label: 'Books', value: books.length },
                { label: 'Authors', value: authors.length },
                { label: 'Stories', value: blogPosts.length },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt
                    className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: 'rgba(255, 252, 245, 0.6)' }}
                  >
                    {stat.label}
                  </dt>
                  <dd
                    className="font-heading text-3xl font-bold"
                    style={{ color: '#FFFCF5' }}
                  >
                    {loading ? '—' : stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <main id="main-content" className="page-container">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: '#E4D9C4' }}></div>
              <div className="absolute inset-0 border-4 rounded-full animate-spin" style={{ borderColor: '#B4502A', borderTopColor: 'transparent' }}></div>
            </div>
          </div>
        ) : (
          <div className="space-y-20 py-16">
            {/* 01 — Authors: editorial portrait cards, left-aligned header */}
            <section className="editorial-section">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end mb-14">
                <div>
                  <p className="editorial-eyebrow editorial-eyebrow-rule mb-5">The Writers</p>
                  <h2
                    className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 max-w-2xl"
                    style={{ color: '#2C2416' }}
                  >
                    Authors preserving what
                    <br className="hidden sm:block" /> the world almost lost
                  </h2>
                  <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: '#5B4F42' }}>
                    Historians, theologians and storytellers writing the record of
                    Kenya&rsquo;s peoples in their own words.
                  </p>
                </div>
                <p className="editorial-numeral hidden lg:block" aria-hidden="true">
                  01
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {authors.slice(0, 6).map((author, i) => {
                  const tone = editorialTones[i % editorialTones.length];
                  return (
                    <Link
                      key={author.id}
                      href={`/authors/${author.id}`}
                      className="editorial-card group block overflow-hidden"
                    >
                      {/* Portrait panel — brand tone, not a stock Tailwind gradient */}
                      <div
                        className="relative h-52 overflow-hidden"
                        style={{
                          background: `linear-gradient(140deg, ${tone.from} 0%, ${tone.to} 100%)`,
                        }}
                      >
                        {author.profileImage ? (
                          <img
                            src={author.profileImage}
                            alt={author.name || 'Author'}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-heading text-6xl font-bold text-white/90">
                              {author.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3
                          className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors"
                          style={{ color: '#2C2416' }}
                        >
                          {author.name || 'Unknown Author'}
                        </h3>
                        {author.bio && (
                          <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#5B4F42' }}>
                            {author.bio}
                          </p>
                        )}
                        {/* Stats set as a data line, like a byline in print */}
                        <div
                          className="flex items-center gap-4 pt-4 border-t text-xs font-medium"
                          style={{ borderColor: '#E4D9C4', color: '#5B4F42' }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <BookOpen size={14} style={{ color: '#4F6D4C' }} />
                            {author.booksCount} {author.booksCount === 1 ? 'book' : 'books'}
                          </span>
                          {(author.blogsCount ?? 0) > 0 && (
                            <>
                              <span aria-hidden="true" style={{ color: '#E4D9C4' }}>
                                /
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <FileText size={14} style={{ color: '#B4502A' }} />
                                {author.blogsCount} {author.blogsCount === 1 ? 'story' : 'stories'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {authors.length > 0 && (
                <div className="mt-12">
                  <Link
                    href="/authors"
                    className="inline-flex items-center gap-2 font-semibold transition-colors group"
                    style={{ color: '#B4502A' }}
                  >
                    <span className="border-b-2 pb-0.5 group-hover:border-current" style={{ borderColor: 'transparent' }}>
                      Browse all authors
                    </span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </section>

            <hr className="editorial-rule" />

            {/* 02 — Featured book: full-bleed dark band, cover left / copy right */}
            {(() => {
              const featured = books.find((b) => b.isFeatured) || books[0];
              if (!featured) return null;
              return (
                <section className="editorial-section">
                  <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{ backgroundColor: '#2C2416' }}
                  >
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 12% 18%, #B4502A 0%, transparent 42%), radial-gradient(circle at 88% 82%, #A8762B 0%, transparent 40%)',
                      }}
                      aria-hidden="true"
                    />
                    <div className="relative grid md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] gap-10 md:gap-14 items-center p-8 md:p-14">
                      <Link
                        href={`/books/${featured.id}`}
                        className="group block w-52 mx-auto md:w-full shrink-0"
                      >
                        <div
                          className="relative aspect-[2/3] rounded-lg overflow-hidden transition-transform duration-500 group-hover:-translate-y-1.5"
                          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
                        >
                          {featured.coverImage ? (
                            <img
                              src={featured.coverImage}
                              alt={featured.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ backgroundColor: '#3A2E22' }}
                            >
                              <BookOpen size={48} style={{ color: 'rgba(228,217,196,0.4)' }} />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div>
                        <p
                          className="font-mono text-[11px] uppercase tracking-[0.24em] mb-5"
                          style={{ color: '#E8A87C' }}
                        >
                          This Month&rsquo;s Selection
                        </p>
                        <h2
                          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.12]"
                          style={{ color: '#FFFCF5' }}
                        >
                          {featured.title}
                        </h2>
                        <p
                          className="text-sm mb-6"
                          style={{ color: '#E8A87C' }}
                        >
                          {featured.author?.user?.name || 'Unknown Author'}
                        </p>
                        {featured.description && (
                          <p
                            className="text-base leading-relaxed mb-8 max-w-xl line-clamp-3"
                            style={{ color: '#E4D9C4' }}
                          >
                            {featured.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                          {featured.isFreeReading && (
                            <Link
                              href={`/book/viewer/${featured.id}`}
                              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold transition-transform hover:-translate-y-0.5"
                              style={{
                                backgroundColor: '#B4502A',
                                color: '#FFFFFF',
                              }}
                            >
                              <BookOpen size={17} />
                              Read Free
                            </Link>
                          )}
                          <Link
                            href={`/books/${featured.id}`}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold transition-colors"
                            style={{
                              color: '#FFFCF5',
                              border: '1px solid rgba(232, 168, 124, 0.55)',
                            }}
                          >
                            View Details
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Latest Books Section */}
            {/* 03 — Latest books: real grid, no negative-margin band */}
            <section className="editorial-section">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end mb-14">
                <div>
                  <p className="editorial-eyebrow editorial-eyebrow-rule mb-5">New &amp; Noteworthy</p>
                  <h2
                    className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
                    style={{ color: '#2C2416' }}
                  >
                    From the press
                  </h2>
                  <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: '#5B4F42' }}>
                    Fresh releases and long-tail backlist titles, side by side.
                  </p>
                </div>
                <p className="editorial-numeral hidden lg:block" aria-hidden="true">
                  02
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
                {shelfBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] rounded-md overflow-hidden mb-4">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: '#E4D9C4' }}
                        >
                          <BookOpen size={32} className="text-white/60" />
                        </div>
                      )}

                      {/* Price badge sits on the cover permanently rather than
                          only on hover, so it is readable without a pointer. */}
                      <div className="absolute top-3 left-3">
                        {book.isFreeReading ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                            style={{ backgroundColor: '#2C2416', color: '#B6D3B2' }}
                          >
                            <BookOpen size={11} />
                            Free
                          </span>
                        ) : (
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold"
                            style={{ backgroundColor: '#FFFCF5', color: '#2C2416' }}
                          >
                            KES {book.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {book.rating > 0 && (
                        <div
                          className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
                          style={{ backgroundColor: 'rgba(44,36,22,0.82)', color: '#FFFCF5' }}
                        >
                          <Star size={11} className="fill-star text-star" />
                          {book.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <h3
                      className="font-heading text-sm md:text-base font-semibold leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors"
                      style={{ color: '#2C2416' }}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs" style={{ color: '#6B5D52' }}>
                      {book.author?.user?.name || 'Unknown Author'}
                    </p>
                  </Link>
                ))}
              </div>

              {books.length > shelfBooks.length && (
                <div className="mt-14">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: '#B4502A',
                      color: '#FFFCF5',
                      boxShadow: '0 8px 24px rgba(180,80,42,0.28)',
                    }}
                  >
                    View all {books.length} books
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </section>

            <hr className="editorial-rule" />

            {/* 04 — Stories: one lead feature + the rest as an editorial index */}
            {blogPosts.length > 0 && (() => {
              const [lead, ...rest] = blogPosts;
              const tone = editorialTones[0];
              return (
                <section className="editorial-section">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end mb-14">
                    <div>
                      <p className="editorial-eyebrow editorial-eyebrow-rule mb-5">The Journal</p>
                      <h2
                        className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
                        style={{ color: '#2C2416' }}
                      >
                        Stories &amp; insights
                      </h2>
                      <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: '#5B4F42' }}>
                        Essays, lectures and field notes on African culture and
                        literature.
                      </p>
                    </div>
                    <p className="editorial-numeral hidden lg:block" aria-hidden="true">
                      03
                    </p>
                  </div>

                  <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
                    {/* Lead story — image left, headline right */}
                    <Link href={`/blogs/${lead.id}`} className="group block">
                      <div
                        className="relative aspect-[16/10] rounded-lg overflow-hidden mb-6"
                        style={{
                          background: `linear-gradient(140deg, ${tone.from} 0%, ${tone.to} 100%)`,
                        }}
                      >
                        {lead.coverImage ? (
                          <img
                            src={lead.coverImage}
                            alt={lead.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : lead.coverType === 'video' && lead.coverVideoUrl ? (
                          <VideoThumbnail videoUrl={lead.coverVideoUrl} title={lead.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={40} className="text-white/40" />
                          </div>
                        )}
                        {lead.category && (
                          <div className="absolute top-4 left-4">
                            <span
                              className="px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider"
                              style={{ backgroundColor: '#B4502A', color: '#FFFCF5' }}
                            >
                              {lead.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {lead.excerpt && (
                        <p
                          className="text-base leading-relaxed mb-4 line-clamp-2"
                          style={{ color: '#5B4F42' }}
                        >
                          {lead.excerpt}
                        </p>
                      )}

                      <h3
                        className="font-heading text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors"
                        style={{ color: '#2C2416' }}
                      >
                        {lead.title}
                      </h3>

                      <div
                        className="mt-5 pt-4 border-t flex items-center gap-4 text-xs"
                        style={{ borderColor: '#E4D9C4', color: '#6B5D52' }}
                      >
                        <span>{lead.author?.user?.name || 'Mama Africa Library'}</span>
                        <span aria-hidden="true" style={{ color: '#E4D9C4' }}>
                          /
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {calculateReadTime(lead.content).text}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12} />
                          {lead.viewCount}
                        </span>
                      </div>
                    </Link>

                    {/* Remaining stories as an index, the way a magazine sets a
                        contents list rather than a grid of equal cards. */}
                    <div className="divide-y" style={{ borderColor: '#E4D9C4' }}>
                      {rest.slice(0, 5).map((post) => (
                        <Link
                          key={post.id}
                          href={`/blogs/${post.id}`}
                          className="group flex gap-5 py-5 first:pt-0"
                        >
                          <div
                            className="relative w-28 h-20 shrink-0 rounded overflow-hidden"
                            style={{ backgroundColor: '#E4D9C4' }}
                          >
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : post.coverType === 'video' && post.coverVideoUrl ? (
                              <VideoThumbnail
                                videoUrl={post.coverVideoUrl}
                                title={post.title}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen size={20} className="text-white/60" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            {post.category && (
                              <p
                                className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1.5"
                                style={{ color: '#B4502A' }}
                              >
                                {post.category}
                              </p>
                            )}
                            <h4
                              className="font-heading text-base font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors"
                              style={{ color: '#2C2416' }}
                            >
                              {post.title}
                            </h4>
                            <div
                              className="flex items-center gap-3 text-[11px]"
                              style={{ color: '#6B5D52' }}
                            >
                              <span className="truncate">
                                {post.author?.user?.name || 'Mama Africa Library'}
                              </span>
                              <span className="inline-flex items-center gap-1 shrink-0">
                                <Clock size={11} />
                                {calculateReadTime(post.content).text}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {blogPosts.length > 6 && (
                    <div className="mt-14">
                      <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 font-semibold transition-colors group"
                        style={{ color: '#B4502A' }}
                      >
                        <span
                          className="border-b-2 pb-0.5 group-hover:border-current"
                          style={{ borderColor: 'transparent' }}
                        >
                          Read all {blogPosts.length} stories
                        </span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* 05 — Library at a glance. Every figure is a real count from the
                API; the previous "98% Reader Satisfaction" was invented. */}
            <section className="editorial-section pt-0">
              <div
                className="rounded-2xl p-8 md:p-12"
                style={{
                  background:
                    'linear-gradient(135deg, #F5F1E8 0%, #FFFCF5 100%)',
                  border: '1px solid #E4D9C4',
                }}
              >
                <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 items-center">
                  <div>
                    <p className="editorial-eyebrow editorial-eyebrow-rule mb-4">By the numbers</p>
                    <h2
                      className="font-heading text-2xl md:text-3xl font-bold leading-tight"
                      style={{ color: '#2C2416' }}
                    >
                      A young, growing library
                    </h2>
                  </div>

                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {[
                      { label: 'Books published', value: books.length },
                      { label: 'Authors', value: authors.length },
                      { label: 'Stories', value: blogPosts.length },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <dd
                          className="font-heading text-4xl md:text-5xl font-bold mb-1.5"
                          style={{ color: '#B4502A' }}
                        >
                          {stat.value}
                        </dd>
                        <dt className="text-sm" style={{ color: '#5B4F42' }}>
                          {stat.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>

            {/* 06 — Closing call to action */}
            <section className="pb-8 md:pb-12">
              <div
                className="relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center"
                style={{ backgroundColor: '#2C2416' }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 25%, #B4502A 0%, transparent 45%), radial-gradient(circle at 80% 75%, #A8762B 0%, transparent 45%)',
                  }}
                  aria-hidden="true"
                />
                <div className="relative max-w-2xl mx-auto">
                  <p
                    className="font-mono text-[11px] uppercase tracking-[0.28em] mb-6"
                    style={{ color: '#E8A87C' }}
                  >
                    Read · Write · Preserve
                  </p>
                  <h2
                    className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
                    style={{ color: '#FFFCF5' }}
                  >
                    Help keep the record alive
                  </h2>
                  <p
                    className="text-base md:text-lg mb-10 leading-relaxed"
                    style={{ color: 'rgba(255, 252, 245, 0.82)' }}
                  >
                    Read what our authors have preserved, or publish the history
                    only you can tell.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: '#B4502A', color: '#FFFCF5' }}
                    >
                      Browse Books
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/dashboard/author/register"
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold transition-colors"
                      style={{
                        color: '#FFFCF5',
                        border: '1px solid rgba(255, 252, 245, 0.35)',
                      }}
                    >
                      Become an Author
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
