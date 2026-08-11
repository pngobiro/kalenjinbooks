'use client';

import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Star, Globe,
  Twitter, Facebook, Instagram, Linkedin, Sparkles,
  BookMarked, ExternalLink, FileText, Play,
} from 'lucide-react';

const authorData = {
  name: 'Dr. Kibet Arap Soi',
  title: 'African Moses',
  profileImage: null,
  bio: `<p>Welcome to the official website of <strong>Dr. Kibet Arap Soi</strong>, an esteemed author, scholar, and leader whose impactful works have significantly contributed to the literary landscape. Dr. Soi's dedication to empowering the African Grassroot community is evident in his notable book, <em>"Immortal Knowledge: A Message to the African Grassroots,"</em> and his true yet comical work, <em>'Welcome to AMERICA: What It Takes to Shine in the Free World - Burst Your Bubble, Rise to New Horizons'.</em></p>

<p>With a repertoire of influential publications, Dr. Soi's <strong>"Immortal Knowledge: A Message to the African Grassroots"</strong> stands out as a beacon of enlightenment. Delving into the core challenges faced by the African Grassroot, the book offers a compelling narrative that weaves together wisdom, cultural richness, and a forward-looking perspective.</p>

<p>In his work, <strong>"Welcome to AMERICA,"</strong> Dr. Soi employs starlight bursts as a metaphor, creatively conveying the significance of breaking free from personal confines and embracing new opportunities.</p>

<h2>Explore Dr. Soi's World:</h2>

<p>This website is your gateway to the intellectual realm of Dr. Kibet Arap Soi. Discover more about the author, explore his other works, and stay informed about upcoming projects. Engage in a journey of knowledge and inspiration as you delve into the mind of a visionary committed to uplifting the African grassroots.</p>

<p>Explore his collection of <a href="/blogs">blogs</a> covering diverse topics from literature to societal insights. Immerse yourself in Dr. Soi's world with thought-provoking <a href="/videos">videos</a> and insightful <a href="/interviews">interviews</a>, delving deeper into his perspectives on various subjects.</p>

<p>Additionally, discover the profound insights awaiting you in the <a href="/liberation-library">Liberation Library</a>—a curated collection of books carefully selected to illuminate the road to liberation.</p>`,
  books: [
    {
      id: 'immortal-knowledge',
      title: 'Immortal Knowledge: A Message to the African Grassroots',
      description: 'Delving into the core challenges faced by the African Grassroot, this book offers a compelling narrative that weaves together wisdom, cultural richness, and a forward-looking perspective.',
      coverImage: null,
      amazonUrl: 'https://www.amazon.com/IMMORTAL-KNOWLEDGE-Message-African-Grassroots-ebook/dp/B08V5HSX2F',
      status: 'published',
    },
    {
      id: 'welcome-to-america',
      title: 'Welcome to AMERICA: What It Takes to Shine in the Free World',
      description: "Dr. Soi employs starlight bursts as a metaphor, creatively conveying the significance of breaking free from personal confines and embracing new opportunities.",
      coverImage: null,
      amazonUrl: null,
      status: 'coming-soon',
    },
  ],
  social: {
    website: 'https://dr-kibetarapsoi.com',
  },
  blogPosts: [
    {
      id: 'immortal-knowledge-launch',
      title: 'The Launch of Immortal Knowledge: A Message to the African Grassroots',
      date: 'March 15, 2024',
      coverImage: null,
      coverType: 'image',
      excerpt: 'Celebrating the release of Dr. Soi\'s groundbreaking book that aims to empower the African grassroots community.',
    },
    {
      id: 'understanding-african-grassroots',
      title: 'Understanding the African Grassroots: Challenges and Opportunities',
      date: 'February 28, 2024',
      coverImage: null,
      coverType: 'video',
      coverVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      excerpt: 'An in-depth look at the issues facing African communities and the paths forward.',
    },
    {
      id: 'welcome-to-america-insights',
      title: 'Welcome to AMERICA: Insights from the Journey',
      date: 'January 20, 2024',
      coverImage: null,
      coverType: 'video',
      coverVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      excerpt: 'Dr. Soi shares his experiences and lessons learned from navigating life in America.',
    },
    {
      id: 'literature-as-liberation',
      title: 'Literature as a Tool for Liberation',
      date: 'December 10, 2023',
      coverImage: null,
      coverType: 'image',
      excerpt: 'How books and writing can be powerful instruments for social change and empowerment.',
    },
    {
      id: 'empowering-next-generation',
      title: 'Empowering the Next Generation of African Writers',
      date: 'November 5, 2023',
      coverImage: null,
      coverType: 'video',
      coverVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      excerpt: 'Mentoring and inspiring young African authors to find their voices.',
    },
  ],
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
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>
            <Link href="/authors" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors text-sm">
              <ArrowLeft size={16} />
              <span>All Authors</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-2xl">
                {authorData.profileImage ? (
                  <img src={authorData.profileImage} alt={authorData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${colorScheme} flex items-center justify-center`}>
                    <span className="text-4xl font-bold text-white/80">KS</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-3">
                <Sparkles size={13} className="text-accent-gold" />
                <span className="text-white/90 text-xs font-medium">{authorData.title}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-3">
                {authorData.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-white/80">
                  <BookOpen size={15} />
                  <span className="font-semibold">{authorData.books.length}</span> books
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                {authorData.social.website && (
                  <a href={authorData.social.website} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                    <Globe size={16} className="text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content: Bio + Books */}
          <section className="lg:col-span-2 space-y-8">
            {/* Rich Text Bio */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-brown-100">
                <h2 className="text-xl font-bold text-neutral-brown-900 font-heading flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  About the Author
                </h2>
              </div>
              <div className="p-6">
                <div
                  className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-neutral-brown-900 prose-p:text-neutral-brown-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-brown-900 prose-em:text-neutral-brown-600"
                  dangerouslySetInnerHTML={{ __html: authorData.bio }}
                />
              </div>
            </div>

            {/* Books Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading flex items-center gap-2">
                  <BookMarked size={22} className="text-primary" />
                  Books
                </h2>
              </div>

              <div className="space-y-5">
                {authorData.books.map((book, index) => {
                  const bookColor = colorSchemes[index % colorSchemes.length];
                  const isComingSoon = book.status === 'coming-soon';

                  return (
                    <div key={book.id} className="group">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]">
                        <div className={`relative aspect-[2/3] sm:h-full overflow-hidden ${!book.coverImage ? `bg-gradient-to-br ${bookColor}` : ''}`}>
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen size={28} className="text-white/50" />
                            </div>
                          )}
                          {isComingSoon && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="px-3 py-1 bg-accent-gold text-neutral-brown-900 text-xs font-bold rounded-full uppercase tracking-wide">
                                Coming Soon
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-base text-neutral-brown-900 line-clamp-1 group-hover:text-primary transition-colors mb-1">
                              {book.title}
                            </h3>
                            {book.description && (
                              <p className="text-sm text-neutral-brown-600 line-clamp-3 mb-2">{book.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            {book.amazonUrl && (
                              <a
                                href={book.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-accent-gold text-neutral-brown-900 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-accent-gold/90 transition-colors"
                              >
                                <ExternalLink size={14} />
                                Buy on Amazon
                              </a>
                            )}
                            {isComingSoon && (
                              <span className="text-sm text-neutral-brown-500 italic">Available soon</span>
                            )}
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
          <aside className="lg:col-span-1 space-y-6">
            {/* Blog Posts */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-primary rounded-t-2xl">
                <h3 className="text-white font-heading font-bold flex items-center gap-2">
                  <FileText size={16} />
                  Blog Posts
                </h3>
              </div>
              <div className="divide-y divide-neutral-brown-100">
                {authorData.blogPosts.map((post, i) => {
                  const isVideo = post.coverType === 'video';
                  const youtubeThumbnail = isVideo ? getYouTubeThumbnail(post.coverVideoUrl || '') : null;

                  return (
                    <Link key={post.id} href={`/blogs/${post.id}`} className="flex items-start gap-3 p-4 hover:bg-neutral-cream/60 transition-colors group">
                      <div className={`w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br ${colorSchemes[i % colorSchemes.length]} flex items-center justify-center overflow-hidden relative`}>
                        {post.coverImage ? (
                          <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : youtubeThumbnail ? (
                          <img src={youtubeThumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-white/70" />
                        )}
                        {isVideo && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Play size={14} className="text-primary ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-brown-900 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-neutral-brown-500 mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <p className="text-xs text-neutral-brown-400 mt-1">
                          {post.date}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-neutral-brown-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-neutral-brown-400 text-sm">&copy; {new Date().getFullYear()} KaleeReads</p>
        </div>
      </footer>
    </div>
  );
}
