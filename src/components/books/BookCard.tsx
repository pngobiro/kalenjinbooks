import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

interface BookCardProps {
    book: {
        id: string;
        title: string;
        author: string;
        price: number;
        rating: number;
        reviewCount: number;
        category: string;
        language: string;
    };
}

export function BookCard({ book }: BookCardProps) {
    return (
        <Link href={`/books/${book.id}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group">
                {/* Book Cover */}
                <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                            <p className="text-sm font-semibold text-neutral-brown-900 line-clamp-3">
                                {book.title}
                            </p>
                        </div>
                    </div>
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-neutral-brown-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-semibold">Quick View</span>
                    </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-neutral-brown-900 line-clamp-2 mb-1">
                        {book.title}
                    </h3>
                    <p className="text-sm text-neutral-brown-700 mb-2">{book.author}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.floor(book.rating) ? 'fill-accent-gold text-accent-gold' : 'text-neutral-brown-500/20'}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-neutral-brown-700">({book.reviewCount})</span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                            KES {book.price.toLocaleString()}
                        </span>
                        <button className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg flex items-center justify-center transition-all">
                            <ShoppingCart size={18} />
                        </button>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 mt-3">
                        <span className="text-xs px-2 py-1 bg-accent-green/20 text-accent-green rounded-full">
                            {book.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                            {book.language}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
