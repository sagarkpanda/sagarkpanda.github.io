"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import SearchButton from "@/components/SearchButton";
import TechIcon from "@/components/TechIcon";
import { site } from "@/lib/site-data";

const links = [
  ["Home", "cd /", "/"],
  ["About", "cd /about", "/#about"],
  ["Skills", "cd /skills", "/#skills"],
  ["Projects", "cd /projects", "/#projects"],
  ["Experience", "cd /experience", "/#experience"],
  ["Contact", "cd /contact", "/contact/"],
  ["Blogs", "cd /blogs", "/blogs/"],
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const updateFromLocation = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        setActive(hash);
      } else if (window.location.pathname.startsWith("/blogs")) {
        setActive("blogs");
      } else if (window.location.pathname.startsWith("/contact")) {
        setActive("contact");
      } else {
        setActive("");
      }
    };

    updateFromLocation();
    window.addEventListener("hashchange", updateFromLocation);

    const sectionIds = [
      "about",
      "skills",
      "projects",
      "experience",
      "contact"
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (pathname === "/" && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                b.intersectionRatio - a.intersectionRatio
            )[0];

          if (visible) {
            setActive(visible.target.id);
          }
        },
        {
          rootMargin: "-18% 0px -62% 0px",
          threshold: [0.1, 0.25, 0.5],
        },
      );

      sections.forEach((section) => observer.observe(section));

      return () => {
        window.removeEventListener(
          "hashchange",
          updateFromLocation,
        );
        observer.disconnect();
      };
    }

    return () =>
      window.removeEventListener(
        "hashchange",
        updateFromLocation,
      );
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="shell nav">
        <Link
          href="/"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <span className="prompt">sagar@cloud</span>
          <span className="brand-path">:~$</span>
        </Link>

        <nav
          className={
            open ? "mobile-nav open" : "mobile-nav"
          }
          aria-label="Main navigation"
        >
          {links.map(
            ([desktopLabel, mobileLabel, href]) => {
              const key =
                desktopLabel === "Blogs"
                  ? "blogs"
                  : desktopLabel === "Contact"
                    ? "contact"
                    : href.replace("/#", "");

              const isActive = active === key;

              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    isActive ? "nav-active" : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-label-desktop">
                    {desktopLabel}
                  </span>

                  <span className="nav-label-mobile">
                    {mobileLabel}
                  </span>
                </Link>
              );
            },
          )}
        </nav>

        <div className="nav-actions">
          <SearchButton />

          <a
            href={site.social[0][1]}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="GitHub"
            title="GitHub"
          >
            <TechIcon name="GitHub" size={17} />
          </a>

          <ThemeToggle />

          <button
            type="button"
            className={
              open
                ? "menu-toggle is-open"
                : "menu-toggle"
            }
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}