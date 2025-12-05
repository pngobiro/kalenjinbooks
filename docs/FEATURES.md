# Feature Documentation

## Hard Copy Requests

The Hard Copy Request feature allows users to order physical copies of books that are primarily digital. This is useful for users who prefer reading physical books or for gifting purposes.

### Workflow

1.  **Initiation**:
    - User navigates to a book detail page (e.g., `/books/4`).
    - User clicks the "Request Hard Copy" button.
    - User is redirected to `/request-hard-copy` with `book` and `id` URL parameters.

2.  **Request Form**:
    - The form pre-fills the book title from the URL parameter.
    - **Personal Information**:
        - Full Name (Required)
        - Email Address (Required)
        - Phone Number (Required)
    - **Shipping Address**:
        - Street Address (Required)
        - City/Town (Required)
        - County (Required)
        - Postal Code (Optional)
    - **Order Details**:
        - Quantity (1-50)
        - Additional Notes (Optional)

3.  **Submission**:
    - User submits the form.
    - System validates all required fields.
    - On success, a confirmation screen is shown.
    - *Future Integration*: Data will be sent to the backend API (`/api/request-hard-copy`) and stored in the database. An email notification will be sent to admins.

4.  **Post-Submission**:
    - User sees a "Request Received" success message.
    - User is guided on next steps (Review -> Quote -> Payment -> Shipping).
    - User can navigate back to the book page or home.

### Technical Implementation

- **Page**: `src/app/request-hard-copy/page.tsx`
- **State Management**: React `useState` for form fields and submission status.
- **URL Handling**: `useSearchParams` to retrieve book details.
- **Icons**: `lucide-react` (Package, MapPin, Phone, Mail, User, CheckCircle).

---

## Author Profiles

Author Profiles provide a dedicated space for authors to showcase their biography, statistics, and book collection.

### Workflow

1.  **Access**:
    - Users can access author profiles from the "Featured Authors" section on the home page or by clicking an author's name on a book detail page.
    - URL structure: `/authors/[id]` (e.g., `/authors/1`).

2.  **Profile Content**:
    - **Header**: Author's name, role (e.g., "Cultural Historian"), and profile image.
    - **Stats**: Total books published, average rating, and other metrics.
    - **Biography**: A detailed description of the author's background and work.
    - **Social Media**: Links to Twitter, Facebook, Instagram, LinkedIn (if available).
    - **Books Collection**: A grid of books written by the author.

3.  **Social Media Integration**:
    - Social links are stored in the author's data object.
    - Icons are conditionally rendered based on available links.
    - Links open in a new tab for better user experience.

### Technical Implementation

- **Page**: `src/app/authors/page.tsx` (List) and `src/app/authors/[id]/page.tsx` (Individual Profile - *To be implemented*).
- **Data Structure**:
    ```typescript
    interface Author {
      id: number;
      name: string;
      role: string;
      bio: string;
      booksCount: number;
      rating: number;
      image: string;
      social?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
      };
    }
    ```
---

## Author Blog Feature

The Blog Feature allows authors to create, manage, and publish blog posts with rich text content, images, and embedded media. This feature helps authors engage with readers, share insights, and build their audience.

### Workflow

1. **Creating a Blog Post**:
   - Author navigates to `/dashboard/author/blogs`
   - Clicks "New Blog Post" button
   - Fills in the blog post form:
     - Title (Required)
     - Cover Image (Optional, upload or URL)
     - Content (Rich text editor with formatting, images, YouTube embeds, links)
     - Excerpt (Optional, auto-generated if empty)
     - Publish/Draft toggle
   - Clicks "Save Blog Post"

2. **Managing Blog Posts**:
   - Dashboard shows all author's blog posts with stats (total, published, drafts, views)
   - Filter tabs: All, Published, Drafts
   - Search functionality for finding specific posts
   - Each post shows: cover image, title, status, views, published date
   - Actions: View, Edit, Delete

3. **Editing a Blog Post**:
   - Click "Edit" on any blog post
   - Modify title, content, cover image, excerpt, or publication status
   - Save changes or delete the post

4. **Public Viewing**:
   - Published posts appear at `/blogs`
   - Individual posts accessible at `/blogs/[id]`
   - Readers can search, filter by author, and sort by latest/most viewed
   - Each post displays: cover image, title, content, author info, metadata, social sharing

### Features

#### Rich Text Editor (Tiptap)
- **Text Formatting**: Bold, italic, strikethrough, code
- **Headings**: H1, H2, H3
- **Lists**: Bulleted and numbered lists
- **Blockquotes**: For emphasis and quotes
- **Images**: Upload images or insert via URL
- **Links**: Insert hyperlinks to external sites
- **YouTube Embeds**: Embed YouTube videos directly
- **Undo/Redo**: Full editing history
- **Character Count**: Track content length

#### Blog Management
- **Draft System**: Save posts as drafts before publishing
- **View Tracking**: Automatic view count increment
- **SEO-Friendly Slugs**: Auto-generated URL-friendly slugs
- **Cover Images**: Support for cover images with fallback
- **Excerpts**: Auto-generated or custom excerpts
- **Author Attribution**: Each post linked to author profile

#### Public Features
- **Blog Listing**: Grid view of all published posts
- **Search**: Search by title and excerpt
- **Author Filter**: Filter posts by specific author
- **Sorting**: Sort by latest or most viewed
- **Social Sharing**: Share on Twitter, Facebook, or copy link
- **Related Posts**: Show more posts from the same author
- **Responsive Design**: Mobile-friendly layout

### Technical Implementation

#### Pages
- `/dashboard/author/blogs` - Blog management dashboard
- `/dashboard/author/blogs/new` - Create new blog post
- `/dashboard/author/blogs/[id]/edit` - Edit existing blog post
- `/blogs` - Public blog listing
- `/blogs/[id]` - Individual blog post view

#### Components
- `RichTextEditor` - Tiptap-based rich text editor
- `BlogCard` - Blog post preview card
- `BlogPostRenderer` - Safe HTML content renderer
- `BlogStats` - Dashboard statistics display

#### API Endpoints
- `GET /api/blog/posts` - List posts with pagination/filtering
- `POST /api/blog/posts` - Create new post
- `GET /api/blog/posts/[id]` - Get single post
- `PUT /api/blog/posts/[id]` - Update post
- `DELETE /api/blog/posts/[id]` - Delete post
- `POST /api/blog/images` - Upload images to R2

#### Utilities (`src/lib/blog-utils.ts`)
- `generateSlug()` - Create URL-friendly slugs
- `generateUniqueSlug()` - Ensure slug uniqueness
- `calculateReadTime()` - Estimate reading time
- `extractExcerpt()` - Generate excerpt from HTML
- `sanitizeHtml()` - Prevent XSS attacks
- `formatBlogDate()` - Format dates for display

### Security

- **HTML Sanitization**: All blog content is sanitized using DOMPurify to prevent XSS attacks
- **Author-Specific Access**: Authors can only view/edit/delete their own blog posts
- **Image Validation**: File type and size validation for uploads (max 5MB, image types only)
- **Input Validation**: All API endpoints validate required fields

### Storage

- **Database**: Blog posts and metadata stored in Cloudflare D1 (SQLite)
- **Images**: Blog images stored in Cloudflare R2 object storage
- **Content**: HTML content stored in database with sanitization

### Future Enhancements

- Categories and tags for better organization
- Comments system for reader engagement
- RSS feed for blog subscribers
- Draft auto-save functionality
- Scheduled publishing
- Analytics dashboard
- SEO meta tags and structured data
- Email notifications for new posts
