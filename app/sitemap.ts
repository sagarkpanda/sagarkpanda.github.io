import type { MetadataRoute } from "next";
import { getAllTags, getCollection } from "@/lib/content";

const SITE_URL = "https://sagarpanda.com";
const PAGE_SIZE = 6;

export const dynamic = "force-static";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSeriesNames(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string"
    );
  }

  return [];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getCollection("blogs");

  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / PAGE_SIZE)
  );

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
    },
    {
      url: `${SITE_URL}/blogs/`,
    },
    {
      url: `${SITE_URL}/tags/`,
    },
    {
      url: `${SITE_URL}/series/`,
    },
    {
      url: `${SITE_URL}/categories/`,
    },
    {
      url: `${SITE_URL}/archives/`,
    },
    {
      url: `${SITE_URL}/contact/`,
    },
  ];

  // Blog pagination pages
  for (let page = 2; page <= totalPages; page++) {
    urls.push({
      url: `${SITE_URL}/blogs/page/${page}/`,
    });
  }

  // Individual blog posts
  for (const post of posts) {
    urls.push({
      url: `${SITE_URL}/blogs/${post.slug}/`,
      lastModified: post.data.date
        ? new Date(String(post.data.date))
        : undefined,
    });
  }

  // Tags
  const tags = getAllTags();

  for (const [slug] of tags) {
    urls.push({
      url: `${SITE_URL}/tags/${slug}/`,
    });
  }

  // Categories
  const categories = new Set<string>();

  for (const post of posts) {
    for (const category of post.data.categories ?? []) {
      const slug = slugify(category);

      if (slug) {
        categories.add(slug);
      }
    }
  }

  for (const slug of categories) {
    urls.push({
      url: `${SITE_URL}/categories/${slug}/`,
    });
  }

  // Series
  const series = new Set<string>();

  for (const post of posts) {
    for (const name of getSeriesNames(post.data.series)) {
      const slug = slugify(name);

      if (slug) {
        series.add(slug);
      }
    }
  }

  for (const slug of series) {
    urls.push({
      url: `${SITE_URL}/series/${slug}/`,
    });
  }

  return urls;
}