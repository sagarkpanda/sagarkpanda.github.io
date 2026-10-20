import type { PageServerLoad } from './$types';
import { getCategories, getPostsByCategory } from '$lib/content';
export const prerender = true;
export const load: PageServerLoad = () => ({ categories: getCategories().map((item) => ({ ...item, count: getPostsByCategory(item.slug).length })).sort((a,b) => a.name.localeCompare(b.name)) });
