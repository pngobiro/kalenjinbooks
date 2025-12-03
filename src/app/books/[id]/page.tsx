'use client';

import { Star, ShoppingCart, Share2, BookOpen, Clock, Calendar, ChevronRight, User, ArrowLeft, Check, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeaturedBooks } from '@/components/home/FeaturedBooks';

// Mock data for the specific book (ID 4)
const bookData = {
    id: '4',
    title: 'Children Stories',
    author: 'Sarah Chebet',
    price: 400, // Permanent price
    rentalPrice: 50, // Temporary price
    rating: 4.7,
    reviewCount: 128,
    category: 'Children',
    description: `Immerse your child in the magical world of African storytelling with this delightful collection of fables and adventures. "Children Stories" brings together age-old wisdom and modern narratives, featuring beloved characters like the clever hare, the mighty lion, and the wise tortoise.

  Each story is crafted to entertain while imparting valuable life lessons about friendship, courage, and honesty. Perfect for bedtime reading or classroom sessions, this book is beautifully illustrated to capture young imaginations.`,
    image: '/books/children-stories.png',
    pages: 120,
    language: 'English & Kalenjin',
    published: '2023',
    isbn: '978-3-16-148410-0',
    tags: ['Folklore', 'Animals', 'Education', 'Bilingual'],
};

// Mock related books
const relatedBooks = [
    {
        id: '1',
        title: 'Kalenjin Folklore Tales',
        author: 'John Kamau',
        price: 500,
        rating: 4.5,
        category: 'Folklore',
        image: '/books/folklore-tales.png',
    },
    {
        id: '6',
        title: 'Animal Fables',
        author: 'Rose Kemunto',
        price: 350,
        rating: 4.2,
        category: 'Children',
    },
    {
        id: '7',
        title: 'My First Kalenjin Words',
        author: 'David Ruto',
        price: 450,
        rating: 4.8,
        category: 'Education',
    },
    {
        id: '8',
        title: 'The Lion\'s Roar',
        author: 'Sarah Chebet',
        price: 420,
        rating: 4.6,
        category: 'Children',
    },
];

