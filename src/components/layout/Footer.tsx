'use client';

import Link from 'next/link';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';
import { Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Browse: [
    { href: '/books', label: 'All Books' },
    { href: '/blogs', label: 'Blog' },
    { href: '/authors', label: 'Authors' },
    { href: '/about', label: 'About Us' },
  ],
  Support: [
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-brown-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <KaleeReadsLogo size={24} />
              <span className="text-base font-bold font-heading">KaleeReads</span>
            </Link>
            <p className="text-neutral-brown-400 text-xs leading-relaxed mb-3 max-w-sm">
              Discover and explore authentic Kalenjin literature, folklore, and cultural stories. Supporting local authors and preserving our heritage.
            </p>
            <div className="space-y-1.5">
              <a href="mailto:hello@kaleeReads.com" className="flex items-center gap-2 text-neutral-brown-400 hover:text-white transition-colors">
                <Mail size={12} />
                <span className="text-xs">hello@kaleeReads.com</span>
              </a>
              <div className="flex items-center gap-2 text-neutral-brown-400">
                <MapPin size={12} />
                <span className="text-xs">Eldoret, Kenya</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-xs mb-2">{title}</h3>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-brown-400 hover:text-white transition-colors text-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-brown-800 mt-5 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-neutral-brown-500 text-xs">
            &copy; {new Date().getFullYear()} KaleeReads. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-neutral-brown-500 hover:text-white text-xs transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-neutral-brown-500 hover:text-white text-xs transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
