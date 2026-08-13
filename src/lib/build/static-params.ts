import { request as httpsRequest } from 'node:https';

const API_BASE =
  process.env.NEXT_PUBLIC_WORKER_URL ||
  'https://kalenjin-books-worker.pngobiro.workers.dev';

function httpsGetJson(urlString: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = httpsRequest(
      {
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        headers: { Accept: 'application/json' },
        family: 4,
        timeout: 20000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      }
    );
    req.on('timeout', () => {
      req.destroy(new Error('request timed out'));
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchItems(path: string, param: 'id' | 'slug'): Promise<string[]> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const json = await httpsGetJson(`${API_BASE}${path}`);
      const body = json as { data?: unknown } | null;
      const raw = body?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { posts?: unknown[] } | null)?.posts)
          ? (raw as { posts: unknown[] }).posts
          : [];
      if (!Array.isArray(list)) return [];
      return list
        .map((item) => {
          const id = String((item as { id?: unknown }).id ?? '');
          const slug = String((item as { slug?: unknown }).slug ?? '');
          return param === 'slug' ? slug || id : id;
        })
        .filter((value): value is string => Boolean(value));
    } catch (err) {
      lastErr = err;
      if (attempt < 4) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }
  console.error(`[static-params] failed to fetch ${path}:`, lastErr);
  return [];
}

export async function getBookIds(): Promise<string[]> {
  return fetchItems('/api/books?limit=1000', 'id');
}

export async function getAuthorIds(): Promise<string[]> {
  return fetchItems('/api/authors?limit=1000', 'id');
}

export async function getBlogPostIds(): Promise<string[]> {
  return fetchItems('/api/blog/posts?limit=1000', 'slug');
}
