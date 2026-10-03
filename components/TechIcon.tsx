import type { SimpleIcon } from "simple-icons";
import {
  siHelm,
  siArgo,
  siKubernetes,
  siPrometheus,
  siGrafana,
  siOpentelemetry,
  siNewrelic,
  siGithubactions,
  siGitlab,
  siJenkins,
  siTerraform,
  siAnsible,
  siLinux,
  siApache,
  siNginx,
  siSonarqubeserver,
  siTrivy,
  siFalco,
  siGithub,
  siMedium,
  siDocker,
} from "simple-icons";
import { Code2 } from "lucide-react";

const icons: Record<string, SimpleIcon> = {
  siHelm,
  siArgo,
  siKubernetes,
  siPrometheus,
  siGrafana,
  siOpentelemetry,
  siNewrelic,
  siGithubactions,
  siGitlab,
  siJenkins,
  siTerraform,
  siAnsible,
  siLinux,
  siApache,
  siNginx,
  siSonarqubeserver,
  siTrivy,
  siFalco,
  siGithub,
  siMedium,
  siDocker,
};

const iconNames: Record<string, string> = {
  AWS: "siAmazonaws",
  "Microsoft Azure": "siMicrosoftazure",
  Kubernetes: "siKubernetes",
  Helm: "siHelm",
  "Argo CD": "siArgo",
  Kustomize: "siKustomize",
  Prometheus: "siPrometheus",
  Grafana: "siGrafana",
  OpenTelemetry: "siOpentelemetry",
  "New Relic": "siNewrelic",
  "GitHub Actions": "siGithubactions",
  "GitLab CI/CD": "siGitlab",
  Jenkins: "siJenkins",
  Terraform: "siTerraform",
  Ansible: "siAnsible",
  Linux: "siLinux",
  "Apache HTTP Server": "siApache",
  NGINX: "siNginx",
  SonarQube: "siSonarqubeserver",
  Trivy: "siTrivy",
  Falco: "siFalco",
  GitHub: "siGithub",
  LinkedIn: "siLinkedin",
  Medium: "siMedium",
  Docker: "siDocker",
};

export default function TechIcon({
  name,
  size = 17,
}: {
  name: string;
  size?: number;
}) {
  if (name === "LinkedIn") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className="brand-icon"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.997h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.289zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.559 20.452h3.557V8.997H3.559v11.455z" />
      </svg>
    );
  }

  const icon = icons[iconNames[name]];

  if (!icon) {
    return <Code2 size={size} aria-hidden="true" />;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className="brand-icon"
    >
      <path d={icon.path} />
    </svg>
  );
}