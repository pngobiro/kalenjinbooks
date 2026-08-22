'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Feather, Users, Info, Mail, PenSquare } from 'lucide-react';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';

const navLinks = [
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/blogs', label: 'Blog', icon: Feather },
  { href: '/authors', label: 'Authors', icon: Users },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white/98 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <KaleeReadsLogo size={17} />
            <span className="text-sm font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
          </Link>

          {/* Desktop Links + CTA */}
          <div className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-brown-700 hover:bg-neutral-brown-100'
                    }`}
                  >
                    <Icon size={12} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/dashboard/author/register"
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white hover:shadow-md transition-all"
              style={{ backgroundColor: '#D97846' }}
            >
              <PenSquare size={13} />
              Become an Author
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-brown-100 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-brown-100 bg-white">
          <div className="px-4 py-1.5 space-y-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-neutral-brown-700 hover:bg-neutral-brown-50'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard/author/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: '#D97846' }}
            >
              <PenSquare size={15} />
              Become an Author
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
