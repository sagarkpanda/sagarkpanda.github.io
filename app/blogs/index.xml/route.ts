import { getCollection } from "@/lib/content";
export const dynamic = "force-static";

const SITE_URL = "https://sagarpanda.com";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getCollection("blogs");

  const items = posts
    .map((post) => {
      const title = escapeXml(String(post.data.title));
      const description = escapeXml(
        String(
          post.data.summary ||
            post.data.description ||
            ""
        )
      );

      const url = `${SITE_URL}${post.route}`;

      const date = new Date(
        String(post.data.date)
      ).toUTCString();

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const latestDate = posts[0]?.data.date
    ? new Date(String(posts[0].data.date)).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Sagar Panda | DevOps &amp; Cloud Engineer</title>
    <link>${SITE_URL}/blogs/</link>
    <description>Technical notes and hands-on guides covering DevOps, AWS, Kubernetes, Terraform, CI/CD, observability, and security.</description>
    <language>en</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link
      href="${SITE_URL}/blogs/index.xml"
      rel="self"
      type="application/rss+xml"
      xmlns:atom="http://www.w3.org/2005/Atom"
    />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}