/**
 * API Client for fetching books from the database
 */

export interface Book {
    id: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    price: number;
    rentalPrice: number | null;
    previewPages: number;
    category: string | null;
    language: string | null;
    isPublished: boolean;
    isFeatured: boolean;
    featuredOrder: number | null;
    rating: number;
    reviewCount: number;
    publishedAt: Date | null;
    author: {
        id: string;
        user: {
            name: string | null;
        };
    };
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Deployed worker URL
const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

/**
 * Get the API base URL
 */
function getApiBaseUrl() {
    // If we have a configured worker URL, use it
    if (process.env.NEXT_PUBLIC_WORKER_URL) {
        return process.env.NEXT_PUBLIC_WORKER_URL;
    }

    // Client-side detection - MUST check window first for client components
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Local development - use local worker
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://127.0.0.1:8787';
        }
        
        // Any other hostname (including tunnel, production) - use deployed worker
        return WORKER_URL;
    }

    // Server-side rendering - check if request is from tunnel/production
    // In development with tunnel, we still want to use deployed worker for SSR
    // Use deployed worker by default for server-side to avoid CORS issues
    return WORKER_URL;
}

/**
 * Fetch with timeout and retry
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

/**
 * Fetch all books with optional filtering
 */
export async function fetchBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    authorId?: string;
    featured?: boolean;
}): Promise<PaginatedResponse<Book>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.authorId) searchParams.set('authorId', params.authorId);
    if (params?.featured) searchParams.set('featured', 'true');

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/books${searchParams.toString() ? `?${searchParams}` : ''}`;

    const response = await fetchWithRetry(url, {
        cache: 'no-store',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from API');
    }

    return JSON.parse(text);
}

/**
 * Fetch featured books
 */
export async function fetchFeaturedBooks(limit = 4): Promise<PaginatedResponse<Book>> {
    return fetchBooks({ featured: true, limit });
}

/**
 * Fetch a single book by ID
 */
export async function fetchBookById(id: string): Promise<ApiResponse<Book>> {
    const baseUrl = getApiBaseUrl();
    const response = await fetchWithRetry(`${baseUrl}/api/books/${id}`, {
        cache: 'no-store',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Book not found');
        }
        throw new Error(`Failed to fetch book: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from API');
    }

    return JSON.parse(text);
}

/**
 * Fetch books by category
 */
export async function fetchBooksByCategory(category: string, page = 1, limit = 10): Promise<PaginatedResponse<Book>> {
    return fetchBooks({ category, page, limit });
}

/**
 * Search books
 */
export async function searchBooks(query: string, page = 1, limit = 10): Promise<PaginatedResponse<Book>> {
    return fetchBooks({ search: query, page, limit });
}
