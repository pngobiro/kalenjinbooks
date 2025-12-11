'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, BookOpen, Clock, Package } from 'lucide-react';
import { Book } from '@/lib/api/books';

interface BookPurchaseOptionsProps {
    book: Book;
}

export default function BookPurchaseOptions({ book }: BookPurchaseOptionsProps) {
    const [purchaseType, setPurchaseType] = useState<'permanent' | 'temporary'>('permanent');

    // Calculate rental price (assuming 50% of full price if not specified)
    const rentalPrice = Math.floor(book.price * 0.1);
    const currentPrice = purchaseType === 'permanent' ? book.price : rentalPrice;

    return (
        <>
            {/* Purchase Options */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-bold text-neutral-brown-900 mb-4">Select Access Type</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Permanent */}
                    <div
                        onClick={() => setPurchaseType('permanent')}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${purchaseType === 'permanent'
                                ? 'border-primary bg-primary/5'
                                : 'border-neutral-brown-200 hover:border-primary/50'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={20} className={purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-400'} />
                            <span className="font-semibold text-sm">Permanent</span>
                        </div>
                        <div className={`text-2xl font-bold ${purchaseType === 'permanent' ? 'text-primary' : 'text-neutral-brown-700'}`}>
                            KES {book.price}
                        </div>
                        <p className="text-xs text-neutral-brown-500 mt-1">Own forever</p>
                    </div>

                    {/* 24-Hour */}
                    <div
                        onClick={() => setPurchaseType('temporary')}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${purchaseType === 'temporary'
                                ? 'border-accent-green bg-accent-green/5'
                                : 'border-neutral-brown-200 hover:border-accent-green/50'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={20} className={purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-400'} />
                            <span className="font-semibold text-sm">24-Hour</span>
                        </div>
                        <div className={`text-2xl font-bold ${purchaseType === 'temporary' ? 'text-accent-green' : 'text-neutral-brown-700'}`}>
                            KES {rentalPrice}
                        </div>
                        <p className="text-xs text-neutral-brown-500 mt-1">Read online</p>
                    </div>
                </div>

                <Link
                    href={`/payment?bookId=${book.id}&author=${encodeURIComponent(book.author.user.name || '')}&type=${purchaseType}&price=${currentPrice}&title=${encodeURIComponent(book.title)}`}
                    className={`w-full font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2 text-white ${purchaseType === 'permanent' ? 'bg-primary hover:bg-primary-dark' : 'bg-accent-green hover:bg-[#7A8C74]'
                        } transition-all`}
                >
                    <ShoppingCart size={20} />
                    Choose Payment - KES {currentPrice}
                </Link>
            </div>

            <p className="text-neutral-brown-700 leading-relaxed mb-6 whitespace-pre-line">{book.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-neutral-brown-200">
                <div>
                    <div className="text-xs text-neutral-brown-500 uppercase">Pages</div>
                    <div className="font-bold text-neutral-brown-900">{book.previewPages * 5}</div> {/* Estimating pages */}
                </div>
                <div>
                    <div className="text-xs text-neutral-brown-500 uppercase">Language</div>
                    <div className="font-bold text-neutral-brown-900 text-sm">{book.language || 'English'}</div>
                </div>
                <div>
                    <div className="text-xs text-neutral-brown-500 uppercase">Published</div>
                    <div className="font-bold text-neutral-brown-900">
                        {book.publishedAt ? new Date(book.publishedAt).getFullYear() : '2024'}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href={`/request-hard-copy?book=${encodeURIComponent(book.title)}&id=${book.id}`}
                    className="flex-1 py-3 bg-primary text-white hover:bg-primary-dark rounded-full flex items-center justify-center gap-2 font-semibold transition-all shadow-md"
                >
                    <Package size={18} /> Request Hard Copy
                </Link>
            </div>
        </>
    );
}
