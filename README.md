# KaleeReads - Kalenjin Books Marketplace

A modern, full-stack platform for showcasing, selling, and reading Kalenjin books online. Built with Next.js, React, Cloudflare infrastructure, and featuring author management, secure payments, and time-limited book access.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Cloudflare](https://img.shields.io/badge/Cloudflare-R2%20%7C%20D1-orange)

## 🌟 Features

- **📚 Book Marketplace**: Browse, search, and purchase Kalenjin books
- **👤 Author Profiles**: Dedicated pages for authors with their book collections
- **📦 Hard Copy Requests**: Request physical copies of books with custom shipping
- **💳 Secure Payments**: M-Pesa and Stripe integration for Kenya
- **📖 Online Reading**: In-browser book viewer without downloads (PDF.js)
- **🔗 Time-Limited Access**: Generate special links for temporary book access
- **💰 Author Earnings**: Per-author payment tracking and payout system
- **🌍 Global CDN**: Fast book delivery via Cloudflare CDN
- **🔒 Authentication**: Secure user accounts with role-based access

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5.x
- **Book Viewer**: PDF.js + React-PDF

### Backend & Infrastructure
- **Hosting**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **CDN**: Cloudflare CDN
- **ORM**: Prisma with D1 adapter

### Authentication & Payments
- **Auth**: NextAuth.js
- **Payments**: M-Pesa + Stripe integration
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ and npm
- Cloudflare account ([sign up here](https://dash.cloudflare.com/sign-up))
- Stripe account for payments ([sign up here](https://stripe.com))
- Wrangler CLI (installed via npm)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/pngobiro/kalenjinbooks.git
cd kalenjinbooks
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

```
kalenjinbooks/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── books/                 # Book cover images
│   └── images/                # Site images & logos
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── books/            # Book pages
│   │   ├── authors/          # Author pages
│   │   ├── payment/          # Payment pages (M-Pesa, etc.)
│   │   ├── dashboard/        # Author dashboard
│   │   └── ...
│   ├── components/           # React components
│   │   └── KaleeReadsLogo.tsx # Custom logo component
│   └── lib/                  # Utility functions
├── docs/                     # Documentation
└── package.json
```

## 🎨 Brand Identity

KaleeReads features a custom logo inspired by:
- **Kalenjin Gourd (Calabash)**: Traditional vessel symbolizing knowledge preservation
- **Decorative Beads**: Cultural heritage and craftsmanship
- **Book Pages**: Literature emerging from tradition

## 💳 Payment Methods

- **M-Pesa**: Mobile money payments for Kenya (STK Push)
- **Stripe**: Credit/Debit cards (Visa, Mastercard, Amex)
- **PayPal**: International payments
- **Bank Transfer**: Direct bank transfers

## 🌐 Cloudflare Tunnel

Expose your local development server:

```bash
# Start the tunnel
bash start-tunnel.sh

# Or manually
docker-compose -f docker-compose.tunnel.yml up -d
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Cloudflare Setup Guide](./docs/CLOUDFLARE.md)
- [UI/UX Design Guide](./docs/UI.md)
- [Payment System](./docs/PAYMENTS.md)
- [Author Dashboard](./docs/DASHBOARD.md)

## 🔧 Development Commands

```bash
# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🚢 Deployment

### Deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy .next
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Cloudflare](https://cloudflare.com)
- Payments by [Stripe](https://stripe.com) & M-Pesa
