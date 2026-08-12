'use client';

import Link from 'next/link';
import { Clock, Eye, User } from 'lucide-react';
import { formatBlogDate } from '@/lib/blog-utils';
import VideoThumbnail from '@/components/blog/VideoThumbnail';

interface BlogCardProps {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    coverType?: string;
    coverVideoUrl?: string;
    author: {
        name: string;
        profileImage?: string;
    };
    publishedAt: Date | string;
    viewCount: number;
    readTime: number;
}

export default function BlogCard({
    id,
    slug,
    title,
    excerpt,
    coverImage,
    coverType,
    coverVideoUrl,
    author,
    publishedAt,
    viewCount,
    readTime,
}: BlogCardProps) {
    const href = slug ? `/blogs/${slug}` : `/blogs/${id}`;
    const isVideo = coverType === 'video' && coverVideoUrl;

    return (
        <Link href={href}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                {/* Cover Media */}
                <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary/20 to-accent-green/20 overflow-hidden">
                    {isVideo ? (
                        <VideoThumbnail
                            videoUrl={coverVideoUrl!}
                            title={title}
                            showLabel
                        />
                    ) : coverImage ? (
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl text-primary/40 font-heading font-bold">K</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="font-heading font-bold text-xl text-neutral-brown-900 line-clamp-2 mb-2 hover:text-primary transition-colors">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-neutral-brown-700 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-brown-500/10">
                        {/* Author */}
                        <div className="flex items-center gap-2 min-w-0">
                            {author.profileImage ? (
                                <img
                                    src={author.profileImage}
                                    alt={author.name}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <User size={16} className="text-primary" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-neutral-brown-900 truncate">
                                {author.name}
                            </span>
                        </div>

                        {/* Date */}
                        <span className="text-xs text-neutral-brown-500">
                            {formatBlogDate(publishedAt)}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-neutral-brown-700 mt-3">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{viewCount} views</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}