const API_BASE =
  process.env.NEXT_PUBLIC_WORKER_URL ||
  'https://kalenjin-books-worker.pngobiro.workers.dev';

async function fetchIds(path: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const json: unknown = await res.json().catch(() => null);
  const body = json as { data?: unknown } | null;
  const raw = body?.data;
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { posts?: unknown[] } | null)?.posts)
      ? (raw as { posts: unknown[] }).posts
      : [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => String((item as { id?: unknown }).id))
    .filter((id): id is string => Boolean(id));
}

export async function getBookIds(): Promise<string[]> {
  return fetchIds('/api/books?limit=1000');
}

export async function getAuthorIds(): Promise<string[]> {
  return fetchIds('/api/authors?limit=1000');
}

export async function getBlogPostIds(): Promise<string[]> {
  return fetchIds('/api/blog/posts?limit=1000');
}