'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Link2, Check, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShowDropdown(!showDropdown);
        }
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-700 rounded-lg transition-colors"
      >
        <Share2 size={18} />
        <span className="font-medium">Share</span>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-brown-100 py-2 z-50">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-cream transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <div className="w-8 h-8 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                <Twitter size={16} className="text-white" />
              </div>
              <span className="font-medium text-neutral-brown-900">Twitter / X</span>
            </a>
            
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-cream transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center">
                <Facebook size={16} className="text-white" />
              </div>
              <span className="font-medium text-neutral-brown-900">Facebook</span>
            </a>
            
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-cream transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span className="font-medium text-neutral-brown-900">WhatsApp</span>
            </a>
            
            <div className="border-t border-neutral-brown-100 my-1" />
            
            <button
              onClick={() => {
                copyToClipboard();
                setTimeout(() => setShowDropdown(false), 1500);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-cream transition-colors w-full"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${copied ? 'bg-accent-green' : 'bg-neutral-brown-200'}`}>
                {copied ? <Check size={16} className="text-white" /> : <Link2 size={16} className="text-neutral-brown-600" />}
              </div>
              <span className="font-medium text-neutral-brown-900">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
