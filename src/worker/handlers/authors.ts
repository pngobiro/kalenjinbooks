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

    // PUT /api/authors/me - Update current user's author profile
    if (path === '/api/authors/me' && method === 'PUT') {
        const { authMiddleware: internalAuth } = await import('../middleware/auth');
        return await internalAuth(request, env, async () => {
            return await updateMyAuthorProfile(request, env);
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
    const url = new URL(request.url);
    const skipCache = url.searchParams.get('_cache') === 'false';
    
    const cacheKey = generateCacheKey(CachePrefix.AUTHOR_DETAIL, authorId);

    // Try cache first (unless skipped)
    const { getCached, setCached } = await import('../utils/cache');
    
    if (!skipCache) {
        const cached = await getCached<any>(env.CACHE, cacheKey);
        
        if (cached) {
            return successResponse(cached);
        }
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
        
        // Personal Information (from main author record)
        dateOfBirth: author.dateOfBirth,
        nationality: author.nationality,
        location: author.location,
        phoneNumber: author.phoneNumber,
        
        // Professional Background
        education: author.education,
        occupation: author.occupation,
        writingExperience: author.writingExperience,
        previousPublications: author.previousPublications,
        awards: author.awards,
        
        // Writing Details
        genres: author.genres,
        languages: author.languages,
        writingStyle: author.writingStyle,
        inspirations: author.inspirations,
        targetAudience: author.targetAudience,
        publishingGoals: author.publishingGoals,
        
        // Social Media & Contact
        website: author.website,
        twitter: author.twitter,
        facebook: author.facebook,
        instagram: author.instagram,
        linkedin: author.linkedin,
        
        // Additional Info
        totalEarnings: author.totalEarnings,
        status: author.status,
        appliedAt: author.appliedAt,
        approvedAt: author.approvedAt,
        
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
            books: {
                where: { isPublished: true },
                select: { id: true, rating: true },
            },
        },
    });

    if (!author) {
        return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
    }

    // Calculate rating and book count
    const booksCount = author.books.length;
    const rating = booksCount > 0
        ? author.books.reduce((sum, book) => sum + (book.rating || 0), 0) / booksCount
        : 0;

    // Return detailed author status information
    return successResponse({
        id: author.id,
        userId: author.userId,
        name: author.user.name,
        bio: author.bio,
        profileImage: author.profileImage,
        booksCount,
        rating,
        
        // Personal Information
        dateOfBirth: author.dateOfBirth,
        nationality: author.nationality,
        location: author.location,
        phoneNumber: author.phoneNumber,
        
        // Professional Information
        education: author.education,
        occupation: author.occupation,
        writingExperience: author.writingExperience,
        previousPublications: author.previousPublications,
        awards: author.awards,
        
        // Writing Information
        genres: author.genres,
        languages: author.languages,
        writingStyle: author.writingStyle,
        inspirations: author.inspirations,
        targetAudience: author.targetAudience,
        publishingGoals: author.publishingGoals,
        
        // Social Media & Online Presence
        website: author.website,
        twitter: author.twitter,
        facebook: author.facebook,
        instagram: author.instagram,
        linkedin: author.linkedin,
        
        // Additional Information
        howDidYouHear: author.howDidYouHear,
        additionalInfo: author.additionalInfo,
        agreeToMarketing: author.agreeToMarketing,
        
        // Payment Information
        paymentMethod: author.paymentMethod,
        paymentDetails: author.paymentDetails,
        totalEarnings: author.totalEarnings,
        
        // Status Information
        status: author.status,
        rejectionReason: author.rejectionReason,
        appliedAt: author.appliedAt,
        approvedAt: author.approvedAt,
        isActive: author.isActive,
        
        user: author.user,
        // Status messages for UI
        statusMessage: getStatusMessage(author.status, author.rejectionReason),
        canPublish: author.status === 'APPROVED' && author.isActive,
    });
}

/**
 * Update current user's author profile
 */
