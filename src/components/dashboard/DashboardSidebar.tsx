'use client';

import { Book, DollarSign, TrendingUp, Users, BarChart3, Settings, LogOut, FileText, Shield, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';

const navigation = [
    { name: 'Dashboard', href: '/dashboard/author', icon: BarChart3 },
    { name: 'My Books', href: '/dashboard/author/books', icon: Book },
    { name: 'My Blogs', href: '/dashboard/author/blogs', icon: FileText },
    { name: 'Hard Copy Requests', href: '/dashboard/author/requests', icon: Package },
    { name: 'Earnings', href: '/dashboard/author/earnings', icon: DollarSign },
    { name: 'Analytics', href: '/dashboard/author/analytics', icon: TrendingUp },
    { name: 'Profile', href: '/dashboard/author/profile', icon: Users },
    { name: 'Settings', href: '/dashboard/author/settings', icon: Settings },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    // Check if user has admin privileges
    const isAdmin = user?.role === 'ADMIN' || user?.isAdmin;

    return (
        <div className="w-64 bg-white border-r border-neutral-brown-500/10 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="px-5 py-4 border-b border-neutral-brown-500/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                        <Book className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-base text-neutral-brown-900">KaleeReads</h1>
                        <p className="text-xs text-neutral-brown-700">Author Portal</p>
                    </div>
                </Link>
            </div>

            {/* Admin Panel Link */}
            {isAdmin && (
                <div className="px-4 py-3 border-b border-neutral-brown-500/10">
                    <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
                    >
                        <Shield size={18} />
                        <span className="font-medium text-sm">Admin Panel</span>
                    </Link>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 space-y-0.5">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${isActive
                                ? 'bg-primary text-white'
                                : 'text-neutral-brown-700 hover:bg-neutral-cream'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Author Profile */}
            <div className="border-t border-neutral-brown-500/10">
                <AuthorProfileHeader 
                    variant="sidebar" 
                    showEmail={true} 
                    showStatus={true}
                />
            </div>

            {/* Logout */}
            <div className="p-3 border-t border-neutral-brown-500/10">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-neutral-brown-700 hover:bg-neutral-cream w-full transition-all text-sm"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
