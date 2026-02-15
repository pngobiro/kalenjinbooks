/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { errorResponse, successResponse, HttpStatus, ErrorCode } from '../utils/response';
import { createD1PrismaClient } from '../../lib/db/d1-client';

/**
 * Handle blog requests
 */
export async function handleBlogRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // GET /api/blog/posts - List blog posts
    if (path === '/api/blog/posts' && method === 'GET') {
        return await listBlogPosts(request, env);
    }

    // GET /api/blog/posts/:id - Get single blog post
    const blogPostMatch = path.match(/^\/api\/blog\/posts\/([^/]+)$/);
    if (blogPostMatch && method === 'GET') {
        return await getBlogPost(request, env, blogPostMatch[1]);
    }

    return errorResponse('Not Found', HttpStatus.NOT_FOUND);
}

/**
 * List blog posts
 */
async function listBlogPosts(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        
        const authorId = searchParams.get('authorId');
        const published = searchParams.get('published') === 'true';
        const limit = parseInt(searchParams.get('limit') || '10');

        const prisma = createD1PrismaClient(env.DB);

        const where: any = {};
        
        if (published) {
            where.isPublished = true;
        }
        
        if (authorId) {
            where.authorId = authorId;
        }

        const posts = await prisma.blogPost.findMany({
            where,
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                publishedAt: 'desc',
            },
            take: limit,
        });

        return successResponse({ posts });
    } catch (error) {
        console.error('List blog posts error:', error);
        return errorResponse('Failed to fetch blog posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get single blog post
 */
async function getBlogPost(request: WorkerRequest, env: Env, postId: string): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        const post = await prisma.blogPost.findUnique({
            where: { id: postId },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!post) {
            return errorResponse('Blog post not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
        }

        // Increment view count
        await prisma.blogPost.update({
            where: { id: postId },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        return successResponse(post);
    } catch (error) {
        console.error('Get blog post error:', error);
        return errorResponse('Failed to fetch blog post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
