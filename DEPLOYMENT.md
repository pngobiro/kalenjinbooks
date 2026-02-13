# Deploying KaleeReads to Cloudflare Pages

This guide will help you deploy the KaleeReads Next.js application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler`)
3. Authenticated with Cloudflare (`wrangler login`)
4. Your Cloudflare Worker already deployed ✅

## Important Note

Since you're using Next.js 16, which is very new, we'll use Cloudflare Pages with Git integration (recommended) rather than the CLI adapter which doesn't support Next.js 16 yet.

## Deployment Steps

### Step 1: Prepare Your Repository

1. Make sure all your code is committed to Git
2. Push to GitHub, GitLab, or Bitbucket

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

### Step 2: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create application**
4. Select **Pages** tab
5. Click **Connect to Git**

### Step 3: Connect Your Repository

1. Authorize Cloudflare to access your Git provider
2. Select your repository
3. Click **Begin setup**

### Step 4: Configure Build Settings

Use these exact settings:

**Production branch:** `main` (or your default branch)

**Build settings:**
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave empty)
- **Node version**: `20`

### Step 5: Environment Variables

Click **Add variable** and add these:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_WORKER_URL=https://kalenjin-books-worker.pngobiro.workers.dev
DATABASE_URL=file:./dev.db
```

**Important:** Get your Google Client ID from Google Cloud Console.

### Step 6: Save and Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. You'll get a URL like `https://kaleereads-xxx.pages.dev`

## Post-Deployment Configuration

### 1. Update Worker CORS Settings

Your Worker needs to allow requests from your Pages domain. Update `src/worker/middleware/cors.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://kaleereads-xxx.pages.dev', // Add your Pages URL
  'https://your-custom-domain.com', // If you have one
];
```

Then redeploy your worker:
```bash
npx wrangler deploy
```

### 2. Update Google OAuth Settings

In [Google Cloud Console](https://console.cloud.google.com):

1. Go to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   - `https://kaleereads-xxx.pages.dev`
4. Add to **Authorized redirect URIs**:
   - `https://kaleereads-xxx.pages.dev/api/auth/callback/google`
5. Click **Save**

### 3. Test Your Deployment

Visit your Pages URL and test:
- ✅ Homepage loads
- ✅ Books page displays
- ✅ Login works
- ✅ Author dashboard accessible
- ✅ Book uploads work

## Custom Domain (Optional)

### Add Custom Domain

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `kaleereads.com`)
4. Follow DNS instructions to add CNAME record
5. Wait for DNS propagation (can take up to 24 hours)

### Update Settings After Custom Domain

1. Update CORS in Worker (add custom domain)
2. Update Google OAuth (add custom domain)
3. Update `NEXT_PUBLIC_WORKER_URL` if needed

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Out of memory"**
- This is rare with Cloudflare Pages
- Try reducing build complexity or contact support

### Pages Loads But API Calls Fail

**Check:**
1. Worker URL is correct in environment variables
2. CORS is configured properly in Worker
3. Worker is deployed and accessible

**Test Worker:**
```bash
curl https://kalenjin-books-worker.pngobiro.workers.dev/api/health
```

### Google Login Doesn't Work

**Check:**
1. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
2. Pages URL is added to Google OAuth settings
3. Redirect URIs match exactly (including https://)

### Images Don't Load

**Check:**
1. R2 bucket CORS is configured
2. Image URLs are correct
3. Worker image proxy is working

## Continuous Deployment

Once connected to Git:
- ✅ Push to main branch → Automatic deployment
- ✅ Pull requests → Preview deployments
- ✅ Rollback available from dashboard

## Alternative: Manual Deployment via CLI

If you prefer CLI deployment:

```bash
# Build the application
npm run build

# Deploy to Pages
npx wrangler pages deploy .next --project-name=kaleereads --branch=main
```

**Note:** You'll need to manually set environment variables in the dashboard.

## Monitoring & Analytics

### View Deployment Logs

1. Go to your Pages project
2. Click on a deployment
3. View **Build log** and **Function log**

### Analytics

1. Navigate to **Analytics** tab
2. View:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Error rates

### Real-time Logs

For debugging:
```bash
npx wrangler pages deployment tail
```

## Performance Optimization

### Enable Caching

Cloudflare automatically caches static assets. For API routes:

1. Go to **Caching** → **Configuration**
2. Set cache rules for static content
3. Configure cache TTL

### Image Optimization

Since Next.js image optimization doesn't work on Pages, consider:
1. Pre-optimize images before upload
2. Use Cloudflare Images (paid feature)
3. Serve images through R2 with proper caching

## Security Best Practices

1. **Enable HTTPS only** (automatic on Pages)
2. **Set up WAF rules** for protection
3. **Use environment variables** for secrets (never commit)
4. **Enable Bot Management** if needed
5. **Configure rate limiting** on Worker

## Cost

Cloudflare Pages Free Tier:
- ✅ Unlimited requests
- ✅ Unlimited bandwidth  
- ✅ 500 builds/month
- ✅ 1 concurrent build

Perfect for most projects!

## Quick Reference Commands

```bash
# Check deployment status
npx wrangler pages deployment list --project-name=kaleereads

# View logs
npx wrangler pages deployment tail

# Rollback to previous deployment
# (Do this from dashboard)

# Update environment variable
# (Do this from dashboard → Settings → Environment variables)
```

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Set up custom domain
3. ✅ Configure analytics
4. ✅ Set up monitoring/alerts
5. ✅ Document your deployment process
6. ✅ Share with your team!

---

**Your app is now live on Cloudflare's global network! 🎉**

