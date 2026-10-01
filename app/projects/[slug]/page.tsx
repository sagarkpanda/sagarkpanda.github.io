import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getItem } from "@/lib/content";
import MarkdownContent from "@/components/MarkdownContent";

const normalizeTag = (tag: string) => {
  const aliases: Record<string, string> = {
    "new relic": "New Relic", opentelemetry: "OpenTelemetry", kubernetes: "Kubernetes", "github actions": "GitHub Actions",
    "gitlab ci/cd": "GitLab CI/CD", trivy: "Trivy", falco: "Falco", sonarqube: "SonarQube", terraform: "Terraform", ansible: "Ansible", nginx: "NGINX"
  };
  return aliases[tag.toLowerCase()] ?? tag;
};

export const dynamicParams = false;
export function generateStaticParams() { return getCollection("projects").map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = getItem("projects", [slug]);
  return p ? { title: `${p.data.title} | Sagar Panda`, description: String(p.data.summary || "") } : {};
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = getItem("projects", [slug]); if (!p) notFound();
  const tags = (p.data.tags || []).map((tag) => normalizeTag(String(tag)));
  return <main className="shell"><article>
    <header className="article-header"><div className="eyebrow">~/projects/{p.slug}</div><h1>{p.data.title}</h1><p>{p.data.summary}</p>
      <div className="article-meta">{p.data.date} · {String(p.data.status || "")}{p.data.link && <> · <a href={String(p.data.link)} target="_blank" rel="noopener noreferrer">GitHub ↗</a></>}</div>
      {!!tags.length && <div className="tags project-tags">{tags.map((tag) => <span className="tech-chip" key={tag}>{tag}</span>)}</div>}
    </header>
    <div className="article-body"><MarkdownContent source={p.content}/></div>
  </article></main>;
}
