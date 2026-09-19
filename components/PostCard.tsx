import Link from "next/link";

import type { ContentItem } from "@/types/content";

import {
  displayDate,
  normalizeTaxonomySlug,
  readingTime,
} from "@/lib/content";

export default function PostCard({
  post,
}: {
  post: ContentItem;
}) {
  return (
    <article className="post-row">
      <div className="post-date">
        {displayDate(post.data.date)}
      </div>

      <div>
        <Link
          href={post.route}
          className="post-title"
        >
          {post.data.title}
        </Link>

        <p>
          {post.data.summary ||
            post.data.description ||
            ""}
        </p>

        <div className="post-meta">
          <span>
            {readingTime(post.content)} min read
          </span>

          <div className="post-tags">
            {(post.data.tags || [])
              .slice(0, 4)
              .map((tag, index) => (
                <Link
                  key={`${tag}-${index}`}
                  href={`/tags/${normalizeTaxonomySlug(
                    tag
                  )}/`}
                >
                  #{tag}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}