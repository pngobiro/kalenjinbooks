import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// For development with local SQLite
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Create Prisma client for Cloudflare D1 (use in Workers/Edge runtime)
 * @param d1Database - Cloudflare D1 database instance
 */
export function createPrismaClientForD1(d1Database: any) {
    const adapter = new PrismaD1(d1Database);
    return new PrismaClient({ adapter });
}

export default prisma;
