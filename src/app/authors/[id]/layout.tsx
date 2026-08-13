import { getAuthorIds } from '@/lib/build/static-params';

export async function generateStaticParams() {
  const ids = await getAuthorIds();
  return ids.map((id) => ({ id }));
}

export const dynamicParams = false;

export default function AuthorDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}