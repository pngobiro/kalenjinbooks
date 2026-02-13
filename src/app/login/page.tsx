'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight } from 'lucide-react';
import { KaleeReadsFullLogo } from '@/components/KaleeReadsLogo';
import AfricanBorder from '@/components/AfricanBorder';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { googleLogin } = useAuth();
    const router = useRouter();
    
    // Get redirect parameter from URL
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
        <div className="min-h-screen bg-neutral-cream flex flex-col">
            <nav className="p-6">
                <Link href="/">
                    <KaleeReadsFullLogo />
                </Link>
            </nav>

            <div className="flex-1 flex items-center justify-center p-6 pb-20">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-brown-500/10">
                        <AfricanBorder />

                        <div className="p-8 md:p-10">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Welcome Back</h1>
                                <p className="text-neutral-brown-600">Sign in with your Google account to continue</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
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
                                    <p className="text-sm text-neutral-brown-600">Signing you in...</p>
                                )}
                            </div>

                            <div className="mt-8 p-4 bg-neutral-cream/50 rounded-xl">
                                <p className="text-sm text-neutral-brown-600 text-center">
                                    By signing in, you agree to our{' '}
                                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                </p>
                            </div>

                            <p className="mt-8 text-center text-neutral-brown-600">
                                Don't have an account?{' '}
                                <Link href="/dashboard/author/register" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                                    Register as Author <ArrowRight size={16} />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="p-8 text-center text-neutral-brown-500 text-sm">
                <p>© 2024 KaleeReads. All rights reserved.</p>
            </footer>
        </div>
    );
}
