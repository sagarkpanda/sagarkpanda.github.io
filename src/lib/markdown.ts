function protectCode(text: string) {
  const protectedParts: string[] = [];
  const token = (i: number) => `@@MD_CODE_${i}_@@`;

  text = text.replace(
    /```[\s\S]*?```|~~~[\s\S]*?~~~/g,
    (match) => {
      const i = protectedParts.push(match) - 1;
      return token(i);
    }
  );

  text = text.replace(/`[^`\n]+`/g, (match) => {
    const i = protectedParts.push(match) - 1;
    return token(i);
  });

  return {
    text,
    restore(value: string) {
      return value.replace(
        /@@MD_CODE_(\d+)_@@/g,
        (_, i) => protectedParts[Number(i)]
      );
    },
  };
}

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getShortcodeAttr(attrs: string, name: string) {
  return (
    attrs.match(
      new RegExp(`\\b${name}=["']([^"']*)["']`, "i")
    )?.[1] ?? ""
  );
}

/*
 * HTML elements intentionally allowed inside Markdown.
 * Unknown tags are treated as literal text.
 */
const allowedHtmlTags = new Set([
  "a",
  "abbr",
  "article",
  "b",
  "blockquote",
  "body",
  "br",
  "button",
  "caption",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "div",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "li",
  "main",
  "mark",
  "nav",
  "ol",
  "p",
  "pre",
  "s",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "u",
  "ul",
]);

function escapeUnknownHtmlTags(text: string) {
  return text.replace(
    /<\/?([A-Za-z][A-Za-z0-9_-]*)(?:\s[^<>]*?)?\s*\/?>/g,
    (match: string, tagName: string) => {
      if (allowedHtmlTags.has(tagName.toLowerCase())) {
        return match;
      }

      return match
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }
  );
}

export function prepareMarkdown(
  source: string,
  knownBlogSlugs: string[] = [],
  sourceSlug = ""
) {
  const protectedCode = protectCode(source);
  let text = protectedCode.text;

  /*
   * Remove HTML comments.
   */
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  /*
   * Normalize Hugo <br> tags.
   */
  text = text.replace(
    /<br\s*>\s*<\/br\s*>|<br\s*\/?>/gi,
    "<br />"
  );

  /*
   * Convert Hugo figure shortcodes to HTML.
   */
  text = text.replace(
    /\{\{<\s*figure\b([\s\S]*?)>\}\}/gi,
    (_, attrs: string) => {
      const src = getShortcodeAttr(attrs, "src");

      if (!src) {
        return "";
      }

      const alt = getShortcodeAttr(attrs, "alt") || "Image";
      const width = getShortcodeAttr(attrs, "width");
      const height = getShortcodeAttr(attrs, "height");
      const title = getShortcodeAttr(attrs, "title");

      const imageAttributes = [
        `src="${escapeAttr(src)}"`,
        `alt="${escapeAttr(alt)}"`,
        width ? `width="${escapeAttr(width)}"` : "",
        height ? `height="${escapeAttr(height)}"` : "",
      ]
        .filter(Boolean)
        .join(" ");

      return [
        "<figure>",
        `<img ${imageAttributes} />`,
        title ? `<figcaption>${escapeAttr(title)}</figcaption>` : "",
        "</figure>",
      ]
        .filter(Boolean)
        .join("\n");
    }
  );

  /*
   * Group figures separated only by <br /> into an image row.
   */
  text = text.replace(
    /(<figure>[\s\S]*?<\/figure>(?:\s*<br\s*\/?>\s*<figure>[\s\S]*?<\/figure>)+)/gi,
    (match: string) => {
      const figures = match.replace(/\s*<br\s*\/?>\s*/gi, "");

      return [
        '<div class="article-image-row">',
        figures,
        "</div>",
      ].join("\n");
    }
  );

  /*
   * Escape XML-style tags, such as <foo:bar>.
   */
  text = text.replace(
    /<([A-Za-z][A-Za-z0-9_-]*:[A-Za-z0-9_-]+)>/g,
    (_, inner: string) => `&lt;${inner}&gt;`
  );

  /*
   * Escape unknown HTML-like tags while preserving allowed HTML.
   */
  text = escapeUnknownHtmlTags(text);

  /*
   * Hugo icon shortcode fallback.
   */
  text = text.replace(
    /\{\{<\s*icon\s+name=["']([^"']+)["'][^>]*>\}\}/g,
    "◉"
  );

  /*
   * Resolve relative Markdown links to blog routes.
   * Resolve from the current article directory first.
   * If necessary, fall back to a unique matching filename.
   */
  text = text.replace(
    /(\]\()([^)]*)(\))/g,
    (whole, before: string, rawTarget: string, after: string) => {
      const target = rawTarget.trim();
      const targetPath = target.split(/[?#]/, 1)[0];

      if (
        !targetPath.toLowerCase().endsWith(".md") ||
        /^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(target)
      ) {
        return whole;
      }

      const suffix = target.slice(targetPath.length);
      const cleanTarget = targetPath.replace(/\.md$/i, "");

      const parts = [
        ...sourceSlug.split("/").slice(0, -1),
        ...cleanTarget.split("/"),
      ];

      const resolved: string[] = [];

      for (const part of parts) {
        if (!part || part === ".") continue;

        if (part === "..") {
          resolved.pop();
        } else {
          resolved.push(part);
        }
      }

      let match = knownBlogSlugs.find(
        (slug) => slug === resolved.join("/")
      );

      if (!match) {
        const filename = cleanTarget.split("/").pop();

        const candidates = knownBlogSlugs.filter(
          (slug) => slug.split("/").pop() === filename
        );

        if (candidates.length === 1) {
          match = candidates[0];
        }
      }

      return match
        ? `${before}/blogs/${match}/${suffix}${after}`
        : whole;
    }
  );

  /*
   * Resolve Hugo relref shortcodes.
   *
   * The old Hugo reference "apache" points to
   * content/blogs/apache/apache-setup.md.
   */
  text = text.replace(
    /\{\{<\s*relref\s+["']([^"']+)["']\s*>\}\}/g,
    (_, rawTarget: string) => {
      const target = rawTarget.trim().replace(/\\/g, "/");

      const aliases: Record<string, string> = {
        apache: "apache/apache-setup",
      };

      const resolvedTarget = aliases[target] ?? target;

      const match = knownBlogSlugs.find(
        (slug) =>
          slug === resolvedTarget ||
          slug.endsWith(`/${resolvedTarget}`)
      );

      return match ? `/blogs/${match}/` : `/${resolvedTarget}/`;
    }
  );

  return protectedCode.restore(text);
}