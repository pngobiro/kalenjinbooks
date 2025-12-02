'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Book, Image as ImageIcon } from 'lucide-react';
import { BookFilters } from '@/components/books/BookFilters';
import { BookCard } from '@/components/books/BookCard';

// Mock data - would come from API
const books = [
    {
        id: '1',
        title: 'Kalenjin Folklore Tales',
        author: 'John Kamau',
        price: 500,
        rating: 4.5,
        reviewCount: 24,
        category: 'Folklore',
        language: 'Kalenjin',
    },
    {
        id: '2',
        title: 'Traditional Wisdom',
        author: 'Jane Kiplagat',
        price: 750,
        rating: 4.8,
        reviewCount: 18,
        category: 'Non-Fiction',
        language: 'Bilingual',
    },
    {
        id: '3',
        title: 'Cultural Heritage',
        author: 'Mike Korir',
        price: 600,
        rating: 4.3,
        reviewCount: 31,
        category: 'History',
        language: 'English',
    },
    {
        id: '4',
        title: 'Children Stories',
        author: 'Sarah Chebet',
        price: 400,
        rating: 4.7,
        reviewCount: 42,
        category: 'Children',
        language: 'Kalenjin',
    },
    {
        id: '5',
        title: 'Modern Kalenjin Poetry',
        author: 'David Ruto',
        price: 550,
        rating: 4.6,
        reviewCount: 15,
        category: 'Poetry',
        language: 'Kalenjin',
    },
    {
        id: '6',
        title: 'Educational Guide',
        author: 'Mary Jepkoech',
        price: 800,
        rating: 4.9,
        reviewCount: 28,
        category: 'Education',
        language: 'Bilingual',
    },
    {
        id: '7',
        title: 'Historical Narratives',
        author: 'Peter Kibet',
        price: 650,
        rating: 4.4,
        reviewCount: 19,
        category: 'History',
        language: 'English',
    },
    {
        id: '8',
        title: 'Fiction Adventures',
        author: 'Grace Chepkemoi',
        price: 700,
        rating: 4.5,
        reviewCount: 33,
        category: 'Fiction',
        language: 'Kalenjin',
    },
];

export default function BooksPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<any>({
        categories: [],
        priceRange: [0, 2000],
        language: 'all',
    });

    // Filter books based on search and filters
    const filteredBooks = books.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filters.categories.length === 0 || filters.categories.includes(book.category);
        const matchesPrice = book.price <= filters.priceRange[1];
        const matchesLanguage = filters.language === 'all' || book.language.toLowerCase().includes(filters.language);

        return matchesSearch && matchesCategory && matchesPrice && matchesLanguage;
    });

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Navigation */}
            <nav className="bg-white border-b border-neutral-brown-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Book className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold text-neutral-brown-900">AfriReads</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-neutral-brown-700 hover:text-neutral-brown-900 font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard/author"
                                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-all"
                            >
                                Author Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* UI Mockup Reference */}
                <details className="mb-6 bg-white rounded-xl p-4 shadow-sm border-l-4 border-accent-gold">
                    <summary className="cursor-pointer font-semibold text-neutral-brown-900 flex items-center gap-2">
                        <ImageIcon size={20} className="text-accent-gold" />
                        View UI Design Mockup
                    </summary>
                    <div className="mt-4 border-t border-neutral-brown-500/10 pt-4">
                        <p className="text-sm text-neutral-brown-700 mb-3">
                            Reference design for books catalog:
                        </p>
                        <Image
                            src="/mockups/afrireads_books_catalog_1764672292136.png"
                            alt="Books Catalog Mockup"
                            width={1200}
                            height={800}
                            className="rounded-lg border border-neutral-brown-500/20"
                        />
                    </div>
                </details>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-brown-900 mb-2">
                        Browse Books
                    </h1>
                    <p className="text-lg text-neutral-brown-700">
                        Discover authentic Kalenjin literature from talented authors
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-700" size={20} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search books by title or author..."
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-md focus:shadow-lg focus:outline-none border-2 border-transparent focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-neutral-brown-700">
                        Showing <span className="font-semibold text-neutral-brown-900">{filteredBooks.length}</span> of{' '}
                        <span className="font-semibold text-neutral-brown-900">{books.length}</span> books
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <BookFilters onFilterChange={setFilters} />
                    </div>

                    {/* Books Grid */}
                    <div className="lg:col-span-3">
                        {filteredBooks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBooks.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                                <Book size={48} className="text-neutral-brown-500/20 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-neutral-brown-900 mb-2">
                                    No books found
                                </h3>
                                <p className="text-neutral-brown-700">
                                    Try adjusting your filters or search query
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredBooks.length > 0 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all">
                                    Previous
                                </button>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
                                    1
                                </button>
                                <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all">
                                    2
                                </button>
                                <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all">
                                    3
                                </button>
                                <button className="px-4 py-2 bg-white rounded-lg border border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary hover:text-primary transition-all">
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
