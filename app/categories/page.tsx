import type { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse posts by category.",
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesPage() {
  const posts = getCollection("blogs");

  const categories = new Map<string, string>();

  for (const post of posts) {
    for (const category of post.data.categories ?? []) {
      const key = category.toLowerCase();

      if (!categories.has(key)) {
        categories.set(key, category);
      }
    }
  }

  const items = [...categories.values()]
    .map((name) => ({
      name,
      slug: slugify(name),
      count: posts.filter((post) =>
        (post.data.categories ?? []).some(
          (category) =>
            category.toLowerCase() === name.toLowerCase()
        )
      ).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="shell page-shell">
      <section className="section">
        <h1>Categories</h1>

        <p className="section-lead">
          Browse posts by category.
        </p>

        <div className="post-list">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}/`}
              className="related-card"
            >
              <strong>{item.name}</strong>

              <small>
                {item.count}{" "}
                {item.count === 1 ? "post" : "posts"}
              </small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}