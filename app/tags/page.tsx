import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllTags,
  getPostsByTag,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse all posts by tag.",
  alternates: {
    canonical: "/tags/",
  },
};

export default function TagsPage() {
  const tags = getAllTags()
    .map(([slug, name]) => ({
      slug,
      name,
      count: getPostsByTag(slug).length,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <main className="shell page-shell">
      <section className="section">
        <div className="command">
          $ cd /tags && sort -nr
        </div>

        <h1>Tags</h1>

        <p className="section-lead">
          Browse all articles by tag.
        </p>

        <div className="tag-index">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}/`}
              className="tag-index-item">
              <span className="tag-index-name">
                {tag.name}
              </span>

              <span className="tag-index-count">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}