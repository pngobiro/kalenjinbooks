# AfriReads - Kalenjin Books Marketplace

A modern, full-stack platform for showcasing, selling, and reading Kalenjin books online. Built with Next.js, React, Cloudflare infrastructure, and featuring author management, secure payments, and time-limited book access.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Cloudflare](https://img.shields.io/badge/Cloudflare-R2%20%7C%20D1-orange)

## 🌟 Features

- **📚 Book Marketplace**: Browse, search, and purchase Kalenjin books
- **👤 Author Profiles**: Dedicated pages for authors with their book collections and social media links
- **📦 Hard Copy Requests**: Request physical copies of books with custom shipping options
- **💳 Secure Payments**: Stripe integration with M-Pesa support for Kenya
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
- **Payments**: Stripe + M-Pesa integration
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ and npm
- Cloudflare account ([sign up here](https://dash.cloudflare.com/sign-up))
- Stripe account for payments ([sign up here](https://stripe.com))
- Wrangler CLI (installed via npm)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
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

Edit `.env` and fill in your credentials:

```env
# Database
DATABASE_URL="file:./dev.db"

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
R2_BUCKET_NAME=kalenjin-books
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Set Up Cloudflare Infrastructure

#### Login to Cloudflare

```bash
npx wrangler login
```

#### Create R2 Bucket

```bash
npx wrangler r2 bucket create kalenjin-books
```

#### Create D1 Database

```bash
npx wrangler d1 create kalenjin-books-db
```

Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "kalenjin-books-db"
database_id = "your-database-id-here"
```

### 5. Initialize Database

Generate Prisma client:

```bash
npx prisma generate
```

Push schema to local database (for development):

```bash
npx prisma db push
```

For Cloudflare D1 (production):

```bash
npx wrangler d1 execute kalenjin-books-db --file=./prisma/migrations/schema.sql
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kalenjinbooks/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── books/            # Book pages
│   │   ├── authors/          # Author pages
│   │   │   └── [id]/         # Individual author profile
│   │   ├── request-hard-copy/# Hard copy request form
│   │   ├── dashboard/        # Author dashboard
│   │   ├── read/             # Book reader
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── books/           # Book-related components
│   │   └── author/          # Author-related components
│   └── lib/                  # Utility functions
│       ├── prisma.ts         # Prisma client
│       ├── cloudflare-r2.ts  # R2 storage utilities
│       ├── access-links.ts   # Time-limited access
│       └── auth.ts           # NextAuth configuration
├── docs/                     # Documentation
├── wrangler.toml            # Cloudflare configuration
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## 🔧 Development

### Database Management

View database in Prisma Studio:

```bash
npx prisma studio
```

Create a new migration:

```bash
npx prisma migrate dev --name migration_name
```

### Testing Locally

Run the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## 🚢 Deployment

### Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy
```

### Set Production Secrets

```bash
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
```

### Configure Custom Domain

In Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your project
3. Navigate to Custom Domains
4. Add your domain

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Cloudflare Setup Guide](./docs/CLOUDFLARE.md)
- [UI/UX Design Guide](./docs/UI.md)
- [Payment System](./docs/PAYMENTS.md)
- [Author Dashboard](./docs/DASHBOARD.md)
- [UI Mockups](./public/mockups/README.md)

## 🔐 Security

- All passwords are hashed using bcrypt
- Book files are stored in private R2 buckets
- Signed URLs for secure file access
- CSRF protection via NextAuth
- Input validation with Zod

## 💡 Key Features Explained

### Time-Limited Access Links

Generate temporary access links for books:

```typescript
import { createAccessLink } from '@/lib/access-links';

const link = await createAccessLink({
  userId: 'user-id',
  bookId: 'book-id',
  expiresInHours: 168, // 7 days
});

// Share link: https://afrireads.com/read/${link.token}
```

### Author Payment Tracking

Platform automatically tracks earnings per author:

```typescript
// On successful purchase
const platformFee = amount * (PLATFORM_COMMISSION_PERCENTAGE / 100);
const authorEarning = amount - platformFee;

await prisma.author.update({
  where: { id: authorId },
  data: { totalEarnings: { increment: authorEarning } }
});
```

### Cloudflare R2 Storage

Upload books to R2:

```typescript
import { uploadBook } from '@/lib/cloudflare-r2';

const fileKey = await uploadBook({
  file: buffer,
  fileName: 'book.pdf',
  contentType: 'application/pdf',
  bookId: 'book-id',
});
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@afrireads.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Cloudflare](https://cloudflare.com)
- Payments by [Stripe](https://stripe.com)

