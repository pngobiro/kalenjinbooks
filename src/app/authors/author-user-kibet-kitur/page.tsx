'use client';

import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Globe, Sparkles,
  BookMarked, ExternalLink, Play, Star,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const authorData = {
  name: 'Dr. Kibet Arap Soi',
  title: 'African Moses',
  profileImage: null,
  bio: `<p><strong>Dr. Kibet Arap Soi</strong> is a Kalenjin author, scholar, and cultural advocate known for his work on African grassroots empowerment and Kalenjin heritage. He is often referred to as the "African Moses" for his dedication to liberating the African mind through knowledge.</p>

<h2>IMMORTAL KNOWLEDGE: A Message to the African Grassroots</h2>

<p><em>"Immortal Knowledge is a message to the African Grassroots. It blows the trumpet. It plays the African drum loud enough for all to hear. It calls on the Africans to end the dirge."</em></p>

<p>The African Grassroots need to understand what and where they have been and what they are. Most importantly, they must understand what they still must be and where they still must go.</p>

<p>They must build a new peaceful and harmonious African unity. They must write a new treaty canonized for economic freedom for themselves in this planet. They must hold brotherly and sisterly hands in the night in a vigil for the dark hour upon which the red pearly gates are going to open to usher in a revolution time with a whirlwind bringing forth their ancestors back to their distinguished rightful throne.</p>

<p>The African grassroots are rioting and rotting. They are a sitting tranquil dynamite. They need to know themselves; right away.</p>

<h2>The Message</h2>

<p>Immortal Knowledge shines the light to things known and unknown to the African. Immortal knowledge provides a succinct historical and scientific based message to the grassroots to revolutionize their thinking and ways of living.</p>

<p>Immortal Knowledge calls on them to heed the calling and step forward. They must pick up the challenge of the essential practice of selfishness for survival. They must start a mental revolution to change their African world by instilling self-confidence and eradicating foreign dependency.</p>

<p><strong>The revolution was yesterday and today. The revolution cannot wait for tomorrow. The revolution starts right now. By them. For them.</strong></p>

<h2>Kalenjin Heritage</h2>

<p>According to Dr. Kibet Arap Soi, the Kalenjin people originated from Egypt, where they worshiped the sun. This historical connection to ancient Egyptian civilization forms a cornerstone of his teachings about African identity and cultural pride.</p>`,
  books: [
    {
      id: 'immortal-knowledge',
      title: 'IMMORTAL KNOWLEDGE: A Message to the African Grassroots',
      description: 'A succinct historical and scientific based message to the grassroots to revolutionize their thinking and ways of living. The book calls on Africans to build a new peaceful and harmonious African unity.',
      coverImage: null,
      amazonUrl: 'https://www.amazon.com/IMMORTAL-KNOWLEDGE-Message-African-Grassroots-ebook/dp/B08V5HSX2F',
      status: 'published',
      price: 'KES 1,290',
      pages: 121,
      publishedDate: 'January 26, 2021',
    },
  ],
  videos: [
    {
      id: 'chumbeekab',
      title: 'CHUMBEEKAB KALENJIN - IMMORTAL KNOWLEDGE BY DR. KIBET ARAP SOI',
      url: 'https://www.youtube.com/watch?v=GzxxKA-rgc0',
      description: 'Dr. Kibet Arap Soi explains the origins of the Kalenjin people from Egypt and their ancient sun worship traditions.',
    },
  ],
  social: {
    website: 'https://dr-kibetarapsoi.com',
    facebook: 'https://facebook.com/DrKibetAfricanMoses',
  },
};

const colorSchemes = [
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
];

function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}

