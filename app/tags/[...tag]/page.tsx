import {
  getAllTags,
  getPostsByTag,
  getTagName,
} from "@/lib/content";

import PostCard from "@/components/PostCard";

export const dynamicParams = false;

export function generateStaticParams() {
  const tags = getAllTags();

  return tags.flatMap(([slug, name]) => {
    const params = [
      {
        tag: [slug],
      },
    ];

    const originalSlug = name
      .trim()
      .replace(/['’]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (originalSlug !== slug) {
      params.push({
        tag: [originalSlug],
      });
    }

    return params;
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string[] }>;
}) {
  const { tag } = await params;

  const slug = tag.join("/").toLowerCase();

  const name = getTagName(slug);
  const posts = getPostsByTag(slug);

  return (
    <main className="shell">
      <section className="section">
        <div className="command">
          $ grep -r "#{name}" ~/blogs
        </div>

        <h1>#{name}</h1>

        <div className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post.route}
              post={post}
            />
          ))}
        </div>
      </section>
    </main>
  );
}