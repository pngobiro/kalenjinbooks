# API Documentation

## Overview

AfriReads provides a RESTful API for managing books, authors, purchases, and time-limited access. All API routes are located in `src/app/api/`.

## Authentication

Most endpoints require authentication via NextAuth.js session cookies.

```typescript
// Check authentication in API routes
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
if (!session) {
  return new Response('Unauthorized', { status: 401 });
}
```

## Endpoints

### Authentication

#### POST `/api/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "READER" // or "AUTHOR"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "READER"
  }
}
```

#### POST `/api/auth/signin`

Sign in (handled by NextAuth).

---

### Books

#### GET `/api/books`

Get all books with optional filtering.

**Query Parameters:**
- `search` - Search by title or description
- `category` - Filter by category
- `authorId` - Filter by author
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "Book Title",
      "description": "Book description",
      "coverImage": "images/cover.jpg",
      "price": 500,
      "category": "Fiction",
      "author": {
        "id": "uuid",
        "user": {
          "name": "Author Name"
        }
      }
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

#### GET `/api/books/[id]`

Get a specific book by ID.

**Response:**
```json
{
  "id": "uuid",
  "title": "Book Title",
  "description": "Full description",
  "coverImage": "images/cover.jpg",
  "fileKey": "books/uuid/book.pdf",
  "fileSize": 5242880,
  "fileType": "pdf",
  "price": 500,
  "previewPages": 10,
  "category": "Fiction",
  "language": "Kalenjin",
  "publishedAt": "2024-12-02T00:00:00Z",
  "author": {
    "id": "uuid",
    "bio": "Author bio",
    "user": {
      "name": "Author Name"
    }
  }
}
```

#### POST `/api/books`

Create a new book (Authors only).

**Request Body:**
```json
{
  "title": "New Book",
  "description": "Book description",
  "price": 500,
  "category": "Fiction",
  "previewPages": 10
}
```

**Response:**
```json
{
  "book": {
    "id": "uuid",
    "title": "New Book",
    "isPublished": false
  }
}
```

#### PUT `/api/books/[id]`

Update a book (Author only, own books).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 600,
  "isPublished": true
}
```

#### DELETE `/api/books/[id]`

Delete a book (Author only, own books).

---

### Book Upload

#### POST `/api/books/upload`

