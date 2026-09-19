import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getItem } from "@/lib/content";
import BlogArticle from "@/components/BlogArticle";
import JsonLd from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCollection("blogs").map((p) => ({
    slug: p.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = getItem("blogs", slug);

  if (!post) {
    return {};
  }

  const postTitle = String(post.data.title);

  const description = String(
    post.data.summary ||
      post.data.description ||
      ""
  );

  const cover = post.data.cover
    ? String(post.data.cover)
    : "/images/og-image.png";

  const postUrl =
    `https://sagarpanda.com/blogs/${post.slug}/`;

  return {
    title: {
      absolute: postTitle,
    },

    description,

    openGraph: {
      title: postTitle,
      description,
      type: "article",
      url: postUrl,
      images: [
        {
          url: cover,
          alt: postTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: postTitle,
      description,
      images: [cover],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const post = getItem("blogs", slug);

  if (!post) {
    notFound();
  }

  const postTitle = String(post.data.title);

  const description = String(
    post.data.summary ||
      post.data.description ||
      ""
  );

  const postUrl =
    `https://sagarpanda.com/blogs/${post.slug}/`;

  const cover = post.data.cover
    ? String(post.data.cover)
    : "https://sagarpanda.com/images/og-image.png";

  const publishedDate = post.data.date
    ? new Date(String(post.data.date)).toISOString()
    : undefined;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: postTitle,
    description,
    url: postUrl,
    image: cover,
    inLanguage: "en",

    author: {
      "@type": "Person",
      "@id": "https://sagarpanda.com/#person",
      name: "Sagar Panda",
      url: "https://sagarpanda.com/",
      jobTitle: "DevOps & Cloud Engineer",
    },

    publisher: {
      "@type": "Person",
      "@id": "https://sagarpanda.com/#person",
      name: "Sagar Panda",
      url: "https://sagarpanda.com/",
    },

    ...(publishedDate
      ? {
          datePublished: publishedDate,
        }
      : {}),

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },

    ...(Array.isArray(post.data.tags) &&
    post.data.tags.length > 0
      ? {
          keywords: post.data.tags.map((tag) => String(tag)),
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={blogPostingSchema} />

      <main className="shell article-shell">
        <BlogArticle post={post} />
      </main>
    </>
  );
}