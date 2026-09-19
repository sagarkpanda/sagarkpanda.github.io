import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ContentItem, Frontmatter } from "@/types/content";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function normalizeSlug(file: string, section: string) {
  const relative = path
    .relative(path.join(CONTENT_ROOT, section), file)
    .replace(/\\/g, "/");

  const noExt = relative.replace(/\.md$/i, "");
  const parts = noExt.split("/");

  if (parts.at(-1) === "_index") {
    parts.pop();
  }

  return parts.filter(Boolean).join("/");
}

export function getCollection(
  section: "blogs" | "projects"
): ContentItem[] {
  const root = path.join(CONTENT_ROOT, section);

  return walk(root)
    .filter(
      (file) =>
        /\.md$/i.test(file) &&
        !path.basename(file).startsWith("_")
    )
    .map((sourcePath) => {
      const raw = fs.readFileSync(sourcePath, "utf8");
      const parsed = matter(raw);

      const slug = normalizeSlug(sourcePath, section);

      const data = {
        ...parsed.data,
      } as Record<string, unknown>;

      if (data.date instanceof Date) {
        data.date = data.date.toISOString().slice(0, 10);
      }

      const frontmatter = data as Frontmatter;

      return {
        slug,
        route: `/${section}/${slug}/`,
        sourcePath,
        content: parsed.content,
        data: frontmatter,
      };
    })
    .filter((item) => !item.data.draft)
    .sort((a, b) =>
      String(b.data.date ?? "").localeCompare(
        String(a.data.date ?? "")
      )
    );
}

export function getItem(
  section: "blogs" | "projects",
  slugParts: string[]
): ContentItem | undefined {
  const slug = slugParts.join("/");

  return getCollection(section).find(
    (item) => item.slug === slug
  );
}

export function getBlogBySlug(slug: string) {
  return getCollection("blogs").find(
    (item) =>
      item.slug === slug ||
      path.basename(item.slug) === slug
  );
}

/**
 * Convert a tag/category display name into its canonical URL slug.
 *
 * Examples:
 *   Kubernetes     -> kubernetes
 *   GitHub Actions -> github-actions
 *   AWS             -> aws
 */
export function normalizeTaxonomySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllTags() {
  const tags = new Map<string, string>();

  for (const post of getCollection("blogs")) {
    for (const tag of post.data.tags ?? []) {
      const slug = normalizeTaxonomySlug(tag);

      if (!slug) continue;

      if (!tags.has(slug)) {
        tags.set(slug, tag);
      }
    }
  }

  return [...tags.entries()].sort((a, b) =>
    a[1].localeCompare(b[1])
  );
}

export function getTagName(tagSlug: string) {
  const match = getAllTags().find(
    ([slug]) => slug === tagSlug
  );

  return match?.[1] ?? tagSlug;
}

export function getPostsByTag(tag: string) {
  const normalized = normalizeTaxonomySlug(tag);

  return getCollection("blogs").filter((post) =>
    (post.data.tags ?? []).some(
      (t) => normalizeTaxonomySlug(t) === normalized
    )
  );
}

export function getPostsByCategory(category: string) {
  return getCollection("blogs").filter((post) =>
    (post.data.categories ?? []).some(
      (c) =>
        c.toLowerCase() === category.toLowerCase()
    )
  );
}

export function readingTime(text: string) {
  const words = text
    .replace(/[`*_#>-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export function displayDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
      }).format(date);
}