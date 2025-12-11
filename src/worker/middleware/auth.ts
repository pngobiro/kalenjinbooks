import { Env, WorkerRequest, RequestContext } from '../types/env';
import { errorResponse, HttpStatus, ErrorCode } from '../utils/response';
import * as jose from 'jose';

/**
 * Authentication middleware
 * Verifies JWT tokens and attaches user context to request
 */
export async function authMiddleware(
    request: WorkerRequest,
    env: Env,
    next: () => Promise<Response>
): Promise<Response> {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(
            'Authentication required',
            HttpStatus.UNAUTHORIZED,
            ErrorCode.AUTHENTICATION_REQUIRED
        );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        // Verify JWT token
        const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);

        // Attach user context to request
        request.ctx = {
            user: {
                id: payload.sub as string,
                email: payload.email as string,
                role: payload.role as 'READER' | 'AUTHOR' | 'ADMIN',
            },
            sessionId: payload.jti as string,
        };

        // Check if session is still valid in KV
        const sessionKey = `session:${payload.jti}`;
        const session = await env.SESSION.get(sessionKey);

        if (!session) {
            return errorResponse(
                'Session expired',
                HttpStatus.UNAUTHORIZED,
                ErrorCode.AUTHENTICATION_REQUIRED
            );
        }

        return await next();
    } catch (error) {
        console.error('Auth error:', error);
        return errorResponse(
            'Invalid or expired token',
            HttpStatus.UNAUTHORIZED,
            ErrorCode.AUTHENTICATION_REQUIRED
        );
    }
}

/**
 * Optional authentication middleware
 * Attaches user context if token is present, but doesn't require it
 */
export async function optionalAuthMiddleware(
    request: WorkerRequest,
    env: Env,
    next: () => Promise<Response>
): Promise<Response> {
    const authHeader = request.headers.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);

        try {
            const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);

            request.ctx = {
                user: {
                    id: payload.sub as string,
                    email: payload.email as string,
                    role: payload.role as 'READER' | 'AUTHOR' | 'ADMIN',
                },
                sessionId: payload.jti as string,
            };
        } catch (error) {
            // Ignore invalid tokens for optional auth
            console.warn('Optional auth failed:', error);
        }
    }

    return await next();
}

/**
 * Role-based access control middleware
 */
export function requireRole(...allowedRoles: Array<'READER' | 'AUTHOR' | 'ADMIN'>) {
    return async (
        request: WorkerRequest,
        env: Env,
        next: () => Promise<Response>
    ): Promise<Response> => {
        if (!request.ctx?.user) {
            return errorResponse(
                'Authentication required',
                HttpStatus.UNAUTHORIZED,
                ErrorCode.AUTHENTICATION_REQUIRED
            );
        }

        if (!allowedRoles.includes(request.ctx.user.role)) {
            return errorResponse(
                'Insufficient permissions',
                HttpStatus.FORBIDDEN,
                ErrorCode.INSUFFICIENT_PERMISSIONS
            );
        }

        return await next();
    };
}

/**
 * Generate JWT token for user
 */
export async function generateToken(
    user: { id: string; email: string; role: string },
    env: Env,
    sessionId: string
): Promise<string> {
    const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);

    const token = await new jose.SignJWT({
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(user.id)
        .setJti(sessionId)
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);

    return token;
}

/**
 * Create session in KV
 */
export async function createSession(
    env: Env,
    sessionId: string,
    userId: string,
    ttl: number = 604800 // 7 days
): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    await env.SESSION.put(
        sessionKey,
        JSON.stringify({ userId, createdAt: Date.now() }),
        { expirationTtl: ttl }
    );
}

/**
 * Delete session from KV
 */
export async function deleteSession(env: Env, sessionId: string): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    await env.SESSION.delete(sessionKey);
}
