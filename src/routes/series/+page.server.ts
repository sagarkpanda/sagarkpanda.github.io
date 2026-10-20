import type { PageServerLoad } from './$types';
import { blogs, getSeriesNames, normalizeCategorySlug } from '$lib/content';
export const prerender = true;
export const load: PageServerLoad = () => {
  const map = new Map<string, { name: string; posts: typeof blogs }>();
  for (const post of blogs) for (const name of getSeriesNames(post.data.series)) {
    const slug = normalizeCategorySlug(name);
    if (!map.has(slug)) map.set(slug, { name, posts: [] });
    map.get(slug)!.posts.push(post);
  }
  const series = [...map.entries()].map(([slug, item]) => ({ slug, name: item.name, posts: [...item.posts].sort((a,b) => (Number(a.data.series_order) || Number.MAX_SAFE_INTEGER) - (Number(b.data.series_order) || Number.MAX_SAFE_INTEGER)).map((post) => ({ slug: post.slug, route: post.route, data: post.data })) })).sort((a,b) => a.name.localeCompare(b.name));
  return { series };
};
