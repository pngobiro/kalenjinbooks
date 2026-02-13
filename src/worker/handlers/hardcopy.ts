/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { errorResponse, successResponse, HttpStatus } from '../utils/response';

/**
 * Handle hard copy request API endpoints
 */
export async function handleHardCopyRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[HardCopyHandler] Path: ${path}, Method: ${method}`);

    // GET /api/authors/hard-copy-requests - Get author's hard copy requests
    if (path === '/api/authors/hard-copy-requests' && method === 'GET') {
        const { authMiddleware: internalAuth } = await import('../middleware/auth');
        return await internalAuth(request, env, async () => {
            return await getAuthorRequests(request, env);
        });
    }

    // PUT /api/authors/hard-copy-requests/:id/respond - Respond to a request
    if (path.match(/^\/api\/authors\/hard-copy-requests\/[^/]+\/respond$/) && method === 'PUT') {
        const { authMiddleware: internalAuth } = await import('../middleware/auth');
        return await internalAuth(request, env, async () => {
            const requestId = path.split('/')[4];
            return await respondToRequest(request, env, requestId);
        });
    }

    // POST /api/hard-copy-requests - Create a new request (public endpoint)
    if (path === '/api/hard-copy-requests' && method === 'POST') {
        return await createHardCopyRequest(request, env);
    }

    return errorResponse(`Not Found. Path: ${path}`, HttpStatus.NOT_FOUND);
}

/**
 * Get all hard copy requests for an author
 */
async function getAuthorRequests(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const userId = request.ctx?.user?.id;
        if (!userId) {
            return errorResponse('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Get author profile
        const author = await prisma.author.findUnique({
            where: { userId },
        });

        if (!author) {
            return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
        }

        // Get all requests for this author
        const requests = await prisma.hardCopyRequest.findMany({
            where: { authorId: author.id },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return successResponse(requests);
    } catch (error) {
        console.error('Get author requests error:', error);
        return errorResponse('Failed to fetch requests', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Respond to a hard copy request
 */
async function respondToRequest(
    request: WorkerRequest,
    env: Env,
    requestId: string
): Promise<Response> {
    try {
        const userId = request.ctx?.user?.id;
        if (!userId) {
            return errorResponse('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        const body = await request.json() as any;
        const { status, authorResponse, estimatedPrice, estimatedDelivery } = body;

        if (!status || !['ACCEPTED', 'DECLINED', 'COMPLETED'].includes(status)) {
            return errorResponse('Invalid status', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Get author profile
        const author = await prisma.author.findUnique({
            where: { userId },
        });

        if (!author) {
            return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
        }

        // Verify the request belongs to this author
        const existingRequest = await prisma.hardCopyRequest.findUnique({
            where: { id: requestId },
        });

        if (!existingRequest) {
            return errorResponse('Request not found', HttpStatus.NOT_FOUND);
        }

        if (existingRequest.authorId !== author.id) {
            return errorResponse('Unauthorized', HttpStatus.FORBIDDEN);
        }

        // Update the request
        const updatedRequest = await prisma.hardCopyRequest.update({
            where: { id: requestId },
            data: {
                status,
                authorResponse,
                estimatedPrice,
                estimatedDelivery,
                respondedAt: new Date(),
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                    },
                },
            },
        });

        // TODO: Send email notification to requester

        return successResponse({
            message: 'Response submitted successfully',
            request: updatedRequest,
        });
    } catch (error) {
        console.error('Respond to request error:', error);
        return errorResponse('Failed to submit response', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Create a new hard copy request (public endpoint)
 */
async function createHardCopyRequest(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const {
            bookId,
            requesterName,
            requesterEmail,
            requesterPhone,
            deliveryAddress,
            city,
            country,
            postalCode,
            quantity,
            message,
        } = body;

        // Validate required fields
        if (!bookId || !requesterName || !requesterEmail || !requesterPhone || 
            !deliveryAddress || !city || !country) {
            return errorResponse('Missing required fields', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Get book and author info
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            select: {
                id: true,
                title: true,
                authorId: true,
            },
        });

        if (!book) {
            return errorResponse('Book not found', HttpStatus.NOT_FOUND);
        }

        // Create the request
        const hardCopyRequest = await prisma.hardCopyRequest.create({
            data: {
                bookId,
                authorId: book.authorId,
                requesterName,
                requesterEmail,
                requesterPhone,
                deliveryAddress,
                city,
                country,
                postalCode,
                quantity: quantity || 1,
                message,
                status: 'PENDING',
            },
        });

        // TODO: Send email notification to author

        return successResponse({
            message: 'Request submitted successfully',
            request: hardCopyRequest,
        }, HttpStatus.CREATED);
    } catch (error) {
        console.error('Create hard copy request error:', error);
        return errorResponse('Failed to create request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
