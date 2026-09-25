import type { Metadata } from "next";
import About from "@/components/About";

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
  },
};

export default function AboutPage() {
  return (
    <main className="shell">
      <About />
    </main>
  );
}