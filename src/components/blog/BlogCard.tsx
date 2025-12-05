'use client';

import Link from 'next/link';
import { Clock, Eye, User } from 'lucide-react';
import { formatBlogDate } from '@/lib/blog-utils';

interface BlogCardProps {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
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
    title,
    excerpt,
    coverImage,
    author,
    publishedAt,
    viewCount,
    readTime,
}: BlogCardProps) {
    return (
        <Link href={`/blogs/${id}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                {/* Cover Image */}
                {coverImage ? (
                    <div className="relative w-full aspect-[16/9] bg-neutral-cream">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
                        <span className="text-4xl text-primary/40">📝</span>
                    </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="font-bold text-xl text-neutral-brown-900 line-clamp-2 mb-2 hover:text-primary transition-colors">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-neutral-brown-700 text-sm line-clamp-3 mb-4 flex-1">
                        {excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-brown-500/10">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            {author.profileImage ? (
                                <img
                                    src={author.profileImage}
                                    alt={author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={16} className="text-primary" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-neutral-brown-900">
                                {author.name}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-neutral-brown-700">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{readTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye size={14} />
                                <span>{viewCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-neutral-brown-700 mt-2">
                        {formatBlogDate(publishedAt)}
                    </div>
                </div>
            </div>
        </Link>
    );
}
