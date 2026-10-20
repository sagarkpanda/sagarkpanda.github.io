import type { PageServerLoad } from './$types';
import { blogs, getSeriesNames, normalizeCategorySlug, toPostCardItem } from '$lib/content';
import { error } from '@sveltejs/kit';
export const prerender = true;
export function entries() {
  const slugs = blogs.flatMap((post) => getSeriesNames(post.data.series)).map(normalizeCategorySlug);
  return [...new Set(slugs)].filter(Boolean).map((series) => ({ series }));
}
export const load: PageServerLoad = ({ params }) => {
  const slug = normalizeCategorySlug(params.series);
  const posts = blogs.filter((post) => getSeriesNames(post.data.series).some((name) => normalizeCategorySlug(name) === slug))
    .sort((a, b) => (Number(a.data.series_order) || Number.MAX_SAFE_INTEGER) - (Number(b.data.series_order) || Number.MAX_SAFE_INTEGER));
  if (!posts.length) error(404, 'Series not found');
  const series = getSeriesNames(posts[0].data.series).find((name) => normalizeCategorySlug(name) === slug) ?? params.series;
  return { series, slug, posts: posts.map(toPostCardItem) };
};
