export const trailingSlash = 'never';
export const prerender = true;
export function GET() { return new Response('User-Agent: *\nAllow: /\nSitemap: https://sagarpanda.com/sitemap.xml\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
