/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from './types/env';
import { authMiddleware, requireRole } from './middleware/auth';
import { createD1PrismaClient } from '../lib/db/d1-client';
import { corsMiddleware } from './middleware/cors';
import { errorResponse, successResponse, HttpStatus } from './utils/response';
import { handleBooksRequest } from './handlers/books';
import { handleAuthorsRequest } from './handlers/authors';
import { handleUploadRequest } from './handlers/upload';
import { handleAuthRequest } from './handlers/auth';
import { handleAdminRequest } from './handlers/admin';
import { handleAnalyticsRequest } from './handlers/analytics';
import { handleHardCopyRequest } from './handlers/hardcopy';
import { handleBlogRequest } from './handlers/blog';
import { handleSettingsRequest } from './handlers/settings';

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
            'https://kalenjinbooks.pages.dev',
            'https://ab336e39.kalenjinbooks.pages.dev',
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
 * Handle secure PDF serving with token validation
 */
async function handleSecurePDF(request: Request, env: Env, path: string): Promise<Response> {
    try {
        // Extract token from path /api/secure-pdf/{token}
        const token = path.replace('/api/secure-pdf/', '');
        
        console.log('[SecurePDF] Token received:', token.substring(0, 20) + '...');
        
        if (!token) {
            return errorResponse('Invalid token', HttpStatus.BAD_REQUEST);
        }

        // Validate token from KV
        const tokenKey = `secure_token:${token}`;
        const tokenDataStr = await env.SESSION.get(tokenKey);
        
        console.log('[SecurePDF] Token data from KV:', tokenDataStr ? 'found' : 'not found');
        
        if (!tokenDataStr) {
            return errorResponse('Token expired or invalid', HttpStatus.UNAUTHORIZED);
        }

        const tokenData = JSON.parse(tokenDataStr);
        
        // Check if token is expired
        if (Date.now() > tokenData.exp) {
            await env.SESSION.delete(tokenKey);
            return errorResponse('Token expired', HttpStatus.UNAUTHORIZED);
        }

        console.log('[SecurePDF] Token valid for book:', tokenData.bookId);

        // Get book details
        const prisma = createD1PrismaClient(env.DB);
        const book = await prisma.book.findUnique({
            where: { id: tokenData.bookId },
            select: { fileKey: true, fileType: true, title: true }
        });

        if (!book) {
            console.log('[SecurePDF] Book not found in database');
            return errorResponse('Book not found', HttpStatus.NOT_FOUND);
        }

        console.log('[SecurePDF] Book found, fileKey:', book.fileKey);

        // Get PDF from R2
        const object = await env.BOOKS_BUCKET.get(book.fileKey);
        
        console.log('[SecurePDF] R2 object:', object ? 'found' : 'NOT FOUND');
        
        if (!object) {
            console.error('[SecurePDF] File not found in R2 bucket:', book.fileKey);
            return errorResponse('PDF file not found in storage. Please contact support.', HttpStatus.NOT_FOUND);
        }

        console.log('[SecurePDF] Serving PDF successfully');

        // Create secure response with aggressive anti-download headers
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'inline'); // Remove filename completely
        headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('X-Download-Options', 'noopen');
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        
        // Add CORS headers
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET');
        headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return new Response(object.body, { headers });

    } catch (error) {
        console.error('[SecurePDF] Error:', error);
        return errorResponse('Failed to serve secure PDF', HttpStatus.INTERNAL_SERVER_ERROR);
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

                // Hard copy requests - must come BEFORE /api/authors check
                if (path.startsWith('/api/authors/hard-copy-requests') || path.startsWith('/api/hard-copy-requests')) {
                    console.log('[Worker] Routing to hard copy handler');
                    return handleHardCopyRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/authors')) {
                    console.log('[Worker] Routing to authors handler');
                    return handleAuthorsRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/upload')) {
                    return handleUploadRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/blog')) {
                    console.log('[Worker] Routing to blog handler');
                    return handleBlogRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/auth') || path.startsWith('/api/register') || path.startsWith('/api/login')) {
                    return handleAuthRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/admin')) {
                    console.log('[Worker] Routing to admin handler');
                    return handleAdminRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/settings')) {
                    console.log('[Worker] Routing to settings handler');
                    return await handleSettingsRequest(request as WorkerRequest, env, ctx);
                }

                if (path.startsWith('/api/analytics')) {
                    console.log('[Worker] Routing to analytics handler');
                    return handleAnalyticsRequest(request as WorkerRequest, env, ctx);
                }

                // Image proxy endpoint to serve R2 images with CORS headers
                if (path.startsWith('/api/images/')) {
                    return handleImageProxy(request, env, path);
                }

                // Secure PDF serving endpoint (CORS-applied: fetched cross-origin by the reader)
                if (path.startsWith('/api/secure-pdf/')) {
                    const pdfResponse = await handleSecurePDF(request, env, path);
                    const { addCorsHeaders, getCorsConfig } = await import('./middleware/cors');
                    return addCorsHeaders(pdfResponse, request.headers.get('Origin'), getCorsConfig(env));
                }

                // Health check endpoint
                if (path === '/api/health') {
                    return successResponse({
                        status: 'healthy',
                        timestamp: new Date().toISOString(),
                        version: '1.0.0',
                    });
                }

                // Test email endpoint (admin only)
                if (path === '/api/test-email' && method === 'POST') {
                    console.log('[Worker] Test email endpoint');
                    return await authMiddleware(request as WorkerRequest, env, async () => {
                        return await requireRole('ADMIN')(request as WorkerRequest, env, async () => {
                            try {
                                const { sendEmail, createApprovalEmail } = await import('./utils/email');
                                const testEmail = createApprovalEmail('Test User', 'pngobiro@gmail.com');
                                const sent = await sendEmail(testEmail, env);
                                return successResponse({
                                    message: sent ? 'Test email sent successfully' : 'Email sending failed',
                                    sent,
                                    to: 'pngobiro@gmail.com'
                                });
                            } catch (error) {
                                console.error('[Worker] Test email error:', error);
                                return errorResponse('Failed to send test email: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
                            }
                        });
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
                    'https://kalenjinbooks.pages.dev',
                    'https://ab336e39.kalenjinbooks.pages.dev',
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
