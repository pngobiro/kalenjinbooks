# Author Dashboard Documentation

## Overview

The AfriReads author dashboard provides a comprehensive interface for authors to manage their books, track earnings, view analytics, and manage their profile.

## Routes

All dashboard routes are under `/dashboard/author/`:

- `/dashboard/author` - Overview/Home
- `/dashboard/author/books` - My Books
- `/dashboard/author/earnings` - Earnings & Payouts
- `/dashboard/author/analytics` - Analytics (Coming soon)
- `/dashboard/author/profile` - Author Profile
- `/dashboard/author/settings` - Settings (Coming soon)

## Components

### DashboardSidebar

**Location:** `src/components/dashboard/DashboardSidebar.tsx`

Persistent sidebar navigation with:
- AfriReads logo
- Navigation menu
- Active state highlighting
- Logout button

**Features:**
- Sticky positioning
- Active route detection using `usePathname()`
- Icon + text navigation items
- Terracotta highlight for active items

---

## Pages

### 1. Dashboard Overview

**Route:** `/dashboard/author`
**File:** `src/app/dashboard/author/page.tsx`

**Features:**
- **Stats Cards** (4 cards):
  - Total Earnings (with trend %)
  - Books Published
  - Total Sales (with trend %)
  - Available Balance (with payout link)

- **Recent Sales Table**:
  - Last 3 sales
  - Book name, customer, amount, date
  - Link to full analytics

- **Top Performing Books**:
  - Ranked list (1-3)
  - Sales count and earnings per book

**Actions:**
- "Upload New Book" button (top right)

---

### 2. My Books

**Route:** `/dashboard/author/books`
**File:** `src/app/dashboard/author/books/page.tsx`

**Features:**
- **Summary Stats** (4 cards):
  - Total Books
  - Published count
  - Total Sales
  - Total Earnings

- **Books Table**:
  - Columns: Book (with cover), Price, Sales, Earnings, Status, Actions
  - Status badges: Published (green), Draft (gray)
  - Actions: View, Edit, Delete

**Book Status:**
- **Published**: Live on marketplace
- **Draft**: Not yet published

**Actions:**
- View book (eye icon)
- Edit book (edit icon)
- Delete book (trash icon)
- Upload new book (top right button)

---

### 3. Earnings

**Route:** `/dashboard/author/earnings`
**File:** `src/app/dashboard/author/earnings/page.tsx`

**Features:**
- **Stats Cards** (4 cards):
  - Total Earnings (with trend)
  - Available Balance (with payout link)
  - Pending Payouts
  - Total Paid Out

- **Monthly Earnings Chart**:
  - Bar chart showing last 6 months
  - Hover to see exact amounts
  - Terracotta bars with hover effects

- **Request Payout Section**:
  - Shows available balance
  - Minimum payout threshold (KES 1,000)
  - "Request Payout" button
  - Disabled if below minimum

- **Transaction History Table**:
  - Columns: Date, Type, Description, Amount, Status
  - Transaction types: Sale (green), Payout (orange)
  - Shows net earnings after platform fee
  - Completed status badges

**Actions:**
- Export Report (top right)
- Request Payout
- View transaction details

---

### 4. Profile

**Route:** `/dashboard/author/profile`
**File:** `src/app/dashboard/author/profile/page.tsx`

**Features:**
- **Profile Card** (left sidebar):
  - Avatar placeholder
  - Name and email
  - Join date
  - Phone number
  - Location

- **About Section**:
  - Author bio/description

- **Author Information**:
  - Languages
  - Member since date

- **Payment Settings**:
  - Preferred payment method
  - M-Pesa number
  - Bank details (if applicable)

**Actions:**
- "Edit Profile" button (top right)

---

## Design System

### Colors

All dashboard pages use the AfriReads color palette:

```css
/* Primary */
--primary: #E07856 (Terracotta Orange)
--primary-dark: #C85D3A
--primary-light: #F09B7D

/* Neutral */
--neutral-cream: #F5F1E8 (Background)
--neutral-brown-900: #4A3728 (Text)
--neutral-brown-700: #6B5D52 (Secondary text)

/* Accents */
--accent-green: #8B9D83 (Success, positive numbers)
--accent-gold: #D4AF37 (Special highlights)
--error: #D64545 (Negative numbers, errors)
```

### Typography

- **Headings**: Bold, neutral-brown-900
- **Body text**: Regular, neutral-brown-700
- **Numbers**: Bold, context-dependent colors

### Components

#### Stat Card
```tsx
<div className="bg-white rounded-xl p-6 shadow-sm">
  <p className="text-sm text-neutral-brown-700">Label</p>
  <p className="text-2xl font-bold text-neutral-brown-900">Value</p>
</div>
```

#### Status Badge
```tsx
{/* Success */}
<span className="px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-medium rounded-full">
  Published
</span>

{/* Neutral */}
<span className="px-3 py-1 bg-neutral-brown-500/20 text-neutral-brown-700 text-sm font-medium rounded-full">
  Draft
</span>
```

#### Action Button
```tsx
<button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors">
  <Icon size={16} />
</button>
```

---

## Data Flow

### Mock Data

Currently, all pages use mock data. In production, this will be replaced with API calls:

```typescript
// Example: Fetch earnings data
const response = await fetch('/api/author/earnings');
const earnings = await response.json();
```

### API Endpoints Needed

- `GET /api/author/stats` - Dashboard overview stats
- `GET /api/author/books` - List of author's books
- `GET /api/author/earnings` - Earnings data
- `GET /api/author/transactions` - Transaction history
- `POST /api/author/payout` - Request payout
- `GET /api/author/profile` - Author profile data
- `PUT /api/author/profile` - Update profile

---

## Responsive Design

### Desktop (1024px+)
- Sidebar: 256px fixed width
- Main content: Flexible
- Stats: 4 columns
- Tables: Full width

### Tablet (768px - 1023px)
- Sidebar: Collapsible
- Stats: 2 columns
- Tables: Horizontal scroll

### Mobile (< 768px)
- Sidebar: Drawer/modal
- Stats: 1 column
- Tables: Card view

---

## Future Enhancements

### Analytics Page
- Sales trends over time
- Geographic distribution
- Customer demographics
- Book performance comparison
- Revenue forecasting

### Settings Page
- Email notifications
- Privacy settings
- Account management
- API keys (for integrations)

### Book Upload
- Multi-step form
- File upload with progress
- Cover image upload
- Metadata editor
- Preview before publish

---

## Implementation Checklist

- [x] Dashboard sidebar component
- [x] Dashboard layout
- [x] Overview page
- [x] My Books page
- [x] Earnings page
- [x] Profile page
- [ ] Analytics page
- [ ] Settings page
- [ ] Book upload page
- [ ] Book edit page
- [ ] API integration
- [ ] Authentication guards
- [ ] Responsive mobile views
- [ ] Loading states
- [ ] Error handling

---

## Testing

### Manual Testing Checklist

- [ ] Navigate between all pages
- [ ] Verify stats display correctly
- [ ] Test table sorting/filtering
- [ ] Check responsive breakpoints
- [ ] Verify button actions
- [ ] Test payout request flow
- [ ] Validate form inputs

### Test Data

Use the mock data provided in each page component for testing. Replace with real data once API is integrated.

---

## Notes

- All monetary values are in KES (Kenyan Shillings)
- Platform fee is 10% of book price
- Minimum payout threshold: KES 1,000
- Payouts processed in 3-5 business days
- Transaction history shows last 30 days by default
