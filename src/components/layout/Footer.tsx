'use client';

import Link from 'next/link';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';

export default function Footer() {
  return (
    <footer className="bg-neutral-brown-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <KaleeReadsLogo size={20} />
            <span className="text-sm font-bold font-heading">KaleeReads</span>
          </Link>
          
          <div className="flex items-center gap-4 text-xs text-neutral-brown-400">
            <Link href="/books" className="hover:text-white transition-colors">Books</Link>
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/authors" className="hover:text-white transition-colors">Authors</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <p className="text-xs text-neutral-brown-500">
            &copy; {new Date().getFullYear()} KaleeReads
          </p>
        </div>
      </div>
    </footer>
  );
}
