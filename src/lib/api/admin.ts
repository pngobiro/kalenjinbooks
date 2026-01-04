import { getApiBaseUrl, fetchWithRetry } from './books';

export interface PendingAuthor {
    id: string;
    userId: string;
    email: string;
    name: string | null;
    image?: string;
    createdAt: string;
}

export async function getPendingAuthors(): Promise<{ authors: PendingAuthor[] }> {
    const baseUrl = getApiBaseUrl();
    const token = typeof window !== 'undefined' ? localStorage.getItem('kaleereads_token') : null;

    const response = await fetchWithRetry(`${baseUrl}/api/admin/authors/pending`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pending authors');
    }

    const json = await response.json();
    return json.data;
}

export async function approveAuthor(authorId: string): Promise<void> {
    const baseUrl = getApiBaseUrl();
    const token = typeof window !== 'undefined' ? localStorage.getItem('kaleereads_token') : null;

    const response = await fetchWithRetry(`${baseUrl}/api/admin/authors/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ authorId })
    });

    if (!response.ok) {
        throw new Error('Failed to approve author');
    }
}

export async function rejectAuthor(authorId: string): Promise<void> {
    const baseUrl = getApiBaseUrl();
    const token = typeof window !== 'undefined' ? localStorage.getItem('kaleereads_token') : null;

    const response = await fetchWithRetry(`${baseUrl}/api/admin/authors/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ authorId })
    });

    if (!response.ok) {
        throw new Error('Failed to reject author');
    }
}
