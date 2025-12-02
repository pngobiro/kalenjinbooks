import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration
const R2_ENDPOINT = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kalenjin-books';

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
