import { getBlogPostIds } from '@/lib/build/static-params';

export async function generateStaticParams() {
  const ids = await getBlogPostIds();
  return ids.map((id) => ({ id }));
}

export const dynamicParams = false;

export default function EditBlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}