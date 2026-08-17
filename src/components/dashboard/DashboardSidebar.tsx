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
        <div className="w-64 bg-white border-r min-h-screen flex flex-col" style={{ borderColor: '#E5D5C3' }}>
            {/* Logo */}
            <div className="px-5 py-5 border-b" style={{ borderColor: '#E5D5C3' }}>
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D97846' }}>
                        <Book className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-base" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>KaleeReads</h1>
                        <p className="text-xs text-gray-600">Author Portal</p>
                    </div>
                </Link>
            </div>

            {/* Admin Panel Link */}
            {isAdmin && (
                <div className="px-4 py-4 border-b" style={{ borderColor: '#E5D5C3' }}>
                    <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm"
                        style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}
                    >
                        <Shield size={18} />
                        <span>Admin Panel</span>
                    </Link>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium"
                            style={{
                                backgroundColor: isActive ? '#D97846' : 'transparent',
                                color: isActive ? '#FFFFFF' : '#2C2416'
                            }}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Author Profile */}
            <div className="border-t" style={{ borderColor: '#E5D5C3' }}>
                <AuthorProfileHeader 
                    variant="sidebar" 
                    showEmail={true} 
                    showStatus={true}
                />
            </div>

            {/* Logout */}
            <div className="p-3 border-t" style={{ borderColor: '#E5D5C3' }}>
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