export default function BookDetailPage({ params }: { params: { id: string } }) {
    const [purchaseType, setPurchaseType] = useState<'permanent' | 'temporary'>('permanent');
    const router = useRouter();

    const currentPrice = purchaseType === 'permanent' ? bookData.price : bookData.rentalPrice;

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Top Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-sm w-full sticky top-0 z-50 border-b border-neutral-brown-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <BookOpen className="text-primary" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                                Books
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                            <Link href="/authors" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                                Authors
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                            <Link href="/about" className="text-neutral-brown-700 hover:text-primary font-medium transition-colors relative group">
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </div>

                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="hidden sm:inline">Back</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center gap-2 text-sm text-neutral-brown-500">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/books" className="hover:text-primary transition-colors">Books</Link>
                    <ChevronRight size={14} />
                    <span className="text-neutral-brown-900 font-medium truncate max-w-[200px]">{bookData.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Left Column: Book Image */}
                    <div className="lg:col-span-2 relative">
                        <div className="sticky top-28">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-white p-6 border border-neutral-brown-500/10">
                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-neutral-cream to-white">
                                    <img
                                        src={bookData.image}
                                        alt={bookData.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            {/* Decorative background blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-0"></div>
                        </div>
                    </div>

                    {/* Right Column: Book Details */}
                    <div className="lg:col-span-3">
                        <div className="mb-4">
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                                {bookData.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-brown-900 font-heading mb-6 leading-[1.1]">
                            {bookData.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-neutral-brown-500/10">
                            <Link href={`/authors/${bookData.author}`} className="flex items-center gap-3 group">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                    <User size={20} className="text-neutral-brown-700" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-brown-500 uppercase tracking-wide font-medium">Author</div>
                                    <span className="text-lg text-neutral-brown-900 font-semibold group-hover:text-primary transition-colors">
                                        {bookData.author}
                                    </span>
                                </div>
                            </Link>
                            <div className="w-px h-12 bg-neutral-brown-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={i < Math.floor(bookData.rating) ? 'fill-accent-gold text-accent-gold' : 'text-neutral-brown-300'}
                                        />
                                    ))}
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-brown-900 text-lg">{bookData.rating}</div>
                                    <div className="text-xs text-neutral-brown-500">({bookData.reviewCount} reviews)</div>
                                </div>
                            </div>
                        </div>

                        {/* Purchase Options */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-brown-500/10 mb-8">
                            <h3 className="text-xl font-bold text-neutral-brown-900 mb-6 font-heading">Select Access Type</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                                {/* Permanent Option */}
                                <div
                                    onClick={() => setPurchaseType('permanent')}
                                    className={`cursor-pointer rounded-2xl p-6 border-3 transition-all relative overflow-hidden group ${purchaseType === 'permanent'
                                        ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-xl scale-[1.03] ring-2 ring-primary/20'
                                        : 'border-neutral-brown-200 hover:border-primary/50 hover:shadow-md bg-white'
                                        }`}
                                >
                                    {purchaseType === 'permanent' && (
                                        <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <Check size={18} className="text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${purchaseType === 'permanent' ? 'bg-primary text-white shadow-lg' : 'bg-neutral-brown-100 text-neutral-brown-400'}`}>
                                                <BookOpen size={24} />
                                            </div>
                                            <div className="font-bold text-lg text-neutral-brown-900">Permanent Purchase</div>
                                        </div>
                                        <div className={`text-4xl font-bold mb-3 font-heading ${purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-700'}`}>
                                            KES {bookData.price}
                                        </div>
                                        <div className="text-sm text-neutral-brown-600 leading-relaxed">Own this book forever. Download PDF anytime.</div>
                                    </div>
                                </div>

                                {/* Temporary Option */}
                                <div
                                    onClick={() => setPurchaseType('temporary')}
                                    className={`cursor-pointer rounded-2xl p-6 border-3 transition-all relative overflow-hidden group ${purchaseType === 'temporary'
                                        ? 'border-accent-green bg-gradient-to-br from-accent-green/10 via-accent-green/5 to-transparent shadow-xl scale-[1.03] ring-2 ring-accent-green/20'
                                        : 'border-neutral-brown-200 hover:border-accent-green/50 hover:shadow-md bg-white'
                                        }`}
                                >
                                    {purchaseType === 'temporary' && (
                                        <div className="absolute top-4 right-4 w-8 h-8 bg-accent-green rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <Check size={18} className="text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${purchaseType === 'temporary' ? 'bg-accent-green text-white shadow-lg' : 'bg-neutral-brown-100 text-neutral-brown-400'}`}>
                                                <Clock size={24} />
                                            </div>
                                            <div className="font-bold text-lg text-neutral-brown-900">24-Hour Access</div>
                                        </div>
                                        <div className={`text-4xl font-bold mb-3 font-heading ${purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-700'}`}>
                                            KES {bookData.rentalPrice}
                                        </div>
                                        <div className="text-sm text-neutral-brown-600 leading-relaxed">Read online for 24 hours. No download.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary & Actions */}
                            <div className="flex flex-col gap-4">
                                <Link
                                    href={`/payment?bookId=${bookData.id}&author=${encodeURIComponent(bookData.author)}&type=${purchaseType}&price=${currentPrice}&title=${encodeURIComponent(bookData.title)}`}
                                    className={`w-full font-bold px-8 py-5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 text-white text-lg ${purchaseType === 'permanent' ? 'bg-primary hover:bg-primary-dark' : 'bg-accent-green hover:bg-[#7A8C74]'
                                        }`}
                                >
                                    <ShoppingCart size={22} />
                                    Choose Payment Method - KES {currentPrice}
                                </Link>
                                <p className="text-center text-sm text-neutral-brown-500">
                                    Select from M-Pesa, Stripe, or other payment options
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-neutral-brown-700 leading-relaxed mb-8 font-body">
                            {bookData.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 border-y border-neutral-brown-500/10 py-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-neutral-brown-500 uppercase font-bold tracking-wider">Pages</span>
                                <div className="flex items-center gap-2 text-neutral-brown-900 font-medium">
                                    <BookOpen size={18} className="text-primary" />
                                    {bookData.pages}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-neutral-brown-500 uppercase font-bold tracking-wider">Language</span>
                                <div className="flex items-center gap-2 text-neutral-brown-900 font-medium">
                                    <span className="text-primary font-serif italic">Aa</span>
                                    {bookData.language}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-neutral-brown-500 uppercase font-bold tracking-wider">Published</span>
                                <div className="flex items-center gap-2 text-neutral-brown-900 font-medium">
                                    <Calendar size={18} className="text-primary" />
                                    {bookData.published}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-neutral-brown-500 uppercase font-bold tracking-wider">Format</span>
                                <div className="flex items-center gap-2 text-neutral-brown-900 font-medium">
                                    <Clock size={18} className="text-primary" />
                                    {purchaseType === 'permanent' ? 'PDF Download' : 'Online Reader'}
                                </div>
                            </div>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex gap-4">
                            <Link
                                href={`/request-hard-copy?book=${encodeURIComponent(bookData.title)}&id=${bookData.id}`}
                                className="flex-1 py-3 border-2 border-primary/30 bg-primary/5 rounded-full text-primary hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <Package size={20} /> Request Hard Copy
                            </Link>
                            <button className="flex-1 py-3 border-2 border-neutral-brown-200 rounded-full text-neutral-brown-500 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center justify-center gap-2 font-medium">
                                <Share2 size={20} /> Share Book
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-8">
                            {bookData.tags.map((tag) => (
                                <span key={tag} className="text-sm text-neutral-brown-500 bg-neutral-brown-100 px-3 py-1 rounded-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Books Section */}
            <div className="mt-24 border-t border-neutral-brown-500/10 pt-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <h2 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-8">You May Also Like</h2>
                    <FeaturedBooks books={relatedBooks} />
                </div>
            </div>
        </div>
    );
}
