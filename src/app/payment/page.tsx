'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Smartphone, Building2, Check, Clock, BookOpen } from 'lucide-react';
import { useState } from 'react';

// Mock payment methods for different authors
const authorPaymentMethods = {
  'Sarah Chebet': ['mpesa', 'stripe', 'paypal'],
  'John Kamau': ['mpesa', 'stripe'],
  'Jane Kiplagat': ['mpesa', 'stripe', 'paypal', 'bank'],
  // Default for other authors
  default: ['mpesa', 'stripe'],
};

const paymentMethodsInfo = {
  mpesa: {
    name: 'M-Pesa',
    icon: Smartphone,
    description: 'Pay with your mobile money',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-700',
  },
  stripe: {
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, Amex',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
  },
  paypal: {
    name: 'PayPal',
    icon: CreditCard,
    description: 'Pay with PayPal account',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-600',
  },
  bank: {
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct bank transfer',
    color: 'from-neutral-brown-700 to-neutral-brown-900',
    bgColor: 'bg-neutral-brown-50',
    borderColor: 'border-neutral-brown-500',
    textColor: 'text-neutral-brown-700',
  },
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

  // Get available payment methods for this author
  const availableMethods = authorPaymentMethods[author as keyof typeof authorPaymentMethods] || authorPaymentMethods.default;

  const handleProceed = () => {
    if (!selectedMethod) return;
    
    // Redirect to specific payment processor
    router.push(`/payment/${selectedMethod}?bookId=${bookId}&type=${type}&price=${price}&title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm w-full sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">AfriReads</span>
            </Link>

            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading mb-4">
            Choose Payment Method
          </h1>
          <p className="text-lg text-neutral-brown-700">
            Select how you'd like to pay for your book
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-brown-500/10 mb-8">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-6 font-heading">Order Summary</h2>
          
          <div className="space-y-4 mb-6 pb-6 border-b border-neutral-brown-500/10">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-neutral-brown-900 text-lg">{title}</div>
                <div className="text-sm text-neutral-brown-600 mt-1">by {author}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">KES {price}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {type === 'permanent' ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-neutral-brown-700">Permanent Purchase - Own Forever</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center">
                    <Clock size={16} className="text-accent-green" />
                  </div>
                  <span className="text-sm font-medium text-neutral-brown-700">24-Hour Access - Read Online</span>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold text-neutral-brown-900">Total Amount</span>
            <span className="text-3xl font-bold text-primary">KES {price}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-brown-500/10 mb-8">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-6 font-heading">
            Available Payment Methods
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {availableMethods.map((methodKey) => {
              const method = paymentMethodsInfo[methodKey as keyof typeof paymentMethodsInfo];
              const Icon = method.icon;
              const isSelected = selectedMethod === methodKey;

              return (
                <div
                  key={methodKey}
                  onClick={() => setSelectedMethod(methodKey)}
                  className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative ${
                    isSelected
                      ? `${method.borderColor} ${method.bgColor} shadow-lg scale-[1.02] ring-2 ring-offset-2 ${method.borderColor.replace('border-', 'ring-')}`
                      : 'border-neutral-brown-200 hover:border-neutral-brown-400 hover:shadow-md bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className={`absolute top-4 right-4 w-7 h-7 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      isSelected ? `bg-gradient-to-br ${method.color}` : 'bg-neutral-brown-100'
                    }`}>
                      <Icon size={28} className={isSelected ? 'text-white' : 'text-neutral-brown-400'} />
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-bold text-lg mb-1 ${isSelected ? method.textColor : 'text-neutral-brown-900'}`}>
                        {method.name}
                      </div>
                      <div className="text-sm text-neutral-brown-600">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!selectedMethod}
            className={`w-full font-bold px-8 py-5 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 text-white text-lg ${
              selectedMethod
                ? 'bg-primary hover:bg-primary-dark hover:shadow-xl hover:-translate-y-1'
                : 'bg-neutral-brown-300 cursor-not-allowed'
            }`}
          >
            {selectedMethod ? (
              <>
                Proceed to {paymentMethodsInfo[selectedMethod as keyof typeof paymentMethodsInfo].name}
                <ArrowLeft size={22} className="rotate-180" />
              </>
            ) : (
              'Select a payment method to continue'
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-accent-green mb-2">
            <Check size={20} />
            <span className="font-semibold">Secure Payment</span>
          </div>
          <p className="text-sm text-neutral-brown-700">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
}
