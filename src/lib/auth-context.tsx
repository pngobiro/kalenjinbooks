'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin, logout as apiLogout } from './api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (email: string, password: string, name: string, role?: string) => Promise<User>;
    googleLogin: (token: string) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for saved session
        const savedToken = localStorage.getItem('kaleereads_token');
        const savedUser = localStorage.getItem('kaleereads_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { user, token } = await apiLogin(email, password);
            setToken(token);
            setUser(user);
            localStorage.setItem('kaleereads_token', token);
            localStorage.setItem('kaleereads_user', JSON.stringify(user));
            return user;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string, role?: string) => {
        setIsLoading(true);
        try {
            const { user, token } = await apiRegister(email, password, name, role);
            setToken(token);
            setUser(user);
            localStorage.setItem('kaleereads_token', token);
            localStorage.setItem('kaleereads_user', JSON.stringify(user));
            return user;
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async (googleToken: string) => {
        setIsLoading(true);
        try {
            const { user, token } = await apiGoogleLogin(googleToken);
            setToken(token);
            setUser(user);
            localStorage.setItem('kaleereads_token', token);
            localStorage.setItem('kaleereads_user', JSON.stringify(user));
            return user;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        if (token) {
            try {
                await apiLogout(token);
            } catch (e) {
                console.error('Logout failed', e);
            }
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem('kaleereads_token');
        localStorage.removeItem('kaleereads_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
