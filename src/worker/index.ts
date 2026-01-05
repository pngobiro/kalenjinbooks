/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from './types/env';
import { createD1PrismaClient } from '../lib/db/d1-client';
import { corsMiddleware } from './middleware/cors';
import { errorResponse, successResponse, HttpStatus } from './utils/response';
import { handleBooksRequest } from './handlers/books';
import { handleAuthorsRequest } from './handlers/authors';
import { handleUploadRequest } from './handlers/upload';
import { handleAuthRequest } from './handlers/auth';
import { handleAdminRequest } from './handlers/admin';

/**
 * Handle image proxy requests to serve R2 images with CORS headers
 */
async function handleImageProxy(request: Request, env: Env, path: string): Promise<Response> {
    try {
        // Extract the image path from /api/images/{path}
        const imagePath = decodeURIComponent(path.replace('/api/images/', ''));
        
        console.log(`[ImageProxy] Requested path: ${path}`);
        console.log(`[ImageProxy] Decoded image path: ${imagePath}`);
        
        if (!imagePath) {
            return errorResponse('Image path required', HttpStatus.BAD_REQUEST);
        }

        // Get the image from R2
        const object = await env.BOOKS_BUCKET.get(imagePath);
        
        console.log(`[ImageProxy] R2 object found: ${object ? 'yes' : 'no'}`);
        
        if (!object) {
            return errorResponse('Image not found', HttpStatus.NOT_FOUND);
        }

        // Create response with proper headers
        const headers = new Headers();
        
        // Set content type based on file extension
        const extension = imagePath.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                headers.set('Content-Type', 'image/jpeg');
                break;
            case 'png':
                headers.set('Content-Type', 'image/png');
                break;
            case 'webp':
                headers.set('Content-Type', 'image/webp');
                break;
            case 'gif':
                headers.set('Content-Type', 'image/gif');
                break;
            default:
                headers.set('Content-Type', 'application/octet-stream');
        }

        // Add CORS headers
        const origin = request.headers.get('Origin');
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'https://kalenjin-books.dspop.info',
            'https://kalenjinbooks.com',
        ];

        if (origin && allowedOrigins.includes(origin)) {
            headers.set('Access-Control-Allow-Origin', origin);
        } else {
            headers.set('Access-Control-Allow-Origin', '*');
        }
        
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        headers.set('Access-Control-Max-Age', '86400');

        // Add caching headers
        headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
        headers.set('ETag', `"${imagePath}"`);

        return new Response(object.body, {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error('Image proxy error:', error);
        return errorResponse('Failed to load image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Main Cloudflare Worker entry point
 */
export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            // Apply CORS middleware
            const cors = corsMiddleware(env);
            const method = request.method;

            console.log(`[Worker] Request: ${method} ${path}`);

            return await cors(request, async () => {
                // Route requests to appropriate handlers
                if (path.startsWith('/api/books')) {
                    console.log('[Worker] Routing to books handler');
                    return handleBooksRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/authors')) {
                    console.log('[Worker] Routing to authors handler');
                    return handleAuthorsRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/upload')) {
                    return handleUploadRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/auth') || path.startsWith('/api/register') || path.startsWith('/api/login')) {
                    return handleAuthRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/admin')) {
                    console.log('[Worker] Routing to admin handler');
                    return handleAdminRequest(request as WorkerRequest, env, ctx);
                }

                // Image proxy endpoint to serve R2 images with CORS headers
                if (path.startsWith('/api/images/')) {
                    return handleImageProxy(request, env, path);
                }

                // Health check endpoint
                if (path === '/api/health') {
                    return successResponse({
                        status: 'healthy',
                        timestamp: new Date().toISOString(),
                        version: '1.0.0',
                    });
                }

                // 404 for unknown routes
                return errorResponse(`Not Found (Worker Root). Path: ${path}, Method: ${method}`, HttpStatus.NOT_FOUND);
            });
        } catch (error) {
            console.error('Worker error:', error);
            const response = errorResponse(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            );

            // Re-apply CORS headers to the error response
            const cors = corsMiddleware(env);
            const origin = request.headers.get('Origin');
            const { getCorsConfig, isOriginAllowed, addCorsHeaders } = await import('./middleware/cors');
            // This is a bit redundant but safe to ensure CORS is always there
            const config = {
                allowedOrigins: [
                    'http://localhost:3000',
                    'http://localhost:3001',
                    'http://127.0.0.1:3000',
                    'http://127.0.0.1:3001',
                    'https://kalenjin-books.dspop.info',
                    'https://kalenjinbooks.com',
                ],
                allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization'],
                maxAge: 86400,
            };

            // Hand-rolling addCorsHeaders for simplicity in catch block if imports fail
            const headers = new Headers(response.headers);
            if (origin) {
                headers.set('Access-Control-Allow-Origin', origin);
                headers.set('Access-Control-Allow-Credentials', 'true');
            }

            return new Response(response.body, {
                status: response.status,
                headers
            });
        }
    },

    /**
     * Scheduled handler for cron jobs
     */
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
        try {
            // Cleanup expired access links daily
            const { cleanupExpiredLinks } = await import('../lib/db/d1-client');
            const deletedCount = await cleanupExpiredLinks(env.DB);
            console.log(`Cleaned up ${deletedCount} expired access links`);

            // Optimize database weekly (on Sundays)
            const now = new Date();
            if (now.getDay() === 0) {
                const { optimizeD1Database } = await import('../lib/db/d1-client');
                await optimizeD1Database(env.DB);
                console.log('Database optimized');
            }
        } catch (error) {
            console.error('Scheduled task error:', error);
        }
    },
};
