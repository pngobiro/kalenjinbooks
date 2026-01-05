'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getMyAuthorProfile, Author } from '@/lib/api/authors';

interface AuthorProfileHeaderProps {
  variant?: 'sidebar' | 'page' | 'compact';
  showEmail?: boolean;
  showStatus?: boolean;
  className?: string;
}

export function AuthorProfileHeader({ 
  variant = 'page', 
  showEmail = true, 
  showStatus = false,
  className = '' 
}: AuthorProfileHeaderProps) {
  const { user: authUser } = useAuth();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthorProfile() {
      try {
        const response = await getMyAuthorProfile();
        if (response.success && response.data) {
          setAuthor(response.data);
        }
      } catch (error) {
        console.error('Failed to load author profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthorProfile();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 bg-neutral-brown-100 rounded-full flex items-center justify-center">
          <Loader2 className="animate-spin text-neutral-brown-400" size={16} />
        </div>
        <div className="flex-1">
          <div className="h-4 bg-neutral-brown-100 rounded animate-pulse mb-1"></div>
          {showEmail && <div className="h-3 bg-neutral-brown-100 rounded animate-pulse w-2/3"></div>}
        </div>
      </div>
    );
  }

  const displayName = author?.name || authUser?.name || 'Author';
  const displayEmail = authUser?.email || '';
  const profileImage = author?.profileImage || authUser?.image;

  // Sidebar variant - compact display
  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 p-4 ${className}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-neutral-brown-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-brown-900 truncate text-sm">{displayName}</p>
          {showEmail && displayEmail && (
            <p className="text-xs text-neutral-brown-600 truncate">{displayEmail}</p>
          )}
          {showStatus && author?.status && (
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
              author.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              author.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {author.status}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Compact variant - single line
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-neutral-brown-600" />
          )}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-neutral-brown-900 truncate">{displayName}</span>
          {showEmail && displayEmail && (
            <>
              <span className="text-neutral-brown-400">•</span>
              <span className="text-sm text-neutral-brown-600 truncate">{displayEmail}</span>
            </>
          )}
          {showStatus && author?.status && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              author.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              author.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {author.status}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Page variant - full display (default)
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center flex-shrink-0">
        {profileImage ? (
          <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <User size={32} className="text-neutral-brown-600" />
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-neutral-brown-900">{displayName}</h2>
        {showEmail && displayEmail && (
          <div className="flex items-center gap-2 text-neutral-brown-600 mt-1">
            <Mail size={16} />
            <span>{displayEmail}</span>
          </div>
        )}
        {showStatus && author?.status && (
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
            author.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
            author.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {author.status}
          </span>
        )}
      </div>
    </div>
  );
}