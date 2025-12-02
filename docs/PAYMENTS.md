# Payment System UI Documentation

## Overview

The AfriReads payment system supports two payment methods:
1. **Stripe** - International card payments
2. **M-Pesa** - Mobile money for Kenya

This document covers all payment-related UI components and flows.

---

## Payment Flows

### 1. Checkout Page

**Route:** `/checkout/[bookId]`

**Layout:**
```
┌────────────────┬──────────────────────┐
│                │                      │
│  Order Summary │  Payment Method      │
│                │                      │
│  Book Cover    │  ┌─────┬─────────┐  │
│  Title         │  │Card │ M-Pesa  │  │
│  Author        │  └─────┴─────────┘  │
│  Price         │                      │
│                │  Card Details Form   │
│  Subtotal      │  ┌─────────────────┐│
│  Platform Fee  │  │ Card Number     ││
│  Total         │  │ Expiry    CVV   ││
│                │  │ Cardholder Name ││
│                │  └─────────────────┘│
│                │                      │
│                │  [Complete Purchase] │
│                │                      │
│                │  🔒 Secure Payment   │
└────────────────┴──────────────────────┘
```

**Components:**

#### Order Summary Card
```tsx
interface OrderSummaryProps {
  book: {
    id: string;
    title: string;
    coverImage: string;
    author: string;
    price: number;
  };
  platformFee: number;
}

export function OrderSummary({ book, platformFee }: OrderSummaryProps) {
  const total = book.price + platformFee;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">
        Order Summary
      </h2>

      {/* Book Info */}
      <div className="flex gap-4 mb-6">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-20 h-28 object-cover rounded"
        />
        <div>
          <h3 className="font-semibold text-neutral-brown-900">{book.title}</h3>
          <p className="text-sm text-neutral-brown-700">{book.author}</p>
          <p className="text-lg font-bold text-primary mt-2">
            KES {book.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-neutral-brown-500/20 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-brown-700">Subtotal</span>
          <span className="font-medium">KES {book.price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-brown-700">Platform Fee (10%)</span>
          <span className="font-medium">KES {platformFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-neutral-brown-500/20 pt-2 mt-2">
          <span>Total</span>
          <span className="text-primary">KES {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
```

#### Payment Method Tabs
```tsx
import { CreditCard, Smartphone } from 'lucide-react';

type PaymentMethod = 'stripe' | 'mpesa';

export function PaymentMethodSelector({
  selected,
  onSelect,
}: {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onSelect('stripe')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
          selected === 'stripe'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary/50'
        }`}
      >
        <CreditCard size={20} />
        <span className="font-medium">Card Payment</span>
      </button>

      <button
        onClick={() => onSelect('mpesa')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
          selected === 'mpesa'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-neutral-brown-500/20 text-neutral-brown-700 hover:border-primary/50'
        }`}
      >
        <Smartphone size={20} />
        <span className="font-medium">M-Pesa</span>
      </button>
    </div>
  );
}
```

---

### 2. Stripe Payment Form

```tsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';

export function StripePaymentForm({ amount, onSuccess }: {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Element */}
      <div className="p-4 border-2 border-neutral-brown-500/20 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#4A3728',
                '::placeholder': {
                  color: '#9B8D82',
                },
              },
            },
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay KES ${amount.toLocaleString()}`}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-brown-700">
        <Lock size={16} />
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
}
```

---

### 3. M-Pesa Payment Modal

**Description:**
Modal dialog for M-Pesa STK Push payment. User enters phone number, clicks "Send STK Push", then enters PIN on their phone.

```tsx
import { Smartphone, Loader2 } from 'lucide-react';

type MpesaStatus = 'input' | 'processing' | 'success' | 'failed';

