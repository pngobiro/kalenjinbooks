'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Compass, MapPin, BookOpen, Star, Mountain, Feather, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAuthors, Author } from '@/lib/api/authors';

// Gradients pulled from the Rift Valley highlands — matches the homepage trail.
const trailGradients = [
  'from-[#A8451F] to-[#E0A83E]',
  'from-[#33502F] to-[#5C7A4E]',
  'from-[#2A2244] to-[#4A3B6B]',
  'from-[#8C3B2E] to-[#C97B3D]',
  'from-[#1F4D3D] to-[#3D7A5C]',
  'from-[#5B3A29] to-[#9C6B3E]',
];

const ridgeLabels = [
  '2,400M · ITEN RIDGE',
  '1,800M · KERIO VALLEY',
  '2,100M · CHERANGANI HILLS',
  '2,700M · TUGEN HILLS',
  '1,500M · NANDI ESCARPMENT',
  '2,000M · KIPSIGIS HIGHLANDS',
];

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAuthors() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAuthors({ limit: 50 });
        setAuthors(response?.data || []);
      } catch (e) {
        console.error('Failed to fetch authors:', e);
        setError(e instanceof Error ? e.message : 'Failed to load authors');
      } finally {
        setLoading(false);
      }
    }

    loadAuthors();
  }, []);

  const filteredAuthors = authors.filter((author) => {
    const q = searchQuery.toLowerCase();
    return (
      author.name?.toLowerCase().includes(q) ||
      author.bio?.toLowerCase().includes(q) ||
      author.location?.toLowerCase().includes(q) ||
      author.genres?.toLowerCase().includes(q)
    );
  });

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
      `}</style>

      <div className="kr-root">
        <Navbar />

        {/* Hero — dusk over the escarpment */}
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#3A2E57_0%,_#1B1730_55%,_#140F24_100%)]">
          <svg
            className="absolute inset-x-0 bottom-0 w-full h-8 md:h-10 text-[#140F24]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 L120,55 L240,90 L360,40 L480,70 L600,20 L720,60 L840,35 L960,75 L1080,45 L1200,65 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10 md:pt-14 md:pb-12">
            <div className="max-w-3xl mx-auto text-center kr-rise">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <Compass size={13} className="text-[#E0A83E]" />
                <span className="kr-mono text-[10px] tracking-[0.25em] text-[#E0A83E]">
                  THE STORYTELLERS · WAYPOINT
                </span>
              </div>
              <h1 className="kr-display italic text-3xl md:text-[2.6rem] lg:text-5xl text-white leading-[1.08] mb-3">
                The voices behind the shelf.
              </h1>
              <p className="text-sm md:text-base text-[#D8CFE8] leading-relaxed mb-6 max-w-2xl mx-auto">
                Every trail has its guides. These are the Kalenjin storytellers, scholars, and
                keepers of memory who mark the route you&apos;re walking.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A7B68]" />
                <input
                  type="text"
                  placeholder="Find a storyteller, a ridge, a genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-3.5 bg-[#FBF7EE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E0A83E]/40 text-[#241E1A] text-sm shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Waypoint header */}
          <div className="relative py-2 select-none mb-8">
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
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">CAMP DIRECTORY</span>
              <Mountain size={16} className="text-[#A8451F]" />
              <h2 className="kr-display italic text-3xl md:text-[2.6rem] leading-none text-[#241E1A]">
                Meet the Storytellers
              </h2>
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">2,400M · ITEN RIDGE</span>
            </div>
          </div>

          {!loading && !error && (
            <p className="text-center kr-mono text-[10px] tracking-[0.25em] text-[#8A7B68] mb-10">
              {filteredAuthors.length} STORYTELLER{filteredAuthors.length === 1 ? '' : 'S'} ON THE TRAIL
              {searchQuery && ` · MATCHING “${searchQuery.toUpperCase()}”`}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-[#e6ded0] rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#A8451F] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="kr-mono text-[10px] tracking-[0.3em] text-[#8A7B68]">
                MARKING THE WAYPOINTS…
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-medium mb-2">Error loading authors</p>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Authors Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuthors.length > 0 ? (
                filteredAuthors.map((author, index) => {
                  const scheme = trailGradients[index % trailGradients.length];
                  const ridge = ridgeLabels[index % ridgeLabels.length];
                  const initials = (author.name || 'A')
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  return (
                    <Link key={author.id} href={`/authors/${author.id}`} className="group">
                      <div className="relative h-full rounded-3xl bg-[#FBF7EE] border border-[#E4D9C4] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col">
                        {/* Gradient headband */}
                        <div className={`h-20 bg-gradient-to-br ${scheme} opacity-90`}>
                          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-[#FBF7EE]/10 to-transparent" />
                        </div>

                        {/* Contour ring badge */}
                        <div className="absolute -top-5 right-5 w-16 h-16 opacity-25 pointer-events-none" aria-hidden="true">
                          <div className="absolute inset-0 rounded-full border-2 border-white" />
                          <div className="absolute inset-2.5 rounded-full border-2 border-white" />
                          <div className="absolute inset-5 rounded-full border-2 border-white" />
                        </div>

                        {/* Avatar */}
                        <div className="relative px-6 pb-6 -mt-10 flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#FBF7EE] shadow-lg mb-3">
                            {author.profileImage ? (
                              <img src={author.profileImage} alt={author.name || 'Author'} className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${scheme} flex items-center justify-center`}>
                                <span className="kr-display italic text-3xl text-white">{initials}</span>
                              </div>
                            )}
                          </div>

                          <h3 className="kr-display italic text-2xl text-[#241E1A] leading-tight group-hover:text-[#A8451F] transition-colors mb-1">
                            {author.name || 'Unknown Author'}
                          </h3>

                          <span className="kr-mono text-[9px] tracking-[0.25em] text-[#A8451F] mb-3">{ridge}</span>

                          <p className="text-xs text-[#5B4F42] leading-relaxed line-clamp-3 mb-4">
                            {author.bio || 'A storyteller on KaleeReads, marking their waypoint on the trail.'}
                          </p>

                          {author.genres && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                              {author.genres.split(',').slice(0, 3).map((genre) => (
                                <span key={genre.trim()} className="px-2.5 py-1 bg-[#EDE4D0] text-[#5B4F42] rounded-full text-[10px] font-medium">
                                  {genre.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Meta row */}
                          <div className="w-full mt-auto pt-4 border-t border-dashed border-[#E4D9C4] flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs text-[#5B4F42]">
                              <BookOpen size={13} className="text-[#A8451F]" />
                              {author.booksCount} {author.booksCount === 1 ? 'book' : 'books'}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-[#5B4F42]">
                              <Star size={13} className="fill-[#E0A83E] text-[#E0A83E]" />
                              {author.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="flex items-center gap-1 text-[#8A7B68]">
                              <MapPin size={12} />
                              <span className="text-[11px]">{author.location || author.nationality || 'Highlands'}</span>
                            </span>
                          </div>

                          <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#A8451F] group-hover:gap-2 transition-all">
                            View trail <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-[#EDE4D0] flex items-center justify-center mx-auto mb-5">
                    <Feather size={28} className="text-[#A8451F]" />
                  </div>
                  <h3 className="kr-display italic text-2xl text-[#241E1A] mb-2">
                    No trail leads here yet.
                  </h3>
                  <p className="text-sm text-[#8A7B68] mb-6">
                    {searchQuery ? 'No storytellers found matching your search.' : 'No authors available yet.'}
                  </p>
                  <Link
                    href="/dashboard/author/register"
                    className="inline-flex items-center gap-1 bg-[#A8451F] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#8C3B2E] transition-colors"
                  >
                    Become an Author
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
