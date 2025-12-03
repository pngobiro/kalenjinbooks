'use client';

import { ArrowLeft, BookOpen, Star, User, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const authors = [
    {
        id: 1,
        name: "Dr. Kiprop Lagat",
        role: "Cultural Historian",
        bio: "Dr. Lagat has spent over 20 years documenting the oral traditions of the Kalenjin people. His work focuses on preserving the wisdom of elders for future generations.",
        booksCount: 5,
        rating: 4.9,
        image: "/images/author-kiprop.png",
        social: {
            twitter: "https://twitter.com/kiproplagat",
            facebook: "https://facebook.com/kiproplagat",
            linkedin: "https://linkedin.com/in/kiproplagat"
        }
    },
    {
        id: 2,
        name: "Chebet Rotich",
        role: "Children's Author",
        bio: "Chebet weaves magical tales that introduce young readers to African folklore. Her stories are known for their vibrant characters and moral lessons.",
        booksCount: 8,
        rating: 4.8,
        image: "/images/author-chebet.png",
        social: {
            twitter: "https://twitter.com/chebetrotich",
            instagram: "https://instagram.com/chebetrotich",
            facebook: "https://facebook.com/chebetrotich"
        }
    },
    {
        id: 3,
        name: "Kipchoge Keino",
        role: "Biographer",
        bio: "A legendary athlete turned writer, Kipchoge shares inspiring stories of resilience and triumph from the Rift Valley.",
        booksCount: 3,
        rating: 4.7,
        image: "https://ui-avatars.com/api/?name=Kipchoge+Keino&background=D97706&color=fff&size=200",
        social: {
            twitter: "https://twitter.com/kipchogewriter",
            linkedin: "https://linkedin.com/in/kipchogewriter"
        }
    },
    {
        id: 4,
        name: "Jepkorir Tanui",
        role: "Poet",
        bio: "Jepkorir's poetry captures the beauty of the Nandi Hills and the spirit of its people. Her verses are a celebration of identity and belonging.",
        booksCount: 4,
        rating: 4.9,
        image: "https://ui-avatars.com/api/?name=Jepkorir+Tanui&background=059669&color=fff&size=200",
        social: {
            twitter: "https://twitter.com/jepkorirpoet",
            instagram: "https://instagram.com/jepkorirpoet",
            facebook: "https://facebook.com/jepkorirpoet"
        }
    }
];

export default function AuthorsPage() {
    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading mb-6">Meet Our Authors</h1>
                    <p className="text-xl text-neutral-brown-700 max-w-2xl mx-auto">
                        The brilliant minds and voices behind the stories we love.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {authors.map((author) => (
                        <Link key={author.id} href={`/authors/${author.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-brown-500/10 hover:shadow-lg hover:border-primary/30 transition-all group">
                            <div className="p-8 text-center">
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-neutral-cream group-hover:border-primary transition-colors">
                                    <img
                                        src={author.image}
                                        alt={author.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-brown-900 font-heading mb-1">{author.name}</h3>
                                <p className="text-primary font-medium text-sm mb-4">{author.role}</p>
                                <p className="text-neutral-brown-600 text-sm leading-relaxed mb-6">
                                    {author.bio}
                                </p>

                                <div className="flex items-center justify-center gap-6 border-t border-neutral-brown-100 pt-6 mb-4">
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-neutral-brown-900 font-bold">
                                            <BookOpen size={16} className="text-accent-green" />
                                            <span>{author.booksCount}</span>
                                        </div>
                                        <div className="text-xs text-neutral-brown-500">Books</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-neutral-brown-900 font-bold">
                                            <Star size={16} className="text-accent-gold" />
                                            <span>{author.rating}</span>
                                        </div>
                                        <div className="text-xs text-neutral-brown-500">Rating</div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center justify-center gap-3">
                                    {author.social.twitter && (
                                        <a
                                            href={author.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-8 h-8 rounded-full bg-neutral-cream hover:bg-primary/10 flex items-center justify-center text-neutral-brown-500 hover:text-primary transition-all"
                                        >
                                            <Twitter size={16} />
                                        </a>
                                    )}
                                    {author.social.facebook && (
                                        <a
                                            href={author.social.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-8 h-8 rounded-full bg-neutral-cream hover:bg-primary/10 flex items-center justify-center text-neutral-brown-500 hover:text-primary transition-all"
                                        >
                                            <Facebook size={16} />
                                        </a>
                                    )}
                                    {author.social.instagram && (
                                        <a
                                            href={author.social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-8 h-8 rounded-full bg-neutral-cream hover:bg-primary/10 flex items-center justify-center text-neutral-brown-500 hover:text-primary transition-all"
                                        >
                                            <Instagram size={16} />
                                        </a>
                                    )}
                                    {author.social.linkedin && (
                                        <a
                                            href={author.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-8 h-8 rounded-full bg-neutral-cream hover:bg-primary/10 flex items-center justify-center text-neutral-brown-500 hover:text-primary transition-all"
                                        >
                                            <Linkedin size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="bg-neutral-cream p-4 text-center">
                                <div className="text-neutral-brown-900 font-bold text-sm group-hover:text-primary transition-colors flex items-center justify-center gap-2 w-full">
                                    View Profile <ArrowLeft size={16} className="rotate-180" />
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Join Us Card */}
                    <div className="bg-neutral-brown-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-brown-500/10 flex flex-col items-center justify-center text-center p-8 relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <User size={32} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-white font-heading mb-2">Become an Author</h3>
                            <p className="text-neutral-brown-300 text-sm mb-8">
                                Share your story with the world. Join our community of storytellers.
                            </p>
                            <Link
                                href="/contact"
                                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-full transition-all hover:-translate-y-1 inline-block"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
