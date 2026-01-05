/// <reference types="@cloudflare/workers-types" />

import { Env, WorkerRequest } from '../types/env';
import { generateToken, createSession, deleteSession, authMiddleware } from '../middleware/auth';
import { errorResponse, successResponse, HttpStatus, ErrorCode } from '../utils/response';
import { createD1PrismaClient } from '../../lib/db/d1-client';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

/**
 * Handle authentication requests
 */
export async function handleAuthRequest(
    request: WorkerRequest,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // POST /api/register - User registration
    if (path === '/api/register' && method === 'POST') {
        return await register(request, env);
    }

    // POST /api/login - User login
    if (path === '/api/login' && method === 'POST') {
        return await login(request, env);
    }

    // POST /api/auth/logout - User logout
    if (path === '/api/auth/logout' && method === 'POST') {
        return await authMiddleware(request, env, async () => {
            return await logout(request, env);
        });
    }

    // POST /api/auth/google - Google OAuth login
    if (path === '/api/auth/google' && method === 'POST') {
        return await googleLogin(request, env);
    }

    return errorResponse('Not Found', HttpStatus.NOT_FOUND);
}

/**
 * Register a new user
 */
async function register(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { email, password, name, role } = body;

        // Validate required fields
        if (!email || !password) {
            return errorResponse('Email and password are required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse('Invalid email format', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate password strength
        if (password.length < 8) {
            return errorResponse('Password must be at least 8 characters', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return errorResponse('User already exists', HttpStatus.CONFLICT, ErrorCode.RESOURCE_ALREADY_EXISTS);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'READER',
            },
        });

        // If author role, create author profile
        if (user.role === 'AUTHOR') {
            await prisma.author.create({
                data: {
                    userId: user.id,
                },
            });
        }

        // Generate session
        const sessionId = randomBytes(32).toString('hex');
        await createSession(env, sessionId, user.id);

        // Generate token
        const token = await generateToken(
            { id: user.id, email: user.email, role: user.role },
            env,
            sessionId
        );

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isAdmin: user.isAdmin,
                authorStatus: user.role === 'AUTHOR' ? 'PENDING' : undefined
            },
            token,
        }, HttpStatus.CREATED);
    } catch (error) {
        console.error('Register error:', error);
        return errorResponse('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Login user
 */
async function login(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return errorResponse('Email and password are required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        const prisma = createD1PrismaClient(env.DB);

        // Find user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return errorResponse('Invalid credentials', HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_REQUIRED);
        }

        // Verify password
        if (!user.password) {
            return errorResponse('Please login with Google', HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_REQUIRED);
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return errorResponse('Invalid credentials', HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_REQUIRED);
        }

        // Auto-promote Super Admin
        if (user.email === 'pngobiro@gmail.com' && user.role !== 'ADMIN') {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            });
        }

        // Generate session
        const sessionId = randomBytes(32).toString('hex');
        await createSession(env, sessionId, user.id);

        // Generate token
        const token = await generateToken(
            { id: user.id, email: user.email, role: user.role },
            env,
            sessionId
        );

        let authorStatus;
        if (user.role === 'AUTHOR') {
            const author = await prisma.author.findUnique({ where: { userId: user.id } });
            authorStatus = author?.status;
        }

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isAdmin: user.isAdmin,
                authorStatus
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Failed to login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


/**
 * Logout user
 */
async function logout(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const sessionId = request.ctx?.sessionId;

        if (sessionId) {
            await deleteSession(env, sessionId);
        }

        return successResponse({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return errorResponse('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Handle Google Login
 */
async function googleLogin(request: WorkerRequest, env: Env): Promise<Response> {
    try {
        const body = await request.json() as any;
        const { token } = body; // Google ID Token from frontend

        if (!token) {
            return errorResponse('Token is required', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
        }

        // Validate token with Google
        // We use the tokeninfo endpoint to validate and get user info
        const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);

        if (!googleResponse.ok) {
            return errorResponse('Invalid Google token', HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_REQUIRED);
        }

        const googleUser = await googleResponse.json() as {
            sub: string;
            email: string;
            name: string;
            picture: string;
            aud: string;
        };

        // Verify audience (CLIENT_ID) 
        // Note: env.GOOGLE_CLIENT_ID should be set in secrets
        if (env.GOOGLE_CLIENT_ID && googleUser.aud !== env.GOOGLE_CLIENT_ID) {
            console.warn('Google token audience mismatch', googleUser.aud, env.GOOGLE_CLIENT_ID);
            // In strict mode, we would reject here
        }

        const prisma = createD1PrismaClient(env.DB);

        // Find or create user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId: googleUser.sub },
                    { email: googleUser.email }
                ]
            }
        });

        if (user) {
            // Update existing user with Google ID if missing
            if (!user.googleId) {
                const updateData: any = {
                    googleId: googleUser.sub,
                    image: googleUser.picture
                };
                if (user.email === 'pngobiro@gmail.com') {
                    updateData.role = 'ADMIN';
                }
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: updateData
                });
            } else if (user.email === 'pngobiro@gmail.com' && user.role !== 'ADMIN') {
                // Ensure super admin always has admin role
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'ADMIN' }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    googleId: googleUser.sub,
                    image: googleUser.picture,
                    role: googleUser.email === 'pngobiro@gmail.com' ? 'ADMIN' : 'READER', // Default role
                }
            });
        }

        // Generate session
        const sessionId = randomBytes(32).toString('hex');
        await createSession(env, sessionId, user.id);

        // Generate token
        const jwtToken = await generateToken(
            { id: user.id, email: user.email, role: user.role },
            env,
            sessionId
        );

        let authorStatus;
        if (user.role === 'AUTHOR') {
            const author = await prisma.author.findUnique({ where: { userId: user.id } });
            authorStatus = author?.status;
        }

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isAdmin: user.isAdmin,
                image: user.image,
                authorStatus
            },
            token: jwtToken,
        });

    } catch (error) {
        console.error('Google login error:', error);
        return errorResponse('Failed to authenticate with Google', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

