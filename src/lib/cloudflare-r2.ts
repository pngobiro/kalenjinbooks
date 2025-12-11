import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2PublicUrl } from './storage/r2-config';

// Cloudflare R2 configuration
const R2_ENDPOINT = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kalenjin-books';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Initialize S3 client for R2 (R2 is S3-compatible)
const r2Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export interface UploadBookParams {
    file: Buffer;
    fileName: string;
    contentType: string;
    bookId: string;
}

export interface UploadImageParams {
    file: Buffer;
    fileName: string;
    contentType: string;
}

/**
 * Upload a book file to Cloudflare R2
 */
export async function uploadBook({ file, fileName, contentType, bookId }: UploadBookParams): Promise<string> {
    const fileKey = `books/${bookId}/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ContentType: contentType,
        Metadata: {
            bookId,
            uploadedAt: new Date().toISOString(),
        },
    });

    await r2Client.send(command);
    return fileKey;
}

/**
 * Upload an image (cover, profile) to Cloudflare R2
 */
export async function uploadImage({ file, fileName, contentType }: UploadImageParams): Promise<string> {
    const fileKey = `images/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ContentType: contentType,
    });

    await r2Client.send(command);
    return fileKey;
}

/**
 * Generate a signed URL for secure book access
 * @param fileKey - The R2 object key
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export async function getSignedBookUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
}

/**
 * Delete a book file from R2
 */
export async function deleteBook(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
    });

    await r2Client.send(command);
}

/**
 * Check if a file exists in R2
 */
export async function fileExists(fileKey: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileKey,
        });

        await r2Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(fileKey: string) {
    const command = new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
    });

    const response = await r2Client.send(command);
    return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        metadata: response.Metadata,
    };
}

/**
 * Get public URL for R2 object (if bucket is public)
 * @param fileKey - The R2 object key
 */
export function getPublicUrl(fileKey: string): string {
    if (R2_PUBLIC_URL) {
        return `${R2_PUBLIC_URL}/${fileKey}`;
    }
    return getR2PublicUrl(fileKey, process.env.CLOUDFLARE_ACCOUNT_ID);
}

/**
 * Upload multiple files to R2 in batch
 */
export async function uploadBatch(files: Array<{
    fileKey: string;
    file: Buffer;
    contentType: string;
    metadata?: Record<string, string>;
}>): Promise<string[]> {
    const uploadPromises = files.map(({ fileKey, file, contentType, metadata }) => {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileKey,
            Body: file,
            ContentType: contentType,
            Metadata: metadata,
        });
        return r2Client.send(command).then(() => fileKey);
    });

    return Promise.all(uploadPromises);
}

/**
 * Delete multiple files from R2 in batch
 */
export async function deleteBatch(fileKeys: string[]): Promise<void> {
    if (fileKeys.length === 0) return;

    const command = new DeleteObjectsCommand({
        Bucket: R2_BUCKET_NAME,
        Delete: {
            Objects: fileKeys.map((Key) => ({ Key })),
        },
    });

    await r2Client.send(command);
}

/**
 * Get file stream from R2 (for large files)
 */
export async function getFileStream(fileKey: string): Promise<ReadableStream | null> {
    const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
    });

    const response = await r2Client.send(command);
    return response.Body as ReadableStream | null;
}

/**
 * Copy file within R2
 */
export async function copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    const { CopyObjectCommand } = await import('@aws-sdk/client-s3');

    const command = new CopyObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: destinationKey,
        CopySource: `${R2_BUCKET_NAME}/${sourceKey}`,
    });

    await r2Client.send(command);
}

/**
 * List files in R2 bucket with prefix
 */
export async function listFiles(prefix: string, maxKeys: number = 1000): Promise<string[]> {
    const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');

    const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys,
    });

    const response = await r2Client.send(command);
    return response.Contents?.map((obj) => obj.Key || '') || [];
}
