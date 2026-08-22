import { Env, WorkerRequest } from '../types/env';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import { authMiddleware, requireRole, optionalAuthMiddleware } from '../middleware/auth';
import { errorResponse, successResponse, HttpStatus } from '../utils/response';
import { CachePrefix, generateCacheKey } from '../utils/cache';

/**
 * Handle platform settings API requests
 * GET  /api/settings       - public read (feature flags, contact info)
 * PUT  /api/admin/settings - admin only (full merge update)
 */

const SETTINGS_KEY = 'platform';

export const DEFAULT_SETTINGS = {
  siteName: 'KaleeReads',
  tagline: 'Preserving Kalenjin heritage through stories',
  contactEmail: 'pngobiro@gmail.com',
  currency: 'KES',
  defaultPaymentMethods: ['mpesa', 'stripe', 'paypal'],
  freeReadingEnabled: true,
  donationsEnabled: true,
  hardCopyRequestsEnabled: true,
  newRegistrationsEnabled: true,
  footerFacebook: '',
  footerTwitter: '',
  footerInstagram: '',
};

export async function handleSettingsRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Public read — strip admin-only fields if desired later; currently all safe to expose
    if (path === '/api/settings' && method === 'GET') {
        return await optionalAuthMiddleware(request, env, async () => {
            return await getSettings(env);
        });
    }

    // Admin update (admin-gated; same path keeps it out of the /api/admin dispatcher)
    if (path === '/api/settings' && method === 'PUT') {
        return await authMiddleware(request, env, async () => {
            return await requireRole('ADMIN')(request, env, async () => {
                return await updateSettings(request, env);
            });
        });
    }

    return errorResponse(`Not Found. Path: ${path}, Method: ${method}`, HttpStatus.NOT_FOUND);
}

async function getSettings(env: Env): Promise<Response> {
    try {
        const prisma = createD1PrismaClient(env.DB);
        const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });

        let settings = { ...DEFAULT_SETTINGS };
        if (row?.value) {
            try {
                settings = { ...settings, ...JSON.parse(row.value) };
            } catch {
                // corrupted value — fall back to defaults
            }
        }

        return successResponse({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        return successResponse({ settings: DEFAULT_SETTINGS });
    }
}

async function updateSettings(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as Record<string, unknown>;
        const prisma = createD1PrismaClient(env.DB);

        // Merge onto existing
        let current: Record<string, unknown> = { ...DEFAULT_SETTINGS };
        const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });
        if (row?.value) {
            try {
                current = { ...current, ...JSON.parse(row.value) };
            } catch { /* ignore */ }
        }

        // Whitelist known keys with type coercion
        const stringKeys = ['siteName', 'tagline', 'contactEmail', 'currency'];
        const boolKeys = ['freeReadingEnabled', 'donationsEnabled', 'hardCopyRequestsEnabled', 'newRegistrationsEnabled'];
        const socialKeys = ['footerFacebook', 'footerTwitter', 'footerInstagram'];

        for (const k of [...stringKeys, ...socialKeys]) {
            if (k in body) current[k] = String(body[k] ?? '');
        }
        for (const k of boolKeys) {
            if (k in body) current[k] = body[k] === true || body[k] === 'true';
        }
        if ('defaultPaymentMethods' in body) {
            let methods: string[] = [];
            if (Array.isArray(body.defaultPaymentMethods)) {
                methods = body.defaultPaymentMethods.filter((m) => typeof m === 'string');
            } else if (typeof body.defaultPaymentMethods === 'string') {
                try { methods = JSON.parse(body.defaultPaymentMethods); } catch { methods = []; }
                if (!Array.isArray(methods)) {
                    methods = (body.defaultPaymentMethods as string).split(',').map((m) => m.trim()).filter(Boolean);
                }
            }
            const VALID = ['mpesa', 'stripe', 'paypal', 'bank'];
            methods = methods.filter((m) => VALID.includes(m));
            current.defaultPaymentMethods = methods;
        }

        await prisma.setting.upsert({
            where: { key: SETTINGS_KEY },
            create: { key: SETTINGS_KEY, value: JSON.stringify(current) },
            update: { value: JSON.stringify(current), updatedAt: new Date() },
        });

        // Invalidate cached settings + author lists (payment defaults may have changed)
        try {
            const { deleteCached, invalidateCacheByPrefix, CachePrefix } = await import('../utils/cache');
            await deleteCached(env.CACHE, generateCacheKey(CachePrefix.SETTINGS, SETTINGS_KEY));
            await invalidateCacheByPrefix(env.CACHE, CachePrefix.AUTHORS);
        } catch { /* cache invalidation is best-effort */ }

        return successResponse({ settings: current, message: 'Settings saved' });
    } catch (error) {
        console.error('Update settings error:', error);
        return errorResponse('Failed to save settings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
