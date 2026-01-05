'use client';

import { Shield, Users, Book, TrendingUp, UserCheck, Settings, LogOut, BarChart3, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const navigation = [
    { name: 'Overview', href: '/dashboard/admin', icon: BarChart3 },
    { name: 'Applications', href: '/dashboard/admin?tab=applications', icon: UserCheck },
    { name: 'Authors', href: '/dashboard/admin?tab=authors', icon: Users },
    { name: 'Books', href: '/dashboard/admin?tab=books', icon: Book },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
    { name: 'Revenue', href: '/dashboard/admin/revenue', icon: DollarSign },
    { name: 'Content', href: '/dashboard/admin/content', icon: FileText },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { logout, user } = useAuth();

    const isActive = (href: string) => {
        if (href === '/dashboard/admin') {
            return pathname === '/dashboard/admin' && !searchParams.get('tab');
        }
        if (href.includes('?tab=')) {
            const tab = href.split('?tab=')[1];
            return pathname === '/dashboard/admin' && searchParams.get('tab') === tab;
        }
        return pathname === href;
    };

    return (
        <div className="w-64 bg-white border-r border-neutral-brown-500/10 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-neutral-brown-500/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-neutral-brown-900">KaleeReads</h1>
                        <p className="text-xs text-neutral-brown-700">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-neutral-brown-500/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-neutral-brown-900 text-sm">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-neutral-brown-600">Super Administrator</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                active
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

            {/* Quick Actions */}
            <div className="p-4 border-t border-neutral-brown-500/10">
                <div className="space-y-2 mb-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-neutral-brown-700 hover:bg-neutral-cream w-full transition-all text-sm"
                    >
                        <Book size={16} />
                        <span>View Site</span>
                    </Link>
                </div>
                
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-brown-700 hover:bg-neutral-cream w-full transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}