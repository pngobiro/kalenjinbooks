# KaleeReads - Kalenjin Books Marketplace

A modern, full-stack platform for showcasing, selling, and reading Kalenjin books online. Built with Next.js, Cloudflare Workers, and featuring author management, secure payments, and book sharing capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%7C%20D1%20%7C%20R2-orange)

## 🌟 Current Features

### 📚 Book Marketplace
- Browse and search Kalenjin books with categories
- Featured books section on homepage
- Book detail pages with purchase options
- Permanent purchase or 24-hour rental options
- Share books via Twitter, Facebook, WhatsApp, or copy link

### 👤 Author Management
- Author profiles with book collections
- Author dashboard with analytics and earnings
- Book upload and management system
- Author settings (notifications, security, payments)
- Revenue tracking and payout management

### 💳 Payment System
- M-Pesa integration for Kenya (phone number input)
- Stripe integration for international payments
- Secure payment processing
- Author revenue sharing (70% to authors)

### 📦 Hard Copy Requests
- Request physical copies of books
- Custom shipping and contact information
- Integrated with book detail pages

### 📊 Analytics & Reporting
- Sales analytics with date range filters
- Revenue tracking by book and time period
- Performance metrics and trends
- Export functionality for reports

### 🎨 Design & Branding
- Custom KaleeReads logo with flame icon
- African pattern borders throughout the site
- Responsive design with Tailwind CSS
- Kalenjin-inspired color scheme

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **UI Library**: React 19.2 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React hooks

### Backend & Infrastructure
- **API**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **File Storage**: Cloudflare R2
- **ORM**: Prisma with D1 adapter
- **CORS**: Custom middleware for cross-origin requests

### Development & Deployment
- **Tunnel**: Cloudflare Tunnel for local development
- **Environment**: Environment-based configuration
- **Build**: Next.js build system
- **Deployment**: Cloudflare Pages + Workers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

```bash
# Clone repository
git clone https://github.com/pngobiro/kalenjinbooks.git
cd kalenjinbooks

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Database Setup

```bash
# Run migrations
npx wrangler d1 execute DB --remote --file=prisma/migrations/add-book-fields.sql

# Seed database
npx wrangler d1 execute DB --remote --file=prisma/seed-books.sql
```

### Worker Deployment

```bash
# Deploy worker
npx wrangler deploy

# Start local worker (for development)
npx wrangler dev --port 8787 --remote
```

## 📁 Project Structure

```
kalenjinbooks/
├── src/
│   ├── app/                   # Next.js pages
│   │   ├── books/            # Book browsing & details
│   │   ├── authors/          # Author profiles
│   │   ├── payment/          # Payment flows
│   │   │   └── mpesa/        # M-Pesa payment page
│   │   ├── dashboard/        # Author dashboard
│   │   │   └── author/       # Author-specific pages
│   │   │       ├── analytics/ # Sales analytics
│   │   │       └── settings/  # Author settings
│   │   └── request-hard-copy/ # Physical book requests
│   ├── components/           # Reusable components
│   │   ├── KaleeReadsLogo.tsx # Custom logo
│   │   ├── ShareButtons.tsx   # Social sharing
│   │   ├── AfricanBorder.tsx  # Decorative borders
│   │   └── BookPurchaseOptions.tsx # Purchase UI
│   ├── lib/
│   │   └── api/              # API client functions
│   └── worker/               # Cloudflare Worker code
│       ├── handlers/         # API route handlers
│       └── middleware/       # CORS & other middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed-books.sql        # Sample data
├── public/
│   ├── books/                # Book cover images
│   └── images/               # Logos & assets
└── docs/                     # Documentation
```

## 🌐 Live Demo

- **Production**: https://kalenjin-books.dspop.info
- **API**: https://kalenjin-books-worker.pngobiro.workers.dev

## 🔧 Development

### Local Development
```bash
# Start Next.js (port 3001)
npm run dev

# Start Cloudflare Worker (port 8787)
npx wrangler dev --port 8787 --remote
```

### Cloudflare Tunnel
```bash
# Start tunnel for external access
bash start-tunnel.sh

# Or manually
docker-compose -f docker-compose.tunnel.yml up -d
```

### Environment Configuration
The app auto-detects the API URL based on hostname:
- `localhost` → Local worker (127.0.0.1:8787)
- `*.dspop.info` → Deployed worker
- Other domains → Deployed worker

## 📊 Database Schema

### Core Tables
- **User**: User accounts and authentication
- **Author**: Author profiles and metadata
- **Book**: Book information, pricing, and content
- **Purchase**: Transaction records
- **Review**: Book reviews and ratings

### Key Features
- Featured books with custom ordering
- Book categories and language support
- Author revenue tracking
- Rating and review system

## 🎨 Brand Identity

### Logo Design
- **KaleeReads** text with flame icon above the "R"
- Inspired by traditional African elements
- Colors: Brown (#8B4513) and Primary (#C85D3A)

### Visual Elements
- African pattern borders between sections
- Earth tone color palette
- Responsive typography with custom fonts

## 🔒 Security & CORS

### CORS Configuration
Allows requests from:
- `localhost:3000`, `localhost:3001` (development)
- `kalenjin-books.dspop.info` (tunnel)
- `kalenjinbooks.com` (production)

### Security Features
- Environment-based configuration
- Secure payment processing
- Input validation and sanitization

## 📚 API Documentation

### Books API
- `GET /api/books` - List books with filtering
- `GET /api/books/:id` - Get single book
- `GET /api/books?featured=true` - Get featured books

### Query Parameters
- `page`, `limit` - Pagination
- `search` - Text search
- `category` - Filter by category
- `featured` - Featured books only

## 🚢 Deployment

### Cloudflare Workers
```bash
npx wrangler deploy
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and Cloudflare
- Inspired by Kalenjin culture and traditions
- Community-driven book marketplace