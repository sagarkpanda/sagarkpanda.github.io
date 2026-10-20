import type { PageServerLoad } from './$types';
import { projects, toProjectCardItem } from '$lib/content';
export const prerender = true;
export const load: PageServerLoad = () => ({ projects: projects.map(toProjectCardItem) });