export default function AuthorUserKibetKiturPage() {
  const colorScheme = colorSchemes[0];

  return (
    <div className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-2xl">
                {authorData.profileImage ? (
                  <img src={authorData.profileImage} alt={authorData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                    <span className="text-3xl font-bold text-white/80">KS</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-2">
                <Sparkles size={12} className="text-accent-gold" />
                <span className="text-white/90 text-xs font-medium">{authorData.title}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white font-heading mb-2">
                {authorData.name}
              </h1>

              <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                {authorData.social.website && (
                  <a href={authorData.social.website} target="_blank" rel="noopener noreferrer"
                     className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                    <Globe size={14} className="text-white" />
                  </a>
                )}
                {authorData.social.facebook && (
                  <a href={authorData.social.facebook} target="_blank" rel="noopener noreferrer"
                     className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-white text-xs font-bold">f</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Bio + Books */}
          <section className="lg:col-span-2 space-y-6">
            {/* Rich Text Bio */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-brown-100">
                <h2 className="text-lg font-bold text-neutral-brown-900 font-heading flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  About the Author
                </h2>
              </div>
              <div className="p-5">
                <div
                  className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-neutral-brown-900 prose-p:text-neutral-brown-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-brown-900 prose-em:text-neutral-brown-600"
                  dangerouslySetInnerHTML={{ __html: authorData.bio }}
                />
              </div>
            </div>

            {/* Books Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-brown-900 font-heading flex items-center gap-2">
                  <BookMarked size={16} className="text-primary" />
                  Books
                </h2>
              </div>

              <div className="space-y-4">
                {authorData.books.map((book, index) => {
                  const bookColor = colorSchemes[index % colorSchemes.length];

                  return (
                    <div key={book.id} className="group">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr]">
                        <div className={`relative aspect-[2/3] sm:h-full overflow-hidden bg-gradient-to-br ${bookColor}`}>
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={24} className="text-white/50" />
                          </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-neutral-brown-900 line-clamp-2 group-hover:text-primary transition-colors mb-1">
                              {book.title}
                            </h3>
                            {book.description && (
                              <p className="text-xs text-neutral-brown-600 line-clamp-3 mb-2">{book.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-neutral-brown-500">
                              <span>{book.pages} pages</span>
                              <span>{book.publishedDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            {book.amazonUrl && (
                              <a
                                href={book.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-accent-gold text-neutral-brown-900 px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-accent-gold/90 transition-colors"
                              >
                                <ExternalLink size={12} />
                                Buy on Amazon
                              </a>
                            )}
                            <span className="text-xs font-bold text-primary">{book.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5">
            {/* Videos */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-primary rounded-t-2xl">
                <h3 className="text-white font-heading font-bold text-sm flex items-center gap-2">
                  <Play size={14} />
                  Videos
                </h3>
              </div>
              <div className="divide-y divide-neutral-brown-100">
                {authorData.videos.map((video, i) => {
                  const thumbnail = getYouTubeThumbnail(video.url);
                  return (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 hover:bg-neutral-cream/60 transition-colors group"
                    >
                      <div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-red-500 to-red-600 relative">
                        {thumbnail ? (
                          <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play size={16} className="text-white/70" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                            <Play size={10} className="text-primary ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-neutral-brown-900 line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-xs text-neutral-brown-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-neutral-brown-900 rounded-t-2xl">
                <h3 className="text-white font-heading font-bold text-sm flex items-center gap-2">
                  <Globe size={14} />
                  Links
                </h3>
              </div>
              <div className="p-3 space-y-2">
                <a
                  href={authorData.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-cream/60 transition-colors text-xs text-neutral-brown-700"
                >
                  <Globe size={14} className="text-primary" />
                  Official Website
                </a>
                <a
                  href={authorData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-cream/60 transition-colors text-xs text-neutral-brown-700"
                >
                  <span className="w-3.5 h-3.5 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">f</span>
                  Facebook Page
                </a>
                <a
                  href={authorData.books[0].amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-cream/60 transition-colors text-xs text-neutral-brown-700"
                >
                  <BookOpen size={14} className="text-accent-gold" />
                  Buy on Amazon
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
