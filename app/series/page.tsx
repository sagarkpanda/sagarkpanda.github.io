import type { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Series",
  description: "Browse posts grouped into series.",
};

export default function SeriesPage() {
  const posts = getCollection("blogs");

  const seriesMap = new Map<
    string,
    {
      name: string;
      posts: typeof posts;
    }
  >();

  for (const post of posts) {
    const raw = post.data.series;

    const seriesNames =
      typeof raw === "string"
        ? [raw]
        : Array.isArray(raw)
          ? raw
          : [];

    for (const name of seriesNames) {
      const key = name.toLowerCase();

      if (!seriesMap.has(key)) {
        seriesMap.set(key, {
          name,
          posts: [],
        });
      }

      seriesMap.get(key)!.posts.push(post);
    }
  }

  const series = [...seriesMap.values()]
    .map((item) => ({
      ...item,
      posts: [...item.posts].sort(
        (a, b) =>
          (Number(a.data.series_order) || Number.MAX_SAFE_INTEGER) -
          (Number(b.data.series_order) || Number.MAX_SAFE_INTEGER)
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="shell page-shell">
      <section className="section">
        <div className="command">$ cd /series && ls</div>

        <h1>Series</h1>

        <p className="section-lead">
          Browse related articles grouped into series.
        </p>

        <div className="post-list">
          {series.map((item) => (
            <section key={item.name} className="section">
              <h2>{item.name}</h2>

              <div className="post-list">
                {item.posts.map((post) => (
                  <Link
                    key={post.route}
                    href={post.route}
                    className="related-card"
                  >
                    <span>
                      {post.data.series_order
                        ? `Part ${post.data.series_order}`
                        : "Article"}
                    </span>

                    <strong>{post.data.title}</strong>

                    <small>
                      {post.data.summary ||
                        post.data.description ||
                        ""}
                    </small>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}