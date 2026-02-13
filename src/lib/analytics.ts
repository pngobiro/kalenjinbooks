/**
 * Analytics tracking utility
 */

export type EventType =
  | 'BOOK_VIEW'
  | 'BOOK_CLICK'
  | 'BOOK_SEARCH'
  | 'BOOK_PREVIEW'
  | 'BOOK_PURCHASE'
  | 'BOOK_DOWNLOAD'
  | 'AUTHOR_VIEW'
  | 'AUTHOR_FOLLOW'
  | 'PAGE_VIEW'
  | 'SIGNUP'
  | 'LOGIN';

interface TrackEventParams {
  eventType: EventType;
  bookId?: string;
  authorId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Get or create a session ID for anonymous tracking
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Track an analytics event
 */
export async function trackEvent(params: TrackEventParams): Promise<void> {
  try {
    const sessionId = getSessionId();
    
    // Get user ID from localStorage if available
    const token = localStorage.getItem('kaleereads_token');
    let userId = params.userId;
    
    if (!userId && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.userId;
      } catch (e) {
        // Invalid token, ignore
      }
    }

    await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        userId,
        sessionId,
      }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Track book view
 */
export function trackBookView(bookId: string, metadata?: Record<string, any>): void {
  trackEvent({ eventType: 'BOOK_VIEW', bookId, metadata });
}

/**
 * Track book click
 */
export function trackBookClick(bookId: string, metadata?: Record<string, any>): void {
  trackEvent({ eventType: 'BOOK_CLICK', bookId, metadata });
}

/**
 * Track book purchase
 */
export function trackBookPurchase(bookId: string, metadata?: Record<string, any>): void {
  trackEvent({ eventType: 'BOOK_PURCHASE', bookId, metadata });
}

/**
 * Track author view
 */
export function trackAuthorView(authorId: string, metadata?: Record<string, any>): void {
  trackEvent({ eventType: 'AUTHOR_VIEW', authorId, metadata });
}

/**
 * Track page view
 */
export function trackPageView(metadata?: Record<string, any>): void {
  trackEvent({ eventType: 'PAGE_VIEW', metadata });
}
