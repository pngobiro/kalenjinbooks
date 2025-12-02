import { randomBytes } from 'crypto';
import prisma from './prisma';

const TIME_LIMITED_ACCESS_HOURS = parseInt(process.env.TIME_LIMITED_ACCESS_HOURS || '168'); // Default: 7 days

export interface CreateAccessLinkParams {
    userId: string;
    bookId: string;
    expiresInHours?: number;
}

/**
 * Generate a unique access token
 */
function generateToken(): string {
    return randomBytes(32).toString('hex');
}

/**
 * Create a time-limited access link for a book
 */
export async function createAccessLink({
    userId,
    bookId,
    expiresInHours = TIME_LIMITED_ACCESS_HOURS,
}: CreateAccessLinkParams) {
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const accessLink = await prisma.timeAccessLink.create({
        data: {
            token,
            userId,
            bookId,
            expiresAt,
        },
        include: {
            book: true,
            user: true,
        },
    });

    return accessLink;
}

/**
 * Validate an access token
 */
export async function validateAccessToken(token: string) {
    const accessLink = await prisma.timeAccessLink.findUnique({
        where: { token },
        include: {
            book: true,
            user: true,
        },
    });

    if (!accessLink) {
        return { valid: false, reason: 'Token not found' };
    }

    if (accessLink.isRevoked) {
        return { valid: false, reason: 'Token has been revoked' };
    }

    if (new Date() > accessLink.expiresAt) {
        return { valid: false, reason: 'Token has expired' };
    }

    return { valid: true, accessLink };
}

/**
 * Revoke an access token
 */
export async function revokeAccessToken(token: string) {
    await prisma.timeAccessLink.update({
        where: { token },
        data: { isRevoked: true },
    });
}

/**
 * Get remaining time for an access link
 */
export function getRemainingTime(expiresAt: Date): {
    expired: boolean;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) {
        return { expired: true, hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { expired: false, hours, minutes, seconds };
}

/**
 * Clean up expired access links (run periodically)
 */
export async function cleanupExpiredLinks() {
    const result = await prisma.timeAccessLink.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(),
            },
        },
    });

    return result.count;
}
