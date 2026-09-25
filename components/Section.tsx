"use client";

import { useEffect, useRef } from "react";

export default function Section({
  command,
  title,
  children,
  id,
  headingLevel = "h2",
}: {
  command: string;
  title: string;
  children: React.ReactNode;
  id?: string;
  headingLevel?: "h1" | "h2";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className="section section-reveal">
      <div className="command">$ {command}</div>
      {headingLevel === "h1" ? <h1>{title}</h1> : <h2>{title}</h2>}
      {children}
    </section>
  );
}