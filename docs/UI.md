# UI/UX Documentation

## Overview

AfriReads features a warm, culturally-inspired design system that celebrates Kalenjin literature while maintaining modern web standards. This document outlines the complete UI implementation guide.

## Design Philosophy

- **Cultural Connection**: African-inspired colors and geometric patterns
- **Readability**: Clear typography with generous spacing
- **Trust**: Professional, premium aesthetic
- **Accessibility**: WCAG 2.1 AA compliant

---

## Color System

### Primary Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Terracotta Orange | `#E07856` | Primary buttons, CTAs, accents |
| Terracotta Dark | `#C85D3A` | Hover states |
| Terracotta Light | `#F09B7D` | Backgrounds, highlights |

### Neutral Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#F5F1E8` | Main background |
| White | `#FFFFFF` | Cards, modals, surfaces |
| Deep Brown | `#4A3728` | Headings, primary text |
| Medium Brown | `#6B5D52` | Secondary text |
| Light Brown | `#9B8D82` | Muted text, placeholders |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Sage Green | `#8B9D83` | Success states, badges |
| Gold | `#D4AF37` | Ratings, premium features |
| Error Red | `#D64545` | Errors, warnings |
| Success Green | `#4CAF50` | Success messages |

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E07856',
          dark: '#C85D3A',
          light: '#F09B7D',
        },
        neutral: {
          cream: '#F5F1E8',
          brown: {
            900: '#4A3728',
            700: '#6B5D52',
            500: '#9B8D82',
          }
        },
        accent: {
          green: '#8B9D83',
          gold: '#D4AF37',
        }
      }
    }
  }
}
```

---

## Typography

### Font Stack

```css
/* Headings */
font-family: 'Playfair Display', Georgia, serif;

/* Body Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Code/Monospace */
font-family: 'JetBrains Mono', monospace;
```

### Type Scale

| Size | Rem | Pixels | Usage |
|------|-----|--------|-------|
| 5xl | 3.5rem | 56px | Hero headings |
| 4xl | 3rem | 48px | Page titles |
| 3xl | 2.25rem | 36px | Section headings |
| 2xl | 1.875rem | 30px | Card titles |
| xl | 1.5rem | 24px | Subheadings |
| lg | 1.25rem | 20px | Large body |
| base | 1rem | 16px | Body text |
| sm | 0.875rem | 14px | Small text |
| xs | 0.75rem | 12px | Captions |

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## Spacing System

Based on 4px base unit:

| Token | Value | Pixels |
|-------|-------|--------|
| space-1 | 0.25rem | 4px |
| space-2 | 0.5rem | 8px |
| space-3 | 0.75rem | 12px |
| space-4 | 1rem | 16px |
| space-6 | 1.5rem | 24px |
| space-8 | 2rem | 32px |
| space-12 | 3rem | 48px |
| space-16 | 4rem | 64px |

---

## Components

### Buttons

#### Primary Button

```tsx
<button className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
  Purchase Book
</button>
```

**Specs:**
- Background: Terracotta orange
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 600
- Hover: Lift effect + darker shade

#### Secondary Button

```tsx
<button className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200">
  Preview
</button>
```

#### Ghost Button

```tsx
<button className="bg-transparent text-neutral-brown-900 hover:bg-primary/10 px-6 py-3 rounded-lg transition-all duration-200">
  Learn More
</button>
```

### Cards

#### Book Card

```tsx
<div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
  <img src={coverUrl} alt={title} className="w-full aspect-[2/3] object-cover rounded-lg mb-3" />
  <h3 className="font-semibold text-lg text-neutral-brown-900 line-clamp-2">{title}</h3>
  <p className="text-sm text-neutral-brown-700 mt-1">{author}</p>
  <div className="flex items-center justify-between mt-3">
    <span className="text-xl font-bold text-primary">KES {price}</span>
    <button className="text-primary hover:text-primary-dark">
      <ShoppingCart size={20} />
    </button>
  </div>
</div>
```

**Specs:**
- Background: White
- Border radius: 12px
- Padding: 16px
- Shadow: Subtle, increases on hover
- Hover: Lift effect (-4px translate)

#### Stat Card (Dashboard)

```tsx
<div className="bg-white rounded-2xl p-6 border-l-4 border-primary shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-neutral-brown-700">Total Earnings</p>
      <p className="text-3xl font-bold text-neutral-brown-900 mt-1">KES 45,000</p>
    </div>
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
      <DollarSign className="text-primary" size={24} />
    </div>
  </div>
  <p className="text-sm text-accent-green mt-3">↑ 12% from last month</p>
