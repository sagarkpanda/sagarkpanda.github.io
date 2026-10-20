import type { PageServerLoad } from './$types';
import { blogs } from '$lib/content';
export const prerender = true;
export const load: PageServerLoad = () => {
  type ArchivePost = { slug: string; route: string; data: (typeof blogs)[number]['data'] };
  const grouped = new Map<string, Map<string, ArchivePost[]>>();
  for (const post of blogs) {
    const date = new Date(String(post.data.date ?? ''));
    if (Number.isNaN(date.getTime())) continue;
    const year = String(date.getFullYear());
    const month = date.toLocaleString('en-US', { month: 'long' });
    if (!grouped.has(year)) grouped.set(year, new Map());
    const months = grouped.get(year)!;
    if (!months.has(month)) months.set(month, []);
    months.get(month)!.push({ slug: post.slug, route: post.route, data: post.data });
  }
  const archives = [...grouped.entries()].sort(([a],[b]) => b.localeCompare(a)).map(([year, months]) => ({ year, months: [...months.entries()].map(([month, posts]) => ({ month, posts })) }));
  return { archives };
};
