# Evening Development Plan: AfriReads Platform

This plan outlines the key objectives for this evening's development session, focusing on moving from UI mockups to a functional, data-driven application.

## 🎯 Primary Goal
**Connect the frontend to a real backend (Cloudflare D1 & R2) and implement user authentication.**

---

## 📋 Detailed Schedule

### Phase 1: Infrastructure & Database (The Foundation)
**Objective:** Ensure the database and storage are ready for data.
- [ ] **Cloudflare Setup**: Verify `wrangler.toml` configuration for D1 and R2.
- [ ] **Database Migration**: Run Prisma migrations to create tables in the local D1 database.
- [ ] **Seed Data**: Create a seed script to populate the database with initial categories, authors, and sample books.
- [ ] **Verify Connection**: Ensure the Next.js app can query the D1 database.

### Phase 2: Authentication (The Gatekeeper)
**Objective:** Allow users and authors to sign up and log in.
- [ ] **NextAuth Setup**: Configure `src/lib/auth.ts` with Credentials provider.
- [ ] **Registration API**: Implement `POST /api/register` to create new users.
- [ ] **Login Page**: Create a custom login/register page matching the AfriReads design.
- [ ] **Protected Routes**: Secure the Author Dashboard so only logged-in authors can access it.

### Phase 3: Book Management (The Core Content)
**Objective:** Enable real book uploads and listing.
- [ ] **Upload API**: Implement `POST /api/books/upload` to handle file uploads to Cloudflare R2.
- [ ] **Book Creation**: Connect the "Upload New Book" form to the backend.
- [ ] **Real Data Fetching**: Update the Books Catalog (`/books`) to fetch real data from the database instead of mock arrays.

### Phase 4: Book Detail & Reading (The Experience)
**Objective:** Allow users to view and "read" a book.
- [ ] **Book Detail Page**: Build `src/app/books/[id]/page.tsx` to show real book details.
- [ ] **PDF Viewer**: Implement the secure PDF viewer using `react-pdf` or PDF.js.
- [ ] **Access Control**: Ensure only purchased books (or free previews) can be opened.

---

## 🛠️ Technical Tasks Breakdown

### 1. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Create D1 Database (if not exists)
npx wrangler d1 create afrireads-db

# Apply Migrations
npx wrangler d1 execute afrireads-db --local --file=./prisma/migrations/init/migration.sql
```

### 2. Authentication
- Install `bcryptjs` for password hashing.
- Create `src/app/login/page.tsx` and `src/app/register/page.tsx`.
- Configure NextAuth session strategy (JWT).

### 3. API Development
- Create `src/app/api/books/route.ts` (GET, POST).
- Create `src/lib/r2.ts` helper for R2 interactions.

---

## 🚀 Expected Outcome by End of Session
1.  A functional **Login/Register** flow.
2.  A working **Database** storing users and books.
3.  The **Books Catalog** displaying real data from the database.
4.  Ability to **Upload a Book** (file to R2, metadata to D1).
