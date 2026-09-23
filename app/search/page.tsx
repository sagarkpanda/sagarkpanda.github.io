import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Sagar Panda's blog.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/search/",
  },
};

export const dynamic = "force-static";

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="shell page-shell" />}>
      <SearchPageClient />
    </Suspense>
  );
}