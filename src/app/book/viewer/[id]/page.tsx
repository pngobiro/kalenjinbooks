'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, AlertTriangle, Download } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface BookData {
  id: string;
  title: string;
  fileKey: string;
  fileType: string;
  author?: {
    user: {
      name: string;
    };
  };
}

export default function SecureBookViewer() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [book, setBook] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user, authLoading });
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('Auth still loading...');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    fetchBookData();
  }, [params.id, isAuthenticated, authLoading]);

  const fetchBookData = async () => {
    try {
      const token = localStorage.getItem('kaleereads_token');
      console.log('Token from localStorage:', token ? 'exists' : 'missing');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      console.log('Fetching book data for ID:', params.id);

      // Get secure PDF URL first (this includes book info)
      const pdfResponse = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books/${params.id}/secure-view`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('PDF fetch response status:', pdfResponse.status);

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        console.log('PDF fetch error:', errorText);
        throw new Error('Failed to get secure PDF access');
      }

      const pdfData = await pdfResponse.json();
      console.log('Raw PDF response:', JSON.stringify(pdfData, null, 2));
      
      // Check if the response is wrapped in a data property
      const responseData = pdfData.data || pdfData;
      console.log('Response data:', JSON.stringify(responseData, null, 2));
      
      if (!responseData.book) {
        throw new Error('Book data not found in response');
      }
      
      // Set book data from secure view response
      setBook({
        id: responseData.book.id,
        title: responseData.book.title,
        fileKey: '', // Not needed for viewer
        fileType: responseData.book.fileType,
        author: responseData.book.author
      });
      
      setPdfUrl(responseData.secureUrl);

    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err instanceof Error ? err.message : 'Failed to load book');
    } finally {
      setIsLoading(false);
    }
  };

  // Security measures
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Print Screen, Ctrl+P, Ctrl+Shift+J
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Blur window when focus is lost (security measure)
    const handleBlur = () => {
      if (viewerRef.current) {
        viewerRef.current.style.filter = 'blur(5px)';
      }
    };

    const handleFocus = () => {
      if (viewerRef.current) {
        viewerRef.current.style.filter = 'none';
      }
    };

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Disable developer tools detection
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Redirect away if dev tools are opened
          window.location.href = '/dashboard/admin';
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-brown-600">
            {authLoading ? 'Checking authentication...' : 'Loading secure viewer...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2">Access Denied</h1>
          <p className="text-neutral-brown-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {/* Header */}
      <div className="bg-neutral-brown-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-brown-700 rounded transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg">{book?.title}</h1>
            <p className="text-sm text-neutral-brown-300">by {book?.author?.user?.name || 'Unknown Author'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Shield size={16} className="text-green-400" />
            <span>Secure Viewer</span>
          </div>
          <div className="text-xs text-neutral-brown-400">
            Admin Preview
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-900/20 border-b border-yellow-700/30 p-3">
        <div className="flex items-center gap-2 text-yellow-200 text-sm">
          <Shield size={16} />
          <span>This content is protected. Screenshots, downloads, and copying are disabled.</span>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        className="h-[calc(100vh-120px)]" 
        ref={viewerRef}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
            onContextMenu={(e) => e.preventDefault()}
            allow="fullscreen"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <Download className="w-16 h-16 mx-auto mb-4 text-neutral-brown-400" />
              <p className="text-lg font-medium mb-2">Preparing secure viewer...</p>
              <p className="text-sm text-neutral-brown-400">Please wait while we load the content securely.</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to prevent interactions */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      />
    </div>
  );
}