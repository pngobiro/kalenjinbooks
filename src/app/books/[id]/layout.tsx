import { getBookIds } from '@/lib/build/static-params';

export async function generateStaticParams() {
  const ids = await getBookIds();
  return ids.map((id) => ({ id }));
}

export const dynamicParams = false;

export default function BookDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}