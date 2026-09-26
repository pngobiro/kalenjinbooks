'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, BookOpen, Feather, Users, Info, Mail, PenSquare } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import { useAuth } from '@/lib/auth-context';

const navLinks = [
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/blogs', label: 'Blog', icon: Feather },
  { href: '/authors', label: 'Authors', icon: Users },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];

function BecomeAuthorButton({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    onClose?.();

    if (!isAuthenticated || !user) {
      router.push('/dashboard/author/register');
      return;
    }

    // Admin → admin dashboard
    if (user.role === 'ADMIN' || (user as any).isAdmin) {
      router.push('/dashboard/admin');
      return;
    }

    // Check author application status
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('kaleereads_token');
      const res = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json: any = await res.json();
        const status = json?.data?.status;
        if (status === 'PENDING' || status === 'APPROVED') {
          router.push('/dashboard/author');
          return;
        }
      }
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      // No author record → go to register
      router.push('/dashboard/author/register');
    } catch {
      router.push('/dashboard/author/register');
    } finally {
      setLoading(false);
    }
  };

  if (mobile) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 mt-3 w-full px-4 py-3 rounded-full text-sm font-bold text-white shadow-md disabled:opacity-60"
        style={{ backgroundColor: '#D97846' }}
      >
        <PenSquare size={16} />
        {isAuthenticated && user ? 'Go to Dashboard' : 'Become an Author'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="ml-3 inline-flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
      style={{ backgroundColor: '#D97846', boxShadow: '0 4px 14px rgba(217,120,70,0.35)' }}
    >
      <PenSquare size={15} />
      {isAuthenticated && user ? 'Go to Dashboard' : 'Become an Author'}
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(255,252,245,0.92)',
        borderBottom: '1px solid #E4D9C4',
        boxShadow: '0 2px 20px rgba(44,36,22,0.06)',
      }}
    >
      {/* Terracotta accent line */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #D97846 0%, #C9A354 50%, #7A9B76 100%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 inline-block">
              <SiteLogo size={30} />
            </span>
            <span className="leading-tight">
              <span className="block text-[17px] md:text-lg font-bold font-heading" style={{ color: '#2C2416' }}>
                Mama Africa Library
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#A89888' }}>
                African Books & Stories
              </span>
            </span>
          </Link>

          {/* Desktop Links + CTA */}
          <div className="hidden md:flex items-center gap-1">
            <div
              className="flex items-center gap-1 p-1.5 rounded-full mr-2"
              style={{ backgroundColor: '#F5F1E8', border: '1px solid #E4D9C4' }}
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={
                      active
                        ? { backgroundColor: '#2C2416', color: '#FFFCF5', boxShadow: '0 2px 8px rgba(44,36,22,0.3)' }
                        : { color: '#5B4F42' }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FFFCF5';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#D97846';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#5B4F42';
                      }
                    }}
                  >
                    <Icon size={15} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <BecomeAuthorButton />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: '#F5F1E8', border: '1px solid #E4D9C4', color: '#2C2416' }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t bg-white"
          style={{ borderColor: '#E4D9C4', boxShadow: '0 12px 32px rgba(44,36,22,0.12)' }}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors"
                  style={
                    active
                      ? { backgroundColor: '#2C2416', color: '#FFFCF5' }
                      : { color: '#5B4F42' }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: active ? 'rgba(255,252,245,0.12)' : '#F5F1E8' }}
                  >
                    <Icon size={16} style={{ color: active ? '#E89B77' : '#D97846' }} />
                  </span>
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-1 pb-2">
              <BecomeAuthorButton mobile onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
