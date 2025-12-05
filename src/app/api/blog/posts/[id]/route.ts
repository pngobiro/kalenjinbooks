import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog/posts/[id] - Get single blog post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const blogPost = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                images: true,
            },
        });

        if (!blogPost) {
            return NextResponse.json(
                { error: 'Blog post not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await prisma.blogPost.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json(blogPost);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog post' },
            { status: 500 }
        );
    }
}

// PUT /api/blog/posts/[id] - Update blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { title, content, excerpt, coverImage, isPublished } = body;

        // Check if blog post exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: 'Blog post not found' },
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (coverImage !== undefined) updateData.coverImage = coverImage;

        if (isPublished !== undefined) {
            updateData.isPublished = isPublished;
            // Set publishedAt if publishing for the first time
            if (isPublished && !existingPost.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        // Update blog post
        const blogPost = await prisma.blogPost.update({
            where: { id },
            data: updateData,
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

        return NextResponse.json(blogPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json(
            { error: 'Failed to update blog post' },
            { status: 500 }
        );
    }
}

// DELETE /api/blog/posts/[id] - Delete blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Check if blog post exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: 'Blog post not found' },
                { status: 404 }
            );
        }

        // TODO: Delete associated images from R2
        // This would require importing the R2 client and deleting each image
        // For now, we'll just delete the database records

        // Delete blog post (cascade will delete images)
        await prisma.blogPost.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog post' },
            { status: 500 }
        );
    }
}
