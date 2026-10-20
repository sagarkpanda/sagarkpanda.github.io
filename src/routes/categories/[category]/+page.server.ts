import type { PageServerLoad } from './$types';
import { getCategories, getPostsByCategory, normalizeCategorySlug, toPostCardItem } from '$lib/content';
import { error } from '@sveltejs/kit';
export const prerender = true;
export function entries() {
  return getCategories().map((item) => item.slug).filter(Boolean).map((category) => ({ category }));
}
export const load: PageServerLoad = ({ params }) => {
  const slug = normalizeCategorySlug(params.category);
  const posts = getPostsByCategory(slug);
  if (!posts.length) error(404, 'Category not found');
  const category = getCategories().find((item) => item.slug === slug)?.name ?? params.category;
  return { category, slug, posts: posts.map(toPostCardItem) };
};
