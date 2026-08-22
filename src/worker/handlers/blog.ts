/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { errorResponse, successResponse, HttpStatus, ErrorCode, parseJsonBody } from '../utils/response';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { authMiddleware, optionalAuthMiddleware, requireRole } from '../middleware/auth';
import { CachePrefix, generateCacheKey, getCached, setCached, deleteCached, CacheTTL } from '../utils/cache';

const PAGE_SIZE = 12;

/**
 * Generate a URL-friendly slug from a title (worker-safe, no external deps).
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[*+~.()'"!:@]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Extract a plain text excerpt from HTML content (worker-safe, no external deps).
 */
function extractExcerpt(content: string, maxLength: number = 200): string {
    const cleaned = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) {
        return cleaned;
    }
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
}

/**
 * Handle all blog requests: /api/blog/...
 */
export async function handleBlogRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Public: list posts (auth optional — owners/admins may see drafts)
    if (path === '/api/blog/posts' && method === 'GET') {
        return await optionalAuthMiddleware(request, env, async () => {
            return await listBlogPosts(request, env);
        });
    }

    // Protected: create post
    if (path === '/api/blog/posts' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return requireRole('AUTHOR', 'ADMIN')(request, env, async () => {
                return await createBlogPost(request, env);
            });
        });
    }

    // Single post routes: /api/blog/posts/:id
    const postMatch = path.match(/^\/api\/blog\/posts\/([^/]+)$/);
    if (postMatch) {
        const postId = postMatch[1];
        const isById = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);

        // Public: get single post (by id or slug)
        if (method === 'GET') {
            return await getBlogPost(request, env, postId, isById);
        }

        // Protected: update post
        if (method === 'PUT') {
            return await authMiddleware(request, env, async () => {
                return requireRole('AUTHOR', 'ADMIN')(request, env, async () => {
                    return await updateBlogPost(request, env, postId, isById);
                });
            });
        }

        // Protected: delete post
        if (method === 'DELETE') {
            return await authMiddleware(request, env, async () => {
                return requireRole('AUTHOR', 'ADMIN')(request, env, async () => {
                    return await deleteBlogPost(request, env, postId, isById);
                });
            });
        }
    }

    // Admin: publish scheduled posts
    if (path === '/api/blog/publish-scheduled' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return requireRole('ADMIN')(request, env, async () => {
                return await publishScheduledPosts(request, env);
            });
        });
    }

    // Admin: toggle featured status
    if (path === '/api/blog/toggle-featured' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return requireRole('ADMIN')(request, env, async () => {
                return await toggleFeaturedPost(request, env);
            });
        });
    }

    return errorResponse('Not Found', HttpStatus.NOT_FOUND);
}

/**
 * List blog posts (public: only published; author-specific: all)
 */