Upload a book file to Cloudflare R2.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` - PDF or EPUB file
- `bookId` - Book UUID

**Response:**
```json
{
  "fileKey": "books/uuid/filename.pdf",
  "fileSize": 5242880,
  "fileType": "application/pdf"
}
```

---

### Authors

#### GET `/api/authors`

Get all authors.

**Response:**
```json
{
  "authors": [
    {
      "id": "uuid",
      "bio": "Author biography",
      "profileImage": "images/profile.jpg",
      "totalEarnings": 15000,
      "user": {
        "name": "Author Name",
        "email": "author@example.com"
      },
      "_count": {
        "books": 5
      }
    }
  ]
}
```

#### GET `/api/authors/[id]`

Get a specific author with their books.

**Response:**
```json
{
  "id": "uuid",
  "bio": "Author biography",
  "profileImage": "images/profile.jpg",
  "totalEarnings": 15000,
  "user": {
    "name": "Author Name"
  },
  "books": [
    {
      "id": "uuid",
      "title": "Book Title",
      "price": 500
    }
  ]
}
```

---

### Purchases

#### POST `/api/checkout`

Create a Stripe checkout session for book purchase.

**Request Body:**
```json
{
  "bookId": "uuid"
}
```

**Response:**
```json
{
  "sessionId": "stripe_session_id",
  "url": "https://checkout.stripe.com/..."
}
```

#### GET `/api/purchases`

Get user's purchase history.

**Response:**
```json
{
  "purchases": [
    {
      "id": "uuid",
      "amount": 500,
      "status": "COMPLETED",
      "purchasedAt": "2024-12-02T00:00:00Z",
      "book": {
        "id": "uuid",
        "title": "Book Title"
      }
    }
  ]
}
```

---

### Time-Limited Access

#### POST `/api/access-links`

Generate a time-limited access link for a book.

**Request Body:**
```json
{
  "bookId": "uuid",
  "expiresInHours": 168
}
```

**Response:**
```json
{
  "token": "hex_token",
  "expiresAt": "2024-12-09T00:00:00Z",
  "url": "https://afrireads.com/read/hex_token"
}
```

#### GET `/api/access-links/[token]`

Validate an access token.

**Response:**
```json
{
  "valid": true,
  "book": {
    "id": "uuid",
    "title": "Book Title",
    "fileKey": "books/uuid/book.pdf"
  },
  "expiresAt": "2024-12-09T00:00:00Z",
  "remainingTime": {
    "hours": 24,
    "minutes": 30,
    "seconds": 15
  }
}
```

#### DELETE `/api/access-links/[token]`

Revoke an access token.

---

### Webhooks

#### POST `/api/webhooks/stripe`

Handle Stripe webhook events.

**Events Handled:**
- `checkout.session.completed` - Process successful payment
- `payment_intent.payment_failed` - Handle failed payment

**Headers Required:**
- `stripe-signature` - Webhook signature for verification

---

### Blog Posts

#### GET `/api/blog/posts`

List blog posts with pagination, filtering, and search.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `authorId` (string, optional): Filter by author ID
- `published` (boolean, optional): Filter by publication status
- `search` (string, optional): Search in title and excerpt

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Short summary...",
      "coverImage": "https://...",
      "isPublished": true,
      "publishedAt": "2024-12-05T10:00:00Z",
      "viewCount": 245,
      "author": {
        "id": "uuid",
        "profileImage": "https://...",
        "user": {
          "name": "Author Name"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### POST `/api/blog/posts`

Create a new blog post.

**Request Body:**
```json
{
  "title": "My Blog Post",
  "content": "<h2>Introduction</h2><p>Content...</p>",
  "excerpt": "Short summary",
  "coverImage": "https://...",
  "isPublished": true,
  "authorId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "content": "<h2>Introduction</h2><p>Content...</p>",
  "excerpt": "Short summary",
  "coverImage": "https://...",
  "isPublished": true,
  "publishedAt": "2024-12-05T10:00:00Z",
  "viewCount": 0,
  "authorId": "uuid",
  "createdAt": "2024-12-05T10:00:00Z",
  "updatedAt": "2024-12-05T10:00:00Z"
}
```

#### GET `/api/blog/posts/[id]`

Get a single blog post by ID. Automatically increments view count.

**Response:**
```json
{
  "id": "uuid",
  "title": "Blog Post Title",
  "slug": "blog-post-title",
  "content": "<h2>Introduction</h2><p>Full content...</p>",
  "excerpt": "Short summary",
  "coverImage": "https://...",
  "isPublished": true,
  "publishedAt": "2024-12-05T10:00:00Z",
  "viewCount": 246,
  "author": {
    "id": "uuid",
    "profileImage": "https://...",
    "bio": "Author bio...",
    "user": {
      "name": "Author Name"
    }
  },
  "createdAt": "2024-12-05T10:00:00Z",
  "updatedAt": "2024-12-05T10:00:00Z"
}
```

#### PUT `/api/blog/posts/[id]`

Update an existing blog post.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "<h2>Updated content</h2>",
  "excerpt": "Updated summary",
  "coverImage": "https://...",
  "isPublished": true
}
```

**Response:** Same as GET response with updated fields.

#### DELETE `/api/blog/posts/[id]`

Delete a blog post.

**Response:**
```json
{
  "message": "Blog post deleted successfully"
}
```

#### POST `/api/blog/images`

Upload an image for blog posts to Cloudflare R2.

**Request:** `multipart/form-form`
- `file`: Image file (max 5MB, jpg/jpeg/png/gif/webp)

**Response:**
```json
{
  "id": "uuid",
  "imageKey": "blog-images/uuid-filename.jpg",
  "url": "https://pub-xxx.r2.dev/blog-images/uuid-filename.jpg",
  "altText": null,
  "createdAt": "2024-12-05T10:00:00Z"
}
```

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited via Cloudflare:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## CORS

CORS is configured to allow requests from:
- Production domain
- Development localhost:3000
