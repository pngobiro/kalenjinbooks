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
