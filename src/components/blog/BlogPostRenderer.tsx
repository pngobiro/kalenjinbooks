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
            className="prose prose-lg max-w-none
        prose-headings:text-neutral-brown-900 prose-headings:font-bold
        prose-h1:text-4xl prose-h1:mb-4
        prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
        prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
        prose-p:text-neutral-brown-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-neutral-brown-900 prose-strong:font-semibold
        prose-code:bg-neutral-cream prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-neutral-brown-900 prose-pre:text-neutral-cream
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-neutral-brown-700
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
        prose-li:text-neutral-brown-700 prose-li:mb-1
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-hr:border-neutral-brown-500/20 prose-hr:my-8"
        />
    );
}