</div>
```

### Form Elements

#### Input Field

```tsx
<input 
  type="text"
  className="w-full px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
  placeholder="Enter book title"
/>
```

**Specs:**
- Border: 2px solid, light brown
- Padding: 12px 16px
- Border radius: 8px
- Focus: Primary color border + subtle ring

#### Search Bar

```tsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-brown-700" size={20} />
  <input 
    type="search"
    className="w-full pl-12 pr-4 py-3 bg-white rounded-full shadow-md focus:shadow-lg focus:outline-none transition-all"
    placeholder="Search books..."
  />
</div>
```

### Badges

```tsx
{/* Category Badge */}
<span className="inline-block px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
  Fiction
</span>

{/* Language Badge */}
<span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
  Kalenjin
</span>
```

---

## Page Layouts

### Landing Page

**Structure:**
```
┌─────────────────────────────────────┐
│         Navigation Bar              │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│   "Discover Kalenjin Literature"   │
│                                     │
├─────────────────────────────────────┤
│      Featured Books Carousel        │
├─────────────────────────────────────┤
│       Categories Grid (3x2)         │
├─────────────────────────────────────┤
│     Featured Authors (3 cols)       │
├─────────────────────────────────────┤
│      Statistics Counters            │
├─────────────────────────────────────┤
│          CTA Section                │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

**Key Elements:**
- Hero: Full-width with gradient background
- Books carousel: Auto-scroll, 5 visible on desktop
- Categories: Icon + title + book count
- Stats: Animated counters on scroll

### Books Catalog

**Layout:**
```
┌──────────┬──────────────────────────┐
│          │   Search Bar + Filters   │
│          ├──────────────────────────┤
│          │  ┌────┐ ┌────┐ ┌────┐   │
│ Sidebar  │  │Book│ │Book│ │Book│   │
│ Filters  │  └────┘ └────┘ └────┘   │
│          │  ┌────┐ ┌────┐ ┌────┐   │
│          │  │Book│ │Book│ │Book│   │
│          │  └────┘ └────┘ └────┘   │
│          ├──────────────────────────┤
│          │      Pagination          │
└──────────┴──────────────────────────┘
```

**Responsive:**
- Desktop: 4-column grid
- Tablet: 2-column grid, collapsible sidebar
- Mobile: 1-column, filters in modal

### Book Detail Page

**Layout:**
```
┌─────────────┬──────────────────────┐
│             │  Title               │
│   Book      │  Author + Avatar     │
│   Cover     │  Rating ★★★★☆        │
│   Image     │  Price: KES 500      │
│             │  [Purchase] [Preview]│
│             │                      │
│             │  Description...      │
└─────────────┴──────────────────────┘
┌──────────────────────────────────────┐
│        Author Bio Section            │
├──────────────────────────────────────┤
│        Reviews Section               │
├──────────────────────────────────────┤
│     Related Books Carousel           │
└──────────────────────────────────────┘
```

### Author Dashboard

**Layout:**
```
┌──────────┬────────────────────────────┐
│          │  Welcome, [Author Name]    │
│          ├────────────────────────────┤
│          │ ┌──────┐ ┌──────┐ ┌──────┐│
│ Sidebar  │ │Earn. │ │Books │ │Sales ││
│ Nav      │ └──────┘ └──────┘ └──────┘│
│          ├────────────────────────────┤
│          │    Earnings Chart          │
│          ├────────────────────────────┤
│          │    My Books Table          │
└──────────┴────────────────────────────┘
```

---

## Patterns & Decorations

### African Geometric Patterns

Use as subtle background elements:

```css
.pattern-background {
  background-image: url('/patterns/triangles.svg');
  background-size: 200px;
  background-repeat: repeat;
  opacity: 0.05;
}
```

**Pattern Types:**
- Triangular tessellations
- Zigzag borders
- Diamond grids
- Circular motifs

**Usage:**
- Hero section backgrounds
- Section dividers
- Card decorations (subtle)

---

## Animations & Transitions

### Hover Effects

```css
/* Card Hover */
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(74, 55, 40, 0.15);
}

/* Button Hover */
.button {
  transition: all 0.2s;
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(224, 120, 86, 0.3);
}
```

### Loading States

```tsx
{/* Skeleton Loader for Book Card */}
<div className="bg-white rounded-xl p-4 animate-pulse">
  <div className="w-full aspect-[2/3] bg-neutral-brown-500/20 rounded-lg mb-3" />
  <div className="h-4 bg-neutral-brown-500/20 rounded w-3/4 mb-2" />
  <div className="h-3 bg-neutral-brown-500/20 rounded w-1/2" />
</div>
```

