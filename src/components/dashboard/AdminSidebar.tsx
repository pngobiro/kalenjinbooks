'use client';

import { Shield, Users, Book, TrendingUp, UserCheck, Settings, LogOut, BarChart3, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const navigation = [
    { name: 'Overview', tab: 'overview', icon: BarChart3 },
    { name: 'Applications', tab: 'applications', icon: UserCheck },
    { name: 'Authors', tab: 'authors', icon: Users },
    { name: 'Books', tab: 'books', icon: Book },
    { name: 'Pending Books', tab: 'pending-books', icon: Book },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
    { name: 'Revenue', href: '/dashboard/admin/revenue', icon: DollarSign },
    { name: 'Content', href: '/dashboard/admin/content', icon: FileText },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { logout, user } = useAuth();

    const currentTab = searchParams.get('tab') || 'overview';

    const handleNavigation = (item: typeof navigation[0]) => {
        if (item.href) {
            // For future pages that have their own routes
            router.push(item.href);
        } else if (item.tab) {
            // For tab-based navigation within the main admin page
            if (item.tab === 'overview') {
                router.push('/dashboard/admin');
            } else {
                router.push(`/dashboard/admin?tab=${item.tab}`);
            }
        }
    };

    const isActive = (item: typeof navigation[0]) => {
        if (item.href) {
            return pathname === item.href;
        } else if (item.tab) {
            return currentTab === item.tab;
        }
        return false;
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
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-brown-900 text-sm truncate">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-neutral-brown-500 truncate">{user?.email}</p>
                        <p className="text-xs text-neutral-brown-600">
                            {user?.role === 'ADMIN' ? 'Administrator' : user?.isAdmin ? 'Author Admin' : 'Admin'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const active = isActive(item);
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
                                active
                                    ? 'bg-primary text-white'
                                    : 'text-neutral-brown-700 hover:bg-neutral-cream'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t border-neutral-brown-500/10">
                <div className="space-y-2 mb-4">
                    {/* Author Dashboard Link - Only show for author-admins */}
                    {user?.role === 'AUTHOR' && user?.isAdmin && (
                        <Link
                            href="/dashboard/author"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 w-full transition-all text-sm"
                        >
                            <Users size={16} />
                            <span>My Author Dashboard</span>
                        </Link>
                    )}
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