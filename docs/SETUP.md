# KaleeReads Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account
- Git

### 1. Clone & Install
```bash
git clone https://github.com/pngobiro/kalenjinbooks.git
cd kalenjinbooks
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Leave empty for auto-detection
# NEXT_PUBLIC_WORKER_URL=""

# Database
DATABASE_URL="file:./prisma/dev.db"

# Disable Next.js overlay
NEXT_DISABLE_OVERLAY=true
```

### 3. Start Development
```bash
# Terminal 1: Next.js app (port 3001)
npm run dev

# Terminal 2: Cloudflare Worker (port 8787)
npx wrangler dev --port 8787 --remote
```

### 4. Access Application
- **Local**: http://localhost:3001
- **Tunnel**: https://kalenjin-books.dspop.info (if tunnel is running)

## Cloudflare Setup

### 1. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. Create D1 Database
```bash
# Create database
npx wrangler d1 create kalenjin-books

# Update wrangler.toml with database ID
# Copy the database_id from the output
```

### 3. Run Migrations
```bash
# Create tables
npx wrangler d1 execute DB --remote --file=prisma/migrations/add-book-fields.sql

# Seed sample data
npx wrangler d1 execute DB --remote --file=prisma/seed-books.sql

# Verify data
npx wrangler d1 execute DB --remote --command "SELECT COUNT(*) FROM Book"
```

### 4. Create R2 Bucket
```bash
# Create bucket for file storage
npx wrangler r2 bucket create kalenjin-books

# Upload sample book covers
npx wrangler r2 object put kalenjin-books/books/immortalknowledge.jpg --file=public/books/immortalknowledge.jpg
```

### 5. Deploy Worker
```bash
npx wrangler deploy
```

## Cloudflare Tunnel (Optional)

For external access during development:

### 1. Start Tunnel
```bash
bash start-tunnel.sh
```

### 2. Configure Domain
The tunnel exposes `localhost:3001` as `https://kalenjin-books.dspop.info`

### 3. Auto-start (Linux/Mac)
```bash
# Install as system service
sudo bash install-service.sh

# Check status
sudo systemctl status afrireads-tunnel
```

## Configuration Files

### wrangler.toml
```toml
name = "kalenjin-books-worker"
main = "src/worker/index.ts"
compatibility_date = "2024-12-01"

[[d1_databases]]
binding = "DB"
database_name = "kalenjin-books"
database_id = "your-database-id-here"

[[r2_buckets]]
binding = "BOOKS_BUCKET"
bucket_name = "kalenjin-books"

[vars]
NEXTAUTH_URL = "http://localhost:3000"
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "worker:dev": "wrangler dev --port 8787 --remote",
    "worker:deploy": "wrangler deploy"
  }
}
```

## Database Schema

### Core Tables Created
- **User**: User accounts and authentication
- **Author**: Author profiles and metadata  
- **Book**: Book information and content
- **Purchase**: Transaction records
- **Review**: Ratings and reviews

### Sample Data Included
- 8 books with covers and metadata
- 4 featured books
- Author profiles
- Categories and pricing

## API Configuration

### Auto-Detection Logic
The app automatically detects the correct API URL:

```typescript
// localhost → http://127.0.0.1:8787 (local worker)
// *.dspop.info → deployed worker
// other domains → deployed worker
```

### CORS Setup
The worker allows requests from:
- `localhost:3000`, `localhost:3001`
- `kalenjin-books.dspop.info`
- `kalenjinbooks.com`

## Troubleshooting

### Common Issues

#### 1. CORS Errors
```bash
# Redeploy worker with latest CORS config
npx wrangler deploy
```

#### 2. Database Connection
```bash
# Test database connection
npx wrangler d1 execute DB --remote --command "SELECT 1"
```

#### 3. Missing Books
```bash
# Re-seed database
npx wrangler d1 execute DB --remote --file=prisma/seed-books.sql
```

#### 4. Worker Not Responding
```bash
# Check worker logs
npx wrangler tail

# Restart local worker
npx wrangler dev --port 8787 --remote
```

### Debug Commands
```bash
# View database contents
npx wrangler d1 execute DB --remote --command "SELECT * FROM Book LIMIT 5"

# Check R2 bucket
npx wrangler r2 object list kalenjin-books

# Test API endpoint
curl http://127.0.0.1:8787/api/books
```

## Development Workflow

### 1. Make Changes
- Edit code in `src/` directory
- Changes auto-reload in development

### 2. Test Locally
- Verify on http://localhost:3001
- Test API on http://127.0.0.1:8787

### 3. Deploy Updates
```bash
# Deploy worker changes
npx wrangler deploy

# Deploy frontend (if using Cloudflare Pages)
npm run build
npx wrangler pages deploy .next
```

### 4. Git Workflow
```bash
git add .
git commit -m "Description of changes"
git push
```

## Production Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Deploy Worker
```bash
npx wrangler deploy
```

### 3. Deploy Frontend
```bash
# Option A: Cloudflare Pages
npx wrangler pages deploy .next

# Option B: Vercel
vercel deploy

# Option C: Netlify
netlify deploy --prod --dir=.next
```

### 4. Configure Domain
- Set up custom domain in Cloudflare
- Update CORS configuration if needed
- Test all functionality

## Monitoring

### Cloudflare Dashboard
- Worker analytics and logs
- D1 database metrics
- R2 storage usage
- CDN performance

### Application Logs
```bash
# Real-time worker logs
npx wrangler tail

# Formatted logs
npx wrangler tail --format=pretty
```