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

    return errorResponse('Not Found', HttpStatus.NOT_FOUND);
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
        const { authorId } = body;

        if (!authorId) {
            return errorResponse('Author ID is required', HttpStatus.BAD_REQUEST);
        }

        const prisma = createD1PrismaClient(env.DB);

        const author = await prisma.author.update({
            where: { id: authorId },
            data: { status: 'REJECTED' }
        });

        return successResponse({ message: 'Author rejected', author });

    } catch (error) {
        console.error('Reject author error:', error);
        return errorResponse('Failed to reject author', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
