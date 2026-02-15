import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'https://kalenjin-books-worker.pngobiro.workers.dev';
        
        const response = await fetch(`${workerUrl}/api/blog/posts/${id}`);
        
        if (!response.ok) {
            return NextResponse.json(
                { error: 'Blog post not found' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
