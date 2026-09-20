import type { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";
import PostCard from "@/components/PostCard";

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

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getCollection("blogs");

  const series = new Map<string, string>();

  for (const post of posts) {
    for (const name of getSeriesNames(post.data.series)) {
      const slug = slugify(name);

      if (!series.has(slug)) {
        series.set(slug, name);
      }
    }
  }

  return [...series.entries()].map(([slug]) => ({
    series: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series } = await params;

  const posts = getCollection("blogs");

  const originalName = posts
    .flatMap((post) => getSeriesNames(post.data.series))
    .find((name) => slugify(name) === series);

  const title = originalName ?? series;

  return {
    title,
    description: `Articles in the ${title} series.`,
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series } = await params;

  const posts = getCollection("blogs")
    .filter((post) =>
      getSeriesNames(post.data.series).some(
        (name) => slugify(name) === series
      )
    )
    .sort((a, b) => {
      const orderA =
        typeof a.data.series_order === "number"
          ? a.data.series_order
          : Number.MAX_SAFE_INTEGER;

      const orderB =
        typeof b.data.series_order === "number"
          ? b.data.series_order
          : Number.MAX_SAFE_INTEGER;

      return orderA - orderB;
    });

  const seriesName =
    posts.length > 0
      ? getSeriesNames(posts[0].data.series).find(
          (name) => slugify(name) === series
        ) ?? series
      : series;

  return (
    <main className="shell page-shell">
      <section className="section">
        <div className="command">
          $ cd /series/{series} && ls
        </div>

        <h1>{seriesName}</h1>

        <p className="section-lead">
          Articles in this series.
        </p>

        <div className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post.route}
              post={post}
            />
          ))}
        </div>

        <Link
          className="text-link"
          href="/series/"
        >
          ← all series
        </Link>
      </section>
    </main>
  );
}