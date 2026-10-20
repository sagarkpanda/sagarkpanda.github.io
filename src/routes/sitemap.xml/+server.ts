
import {
  blogs,
  projects,
  getTags,
  getCategories,
  normalizeCategorySlug
} from '$lib/content';

export const prerender = true;
export const trailingSlash = 'never';

const SITE_URL = 'https://sagarpanda.com';
const PAGE_SIZE = 6;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (normalized === '/') return '/';

  return normalized.replace(/\/+$/, '');
}

function getSeriesNames(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [];
}

export function GET() {
  const totalPages = Math.max(
    1,
    Math.ceil(blogs.length / PAGE_SIZE)
  );

  const paths = [
    '/',
    '/about/',
    '/contact/',
    '/blogs/',
    '/projects/',
    '/search/',
    '/tags/',
    '/series/',
    '/categories/',
    '/archives/',
    '/blogs/index.xml',
    ...Array.from(
      { length: totalPages - 1 },
      (_, i) => `/blogs/page/${i + 2}/`
    ),
    ...blogs.map((post) => post.route),
    ...projects.map((project) => project.route),
    ...getTags().map((tag) => `/tags/${tag.slug}/`),
    ...getCategories().map(
      (category) => `/categories/${category.slug}/`
    ),
    ...[
      ...new Set(
        blogs.flatMap((post) => getSeriesNames(post.data.series))
      )
    ].map((name) => `/series/${normalizeCategorySlug(name)}/`)
  ];

  const urls = [...new Set(paths.map(normalizePath))];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((path) => {
    const post = blogs.find(
      (item) => normalizePath(item.route) === path
    );

    const lastModified = post?.data.date
      ? new Date(String(post.data.date))
      : undefined;

    const lastmod =
      lastModified && !Number.isNaN(lastModified.getTime())
        ? `\n    <lastmod>${lastModified.toISOString()}</lastmod>`
        : '';

    return `  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${lastmod}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
