'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight, PenLine, Sparkles, BookOpen, Users, Globe, Star } from 'lucide-react';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { googleLogin } = useAuth();
    const router = useRouter();
    
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const redirectTo = searchParams?.get('redirect') || '/dashboard/author';

    const handleGoogleSuccess = async (response: any) => {
        try {
            setIsLoading(true);
            setError(null);
            const user = await googleLogin(response.credential);
            if (user && user.role === 'ADMIN') {
                window.location.href = '/dashboard/admin';
                return;
            }
            router.push(redirectTo);
        } catch (err) {
            setError('Google login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-sm border-b border-neutral-brown-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="44" height="44">
                                <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" fill="#E07856"></path>
                                <path d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" fill="#D4AF37"></path>
                                <path d="M12 8C12 8 11 9.5 11 11C11 11.8 11.4 12.4 12 12.5C12.6 12.4 13 11.8 13 11C13 9.5 12 8 12 8Z" fill="#C85D3A"></path>
                            </svg>
                            <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link href="/books" className="text-neutral-brown-700 hover:text-primary font-medium">Browse Books</Link>
                            <Link href="/" className="text-neutral-brown-700 hover:text-primary font-medium">Home</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl w-full items-center">
                    {/* Left Side - For Authors */}
                    <div className="hidden lg:block relative">
                        <div className="relative bg-gradient-to-br from-neutral-brown-900 via-neutral-brown-800 to-neutral-brown-900 rounded-3xl p-10 overflow-hidden">
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-56 h-56 bg-accent-green rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                            </div>
                            
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                                    <PenLine size={16} className="text-accent-gold" />
                                    <span className="text-white/90 text-sm font-medium">Author Portal</span>
                                </div>
                                
                                <h2 className="text-4xl font-bold text-white font-heading mb-4">
                                    Share Your Story With The World
                                </h2>
                                <p className="text-neutral-brown-200 text-lg mb-8">
                                    Join our community of talented Kalenjin authors. Publish your books, connect with readers, and grow your writing career.
                                </p>

                                {/* Author Benefits */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 bg-white/10 rounded-2xl p-5">
                                        <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <BookOpen size={24} className="text-accent-green" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold mb-1">Publish Your Books</p>
                                            <p className="text-neutral-brown-300 text-sm">Easy publishing tools to share your stories globally</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4 bg-white/10 rounded-2xl p-5">
                                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Users size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold mb-1">Build Your Audience</p>
                                            <p className="text-neutral-brown-300 text-sm">Connect with readers who appreciate Kalenjin literature</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4 bg-white/10 rounded-2xl p-5">
                                        <div className="w-12 h-12 bg-accent-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Globe size={24} className="text-accent-gold" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold mb-1">Earn From Your Work</p>
                                            <p className="text-neutral-brown-300 text-sm">Keep more royalties and grow your writing career</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        <div className="bg-white rounded-3xl shadow-xl border border-neutral-brown-100 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-primary/10 to-accent-green/10 p-8 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <PenLine size={32} className="text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">
                                    Author Login
                                </h1>
                                <p className="text-neutral-brown-600">
                                    Sign in to access your author dashboard
                                </p>
                            </div>

                            <div className="p-8">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-center flex-col items-center gap-4">
                                    <GoogleSignInButton
                                        onSuccess={handleGoogleSuccess}
                                        onError={(error) => setError('Google Sign-In failed. Please try again.')}
                                        disabled={isLoading}
                                    />
                                    
                                    {isLoading && (
                                        <div className="flex items-center gap-2 text-neutral-brown-600">
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm">Signing you in...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 p-4 bg-neutral-cream rounded-2xl">
                                    <p className="text-sm text-neutral-brown-600 text-center">
                                        By signing in, you agree to our{' '}
                                        <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-brown-100">
                                    <p className="text-neutral-brown-600 text-center mb-4">
                                        Want to write for KaleeReads?
                                    </p>
                                    <Link 
                                        href="/dashboard/author/register" 
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl font-semibold transition-all"
                                    >
                                        Apply to Become an Author <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile - Back Link */}
                        <p className="lg:hidden mt-8 text-center text-neutral-brown-600">
                            <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>

            <footer className="p-8 text-center text-neutral-brown-500 text-sm">
                <p>© 2024 KaleeReads. All rights reserved.</p>
            </footer>
        </div>
    );
}
