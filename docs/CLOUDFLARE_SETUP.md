# Cloudflare Setup Guide

This guide will walk you through setting up and deploying the KalenjinBooks platform on Cloudflare infrastructure.

## Prerequisites

- [x] Node.js 18+ installed
- [x] Cloudflare account ([sign up](https://dash.cloudflare.com/sign-up))
- [x] Wrangler CLI installed (included in devDependencies)
- [x] Git repository cloned

## Quick Start

### 1. Install Dependencies

```bash
npm install
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

Copy your Account ID and add it to `.env.local`:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

### 4. Run Complete Setup

This will create D1 database and KV namespaces:

```bash
npm run cf:setup
```

The script will:
- Create D1 database `kalenjin-books-db`
- Update `wrangler.toml` with database ID
- Apply Prisma migrations to D1
- Create KV namespaces for CACHE and SESSION
- Display IDs for manual configuration

### 5. Update wrangler.toml

After running the setup, manually update the KV namespace IDs in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your_cache_kv_id"

[[kv_namespaces]]
binding = "SESSION"
id = "your_session_kv_id"
```

### 6. Set Secrets

Set sensitive environment variables as secrets:

```bash
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

When prompted, enter the secret values.

### 7. Test Locally

Run the worker locally with Wrangler:

```bash
npm run cf:dev
```

This starts a local development server at `http://localhost:8787`

### 8. Deploy to Cloudflare

Deploy the worker to production:

```bash
npm run cf:deploy
```

---

## Manual Setup (Alternative)

If you prefer to set up components individually:

### Create D1 Database

```bash
npm run cf:d1:create
```

### Create KV Namespaces

```bash
npm run cf:kv:create
```

### Apply Migrations

```bash
npm run cf:d1:migrate
```

---

## Environment Variables

### Required Secrets

Set these via `wrangler secret put`:

- `NEXTAUTH_SECRET` - Secret for NextAuth.js sessions
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

### Optional Secrets

- `MPESA_CONSUMER_KEY` - M-Pesa API consumer key
- `MPESA_CONSUMER_SECRET` - M-Pesa API consumer secret
- `MPESA_SHORTCODE` - M-Pesa shortcode
- `MPESA_PASSKEY` - M-Pesa passkey

### Public Variables

These are set in `wrangler.toml` under `[vars]`:

- `NEXTAUTH_URL` - Your application URL
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `PLATFORM_COMMISSION_PERCENTAGE` - Platform commission (default: 10)
- `TIME_LIMITED_ACCESS_HOURS` - Access link duration (default: 168)

---

## Database Management

### View Tables

```bash
npx wrangler d1 execute kalenjin-books-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### Query Data

```bash
npx wrangler d1 execute kalenjin-books-db --command="SELECT * FROM User LIMIT 5;"
```

### Backup Database

```bash
npx wrangler d1 export kalenjin-books-db --output=backup-$(date +%Y%m%d).sql
```

### Restore Database

```bash
npx wrangler d1 execute kalenjin-books-db --file=backup-20241211.sql
```

---

## R2 Storage

### List Buckets

```bash
npx wrangler r2 bucket list
```

### List Objects

```bash
npx wrangler r2 object list kalenjin-books --limit 10
```

### Upload Test File

```bash
echo "test" > test.txt
npx wrangler r2 object put kalenjin-books/test.txt --file=test.txt
```

---

## KV Management

### List Namespaces

```bash
npx wrangler kv:namespace list
```

### List Keys

```bash
npx wrangler kv:key list --namespace-id=your_kv_id
```

### Get Value

```bash
npx wrangler kv:key get "cache:books:page:1" --namespace-id=your_kv_id
```

### Delete Key

```bash
npx wrangler kv:key delete "cache:books:page:1" --namespace-id=your_kv_id
```

---

## Monitoring

### View Logs

Real-time logs:

```bash
npx wrangler tail
```

Filter by status:

```bash
npx wrangler tail --status error
```

### Analytics

View analytics in the Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Click on "Analytics"

---

## Troubleshooting

### Worker Not Deploying

1. Check `wrangler.toml` configuration
2. Verify all IDs are filled in
3. Ensure you're logged in: `npx wrangler whoami`
4. Check for syntax errors: `npm run lint`

### Database Connection Errors

1. Verify D1 database exists: `npx wrangler d1 list`
2. Check database ID in `wrangler.toml`
3. Ensure migrations are applied: `npm run cf:d1:migrate`

### R2 Upload Failures

1. Verify bucket exists: `npx wrangler r2 bucket list`
2. Check bucket binding in `wrangler.toml`
3. Verify file size limits

### Authentication Issues

1. Verify `NEXTAUTH_SECRET` is set: `npx wrangler secret list`
2. Check session KV namespace is configured
3. Verify JWT token generation

---

## Production Checklist

Before going to production:

- [ ] All secrets are set
- [ ] Database is migrated
- [ ] R2 bucket is created
- [ ] KV namespaces are created
- [ ] Custom domain is configured (optional)
- [ ] SSL/TLS is enabled
- [ ] Rate limiting is configured
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Error logging is configured

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Workers & Pages in Cloudflare Dashboard
2. Select your worker
3. Navigate to "Custom Domains"
4. Click "Set up a custom domain"
5. Enter your domain (e.g., `api.kalenjinbooks.com`)
6. Follow DNS configuration instructions

### SSL/TLS

Cloudflare automatically provisions SSL certificates for custom domains.

**Recommended Settings:**
- SSL/TLS encryption mode: **Full (strict)**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**

---

## Cost Estimation

### Free Tier Limits

- **Workers**: 100,000 requests/day
- **D1**: 5 GB storage, 5M reads/day, 100K writes/day
- **R2**: 10 GB storage, 1M Class A operations/month, 10M Class B operations/month
- **KV**: 100,000 reads/day, 1,000 writes/day, 1 GB storage

### Paid Pricing

- **Workers**: $5/month for 10M requests
- **D1**: $0.75/M reads, $1.00/M writes
- **R2**: $0.015/GB/month storage, **FREE egress**
- **KV**: $0.50/M reads, $5.00/M writes

---

## Support

For issues or questions:
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
