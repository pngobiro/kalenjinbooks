import slugify from 'slugify';
import readingTime from 'reading-time';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
    return slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
    });
}

/**
 * Calculate estimated reading time from HTML content
 */
export function calculateReadTime(content: string): { text: string; minutes: number } {
    // Strip HTML tags for word count
    const plainText = content.replace(/<[^>]*>/g, '');
    const stats = readingTime(plainText);

    return {
        text: stats.text,
        minutes: Math.ceil(stats.minutes),
    };
}

/**
 * Extract a plain text excerpt from HTML content
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>/g, ' ');

    // Remove extra whitespace
    const cleaned = plainText.replace(/\s+/g, ' ').trim();

    // Truncate to maxLength
    if (cleaned.length <= maxLength) {
        return cleaned;
    }

    // Find the last complete word within maxLength
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return truncated.substring(0, lastSpace) + '...';
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'iframe', 'div', 'span'
        ],
        ALLOWED_ATTR: [
            'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
            'class', 'id', 'frameborder', 'allowfullscreen', 'allow'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
}

/**
 * Format a date for blog post display
 */
export function formatBlogDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 */
export function generateUniqueSlug(title: string, existingSlugs: string[]): string {
    const baseSlug = generateSlug(title);

    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
    }

    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;

    while (existingSlugs.includes(uniqueSlug)) {
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
}
