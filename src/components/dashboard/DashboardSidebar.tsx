'use client';

import { useEffect, useState } from 'react';
import { Book, DollarSign, TrendingUp, Users, BarChart3, Settings, LogOut, FileText, Shield, Package, X } from 'lucide-react';
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
    const [open, setOpen] = useState(false);

    // Check if user has admin privileges
    const isAdmin = user?.role === 'ADMIN' || user?.isAdmin;

    // Close the mobile drawer on navigation and on Escape.
    useEffect(() => { setOpen(false); }, [pathname]);
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const panel = (
        <div className="w-64 h-full bg-white border-r flex flex-col overflow-y-auto" style={{ borderColor: '#E5D5C3' }}>
            {/* Logo */}
            <div className="px-5 py-5 border-b" style={{ borderColor: '#E5D5C3' }}>
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B4502A' }}>
                        <Book className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-base" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>Mama Africa Library</h1>
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
                                backgroundColor: isActive ? '#B4502A' : 'transparent',
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

    return (
        <>
            {/* Desktop: static sidebar exactly as before */}
            <div className="hidden md:block shrink-0">{panel}</div>

            {/* Mobile: hamburger + slide-in drawer */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 w-11 h-11 flex items-center justify-center rounded-lg bg-white border"
                style={{ borderColor: '#E5D5C3', color: '#2C2416' }}
                aria-label="Open navigation menu"
                aria-expanded={open}
                aria-controls="dashboard-drawer"
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
                    <div id="dashboard-drawer" className="relative h-full shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700"
                            aria-label="Close navigation menu"
                        >
                            <X size={18} />
                        </button>
                        {panel}
                    </div>
                </div>
            )}
        </>
    );
}
