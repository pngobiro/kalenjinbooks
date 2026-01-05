'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { KaleeReadsFullLogo } from '@/components/KaleeReadsLogo';
import AfricanBorder from '@/components/AfricanBorder';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, googleLogin } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = await login(email, password);
            if (user && user.role === 'ADMIN') {
                window.location.href = '/dashboard/admin';
                return;
            }
            router.push('/dashboard/author');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (response: any) => {
        try {
            setIsLoading(true);
            const user = await googleLogin(response.credential);
            if (user && user.role === 'ADMIN') {
                window.location.href = '/dashboard/admin';
                return;
            }
            router.push('/dashboard/author');
        } catch (err) {
            setError('Google login failed. Please try again.');
            setIsLoading(false);
        }
    };

    // Note: Google One Tap/Button initialization would normally happen here or in a component
    // But since it's already in the RootLayout/Script, we can use the global 'google' object if available

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
                                <p className="text-neutral-brown-600">Enter your details to access your account</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-cream/50 border border-neutral-brown-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-neutral-brown-900">Password</label>
                                        <Link href="/forgot-password" className="text-sm md:text-xs text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={20} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-cream/50 border border-neutral-brown-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-8 mb-8 relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-brown-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-neutral-brown-500 uppercase tracking-wider font-semibold text-xs text-nowrap">Or continue with</span>
                                </div>
                            </div>

                            <div className="flex justify-center flex-col items-center gap-4">
                                <GoogleSignInButton
                                    onSuccess={handleGoogleSuccess}
                                    onError={(error) => setError('Google Sign-In failed. Please try again.')}
                                    disabled={isLoading}
                                />
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
