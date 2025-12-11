'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Book, Download, Clock, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  
  const bookId = searchParams.get('bookId');
  const type = searchParams.get('type');
  const method = searchParams.get('method');

  return (
    <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={48} className="text-accent-green" />
        </div>

        <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">
          Payment Successful!
        </h1>
        <p className="text-neutral-brown-600 mb-8">
          Thank you for your purchase. Your book is now available.
        </p>

        {/* Purchase Details */}
        <div className="bg-neutral-cream rounded-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-neutral-brown-900 mb-4">Purchase Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-brown-600">Access Type</span>
              <span className="font-medium text-neutral-brown-900 flex items-center gap-1">
                {type === 'permanent' ? (
                  <>
                    <Download size={16} className="text-primary" />
                    Permanent
                  </>
                ) : (
                  <>
                    <Clock size={16} className="text-accent-gold" />
                    24-Hour Access
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-brown-600">Payment Method</span>
              <span className="font-medium text-neutral-brown-900 capitalize">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-brown-600">Transaction ID</span>
              <span className="font-medium text-neutral-brown-900 font-mono text-sm">
                TXN{Date.now().toString().slice(-8)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/books/${bookId}/read`}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
          >
            <Book size={20} />
            Start Reading
          </Link>
          
          <Link
            href="/books"
            className="w-full bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-medium py-4 rounded-full transition-all flex items-center justify-center gap-2"
          >
            Browse More Books
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Receipt Note */}
        <p className="mt-6 text-sm text-neutral-brown-500">
          A receipt has been sent to your email address.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
