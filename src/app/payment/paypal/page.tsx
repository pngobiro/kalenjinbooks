'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Check, Book } from 'lucide-react';
import { useState, Suspense } from 'react';

function PaypalPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookId = searchParams.get('bookId');
  const type = searchParams.get('type');
  const price = searchParams.get('price');
  const title = searchParams.get('title') || 'Book';

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paypalDetails, setPaypalDetails] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // In production, this would:
      // 1. Create a PayPal order via the PayPal REST API on your server
      // 2. Redirect/approve using the PayPal SDK
      // 3. Capture the payment and verify server-side

      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      setPaymentStatus('success');

      setTimeout(() => {
        router.push(`/payment/success?bookId=${bookId}&type=${type}&method=paypal`);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#E8F5E9' }}>
            <Check size={40} style={{ color: '#7A9B76' }} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2">Payment Successful!</h1>
          <p className="text-neutral-brown-600 mb-6">
            Your PayPal payment of KES {price} has been processed successfully.
          </p>
          <p className="text-sm text-neutral-brown-500">Redirecting to your book...</p>
        </div>
      </div>
    );
  }

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

            <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 flex items-center justify-center mb-4">
            {/* Official PayPal wordmark */}
            <svg width="140" height="38" viewBox="0 0 1008 262" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
              <path d="M136.8 58.4H64.6c-5.1 0-9.4 3.7-10.2 8.7L25 250.1c-.6 3.8 2.3 7.2 6.1 7.2h34.5c5.1 0 9.4-3.7 10.2-8.7l7.9-50c.8-5 5.1-8.7 10.2-8.7h23.1c48 0 75.7-23.2 82.9-69.3 3.3-20.1.1-35.9-9.2-47-10.2-12.1-28.3-18.5-52.3-18.5h-.6zm8.3 68.3c-4 26.2-24 26.2-43.3 26.2H90.6l7.7-48.7c.5-3 3-5.2 6.1-5.2h4.7c13.2 0 25.6 0 32 7.5 3.8 4.5 5 11.1 4 20.2z" fill="#253B80"/>
              <path d="M308.7 125.9c-3.3-19.5-20.5-19.5-37-19.5h-9.4c-3.1 0-5.7 2.2-6.1 5.3l-14.9 94.4c-.4 2.4 1.5 4.5 3.9 4.5h16.3c2.6 0 4.8-1.9 5.2-4.4l3.6-23.1c.4-2.5 2.6-4.4 5.2-4.4h12c25 0 39.4-12.1 43.2-36.1 1.7-10.4.1-18.6-4.9-24.3-5.4-6.4-15-9.6-27.7-9.6l.4 17.2zm-18.1 35.9h-9.8c-1.6 0-2.9 1.1-3.2 2.6l-2.9 18.5c-.2 1.5.9 2.8 2.4 2.8h8.9c8.2 0 16.2-1.2 20.2-7.7 2.4-4 3-9.3 2.1-15.5-1.4-9.9-9.7-10.7-17.7-10.7zM394.9 161.4c-3.3-19.5-20.5-19.5-37-19.5h-9.4c-3.1 0-5.7 2.2-6.1 5.3l-14.9 94.4c-.4 2.4 1.5 4.5 3.9 4.5h16.3c2.6 0 4.8-1.9 5.2-4.4l3.6-23.1c.4-2.5 2.6-4.4 5.2-4.4h12c25 0 39.4-12.1 43.2-36.1 1.7-10.4.1-18.6-4.9-24.3-5.4-6.4-15-9.6-27.7-9.6l-.4 17.2zm-18.1 35.9H367c-1.6 0-2.9 1.1-3.2 2.6l-2.9 18.5c-.2 1.5.9 2.8 2.4 2.8h8.9c8.2 0 16.2-1.2 20.2-7.7 2.4-4 3-9.3 2.1-15.5-1.4-9.9-9.7-10.7-17.7-10.7zM497.7 196.7c-3.3-19.5-20.5-19.5-37-19.5h-9.4c-3.1 0-5.7 2.2-6.1 5.3l-14.9 94.4c-.4 2.4 1.5 4.5 3.9 4.5h16.3c2.6 0 4.8-1.9 5.2-4.4l3.6-23.1c.4-2.5 2.6-4.4 5.2-4.4h12c25 0 39.4-12.1 43.2-36.1 1.7-10.4.1-18.6-4.9-24.3-5.4-6.4-15-9.6-27.7-9.6l-.4 17.2zm-18.1 35.9h-9.8c-1.6 0-2.9 1.1-3.2 2.6l-2.9 18.5c-.2 1.5.9 2.8 2.4 2.8h8.9c8.2 0 16.2-1.2 20.2-7.7 2.4-4 3-9.3 2.1-15.5-1.4-9.9-9.7-10.7-17.7-10.7z" fill="#179BD7"/>
              <path d="M604.5 224.6l-19.9-56.3c-2.3-6.5-8.4-10.8-15.3-10.8h-79.7c-4 0-7.4 2.9-8 6.9l-21.9 138.9c-.6 3.8 2.3 7.2 6.1 7.2h33.9c5.1 0 9.4-3.7 10.2-8.7l4.5-28.4c.8-5 5.1-8.7 10.2-8.7h23.1c48 0 75.7-23.2 82.9-69.3.3-1.9.6-3.8.8-5.7-9.4 5-19.9 8.2-31.2 9.4-3.6 12.4-8.9 20.5-16.6 25.4v.1zm-52.9-30.9c4-26.2 24-26.2 43.3-26.2h11.2l-7.7 48.7c-.5 3-3 5.2-6.1 5.2h-4.7c-13.2 0-25.6 0-32-7.5-3.8-4.5-5-11.1-4-20.2z" fill="#222D65"/>
              <path d="M872.4 58.4h-72.2c-5.1 0-9.4 3.7-10.2 8.7l-29.4 186.1c-.6 3.8 2.3 7.2 6.1 7.2h37c3.5 0 6.6-2.6 7.1-6.1l8.3-52.5c.8-5 5.1-8.7 10.2-8.7h23.1c48 0 75.7-23.2 82.9-69.3 3.3-20.1.1-35.9-9.2-47-10.2-12.1-28.3-18.5-52.3-18.5l-1.4.1zm8.3 68.3c-4 26.2-24 26.2-43.3 26.2h-11.2l7.7-48.7c.5-3 3-5.2 6.1-5.2h4.7c13.2 0 25.6 0 32 7.5 3.8 4.5 5 11.1 4 20.2z" fill="#253B80"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Pay with PayPal</h1>
          <p className="text-neutral-brown-600">Log in to complete your payment securely</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-neutral-brown-900">{title}</div>
              <div className="text-sm text-neutral-brown-500">
                {type === 'donation' ? 'Donation' : type === 'permanent' ? 'Permanent Purchase' : 'Access'}
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">KES {price}</div>
          </div>
        </div>

        {/* PayPal Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                Email or mobile number
              </label>
              <input
                type="email"
                value={paypalDetails.email}
                onChange={(e) => setPaypalDetails({ ...paypalDetails, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={paypalDetails.password}
                onChange={(e) => setPaypalDetails({ ...paypalDetails, password: e.target.value })}
                placeholder="Enter your PayPal password"
                required
                minLength={4}
                className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Message */}
          {paymentStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              Payment failed. Please check your PayPal credentials and try again.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-6 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0070BA' }}
            onMouseEnter={(e) => { if (!isProcessing) (e.target as HTMLButtonElement).style.backgroundColor = '#003087'; }}
            onMouseLeave={(e) => { if (!isProcessing) (e.target as HTMLButtonElement).style.backgroundColor = '#0070BA'; }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={18} />
                Log In and Pay KES {price}
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-neutral-brown-500 text-sm">
            <Lock size={14} />
            <span>Payments are secured with PayPal encryption</span>
          </div>

          {/* Sandbox Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm">
            <p className="font-medium text-blue-900 mb-2">Sandbox Mode:</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Any valid email format is accepted</li>
              <li>• Any password with 4+ characters</li>
              <li>• Real PayPal integration requires API keys</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PaypalPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-brown-600">Loading PayPal checkout...</p>
        </div>
      </div>
    }>
      <PaypalPaymentContent />
    </Suspense>
  );
}
