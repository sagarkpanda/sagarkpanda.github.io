import Link from "next/link";
import {
  displayDate,
  getCollection,
  readingTime,
  normalizeTaxonomySlug,
} from "@/lib/content";

import type { ContentItem } from "@/types/content";

import MarkdownContent from "@/components/MarkdownContent";
import TableOfContents from "@/components/TableOfContents";
import { extractHeadings } from "@/lib/headings";

import SeriesNavigation, {
  type SeriesGroup,
} from "@/components/SeriesNavigation";

/*
 * Build the series navigation for the current article.
 *
 * This function MUST remain outside BlogArticle and RelatedPosts
 * so both functions can access it safely.
 */
function getSeriesGroups(
  post: ContentItem,
  posts: ContentItem[]
): SeriesGroup[] {
  const rawSeries = post.data.series;

  const seriesNames =
    typeof rawSeries === "string"
      ? [rawSeries]
      : Array.isArray(rawSeries)
        ? rawSeries
        : [];

  if (!seriesNames.length) {
    return [];
  }

  return seriesNames
    .map((seriesName) => {
      const articles = posts
        .filter((item) => {
          const raw = item.data.series;

          const names =
            typeof raw === "string"
              ? [raw]
              : Array.isArray(raw)
                ? raw
                : [];

          return names.some(
            (name) =>
              name.toLowerCase() ===
              seriesName.toLowerCase()
          );
        })
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

      const currentIndex =
        articles.findIndex(
          (item) => item.route === post.route
        ) + 1;

      return {
        name: seriesName,
        currentIndex,
        articles: articles.map((item) => ({
          title: String(item.data.title),
          route: item.route,
          order:
            typeof item.data.series_order === "number"
              ? item.data.series_order
              : 0,
        })),
      };
    })
    .filter(
      (series) =>
        series.articles.length > 0 &&
        series.currentIndex > 0
    );
}

function RelatedPosts({
  post,
}: {
  post: ContentItem;
}) {
  const all = getCollection("blogs").filter(
    (item) => item.route !== post.route
  );

  const tags = new Set(
    (post.data.tags ?? []).map((t) =>
      t.toLowerCase()
    )
  );

  const categories = new Set(
    (post.data.categories ?? []).map((c) =>
      c.toLowerCase()
    )
  );

  const related = all
    .map((item) => {
      const tagScore = (
        item.data.tags ?? []
      ).filter((t) =>
        tags.has(t.toLowerCase())
      ).length;

      const categoryScore = (
        item.data.categories ?? []
      ).filter((c) =>
        categories.has(c.toLowerCase())
      ).length;

      return {
        item,
        score:
          tagScore * 3 +
          categoryScore * 2,
      };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        String(
          b.item.data.date
        ).localeCompare(
          String(a.item.data.date)
        )
    )
    .slice(0, 3)
    .map((x) => x.item);

  if (!related.length) return null;

  return (
    <section className="related-section">
      <div className="command">
        $ grep -r "related" ~/blogs
      </div>

      <h2>Related</h2>

      <div className="related-grid">
        {related.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            className="related-card"
          >
            <span>
              {displayDate(item.data.date)}
            </span>

            <strong>
              {item.data.title}
            </strong>

            <small>
              {item.data.summary ||
                item.data.description ||
                ""}
            </small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function BlogArticle({
  post,
}: {
  post: ContentItem;
}) {
  const posts = getCollection("blogs");

  const seriesGroups = getSeriesGroups(
    post,
    posts
  );

  const index = posts.findIndex(
    (item) => item.route === post.route
  );

  const newer =
    index > 0
      ? posts[index - 1]
      : undefined;

  const older =
    index >= 0
      ? posts[index + 1]
      : undefined;

  const headings = extractHeadings(
    post.content
  );

  return (
    <article>
      <header className="article-header">
        <div className="eyebrow">
          ~/blogs/{post.slug}
        </div>

        <h1>{post.data.title}</h1>

        {post.data.summary && (
          <p>{post.data.summary}</p>
        )}

        <div className="article-author">
          By <strong>Sagar Panda</strong>
        </div>

        <div
          className={`article-meta-panel ${
            seriesGroups.length === 0
              ? "no-series"
              : ""
          }`}
        >
          <div className="article-meta-details">
            <div className="article-meta-top">
              <span>
                {displayDate(post.data.date)}
              </span>

              <span>·</span>

              <span>
                {readingTime(post.content)} min read
              </span>
            </div>

            <div className="article-meta-divider" />

            <div className="article-meta-row">
              <span className="article-meta-label">
                Author:
              </span>

              <strong>Sagar Panda</strong>
            </div>

            {(post.data.tags ?? []).length > 0 && (
              <div className="article-meta-row">
                <span className="article-meta-label">
                  Tags:
                </span>

                <div className="article-meta-values">
                  {[...new Set(post.data.tags ?? [])].map(
                    (tag, tagIndex) => (
                      <Link
                        key={`${tag}-${tagIndex}`}
                        href={`/tags/${normalizeTaxonomySlug(tag)}/`}
                        className="metadata-tag"
                      >
                        {tag}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {seriesGroups.length > 0 && (
            <SeriesNavigation
              series={seriesGroups}
            />
          )}
        </div>
      </header>

      {post.data.cover && (
        <div className="article-cover">
          <img
            src={String(post.data.cover)}
            alt={post.data.title}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}

      <div className="article-content">
        <TableOfContents
          headings={headings}
        />

        <div className="article-body">
          <MarkdownContent
            source={post.content}
          />
        </div>
      </div>

      <div className="article-nav">
        {older ? (
          <Link
            href={older.route}
            className="article-nav-card"
          >
            <span>← previous</span>

            <strong>
              {older.data.title}
            </strong>
          </Link>
        ) : (
          <span />
        )}

        {newer ? (
          <Link
            href={newer.route}
            className="article-nav-card article-nav-next"
          >
            <span>next →</span>

            <strong>
              {newer.data.title}
            </strong>
          </Link>
        ) : (
          <span />
        )}
      </div>

      <RelatedPosts post={post} />

      <footer className="article-footer">
        <Link href="/blogs/">
          ← all posts
        </Link>
      </footer>
    </article>
  );
}