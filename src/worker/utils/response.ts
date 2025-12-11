import { ApiResponse, PaginatedResponse } from '../types/env';

/**
 * Create a successful JSON response
 */
export function successResponse<T>(
    data: T,
    status: number = 200
): Response {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };

    return new Response(JSON.stringify(response), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Create an error JSON response
 */
export function errorResponse(
    message: string,
    status: number = 400,
    code?: string
): Response {
    const response: ApiResponse = {
        success: false,
        error: message,
        code,
    };

    return new Response(JSON.stringify(response), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): Response {
    const response = {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Common error codes
 */
export const ErrorCode = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * Parse JSON body from request
 */
export async function parseJsonBody<T = any>(request: Request): Promise<T> {
    try {
        return await request.json();
    } catch (error) {
        throw new Error('Invalid JSON body');
    }
}

/**
 * Get query parameters from URL
 */
export function getQueryParams(url: string): URLSearchParams {
    const urlObj = new URL(url);
    return urlObj.searchParams;
}

/**
 * Extract pagination parameters from query string
 */
export function getPaginationParams(searchParams: URLSearchParams): {
    page: number;
    limit: number;
} {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    return { page, limit };
}

/**
 * Set CORS headers on response
 */
export function withCorsHeaders(response: Response, origin?: string): Response {
    const headers = new Headers(response.headers);

    headers.set('Access-Control-Allow-Origin', origin || '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Access-Control-Max-Age', '86400');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

/**
 * Set security headers on response
 */
export function withSecurityHeaders(response: Response): Response {
    const headers = new Headers(response.headers);

    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}
