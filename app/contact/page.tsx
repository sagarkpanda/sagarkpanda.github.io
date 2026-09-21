import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sagar Panda for infrastructure, DevOps, cloud, Kubernetes, and technical discussions.",
};

export default function ContactPage() {
  return (
    <main className="shell">
      <Contact />
    </main>
  );
}