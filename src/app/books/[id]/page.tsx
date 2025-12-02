'use client';

import { Star, ShoppingCart, Heart, Share2, BookOpen, Clock, Calendar, ChevronRight, User, ArrowLeft, Check } from 'lucide-react';
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
    const [quantity, setQuantity] = useState(1);
    const [purchaseType, setPurchaseType] = useState<'permanent' | 'temporary'>('permanent');
    const router = useRouter();

    const currentPrice = purchaseType === 'permanent' ? bookData.price : bookData.rentalPrice;

    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            {/* Navigation Bar */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                >
                    <div className="w-10 h-10 rounded-full bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span>Back</span>
                </button>

                <div className="flex items-center gap-2 text-sm text-neutral-brown-500 hidden sm:flex">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/books" className="hover:text-primary transition-colors">Books</Link>
                    <ChevronRight size={14} />
                    <span className="text-neutral-brown-900 font-medium truncate max-w-[150px]">{bookData.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column: Book Image */}
                    <div className="relative">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-white p-4 border border-neutral-brown-500/10">
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                <img
                                    src={bookData.image}
                                    alt={bookData.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {/* Decorative background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-green/10 rounded-full blur-3xl -z-0"></div>
                    </div>

                    {/* Right Column: Book Details */}
                    <div>
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                                {bookData.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading mb-4 leading-tight">
                            {bookData.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-neutral-brown-200 flex items-center justify-center overflow-hidden">
                                    <User size={16} className="text-neutral-brown-700" />
                                </div>
                                <span className="text-lg text-neutral-brown-700 font-medium">
                                    By <span className="text-neutral-brown-900 underline decoration-primary/30 underline-offset-4">{bookData.author}</span>
                                </span>
                            </div>
                            <div className="w-px h-6 bg-neutral-brown-300"></div>
                            <div className="flex items-center gap-1">
                                <Star size={18} className="fill-accent-gold text-accent-gold" />
                                <span className="font-bold text-neutral-brown-900">{bookData.rating}</span>
                                <span className="text-neutral-brown-500 text-sm">({bookData.reviewCount} reviews)</span>
                            </div>
                        </div>

                        {/* Purchase Options */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-brown-500/10 mb-8">
                            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Select Access Type</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {/* Permanent Option */}
                                <div
                                    onClick={() => setPurchaseType('permanent')}
                                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative overflow-hidden group ${purchaseType === 'permanent'
                                            ? 'border-primary shadow-lg scale-[1.02]'
                                            : 'border-neutral-brown-200 hover:border-primary/50 hover:shadow-md'
                                        }`}
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 opacity-10 transition-opacity ${purchaseType === 'permanent' ? 'bg-gradient-to-br from-primary to-orange-600 opacity-10' : 'bg-gradient-to-br from-neutral-brown-200 to-neutral-brown-100 opacity-0 group-hover:opacity-5'
                                        }`}></div>

                                    {purchaseType === 'permanent' && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="font-bold text-neutral-brown-900 mb-1 flex items-center gap-2">
                                            <BookOpen size={18} className={purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-400'} />
                                            Permanent Purchase
                                        </div>
                                        <div className={`text-2xl font-bold mb-1 ${purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-700'}`}>
                                            KES {bookData.price}
                                        </div>
                                        <div className="text-xs text-neutral-brown-500 font-medium">Own this book forever. Download PDF anytime.</div>
                                    </div>
                                </div>

                                {/* Temporary Option */}
                                <div
                                    onClick={() => setPurchaseType('temporary')}
                                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative overflow-hidden group ${purchaseType === 'temporary'
                                            ? 'border-accent-green shadow-lg scale-[1.02]'
                                            : 'border-neutral-brown-200 hover:border-accent-green/50 hover:shadow-md'
                                        }`}
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 opacity-10 transition-opacity ${purchaseType === 'temporary' ? 'bg-gradient-to-br from-accent-green to-emerald-600 opacity-10' : 'bg-gradient-to-br from-neutral-brown-200 to-neutral-brown-100 opacity-0 group-hover:opacity-5'
                                        }`}></div>

                                    {purchaseType === 'temporary' && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-accent-green to-emerald-600 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="font-bold text-neutral-brown-900 mb-1 flex items-center gap-2">
                                            <Clock size={18} className={purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-400'} />
                                            24-Hour Access
                                        </div>
                                        <div className={`text-2xl font-bold mb-1 ${purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-700'}`}>
                                            KES {bookData.rentalPrice}
                                        </div>
                                        <div className="text-xs text-neutral-brown-500 font-medium">Read online for 24 hours. No download.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex items-center border-2 border-neutral-brown-200 rounded-full px-4 py-3 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center text-neutral-brown-500 hover:text-primary transition-colors font-bold text-xl"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-neutral-brown-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-neutral-brown-500 hover:text-primary transition-colors font-bold text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <button className={`flex-1 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-white ${purchaseType === 'permanent' ? 'bg-primary hover:bg-primary-dark' : 'bg-accent-green hover:bg-accent-green/90'
                                    }`}>
                                    <ShoppingCart size={20} />
                                    {purchaseType === 'permanent' ? 'Buy Now' : 'Rent Now'} - KES {currentPrice * quantity}
                                </button>
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
                            <button className="flex-1 py-3 border-2 border-neutral-brown-200 rounded-full text-neutral-brown-500 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-2 font-medium">
                                <Heart size={20} /> Add to Wishlist
                            </button>
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
