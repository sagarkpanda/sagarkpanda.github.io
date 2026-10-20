
import type { PageLoad } from './$types';
import { projects } from '$lib/content';

export const prerender = true;

export function entries() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const load: PageLoad = ({ params }) => {
  const slug = params.slug.replace(/^\/+|\/+$/g, '');
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`Project not found: ${slug}`);
  }

  return { project };
};