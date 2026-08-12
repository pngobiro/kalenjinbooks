'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  Compass,
  Mountain,
  MapPin,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchBooks, type Book as BookType } from '@/lib/api/books';
import { fetchBlogPosts, type BlogPost } from '@/lib/api/blogs';
import { fetchAuthors, type Author } from '@/lib/api/authors';
import { calculateReadTime } from '@/lib/blog-utils';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

// Gradients pulled from the Rift Valley highlands rather than a generic swatch set:
// clay soil, escarpment tea-green, dusk plum, terracotta, deep forest, sun-baked earth.
const trailGradients = [
  'from-[#A8451F] to-[#E0A83E]',
  'from-[#33502F] to-[#5C7A4E]',
  'from-[#2A2244] to-[#4A3B6B]',
  'from-[#8C3B2E] to-[#C97B3D]',
  'from-[#1F4D3D] to-[#3D7A5C]',
  'from-[#5B3A29] to-[#9C6B3E]',
];

const waypoints = {
  authors: { label: 'THE STORYTELLERS', meta: '2,400M · ITEN RIDGE' },
  books: { label: 'THE GRANARY', meta: '1,800M · KERIO VALLEY' },
  blog: { label: 'FIELD NOTES', meta: '2,100M · CHERANGANI HILLS' },
};

