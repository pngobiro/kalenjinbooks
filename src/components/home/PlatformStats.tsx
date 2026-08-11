import { Book, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
    {
        icon: Book,
        value: '150+',
        label: 'Books Available',
        iconClass: 'bg-primary/20 text-primary',
    },
    {
        icon: Users,
        value: '45+',
        label: 'Active Authors',
        iconClass: 'bg-accent-green/20 text-accent-green',
    },
    {
        icon: ShoppingCart,
        value: '2,500+',
        label: 'Books Sold',
        iconClass: 'bg-accent-gold/20 text-accent-gold',
    },
    {
        icon: TrendingUp,
        value: '98%',
        label: 'Satisfaction Rate',
        iconClass: 'bg-primary/20 text-primary',
    },
];

export function PlatformStats() {
    return (
        <div className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-neutral-brown-900 mb-3 font-heading">
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
                                <div className={`w-16 h-16 ${stat.iconClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <Icon size={32} />
                                </div>
                                <p className="text-4xl font-bold text-neutral-brown-900 mb-2 font-heading">
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
