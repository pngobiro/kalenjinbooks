'use client';

import { useState } from 'react';
import { Book, User, Mail, Phone, FileText, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

type RegistrationStep = 'signin' | 'details' | 'pending';

export default function AuthorRegisterPage() {
  const [step, setStep] = useState<RegistrationStep>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; image: string } | null>(null);
  const [formData, setFormData] = useState({
    bio: '',
    phoneNumber: '',
    paymentMethod: 'mpesa',
    mpesaNumber: '',
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    // In production, this would redirect to Google OAuth
    // For now, simulate the OAuth flow
    try {
      // Simulate Google OAuth response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data (in production, this comes from Google)
      setGoogleUser({
        name: 'New Author',
        email: 'author@gmail.com',
        image: '',
      });
      setStep('details');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/authors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          googleUser,
        }),
      });

      if (response.ok) {
        setStep('pending');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      // For demo, proceed to pending
      setStep('pending');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'signin' ? 'text-primary' : 'text-accent-green'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'signin' ? 'bg-primary text-white' : 'bg-accent-green text-white'}`}>
              {step === 'signin' ? '1' : <CheckCircle size={16} />}
            </div>
            <span className="font-medium">Sign In</span>
          </div>
          <div className="w-12 h-0.5 bg-neutral-brown-200" />
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary' : step === 'pending' ? 'text-accent-green' : 'text-neutral-brown-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-primary text-white' : step === 'pending' ? 'bg-accent-green text-white' : 'bg-neutral-brown-200 text-neutral-brown-500'}`}>
              {step === 'pending' ? <CheckCircle size={16} /> : '2'}
            </div>
            <span className="font-medium">Details</span>
          </div>
          <div className="w-12 h-0.5 bg-neutral-brown-200" />
          <div className={`flex items-center gap-2 ${step === 'pending' ? 'text-primary' : 'text-neutral-brown-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'pending' ? 'bg-primary text-white' : 'bg-neutral-brown-200 text-neutral-brown-500'}`}>
              3
            </div>
            <span className="font-medium">Approval</span>
          </div>
        </div>

        {/* Step 1: Google Sign In */}
        {step === 'signin' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Become an Author</h1>
              <p className="text-neutral-brown-600">
                Join KaleeReads and share your stories with the world
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-neutral-brown-200 hover:border-primary text-neutral-brown-900 font-semibold px-6 py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <p className="text-center text-sm text-neutral-brown-500">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-brown-100">
              <h3 className="font-bold text-neutral-brown-900 mb-4">Why become an author?</h3>
              <ul className="space-y-3 text-sm text-neutral-brown-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent-green mt-0.5" />
                  <span>Reach thousands of readers interested in Kalenjin literature</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent-green mt-0.5" />
                  <span>Keep 70% of your book sales revenue</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent-green mt-0.5" />
                  <span>Easy M-Pesa payouts directly to your phone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent-green mt-0.5" />
                  <span>Full analytics and sales tracking dashboard</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Fill Details */}
        {step === 'details' && googleUser && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {googleUser.image ? (
                  <img src={googleUser.image} alt={googleUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-primary" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-1">Welcome, {googleUser.name}!</h1>
              <p className="text-neutral-brown-600">{googleUser.email}</p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Author Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell readers about yourself, your background, and what inspires your writing..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+254 7XX XXX XXX"
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Payout Method (How you'll receive earnings)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'mpesa' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${formData.paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-neutral-brown-200 hover:border-primary/50'}`}
                  >
                    <img src="/images/mpesa-logo.png" alt="M-Pesa" className="h-8 mx-auto mb-2" />
                    <span className="text-sm font-medium">M-Pesa</span>
                    <span className="block text-xs text-neutral-brown-500">Kenya</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${formData.paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-neutral-brown-200 hover:border-primary/50'}`}
                  >
                    <div className="h-8 flex items-center justify-center mb-2">
                      <span className="text-2xl">💳</span>
                    </div>
                    <span className="text-sm font-medium">Stripe</span>
                    <span className="block text-xs text-neutral-brown-500">International</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${formData.paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-neutral-brown-200 hover:border-primary/50'}`}
                  >
                    <div className="h-8 flex items-center justify-center mb-2">
                      <span className="text-2xl">🏦</span>
                    </div>
                    <span className="text-sm font-medium">Bank</span>
                    <span className="block text-xs text-neutral-brown-500">Wire Transfer</span>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    M-Pesa Number
                  </label>
                  <input
                    type="tel"
                    value={formData.mpesaNumber}
                    onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                    placeholder="07XX XXX XXX"
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}

              {formData.paymentMethod === 'stripe' && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Stripe Connect:</strong> After approval, you'll be guided to set up your Stripe account to receive international payments directly to your bank account or debit card.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'bank' && (
                <div className="bg-neutral-cream rounded-xl p-4">
                  <p className="text-sm text-neutral-brown-600">
                    <strong>Bank Transfer:</strong> After approval, you'll provide your bank details for wire transfers. Minimum payout: $100 USD.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Pending Approval */}
        {step === 'pending' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-accent-gold" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-4">Application Submitted!</h1>
            <p className="text-neutral-brown-600 mb-8 max-w-md mx-auto">
              Thank you for applying to become an author on KaleeReads. Our team will review your application and get back to you within 24-48 hours.
            </p>

            <div className="bg-neutral-cream rounded-xl p-6 mb-8">
              <h3 className="font-bold text-neutral-brown-900 mb-4">What happens next?</h3>
              <ul className="space-y-3 text-sm text-neutral-brown-600 text-left">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">1</span>
                  </div>
                  <span>Our team reviews your application</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">2</span>
                  </div>
                  <span>You'll receive an email notification about your status</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">3</span>
                  </div>
                  <span>Once approved, you can start uploading your books!</span>
                </li>
              </ul>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold"
            >
              Return to Homepage
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
