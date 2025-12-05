import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSlug, generateUniqueSlug } from '@/lib/blog-utils';

// GET /api/blog/posts - List blog posts with pagination and filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const authorId = searchParams.get('authorId');
        const published = searchParams.get('published');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (authorId) {
            where.authorId = authorId;
        }

        if (published === 'true') {
            where.isPublished = true;
        } else if (published === 'false') {
            where.isPublished = false;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Fetch posts
        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            profileImage: true,
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.blogPost.count({ where }),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
        );
    }
}

// POST /api/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, content, excerpt, coverImage, isPublished, authorId } = body;

        // Validate required fields
        if (!title || !content || !authorId) {
            return NextResponse.json(
                { error: 'Title, content, and authorId are required' },
                { status: 400 }
            );
        }

        // Generate unique slug
        const existingSlugs = await prisma.blogPost.findMany({
            select: { slug: true },
        });
        const slug = generateUniqueSlug(
            title,
            existingSlugs.map((p) => p.slug)
        );

        // Create blog post
        const blogPost = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage,
                isPublished: isPublished || false,
                publishedAt: isPublished ? new Date() : null,
                authorId,
            },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(blogPost, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json(
            { error: 'Failed to create blog post' },
            { status: 500 }
        );
    }
}
