/**
 * API Client for fetching authors from the database
 */

export interface Author {
    id: string;
    name: string | null;
    bio: string | null;
    profileImage: string | null;
    booksCount: number;
    rating: number;
    books?: any[];
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
    if (process.env.NEXT_PUBLIC_WORKER_URL) {
        return process.env.NEXT_PUBLIC_WORKER_URL;
    }
    
    // Client-side detection
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://127.0.0.1:8787';
        }
        
        // Production/demo
        return WORKER_URL;
    }
    
    // Server-side
    if (process.env.NODE_ENV === 'development') {
        return 'http://127.0.0.1:8787';
    }
    
    return WORKER_URL;
}

/**
 * Fetch with timeout and retry
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

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
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

/**
 * Fetch all authors with pagination
 */
export async function fetchAuthors(params?: {
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<Author>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/authors${searchParams.toString() ? `?${searchParams}` : ''}`;

    const response = await fetchWithRetry(url, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from API');
    }

    return JSON.parse(text);
}

/**
 * Fetch a single author by ID
 */
export async function fetchAuthorById(id: string): Promise<ApiResponse<Author>> {
    const baseUrl = getApiBaseUrl();
    const response = await fetchWithRetry(`${baseUrl}/api/authors/${id}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Author not found');
        }
        throw new Error(`Failed to fetch author: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from API');
    }

    return JSON.parse(text);
}
