# AfriReads - Kalenjin Books Marketplace

## Getting Started

This is the development setup guide for the AfriReads platform.

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository** (if not already done)
```bash
git clone <your-repo-url>
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

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Routes

#### Public Routes
- `/` - Landing page
- `/books` - Books catalog
- `/books/[id]` - Book detail page
- `/authors/[id]` - Author profile

#### Dashboard Routes (Author)
- `/dashboard/author` - Dashboard overview
- `/dashboard/author/books` - My Books
- `/dashboard/author/earnings` - Earnings & Payouts
- `/dashboard/author/profile` - Author Profile

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Project Structure

```
kalenjinbooks/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/
│   │   │   └── author/        # Author dashboard pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   └── dashboard/         # Dashboard components
│   └── lib/                   # Utility functions
│       ├── cloudflare-r2.ts   # R2 storage utilities
│       ├── prisma.ts          # Database client
│       └── access-links.ts    # Access link utilities
├── public/                    # Static assets
│   └── mockups/              # UI mockups
├── docs/                      # Documentation
├── prisma/                    # Database schema
└── package.json
```

### Tech Stack

- **Framework**: Next.js 16.0.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages/Workers

### Current Status

✅ **Completed:**
- Project setup and configuration
- Database schema design
- UI/UX design system
- Author dashboard (5 pages)
- Core utilities (R2, Prisma, Access Links)
- Comprehensive documentation

⏳ **In Progress:**
- Landing page
- Books catalog
- Authentication
- Payment integration

🔜 **Coming Soon:**
- Book reader
- Search & filtering
- Analytics
- Mobile responsive views

### Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

**Module not found errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tailwind styles not applying:**
```bash
# Rebuild Tailwind
npm run build
```

### Next Steps

1. Set up Cloudflare account and create R2 bucket
2. Create D1 database
3. Configure authentication with NextAuth.js
4. Integrate Stripe for payments
5. Build landing page and books catalog

See [docs/CLOUDFLARE.md](./docs/CLOUDFLARE.md) for detailed setup instructions.

### Support

For questions or issues, refer to the documentation in the `docs/` directory:
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [UI/UX Guide](./docs/UI.md)
- [Dashboard Guide](./docs/DASHBOARD.md)
