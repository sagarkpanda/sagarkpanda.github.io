import type { Metadata } from "next";
import About from "@/components/About";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Sagar Panda, a DevOps and Cloud Infrastructure Engineer specializing in AWS, Kubernetes, Terraform, CI/CD, GitOps, observability, and DevSecOps.",
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "About | Sagar Panda",
    description:
      "About Sagar Panda, a DevOps and Cloud Infrastructure Engineer specializing in AWS, Kubernetes, Terraform, CI/CD, GitOps, observability, and DevSecOps.",
    url: "/about/",
    type: "profile",
    images: [
      {
        url: "/images/og-image.png",
        alt: "Sagar Panda — DevOps and Cloud Infrastructure Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Sagar Panda",
    description:
      "About Sagar Panda, a DevOps and Cloud Infrastructure Engineer specializing in AWS, Kubernetes, Terraform, CI/CD, GitOps, observability, and DevSecOps.",
    images: ["/images/og-image.png"],
  },
};

export default function AboutPage() {
  const aboutUrl = `${site.url}/about/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${aboutUrl}#profilepage`,
        url: aboutUrl,
        name: "About | Sagar Panda",
        mainEntity: {
          "@id": `${site.url}/#person`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${aboutUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${site.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: aboutUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main className="shell">
        <About headingLevel="h1" />
      </main>
    </>
  );
}