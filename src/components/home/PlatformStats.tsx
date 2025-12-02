import { Book, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
    {
        icon: Book,
        value: '150+',
        label: 'Books Available',
        color: 'primary',
    },
    {
        icon: Users,
        value: '45+',
        label: 'Active Authors',
        color: 'accent-green',
    },
    {
        icon: ShoppingCart,
        value: '2,500+',
        label: 'Books Sold',
        color: 'accent-gold',
    },
    {
        icon: TrendingUp,
        value: '98%',
        label: 'Satisfaction Rate',
        color: 'primary',
    },
];

export function PlatformStats() {
    return (
        <div className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-neutral-brown-900 mb-3">
                        Growing Community
                    </h2>
                    <p className="text-lg text-neutral-brown-700">
                        Join thousands preserving Kalenjin culture
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 bg-${stat.color}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <Icon className={`text-${stat.color}`} size={32} />
                                </div>
                                <p className="text-4xl font-bold text-neutral-brown-900 mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-neutral-brown-700 font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