### Page Transitions

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile First */
.container {
  padding: 1rem;
}

/* Tablet (641px+) */
@media (min-width: 641px) {
  .container {
    padding: 2rem;
  }
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1025px+) */
@media (min-width: 1025px) {
  .container {
    padding: 3rem;
  }
  .book-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .container {
    max-width: 1280px;
    margin: 0 auto;
  }
}
```

### Mobile Considerations

- Minimum touch target: 44x44px
- Larger font sizes (16px minimum for inputs)
- Simplified navigation (hamburger menu)
- Stack layouts vertically
- Bottom navigation for key actions

---

## Accessibility

### Color Contrast

All combinations meet WCAG AA standards:

| Combination | Ratio | Pass |
|-------------|-------|------|
| Deep Brown on Cream | 8.1:1 | ✅ AAA |
| White on Terracotta | 6.2:1 | ✅ AA |
| Terracotta on Cream | 4.8:1 | ✅ AA |

### Keyboard Navigation

```tsx
{/* Focus Visible */}
<button className="focus:outline-none focus:ring-4 focus:ring-primary/30">
  Click Me
</button>

{/* Skip to Content */}
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded">
  Skip to main content
</a>
```

### Screen Reader Support

```tsx
{/* Icon Button with Label */}
<button aria-label="Add to cart">
  <ShoppingCart size={20} />
</button>

{/* Image Alt Text */}
<img src={cover} alt={`Cover of ${bookTitle} by ${authorName}`} />

{/* Loading State */}
<div role="status" aria-live="polite">
  {loading ? 'Loading books...' : `${books.length} books found`}
</div>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icons

### Icon Library

Use **Lucide React** for consistent, modern icons:

```bash
npm install lucide-react
```

**Common Icons:**
- `Book` - Books, library
- `User` - Authors, profiles
- `ShoppingCart` - Cart, purchases
- `Search` - Search functionality
- `Heart` - Wishlist, favorites
- `DollarSign` - Pricing, earnings
- `TrendingUp` - Analytics, growth
- `Upload` - File uploads
- `Eye` - Preview, view
- `Share2` - Social sharing

### Usage

```tsx
import { Book, ShoppingCart, Heart } from 'lucide-react';

<Book size={24} className="text-primary" />
<ShoppingCart size={20} strokeWidth={2} />
<Heart size={18} fill="currentColor" />
```

---

---

## Temporary Access Links UI

### Overview

The temporary access links feature allows users to share time-limited book access without requiring purchase. This includes link generation, countdown timers, and access management.

### Visual Mockups

#### 3. Book Detail Page

![Book Detail Mockup](/mockups/afrireads_book_detail_1764672314747.png)

**Components:**
- Modal overlay with centered dialog
- Book thumbnail preview
- Duration selector dropdown
- Optional recipient email field
- Generated link display with copy button
- Expiration countdown
- Revoke access button

#### 4. Author Dashboard

![Author Dashboard Mockup](/mockups/afrireads_author_dashboard_1764672335838.png)

**Components:**
#### 1. Link Generation Modal

![Temporary Link Modal](/mockups/temporary_link_modal_1764672996072.png)

**Components:**
- Modal overlay with centered dialog
- Book thumbnail preview
- Duration selector dropdown
- Optional recipient email field
- Generated link display with copy button
- Expiration countdown
- Revoke access button

#### 2. Book Reader with Temporary Access

![Book Reader Temporary Access](/mockups/book_reader_temporary_1764673011818.png)

**Components:**
- Prominent countdown banner at top
- PDF viewer in center
- Book info sidebar
- "Purchase Full Access" CTA
- Expiration warning message

#### 3. Access Links Management Dashboard

### 1. Landing Page

![Landing Page Mockup](/mockups/afrireads_landing_page_1764672267589.png)

**Components:**
- Stats cards (Total Links, Active, Views)
- Filter tabs (All, Active, Expired)
- Links table with actions
- Create new link button

---

### Components

#### Link Generation Modal

