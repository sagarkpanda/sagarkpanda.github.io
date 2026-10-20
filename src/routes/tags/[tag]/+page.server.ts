import type { PageServerLoad } from './$types';
import { blogs, getTags, getPostsByTag, normalizeTaxonomySlug, toPostCardItem } from '$lib/content';
import { error } from '@sveltejs/kit';
export const prerender = true;
export function entries() {
  const slugs = blogs.flatMap((post) => post.data.tags ?? []).map((tag) => normalizeTaxonomySlug(String(tag)));
  return [...new Set(slugs)].filter(Boolean).map((tag) => ({ tag }));
}
export const load: PageServerLoad = ({ params }) => {
  const slug = normalizeTaxonomySlug(params.tag);
  const posts = getPostsByTag(slug);
  if (!posts.length) error(404, 'Tag not found');
  const tag = getTags().find((item) => item.slug === slug);
  return { tag: tag?.name ?? params.tag, slug, posts: posts.map(toPostCardItem) };
};
