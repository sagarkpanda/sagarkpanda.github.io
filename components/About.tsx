import Section from "@/components/Section";
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

export default function About() {
  return (
    <Section command="cat about.md" title="About Me" id="about">
      {/* Existing About content — unchanged */}
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

      {/* Skills remain visually identical to the old Skills section */}
      <div className="about-skills">
        <div className="command">$ kubectl get skills</div>

        <h2>Skills &amp; Technologies</h2>

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
      </div>
    </Section>
  );
}