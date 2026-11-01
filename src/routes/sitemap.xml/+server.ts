export const trailingSlash = 'never';
import { blogs, projects, getTags, getCategories, normalizeCategorySlug } from '$lib/content';
const PAGE_SIZE = 6;
const SITE = 'https://sagarpanda.com';
export const prerender = true;
export function GET() {
  const pageCount = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const series = [...new Set(blogs.flatMap(p => typeof p.data.series === 'string' ? [p.data.series] : Array.isArray(p.data.series) ? p.data.series.map(String) : []))];
  const paths = [ '/', '/about/', '/blogs/', '/projects/', '/search/', '/tags/', '/categories/', '/series/', '/contact/', '/archives/', '/blogs/index.xml', ...Array.from({length: pageCount - 1}, (_, i) => `/blogs/page/${i + 2}/`), ...blogs.map(p => p.route), ...projects.map(p => p.route), ...getTags().map(t => `/tags/${t.slug}/`), ...getCategories().map(c => `/categories/${c.slug}/`), ...series.map(s => `/series/${normalizeCategorySlug(s)}/`) ];
  const unique = [...new Set(paths)];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${unique.map(path => `<url><loc>${SITE}${path}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
