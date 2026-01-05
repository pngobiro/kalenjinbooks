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

    // GET /api/authors/me - Get current user's author profile
    if (path === '/api/authors/me' && method === 'GET') {
        const { authMiddleware: internalAuth } = await import('../middleware/auth');
        return await internalAuth(request, env, async () => {
            return await getMyAuthorProfile(request, env);
        });
    }

    // GET /api/authors - List authors
    if (path === '/api/authors' && method === 'GET') {
        return await listAuthors(request, env);
    }

    // GET /api/authors/:id - Get author details
    if (path.match(/^\/api\/authors\/[^/]+$/) && method === 'GET') {
        const authorId = path.split('/').pop()!;
        return await getAuthor(request, env, authorId);
    }

    // POST /api/authors/apply - Enhanced author application
    if (path === '/api/authors/apply' && method === 'POST') {
        return await applyAsAuthor(request, env);
    }

    // POST /api/authors - Become a new author (legacy endpoint)
    if (path === '/api/authors' && method === 'POST') {
        return await createAuthor(request, env);
    }

    return errorResponse(`Not Found. Path: ${path}, Method: ${method}`, HttpStatus.NOT_FOUND);
}

/**
 * Enhanced author application with comprehensive data
 */
async function applyAsAuthor(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { googleUser, ...formData } = body;

        if (!googleUser || !googleUser.email) {
            return errorResponse('Google authentication required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: googleUser.email },
        });

        // Create user if doesn't exist
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    image: googleUser.image,
                    role: 'READER', // Will be updated to AUTHOR after approval
                },
            });
        }

        // Check if author profile already exists
        const existingAuthor = await prisma.author.findUnique({
            where: { userId: user.id },
        });

        if (existingAuthor) {
            return errorResponse('Author application already exists', HttpStatus.CONFLICT, ErrorCode.RESOURCE_ALREADY_EXISTS);
        }

        // Create comprehensive author profile
        const author = await prisma.author.create({
            data: {
                userId: user.id,
                // Basic info
                bio: formData.bio,
                profileImage: formData.profileImage || googleUser.image,
                phoneNumber: formData.phoneNumber,
                
                // Personal information
                dateOfBirth: formData.dateOfBirth,
                nationality: formData.nationality,
                location: formData.location,
                
                // Professional information
                education: formData.education,
                occupation: formData.occupation,
                writingExperience: formData.writingExperience,
                previousPublications: formData.previousPublications,
                awards: formData.awards,
                
                // Writing information
                genres: JSON.stringify(formData.genres || []),
                languages: JSON.stringify(formData.languages || []),
                writingStyle: formData.writingStyle,
                inspirations: formData.inspirations,
                targetAudience: formData.targetAudience,
                publishingGoals: formData.publishingGoals,
                
                // Social media
                website: formData.website,
                twitter: formData.twitter,
                facebook: formData.facebook,
                instagram: formData.instagram,
                linkedin: formData.linkedin,
                
                // Payment information
                paymentMethod: formData.paymentMethod,
                paymentDetails: JSON.stringify({
                    mpesaNumber: formData.mpesaNumber,
                    bankDetails: formData.bankDetails,
                }),
                
                // Additional information
                howDidYouHear: formData.howDidYouHear,
                additionalInfo: formData.additionalInfo,
                agreeToMarketing: formData.agreeToMarketing || false,
                
                // Status
                status: 'PENDING',
                appliedAt: new Date(),
            },
        });

        // Clear any cached author lists
        const { invalidateCacheByPrefix, CachePrefix } = await import('../utils/cache');
        await invalidateCacheByPrefix(env.CACHE, CachePrefix.AUTHORS);

        return successResponse({
            message: 'Author application submitted successfully',
            author: {
                id: author.id,
                status: author.status,
                appliedAt: author.appliedAt,
            },
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            },
        }, HttpStatus.CREATED);

    } catch (error) {
        console.error('Author application error:', error);
        return errorResponse('Failed to submit author application', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Register as a new author
 */
async function createAuthor(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse('Authentication required', HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_REQUIRED);
        }

        const token = authHeader.substring(7);
        const { verifyToken } = await import('../middleware/auth');
        let payload;

        try {
            payload = await verifyToken(token, env);
        } catch (e) {
            return errorResponse('Invalid token', HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_REQUIRED);
        }

        const userId = payload.sub as string;
        const prisma = createD1PrismaClient(env.DB);

        // Check if author already exists
        const existingAuthor = await prisma.author.findUnique({
            where: { userId },
        });

        if (existingAuthor) {
            return errorResponse('You are already an author', HttpStatus.CONFLICT, ErrorCode.RESOURCE_ALREADY_EXISTS);
        }

        const body = await request.json() as any;
        const { bio, phoneNumber } = body;

        // Transaction to update role and create author profile
        const result = await prisma.$transaction(async (tx) => {
            const author = await tx.author.create({
                data: {
                    userId,
                    bio,
                    phoneNumber,
                    status: 'PENDING', // Default to pending approval
                }
            });

            const user = await tx.user.update({
                where: { id: userId },
                data: { role: 'AUTHOR' } // Auto-upgrade role for now, or keep READER until approved? 
                // Requirement says "IF IS NEW AUTHOR TO REGISTER FLOW". 
                // Usually we let them access dashboard immediately but with "Pending" status.
            });

            return { author, user };
        });

        // Generate new token with updated role
        const { generateToken } = await import('../middleware/auth');
        const newToken = await generateToken(
            { id: result.user.id, email: result.user.email, role: result.user.role },
            env,
            payload.jti as string // reuse session ID
        );

        return successResponse({
            author: result.author,
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                image: result.user.image,
                authorStatus: 'PENDING'
            },
            token: newToken
        }, HttpStatus.CREATED);

    } catch (error) {
        console.error('Create author error:', error);
        return errorResponse('Failed to create author profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
/**
 * Get current user's author profile
 */
async function getMyAuthorProfile(request: WorkerRequest, env: Env): Promise<Response> {
    const userId = request.ctx?.user?.id;
    if (!userId) {
        return errorResponse('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const prisma = createD1PrismaClient(env.DB);

    const author = await prisma.author.findUnique({
        where: { userId },
        include: {
            user: {
                select: { name: true, email: true, image: true },
            },
        },
    });

    if (!author) {
        return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
    }

    // Return detailed author status information
    return successResponse({
        id: author.id,
        userId: author.userId,
        status: author.status,
        rejectionReason: author.rejectionReason,
        appliedAt: author.appliedAt,
        approvedAt: author.approvedAt,
        isActive: author.isActive,
        bio: author.bio,
        phoneNumber: author.phoneNumber,
        paymentMethod: author.paymentMethod,
        totalEarnings: author.totalEarnings,
        user: author.user,
        // Status messages for UI
        statusMessage: getStatusMessage(author.status, author.rejectionReason),
        canPublish: author.status === 'APPROVED' && author.isActive,
    });
}

function getStatusMessage(status: string, rejectionReason?: string | null): string {
    switch (status) {
        case 'PENDING':
            return 'Your author application is being reviewed by our team. You will be notified once a decision is made.';
        case 'APPROVED':
            return 'Congratulations! Your author application has been approved. You can now start publishing books.';
        case 'REJECTED':
            return rejectionReason || 'Your author application was not approved at this time. Please contact support for more information.';
        default:
            return 'Unknown status';
    }
}
