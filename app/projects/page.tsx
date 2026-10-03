import { getCollection } from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  const projects = getCollection("projects");

  return (
    <main id="main-content" className="shell">
      <section className="section">
        <div className="command">
          $ ls ~/projects --sort=impact
        </div>

        <h1>Projects</h1>

        <p className="section-lead">
          Hands-on infrastructure and platform work.
        </p>

        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard
              key={p.route}
              project={p}
            />
          ))}
        </div>
      </section>
    </main>
  );
}