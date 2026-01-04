/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker Environment Bindings
 * Type definitions for D1, R2, KV, and environment variables
 */

export interface Env {
    // D1 Database
    DB: D1Database;

    // R2 Buckets
    BOOKS_BUCKET: R2Bucket;

    // KV Namespaces
    CACHE: KVNamespace;
    SESSION: KVNamespace;

    // Environment Variables
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    PLATFORM_COMMISSION_PERCENTAGE: string;
    TIME_LIMITED_ACCESS_HOURS: string;

    // Google OAuth
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    // Optional M-Pesa
    MPESA_CONSUMER_KEY?: string;
    MPESA_CONSUMER_SECRET?: string;
    MPESA_SHORTCODE?: string;
    MPESA_PASSKEY?: string;
}

/**
 * Request context with user information
 */
export interface RequestContext {
    user?: {
        id: string;
        email: string;
        role: 'READER' | 'AUTHOR' | 'ADMIN';
    };
    sessionId?: string;
}

/**
 * Extended Request with context
 */
export interface WorkerRequest extends Request {
    ctx?: RequestContext;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
