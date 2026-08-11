'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';

const navLinks = [
  { href: '/books', label: 'Books' },
  { href: '/blogs', label: 'Blog' },
  { href: '/authors', label: 'Authors' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <KaleeReadsLogo size={40} />
            <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-neutral-brown-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/books"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse Books
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-brown-100 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-brown-100 bg-white">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-brown-700 hover:bg-neutral-brown-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-neutral-brown-100 mt-3">
              <Link
                href="/books"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
