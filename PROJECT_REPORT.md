# KaleeReads (Kalenjin Books) — Project Analysis Report

**Date:** August 2026  
**Repository:** `https://github.com/pngobiro/kalenjinbooks.git`  
**Production URL:** `https://kalenjinbooks.com` / `https://kalenjin-books.dspop.info`

---

## 1. Overview

KaleeReads is a **full-stack digital book marketplace** built to showcase, sell, read, and share Kalenjin literature and cultural content. It connects local authors with readers worldwide, preserving and promoting Kalenjin heritage through digital publishing and e-commerce.

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.0.6 (App Router) | React framework, SSR/SSG, routing |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Lucide React | 0.562.0 | Icons |
| Recharts | 3.7.0 | Analytics charts |
| Tiptap | 3.12.1 | Rich text editor (blog posts) |
| react-pdf / pdfjs-dist | 9.1.1 / 4.9.155 | PDF rendering in browser |
| Zod | 3.24.1 | Schema validation |
| Google Sign-In (GSI) | Script-based | OAuth authentication |

### Backend (Cloudflare Worker)
| Technology | Purpose |
|---|---|
| Cloudflare Workers | Serverless API runtime |
| Cloudflare D1 | SQLite database (serverless) |
| Cloudflare R2 | Object storage (books, images) |
| Cloudflare KV | Key-value store (caching, sessions) |
| Cloudflare Email Workers | Email sending |
| Prisma ORM | Database access (with D1 adapter) |
| jose | JWT token creation/verification |
| bcryptjs | Password hashing |
| Stripe | International payments |
| AWS SDK (S3-compatible) | R2 file operations |

---

## 3. Project Structure

```
kalenjinbooks/
├── src/
│   ├── app/                    # Next.js App Router pages (20+ routes)
│   │   ├── books/              # Book listing & detail pages
│   │   ├── book/viewer/        # PDF/EPUB reader
│   │   ├── authors/            # Author listing & profiles
│   │   ├── login/              # Google OAuth login
│   │   ├── payment/            # M-Pesa & Stripe payments
│   │   ├── dashboard/
│   │   │   ├── admin/          # Super admin panel
│   │   │   └── author/         # Author dashboard
│   │   └── ...                 # About, FAQ, Contact, etc.
│   ├── components/             # Reusable React components
│   │   ├── books/              # BookCard, BookFilters
│   │   ├── home/               # FeaturedBooks, Categories, Stats
│   │   ├── admin/              # AdminOverview, ApplicationsTab, etc.
│   │   └── dashboard/          # DashboardSidebar, AdminSidebar
│   ├── lib/                    # Utilities & API clients
│   │   ├── api/                # books.ts, auth.ts, authors.ts, admin.ts
│   │   ├── auth-context.tsx    # React Auth Context Provider
│   │   ├── cloudflare-r2.ts   # R2 operations
│   │   └── analytics.ts        # Client-side analytics
│   └── worker/                 # Cloudflare Worker (API backend)
│       ├── index.ts            # Worker entry point & routing
│       ├── handlers/           # books, authors, auth, admin, upload, analytics, hardcopy
│       ├── middleware/         # cors.ts, auth.ts
│       └── utils/              # response, cache, email
├── prisma/
│   ├── schema.prisma           # Database schema (13 models)
│   ├── dev.db                  # Local SQLite database
│   ├── migrations/             # D1 migrations
│   └── seed-*.sql              # Sample data
├── scripts/cloudflare/         # D1/KV setup scripts
├── public/                     # Static assets, book covers, logos
└── wrangler.toml               # Cloudflare Worker config
```

---

## 4. Key Features

### Book Marketplace
- Browse/search by title, category, author, or language
- Featured books with admin-controlled ordering
- Categories: Fiction, Non-Fiction, Folklore, History, Poetry, Children, Education
- Multi-language support (Kalenjin, English, Bilingual)

### Purchase & Rental System
- **Permanent purchase** or **24-hour rental** options
- M-Pesa integration for Kenyan users
- Stripe integration for international payments
- 70/30 revenue split (70% author, 30% platform)
- Time-limited access links with JWT-secured PDF viewing

### Author Management
- Comprehensive author application workflow
- Author dashboard: analytics, earnings, book management, profile editing
- Profile photo upload to R2 storage
- Blog post authoring with Tiptap editor

### Admin Dashboard
- Author application review (approve/reject with reasons)
- Book publication approval workflow
- Featured book management and ordering
- Revenue dashboard with payout tracking
- Platform statistics and monitoring

### Content Delivery
- Secure PDF serving with token-based authentication
- Image proxy for CORS-safe R2 image serving
- Anti-download headers for protected content

### Hard Copy Requests
- Readers can request physical copies
- Delivery information collection
- Author notification and email workflow

### Analytics & Tracking
- Event tracking: views, clicks, previews, purchases, author views, signups
- Per-book and daily aggregate statistics
- Admin and author analytics dashboards

---

## 5. Database Schema (13 Models)

