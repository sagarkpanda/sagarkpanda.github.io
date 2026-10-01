export const site = {
  name: "Sagar Panda",
  title: "Sagar Panda | DevOps & Cloud Engineer",
  description:"DevOps and Cloud Engineer specializing in AWS, Kubernetes, Terraform, CI/CD, observability, and DevSecOps.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "sagar.chip239@aleeas.com",
  avatar: "/images/circle_profile.webp",
  role: "DevOps & Cloud Infrastructure Engineer",
  bio: "A DevOps engineer focused on cloud infrastructure, automation, and scalable platforms. I enjoy designing resilient systems, improving deployment pipelines, and making software delivery faster and more reliable.",
  social: [
    ["GitHub", "https://github.com/sagarkpanda"],
    ["LinkedIn", "https://www.linkedin.com/in/sagarkpanda/"],
    ["Medium", "https://sagarkpanda.medium.com/"],
    ["Email", "mailto:sagar.chip239@aleeas.com"]
  ],
  skills: ["AWS", "Jenkins", "GitHub Actions", "GitLab CI/CD", "Ansible", "Terraform", "Docker", "Kubernetes", "Argo CD", "Linux", "Apache/Nginx", "SonarQube", "Prometheus", "Grafana", "OpenTelemetry", "Kyverno", "Falco", "Trivy", "GitOps"],
  experience: [
    { company: "Wipro", role: "Sr. Software Engineer", date: "Nov 2024 – Present", url: "https://www.wipro.com/", bullets: ["Led migration of 30+ microservices to Kubernetes via GitOps with Argo CD.", "Managed Kubernetes resources with Helm and Kustomize across environments.", "Designed GitLab CI pipelines with Semgrep SAST and integrated Vault for secrets.", "Implemented OpenTelemetry-based distributed tracing and observability."] },
    { company: "Valeo", role: "DevOps Engineer", date: "Aug 2023 – Oct 2024", url: "https://www.valeo.com/en/", bullets: ["Optimized Jenkins pipelines across 10+ concurrent automotive projects.", "Automated quality and security scanning with SonarQube and KlocWork.", "Managed AWS infrastructure using Terraform.", "Implemented Prometheus and Grafana monitoring across environments."] },
    { company: "Waycool Foods", role: "DevOps Engineer", date: "Jan 2022 – Jul 2023", url: "https://waycool.in", bullets: ["Established foundational DevOps practices using Jenkins, Docker, SonarQube, and Nexus.", "Migrated applications to AWS/Azure using Nginx and Apache on Linux.", "Built Kubernetes and Terraform proof-of-concepts.", "Implemented TLS and removed insecure deployment practices."] },
    { company: "Straive", role: "Automation Engineer", date: "Nov 2019 – Jan 2022", url: "https://www.straive.com", bullets: ["Automated web application testing using Python, Selenium, and SQL.", "Configured AWS-based CI environments with Jenkins and SonarQube."] }
  ],
  education: [
    { degree: "Master of Computer Applications", school: "Biju Pattnaik University of Technology, Odisha", date: "2015 – 2018", gpa: "8.2 / 10", url: "https://www.bput.ac.in" },
    { degree: "Bachelor of Computer Applications", school: "Berhampur University, Odisha", date: "2012 – 2015", gpa: "7.8 / 10", url: "https://buodisha.edu.in/" }
  ]
};
