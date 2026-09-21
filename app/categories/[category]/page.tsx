import type { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";
import PostCard from "@/components/PostCard";

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

  const categories = new Map<string, string>();

  for (const post of posts) {
    for (const category of post.data.categories ?? []) {
      const slug = slugify(category);

      if (!categories.has(slug)) {
        categories.set(slug, category);
      }
    }
  }

  return [...categories.entries()].map(([slug]) => ({
    category: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  const posts = getCollection("blogs");

  const originalName = posts
    .flatMap((post) => post.data.categories ?? [])
    .find((name) => slugify(name) === category);

  const title = originalName ?? category;

  return {
    title,
    description: `Posts in the ${title} category.`,
    alternates: {
      canonical: `/categories/${category}/`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const posts = getCollection("blogs").filter((post) =>
    (post.data.categories ?? []).some(
      (name) => slugify(name) === category
    )
  );

  const categoryName =
    posts.length > 0
      ? (posts[0].data.categories ?? []).find(
          (name) => slugify(name) === category
        ) ?? category
      : category;

  return (
    <main className="shell page-shell">
      <section className="section">
        <div className="command">
          $ cd /categories/{category} && ls
        </div>

        <h1>{categoryName}</h1>

        <p className="section-lead">
          Posts in this category.
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
          href="/categories/"
        >
          ← all categories
        </Link>
      </section>
    </main>
  );
}