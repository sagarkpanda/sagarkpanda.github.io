import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

import CodeBlock from "@/components/CodeBlock";
import Mermaid from "@/components/Mermaid";
import ImageLightbox from "@/components/ImageLightbox";
import { prepareMarkdown } from "@/lib/markdown";

function getText(value: React.ReactNode): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getText).join("");
  }

  if (
    value &&
    typeof value === "object" &&
    "props" in value
  ) {
    const props = value.props as {
      children?: React.ReactNode;
    };

    return getText(props.children);
  }

  return "";
}

function removeCustomHeadingId(
  value: React.ReactNode
): React.ReactNode {
  if (typeof value === "string") {
    return value.replace(/\s*\{#[^}]+\}\s*$/, "");
  }

  if (Array.isArray(value)) {
    return value.map(removeCustomHeadingId);
  }

  if (React.isValidElement(value)) {
    const props = value.props as {
      children?: React.ReactNode;
    };

    return React.cloneElement(
      value,
      undefined,
      removeCustomHeadingId(props.children)
    );
  }

  return value;
}

export default function MarkdownContent({
  source,
}: {
  source: string;
}) {
  const prepared = prepareMarkdown(source);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        rehypeHighlight,
        rehypeSlug,
      ]}
      components={{
        h2({ children, ...props }) {
          const text = getText(children);
          const match = /\s*\{#([^}]+)\}\s*$/.exec(text);

          return (
            <h2
              {...props}
              id={match?.[1] || props.id}
            >
              {removeCustomHeadingId(children)}
            </h2>
          );
        },

        h3({ children, ...props }) {
          const text = getText(children);
          const match = /\s*\{#([^}]+)\}\s*$/.exec(text);

          return (
            <h3
              {...props}
              id={match?.[1] || props.id}
            >
              {removeCustomHeadingId(children)}
            </h3>
          );
        },

        pre({ children }) {
          const child =
            React.Children.toArray(children)[0];

          const isMermaid =
            React.isValidElement(child) &&
            child.type === Mermaid;

          if (isMermaid) {
            return <>{children}</>;
          }

          let language = "code";

          if (React.isValidElement(child)) {
            const childProps = child.props as {
              className?: string;
            };

            const className =
              childProps.className ?? "";

            const match =
              /language-([\w-]+)/.exec(className);

            if (match?.[1]) {
              language = match[1];
            }
          }

          return (
            <CodeBlock language={language}>
              {children}
            </CodeBlock>
          );
        },

        a({
          href,
          children,
          ...props
        }) {
          const isExternal =
            typeof href === "string" &&
            /^(https?:)?\/\//i.test(href);

          return (
            <a
              href={href}
              {...props}
              target={
                isExternal
                  ? "_blank"
                  : props.target
              }
              rel={
                isExternal
                  ? "noopener noreferrer"
                  : props.rel
              }
            >
              {children}
            </a>
          );
        },

        code({
          className,
          children,
          ...props
        }) {
          const match =
            /language-([\w-]+)/.exec(
              className || ""
            );

          if (match?.[1] === "mermaid") {
            return (
              <Mermaid
                code={getText(children).replace(
                  /\n$/,
                  ""
                )}
              />
            );
          }

          return (
            <code
              className={className}
              {...props}
            >
              {children}
            </code>
          );
        },

        /*
         * Markdown images and raw HTML <img> elements
         * are both handled here by react-markdown.
         *
         * The lightbox receives the real rendered src
         * and alt text.
         */
        img({
          src,
          alt,
        }) {
          if (typeof src !== "string" || !src) {
            return null;
          }

          return (
            <ImageLightbox
              src={src}
              alt={alt || ""}
            />
          );
        },
      }}
    >
      {prepared}
    </ReactMarkdown>
  );
}