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
