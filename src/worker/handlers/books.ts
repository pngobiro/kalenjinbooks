/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { authMiddleware, optionalAuthMiddleware, requireRole } from '../middleware/auth';
import { errorResponse, successResponse, paginatedResponse, HttpStatus, ErrorCode, getPaginationParams, getQueryParams } from '../utils/response';
import { CacheTTL, CachePrefix, generateCacheKey } from '../utils/cache';

/**
 * Handle books API requests
 */
export async function handleBooksRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[BooksHandler] Path: ${path}, Method: ${method}`);

    // GET /api/books - List books
    if (path === '/api/books' && method === 'GET') {
        console.log('[BooksHandler] Listing books');
        return await listBooks(request, env);
    }

    // GET /api/books/:id - Get book details
    if (path.match(/^\/api\/books\/[^/]+$/) && method === 'GET') {
        const bookId = path.split('/').pop()!;
        return await getBook(request, env, bookId);
    }

    // POST /api/books - Create book (authors only)
    if (path === '/api/books' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return await requireRole('AUTHOR', 'ADMIN')(request, env, async () => {
                return await createBook(request, env);
            });
        });
    }

    // PUT /api/books/:id - Update book (author only)
    if (path.match(/^\/api\/books\/[^/]+$/) && method === 'PUT') {
        const bookId = path.split('/').pop()!;
        return await authMiddleware(request, env, async () => {
            return await updateBook(request, env, bookId);
        });
    }

    // DELETE /api/books/:id - Delete book (author only)
    if (path.match(/^\/api\/books\/[^/]+$/) && method === 'DELETE') {
        const bookId = path.split('/').pop()!;
        return await authMiddleware(request, env, async () => {
            return await deleteBook(request, env, bookId);
        });
    }

    return errorResponse(`Not Found. Path seen: ${path}, Method: ${method}`, HttpStatus.NOT_FOUND);
}

/**
 * List books with filtering and pagination
 */
async function listBooks(request: WorkerRequest, env: Env): Promise<Response> {
    const searchParams = getQueryParams(request.url);
    const { page, limit } = getPaginationParams(searchParams);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const authorId = searchParams.get('authorId') || '';
    const featured = searchParams.get('featured') === 'true';

    // Generate cache key
    const cacheKey = generateCacheKey(
        CachePrefix.BOOKS,
        `page:${page}`,
        `limit:${limit}`,
        `search:${search}`,
        `category:${category}`,
        `author:${authorId}`,
        `featured:${featured}`
    );

    // Try cache first
    const { getCached, setCached } = await import('../utils/cache');
    const cached = await getCached<{ books: any[]; total: number }>(env.CACHE, cacheKey);
    
    if (cached) {
        return paginatedResponse(cached.books, cached.total, page, limit);
    }

    const prisma = createD1PrismaClient(env.DB);

    // Build where clause
    const where: any = {
        isPublished: true,
    };

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } },
        ];
    }

    if (category) {
        where.category = category;
    }

    if (authorId) {
        where.authorId = authorId;
    }

    if (featured) {
        where.isFeatured = true;
    }

    // Get total count
    const total = await prisma.book.count({ where });

    // Get books - order by featuredOrder if fetching featured books
    const orderBy = featured 
        ? [{ featuredOrder: 'asc' as const }, { publishedAt: 'desc' as const }]
        : { publishedAt: 'desc' as const };

    const books = await prisma.book.findMany({
        where,
        include: {
            author: {
                include: {
                    user: {
                        select: { name: true },
                    },
                },
            },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
    });

    // Cache the data (not the Response)
    await setCached(env.CACHE, cacheKey, { books, total }, CacheTTL.FIVE_MINUTES);

    return paginatedResponse(books, total, page, limit);
}

/**
 * Get book details
 */
async function getBook(request: WorkerRequest, env: Env, bookId: string): Promise<Response> {
    const cacheKey = generateCacheKey(CachePrefix.BOOK_DETAIL, bookId);

    // Try cache first
    const { getCached, setCached } = await import('../utils/cache');
    const cached = await getCached<any>(env.CACHE, cacheKey);
    
    if (cached) {
        return successResponse(cached);
    }

    const prisma = createD1PrismaClient(env.DB);

    const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
            author: {
                include: {
                    user: {
                        select: { name: true },
                    },
                },
            },
        },
    });

    if (!book) {
        return errorResponse('Book not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
    }

    // Cache the book data
    await setCached(env.CACHE, cacheKey, book, CacheTTL.TEN_MINUTES);

    return successResponse(book);
}

/**
 * Create a new book
 */
async function createBook(request: WorkerRequest, env: Env): Promise<Response> {
    const prisma = createD1PrismaClient(env.DB);

    try {
        const body = await request.json() as { 
            title?: string; 
            description?: string; 
            price?: string | number; 
            category?: string; 
            previewPages?: number;
        };
        const { title, description, price, category, previewPages } = body;

        // Validate required fields
        if (!title || !price) {
            return errorResponse('Title and price are required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Get author ID from authenticated user
        const userId = request.ctx?.user?.id;
        if (!userId) {
            return errorResponse('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        // Get author record
        const author = await prisma.author.findUnique({
            where: { userId },
        });

        if (!author) {
            return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
        }

        // Create book
        const book = await prisma.book.create({
            data: {
                title,
                description,
                price: parseFloat(String(price)),
                category,
                previewPages: previewPages || 10,
                authorId: author.id,
                fileKey: '', // Will be updated after file upload
                fileSize: 0,
                fileType: 'pdf',
            },
        });

        return successResponse(book, HttpStatus.CREATED);
    } catch (error) {
        console.error('Create book error:', error);
        return errorResponse('Failed to create book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Update a book
 */
async function updateBook(request: WorkerRequest, env: Env, bookId: string): Promise<Response> {
    const prisma = createD1PrismaClient(env.DB);

    try {
        const body = await request.json() as Record<string, unknown>;
        const userId = request.ctx?.user?.id;

        // Get book
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: { author: true },
        });

        if (!book) {
            return errorResponse('Book not found', HttpStatus.NOT_FOUND);
        }

        // Check ownership
        if (book.author.userId !== userId && request.ctx?.user?.role !== 'ADMIN') {
            return errorResponse('Not authorized', HttpStatus.FORBIDDEN);
        }

        // Update book
        const updated = await prisma.book.update({
            where: { id: bookId },
            data: body,
        });

        // Invalidate cache
        const { deleteCached } = await import('../utils/cache');
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BOOK_DETAIL, bookId));

        return successResponse(updated);
    } catch (error) {
        console.error('Update book error:', error);
        return errorResponse('Failed to update book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Delete a book
 */
async function deleteBook(request: WorkerRequest, env: Env, bookId: string): Promise<Response> {
    const prisma = createD1PrismaClient(env.DB);

    try {
        const userId = request.ctx?.user?.id;

        // Get book
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: { author: true },
        });

        if (!book) {
            return errorResponse('Book not found', HttpStatus.NOT_FOUND);
        }

        // Check ownership
        if (book.author.userId !== userId && request.ctx?.user?.role !== 'ADMIN') {
            return errorResponse('Not authorized', HttpStatus.FORBIDDEN);
        }

        // Delete from R2
        if (book.fileKey) {
            const { deleteBook: deleteFromR2 } = await import('../../lib/cloudflare-r2');
            await deleteFromR2(book.fileKey);
        }

        // Delete from database
        await prisma.book.delete({
            where: { id: bookId },
        });

        // Invalidate cache
        const { deleteCached } = await import('../utils/cache');
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BOOK_DETAIL, bookId));

        return successResponse({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Delete book error:', error);
        return errorResponse('Failed to delete book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
