/// <reference types="@cloudflare/workers-types" />

import { Env } from '../types/env';

/**
 * Cache key generator
 */
export function generateCacheKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`;
}

/**
 * Get cached data from KV
 */
export async function getCached<T>(
    kv: KVNamespace,
    key: string
): Promise<T | null> {
    try {
        const cached = await kv.get(key, 'json');
        return cached as T | null;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
}

/**
 * Set cached data in KV
 */
export async function setCached<T>(
    kv: KVNamespace,
    key: string,
    value: T,
    ttl: number = 3600 // 1 hour default
): Promise<void> {
    try {
        await kv.put(key, JSON.stringify(value), {
            expirationTtl: ttl,
        });
    } catch (error) {
        console.error('Cache set error:', error);
    }
}

/**
 * Delete cached data from KV
 */
export async function deleteCached(
    kv: KVNamespace,
    key: string
): Promise<void> {
    try {
        await kv.delete(key);
    } catch (error) {
        console.error('Cache delete error:', error);
    }
}

/**
 * Invalidate cache by prefix
 * Note: KV doesn't support prefix deletion, so we need to track keys
 */
export async function invalidateCacheByPrefix(
    kv: KVNamespace,
    prefix: string
): Promise<void> {
    try {
        const list = await kv.list({ prefix });
        const deletePromises = list.keys.map((key: KVNamespaceListKey<unknown>) => kv.delete(key.name));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Cache invalidation error:', error);
    }
}

/**
 * Cache wrapper for functions
 * Automatically caches function results
 */
export async function withCache<T>(
    kv: KVNamespace,
    key: string,
    ttl: number,
    fn: () => Promise<T>
): Promise<T> {
    // Try to get from cache
    const cached = await getCached<T>(kv, key);
    if (cached !== null) {
        return cached;
    }

    // Execute function
    const result = await fn();

    // Cache result
    await setCached(kv, key, result, ttl);

    return result;
}

/**
 * Common cache TTLs (in seconds)
 */
export const CacheTTL = {
    ONE_MINUTE: 60,
    FIVE_MINUTES: 300,
    TEN_MINUTES: 600,
    THIRTY_MINUTES: 1800,
    ONE_HOUR: 3600,
    SIX_HOURS: 21600,
    ONE_DAY: 86400,
    ONE_WEEK: 604800,
} as const;

/**
 * Cache key prefixes
 */
export const CachePrefix = {
    BOOKS: 'books',
    BOOK_DETAIL: 'book',
    AUTHORS: 'authors',
    AUTHOR_DETAIL: 'author',
    BLOG_POSTS: 'blog_posts',
    BLOG_POST: 'blog_post',
    USER: 'user',
    FEATURED: 'featured',
} as const;
