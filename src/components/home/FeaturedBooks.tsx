'use client';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    rating: number;
    category: string;
    image?: string;
}

interface FeaturedBooksProps {
    books: Book[];
}

// Vibrant color schemes for book cards (fallback if no image)
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

export function FeaturedBooks({ books }: FeaturedBooksProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const booksPerPage = 4;

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + booksPerPage >= books.length ? 0 : prev + booksPerPage
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, books.length - booksPerPage) : prev - booksPerPage
        );
    };

    const visibleBooks = books.slice(currentIndex, currentIndex + booksPerPage);

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-12">
                {/* Centered Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-2">Featured Books</h2>
                    <p className="text-neutral-brown-700 font-body">Discover our curated collection of Kalenjin literature</p>
                </div>

                {/* Centered Navigation buttons */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <button
                        onClick={prevSlide}
                        className="bg-accent-green hover:bg-accent-green/90 text-white rounded-lg p-3 transition-all shadow-md hover:shadow-lg"
                        aria-label="Previous books"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="bg-accent-green hover:bg-accent-green/90 text-white rounded-lg p-3 transition-all shadow-md hover:shadow-lg"
                        aria-label="Next books"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Book Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {visibleBooks.map((book, index) => {
                        const colorScheme = colorSchemes[index % colorSchemes.length];
                        return (
                            <Link key={book.id} href={`/books/${book.id}`}>
                                <div className="group cursor-pointer">
                                    {/* Book Cover */}
                                    <div className={`aspect-[2/3] rounded-2xl mb-4 overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${!book.image ? `bg-gradient-to-br ${colorScheme}` : ''}`}>
                                        {book.image ? (
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            /* Decorative pattern overlay for gradient fallback */
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
                                        )}

                                        {/* Content overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="font-heading font-bold text-lg text-neutral-brown-900 mb-1 line-clamp-2">
                                                    {book.title}
                                                </h3>
                                                <p className="text-sm text-neutral-brown-700 font-body mb-2">{book.author}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-primary">KES {book.price}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star size={16} className="fill-accent-gold text-accent-gold" />
                                                        <span className="text-sm font-medium text-neutral-brown-700">{book.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category badge */}
                                    <div className="flex items-center justify-between">
                                        <span className="inline-block px-3 py-1 bg-neutral-cream text-neutral-brown-700 text-xs font-medium rounded-full">
                                            {book.category}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/books"
                        className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-4 rounded-full transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                        View All Books →
                    </Link>
                </div>
            </div>
        </div>
    );
}
