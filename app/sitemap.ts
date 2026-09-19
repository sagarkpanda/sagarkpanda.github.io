import type { MetadataRoute } from "next";
import { getCollection } from "@/lib/content";

const SITE_URL = "https://sagarpanda.com";
const PAGE_SIZE = 6;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getCollection("blogs");

  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / PAGE_SIZE)
  );

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/blogs/`,
      lastModified: new Date(),
    },
  ];

  // Blog pagination pages
  for (let page = 2; page <= totalPages; page++) {
    urls.push({
      url: `${SITE_URL}/blogs/page/${page}/`,
      lastModified: new Date(),
    });
  }

  // Individual blog posts
  for (const post of posts) {
    urls.push({
      url: `${SITE_URL}/blogs/${post.slug}/`,
      lastModified: post.data.date
        ? new Date(String(post.data.date))
        : new Date(),
    });
  }

  return urls;
}