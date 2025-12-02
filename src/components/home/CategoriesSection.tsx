import Link from 'next/link';
import { BookOpen, History, Feather, GraduationCap, Baby, Heart } from 'lucide-react';

const categories = [
    {
        id: 'folklore',
        name: 'Folklore',
        icon: BookOpen,
        description: 'Traditional stories and legends',
        count: 24,
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'history',
        name: 'History',
        icon: History,
        description: 'Historical narratives',
        count: 18,
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        id: 'poetry',
        name: 'Poetry',
        icon: Feather,
        description: 'Verses and poems',
        count: 15,
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        id: 'education',
        name: 'Education',
        icon: GraduationCap,
        description: 'Learning materials',
        count: 21,
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'children',
        name: 'Children',
        icon: Baby,
        description: 'Stories for young readers',
        count: 32,
        gradient: 'from-pink-500 to-rose-600',
    },
    {
        id: 'fiction',
        name: 'Fiction',
        icon: Heart,
        description: 'Creative narratives',
        count: 27,
        gradient: 'from-red-500 to-rose-600',
    },
];

export function CategoriesSection() {
    return (
        <div className="py-20 bg-gradient-to-b from-neutral-cream to-white">
            <div className="max-w-7xl mx-auto px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-neutral-brown-900 mb-4 font-heading">
                        Browse by Category
                    </h2>
                    <p className="text-xl text-neutral-brown-700 font-body">
                        Explore books across different genres
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link key={category.id} href={`/books?category=${category.id}`}>
                                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-neutral-brown-500/10">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                                        <Icon className="text-white" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-neutral-brown-900 mb-3 font-heading">
                                        {category.name}
                                    </h3>
                                    <p className="text-neutral-brown-700 mb-4 font-body">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-neutral-brown-700 bg-neutral-cream px-4 py-2 rounded-full">
                                            {category.count} books
                                        </span>
                                        <span className="text-primary font-bold text-xl group-hover:translate-x-2 transition-transform">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
