# KaleeReads Complete Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Reference](#api-reference)
4. [Cloudflare Setup](#cloudflare-setup)
5. [Payment Integration](#payment-integration)
6. [Author Dashboard](#author-dashboard)
7. [Deployment Guide](#deployment-guide)

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │────│ Cloudflare Worker │────│  Cloudflare D1  │
│   (Frontend)    │    │    (API Layer)    │    │   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Cloudflare R2   │    │   Stripe/M-Pesa  │    │  Cloudflare CDN │
│ (File Storage)  │    │   (Payments)     │    │   (Delivery)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **Backend**: Cloudflare Workers + Prisma ORM
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Payments**: Stripe + M-Pesa integration
- **CDN**: Cloudflare global network

## Database Schema

### Core Tables

#### User Table
```sql
CREATE TABLE User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Author Table
```sql
CREATE TABLE Author (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    bio TEXT,
    profileImage TEXT,
    isVerified BOOLEAN DEFAULT false,
    totalEarnings REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id)
);
```

#### Book Table
```sql
CREATE TABLE Book (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    coverImage TEXT,
    price REAL NOT NULL,
    rentalPrice REAL,
    previewPages INTEGER DEFAULT 5,
    category TEXT,
    language TEXT DEFAULT 'English',
    isPublished BOOLEAN DEFAULT false,
    isFeatured BOOLEAN DEFAULT false,
    featuredOrder INTEGER,
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    authorId TEXT NOT NULL,
    publishedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES Author(id)
);
```

### Relationships
- User → Author (1:1)
- Author → Books (1:many)
- Book → Reviews (1:many)
- User → Purchases (1:many)

## API Reference

### Base URL
- **Development**: `http://127.0.0.1:8787`
- **Production**: `https://kalenjin-books-worker.pngobiro.workers.dev`

### Books Endpoints

#### GET /api/books
List all books with optional filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in title/description
- `category` (string): Filter by category
- `featured` (boolean): Featured books only
- `authorId` (string): Books by specific author

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "book-001",
      "title": "Immortal Knowledge",
      "description": "A message to the African Grassroots...",
      "coverImage": "/books/immortalknowledge.jpg",
      "price": 1200,
      "rentalPrice": 50,
      "category": "Non-Fiction",
      "language": "English",
      "isFeatured": true,
      "rating": 4.8,
      "reviewCount": 12,
      "author": {
        "id": "author-001",
        "user": {
          "name": "Dr. Kibet Kitur"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

#### GET /api/books/:id
Get a single book by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "book-001",
    "title": "Immortal Knowledge",
    // ... full book details
  }
}
```

### Error Responses
```json
{
  "success": false,
  "error": "Book not found"
}
```

## Cloudflare Setup

### 1. D1 Database Setup
```bash
# Create database
npx wrangler d1 create kalenjin-books

# Run migrations
npx wrangler d1 execute DB --remote --file=prisma/migrations/add-book-fields.sql

# Seed data
npx wrangler d1 execute DB --remote --file=prisma/seed-books.sql
```

### 2. R2 Storage Setup
```bash
# Create bucket
npx wrangler r2 bucket create kalenjin-books

# Upload book covers
npx wrangler r2 object put kalenjin-books/books/immortalknowledge.jpg --file=public/books/immortalknowledge.jpg
```

### 3. Worker Configuration
Update `wrangler.toml`:
```toml
name = "kalenjin-books-worker"
main = "src/worker/index.ts"
compatibility_date = "2024-12-01"

[[d1_databases]]
binding = "DB"
database_name = "kalenjin-books"
database_id = "your-database-id"

[[r2_buckets]]
binding = "BOOKS_BUCKET"
bucket_name = "kalenjin-books"
```

### 4. Environment Variables
```bash
# Set environment variables
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put MPESA_CONSUMER_KEY
npx wrangler secret put MPESA_CONSUMER_SECRET
```

## Payment Integration

### M-Pesa Integration
Located at `/payment/mpesa` with phone number validation:

```typescript
// Phone number validation for Kenya
const validateKenyanPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return /^(254|0)[17]\d{8}$/.test(cleaned);
};
```

### Stripe Integration
Standard Stripe checkout flow with webhook handling.

### Payment Flow
1. User selects book and payment type (permanent/rental)
2. Redirected to payment page with book details
3. Choose payment method (M-Pesa/Stripe)
4. Complete payment
5. Access granted to book

## Author Dashboard

### Features Available

#### Analytics Page (`/dashboard/author/analytics`)
- Revenue overview with trends
- Sales metrics by time period
- Book performance tracking
- Date range filtering (7d, 30d, 90d, 1y, custom)
- Export functionality

#### Settings Page (`/dashboard/author/settings`)
- **Notifications**: Email, push, and report preferences
- **Security**: Password change, 2FA toggle
- **Payments**: M-Pesa number, bank account, payout settings
- **Preferences**: Language, currency, timezone, privacy

#### Books Management
- Upload new books
- Edit existing books
- View sales performance
- Manage pricing and availability

### Author Registration Flow
1. User creates account
2. Applies to become author
3. Admin review (pending/approved/rejected states)
4. Access to full dashboard upon approval

## Deployment Guide

### 1. Prepare Environment
```bash
# Install dependencies
npm install

# Build application
npm run build
```

### 2. Deploy Worker
```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# Verify deployment
curl https://kalenjin-books-worker.pngobiro.workers.dev/api/books
```

### 3. Deploy Frontend
```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy .next
```

### 4. Configure DNS
Set up custom domain in Cloudflare dashboard:
- Add CNAME record pointing to Pages deployment
- Enable SSL/TLS

### 5. Set up Tunnel (Development)
```bash
# Start tunnel for external access
bash start-tunnel.sh

# Configure tunnel domain
# kalenjin-books.dspop.info → localhost:3001
```

## CORS Configuration

The worker includes comprehensive CORS middleware supporting:
- Development origins (`localhost:3000`, `localhost:3001`)
- Tunnel domain (`kalenjin-books.dspop.info`)
- Production domains (`kalenjinbooks.com`)

## Monitoring & Debugging

### Logs
```bash
# View worker logs
npx wrangler tail

# View specific deployment logs
npx wrangler tail --format=pretty
```

### Database Queries
```bash
# Query database directly
npx wrangler d1 execute DB --remote --command "SELECT * FROM Book LIMIT 5"

# Check table structure
npx wrangler d1 execute DB --remote --command ".schema Book"
```

### Performance Monitoring
- Cloudflare Analytics dashboard
- Worker metrics and error rates
- D1 query performance
- R2 bandwidth usage

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure domain is added to CORS middleware
2. **Database Connection**: Verify D1 binding in wrangler.toml
3. **File Upload**: Check R2 bucket permissions
4. **Payment Failures**: Validate API keys and webhook endpoints

### Debug Commands
```bash
# Test API locally
curl http://127.0.0.1:8787/api/books

# Check environment variables
npx wrangler secret list

# Validate database connection
npx wrangler d1 execute DB --remote --command "SELECT 1"
```