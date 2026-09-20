import type { Metadata } from "next";
import Link from "next/link";
import { getCollection, displayDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archives",
  description: "Browse all articles in chronological order.",
};

type ArchiveGroup = {
  year: string;
  months: {
    month: string;
    posts: ReturnType<typeof getCollection>;
  }[];
};

export default function ArchivesPage() {
  const posts = getCollection("blogs");

  const grouped = new Map<
    string,
    Map<string, ReturnType<typeof getCollection>>
  >();

  for (const post of posts) {
    const date = String(post.data.date ?? "");

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      continue;
    }

    const year = parsedDate.getFullYear().toString();

    const month = parsedDate.toLocaleString("en-US", {
      month: "long",
    });

    if (!grouped.has(year)) {
      grouped.set(year, new Map());
    }

    const months = grouped.get(year)!;

    if (!months.has(month)) {
      months.set(month, []);
    }

    months.get(month)!.push(post);
  }

  const archives: ArchiveGroup[] = [...grouped.entries()].map(
    ([year, months]) => ({
      year,
      months: [...months.entries()].map(([month, posts]) => ({
        month,
        posts,
      })),
    })
  );

  return (
    <main className="shell page-shell">
      <section className="section">
        <div className="command">$ cd /archives && ls -lt</div>

        <h1>Archives</h1>

        <p className="section-lead">
          Browse all articles in chronological order.
        </p>

        {archives.map((yearGroup) => (
          <section key={yearGroup.year} className="archive-year">
            <h2>{yearGroup.year}</h2>

            {yearGroup.months.map((monthGroup) => (
              <section
                key={`${yearGroup.year}-${monthGroup.month}`}
                className="archive-month"
              >
                <h3>{monthGroup.month}</h3>

                <div className="post-list">
                  {monthGroup.posts.map((post) => (
                    <Link
                      key={post.route}
                      href={post.route}
                      className="related-card"
                    >
                      <span>{displayDate(post.data.date)}</span>

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
          </section>
        ))}
      </section>
    </main>
  );
}