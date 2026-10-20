import type { PageServerLoad } from './$types';
import { blogs, projects, toPostCardItem, toProjectCardItem } from '$lib/content';
export const prerender = true;
export const load: PageServerLoad = () => ({ latestPosts: blogs.slice(0, 5).map(toPostCardItem), projects: projects.map(toProjectCardItem) });
