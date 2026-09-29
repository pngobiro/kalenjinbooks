'use client';

import { useEffect, useRef } from 'react';
import { sanitizeHtml } from '@/lib/blog-utils';

interface BlogPostRendererProps {
    content: string;
}

export default function BlogPostRenderer({ content }: BlogPostRendererProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Sanitize and set content
        if (contentRef.current) {
            contentRef.current.innerHTML = sanitizeHtml(content);
        }
    }, [content]);

    return (
        <div
            ref={contentRef}
            /* Long-form reading defaults: a comfortable measure, generous
               leading, and headings set in the display face. Colours come from
               the brand tokens rather than the old neutral-brown ramp. */
            className="prose max-w-none
        prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#2C2416]
        prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2
        prose-p:text-[#5B4F42] prose-p:text-[1.0625rem] prose-p:leading-[1.75] prose-p:mb-6
        prose-a:text-[#B4502A] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#2C2416] prose-strong:font-semibold
        prose-em:text-[#5B4F42]
        prose-code:bg-[#F5F1E8] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#2C2416]
        prose-pre:bg-[#2C2416] prose-pre:text-[#FFFCF5] prose-pre:rounded-lg
        prose-blockquote:border-l-4 prose-blockquote:border-[#B4502A] prose-blockquote:pl-5
        prose-blockquote:not-italic prose-blockquote:text-[#5B4F42]
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
        prose-li:text-[#5B4F42] prose-li:mb-2 prose-li:leading-[1.7]
        prose-img:rounded-lg prose-img:my-8
        prose-hr:border-[#E4D9C4] prose-hr:my-10"
        />
    );
}