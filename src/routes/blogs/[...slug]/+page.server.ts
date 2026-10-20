import type { PageServerLoad } from './$types';
import { blogs } from '$lib/content';
import { error } from '@sveltejs/kit';
export const prerender = true;
export function entries() { return blogs.map((post) => ({ slug: post.slug })); }
export const load: PageServerLoad = ({ params }) => {
  const slug = params.slug.replace(/^\/+|\/+$/g, '');
  const post = blogs.find((item) => item.slug === slug);
  if (!post) error(404, 'Post not found');
  const tags = new Set((post.data.tags ?? []).map((tag) => String(tag).toLowerCase()));
  const categories = new Set((post.data.categories ?? []).map((category) => String(category).toLowerCase()));
  const related = blogs.filter((item) => item.route !== post.route).map((item) => {
    const tagScore = (item.data.tags ?? []).filter((tag) => tags.has(String(tag).toLowerCase())).length;
    const categoryScore = (item.data.categories ?? []).filter((category) => categories.has(String(category).toLowerCase())).length;
    return { item, score: tagScore * 3 + categoryScore * 2 };
  }).filter((result) => result.score > 0).sort((a,b) => b.score - a.score || String(b.item.data.date ?? '').localeCompare(String(a.item.data.date ?? ''))).slice(0,3).map((result) => result.item);
  type BlogItem = (typeof blogs)[number];
  const meta = (item: BlogItem) => ({ slug: item.slug, route: item.route, data: item.data });
  return { post, related: related.map(meta), allPosts: blogs.map(meta) };
};
