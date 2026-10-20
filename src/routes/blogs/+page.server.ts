import type { PageServerLoad } from './$types';
import { blogs, toPostCardItem } from '$lib/content';
const PAGE_SIZE = 6;
export const prerender = true;
export const load: PageServerLoad = () => ({ posts: blogs.slice(0, PAGE_SIZE).map(toPostCardItem), totalPages: Math.max(1, Math.ceil(blogs.length / PAGE_SIZE)) });
