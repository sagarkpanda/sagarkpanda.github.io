import type { PageServerLoad } from './$types';
import { getTags, getPostsByTag } from '$lib/content';
export const prerender = true;
export const load: PageServerLoad = () => ({ tags: getTags().map((tag) => ({ ...tag, count: getPostsByTag(tag.slug).length })).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name)) });
