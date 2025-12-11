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

/**
 * Get the API base URL
 */
function getApiBaseUrl() {
    // If we have a configured worker URL, use it
    if (process.env.NEXT_PUBLIC_WORKER_URL) {
        return process.env.NEXT_PUBLIC_WORKER_URL;
    }

    // In development, default to local worker
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8787';
    }

    // In production, use the current origin if client-side, or configured URL if server-side
    if (typeof window !== 'undefined') {
        return ''; // Relative URL for same-origin requests (if worker serves frontend)
    }

    return 'https://api.kalenjinbooks.com'; // Fallback for production server-side
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

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    return response.json();
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
    const response = await fetch(`${baseUrl}/api/books/${id}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Book not found');
        }
        throw new Error(`Failed to fetch book: ${response.statusText}`);
    }

    return response.json();
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
