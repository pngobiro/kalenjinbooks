import Link from 'next/link';
import { User, BookOpen } from 'lucide-react';

const featuredAuthors = [
    {
        id: '1',
        name: 'John Kamau',
        booksCount: 8,
        bio: 'Passionate storyteller preserving Kalenjin culture',
    },
    {
        id: '2',
        name: 'Jane Kiplagat',
        booksCount: 12,
        bio: 'Award-winning author of historical narratives',
    },
    {
        id: '3',
        name: 'Mike Korir',
        booksCount: 6,
        bio: 'Specialist in traditional folklore',
    },
    {
        id: '4',
        name: 'Sarah Chebet',
        booksCount: 15,
        bio: 'Children\'s book author and educator',
    },
];

export function FeaturedAuthors() {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-neutral-brown-900 mb-3">
                        Featured Authors
                    </h2>
                    <p className="text-lg text-neutral-brown-700">
                        Meet the talented writers behind our books
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredAuthors.map((author) => (
                        <Link key={author.id} href={`/authors/${author.id}`}>
                            <div className="bg-neutral-cream rounded-xl p-6 text-center hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group cursor-pointer">
                                {/* Author Avatar */}
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <User className="text-primary" size={40} />
                                </div>

                                {/* Author Info */}
                                <h3 className="text-lg font-bold text-neutral-brown-900 mb-2">
                                    {author.name}
                                </h3>
                                <p className="text-sm text-neutral-brown-700 mb-3 line-clamp-2">
                                    {author.bio}
                                </p>

                                {/* Books Count */}
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <BookOpen size={16} />
                                    <span className="text-sm font-semibold">
                                        {author.booksCount} books
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/authors"
                        className="inline-block text-primary hover:text-primary-dark font-semibold"
                    >
                        View All Authors →
                    </Link>
                </div>
            </div>
        </div>
    );
}