| Model | Description |
|---|---|
| **User** | User accounts (email, password, Google ID, role) |
| **Author** | Author profiles (30+ fields, status workflow) |
| **Book** | Book info (title, price, rental price, category, language, R2 file key) |
| **Purchase** | Transaction records (amount, fees, payment IDs, status) |
| **Payment** | Author payout records |
| **TimeAccessLink** | Time-limited access tokens |
| **BlogPost** | Author blog posts |
| **BlogImage** | Blog post images |
| **AnalyticsEvent** | Event tracking records |
| **DailyStats** | Daily aggregated statistics |
| **BookAnalytics** | Per-book analytics counters |
| **HardCopyRequest** | Physical book requests |

**Enums:** UserRole (READER/AUTHOR/ADMIN), AuthorStatus, PurchaseStatus, PaymentStatus, EventType, HardCopyRequestStatus

---

## 6. API Endpoints

### Books (`/api/books`)
- `GET /` — List books (paginated, filterable)
- `GET /:id` — Book details
- `GET /:id/secure-view` — Time-limited secure PDF URL
- `POST /` — Create book (author/admin)
- `POST /upload` — Upload book with files
- `PUT /:id` — Update book
- `DELETE /:id` — Delete book

### Authors (`/api/authors`)
- `GET /` — List authors
- `GET /:id` — Author profile with books
- `GET /me` — Current author profile
- `PUT /me` — Update profile
- `GET /earnings` — Earnings data
- `GET /analytics` — Author analytics
- `POST /apply` — Submit application

### Admin (`/api/admin`)
- Author management: list, approve, reject, toggle status, make admin
- Book management: list pending, approve, reject, toggle status/featured
- Revenue data

### Auth
- `POST /register`, `POST /login`, `POST /auth/google`, `POST /auth/logout`

### Other
- `POST /api/analytics/track` — Track events
- `GET /api/analytics/dashboard` — Admin analytics
- `GET /api/images/{path}` — Image proxy
- `GET /api/secure-pdf/{token}` — Secure PDF serving
- `POST /api/hard-copy-requests` — Hard copy requests

---

## 7. Configuration

### Environment Variables
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite database path |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | Cloudflare access |
| `R2_BUCKET_NAME` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 storage |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth |
| `STRIPE_*` | Stripe payment |
| `MPESA_*` | M-Pesa payment (optional) |
| `PLATFORM_COMMISSION_PERCENTAGE` | Platform fee (default: 10) |
| `TIME_LIMITED_ACCESS_HOURS` | Rental duration (default: 168) |

### Cloudflare Resources
- **Worker:** `kalenjin-books-worker` (with `nodejs_compat`)
- **D1 Database:** `kalenjin-books-db`
- **R2 Bucket:** `kalenjin-books`
- **KV Namespaces:** `CACHE`, `SESSION`
- **Email Workers:** `EMAIL` binding
- **Cron:** Daily expired link cleanup, weekly DB optimization

---

## 8. Deployment

### Split Deployment Model
1. **Frontend (Next.js)** → Cloudflare Pages (via Git integration)
2. **Backend (Worker)** → Cloudflare Workers (`npx wrangler deploy`)

### Deployment Scripts
- `deploy.sh` — Interactive deployment helper
- `scripts/cloudflare/setup-d1.sh` — D1 database provisioning
- `scripts/cloudflare/migrate-d1.sh` — D1 migration runner
- `scripts/cloudflare/setup-kv.sh` — KV namespace creation

### Local Development
- `npm run dev` — Next.js dev server (port 3001)
- `npx wrangler dev --port 8787 --remote` — Worker dev
- Docker Cloudflare Tunnel for external access

---

## 9. Architecture Decisions

1. **Edge-First Design** — All backend logic runs on Cloudflare Workers with D1, R2, and KV at the edge
2. **Decoupled Frontend/Backend** — Next.js and Worker are independently deployed, communicating via HTTP
3. **Custom JWT Auth** — Uses `jose` library with KV-stored sessions for revocation support
4. **Prisma with D1 Adapter** — Type-safe database queries in Workers environment
5. **R2 as Primary Storage** — All file uploads (books, images, profiles) stored in R2
6. **Image Proxy Pattern** — Worker serves R2 images with CORS headers
7. **KV Caching Layer** — Books, authors, and featured content cached with 5-10 min TTLs
8. **Standardized API Responses** — All endpoints return `{ success, data, error, code }`
9. **Revenue Sharing** — Configurable 70/30 author/platform split
10. **Cascading Disables** — Disabling an author disables all their books

---

## 10. Testing

**No automated tests exist in the project.** There are no test files, no test framework configuration (Jest, Vitest, Playwright, etc.), and no test scripts in `package.json`.

---

## 11. Observations & Recommendations

| Area | Observation | Recommendation |
|---|---|---|
| **Testing** | No automated tests | Add unit tests (Vitest) and E2E tests (Playwright) |
| **Error Handling** | Some client-side errors are silently caught | Implement structured error reporting/logging |
| **Caching** | KV caching with manual invalidation | Consider stale-while-revalidate patterns |
| **Security** | Hardcoded super admin email | Consider environment-based admin configuration |
| **API Routing** | Manual `path.startsWith()` matching | Evaluate Hono or itty-router for cleaner routing |
| **SEO** | Mostly client-side rendering | Leverage Next.js server components where possible |
| **Documentation** | Multiple .md files (some overlapping) | Consolidate into a single comprehensive README |

---

*Report generated by analyzing the full codebase including source files, configuration, database schema, and documentation.*
