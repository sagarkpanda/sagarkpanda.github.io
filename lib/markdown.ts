import { getCollection } from "@/lib/content";

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

function getShortcodeAttr(
  attrs: string,
  name: string
) {
  return (
    attrs.match(
      new RegExp(
        `\\b${name}=["']([^"']*)["']`,
        "i"
      )
    )?.[1] ?? ""
  );
}

/*
 * HTML elements that are intentionally allowed
 * inside the Markdown content.
 *
 * Unknown tags such as:
 *
 *   <number>
 *   <name>
 *   <filename>
 *   <username>
 *   <url>
 *   <container_id>
 *
 * are treated as literal Markdown text instead
 * of being interpreted by rehypeRaw as HTML.
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
    (
      match: string,
      tagName: string
    ) => {
      if (
        allowedHtmlTags.has(
          tagName.toLowerCase()
        )
      ) {
        return match;
      }

      return match
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }
  );
}

export function prepareMarkdown(source: string) {
  const protectedCode = protectCode(source);

  let text = protectedCode.text;

  /*
   * Remove HTML comments.
   */
  text = text.replace(
    /<!--[\s\S]*?-->/g,
    ""
  );

  /*
   * Normalize <br> tags.
   *
   * Hugo commonly uses:
   *
   * <br></br>
   *
   * Normalize all of them to:
   *
   * <br />
   */
  text = text.replace(
    /<br\s*>\s*<\/br\s*>|<br\s*\/?>/gi,
    "<br />"
  );

  /*
   * Hugo figure shortcode.
   *
   * Convert:
   *
   * {{< figure
   *   src="..."
   *   alt="..."
   *   width="1000"
   *   height="600"
   *   title="..."
   * >}}
   *
   * into normal HTML.
   */
  text = text.replace(
    /\{\{<\s*figure\b([\s\S]*?)>\}\}/gi,
    (_, attrs: string) => {
      const src = getShortcodeAttr(
        attrs,
        "src"
      );

      if (!src) {
        return "";
      }

      const alt =
        getShortcodeAttr(
          attrs,
          "alt"
        ) || "Image";

      const width =
        getShortcodeAttr(
          attrs,
          "width"
        );

      const height =
        getShortcodeAttr(
          attrs,
          "height"
        );

      const title =
        getShortcodeAttr(
          attrs,
          "title"
        );

      const safeSrc =
        escapeAttr(src);

      const safeAlt =
        escapeAttr(alt);

      const imageAttributes = [
        `src="${safeSrc}"`,
        `alt="${safeAlt}"`,
        width
          ? `width="${escapeAttr(width)}"`
          : "",
        height
          ? `height="${escapeAttr(height)}"`
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      return [
        "<figure>",
        `<img ${imageAttributes} />`,
        title
          ? `<figcaption>${escapeAttr(
              title
            )}</figcaption>`
          : "",
        "</figure>",
      ]
        .filter(Boolean)
        .join("\n");
    }
  );

  /*
   * Group figures that are separated ONLY by <br />.
   *
   * Example:
   *
   * <figure>...</figure>
   * <br />
   * <figure>...</figure>
   *
   * becomes:
   *
   * <div class="article-image-row">
   *   <figure>...</figure>
   *   <figure>...</figure>
   * </div>
   *
   * This also supports 3, 4, or more adjacent figures.
   */
  text = text.replace(
    /(<figure>[\s\S]*?<\/figure>(?:\s*<br\s*\/?>\s*<figure>[\s\S]*?<\/figure>)+)/gi,
    (match: string) => {
      const figures = match.replace(
        /\s*<br\s*\/?>\s*/gi,
        ""
      );

      return [
        '<div class="article-image-row">',
        figures,
        "</div>",
      ].join("\n");
    }
  );

  /*
   * Escape XML-style tags such as:
   *
   * <foo:bar>
   *
   * These are not intended to become HTML elements.
   */
  text = text.replace(
    /<([A-Za-z][A-Za-z0-9_-]*:[A-Za-z0-9_-]+)>/g,
    (_, inner) =>
      `&lt;${inner}&gt;`
  );

  /*
   * Escape unknown HTML-like tags.
   *
   * This is the Hugo -> ReactMarkdown compatibility
   * fix.
   *
   * For example:
   *
   *   Use !<number> to reuse the command
   *
   * becomes:
   *
   *   Use !&lt;number&gt; to reuse the command
   *
   * while legitimate HTML such as:
   *
   *   <small>text</small>
   *   <label>text</label>
   *   <br />
   *
   * remains untouched.
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
   * Hugo relref shortcode.
   */
  const posts = getCollection("blogs");

  text = text.replace(
    /\{\{<\s*relref\s+["']([^"']+)["']\s*>\}\}/g,
    (_, target: string) => {
      const match = posts.find(
        (p) =>
          p.slug === target ||
          p.slug.endsWith(
            `/${target}`
          )
      );

      return match
        ? `/blogs/${match.slug}/`
        : target;
    }
  );

  return protectedCode.restore(text);
}