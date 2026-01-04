import { ApiResponse } from '@/lib/api/books';

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'READER' | 'AUTHOR' | 'ADMIN';
    image?: string;
    googleId?: string;
    authorStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Deployed worker URL
const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

function getApiBaseUrl() {
    if (process.env.NEXT_PUBLIC_WORKER_URL) {
        return process.env.NEXT_PUBLIC_WORKER_URL;
    }
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // Local development - use local worker
        // if (hostname === 'localhost' || hostname === '127.0.0.1') {
        //    return 'http://127.0.0.1:8787';
        // }
        return WORKER_URL;
    }
    return WORKER_URL;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${getApiBaseUrl()}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = (await response.json().catch(() => ({ error: 'Login failed' }))) as any;
        throw new Error(error.error || 'Login failed');
    }

    const data = (await response.json()) as any;
    return data.data;
}

export async function register(email: string, password: string, name: string, role = 'READER'): Promise<AuthResponse> {
    const response = await fetch(`${getApiBaseUrl()}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
        const error = (await response.json().catch(() => ({ error: 'Registration failed' }))) as any;
        throw new Error(error.error || 'Registration failed');
    }

    const data = (await response.json()) as any;
    return data.data;
}

export async function googleLogin(token: string): Promise<AuthResponse> {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        const error = (await response.json().catch(() => ({ error: 'Google login failed' }))) as any;
        throw new Error(error.error || 'Google login failed');
    }

    const data = (await response.json()) as any;
    return data.data;
}

export async function logout(token: string): Promise<void> {
    await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
}
