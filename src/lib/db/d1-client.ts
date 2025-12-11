/// <reference types="@cloudflare/workers-types" />

import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

/**
 * Create a Prisma client configured for Cloudflare D1
 * Use this in Cloudflare Workers environment
 */
export function createD1PrismaClient(d1Database: D1Database): PrismaClient {
    const adapter = new PrismaD1(d1Database);

    return new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    });
}

/**
 * Execute a raw SQL query on D1
 * Useful for complex queries or operations not supported by Prisma
 */
export async function executeD1Query<T = any>(
    d1: D1Database,
    query: string,
    params: any[] = []
): Promise<T[]> {
    const stmt = d1.prepare(query);
    const result = await stmt.bind(...params).all<T>();

    if (!result.success) {
        throw new Error(`D1 query failed: ${result.error}`);
    }

    return result.results || [];
}

/**
 * Execute a batch of SQL statements on D1
 * All statements are executed in a single transaction
 */
export async function executeD1Batch(
    d1: D1Database,
    statements: Array<{ query: string; params?: any[] }>
): Promise<void> {
    const preparedStatements = statements.map(({ query, params = [] }) => {
        return d1.prepare(query).bind(...params);
    });

    const results = await d1.batch(preparedStatements);

    // Check if any statement failed
    const failed = results.find((r: D1Result) => !r.success);
    if (failed) {
        throw new Error(`D1 batch execution failed: ${failed.error}`);
    }
}

/**
 * Check D1 database health
 * Returns true if database is accessible
 */
export async function checkD1Health(d1: D1Database): Promise<boolean> {
    try {
        const result = await d1.prepare('SELECT 1 as health').first();
        return result?.health === 1;
    } catch (error) {
        console.error('D1 health check failed:', error);
        return false;
    }
}

/**
 * Get D1 database statistics
 */
export async function getD1Stats(d1: D1Database): Promise<{
    tables: number;
    totalRows: number;
}> {
    // Get table count
    const tables = await executeD1Query<{ count: number }>(
        d1,
        "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
    );

    // Get total row count across all tables
    const tableNames = await executeD1Query<{ name: string }>(
        d1,
        "SELECT name FROM sqlite_master WHERE type='table'"
    );

    let totalRows = 0;
    for (const { name } of tableNames) {
        const rows = await executeD1Query<{ count: number }>(
            d1,
            `SELECT COUNT(*) as count FROM ${name}`
        );
        totalRows += rows[0]?.count || 0;
    }

    return {
        tables: tables[0]?.count || 0,
        totalRows,
    };
}

/**
 * Transaction helper for D1
 * Wraps operations in a transaction-like pattern using batch
 */
export async function withD1Transaction<T>(
    d1: D1Database,
    callback: (tx: D1Database) => Promise<T>
): Promise<T> {
    try {
        // D1 doesn't support explicit transactions yet
        // This is a placeholder for future transaction support
        return await callback(d1);
    } catch (error) {
        console.error('D1 transaction failed:', error);
        throw error;
    }
}

/**
 * Cleanup expired access links
 * Should be run periodically (e.g., daily cron job)
 */
export async function cleanupExpiredLinks(d1: D1Database): Promise<number> {
    const result = await d1
        .prepare('DELETE FROM TimeAccessLink WHERE expiresAt < datetime("now") AND isRevoked = 0')
        .run();

    return result.meta.changes || 0;
}

/**
 * Optimize D1 database
 * Runs VACUUM and ANALYZE to improve performance
 */
export async function optimizeD1Database(d1: D1Database): Promise<void> {
    await d1.prepare('VACUUM').run();
    await d1.prepare('ANALYZE').run();
}
