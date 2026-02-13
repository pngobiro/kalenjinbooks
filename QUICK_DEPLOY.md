# Quick Deploy to Cloudflare Pages

Follow these steps to deploy KaleeReads to Cloudflare Pages in under 10 minutes.

## Step 1: Push to Git (if not already done)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Go to Cloudflare Dashboard

Visit: https://dash.cloudflare.com

## Step 3: Create Pages Project

1. Click **Workers & Pages**
2. Click **Create application**
3. Click **Pages** tab
4. Click **Connect to Git**
5. Select your repository
6. Click **Begin setup**

## Step 4: Configure Build

**Framework preset:** Next.js

**Build command:** `npm run build`

**Build output directory:** `.next`

**Node version:** `20`

## Step 5: Add Environment Variables

Click **Add variable** for each:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
NEXT_PUBLIC_WORKER_URL=https://kalenjin-books-worker.pngobiro.workers.dev
DATABASE_URL=file:./dev.db
```

## Step 6: Deploy

Click **Save and Deploy**

Wait 2-5 minutes for build to complete.

## Step 7: Update CORS in Worker

Edit `src/worker/middleware/cors.ts` and add your Pages URL:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://YOUR-PROJECT.pages.dev', // Add this
];
```

Deploy worker:
```bash
npx wrangler deploy
```

## Step 8: Update Google OAuth

Go to: https://console.cloud.google.com

1. **APIs & Services** → **Credentials**
2. Click your OAuth Client ID
3. Add to **Authorized JavaScript origins**:
   - `https://YOUR-PROJECT.pages.dev`
4. Add to **Authorized redirect URIs**:
   - `https://YOUR-PROJECT.pages.dev/api/auth/callback/google`
5. Click **Save**

## Step 9: Test Your Site

Visit your Pages URL and test:
- ✅ Homepage
- ✅ Login
- ✅ Books page
- ✅ Author dashboard

## Done! 🎉

Your app is now live on Cloudflare's global network!

---

## Troubleshooting

**Build fails?**
- Check build logs in Cloudflare dashboard
- Verify all dependencies are in package.json

**API calls fail?**
- Check CORS settings in worker
- Verify worker URL in environment variables

**Login doesn't work?**
- Verify Google OAuth settings
- Check browser console for errors

---

For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)