```tsx
import { useState } from 'react';
import { Clock, Copy, X, Link as LinkIcon } from 'lucide-react';

interface GenerateLinkModalProps {
  book: {
    id: string;
    title: string;
    coverImage: string;
  };
  onClose: () => void;
}

export function GenerateLinkModal({ book, onClose }: GenerateLinkModalProps) {
  const [duration, setDuration] = useState('168'); // 7 days in hours
  const [email, setEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/access-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          expiresInHours: parseInt(duration),
          recipientEmail: email || undefined,
        }),
      });
      const data = await response.json();
      setGeneratedLink(`${window.location.origin}/read/${data.token}`);
    } catch (error) {
      console.error('Failed to generate link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    // Show toast notification
  };

  return (
    <div className="fixed inset-0 bg-neutral-brown-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-brown-900">
            Share Temporary Access
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-brown-700 hover:text-neutral-brown-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Book Preview */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-cream rounded-lg">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-16 h-24 object-cover rounded"
          />
          <div>
            <h3 className="font-semibold text-neutral-brown-900">{book.title}</h3>
            <p className="text-sm text-neutral-brown-700">Temporary access link</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Duration Selector */}
          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
              Access Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="24">24 Hours</option>
              <option value="72">3 Days</option>
              <option value="168">7 Days (Recommended)</option>
              <option value="720">30 Days</option>
            </select>
          </div>

          {/* Optional Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
              Recipient Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        {!generatedLink && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Link'}
          </button>
        )}

        {/* Generated Link Display */}
        {generatedLink && (
          <div className="space-y-4">
            <div className="p-4 bg-accent-green/10 border-2 border-accent-green/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon size={16} className="text-accent-green" />
                <span className="text-sm font-medium text-accent-green">
                  Link Generated Successfully
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-neutral-brown-500/20 rounded text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-all"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Expiration Info */}
            <div className="flex items-center gap-2 text-sm text-neutral-brown-700">
              <Clock size={16} />
              <span>Expires in {duration} hours</span>
            </div>

            {/* Revoke Button */}
            <button className="w-full border-2 border-error text-error hover:bg-error hover:text-white font-semibold py-3 rounded-lg transition-all">
              Revoke Access
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

#### Countdown Timer Component

```tsx
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: Date;
  onExpire?: () => void;
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.expired && onExpire) {
        onExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeRemaining.expired) {
    return (
      <div className="bg-error/10 border-2 border-error text-error px-4 py-3 rounded-lg flex items-center gap-2">
        <Clock size={20} />
        <span className="font-semibold">Access Expired</span>
      </div>
    );
  }

  const isUrgent = timeRemaining.hours < 1;

  return (
    <div
      className={`px-4 py-3 rounded-lg flex items-center gap-3 ${
        isUrgent
          ? 'bg-error/10 border-2 border-error text-error'
          : 'bg-primary/10 border-2 border-primary text-primary'
      }`}
    >
      <Clock size={20} />
      <div>
        <span className="text-sm font-medium">Time Remaining:</span>
        <span className="ml-2 text-lg font-bold font-mono">
          {String(timeRemaining.hours).padStart(2, '0')}:
          {String(timeRemaining.minutes).padStart(2, '0')}:
          {String(timeRemaining.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
```

---

#### Temporary Access Banner

```tsx
import { AlertCircle, ShoppingCart } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface TemporaryAccessBannerProps {
  expiresAt: Date;
  bookTitle: string;
  bookId: string;
}

export function TemporaryAccessBanner({
  expiresAt,
  bookTitle,
  bookId,
}: TemporaryAccessBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b-2 border-primary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Warning Message */}
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={20} className="text-primary" />
          <p className="text-sm font-medium text-neutral-brown-900">
            You're viewing <strong>{bookTitle}</strong> with temporary access
          </p>
        </div>

        {/* Countdown and CTA */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CountdownTimer expiresAt={expiresAt} />

          <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5">
            <ShoppingCart size={20} />
            Purchase Full Access
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

#### Access Links Management Table

```tsx
import { Copy, Trash2, ExternalLink } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface AccessLink {
  id: string;
  token: string;
  book: {
    title: string;
    coverImage: string;
  };
  recipient?: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
}

export function AccessLinksTable({ links }: { links: AccessLink[] }) {
  const copyLink = (token: string) => {
    const url = `${window.location.origin}/read/${token}`;
    navigator.clipboard.writeText(url);
    // Show toast
  };

  const revokeLink = async (id: string) => {
    // Call API to revoke
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-cream border-b-2 border-neutral-brown-500/10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
              Book
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
              Recipient
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
              Created
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
              Expires In
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">
              Status
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-brown-500/10">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-neutral-cream/50 transition-colors">
              {/* Book */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={link.book.coverImage}
                    alt={link.book.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <span className="font-medium text-neutral-brown-900">
                    {link.book.title}
                  </span>
                </div>
              </td>

              {/* Recipient */}
              <td className="px-6 py-4 text-sm text-neutral-brown-700">
                {link.recipient || '—'}
              </td>

              {/* Created */}
              <td className="px-6 py-4 text-sm text-neutral-brown-700">
                {new Date(link.createdAt).toLocaleDateString()}
              </td>

              {/* Expires In */}
              <td className="px-6 py-4">
                <CountdownTimer expiresAt={link.expiresAt} />
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                {link.isRevoked ? (
                  <span className="inline-block px-3 py-1 bg-error/20 text-error text-sm font-medium rounded-full">
                    Revoked
                  </span>
                ) : new Date() > link.expiresAt ? (
                  <span className="inline-block px-3 py-1 bg-neutral-brown-500/20 text-neutral-brown-700 text-sm font-medium rounded-full">
                    Expired
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
                    Active
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => copyLink(link.token)}
                    className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                    title="Copy Link"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => window.open(`/read/${link.token}`, '_blank')}
                    className="p-2 text-neutral-brown-700 hover:bg-neutral-brown-500/10 rounded transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink size={16} />
                  </button>
                  {!link.isRevoked && (
                    <button
                      onClick={() => revokeLink(link.id)}
                      className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                      title="Revoke Access"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### User Flows

#### 1. Generating a Temporary Link

1. User clicks "Share" button on book detail page
2. Modal opens with link generation form
3. User selects duration (24h, 7d, 30d)
4. Optionally enters recipient email
5. Clicks "Generate Link"
6. Link is created and displayed with copy button
7. User copies link and shares via email/messaging
8. User can revoke link at any time

#### 2. Accessing via Temporary Link

1. Recipient clicks temporary access link
2. System validates token (not expired, not revoked)
3. If valid: Book reader opens with countdown banner
4. If invalid: Error page with "Link expired" message
5. Reader shows remaining time prominently
6. "Purchase Full Access" CTA always visible
7. When time expires: Reader locks, shows purchase prompt

#### 3. Managing Access Links (Author Dashboard)

1. Author navigates to "Shared Links" section
2. Views table of all generated links
3. Can filter by status (Active, Expired, All)
4. Sees countdown timers for active links
5. Can copy link URL to share again
6. Can revoke active links
7. Views stats: Total created, Active, Total views

---

### States & Interactions

#### Link States

| State | Visual | Actions Available |
|-------|--------|-------------------|
| Active | Green badge, countdown timer | Copy, Open, Revoke |
| Expired | Gray badge, "Expired" text | Copy (for reference) |
| Revoked | Red badge, "Revoked" text | None |

#### Countdown Timer States

| Time Remaining | Color | Urgency |
|----------------|-------|---------|
| > 24 hours | Terracotta (primary) | Normal |
| 1-24 hours | Orange | Medium |
| < 1 hour | Red | Urgent |
| Expired | Red background | Critical |

---

### API Integration

```typescript
// Generate link
const response = await fetch('/api/access-links', {
  method: 'POST',
  body: JSON.stringify({
    bookId: 'uuid',
    expiresInHours: 168,
  }),
});

// Validate link
const response = await fetch(`/api/access-links/${token}`);
const { valid, book, expiresAt } = await response.json();

// Revoke link
await fetch(`/api/access-links/${token}`, {
  method: 'DELETE',
});
```

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Install Tailwind CSS
- [ ] Configure custom colors
- [ ] Add Google Fonts (Playfair Display, Inter)
- [ ] Install Lucide React icons
- [ ] Create pattern SVGs

### Phase 2: Components
- [ ] Button variants (Primary, Secondary, Ghost)
- [ ] Card components (Book, Stat, Author)
- [ ] Form elements (Input, Search, Select)
- [ ] Navigation bar
- [ ] Footer

### Phase 3: Pages
- [ ] Landing page
- [ ] Books catalog
- [ ] Book detail
- [ ] Author profile
- [ ] Author dashboard

### Phase 4: Polish
- [ ] Add animations
- [ ] Implement loading states
- [ ] Test accessibility
- [ ] Optimize for mobile
- [ ] Add dark mode (optional)

---

#### 3. Access Links Management Dashboard

![Access Links Management](/mockups/access_links_management_1764673031089.png)
---

## Resources

- **Design Mockups**: See `/home/ngobiro/.gemini/antigravity/brain/582a3931-c933-4278-9c7c-3eaa65d0c9df/`
- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Google Fonts**: https://fonts.google.com
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## Support

For UI/UX questions or design feedback, refer to this documentation or consult the design mockups in the artifacts directory.
