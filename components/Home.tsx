import Link from "next/link";
import { site } from "@/lib/site-data";
import { getCollection } from "@/lib/content";
import Section from "@/components/Section";
import About from "@/components/About";
import Contact from "@/components/Contact";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";
import TechIcon from "@/components/TechIcon";

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

      {/* About + Skills */}
      <About />

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