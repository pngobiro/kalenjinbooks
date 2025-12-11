/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { errorResponse, successResponse, paginatedResponse, HttpStatus, ErrorCode, getPaginationParams, getQueryParams } from '../utils/response';
import { CacheTTL, CachePrefix, generateCacheKey } from '../utils/cache';

/**
 * Handle authors API requests
 */
export async function handleAuthorsRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[AuthorsHandler] Path: ${path}, Method: ${method}`);

    // GET /api/authors - List authors
    if (path === '/api/authors' && method === 'GET') {
        return await listAuthors(request, env);
    }

    // GET /api/authors/:id - Get author details
    if (path.match(/^\/api\/authors\/[^/]+$/) && method === 'GET') {
        const authorId = path.split('/').pop()!;
        return await getAuthor(request, env, authorId);
    }

    return errorResponse(`Not Found. Path: ${path}, Method: ${method}`, HttpStatus.NOT_FOUND);
}

/**
 * List authors with pagination
 */
async function listAuthors(request: WorkerRequest, env: Env): Promise<Response> {
    const searchParams = getQueryParams(request.url);
    const { page, limit } = getPaginationParams(searchParams);

    const cacheKey = generateCacheKey(CachePrefix.AUTHORS, `page:${page}`, `limit:${limit}`);

    // Try cache first
    const { getCached, setCached } = await import('../utils/cache');
    const cached = await getCached<{ authors: any[]; total: number }>(env.CACHE, cacheKey);
    
    if (cached) {
        return paginatedResponse(cached.authors, cached.total, page, limit);
    }

    const prisma = createD1PrismaClient(env.DB);

    // Get total count
    const total = await prisma.author.count();

    // Get authors with user info and book count
    const authors = await prisma.author.findMany({
        include: {
            user: {
                select: { name: true, email: true },
            },
            books: {
                where: { isPublished: true },
                select: { id: true, rating: true },
            },
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    // Transform to include computed fields
    const transformedAuthors = authors.map(author => ({
        id: author.id,
        name: author.user.name,
        bio: author.bio,
        profileImage: author.profileImage,
        booksCount: author.books.length,
        rating: author.books.length > 0 
            ? author.books.reduce((sum, book) => sum + (book.rating || 0), 0) / author.books.length 
            : 0,
    }));

    // Cache the data
    await setCached(env.CACHE, cacheKey, { authors: transformedAuthors, total }, CacheTTL.FIVE_MINUTES);

    return paginatedResponse(transformedAuthors, total, page, limit);
}

/**
 * Get author details with their books
 */
async function getAuthor(request: WorkerRequest, env: Env, authorId: string): Promise<Response> {
    const cacheKey = generateCacheKey(CachePrefix.AUTHOR_DETAIL, authorId);

    // Try cache first
    const { getCached, setCached } = await import('../utils/cache');
    const cached = await getCached<any>(env.CACHE, cacheKey);
    
    if (cached) {
        return successResponse(cached);
    }

    const prisma = createD1PrismaClient(env.DB);

    const author = await prisma.author.findUnique({
        where: { id: authorId },
        include: {
            user: {
                select: { name: true },
            },
            books: {
                where: { isPublished: true },
                include: {
                    author: {
                        include: {
                            user: { select: { name: true } },
                        },
                    },
                },
            },
        },
    });

    if (!author) {
        return errorResponse('Author not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
    }

    const transformedAuthor = {
        id: author.id,
        name: author.user.name,
        bio: author.bio,
        profileImage: author.profileImage,
        booksCount: author.books.length,
        rating: author.books.length > 0 
            ? author.books.reduce((sum, book) => sum + (book.rating || 0), 0) / author.books.length 
            : 0,
        books: author.books,
    };

    // Cache the author data
    await setCached(env.CACHE, cacheKey, transformedAuthor, CacheTTL.TEN_MINUTES);

    return successResponse(transformedAuthor);
}
