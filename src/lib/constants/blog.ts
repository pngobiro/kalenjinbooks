export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Posts' },
  { id: 'Culture', label: 'Culture' },
  { id: 'Stories', label: 'Stories' },
  { id: 'News', label: 'News' },
  { id: 'Guides', label: 'Guides' },
  { id: 'History', label: 'History' },
  { id: 'Poetry', label: 'Poetry' },
] as const;

export type BlogCategoryId = typeof BLOG_CATEGORIES[number]['id'];

export const BLOG_CATEGORY_IDS = BLOG_CATEGORIES
  .filter(c => c.id !== 'all')
  .map(c => c.id);
