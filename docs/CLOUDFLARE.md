# Cloudflare Infrastructure Setup Guide

## Overview

AfriReads leverages Cloudflare's edge infrastructure for optimal performance and cost efficiency:

- **Cloudflare R2**: Zero-egress-fee object storage for books and images
- **Cloudflare D1**: Serverless SQLite database
- **Cloudflare Workers/Pages**: Edge computing for backend and frontend
- **Cloudflare CDN**: Global content delivery network

## Prerequisites

1. Cloudflare account ([sign up](https://dash.cloudflare.com/sign-up))
2. Domain name (optional, but recommended)
3. Wrangler CLI installed (`npm install -g wrangler`)

## Step-by-Step Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
# or install locally
npm install --save-dev wrangler
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window for authentication.

### 3. Get Your Account ID

```bash
npx wrangler whoami
```

Copy your Account ID and add it to `.env`:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

---

## Cloudflare R2 Setup

### Create R2 Bucket

```bash
npx wrangler r2 bucket create kalenjin-books
```

### Generate R2 Access Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Overview**
3. Click **Manage R2 API Tokens**
4. Click **Create API Token**
5. Select **Admin Read & Write** permissions
6. Copy the Access Key ID and Secret Access Key

Add to `.env`:

```env
R2_BUCKET_NAME=kalenjin-books
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
```

### Configure R2 in wrangler.toml

```toml
[[r2_buckets]]
binding = "BOOKS_BUCKET"
bucket_name = "kalenjin-books"
```

### Test R2 Connection

```typescript
// Test upload
import { uploadBook } from '@/lib/cloudflare-r2';

const testBuffer = Buffer.from('Test content');
const fileKey = await uploadBook({
  file: testBuffer,
  fileName: 'test.pdf',
  contentType: 'application/pdf',
  bookId: 'test-id'
});

console.log('Uploaded to:', fileKey);
```

---

## Cloudflare D1 Setup

### Create D1 Database

```bash
npx wrangler d1 create kalenjin-books-db
```

**Output:**
```
✅ Successfully created DB 'kalenjin-books-db'

[[d1_databases]]
binding = "DB"
database_name = "kalenjin-books-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the database configuration to `wrangler.toml`.

### Initialize Database Schema

Generate Prisma client:

```bash
npx prisma generate
```

Create migration SQL:

```bash
npx prisma migrate dev --name init
```

Apply to D1:

```bash
npx wrangler d1 execute kalenjin-books-db --file=./prisma/migrations/YYYYMMDDHHMMSS_init/migration.sql
```

### Verify Database

```bash
npx wrangler d1 execute kalenjin-books-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### Query D1 Database

```bash
# List all tables
npx wrangler d1 execute kalenjin-books-db --command="SELECT * FROM User LIMIT 5;"
```

---

## Cloudflare Workers/Pages Deployment

### Option 1: Cloudflare Pages (Recommended for Next.js)

#### Build Configuration

Update `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "deploy": "npx wrangler pages deploy .next"
  }
}
```

#### Deploy

```bash
npm run build
npx wrangler pages deploy .next
```

#### Configure Environment Variables

In Cloudflare Dashboard:
1. Go to **Workers & Pages**
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add all variables from `.env`

### Option 2: Cloudflare Workers

For API-only deployment:

```bash
npx wrangler deploy
```

---

## Custom Domain Setup

### Add Custom Domain

1. Go to **Workers & Pages** in Cloudflare Dashboard
2. Select your project
3. Navigate to **Custom Domains**
4. Click **Set up a custom domain**
5. Enter your domain (e.g., `afrireads.com`)
6. Follow DNS configuration instructions

### SSL/TLS Configuration

Cloudflare automatically provisions SSL certificates for custom domains.

**Recommended Settings:**
- SSL/TLS encryption mode: **Full (strict)**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**

---

## Cloudflare KV (Optional - for Caching)

### Create KV Namespace

```bash
npx wrangler kv:namespace create "CACHE"
```

Add to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your_kv_namespace_id"
```

### Use KV for Caching

```typescript
// In Cloudflare Worker
export default {
  async fetch(request, env) {
    const cacheKey = 'books:featured';
    
    // Try cache first
    const cached = await env.CACHE.get(cacheKey, 'json');
    if (cached) return Response.json(cached);
    
    // Fetch from database
    const books = await fetchFeaturedBooks();
    
    // Cache for 1 hour
    await env.CACHE.put(cacheKey, JSON.stringify(books), {
      expirationTtl: 3600
    });
    
    return Response.json(books);
  }
};
```

---

## Secrets Management

### Set Secrets

Never commit secrets to version control. Use Wrangler to set secrets:

```bash
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put DATABASE_URL
```

### List Secrets

```bash
npx wrangler secret list
```

### Delete Secrets

```bash
npx wrangler secret delete SECRET_NAME
```

---

## Monitoring & Analytics

### Enable Analytics

1. Go to **Workers & Pages** → Your Project
2. Navigate to **Analytics**
3. View metrics:
   - Requests per second
   - Error rate
   - CPU time
   - Duration

### Logs

View real-time logs:

```bash
npx wrangler tail
```

Filter logs:

```bash
npx wrangler tail --status error
```

---

## Cost Optimization

### R2 Pricing

- **Storage**: $0.015/GB/month
- **Class A Operations** (write): $4.50/million
- **Class B Operations** (read): $0.36/million
- **Egress**: **FREE** (huge savings vs S3)

### D1 Pricing

- **Free Tier**:
  - 5 GB storage
  - 5 million reads/day
  - 100,000 writes/day
- **Paid**: $0.75/million reads, $1.00/million writes

### Workers/Pages Pricing

- **Free Tier**:
  - 100,000 requests/day
  - 10ms CPU time per request
- **Paid**: $5/month for 10 million requests

### Cost Estimation

For a platform with:
- 10,000 books (average 5MB each) = 50GB storage
- 100,000 book downloads/month
- 1 million API requests/month

**Monthly Cost:**
- R2 Storage: $0.75
- R2 Operations: ~$2
- D1: Free tier sufficient
- Workers: Free tier sufficient
- **Total: ~$3/month**

Compare to AWS S3 egress fees: **$4,500/month** for same traffic!

---

## Troubleshooting

### R2 Connection Issues

```bash
# Test R2 access
npx wrangler r2 object list kalenjin-books --limit 10
```

### D1 Migration Errors

```bash
# Reset database (CAUTION: deletes all data)
npx wrangler d1 execute kalenjin-books-db --command="DROP TABLE IF EXISTS User;"

# Re-apply migrations
npx wrangler d1 execute kalenjin-books-db --file=./prisma/migrations/YYYYMMDDHHMMSS_init/migration.sql
```

### Deployment Failures

```bash
# Check deployment logs
npx wrangler pages deployment list

# View specific deployment
npx wrangler pages deployment tail DEPLOYMENT_ID
```

---

## Best Practices

1. **Use Separate Environments**: Create separate R2 buckets and D1 databases for development, staging, and production

2. **Enable Caching**: Use Cloudflare KV for frequently accessed data

3. **Optimize Images**: Compress cover images before uploading to R2

4. **Monitor Costs**: Set up billing alerts in Cloudflare Dashboard

5. **Backup Regularly**: Export D1 database weekly

6. **Use Signed URLs**: Always use signed URLs for R2 objects to prevent unauthorized access

7. **Rate Limiting**: Configure rate limiting in Cloudflare Dashboard to prevent abuse

---

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
