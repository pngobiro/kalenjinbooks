'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import KaleeReadsLogo from '@/components/KaleeReadsLogo';
import { ArrowLeft, Smartphone, Check, Clock, BookOpen, Book, AlertCircle } from 'lucide-react';
import { useState, Suspense } from 'react';
import Image from 'next/image';

function MpesaPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookId = searchParams.get('bookId');
  const type = searchParams.get('type') as 'permanent' | 'temporary';
  const price = searchParams.get('price');
  const title = searchParams.get('title') || 'Book';

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Kenyan phone number
    if (digits.startsWith('254')) {
      return digits.slice(0, 12);
    } else if (digits.startsWith('0')) {
      return digits.slice(0, 10);
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      return digits.slice(0, 9);
    }
    return digits.slice(0, 12);
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    
    // Valid formats: 0712345678, 254712345678, 712345678
    if (digits.startsWith('254') && digits.length === 12) return true;
    if (digits.startsWith('0') && digits.length === 10) return true;
    if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) return true;
    
    return false;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    setIsProcessing(true);
    
    // Simulate STK push request
    setTimeout(() => {
      setIsProcessing(false);
      // In production, this would trigger actual M-Pesa STK push
      router.push(`/payment/mpesa/confirm?bookId=${bookId}&type=${type}&price=${price}&title=${encodeURIComponent(title)}&phone=${phoneNumber}`);
    }, 2000);
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

            <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg p-3">
            <Image 
              src="/images/mpesa-logo.png" 
              alt="M-Pesa" 
              width={80} 
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">M-Pesa Payment</h1>
          <p className="text-neutral-brown-600">Enter your M-Pesa number to receive payment prompt</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-brown-100">
            <div>
              <div className="font-semibold text-neutral-brown-900">{title}</div>
              <div className="flex items-center gap-2 mt-1">
                {type === 'permanent' ? (
                  <>
                    <BookOpen size={14} className="text-primary" />
                    <span className="text-xs text-neutral-brown-500">Permanent Purchase</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-accent-green" />
                    <span className="text-xs text-neutral-brown-500">24-Hour Access</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">KES {price}</div>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <label className="block mb-2">
            <span className="font-semibold text-neutral-brown-900">M-Pesa Phone Number</span>
            <span className="text-neutral-brown-500 text-sm ml-2">(Safaricom)</span>
          </label>
          
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🇰🇪</span>
              <span className="text-neutral-brown-400 font-medium">+254</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="712 345 678"
              className={`w-full pl-24 pr-4 py-4 rounded-xl border-2 text-lg font-medium transition-colors focus:outline-none ${
                error 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'border-neutral-brown-200 focus:border-green-500 bg-neutral-brown-50'
              }`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <p className="text-xs text-neutral-brown-500 mt-3">
            You will receive an STK push on this number. Enter your M-Pesa PIN to complete payment.
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!phoneNumber || isProcessing}
          className={`w-full font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-white mb-6 ${
            phoneNumber && !isProcessing
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-neutral-brown-300 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending STK Push...
            </>
          ) : (
            <>
              <Smartphone size={20} />
              Pay KES {price} with M-Pesa
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
            <Check size={18} />
            <span className="font-semibold text-sm">Secure M-Pesa Payment</span>
          </div>
          <p className="text-xs text-neutral-brown-600">
            Powered by Safaricom M-Pesa. Your transaction is secure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MpesaPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-brown-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <MpesaPaymentContent />
    </Suspense>
  );
}