function TrailDivider({
  index,
  label,
  meta,
}: {
  index: string;
  label: string;
  meta: string;
}) {
  return (
    <div className="relative py-2 select-none" aria-hidden="false">
      <svg
        viewBox="0 0 800 44"
        className="w-full h-10 text-[#A8451F]/25"
        preserveAspectRatio="none"
      >
        <path
          d="M0,24 L260,24 L300,8 L336,36 L372,14 L404,24 L800,24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="336" cy="24" r="5" fill="#A8451F" />
        <circle cx="336" cy="24" r="9" fill="none" stroke="#A8451F" strokeOpacity="0.35" strokeWidth="1.5" />
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 -mt-3">
        <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">{index}</span>
        <Mountain size={16} className="text-[#A8451F]" />
        <h2 className="kr-display italic text-3xl md:text-[2.6rem] leading-none text-[#241E1A]">
          {label}
        </h2>
        <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">{meta}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const [booksRes, blogsRes, authorsRes] = await Promise.all([
          fetchBooks({ limit: 100 }).catch(() => null),
          fetchBlogPosts({ published: true, limit: 100 }).catch(() => null),
          fetchAuthors({ limit: 50 }).catch(() => null),
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

  const n = authors.length;
  const dial = useMemo(() => {
    const ARC_SPACING = 88;
    const MIN_RADIUS = 130;
    const MAX_RADIUS = 250;
    const AVATAR = 76;
    const radius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, (ARC_SPACING * n) / (2 * Math.PI)));
    return { radius, size: (radius + AVATAR / 2 + 42) * 2, avatar: AVATAR };
  }, [n]);

  const dialRef = useRef<HTMLDivElement>(null);
  const [dialScale, setDialScale] = useState(1);
  const [hoverAuthorId, setHoverAuthorId] = useState<string | null>(null);
  const hoveredAuthor = hoverAuthorId ? authors.find((a) => a.id === hoverAuthorId) : null;
  const hoveredBooks = hoveredAuthor ? books.filter((b) => b.author?.id === hoveredAuthor.id) : [];
  const hoveredPosts = hoveredAuthor ? blogPosts.filter((p) => p.authorId === hoveredAuthor.id) : [];

  useEffect(() => {
    const el = dialRef.current;
    if (!el || dial.size <= 0) return;
    const update = () => setDialScale(Math.min(1, (el.clientWidth - 8) / dial.size));
    update();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [dial.size, authors.length]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (dir: number) => {
    const el = carouselRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F3EEE2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .kr-display { font-family: 'Instrument Serif', Georgia, serif; }
        .kr-body { font-family: 'Manrope', system-ui, sans-serif; }
        .kr-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        .kr-root, .kr-root * { font-family: 'Manrope', system-ui, sans-serif; }

        @keyframes krRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kr-rise { animation: krRise 0.7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .kr-rise { animation: none; }
        }

        .kr-contour {
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          border: 1px solid rgba(168, 69, 31, 0.35);
        }
        .kr-contour-2 {
          position: absolute;
          inset: -16px;
          border-radius: 9999px;
          border: 1px solid rgba(168, 69, 31, 0.18);
        }

        @keyframes krSpin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .kr-spin { animation: krSpin 40s linear infinite; }
        @keyframes krSpinFast {
          to { transform: rotate(360deg); }
        }
        .kr-spin-fast { animation: krSpinFast 12s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kr-spin, .kr-spin-fast { animation: none; }
        }
        .kr-scroll-none { scrollbar-width: none; }
        .kr-scroll-none::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="kr-root">
        <Navbar />

        {/* Hero — dusk over the escarpment */}
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#3A2E57_0%,_#1B1730_55%,_#140F24_100%)]">
          <svg
            className="absolute inset-x-0 bottom-0 w-full h-10 md:h-12 text-[#140F24]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 L120,55 L240,90 L360,40 L480,70 L600,20 L720,60 L840,35 L960,75 L1080,45 L1200,65 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-10 md:pt-6 md:pb-14">
            <div className="max-w-2xl kr-rise">
              <div className="inline-flex items-center gap-2 mb-2.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <Compass size={13} className="text-[#E0A83E]" />
                <span className="kr-mono text-[10px] tracking-[0.25em] text-[#E0A83E]">
                  A JOURNEY THROUGH KALENJIN LITERATURE
                </span>
              </div>
              <h1 className="kr-display italic text-3xl md:text-[2.6rem] text-white leading-[1.08] mb-3">
                Every story here has walked a long way to reach you.
              </h1>
              <p className="text-sm md:text-base text-[#D8CFE8] leading-relaxed mb-4 max-w-xl">
                KaleeReads is a highland home for Kalenjin literature — folklore carried by
                firelight, cultural history, and the everyday lives of a people who have always
                known how to cover distance. Local authors write it, we help it travel.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/books"
                  className="bg-[#E0A83E] text-[#1B1730] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#f0bc57] transition-colors"
                >
                  Browse the Shelf
                </Link>
                <Link
                  href="/authors"
                  className="bg-white/10 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/20 transition-colors border border-white/15"
                >
                  Meet the Storytellers
                </Link>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-[#e6ded0] rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#A8451F] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">
                CHARTING THE ROUTE…
              </span>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Waypoint I — Authors */}
              <section>
                <TrailDivider index="WAYPOINT I" {...waypoints.authors} />

                <div className="mt-8 lg:grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-10 lg:items-start">
                <div>
                {authors.length > 0 && (
                  <div ref={dialRef} className="mt-8 flex justify-center">
                    <div
                      className="relative"
                      style={{
                        width: dial.size,
                        height: dial.size,
                        transform: `scale(${dialScale})`,
                      }}
                    >
                      {/* Contour bands — like map elevation rings */}
                      {[0.24, 0.5, 0.76, 1].map((f, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full border"
                          style={{
                            left: '50%',
                            top: '50%',
                            width: dial.radius * 2 * f,
                            height: dial.radius * 2 * f,
                            transform: 'translate(-50%, -50%)',
                            borderColor: `rgba(168, 69, 31, ${(i + 1) * 0.06})`,
                          }}
                        />
                      ))}
                      <div
                        className="absolute rounded-full kr-spin"
                        style={{
                          left: '50%',
                          top: '50%',
                          width: dial.radius * 2,
                          height: dial.radius * 2,
                          transform: 'translate(-50%, -50%)',
                          border: '1px dashed rgba(168, 69, 31, 0.35)',
                        }}
                      />

                      {/* Hub — the compass rose */}
                      <Link
                        href="/authors"
                        aria-label="View all storytellers"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group/hub"
                      >
                        <div className="w-24 h-24 rounded-full bg-[#241E1A] flex flex-col items-center justify-center shadow-lg ring-4 ring-[#E0A83E]/30 group-hover/hub:ring-[#E0A83E]/60 group-hover/hub:scale-105 transition-all duration-300">
                          <Compass size={20} className="text-[#E0A83E] kr-spin-fast" />
                          <span className="kr-display italic text-2xl leading-none text-white mt-0.5">
                            {authors.length}
                          </span>
                          <span className="kr-mono text-[7px] tracking-[0.25em] text-[#C9BEA9] mt-0.5">
                            STORYTELLERS
                          </span>
                        </div>
                      </Link>

                      {/* Authors seated around the dial */}
                      {authors.map((author, i) => {
                        const angle = (i / authors.length) * 2 * Math.PI - Math.PI / 2;
                        const x = dial.radius * Math.cos(angle);
                        const y = dial.radius * Math.sin(angle);
                        const scheme = trailGradients[i % trailGradients.length];
                        return (
                          <Link
                            key={author.id}
                            href={`/authors/${author.id}`}
                            aria-label={author.name || 'Author'}
                            className="absolute z-[5] group"
                            style={{ left: '50%', top: '50%' }}
                            onMouseEnter={() => setHoverAuthorId(author.id)}
                            onMouseLeave={() => setHoverAuthorId((cur) => (cur === author.id ? null : cur))}
                          >
                            <div
                              className="flex flex-col items-center gap-1.5 group-hover:scale-110 transition-transform duration-300"
                              style={{
                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                              }}
                            >
                              <span
                                className={`block w-[76px] h-[76px] rounded-full bg-gradient-to-br ${scheme} p-[3px] ring-2 ring-white shadow-md overflow-hidden group-hover:shadow-xl transition-all duration-300`}
                              >
                                {author.profileImage ? (
                                  <img
                                    src={author.profileImage}
                                    alt={author.name || 'Author'}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className={`w-full h-full rounded-full bg-gradient-to-br ${scheme} flex items-center justify-center`}>
                                    <span className="kr-display italic text-2xl text-white">
                                      {author.name?.charAt(0) || 'A'}
                                    </span>
                                  </span>
                                )}
                              </span>
                              <span className="kr-mono text-[9px] tracking-[0.15em] text-[#5B4F42] uppercase whitespace-nowrap">
                                {author.name?.split(' ')[0] || 'Author'}
                              </span>
                            </div>
                          </Link>
                        );
                      })}

                    {/* Hover camp note — pinned to the centre like a landmark */}
                    {hoveredAuthor && (
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[240px] max-h-[320px] overflow-y-auto kr-scroll-none rounded-xl bg-[#FBF7EE] border border-[#E4D9C4] shadow-2xl p-4 rotate-[-1.5deg]"
                        onMouseLeave={() => setHoverAuthorId(null)}
                      >
                        <span className="kr-mono text-[8px] tracking-[0.25em] text-[#A8451F]">BASE CAMP</span>
                        <h4 className="kr-display italic text-lg text-[#241E1A] mt-0.5 leading-snug">
                          {hoveredAuthor.name}
                        </h4>

                        <div className="mt-3">
                          <p className="kr-mono text-[8px] tracking-[0.2em] text-[#8A7B68]">
                            BOOKS · {hoveredBooks.length}
                          </p>
                          <ul className="mt-1 space-y-1.5">
                            {hoveredBooks.slice(0, 5).map((b) => (
                              <li key={b.id}>
                                <Link
                                  href={`/books/${b.id}`}
                                  className="group/b text-xs text-[#5B4F42] hover:text-[#A8451F] transition-colors"
                                >
                                  <span className="font-semibold text-[#241E1A] group-hover/b:text-[#A8451F]">
                                    {b.title}
                                  </span>
                                  {b.price ? <span> · KES {b.price}</span> : null}
                                </Link>
                              </li>
                            ))}
                            {hoveredBooks.length === 0 && (
                              <li className="text-xs text-[#C9BEA9]">No books on the shelf yet.</li>
                            )}
                            {hoveredBooks.length > 5 && (
                              <li className="kr-mono text-[9px] text-[#A8451F]">+{hoveredBooks.length - 5} more…</li>
                            )}
                          </ul>
                        </div>

                        <div className="mt-3 pt-3 border-t border-dashed border-[#E4D9C4]">
                          <p className="kr-mono text-[8px] tracking-[0.2em] text-[#8A7B68]">
                            DISPATCHES · {hoveredPosts.length}
                          </p>
                          <ul className="mt-1 space-y-1.5">
                            {hoveredPosts.slice(0, 5).map((p) => (
                              <li key={p.id}>
                                <Link
                                  href={`/blogs/${p.slug || p.id}`}
                                  className="text-xs text-[#5B4F42] hover:text-[#A8451F] transition-colors line-clamp-1"
                                >
                                  {p.title}
                                </Link>
                              </li>
                            ))}
                            {hoveredPosts.length === 0 && (
                              <li className="text-xs text-[#C9BEA9]">No dispatches sent yet.</li>
                            )}
                            {hoveredPosts.length > 5 && (
                              <li className="kr-mono text-[9px] text-[#A8451F]">+{hoveredPosts.length - 5} more…</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                <div className="flex justify-center mt-6">
                  <Link
                    href="/authors"
                    className="inline-flex items-center gap-1 text-sm text-[#A8451F] hover:text-[#8C3B2E] font-semibold transition-colors"
                  >
                    See every storyteller <ChevronRight size={16} />
                  </Link>
                </div>
                </div>

                {blogPosts.length > 0 && (
                  <aside className="rounded-3xl bg-[#FBF7EE] border border-[#E4D9C4] shadow-sm p-5 md:p-6 mt-10 lg:mt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#A8451F]" />
                        <span className="kr-mono text-[10px] tracking-[0.3em] text-[#A8451F]">FIELD NOTES</span>
                      </div>
                      <span className="kr-mono text-[9px] tracking-[0.2em] text-[#8A7B68]">2,100M · CHERANGANI</span>
                    </div>
                    <div className="mt-3 divide-y divide-dashed divide-[#E4D9C4] overflow-y-auto max-h-[420px] kr-scroll-none pr-1">
                      {blogPosts.map((post, i) => (
                        <Link
                          key={post.id}
                          href={`/blogs/${post.slug || post.id}`}
                          className="group flex items-center gap-3 py-3.5 first:pt-4 last:pb-0"
                        >
                          {(() => {
                              const isVideo = post.coverType === 'video' && post.coverVideoUrl;
                              if (isVideo) {
                                return (
                                  <div className="shrink-0 w-24 h-[64px] rounded-lg overflow-hidden shadow-sm">
                                    <VideoThumbnail videoUrl={post.coverVideoUrl!} title={post.title} />
                                  </div>
                                );
                              }
                              if (post.coverImage) {
                                return (
                                  <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="shrink-0 w-24 h-[64px] rounded-lg object-cover shadow-sm"
                                  />
                                );
                              }
                              return (
                                <span className={`relative w-14 h-14 shrink-0 rounded-full bg-gradient-to-br ${trailGradients[i % trailGradients.length]} p-[2px] ring-1 ring-white/70`}>
                                  <span className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
                                    <span className="kr-display italic text-lg text-white">{post.title.charAt(0)}</span>
                                  </span>
                                </span>
                              );
                            })()}
                          <div className="flex-1 min-w-0">
                            <h4 className="kr-display italic text-sm text-[#241E1A] line-clamp-2 group-hover:text-[#A8451F] transition-colors leading-snug">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 kr-mono text-[9px] tracking-[0.1em] text-[#8A7B68]">
                              <span className="flex items-center gap-1"><Clock size={10} /> {calculateReadTime(post.content).text}</span>
                              <span className="flex items-center gap-1"><MapPin size={10} /> Dispatch {i + 1}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-dashed border-[#E4D9C4]">
                      <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1 text-sm text-[#A8451F] hover:text-[#8C3B2E] font-semibold transition-colors"
                      >
                        All field notes <ChevronRight size={16} />
                      </Link>
                    </div>
                  </aside>
                )}
              </div>
              </section>

              {/* Waypoint II — Books, presented as the granary */}
              <section>
                <TrailDivider index="WAYPOINT II" {...waypoints.books} />

                <div className="mt-8 rounded-3xl bg-[#EDE4D0] p-4 md:p-6">
                  <div className="relative">
                    <button
                      onClick={() => scrollCarousel(-1)}
                      aria-label="Previous books"
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#241E1A] text-[#E0A83E] shadow-lg flex items-center justify-center hover:bg-[#3A2E57] transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollCarousel(1)}
                      aria-label="Next books"
                      className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#241E1A] text-[#E0A83E] shadow-lg flex items-center justify-center hover:bg-[#3A2E57] transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div
                      ref={carouselRef}
                      className="kr-scroll-none flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {books.slice(0, 15).map((book, i) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="group shrink-0 snap-start w-40 sm:w-44 md:w-48 lg:w-52"
                        >
                          <div className="relative mb-3">
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                            <div className={`absolute inset-0 bg-gradient-to-br ${trailGradients[i % trailGradients.length]}`}>
                              {book.coverImage ? (
                                <>
                                  <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen size={32} className="text-white/30" />
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-black/25" />
                            {book.category && (
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[#241E1A] text-[10px] font-semibold uppercase tracking-wide rounded shadow-sm">
                                  {book.category}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                              <div className="flex items-center justify-between text-white text-xs">
                                <span className="font-bold">KES {book.price}</span>
                                {book.rating > 0 && (
                                  <div className="flex items-center gap-0.5">
                                    <Star size={10} className="fill-[#E0A83E] text-[#E0A83E]" />
                                    <span>{book.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-white text-[10px] font-medium mt-1">
                                Read more <span className="text-[#E0A83E]">→</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm text-[#241E1A] line-clamp-2 group-hover:text-[#A8451F] transition-colors leading-tight">
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#8A7B68] mt-0.5">
                          {book.author?.user?.name || 'Unknown Author'}
                        </p>
                      </Link>
                    ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-1 text-sm text-[#A8451F] hover:text-[#8C3B2E] font-semibold transition-colors"
                  >
                    Open the full shelf <ChevronRight size={16} />
                  </Link>
                </div>
              </section>

              {/* Trail's end — invitation */}
              <section className="relative overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_bottom,_#3A2E57_0%,_#1B1730_60%,_#140F24_100%)] p-8 md:p-12 text-center">
                <span className="kr-mono text-[10px] tracking-[0.3em] text-[#E0A83E]">END OF THE MARKED TRAIL — YOURS STARTS HERE</span>
                <h2 className="kr-display italic text-2xl md:text-4xl text-white mt-3 mb-3">
                  Add your voice to the route.
                </h2>
                <p className="text-[#D8CFE8] text-sm mb-6 max-w-lg mx-auto leading-relaxed">
                  Are you a Kalenjin author? Mark your own waypoint — bring your books and
                  dispatches to readers who are already walking this way.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/dashboard/author/register"
                    className="bg-[#E0A83E] text-[#1B1730] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#f0bc57] transition-colors"
                  >
                    Become an Author
                  </Link>
                  <Link
                    href="/about"
                    className="bg-white/10 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/20 transition-colors border border-white/15"
                  >
                    Learn More
                  </Link>
                </div>
              </section>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}