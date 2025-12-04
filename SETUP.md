# KaleeReads - Development Setup Guide

## Getting Started

This is the development setup guide for the KaleeReads platform.

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git
- Docker (optional, for Cloudflare Tunnel)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pngobiro/kalenjinbooks.git
cd kalenjinbooks
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration values.

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

### Available Routes

#### Public Routes
- `/` - Landing page with featured books
- `/books` - Books catalog with search & filters
- `/books/[id]` - Book detail page with purchase options
- `/authors` - Authors listing
- `/authors/[id]` - Author profile with their books
- `/about` - About KaleeReads
- `/contact` - Contact page
- `/faq` - Frequently asked questions

#### Payment Routes
- `/payment` - Payment method selection
- `/payment/mpesa` - M-Pesa payment with phone number input

#### Dashboard Routes (Author)
- `/dashboard/author` - Dashboard overview
- `/dashboard/author/books` - My Books
- `/dashboard/author/earnings` - Earnings & Payouts
- `/dashboard/author/profile` - Author Profile

### Development Commands

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

### Cloudflare Tunnel Setup

To expose your local server to the internet:

1. **Start the tunnel**
```bash
bash start-tunnel.sh
```

2. **Or use Docker directly**
```bash
docker-compose -f docker-compose.tunnel.yml up -d
```

3. **Install as system service (auto-start on boot)**
```bash
bash install-service.sh
```

### Project Structure

```
kalenjinbooks/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── books/             # Book pages
│   │   ├── authors/           # Author pages
│   │   ├── payment/           # Payment pages
│   │   │   └── mpesa/         # M-Pesa payment
│   │   ├── dashboard/         # Author dashboard
│   │   ├── globals.css        # Global styles (Tailwind v4)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   └── KaleeReadsLogo.tsx # Custom gourd & beads logo
│   └── lib/                   # Utility functions
│       ├── cloudflare-r2.ts   # R2 storage utilities
│       ├── data.ts            # Book data
│       └── prisma.ts          # Database client
├── public/
│   ├── books/                 # Book cover images
│   └── images/                # Site images & logos
├── docs/                      # Documentation
├── prisma/                    # Database schema
├── docker-compose.tunnel.yml  # Cloudflare Tunnel config
└── package.json
```

### Tech Stack

- **Framework**: Next.js 16.0.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 with @theme directive
- **Icons**: Lucide React
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages/Workers

### Current Features

✅ **Completed:**
- Landing page with featured books
- Books catalog with categories
- Book detail pages with purchase options
- Author profiles with book listings
- M-Pesa payment integration
- Custom KaleeReads logo (gourd & beads)
- Cloudflare Tunnel setup
- Author dashboard pages

⏳ **In Progress:**
- Full payment processing
- User authentication
- Book reader

### Troubleshooting

**Port already in use:**
```bash
# The app runs on port 3001 by default
# To use a different port:
PORT=3002 npm run dev
```

**Module not found errors:**
```bash
rm -rf node_modules .next
npm install
```

**Tailwind styles not applying:**
```bash
rm -rf .next
npm run dev
```

**Cloudflare Tunnel not connecting:**
```bash
# Check tunnel status
docker-compose -f docker-compose.tunnel.yml logs -f

# Restart tunnel
docker-compose -f docker-compose.tunnel.yml restart
```

### Support

For questions or issues, refer to the documentation in the `docs/` directory:
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Cloudflare Setup](./docs/CLOUDFLARE.md)
- [UI/UX Guide](./docs/UI.md)
- [Dashboard Guide](./docs/DASHBOARD.md)
