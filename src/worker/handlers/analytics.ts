/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { errorResponse, successResponse, HttpStatus } from '../utils/response';

/**
 * Handle analytics API requests
 */
export async function handleAnalyticsRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[AnalyticsHandler] Path: ${path}, Method: ${method}`);

    // POST /api/analytics/track - Track an event
    if (path === '/api/analytics/track' && method === 'POST') {
        return await trackEvent(request, env);
    }

    // GET /api/analytics/dashboard - Get dashboard analytics (admin only)
    if (path === '/api/analytics/dashboard' && method === 'GET') {
        return await authMiddleware(request, env, async () => {
            return await requireRole('ADMIN')(request, env, async () => {
                return await getDashboardAnalytics(request, env);
            });
        });
    }

    // GET /api/analytics/books/:bookId - Get book-specific analytics
    if (path.match(/^\/api\/analytics\/books\/[^/]+$/) && method === 'GET') {
        const bookId = path.split('/').pop()!;
        return await authMiddleware(request, env, async () => {
            return await getBookAnalytics(request, env, bookId);
        });
    }

    return errorResponse(`Not Found. Path: ${path}`, HttpStatus.NOT_FOUND);
}

/**
 * Track an analytics event
 */
async function trackEvent(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            eventType: string;
            bookId?: string;
            authorId?: string;
            userId?: string;
            sessionId?: string;
            metadata?: Record<string, any>;
        };

        const { eventType, bookId, authorId, userId, sessionId, metadata } = body;

        if (!eventType) {
            return errorResponse('Event type is required', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Get IP and user agent from request
        const ipAddress = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For');
        const userAgent = request.headers.get('User-Agent');
        const referrer = request.headers.get('Referer');

        // Create analytics event
        const event = await prisma.analyticsEvent.create({
            data: {
                eventType: eventType as any,
                bookId,
                authorId,
                userId,
                sessionId,
                metadata: metadata ? JSON.stringify(metadata) : null,
                ipAddress,
                userAgent,
                referrer,
            },
        });

        // Update book analytics if bookId is provided
        if (bookId) {
            await updateBookAnalytics(prisma, bookId, eventType);
        }

        // Update daily stats
        await updateDailyStats(prisma, eventType);

        return successResponse({ eventId: event.id }, HttpStatus.CREATED);
    } catch (error) {
        console.error('Track event error:', error);
        return errorResponse('Failed to track event', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Update book analytics counters
 */
async function updateBookAnalytics(prisma: any, bookId: string, eventType: string): Promise<void> {
    try {
        // Get or create book analytics
        let bookAnalytics = await prisma.bookAnalytics.findUnique({
            where: { bookId },
        });

        if (!bookAnalytics) {
            bookAnalytics = await prisma.bookAnalytics.create({
                data: { bookId },
            });
        }

        // Update counters based on event type
        const updates: any = { lastViewedAt: new Date() };

        switch (eventType) {
            case 'BOOK_VIEW':
                updates.views = { increment: 1 };
                break;
            case 'BOOK_CLICK':
                updates.clicks = { increment: 1 };
                break;
            case 'BOOK_PREVIEW':
                updates.previews = { increment: 1 };
                break;
            case 'BOOK_PURCHASE':
                updates.purchases = { increment: 1 };
                break;
            case 'BOOK_DOWNLOAD':
                updates.downloads = { increment: 1 };
                break;
        }

        await prisma.bookAnalytics.update({
            where: { bookId },
            data: updates,
        });
    } catch (error) {
        console.error('Update book analytics error:', error);
    }
}

/**
 * Update daily stats
 */
async function updateDailyStats(prisma: any, eventType: string): Promise<void> {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Get or create daily stats
        let dailyStats = await prisma.dailyStats.findUnique({
            where: { date: today },
        });

        if (!dailyStats) {
            dailyStats = await prisma.dailyStats.create({
                data: { date: today },
            });
        }

        // Update counters based on event type
        const updates: any = {};

        switch (eventType) {
            case 'BOOK_VIEW':
            case 'PAGE_VIEW':
                updates.totalViews = { increment: 1 };
                break;
            case 'BOOK_CLICK':
                updates.totalClicks = { increment: 1 };
                break;
            case 'BOOK_PURCHASE':
                updates.totalPurchases = { increment: 1 };
                break;
            case 'SIGNUP':
                updates.newUsers = { increment: 1 };
                break;
        }

        if (Object.keys(updates).length > 0) {
            await prisma.dailyStats.update({
                where: { date: today },
                data: updates,
            });
        }
    } catch (error) {
        console.error('Update daily stats error:', error);
    }
}

/**
 * Get dashboard analytics
 */
async function getDashboardAnalytics(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);
        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days') || '30');

        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get daily stats for the period
        const dailyStats = await prisma.dailyStats.findMany({
            where: {
                date: {
                    gte: startDate.toISOString().split('T')[0],
                    lte: endDate.toISOString().split('T')[0],
                },
            },
            orderBy: { date: 'asc' },
        });

        // Get top books by views
        const topBooksByViews = await prisma.bookAnalytics.findMany({
            take: 10,
            orderBy: { views: 'desc' },
        });

        // Get book details separately
        const bookIds = topBooksByViews.map((ba: any) => ba.bookId);
        const books = await prisma.book.findMany({
            where: { id: { in: bookIds } },
            select: {
                id: true,
                title: true,
                coverImage: true,
                author: {
                    select: {
                        user: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        // Merge book data with analytics
        const topBooksByViewsWithDetails = topBooksByViews.map((analytics: any) => {
            const book = books.find((b: any) => b.id === analytics.bookId);
            return {
                ...analytics,
                book: book || { id: analytics.bookId, title: 'Unknown', coverImage: null, author: { user: { name: 'Unknown' } } },
            };
        });

        // Get top books by purchases
        const topBooksByPurchases = await prisma.bookAnalytics.findMany({
            take: 10,
            orderBy: { purchases: 'desc' },
        });

        // Get book details for purchases
        const purchaseBookIds = topBooksByPurchases.map((ba: any) => ba.bookId);
        const purchaseBooks = await prisma.book.findMany({
            where: { id: { in: purchaseBookIds } },
            select: {
                id: true,
                title: true,
                coverImage: true,
                price: true,
                author: {
                    select: {
                        user: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        // Merge book data with analytics
        const topBooksByPurchasesWithDetails = topBooksByPurchases.map((analytics: any) => {
            const book = purchaseBooks.find((b: any) => b.id === analytics.bookId);
            return {
                ...analytics,
                book: book || { id: analytics.bookId, title: 'Unknown', coverImage: null, price: 0, author: { user: { name: 'Unknown' } } },
            };
        });

        // Get recent events
        const recentEvents = await prisma.analyticsEvent.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
        });

        // Calculate totals
        const totals = dailyStats.reduce(
            (acc, stat) => ({
                totalViews: acc.totalViews + stat.totalViews,
                totalClicks: acc.totalClicks + stat.totalClicks,
                totalPurchases: acc.totalPurchases + stat.totalPurchases,
                totalRevenue: acc.totalRevenue + stat.totalRevenue,
                newUsers: acc.newUsers + stat.newUsers,
            }),
            { totalViews: 0, totalClicks: 0, totalPurchases: 0, totalRevenue: 0, newUsers: 0 }
        );

        return successResponse({
            dailyStats,
            topBooksByViews: topBooksByViewsWithDetails,
            topBooksByPurchases: topBooksByPurchasesWithDetails,
            recentEvents,
            totals,
            period: { days, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        });
    } catch (error) {
        console.error('Get dashboard analytics error:', error);
        return errorResponse('Failed to fetch analytics', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get book-specific analytics
 */
async function getBookAnalytics(request: WorkerRequest, env: Env, bookId: string): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        // Get book analytics
        const bookAnalytics = await prisma.bookAnalytics.findUnique({
            where: { bookId },
        });

        if (!bookAnalytics) {
            return successResponse({
                bookId,
                views: 0,
                clicks: 0,
                previews: 0,
                purchases: 0,
                downloads: 0,
                revenue: 0,
            });
        }

        // Get recent events for this book
        const recentEvents = await prisma.analyticsEvent.findMany({
            where: { bookId },
            take: 20,
            orderBy: { createdAt: 'desc' },
        });

        return successResponse({
            ...bookAnalytics,
            recentEvents,
        });
    } catch (error) {
        console.error('Get book analytics error:', error);
        return errorResponse('Failed to fetch book analytics', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
