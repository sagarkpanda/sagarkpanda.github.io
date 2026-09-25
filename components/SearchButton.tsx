"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchItem = {
  title: string;
  description: string;
  content: string;
  tags: string[];
  categories: string[];
  route: string;
  kind: string;
};

const sections = [
  ["About", "/#about"],
  ["Projects", "/#projects"],
  ["Experience", "/#experience"],
  ["Education", "/#education"],
  ["Latest Writing", "/#blog"],
  ["Contact", "/#contact"],
  ["All Blog Posts", "/blogs/"],
] as const;

export default function SearchButton() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open || loaded) return;

    fetch("/search-index.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        setIndex(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [open, loaded]);

  const closeSearch = () => {
    setOpen(false);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const q = query.trim();

    if (!q) return;

    closeSearch();

    router.push(`/search/?q=${encodeURIComponent(q)}`);
  };

  const normalized = query.trim().toLowerCase();

  const filteredSections = sections.filter(([name]) =>
    !normalized
      ? true
      : name.toLowerCase().includes(normalized)
  );

  const results = normalized
    ? index
        .filter((item) => item.kind === "Blog")
        .filter((item) => {
          const cleanContent = cleanSearchContent(
            item.content
          );

          const haystack = [
            item.title,
            item.description,
            cleanContent,
            ...item.tags,
            ...item.categories,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalized);
        })
        .slice(0, 8)
    : [];

  return (
    <>
      <button
        className="icon-button search-button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        title="Search (Ctrl+K)"
        type="button"
      >
        <Search size={16} />
      </button>

      {open && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <button
            className="search-backdrop"
            aria-label="Close search"
            onClick={closeSearch}
            type="button"
          />

          <div className="search-dialog">
            <div className="search-dialog-head">
              <span>
                <Search size={16} />
                search
              </span>

              <button
                className="icon-button"
                onClick={closeSearch}
                aria-label="Close search"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="search-input-wrap">
                <input
                  autoFocus
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search blog posts..."
                  aria-label="Search blog posts"
                />

                {query && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </form>

            {!normalized ? (
              <div className="search-suggestions">
                <div className="search-suggestions-title">
                  jump to section
                </div>

                {sections.map(([name, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeSearch}
                  >
                    {name}
                    <span>↗</span>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <div className="search-suggestions">
                  <div className="search-suggestions-title">
                    {results.length
                      ? "matching blog posts"
                      : "no matching blog posts"}
                  </div>

                  <div className="search-results-scroll">
                    {results.map((item) => {
                      const cleanContent =
                        cleanSearchContent(
                          item.content
                        );

                      const preview =
                        findContentMatch(
                          cleanContent,
                          normalized
                        ) || item.description;

                      return (
                        <Link
                          key={`${item.kind}-${item.route}`}
                          href={item.route}
                          onClick={closeSearch}
                        >
                          <span className="search-popup-result">
                            <strong>
                              {item.title}
                            </strong>

                            {preview && (
                              <small>
                                {highlightMatch(
                                  preview,
                                  normalized
                                )}
                              </small>
                            )}
                          </span>

                          <span>↗</span>
                        </Link>
                      );
                    })}

                    {!results.length &&
                      filteredSections.length > 0 && (
                        <>
                          <div className="search-suggestions-title">
                            matching sections
                          </div>

                          {filteredSections.map(
                            ([name, href]) => (
                              <Link
                                key={href}
                                href={href}
                                onClick={closeSearch}
                              >
                                {name}
                                <span>↗</span>
                              </Link>
                            )
                          )}
                        </>
                      )}
                  </div>
                </div>

                <button
                  type="button"
                  className="search-all-button"
                  onClick={submit}
                >
                  Search all blog posts →
                </button>
              </>
            )}

            <div className="search-hint">
              <span>Enter</span> search{" "}
              <span>Esc</span> close
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function cleanSearchContent(content: string) {
  return content
    // Remove fenced code blocks.
    .replace(/```[\s\S]*?```/g, " ")

    // Remove Hugo figure shortcodes.
    .replace(
      /\{\{<\s*figure[\s\S]*?>\}\}/gi,
      " "
    )

    // Remove Markdown images.
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")

    // Remove reference-style Markdown images.
    .replace(
      /!\[[^\]]*\]\s*\[[^\]]*\]/g,
      " "
    )

    // Remove raw HTML images.
    .replace(/<img\b[^>]*>/gi, " ")

    // Remove figure HTML.
    .replace(/<\/?figure\b[^>]*>/gi, " ")

    // Keep visible Markdown link text.
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      "$1"
    )

    // Remove remaining HTML.
    .replace(/<[^>]+>/g, " ")

    // Remove common Markdown formatting.
    .replace(/[#>*_`~]/g, " ")

    // Remove Markdown link remnants.
    .replace(/\]\s*\(/g, " ")

    // Normalize whitespace.
    .replace(/\s+/g, " ")
    .trim();
}

function findContentMatch(
  content: string,
  query: string
) {
  if (!content || !query) return "";

  const lowerContent = content.toLowerCase();

  const matchIndex =
    lowerContent.indexOf(query);

  if (matchIndex === -1) return "";

  const sentences = content.split(
    /(?<=[.!?])\s+/
  );

  let position = 0;

  for (const sentence of sentences) {
    const sentenceStart = position;
    const sentenceEnd =
      position + sentence.length;

    if (
      matchIndex >= sentenceStart &&
      matchIndex <= sentenceEnd
    ) {
      const maxLength = 180;

      if (sentence.length <= maxLength) {
        return sentence.trim();
      }

      const localMatch =
        matchIndex - sentenceStart;

      const start = Math.max(
        0,
        localMatch - 70
      );

      const end = Math.min(
        sentence.length,
        start + maxLength
      );

      let preview = sentence
        .slice(start, end)
        .trim();

      if (start > 0) {
        preview = `…${preview}`;
      }

      if (end < sentence.length) {
        preview = `${preview}…`;
      }

      return preview;
    }

    position = sentenceEnd + 1;
  }

  return content.slice(
    Math.max(0, matchIndex - 70),
    matchIndex + 110
  );
}

function highlightMatch(
  text: string,
  query: string
) {
  if (!query) return text;

  const escaped = query.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const parts = text.split(
    new RegExp(`(${escaped})`, "gi")
  );

  return parts.map((part, index) =>
    part.toLowerCase() ===
    query.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}