async function listBlogPosts(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const authorId = searchParams.get('authorId');
        const published = searchParams.get('published') === 'true';
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10)));
        const sort = searchParams.get('sort') || 'latest';

        const userId = request.ctx?.user?.id;
        const userRole = request.ctx?.user?.role;

        const prisma = createD1PrismaClient(env.DB);

        const where: any = {};

        if (published) {
            where.isPublished = true;
        }

        if (authorId) {
            where.authorId = authorId;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { excerpt: { contains: search } },
            ];
        }

        if (category) {
            where.category = category;
        }

        // If not authenticated as admin, only show published posts
        // unless the requester is the owning author viewing their own list.
        if (!published) {
            let isOwner = false;
            if (userId && authorId && userRole !== 'ADMIN') {
                const ownProfile = await prisma.author.findFirst({ where: { id: authorId, userId }, select: { id: true } });
                isOwner = !!ownProfile;
            }
            const canSeeDrafts = userRole === 'ADMIN' || isOwner;
            if (!canSeeDrafts) {
                where.isPublished = true;
            }
        }

        const orderBy = sort === 'most-viewed'
            ? { viewCount: 'desc' as const }
            : { publishedAt: 'desc' as const };

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: {
                    author: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.blogPost.count({ where }),
        ]);

        return successResponse({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('List blog posts error:', error);
        return errorResponse('Failed to fetch blog posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get single blog post by id or slug
 */
async function getBlogPost(request: WorkerRequest, env: Env, postId: string, isById: boolean): Promise<Response> {
    try {
        const cacheKey = generateCacheKey(CachePrefix.BLOG_POST, postId);
        const { getCached, setCached } = await import('../utils/cache');
        const cached = await getCached<any>(env.CACHE, cacheKey);

        if (cached && cached.isPublished) {
            return successResponse(cached);
        }

        const prisma = createD1PrismaClient(env.DB);

        let post = await prisma.blogPost.findUnique({
            where: isById ? { id: postId } : { slug: postId },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
                images: true,
            },
        });

        // Fallback: if slug lookup failed, try by id (custom non-UUID ids)
        if (!post && !isById) {
            post = await prisma.blogPost.findUnique({
                where: { id: postId },
                include: {
                    author: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                    images: true,
                },
            });
        }

        if (!post) {
            return errorResponse('Blog post not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
        }

        const userId = request.ctx?.user?.id;
        const userRole = request.ctx?.user?.role;

        // Resolve whether the requester owns this post (post.authorId is an Author.id, not a User.id)
        let isOwner = false;
        if (userId && userRole !== 'ADMIN') {
            const author = await prisma.author.findFirst({ where: { id: post.authorId, userId }, select: { id: true } });
            isOwner = !!author;
        }

        // If unpublished, only author/admin can view
        if (!post.isPublished) {
            if (!userId || (userRole !== 'ADMIN' && !isOwner)) {
                return errorResponse('Blog post not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
            }
        }

        // Increment view count (only for published posts viewed by non-author)
        if (post.isPublished && !isOwner) {
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { viewCount: { increment: 1 } },
            });
            post.viewCount += 1;
        }

        if (post.isPublished) {
            await setCached(env.CACHE, cacheKey, post, CacheTTL.TEN_MINUTES);
        }

        return successResponse(post);
    } catch (error) {
        console.error('Get blog post error:', error);
        return errorResponse('Failed to fetch blog post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Create a new blog post
 */
async function createBlogPost(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await parseJsonBody<{
            title?: string;
            content?: string;
            excerpt?: string;
            coverImage?: string;
            coverType?: string;
            coverVideoUrl?: string;
            category?: string;
            tags?: string;
            scheduledAt?: string;
            isPublished?: boolean;
        }>(request);

        const { title, content, excerpt, coverImage, coverType, coverVideoUrl, category, tags, scheduledAt, isPublished } = body;

        if (!title || !content) {
            return errorResponse('Title and content are required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        const userId = request.ctx?.user?.id;
        if (!userId) {
            return errorResponse('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Get author record for this user
        const author = await prisma.author.findUnique({
            where: { userId },
        });

        if (!author) {
            return errorResponse('Author profile not found. Please register as an author first.', HttpStatus.NOT_FOUND);
        }

        // Check if user is admin (admins can publish directly)
        const userRole = request.ctx?.user?.role;

        // Generate unique slug
        const baseSlug = generateSlug(title);
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.blogPost.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || extractExcerpt(content),
                coverImage: coverImage || null,
                coverType: coverType === 'video' ? 'video' : 'image',
                coverVideoUrl: coverType === 'video' ? coverVideoUrl || null : null,
                category: category || null,
                tags: tags || null,
                authorId: author.id,
                isPublished: isPublished && !scheduledAt ? true : false,
                publishedAt: isPublished && !scheduledAt ? new Date() : null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            },
            include: {
                author: {
                    include: {
                        user: {
                            select: { name: true, image: true },
                        },
                    },
                },
            },
        });

        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POSTS, 'all'));

        return successResponse(post, HttpStatus.CREATED);
    } catch (error) {
        console.error('Create blog post error:', error);
        return errorResponse('Failed to create blog post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Update a blog post (author owner or admin)
 */
async function updateBlogPost(request: WorkerRequest, env: Env, postId: string, isById: boolean): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        const existing = await prisma.blogPost.findUnique({
            where: isById ? { id: postId } : { slug: postId },
        });

        if (!existing) {
            return errorResponse('Blog post not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
        }

        // Ownership check: admin or the author who owns the post
        const userId = request.ctx?.user?.id;
        const userRole = request.ctx?.user?.role;

        const author = await prisma.author.findUnique({
            where: { userId },
        });

        if (!author) {
            return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
        }

        if (userRole !== 'ADMIN' && existing.authorId !== author.id) {
            return errorResponse('Insufficient permissions', HttpStatus.FORBIDDEN, ErrorCode.INSUFFICIENT_PERMISSIONS);
        }

        const body = await parseJsonBody<{
            title?: string;
            content?: string;
            excerpt?: string;
            coverImage?: string;
            coverType?: string;
            coverVideoUrl?: string;
            category?: string;
            tags?: string;
            scheduledAt?: string;
            isPublished?: boolean;
            isFeatured?: boolean;
        }>(request);

        const data: any = {};

        if (body.title !== undefined) {
            data.title = body.title;
            // If title changed, regenerate slug
            if (body.title !== existing.title) {
                const baseSlug = generateSlug(body.title);
                let slug = baseSlug;
                let counter = 1;
                while (await prisma.blogPost.findFirst({ where: { slug, id: { not: existing.id } } })) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }
                data.slug = slug;
            }
        }

        if (body.content !== undefined) {
            data.content = body.content;
            if (body.excerpt === undefined) {
                data.excerpt = extractExcerpt(body.content);
            }
        }

        if (body.excerpt !== undefined) data.excerpt = body.excerpt;
        if (body.coverImage !== undefined) data.coverImage = body.coverImage;
        if (body.coverType !== undefined) {
            data.coverType = body.coverType === 'video' ? 'video' : 'image';
            if (body.coverType === 'video') {
                data.coverVideoUrl = body.coverVideoUrl || null;
            } else {
                data.coverVideoUrl = null;
            }
        }
        if (body.coverVideoUrl !== undefined && existing.coverType === 'video') {
            data.coverVideoUrl = body.coverVideoUrl;
        }

        if (body.category !== undefined) data.category = body.category;
        if (body.tags !== undefined) data.tags = body.tags;
        if (body.scheduledAt !== undefined) {
            data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
        }
        if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;

        // Publishing/unpublishing
        if (body.isPublished !== undefined) {
            data.isPublished = body.isPublished;
            if (body.isPublished && !existing.publishedAt) {
                data.publishedAt = new Date();
            }
            if (!body.isPublished) {
                data.publishedAt = null;
            }
        }

        const post = await prisma.blogPost.update({
            where: { id: existing.id },
            data,
            include: {
                author: {
                    include: {
                        user: {
                            select: { name: true, image: true },
                        },
                    },
                },
            },
        });

        // Invalidate caches
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POST, postId));
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POSTS, 'all'));

        return successResponse(post);
    } catch (error) {
        console.error('Update blog post error:', error);
        return errorResponse('Failed to update blog post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Delete a blog post (author owner or admin)
 */
async function deleteBlogPost(request: WorkerRequest, env: Env, postId: string, isById: boolean): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);

        const existing = await prisma.blogPost.findUnique({
            where: isById ? { id: postId } : { slug: postId },
        });

        if (!existing) {
            return errorResponse('Blog post not found', HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
        }

        const userId = request.ctx?.user?.id;
        const userRole = request.ctx?.user?.role;

        const author = await prisma.author.findUnique({
            where: { userId },
        });

        if (!author) {
            return errorResponse('Author profile not found', HttpStatus.NOT_FOUND);
        }

        if (userRole !== 'ADMIN' && existing.authorId !== author.id) {
            return errorResponse('Insufficient permissions', HttpStatus.FORBIDDEN, ErrorCode.INSUFFICIENT_PERMISSIONS);
        }

        await prisma.blogPost.delete({
            where: { id: existing.id },
        });

        // Invalidate caches
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POST, postId));
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POSTS, 'all'));

        return successResponse({ id: existing.id, deleted: true });
    } catch (error) {
        console.error('Delete blog post error:', error);
        return errorResponse('Failed to delete blog post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Publish scheduled blog posts (called by cron or admin)
 */
async function publishScheduledPosts(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);
        const now = new Date();

        const scheduledPosts = await prisma.blogPost.findMany({
            where: {
                isPublished: false,
                scheduledAt: { lte: now },
            },
        });

        if (scheduledPosts.length === 0) {
            return successResponse({ message: 'No scheduled posts to publish', published: 0 });
        }

        const result = await prisma.blogPost.updateMany({
            where: {
                id: { in: scheduledPosts.map(p => p.id) },
            },
            data: {
                isPublished: true,
                publishedAt: now,
                scheduledAt: null,
            },
        });

        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POSTS, 'all'));

        return successResponse({
            message: `Published ${result.count} scheduled posts`,
            published: result.count,
        });
    } catch (error) {
        console.error('Publish scheduled posts error:', error);
        return errorResponse('Failed to publish scheduled posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Toggle featured status for a blog post (admin only)
 */
async function toggleFeaturedPost(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);
        const body = await parseJsonBody<{ postId: string; isFeatured: boolean }>(request);

        if (!body.postId) {
            return errorResponse('Post ID is required', HttpStatus.BAD_REQUEST);
        }

        const post = await prisma.blogPost.findUnique({
            where: { id: body.postId },
        });

        if (!post) {
            return errorResponse('Post not found', HttpStatus.NOT_FOUND);
        }

        const updated = await prisma.blogPost.update({
            where: { id: body.postId },
            data: { isFeatured: body.isFeatured },
        });

        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BLOG_POSTS, 'all'));

        return successResponse({ id: updated.id, isFeatured: updated.isFeatured });
    } catch (error) {
        console.error('Toggle featured post error:', error);
        return errorResponse('Failed to toggle featured status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}