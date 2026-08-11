/**
 * API Client for fetching and managing blog posts from the database
 */

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    coverType: string;
    coverVideoUrl: string | null;
    category: string | null;
    authorId: string;
    isPublished: boolean;
    publishedAt: Date | string | null;
    viewCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    author?: {
        id: string;
        user?: {
            name: string | null;
            image: string | null;
        };
        profileImage?: string | null;
    };
    images?: Array<{
        id: string;
        imageKey: string;
        altText: string | null;
    }>;
}

export interface PaginatedBlogs {
    success: boolean;
    data: {
        posts: BlogPost[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

/**
 * Get the API base URL
 */
export function getApiBaseUrl() {
    if (process.env.NEXT_PUBLIC_WORKER_URL) {
        return process.env.NEXT_PUBLIC_WORKER_URL;
    }
    return WORKER_URL;
}

/**
 * Fetch with timeout and retry
 */
export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
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

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('kaleereads_token') : null;
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

/**
 * Fetch all blog posts
 */
export async function fetchBlogPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    authorId?: string;
    category?: string;
    published?: boolean;
    sort?: string;
}): Promise<PaginatedBlogs> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.authorId) searchParams.set('authorId', params.authorId);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.published !== undefined) searchParams.set('published', String(params.published));
    if (params?.sort) searchParams.set('sort', params.sort);

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/blog/posts${searchParams.toString() ? `?${searchParams}` : ''}`;

    const response = await fetchWithRetry(url, {
        cache: 'no-store',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from API');
    }

    return JSON.parse(text);
}

/**
 * Fetch a single blog post by id or slug
 */
export async function fetchBlogPost(idOrSlug: string): Promise<ApiResponse<BlogPost>> {
    const baseUrl = getApiBaseUrl();
    const response = await fetchWithRetry(`${baseUrl}/api/blog/posts/${idOrSlug}`, {
        cache: 'no-store',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Blog post not found');
        }
        throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from API');
    }

    return JSON.parse(text);
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    coverType?: string;
    coverVideoUrl?: string;
    category?: string;
    isPublished?: boolean;
}): Promise<ApiResponse<BlogPost>> {
    const baseUrl = getApiBaseUrl();
    const response = await fetchWithRetry(`${baseUrl}/api/blog/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

    if (!response.ok) {
        throw new Error(parsed.error || `Failed to create blog post: ${response.statusText}`);
    }

    return parsed;
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, post: Partial<{
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    coverType: string;
    coverVideoUrl: string;
    category: string;
    isPublished: boolean;
}>): Promise<ApiResponse<BlogPost>> {
    const baseUrl = getApiBaseUrl();
    const response = await fetchWithRetry(`${baseUrl}/api/blog/posts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

    if (!response.ok) {
        throw new Error(parsed.error || `Failed to update blog post: ${response.statusText}`);
    }

    return parsed;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<ApiResponse<{ id: string; deleted: boolean }>> {
    const baseUrl = getApiBaseUrl();
    const response = await fetchWithRetry(`${baseUrl}/api/blog/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

    if (!response.ok) {
        throw new Error(parsed.error || `Failed to delete blog post: ${response.statusText}`);
    }

    return parsed;
}

/**
 * Upload an image for use inside blog content
 * @param file The image file to upload
 * @returns Public URL of the uploaded image
 */
export async function uploadBlogImage(file: File, blogPostId?: string): Promise<string> {
    const baseUrl = getApiBaseUrl();
    const token = typeof window !== 'undefined' ? localStorage.getItem('kaleereads_token') : null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'blog');
    if (blogPostId) formData.append('blogPostId', blogPostId);

    const response = await fetchWithRetry(`${baseUrl}/api/upload/image`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

    if (!response.ok) {
        throw new Error(parsed.error || 'Failed to upload image');
    }

    return parsed.data.url;
}