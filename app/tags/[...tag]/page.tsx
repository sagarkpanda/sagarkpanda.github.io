import {
  getAllTags,
  getPostsByTag,
  getTagName,
} from "@/lib/content";

import PostCard from "@/components/PostCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(([slug]) => ({
    tag: [slug],
  }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string[] }>;
}) {
  const { tag } = await params;

  const slug = tag.join("/");
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