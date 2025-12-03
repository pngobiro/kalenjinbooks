'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Smartphone, Building2, Check, Clock, BookOpen, Book } from 'lucide-react';
import { useState } from 'react';

const authorPaymentMethods: Record<string, string[]> = {
  'Sarah Chebet': ['mpesa', 'stripe', 'paypal'],
  'John Kamau': ['mpesa', 'stripe'],
  'Jane Kiplagat': ['mpesa', 'stripe', 'paypal', 'bank'],
  default: ['mpesa', 'stripe'],
};

const paymentMethodsInfo: Record<string, { name: string; icon: typeof Smartphone; description: string; color: string }> = {
  mpesa: { name: 'M-Pesa', icon: Smartphone, description: 'Pay with mobile money', color: 'green' },
  stripe: { name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex', color: 'blue' },
  paypal: { name: 'PayPal', icon: CreditCard, description: 'Pay with PayPal', color: 'indigo' },
  bank: { name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer', color: 'gray' },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookId = searchParams.get('bookId');
  const author = searchParams.get('author') || 'Unknown Author';
  const type = searchParams.get('type') as 'permanent' | 'temporary';
  const price = searchParams.get('price');
  const title = searchParams.get('title') || 'Book';

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const availableMethods = authorPaymentMethods[author] || authorPaymentMethods.default;

  const handleProceed = () => {
    if (!selectedMethod) return;
    router.push(`/payment/${selectedMethod}?bookId=${bookId}&type=${type}&price=${price}&title=${encodeURIComponent(title)}`);
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
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
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

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-2">Choose Payment</h1>
          <p className="text-neutral-brown-600">Select how you'd like to pay</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="font-bold text-neutral-brown-900 mb-4">Order Summary</h2>
          
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-brown-100">
            <div>
              <div className="font-semibold text-neutral-brown-900">{title}</div>
              <div className="text-sm text-neutral-brown-500">by {author}</div>
            </div>
            <div className="text-2xl font-bold text-primary">KES {price}</div>
          </div>
          
          <div className="flex items-center gap-2">
            {type === 'permanent' ? (
              <>
                <BookOpen size={18} className="text-primary" />
                <span className="text-sm text-neutral-brown-600">Permanent Purchase</span>
              </>
            ) : (
              <>
                <Clock size={18} className="text-accent-green" />
                <span className="text-sm text-neutral-brown-600">24-Hour Access</span>
              </>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="font-bold text-neutral-brown-900 mb-4">Payment Methods</h2>
          
          <div className="space-y-3 mb-6">
            {availableMethods.map((methodKey) => {
              const method = paymentMethodsInfo[methodKey];
              const Icon = method.icon;
              const isSelected = selectedMethod === methodKey;
              
              const colorClasses: Record<string, string> = {
                green: isSelected ? 'border-green-500 bg-green-50' : '',
                blue: isSelected ? 'border-blue-500 bg-blue-50' : '',
                indigo: isSelected ? 'border-indigo-500 bg-indigo-50' : '',
                gray: isSelected ? 'border-gray-500 bg-gray-50' : '',
              };

              return (
                <div
                  key={methodKey}
                  onClick={() => setSelectedMethod(methodKey)}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex items-center gap-4 ${
                    isSelected ? colorClasses[method.color] : 'border-neutral-brown-200 hover:border-neutral-brown-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-white' : 'bg-neutral-brown-100'
                  }`}>
                    <Icon size={24} className={isSelected ? 'text-primary' : 'text-neutral-brown-400'} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-brown-900">{method.name}</div>
                    <div className="text-sm text-neutral-brown-500">{method.description}</div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleProceed}
            disabled={!selectedMethod}
            className={`w-full font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-white ${
              selectedMethod ? 'bg-primary hover:bg-primary-dark' : 'bg-neutral-brown-300 cursor-not-allowed'
            }`}
          >
            {selectedMethod ? `Pay with ${paymentMethodsInfo[selectedMethod].name}` : 'Select a payment method'}
          </button>
        </div>

        {/* Security */}
        <div className="bg-accent-green/10 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-accent-green mb-1">
            <Check size={18} />
            <span className="font-semibold text-sm">Secure Payment</span>
          </div>
          <p className="text-xs text-neutral-brown-600">Your payment is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