export function MpesaPaymentModal({
  amount,
  onSuccess,
  onClose,
}: {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onClose: () => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<MpesaStatus>('input');
  const [error, setError] = useState('');

  const handleSendSTK = async () => {
    setStatus('processing');
    setError('');

    try {
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: `254${phoneNumber}`,
          amount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Poll for payment status
        const checkStatus = setInterval(async () => {
          const statusRes = await fetch(`/api/mpesa/status/${data.checkoutRequestId}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'completed') {
            clearInterval(checkStatus);
            setStatus('success');
            onSuccess(statusData.transactionId);
          } else if (statusData.status === 'failed') {
            clearInterval(checkStatus);
            setStatus('failed');
            setError('Payment was cancelled or failed');
          }
        }, 2000);
      } else {
        setStatus('failed');
        setError(data.message || 'Failed to initiate payment');
      }
    } catch (err) {
      setStatus('failed');
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-brown-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Smartphone size={32} className="text-accent-green" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-brown-900">Pay with M-Pesa</h2>
          <p className="text-3xl font-bold text-primary mt-2">
            KES {amount.toLocaleString()}
          </p>
        </div>

        {status === 'input' && (
          <>
            {/* Phone Number Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                M-Pesa Phone Number
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-3 bg-neutral-cream rounded-lg text-neutral-brown-900 font-medium">
                  +254
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="712345678"
                  maxLength={9}
                  className="flex-1 px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-neutral-brown-900 font-medium mb-2">
                How to pay:
              </p>
              <ol className="text-sm text-neutral-brown-700 space-y-1 list-decimal list-inside">
                <li>Enter your M-Pesa phone number</li>
                <li>Click "Send STK Push"</li>
                <li>Enter your M-Pesa PIN on your phone</li>
                <li>Wait for confirmation</li>
              </ol>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSendSTK}
              disabled={phoneNumber.length !== 9}
              className="w-full bg-accent-green hover:bg-accent-green/90 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send STK Push
            </button>
          </>
        )}

        {status === 'processing' && (
          <div className="text-center py-8">
            <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-neutral-brown-900 mb-2">
              Waiting for payment...
            </p>
            <p className="text-sm text-neutral-brown-700">
              Please enter your M-Pesa PIN on your phone
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">✕</span>
            </div>
            <p className="text-lg font-semibold text-error mb-2">Payment Failed</p>
            <p className="text-sm text-neutral-brown-700 mb-4">{error}</p>
            <button
              onClick={() => setStatus('input')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cancel Button */}
        {status !== 'success' && (
          <button
            onClick={onClose}
            className="w-full mt-3 text-neutral-brown-700 hover:text-neutral-brown-900 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### 4. Payment Success Page

**Route:** `/checkout/success?orderId=[id]`

```tsx
import { CheckCircle, Download, Book } from 'lucide-react';
import Confetti from 'react-confetti';

export function PaymentSuccessPage({ order }: { order: Order }) {
  return (
    <div className="min-h-screen bg-neutral-cream flex items-center justify-center p-4">
      <Confetti recycle={false} numberOfPieces={200} />

      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <CheckCircle size={80} className="text-accent-green mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-neutral-brown-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-neutral-brown-700">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-neutral-brown-900 mb-4">
            Order Details
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-brown-700">Order ID</span>
              <span className="font-mono font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-brown-700">Date</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-brown-700">Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-neutral-brown-500/20 pt-3 mt-3">
              <span>Amount Paid</span>
              <span className="text-primary">KES {order.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex gap-4 mt-6 p-4 bg-neutral-cream rounded-lg">
            <img
              src={order.book.coverImage}
              alt={order.book.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold text-neutral-brown-900">
                {order.book.title}
              </h3>
              <p className="text-sm text-neutral-brown-700">{order.book.author}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-4">
          <a
            href={`/read/${order.book.id}`}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Book size={20} />
            Read Book Now
          </a>
          <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all">
            <Download size={20} />
            Download Receipt
          </button>
        </div>

        <a
          href="/books"
          className="block text-center text-primary hover:text-primary-dark font-medium"
        >
          Continue Shopping →
        </a>
      </div>
    </div>
  );
}
```

---

### 5. Author Earnings Dashboard

**Route:** `/dashboard/author/earnings`

```tsx
import { DollarSign, TrendingUp, Download } from 'lucide-react';

export function AuthorEarningsPage() {
  return (
    <div className="space-y-6">
      {/* Total Earnings Card */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-brown-700 mb-1">Total Earnings</p>
            <p className="text-4xl font-bold text-neutral-brown-900">
              KES 145,250
            </p>
            <div className="flex items-center gap-2 mt-2 text-accent-green">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">+12% from last month</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <DollarSign size={32} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-neutral-brown-700">Available Balance</p>
          <p className="text-2xl font-bold text-accent-green mt-1">KES 25,000</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-neutral-brown-700">Pending Payouts</p>
          <p className="text-2xl font-bold text-primary mt-1">KES 5,000</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-neutral-brown-700">Total Paid Out</p>
          <p className="text-2xl font-bold text-neutral-brown-900 mt-1">KES 115,250</p>
        </div>
      </div>

      {/* Request Payout Card */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">
          Request Payout
        </h3>
        <p className="text-sm text-neutral-brown-700 mb-4">
          Minimum payout: KES 1,000
        </p>
        <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all">
          Request Payout (KES 25,000)
        </button>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">
          Monthly Earnings
        </h3>
        {/* Chart component here */}
      </div>
    </div>
  );
}
```

---

### 6. Payout Request Modal

```tsx
export function PayoutRequestModal({ availableBalance, onClose, onSuccess }: {
  availableBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState<'mpesa' | 'bank'>('mpesa');
  const [amount, setAmount] = useState(availableBalance);
  const processingFee = amount * 0.02; // 2%
  const netAmount = amount - processingFee;

  return (
    <div className="fixed inset-0 bg-neutral-brown-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold text-neutral-brown-900 mb-4">
          Request Payout
        </h2>

        {/* Available Balance */}
        <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-brown-700">Available Balance</p>
          <p className="text-3xl font-bold text-accent-green">
            KES {availableBalance.toLocaleString()}
          </p>
        </div>

        {/* Payment Method Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMethod('mpesa')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              method === 'mpesa'
                ? 'bg-primary text-white'
                : 'bg-neutral-cream text-neutral-brown-700'
            }`}
          >
            M-Pesa
          </button>
          <button
            onClick={() => setMethod('bank')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              method === 'bank'
                ? 'bg-primary text-white'
                : 'bg-neutral-cream text-neutral-brown-700'
            }`}
          >
            Bank Transfer
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
            Payout Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            max={availableBalance}
            className="w-full px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>

        {/* Summary */}
        <div className="bg-neutral-cream rounded-lg p-4 mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-brown-700">Amount Requested</span>
            <span className="font-medium">KES {amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-brown-700">Processing Fee (2%)</span>
            <span className="font-medium text-error">
              - KES {processingFee.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-neutral-brown-500/20 pt-2 mt-2">
            <span>You Will Receive</span>
            <span className="text-accent-green">KES {netAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-neutral-brown-900">
            ⏱️ Payouts are processed within 3-5 business days
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-neutral-brown-500/20 text-neutral-brown-900 font-semibold py-3 rounded-lg hover:bg-neutral-cream transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSuccess}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all"
          >
            Confirm Request
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Payment States

### Loading States
- Stripe: "Processing payment..."
- M-Pesa: "Waiting for PIN entry..."
- Payout: "Submitting request..."

### Success States
- Green checkmark icon
- Confirmation message
- Order/transaction details
- Next action buttons

### Error States
- Red error icon
- Clear error message
- "Try Again" button
- Support contact info

---

## Security Features

1. **Stripe Elements** - PCI-compliant card input
2. **HTTPS Only** - All payment pages
3. **CSRF Protection** - Via NextAuth
4. **Webhook Verification** - Stripe signature validation
5. **Amount Validation** - Server-side checks
6. **Rate Limiting** - Prevent payment spam

---

## API Integration

```typescript
// Stripe Checkout
POST /api/checkout
Body: { bookId, amount }
Response: { clientSecret }

// M-Pesa STK Push
POST /api/mpesa/stk-push
Body: { phoneNumber, amount }
Response: { checkoutRequestId }

// Check M-Pesa Status
GET /api/mpesa/status/[checkoutRequestId]
Response: { status: 'pending' | 'completed' | 'failed' }

// Request Payout
POST /api/payouts
Body: { amount, method, accountDetails }
Response: { payoutId, status }
```

---

## Testing

### Test Cards (Stripe)
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0027 6000 3184

### Test M-Pesa
- Use Safaricom sandbox credentials
- Test phone: 254712345678

---

## Next Steps

1. Integrate Stripe SDK
2. Set up M-Pesa Daraja API
3. Implement webhook handlers
4. Add payment analytics
5. Set up automated payouts
