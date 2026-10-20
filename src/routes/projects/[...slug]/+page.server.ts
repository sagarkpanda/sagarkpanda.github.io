import type { PageServerLoad } from './$types';
import { projects } from '$lib/content';
import { error } from '@sveltejs/kit';
export const prerender = true;
export function entries() { return projects.map((project) => ({ slug: project.slug })); }
export const load: PageServerLoad = ({ params }) => {
  const slug = params.slug.replace(/^\/+|\/+$/g, '');
  const project = projects.find((item) => item.slug === slug);
  if (!project) error(404, 'Project not found');
  return { project };
};