async function updateMyAuthorProfile(request: WorkerRequest, env: Env): Promise<Response> {
    const userId = request.ctx?.user?.id;
    if (!userId) {
        return errorResponse('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const prisma = createD1PrismaClient(env.DB);

    try {
        let updateData: any = {};
        let profileImageUrl: string | undefined;

        // Check if this is a multipart form (file upload)
        const contentType = request.headers.get('content-type') || '';
        
        if (contentType.includes('multipart/form-data')) {
            // Handle multipart form data (with file upload)
            const formData = await request.formData();
            
            // Extract form fields
            const bio = formData.get('bio') as string;
            const phoneNumber = formData.get('phoneNumber') as string;
            const dateOfBirth = formData.get('dateOfBirth') as string;
            const nationality = formData.get('nationality') as string;
            const location = formData.get('location') as string;
            const education = formData.get('education') as string;
            const occupation = formData.get('occupation') as string;
            const writingExperience = formData.get('writingExperience') as string;
            const previousPublications = formData.get('previousPublications') as string;
            const awards = formData.get('awards') as string;
            const genres = formData.get('genres') as string;
            const languages = formData.get('languages') as string;
            const writingStyle = formData.get('writingStyle') as string;
            const inspirations = formData.get('inspirations') as string;
            const targetAudience = formData.get('targetAudience') as string;
            const publishingGoals = formData.get('publishingGoals') as string;
            const website = formData.get('website') as string;
            const twitter = formData.get('twitter') as string;
            const facebook = formData.get('facebook') as string;
            const instagram = formData.get('instagram') as string;
            const linkedin = formData.get('linkedin') as string;
            const additionalInfo = formData.get('additionalInfo') as string;
            const agreeToMarketing = formData.get('agreeToMarketing') === 'true';
            const profileImage = formData.get('profileImage') as File;

            // Handle profile image upload if provided
            if (profileImage && profileImage.size > 0) {
                // Validate file type and size
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!allowedImageTypes.includes(profileImage.type)) {
                    return errorResponse('Profile image must be JPEG, PNG, or WebP format', HttpStatus.BAD_REQUEST);
                }

                if (profileImage.size > 5 * 1024 * 1024) {
                    return errorResponse('Profile image must be smaller than 5MB', HttpStatus.BAD_REQUEST);
                }

                // Upload profile image
                const profileImageKey = `profiles/${userId}/${profileImage.name}`;
                
                try {
                    await env.BOOKS_BUCKET.put(profileImageKey, profileImage.stream(), {
                        httpMetadata: {
                            contentType: profileImage.type,
                        },
                    });
                    profileImageUrl = `https://kalenjin-books-worker.pngobiro.workers.dev/api/images/${profileImageKey}`;
                } catch (uploadError) {
                    console.error('Profile image upload error:', uploadError);
                    return errorResponse('Failed to upload profile image', HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            updateData = {
                bio: bio || null,
                phoneNumber: phoneNumber || null,
                dateOfBirth: dateOfBirth || null,
                nationality: nationality || null,
                location: location || null,
                education: education || null,
                occupation: occupation || null,
                writingExperience: writingExperience || null,
                previousPublications: previousPublications || null,
                awards: awards || null,
                genres: genres || null,
                languages: languages || null,
                writingStyle: writingStyle || null,
                inspirations: inspirations || null,
                targetAudience: targetAudience || null,
                publishingGoals: publishingGoals || null,
                website: website || null,
                twitter: twitter || null,
                facebook: facebook || null,
                instagram: instagram || null,
                linkedin: linkedin || null,
                additionalInfo: additionalInfo || null,
                agreeToMarketing,
            };

            if (profileImageUrl) {
                updateData.profileImage = profileImageUrl;
            }
        } else {
            // Handle JSON data (no file upload)
            const body = await request.json() as any;
            updateData = {
                bio: body.bio || null,
                phoneNumber: body.phoneNumber || null,
                dateOfBirth: body.dateOfBirth || null,
                nationality: body.nationality || null,
                location: body.location || null,
                education: body.education || null,
                occupation: body.occupation || null,
                writingExperience: body.writingExperience || null,
                previousPublications: body.previousPublications || null,
                awards: body.awards || null,
                genres: body.genres || null,
                languages: body.languages || null,
                writingStyle: body.writingStyle || null,
                inspirations: body.inspirations || null,
                targetAudience: body.targetAudience || null,
                publishingGoals: body.publishingGoals || null,
                website: body.website || null,
                twitter: body.twitter || null,
                facebook: body.facebook || null,
                instagram: body.instagram || null,
                linkedin: body.linkedin || null,
                additionalInfo: body.additionalInfo || null,
                agreeToMarketing: body.agreeToMarketing || false,
            };
        }

        // Update author profile
        const updatedAuthor = await prisma.author.update({
            where: { userId },
            data: updateData,
            include: {
                user: {
                    select: { name: true, email: true, image: true },
                },
                books: {
                    where: { isPublished: true },
                    select: { id: true, rating: true },
                },
            },
        });

        // Calculate rating and book count
        const booksCount = updatedAuthor.books.length;
        const rating = booksCount > 0
            ? updatedAuthor.books.reduce((sum, book) => sum + (book.rating || 0), 0) / booksCount
            : 0;

        return successResponse({
            message: 'Profile updated successfully',
            author: {
                id: updatedAuthor.id,
                name: updatedAuthor.user.name,
                bio: updatedAuthor.bio,
                profileImage: updatedAuthor.profileImage,
                booksCount,
                rating,
                // Include all the updated fields
                ...updateData,
                status: updatedAuthor.status,
                user: updatedAuthor.user,
            },
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
