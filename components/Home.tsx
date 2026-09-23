import Link from "next/link";
import { site } from "@/lib/site-data";
import { getCollection } from "@/lib/content";
import Section from "@/components/Section";
import Contact from "@/components/Contact";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";
import TechIcon from "@/components/TechIcon";
import {
  Activity,
  Boxes,
  Cloud,
  GitBranch,
  Layers3,
  ShieldCheck,
} from "lucide-react";

const skillGroups = [
  {
    name: "Cloud Platforms",
    icon: Cloud,
    skills: ["AWS", "Azure"],
  },
  {
    name: "Containers & Orchestration",
    icon: Boxes,
    skills: ["Kubernetes", "Helm", "Argo CD", "Kustomize", "Docker"],
  },
  {
    name: "Monitoring & Observability",
    icon: Activity,
    skills: ["Prometheus", "Grafana", "OpenTelemetry", "New Relic"],
  },
  {
    name: "CI/CD & Automation",
    icon: GitBranch,
    skills: ["GitHub Actions", "GitLab CI/CD", "Jenkins"],
  },
  {
    name: "Infrastructure as Code & Platforms",
    icon: Layers3,
    skills: [
      "Terraform",
      "Ansible",
      "Linux",
      "Apache HTTP Server",
      "NGINX",
    ],
  },
  {
    name: "Security & Tooling",
    icon: ShieldCheck,
    skills: ["SonarQube", "Trivy", "Falco"],
  },
];

const socialIcons: Record<string, string> = {
  GitHub: "GitHub",
  LinkedIn: "LinkedIn",
  Medium: "Medium",
};

export default function Home() {
  const posts = getCollection("blogs").slice(0, 5);
  const projects = getCollection("projects");

  return (
    <main className="shell home">
      <section className="hero">
        {/* <div className="terminal-line"><span className="prompt">sagar@cloud</span>:~$ whoami</div> */}
        <div className="terminal-line">$ whoami</div>

        <div className="hero-grid">
          <div>
            <div className="avatar-wrap">
              <img
                src={site.avatar}
                alt={site.name}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          <div>
            <h1>{site.name}</h1>
            <p className="hero-role">{site.role}</p>

            <p className="hero-copy">
              I build and operate cloud infrastructure, Kubernetes platforms,
              CI/CD systems, and secure delivery pipelines with AWS,
              Terraform, GitOps, and observability.
            </p>

            <div className="hero-actions">
              <Link href="/blogs/" className="button primary">
                read the blogs
              </Link>

              <a href={`mailto:${site.email}`} className="button">
                email
              </a>
            </div>

            <div className="socials" aria-label="Social links">
              {site.social
                .filter(([n]) => n !== "Email")
                .map(([n, u]) => (
                  <a
                    key={n}
                    href={u}
                    target={u.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={n}
                    title={n}
                  >
                    <TechIcon
                      name={socialIcons[n] ?? n}
                      size={18}
                    />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Section command="cat about.md" title="About Me" id="about">
        <div className="about-grid">
          <div>
            <p>
              Senior DevOps Engineer with 7+ years of experience building
              cloud-native platforms and automating software delivery.
            </p>

            <p>
              My work focuses on AWS, Kubernetes, Terraform, GitOps, CI/CD,
              observability, and DevSecOps. I document what I build through
              practical tutorials and projects.
            </p>

            <p>
              I prefer infrastructure that is reproducible, deployments that
              are boring, and systems that are easier to operate than they were
              yesterday.
            </p>
          </div>

          <div className="stats">
            <div>
              <strong>7+</strong>
              <span>years experience</span>
            </div>

            <div>
              <strong>AWS</strong>
              <span>cloud platform</span>
            </div>

            <div>
              <strong>K8s</strong>
              <span>platform focus</span>
            </div>

            <div>
              <strong>IaC</strong>
              <span>Terraform driven</span>
            </div>
          </div>
        </div>
      </Section>

      <Section command="kubectl get skills" title="Skills & Technologies" id="skills">
        <p className="section-lead">
          The stack I use to build, automate, secure, and operate cloud-native
          systems.
        </p>

        <div className="skill-categories">
          {skillGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <div className="skill-category" key={group.name}>
                <div className="skill-category-head">
                  <span className="skill-category-icon">
                    <GroupIcon size={19} />
                  </span>

                  <strong>{group.name}</strong>
                </div>

                <div className="skill-items">
                  {group.skills.map((skill) => (
                    <span className="skill-item" key={skill}>
                      <TechIcon name={skill} size={17} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        command="ls ~/projects --sort=impact"
        title="Projects"
        id="projects"
      >
        <p className="section-lead">
          Hands-on infrastructure and platform projects built around
          Kubernetes, AWS, GitOps, observability, and DevSecOps.
        </p>

        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard key={p.route} project={p} />
          ))}
        </div>
      </Section>

      <Section command="git log --work" title="Experience" id="experience">
        <div className="timeline">
          {site.experience.map((x) => (
            <div className="timeline-item" key={x.company}>
              <div className="timeline-marker" />

              <div>
                <div className="timeline-head">
                  <h3>
                    {x.role} ·{" "}
                    <a
                      href={x.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {x.company}
                    </a>
                  </h3>

                  <span>{x.date}</span>
                </div>

                <ul>
                  {x.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section command="cat ./education" title="Education" id="education">
        <div className="edu-grid">
          {site.education.map((e) => (
            <div className="terminal-card" key={e.degree}>
              <h3>{e.degree}</h3>

              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {e.school}
              </a>

              <p>
                {e.date} · GPA {e.gpa}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section command="tail -n 5 ~/blog" title="Latest Writing" id="blog">
        <p className="section-lead">
          Practical notes on DevOps, Kubernetes, AWS, CI/CD, observability,
          and security.
        </p>

        <div className="post-list">
          {posts.map((p) => (
            <PostCard key={p.route} post={p} />
          ))}
        </div>

        <Link className="text-link" href="/blogs/">
          cd /blogs → all posts
        </Link>
      </Section>

      <Contact />

      <footer className="footer">
        <span>$ echo "built by Sagar Panda"</span>

        <a
          href="https://status.sagarpanda.com"
          target="_blank"
          rel="noopener noreferrer"
          className="status-link"
        >
          <span className="status-tick">✓</span>
          <span className="status-text">All Systems Operational</span>
        </a>

        <span>
          © {new Date().getFullYear()} · Next.js · Tailwind CSS
        </span>
      </footer>
    </main>
  );
}