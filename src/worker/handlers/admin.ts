/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { errorResponse, successResponse, HttpStatus } from '../utils/response';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { verifyToken } from '../middleware/auth';

/**
 * Handle admin requests
 */
export async function handleAdminRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {

    // Manual authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse('Authentication required', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    try {
        const payload = await verifyToken(token, env);
        if (payload.role !== 'ADMIN') {
            return errorResponse('Insufficient permissions', HttpStatus.FORBIDDEN);
        }
    } catch (e) {
        return errorResponse('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // GET /api/admin/authors - List all authors with applications
    if (path === '/api/admin/authors' && method === 'GET') {
        return await listAllAuthors(request, env);
    }

    // GET /api/admin/authors/applications - List all author applications
    if (path === '/api/admin/authors/applications' && method === 'GET') {
        return await listAuthorApplications(request, env);
    }

    // GET /api/admin/authors/pending - List pending authors
    if (path === '/api/admin/authors/pending' && method === 'GET') {
        return await listPendingAuthors(request, env);
    }

    // POST /api/admin/authors/approve - Approve author
    if (path === '/api/admin/authors/approve' && method === 'POST') {
        return await approveAuthor(request, env);
    }

    // POST /api/admin/authors/reject - Reject author
    if (path === '/api/admin/authors/reject' && method === 'POST') {
        return await rejectAuthor(request, env);
    }

    // POST /api/admin/authors/toggle-status - Enable/Disable author
    if (path === '/api/admin/authors/toggle-status' && method === 'POST') {
        return await toggleAuthorStatus(request, env);
    }

    // POST /api/admin/books/toggle-status - Enable/Disable book
    if (path === '/api/admin/books/toggle-status' && method === 'POST') {
        return await toggleBookStatus(request, env);
    }

    // POST /api/admin/books/toggle-featured - Feature/Unfeature book
    if (path === '/api/admin/books/toggle-featured' && method === 'POST') {
        return await toggleBookFeatured(request, env);
    }

    // POST /api/admin/books/set-featured-order - Set featured book order
    if (path === '/api/admin/books/set-featured-order' && method === 'POST') {
        return await setFeaturedOrder(request, env);
    }

    return errorResponse('Not Found', HttpStatus.NOT_FOUND);
}

async function listAllAuthors(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        const authors = await prisma.author.findMany({
            include: { 
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        role: true,
                    }
                },
                books: {
                    select: {
                        id: true,
                        title: true,
                        isPublished: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return successResponse({
            authors: authors.map(author => ({
                id: author.id,
                userId: author.userId,
                bio: author.bio,
                profileImage: author.profileImage,
                phoneNumber: author.phoneNumber,
                status: author.status,
                totalEarnings: author.totalEarnings,
                appliedAt: author.appliedAt,
                approvedAt: author.approvedAt,
                createdAt: author.createdAt,
                user: author.user,
                booksCount: author.books.length,
                publishedBooksCount: author.books.filter(book => book.isPublished).length,
            }))
        });

    } catch (error) {
        console.error('List all authors error:', error);
        return errorResponse('Failed to list authors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function listAuthorApplications(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        const applications = await prisma.author.findMany({
            include: { 
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        role: true,
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });

        return successResponse({
            applications: applications.map(author => ({
                id: author.id,
                userId: author.userId,
                // Personal Information
                bio: author.bio,
                profileImage: author.profileImage,
                phoneNumber: author.phoneNumber,
                dateOfBirth: author.dateOfBirth,
                nationality: author.nationality,
                location: author.location,
                
                // Professional Information
                education: author.education,
                occupation: author.occupation,
                writingExperience: author.writingExperience,
                previousPublications: author.previousPublications,
                awards: author.awards,
                
                // Writing Information
                genres: author.genres ? JSON.parse(author.genres) : [],
                languages: author.languages ? JSON.parse(author.languages) : [],
                writingStyle: author.writingStyle,
                inspirations: author.inspirations,
                targetAudience: author.targetAudience,
                publishingGoals: author.publishingGoals,
                
                // Social Media
                website: author.website,
                twitter: author.twitter,
                facebook: author.facebook,
                instagram: author.instagram,
                linkedin: author.linkedin,
                
                // Payment Information
                paymentMethod: author.paymentMethod,
                paymentDetails: author.paymentDetails ? JSON.parse(author.paymentDetails) : null,
                
                // Additional Information
                howDidYouHear: author.howDidYouHear,
                additionalInfo: author.additionalInfo,
                agreeToMarketing: author.agreeToMarketing,
                
                // Status and Dates
                status: author.status,
                rejectionReason: author.rejectionReason,
                appliedAt: author.appliedAt,
                approvedAt: author.approvedAt,
                createdAt: author.createdAt,
                updatedAt: author.updatedAt,
                
                // User Information
                user: author.user,
            }))
        });

    } catch (error) {
        console.error('List author applications error:', error);
        return errorResponse('Failed to list author applications', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function listPendingAuthors(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        const pendingAuthors = await prisma.author.findMany({
            where: { status: 'PENDING' },
            include: { user: true }
        });

        return successResponse({
            authors: pendingAuthors.map(author => ({
                id: author.id,
                userId: author.userId,
                email: author.user.email,
                name: author.user.name,
                image: author.user.image,
                createdAt: author.createdAt
            }))
        });

    } catch (error) {
        console.error('List pending authors error:', error);
        return errorResponse('Failed to list pending authors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function approveAuthor(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { authorId } = body;

        if (!authorId) {
            return errorResponse('Author ID is required', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        const author = await prisma.author.update({
            where: { id: authorId },
            data: { status: 'APPROVED' }
        });

        return successResponse({ message: 'Author approved', author });

    } catch (error) {
        console.error('Approve author error:', error);
        return errorResponse('Failed to approve author', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function rejectAuthor(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { authorId, reason } = body;

        if (!authorId) {
            return errorResponse('Author ID is required', HttpStatus.BAD_REQUEST);
        }

        if (!reason || reason.trim().length === 0) {
            return errorResponse('Rejection reason is required', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        const author = await prisma.author.update({
            where: { id: authorId },
            data: { 
                status: 'REJECTED',
                rejectionReason: reason.trim()
            }
        });

        return successResponse({ message: 'Author rejected', author });

    } catch (error) {
        console.error('Reject author error:', error);
        return errorResponse('Failed to reject author', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function toggleAuthorStatus(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { authorId, isActive } = body;

        if (!authorId) {
            return errorResponse('Author ID is required', HttpStatus.BAD_REQUEST);
        }

        if (typeof isActive !== 'boolean') {
            return errorResponse('isActive must be a boolean', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Update author status
        const author = await prisma.author.update({
            where: { id: authorId },
            data: { isActive }
        });

        // If disabling author, also disable all their books
        if (!isActive) {
            await prisma.book.updateMany({
                where: { authorId },
                data: { isActive: false }
            });
        }

        return successResponse({ 
            message: `Author ${isActive ? 'enabled' : 'disabled'} successfully`, 
            author,
            booksAffected: !isActive ? 'All author books have been disabled' : null
        });

    } catch (error) {
        console.error('Toggle author status error:', error);
        return errorResponse('Failed to update author status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function toggleBookStatus(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { bookId, isActive } = body;

        if (!bookId) {
            return errorResponse('Book ID is required', HttpStatus.BAD_REQUEST);
        }

        if (typeof isActive !== 'boolean') {
            return errorResponse('isActive must be a boolean', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        const book = await prisma.book.update({
            where: { id: bookId },
            data: { isActive }
        });

        return successResponse({ 
            message: `Book ${isActive ? 'enabled' : 'disabled'} successfully`, 
            book 
        });

    } catch (error) {
        console.error('Toggle book status error:', error);
        return errorResponse('Failed to update book status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function toggleBookFeatured(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { bookId, isFeatured } = body;

        if (!bookId) {
            return errorResponse('Book ID is required', HttpStatus.BAD_REQUEST);
        }

        if (typeof isFeatured !== 'boolean') {
            return errorResponse('isFeatured must be a boolean', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        // If featuring the book, get the next featured order
        let featuredOrder = null;
        if (isFeatured) {
            const maxOrder = await prisma.book.aggregate({
                where: { isFeatured: true },
                _max: { featuredOrder: true }
            });
            featuredOrder = (maxOrder._max.featuredOrder || 0) + 1;
        }

        const book = await prisma.book.update({
            where: { id: bookId },
            data: { 
                isFeatured,
                featuredOrder: isFeatured ? featuredOrder : null
            }
        });

        // Clear featured books cache
        const { invalidateCacheByPrefix, CachePrefix } = await import('../utils/cache');
        await invalidateCacheByPrefix(env.CACHE, CachePrefix.FEATURED);

        return successResponse({ 
            message: `Book ${isFeatured ? 'featured' : 'unfeatured'} successfully`, 
            book 
        });

    } catch (error) {
        console.error('Toggle book featured error:', error);
        return errorResponse('Failed to update book featured status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function setFeaturedOrder(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { bookId, order } = body;

        if (!bookId) {
            return errorResponse('Book ID is required', HttpStatus.BAD_REQUEST);
        }

        if (typeof order !== 'number' || order < 1) {
            return errorResponse('Order must be a positive number', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Check if book is featured
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            select: { isFeatured: true, featuredOrder: true }
        });

        if (!book) {
            return errorResponse('Book not found', HttpStatus.NOT_FOUND);
        }

        if (!book.isFeatured) {
            return errorResponse('Book must be featured to set order', HttpStatus.BAD_REQUEST);
        }

        // Update the book's featured order
        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: { featuredOrder: order }
        });

        // Clear featured books cache
        const { invalidateCacheByPrefix, CachePrefix } = await import('../utils/cache');
        await invalidateCacheByPrefix(env.CACHE, CachePrefix.FEATURED);

        return successResponse({ 
            message: 'Featured order updated successfully', 
            book: updatedBook 
        });

    } catch (error) {
        console.error('Set featured order error:', error);
        return errorResponse('Failed to update featured order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
