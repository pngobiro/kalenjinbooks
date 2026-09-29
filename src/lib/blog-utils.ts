import slugify from 'slugify';
import DOMPurify from 'dompurify';

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
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.round(words / 200));

    return {
        text: `${minutes} min read`,
        minutes,
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
 * Convert legacy video placeholders into real, playable iframes.
 *
 * Older posts store embeds as `<div class="video-embed" data-url="...">`.
 * `data-url` is not in the sanitizer's allow-list, so the attribute was
 * stripped and the div rendered empty — the video silently disappeared.
 * Rewriting to a proper iframe also means every player gets the
 * youtube-nocookie domain and the referrer policy the rest of the site uses.
 */
function normalizeVideoEmbeds(html: string): string {
    return html.replace(
        /<div[^>]*class=["'][^"']*video-embed[^"']*["'][^>]*data-url=["']([^"']+)["'][^>]*>\s*<\/div>/gi,
        (_match, url: string) => {
            const embedUrl = getYouTubeEmbedUrl(url);
            // Non-YouTube sources get a link-out rather than a blank frame.
            if (!embedUrl) {
                return `<p><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer nofollow">Watch this video</a></p>`;
            }
            return (
                `<div class="video-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0">` +
                `<iframe src="${escapeAttr(embedUrl)}" title="Embedded video" ` +
                `style="position:absolute;inset:0;width:100%;height:100%;border:0" ` +
                `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ` +
                `referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`
            );
        }
    );
}

function escapeAttr(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(normalizeVideoEmbeds(html), {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'iframe', 'div', 'span'
        ],
        ALLOWED_ATTR: [
            'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
            'class', 'id', 'style', 'frameborder', 'allowfullscreen', 'allow',
            'referrerpolicy', 'loading', 'data-youtube-video'
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

/**
 * Convert a YouTube URL to an embeddable format.
 * Returns an empty string when the URL is not a recognisable YouTube video,
 * so callers can fall back to a normal link instead of putting a foreign URL
 * into an <iframe> (which renders a permanently blank frame).
 */
export function getYouTubeEmbedUrl(url: string): string {
    const id = getYouTubeId(url);
    if (id) {
        return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    return '';
}

/**
 * True when the URL points at a YouTube video we can embed.
 */
export function isYouTubeUrl(url: string): boolean {
    return getYouTubeId(url) !== null;
}

/**
 * Extract the YouTube video ID from various URL formats.
 * Handles watch?v=, youtu.be/, shorts/, embed/, live/, mobile hosts, extra
 * query params before or after v=, timestamp suffixes, and bare 11-char IDs.
 */
export function getYouTubeId(url: string): string | null {
    if (!url) return null;
    const trimmed = url.trim();

    // Bare 11-character ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    // youtu.be/<id>
    const short = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (short) return short[1];

    // Path-style embeds: /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
    const path = trimmed.match(/youtube(?:-nocookie)?\.com\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
    if (path) return path[1];

    // watch?v=<id> — read the query string so extra params (e.g. ?app=desktop&v=)
    // and trailing values (e.g. &t=30s) are handled in any order.
    try {
        const parsed = new URL(trimmed);
        if (/(^|\.)youtube(-nocookie)?\.com$/.test(parsed.hostname)) {
            const v = parsed.searchParams.get('v');
            if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
        }
    } catch {
        // Not a parseable absolute URL; fall through to the loose pattern below.
    }

    // Last resort: find v=<id> anywhere in the string.
    const loose = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    return loose ? loose[1] : null;
}

/**
 * Get a YouTube video thumbnail image URL
 * Returns a high-quality thumbnail if available
 */
export function getYouTubeThumbnail(url: string): string {
    const id = getYouTubeId(url);
    if (id) {
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    return url;
}