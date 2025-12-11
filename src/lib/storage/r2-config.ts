/**
 * R2 Storage Configuration
 * Constants and utilities for Cloudflare R2 bucket management
 */

/**
 * R2 Bucket names
 */
export const R2_BUCKETS = {
    BOOKS: 'kalenjin-books',
} as const;

/**
 * File path patterns
 */
export const R2_PATHS = {
    BOOKS: (bookId: string, filename: string) => `books/${bookId}/${filename}`,
    COVERS: (filename: string) => `covers/${filename}`,
    PROFILES: (filename: string) => `profiles/${filename}`,
    BLOG_IMAGES: (filename: string) => `blog-images/${filename}`,
} as const;

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
    BOOK: 100 * 1024 * 1024, // 100 MB
    IMAGE: 5 * 1024 * 1024, // 5 MB
    COVER: 2 * 1024 * 1024, // 2 MB
} as const;

/**
 * Allowed file types
 */
export const ALLOWED_FILE_TYPES = {
    BOOKS: ['application/pdf', 'application/epub+zip'],
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
} as const;

/**
 * Image sizes for optimization
 */
export const IMAGE_SIZES = {
    THUMBNAIL: { width: 200, height: 300 },
    MEDIUM: { width: 400, height: 600 },
    LARGE: { width: 800, height: 1200 },
} as const;

/**
 * R2 public URL configuration
 * Set this to your R2 public bucket URL or custom domain
 */
export function getR2PublicUrl(fileKey: string, accountId?: string): string {
    // If using R2 public buckets
    if (accountId) {
        return `https://pub-${accountId}.r2.dev/${fileKey}`;
    }

    // If using custom domain (recommended for production)
    // return `https://cdn.kalenjinbooks.com/${fileKey}`;

    // Fallback to signed URL pattern
    return fileKey;
}

/**
 * Validate file type
 */
export function isValidFileType(contentType: string, allowedTypes: readonly string[]): boolean {
    return allowedTypes.includes(contentType);
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
    return size > 0 && size <= maxSize;
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalFilename.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
}

/**
 * Extract file extension
 */
export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Get content type from filename
 */
export function getContentTypeFromFilename(filename: string): string {
    const ext = getFileExtension(filename);

    const contentTypes: Record<string, string> = {
        pdf: 'application/pdf',
        epub: 'application/epub+zip',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
    };

    return contentTypes[ext] || 'application/octet-stream';
}
