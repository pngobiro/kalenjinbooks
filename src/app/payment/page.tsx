'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Building2, Check, Clock, BookOpen, Book, Heart } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';

const authorPaymentMethods: Record<string, string[]> = {
  default: ['mpesa', 'stripe', 'paypal'],
};

const ALL_METHODS = ['mpesa', 'stripe', 'paypal', 'bank'];

const paymentMethodsInfo: Record<string, { name: string; icon: typeof CreditCard | null; logo?: string; description: string; color: string }> = {
  mpesa: { name: 'M-Pesa', icon: null, logo: '/images/mpesa-logo.png', description: 'Pay with mobile money', color: 'green' },
  stripe: { name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex', color: 'blue' },
  paypal: { name: 'PayPal', icon: CreditCard, description: 'Pay with PayPal', color: 'indigo' },
  bank: { name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer', color: 'gray' },
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookId = searchParams.get('bookId');
  const author = searchParams.get('author') || 'Unknown Author';
  const type = searchParams.get('type') as 'permanent' | 'temporary' | 'donation';
  const price = searchParams.get('price');
  const title = searchParams.get('title') || 'Book';

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>(authorPaymentMethods.default);

  // Load the author's configured payment methods via the book's author
  useEffect(() => {
    async function loadAuthorMethods() {
      try {
        if (!bookId) return;
        const bookRes = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books/${bookId}`);
        if (!bookRes.ok) return;
        const bookJson: any = await bookRes.json();
        const authorId = bookJson?.data?.author?.id;
        if (!authorId) return;
        const authorRes = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/${authorId}`);
        if (!authorRes.ok) return;
        const authorJson: any = await authorRes.json();
        const methods: string[] | undefined = authorJson?.data?.paymentMethods;
        if (Array.isArray(methods) && methods.length > 0) {
          // keep a stable, supported order
          setAvailableMethods(ALL_METHODS.filter((m) => methods.includes(m)));
        }
      } catch (e) {
        console.error('Failed to load author payment methods', e);
      }
    }
    loadAuthorMethods();
  }, [bookId]);

  const handleProceed = () => {
    if (!selectedMethod) return;
    router.push(`/payment/${selectedMethod}?bookId=${bookId}&type=${type}&price=${price}&title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Navigation */}
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
            Choose Payment Method
          </h1>
          <p className="text-lg text-gray-600">Select how you'd like to complete your purchase</p>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl p-6 shadow-lg mb-6" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
          <h2 className="font-bold text-xl mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>Order Summary</h2>
          
          <div className="flex justify-between items-start mb-4 pb-4 border-b" style={{ borderColor: '#E5D5C3' }}>
            <div>
              <div className="font-bold text-lg" style={{ color: '#2C2416' }}>{title}</div>
              <div className="text-sm text-gray-600">by {author}</div>
            </div>
            <div className="text-3xl font-bold" style={{ color: '#B4502A' }}>KES {price}</div>
          </div>
          
          <div className="flex items-center gap-3">
            {type === 'donation' ? (
              <>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3E7' }}>
                  <Heart size={20} style={{ color: '#B4502A' }} />
                </div>
                <span className="font-medium" style={{ color: '#2C2416' }}>Donation to support the author</span>
              </>
            ) : type === 'permanent' ? (
              <>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3E7' }}>
                  <BookOpen size={20} style={{ color: '#B4502A' }} />
                </div>
                <span className="font-medium" style={{ color: '#2C2416' }}>Permanent Purchase</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                  <Clock size={20} style={{ color: '#4F6D4C' }} />
                </div>
                <span className="font-medium" style={{ color: '#2C2416' }}>24-Hour Access</span>
              </>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl p-6 shadow-lg mb-6" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
          <h2 className="font-bold text-xl mb-5" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>Payment Methods</h2>
          
          <div className="space-y-3 mb-6">
            {availableMethods.map((methodKey) => {
              const method = paymentMethodsInfo[methodKey];
              const Icon = method.icon;
              const isSelected = selectedMethod === methodKey;
              
              return (
                <div
                  key={methodKey}
                  onClick={() => setSelectedMethod(methodKey)}
                  className="cursor-pointer rounded-xl p-5 border-2 transition-all flex items-center gap-4 hover:shadow-md"
                  style={{
                    borderColor: isSelected ? '#B4502A' : '#E5D5C3',
                    backgroundColor: isSelected ? '#FEF3E7' : '#FFFFFF'
                  }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: isSelected ? '#FFFFFF' : '#F5E6D3' }}>
                    {method.logo ? (
                      <Image src={method.logo} alt={method.name} width={36} height={36} className="object-contain" />
                    ) : Icon ? (
                      <Icon size={28} style={{ color: isSelected ? '#B4502A' : '#9CA3AF' }} />
                    ) : null}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold" style={{ color: '#2C2416' }}>{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B4502A' }}>
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleProceed}
            disabled={!selectedMethod}
            className="w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: selectedMethod ? '#B4502A' : '#D1D5DB' }}
          >
            {selectedMethod ? `Pay with ${paymentMethodsInfo[selectedMethod].name}` : 'Select a payment method'}
          </button>
        </div>

        {/* Security */}
        <div className="rounded-xl p-5 text-center" style={{ backgroundColor: '#E8F5E9', border: '1px solid #4F6D4C' }}>
          <div className="flex items-center justify-center gap-2 mb-2" style={{ color: '#4F6D4C' }}>
            <Check size={20} />
            <span className="font-bold">Secure Payment</span>
          </div>
          <p className="text-sm text-gray-700">Your payment is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#F5E6D3' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#B4502A' }}></div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
