
import matter from 'gray-matter';
import { marked } from 'marked';
import { prepareMarkdown } from '$lib/markdown';
import {
  normalizeTaxonomySlug,
  normalizeCategorySlug
} from '$lib/taxonomy';

export { displayDate } from '$lib/format';
export {
  normalizeTaxonomySlug,
  normalizeCategorySlug
} from '$lib/taxonomy';

type Frontmatter = {
  title?: string;
  description?: string;
  summary?: string;
  date?: string | Date;
  draft?: boolean;
  tags?: string[];
  categories?: string[];
  series?: string[] | string;
  series_order?: number;
  cover?: string;
  status?: string;
  link?: string;
  blogLink?: string;
  [key: string]: unknown;
};

export type ContentItem = {
  slug: string;
  route: string;
  sourcePath: string;
  content: string;
  html: string;
  data: Frontmatter;
  readingTime: number;
  headings: { id: string; text: string; level: number }[];
};

export type PostCardItem = Pick<
  ContentItem,
  'slug' | 'route' | 'data' | 'readingTime'
>;

export type ProjectCardItem = Pick<
  ContentItem,
  'slug' | 'route' | 'data'
>;

export function toPostCardItem(item: ContentItem): PostCardItem {
  return {
    slug: item.slug,
    route: item.route,
    data: item.data,
    readingTime: item.readingTime
  };
}

export function toProjectCardItem(item: ContentItem): ProjectCardItem {
  return {
    slug: item.slug,
    route: item.route,
    data: item.data
  };
}

const blogFiles = import.meta.glob('/content/blogs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const projectFiles = import.meta.glob('/content/projects/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

function slugFromPath(path: string, section: 'blogs' | 'projects') {
  return path
    .replace(`/content/${section}/`, '')
    .replace(/\.md$/i, '')
    .replace(/\\/g, '/');
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ''
      : value.toISOString().slice(0, 10);
  }

  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '';
}

function list(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  return typeof value === 'string' && value.trim()
    ? [value.trim()]
    : [];
}

function parseFiles(
  files: Record<string, string>,
  section: 'blogs' | 'projects',
  knownBlogSlugs: string[] = []
): ContentItem[] {
  return Object.entries(files)
    .filter(
      ([sourcePath]) => !sourcePath.split('/').pop()?.startsWith('_')
    )
    .map(([sourcePath, raw]) => {
      const parsed = matter(raw);
      const slug = slugFromPath(sourcePath, section);
      const data = { ...parsed.data } as Frontmatter;

      data.date = normalizeDate(data.date);

      if (data.tags !== undefined) {
        data.tags = list(data.tags);
      }

      if (data.categories !== undefined) {
        data.categories = list(data.categories);
      }

      if (data.series !== undefined) {
        data.series = Array.isArray(data.series)
          ? list(data.series)
          : String(data.series);
      }

      // Resolve relative Markdown links from the current article directory.
      const content = prepareMarkdown(
        parsed.content,
        knownBlogSlugs,
        section === 'blogs' ? slug : ''
      );

      const headings: {
        id: string;
        text: string;
        level: number;
      }[] = [];

      const usedIds = new Map<string, number>();
      const renderer = new marked.Renderer();

      renderer.heading = (token) => {
        const depth = token.depth;
        const rawText = token.text ?? '';

        // token.raw retains the original Markdown heading syntax,
        // including explicit IDs such as {#part-iii}.
        const rawHeading = (token.raw ?? '')
          .replace(/^#{1,6}\s+/, '')
          .replace(/\s+#+\s*$/, '')
          .trim();

        const customMatch =
          /\s*\{#([^}]+)\}\s*$/.exec(rawHeading) ??
          /\s*\{#([^}]+)\}\s*$/.exec(rawText);

        const headingText = customMatch
          ? (rawHeading || rawText).replace(/\s*\{#[^}]+\}\s*$/, '')
          : rawText;

        const inlineHtml = String(
          marked.parseInline(headingText, { async: false })
        );

        const plain = headingText
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/[*_~]/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .trim();

        const base =
          plain
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'section';

        const count = usedIds.get(base) ?? 0;
        usedIds.set(base, count + 1);

        const id =
          customMatch?.[1] ?? (count ? `${base}-${count}` : base);

        headings.push({
          id,
          text: plain,
          level: depth
        });

        return `<h${depth} id="${escapeHtml(id)}">${inlineHtml}</h${depth}>\n`;
      };

      const html = (
        marked.parse(content, {
          async: false,
          renderer
        }) as string
      ).replace(
        /<a\s+href="((?:https?:)?\/\/[^"]+)"(?![^>]*\btarget=)/gi,
        '<a href="$1" target="_blank" rel="noopener noreferrer"'
      );

      const words = parsed.content.trim().split(/\s+/).filter(Boolean).length;

      return {
        slug,
        route: `/${section}/${slug}/`,
        sourcePath,
        content,
        html,
        data,
        headings,
        readingTime: Math.max(1, Math.ceil(words / 200))
      };
    })
    .filter((item) => !item.data.draft)
    .sort((a, b) =>
      String(b.data.date ?? '').localeCompare(String(a.data.date ?? ''))
    );
}

const blogSlugs = Object.keys(blogFiles)
  .filter((path) => !path.split('/').pop()?.startsWith('_'))
  .map((path) => slugFromPath(path, 'blogs'));

export const blogs = parseFiles(blogFiles, 'blogs', blogSlugs);
export const projects = parseFiles(projectFiles, 'projects', blogSlugs);

export function getBlog(slug: string) {
  return blogs.find((item) => item.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}

export function getTags() {
  const tags = new Map<string, string>();

  for (const post of blogs) {
    for (const tag of list(post.data.tags)) {
      const slug = normalizeTaxonomySlug(tag);

      if (slug && !tags.has(slug)) {
        tags.set(slug, tag);
      }
    }
  }

  return [...tags.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategories() {
  const categories = new Map<string, string>();

  for (const post of blogs) {
    for (const category of list(post.data.categories)) {
      const slug = normalizeCategorySlug(category);

      if (slug && !categories.has(slug)) {
        categories.set(slug, category);
      }
    }
  }

  return [...categories.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsByTag(tag: string) {
  const normalized = normalizeTaxonomySlug(tag);

  return blogs.filter((post) =>
    list(post.data.tags).some(
      (value) => normalizeTaxonomySlug(value) === normalized
    )
  );
}

export function getPostsByCategory(category: string) {
  const normalized = normalizeCategorySlug(category);

  return blogs.filter((post) =>
    list(post.data.categories).some(
      (value) => normalizeCategorySlug(value) === normalized
    )
  );
}

export function getSeriesNames(value: unknown): string[] {
  return list(value);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}