/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { authMiddleware, requireRole } from '../middleware/auth';
import { errorResponse, successResponse, HttpStatus, ErrorCode } from '../utils/response';
import { isValidFileType, isValidFileSize, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES, R2_PATHS, generateUniqueFilename } from '../../lib/storage/r2-config';

/**
 * Handle file upload requests
 */
export async function handleUploadRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // POST /api/upload/book - Upload book file
    if (path === '/api/upload/book' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return await requireRole('AUTHOR', 'ADMIN')(request, env, async () => {
                return await uploadBook(request, env);
            });
        });
    }

    // POST /api/upload/image - Upload image (cover, profile, blog)
    if (path === '/api/upload/image' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return await uploadImage(request, env);
        });
    }

    return errorResponse('Not Found', HttpStatus.NOT_FOUND);
}

/**
 * Upload book file to R2
 */
async function uploadBook(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bookId = formData.get('bookId') as string;

        if (!file || !bookId) {
            return errorResponse('File and bookId are required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate file type
        if (!isValidFileType(file.type, ALLOWED_FILE_TYPES.BOOKS)) {
            return errorResponse('Invalid file type. Only PDF and EPUB are allowed.', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate file size
        if (!isValidFileSize(file.size, FILE_SIZE_LIMITS.BOOK)) {
            return errorResponse(`File too large. Maximum size is ${FILE_SIZE_LIMITS.BOOK / 1024 / 1024}MB`, HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Generate file key
        const filename = generateUniqueFilename(file.name);
        const fileKey = R2_PATHS.BOOKS(bookId, filename);

        // Upload to R2
        const arrayBuffer = await file.arrayBuffer();
        await env.BOOKS_BUCKET.put(fileKey, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
            customMetadata: {
                bookId,
                uploadedAt: new Date().toISOString(),
                originalFilename: file.name,
            },
        });

        // Update book record in database
        const { createD1PrismaClient } = await import('../../lib/db/d1-client');
        const prisma = createD1PrismaClient(env.DB);

        await prisma.book.update({
            where: { id: bookId },
            data: {
                fileKey,
                fileSize: file.size,
                fileType: file.type.includes('pdf') ? 'pdf' : 'epub',
            },
        });

        // Invalidate cache
        const { deleteCached, generateCacheKey, CachePrefix } = await import('../utils/cache');
        await deleteCached(env.CACHE, generateCacheKey(CachePrefix.BOOK_DETAIL, bookId));

        return successResponse({
            fileKey,
            fileSize: file.size,
            fileType: file.type,
        });
    } catch (error) {
        console.error('Upload book error:', error);
        return errorResponse('Failed to upload book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Upload image to R2
 */
async function uploadImage(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string; // 'cover', 'profile', 'blog'

        if (!file) {
            return errorResponse('File is required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate file type
        if (!isValidFileType(file.type, ALLOWED_FILE_TYPES.IMAGES)) {
            return errorResponse('Invalid file type. Only images are allowed.', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate file size
        const maxSize = type === 'cover' ? FILE_SIZE_LIMITS.COVER : FILE_SIZE_LIMITS.IMAGE;
        if (!isValidFileSize(file.size, maxSize)) {
            return errorResponse(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`, HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Generate file key based on type
        const filename = generateUniqueFilename(file.name);
        let fileKey: string;

        switch (type) {
            case 'cover':
                fileKey = R2_PATHS.COVERS(filename);
                break;
            case 'profile':
                fileKey = R2_PATHS.PROFILES(filename);
                break;
            case 'blog':
                fileKey = R2_PATHS.BLOG_IMAGES(filename);
                break;
            default:
                fileKey = `images/${filename}`;
        }

        // Upload to R2
        const arrayBuffer = await file.arrayBuffer();
        await env.BOOKS_BUCKET.put(fileKey, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
            customMetadata: {
                uploadedAt: new Date().toISOString(),
                uploadedBy: request.ctx?.user?.id || 'unknown',
            },
        });

        // Get public URL
        const { getPublicUrl } = await import('../../lib/cloudflare-r2');
        const url = getPublicUrl(fileKey);

        // If blog image, save to database
        if (type === 'blog') {
            const { createD1PrismaClient } = await import('../../lib/db/d1-client');
            const prisma = createD1PrismaClient(env.DB);

            const blogImage = await prisma.blogImage.create({
                data: {
                    imageKey: fileKey,
                },
            });

            return successResponse({
                id: blogImage.id,
                imageKey: fileKey,
                url,
            });
        }

        return successResponse({
            imageKey: fileKey,
            url,
        });
    } catch (error) {
        console.error('Upload image error:', error);
        return errorResponse('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
