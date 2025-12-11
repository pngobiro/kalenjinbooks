'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Lock, Check, Book } from 'lucide-react';
import { useState, Suspense } from 'react';

function StripePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookId = searchParams.get('bookId');
  const type = searchParams.get('type');
  const price = searchParams.get('price');
  const title = searchParams.get('title') || 'Book';

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // In production, this would:
      // 1. Create a Payment Intent on your server
      // 2. Use Stripe.js to confirm the payment
      // 3. Handle the result
      
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate success (in production, check actual Stripe response)
      setPaymentStatus('success');
      
      // Redirect to success page after delay
      setTimeout(() => {
        router.push(`/payment/success?bookId=${bookId}&type=${type}&method=stripe`);
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
          <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-accent-green" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-brown-900 mb-2">Payment Successful!</h1>
          <p className="text-neutral-brown-600 mb-6">
            Your payment of KES {price} has been processed successfully.
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Card Payment</h1>
          <p className="text-neutral-brown-600">Enter your card details to complete payment</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-neutral-brown-900">{title}</div>
              <div className="text-sm text-neutral-brown-500">
                {type === 'permanent' ? 'Permanent Purchase' : '24-Hour Access'}
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">KES {price}</div>
          </div>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-6" />
                  <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-6" />
                </div>
              </div>
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="123"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {paymentStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              Payment failed. Please check your card details and try again.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={18} />
                Pay KES {price}
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-neutral-brown-500 text-sm">
            <Lock size={14} />
            <span>Secured by Stripe</span>
          </div>

          {/* Test Card Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm">
            <p className="font-medium text-blue-900 mb-2">Test Card Numbers:</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Success: 4242 4242 4242 4242</li>
              <li>• Decline: 4000 0000 0000 0002</li>
              <li>• Any future expiry & any 3-digit CVC</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StripePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-brown-600">Loading payment form...</p>
        </div>
      </div>
    }>
      <StripePaymentContent />
    </Suspense>
  );
}
