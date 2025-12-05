'use client';

import { Book, DollarSign, TrendingUp, Users, BarChart3, Settings, LogOut, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/dashboard/author', icon: BarChart3 },
    { name: 'My Books', href: '/dashboard/author/books', icon: Book },
    { name: 'Blogs', href: '/dashboard/author/blogs', icon: FileText },
    { name: 'Earnings', href: '/dashboard/author/earnings', icon: DollarSign },
    { name: 'Analytics', href: '/dashboard/author/analytics', icon: TrendingUp },
    { name: 'Profile', href: '/dashboard/author/profile', icon: Users },
    { name: 'Settings', href: '/dashboard/author/settings', icon: Settings },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-neutral-brown-500/10 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-neutral-brown-500/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Book className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-neutral-brown-900">AfriReads</h1>
                        <p className="text-xs text-neutral-brown-700">Author Portal</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary text-white'
                                : 'text-neutral-brown-700 hover:bg-neutral-cream'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-neutral-brown-500/10">
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-brown-700 hover:bg-neutral-cream w-full transition-all">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
