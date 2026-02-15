import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const authorId = searchParams.get('authorId');
        const published = searchParams.get('published') === 'true';
        const limit = parseInt(searchParams.get('limit') || '10');

        const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'https://kalenjin-books-worker.pngobiro.workers.dev';
        
        let url = `${workerUrl}/api/blog/posts?limit=${limit}`;
        if (authorId) url += `&authorId=${authorId}`;
        if (published) url += `&published=true`;

        const response = await fetch(url);
        
        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch blog posts' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
