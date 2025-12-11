import { Env } from '../types/env';

/**
 * CORS middleware configuration
 */
interface CorsConfig {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    maxAge: number;
}

/**
 * Get CORS configuration based on environment
 */
function getCorsConfig(env: Env): CorsConfig {
    // Always allow these origins regardless of environment
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:8787',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:8787',
        'https://kalenjin-books.dspop.info',
        'https://kalenjinbooks.com',
        'https://www.kalenjinbooks.com',
    ];

    // Add NEXTAUTH_URL if set
    if (env.NEXTAUTH_URL) {
        allowedOrigins.push(env.NEXTAUTH_URL);
    }

    return {
        allowedOrigins,
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        maxAge: 86400, // 24 hours
    };
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, allowedOrigins: string[]): boolean {
    if (!origin) return false;

    // Allow localhost in development
    if (origin.includes('localhost')) return true;

    return allowedOrigins.some((allowed) => {
        if (allowed === '*') return true;
        return origin === allowed || origin.endsWith(allowed);
    });
}

/**
 * CORS middleware
 * Handles CORS headers and preflight requests
 */
export function corsMiddleware(env: Env) {
    const config = getCorsConfig(env);

    return async (request: Request, next: () => Promise<Response>): Promise<Response> => {
        const origin = request.headers.get('Origin');
        const method = request.method;

        // Handle preflight requests
        if (method === 'OPTIONS') {
            return handlePreflight(origin, config);
        }

        // Process the request
        const response = await next();

        // Add CORS headers to response
        return addCorsHeaders(response, origin, config);
    };
}

/**
 * Handle CORS preflight requests
 */
function handlePreflight(origin: string | null, config: CorsConfig): Response {
    const headers = new Headers();

    if (origin && isOriginAllowed(origin, config.allowedOrigins)) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
        headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
        headers.set('Access-Control-Max-Age', config.maxAge.toString());
        headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return new Response(null, {
        status: 204,
        headers,
    });
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(
    response: Response,
    origin: string | null,
    config: CorsConfig
): Response {
    const headers = new Headers(response.headers);

    if (origin && isOriginAllowed(origin, config.allowedOrigins)) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Access-Control-Allow-Credentials', 'true');
        headers.set('Vary', 'Origin');
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}
