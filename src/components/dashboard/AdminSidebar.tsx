'use client';

import { Suspense, useEffect, useState } from 'react';
import { Shield, Users, Book, TrendingUp, UserCheck, Settings, LogOut, BarChart3, DollarSign, X } from 'lucide-react';
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
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { logout, user } = useAuth();

    const currentTab = searchParams.get('tab') || 'overview';

    const handleNavigation = (item: typeof navigation[0]) => {
        onNavigate?.();
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
                        <h1 className="font-bold text-lg text-neutral-brown-900">Mama Africa Library</h1>
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


export function AdminSidebar() {
    const [open, setOpen] = useState(false);

    // Close the mobile drawer on navigation and on Escape.
    useEffect(() => { setOpen(false); }, [usePathname()]);
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <>
            {/* Desktop: static sidebar, unchanged */}
            <div className="hidden md:block shrink-0">
                <Suspense fallback={
                    <div className="w-64 bg-white border-r border-neutral-brown-500/10 min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-neutral-brown-600 text-sm">Loading...</p>
                        </div>
                    </div>
                }>
                    <AdminSidebarContent />
                </Suspense>
            </div>

            {/* Mobile: hamburger + slide-in drawer */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 w-11 h-11 flex items-center justify-center rounded-lg bg-white border border-neutral-brown-500/20 text-neutral-brown-900"
                aria-label="Open navigation menu"
                aria-expanded={open}
                aria-controls="admin-drawer"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            {open && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setOpen(false)}
                        aria-label="Close navigation menu"
                        tabIndex={-1}
                    />
                    <div id="admin-drawer" className="relative h-full shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700"
                            aria-label="Close navigation menu"
                        >
                            <X size={18} />
                        </button>
                        <Suspense fallback={
                            <div className="w-64 h-full bg-white flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        }>
                            <AdminSidebarContent onNavigate={() => setOpen(false)} />
                        </Suspense>
                    </div>
                </div>
            )}
        </>
    );
}
