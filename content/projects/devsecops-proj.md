---
title: "Kubernetes DevSecOps"
date: 2026-08-14
summary: "End-to-end DevSecOps implementation from application code to Kubernetes runtime"
status: "completed"
# cover: "https://i.ibb.co/pjgVNXn4/x.png"

tags:
  - devsecops
  - kubernetes
  - github-actions
  - kyverno
  - falco
  - trivy
  - "SAST"
  - "DAST"
  - "SCA"

link: "https://github.com/sagarkpanda/otel-labs-platform"
blogLink: "/blogs/devsecops"
draft: false
---

## Kubernetes DevSecOps – End-to-End Security from Code to Runtime

{{< figure src="https://i.ibb.co/nMdLT5ZQ/proj-arch.png" alt="arch" width="1000" height="600" title="Project Overview" >}}


### Complete DevSecOps implementation spanning application code, container images, infrastructure, Kubernetes policies, runtime detection, and dynamic application testing.

This project demonstrates security controls integrated throughout the software delivery lifecycle rather than treated as a final security check.

The implementation uses **OTel Labs** as the instrumented application and **OTel Labs Platform** for infrastructure, Kubernetes, CI/CD, and security controls.

Builds on the [OTel on EKS](/projects/k8s-otel-proj/) infrastructure foundation.

## Security Layers

Security is implemented across seven distinct layers:

```mermaid
graph TD
    A["Application Layer<br/>Gitleaks, Semgrep<br/>Dependabot"]
    B["Artifact Layer<br/>Trivy FS, Trivy Image<br/>SBOM"]
    C["Infrastructure Layer<br/>Trivy Config<br/>GitHub Security"]
    D["Admission Control<br/>Kyverno Policies<br/>Policy Exceptions"]
    E["Runtime Layer<br/>Falco<br/>FalcoSidekick"]
    F["Testing Layer<br/>OWASP ZAP DAST"]
    G["Findings Layer<br/>DefectDojo"]

    A --> B --> C --> D --> E --> F --> G
```

## Architecture

```mermaid
flowchart TB
    APP["Application Repo<br/><b>otel-labs</b>"]

    APPSCAN["Security Scanning<br/>Gitleaks<br/>Semgrep<br/>Trivy FS"]

    BUILD["Build & Scan<br/>Container Images<br/>Trivy Image<br/>Push to GHCR"]

    GITOPS["GitOps Promotion<br/>Update image tags"]

    PLATFORM["Platform Repo<br/><b>otel-labs-platform</b>"]

    PLAFSCAN["Security Scanning<br/>Gitleaks<br/>Trivy Config"]

    ARGOCD["ArgoCD Sync<br/>Kyverno Policies<br/>Applications"]

    K8S["Kubernetes Cluster<br/>Kyverno Admission<br/>Falco Runtime"]

    DAST["OWASP ZAP<br/>Dynamic Testing"]

    DD["DefectDojo<br/>Centralized Findings"]

    APP --> APPSCAN --> BUILD --> GITOPS --> PLATFORM
    PLATFORM --> PLAFSCAN --> ARGOCD --> K8S
    K8S --> DAST --> DD

    classDef repo fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef scan fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef deploy fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef central fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff

    class APP,PLATFORM repo
    class APPSCAN,PLAFSCAN,BUILD,DAST scan
    class ARGOCD,K8S deploy
    class DD central
```

## Scanning & Detection

```mermaid
graph LR
    SRC["Source Code"]
    DEP["Dependencies"]
    IMG["Container Image"]
    INF["Infrastructure"]
    ADM["Admission"]
    RUN["Runtime"]
    APP["Application"]

    SRC -->|Gitleaks<br/>Semgrep| SC["Secrets & SAST"]
    DEP -->|Trivy FS<br/>Dependabot| DD["SCA"]
    IMG -->|Trivy Image| DI["Container Vulns"]
    INF -->|Trivy Config| CI["Config Issues"]
    ADM -->|Kyverno| KP["Policy Enforcement"]
    RUN -->|Falco| FR["Runtime Detection"]
    APP -->|OWASP ZAP| AD["Application Vulns"]

    SC --> DF["DefectDojo<br/>Centralized Findings"]
    DD --> DF
    DI --> DF
    CI --> DF
    KP --> DF
    FR --> DF
    AD --> DF
```

## Repositories

**Application Repository:** [{{< icon name="github" size="lg" >}} otel-labs](https://github.com/sagarkpanda/otel-labs)
* Source code for Node.js, Python, and Go services
* Application security scanning (Gitleaks, Semgrep, Trivy)
* Container image builds and publishing to GHCR

**Platform Repository:** [{{< icon name="github" size="lg" >}} otel-labs-platform](https://github.com/sagarkpanda/otel-labs-platform)
* Terraform infrastructure (EKS, VPC, networking)
* Kubernetes manifests and ArgoCD applications
* Kyverno security policies and exceptions
* Infrastructure and configuration scanning
* OWASP ZAP DAST configuration

## Components

### Application Layer Security

| Tool | Purpose |
|------|---------|
| **Gitleaks** | Secret detection in code and Git history |
| **Semgrep** | SAST — insecure coding patterns |
| **Dependabot** | Automated dependency updates |

### Artifact & Infrastructure Layer

| Tool | Purpose |
|------|---------|
| **Trivy FS** | SCA — dependency vulnerability scanning |
| **Trivy Image** | Container image vulnerability scanning |
| **Trivy Config** | Terraform and Kubernetes configuration scanning |

### Kubernetes & Runtime Layer

| Tool | Purpose |
|------|---------|
| **Kyverno** | Admission control and security policy enforcement |
| **Falco** | Runtime behavior detection and alerting |
| **OWASP ZAP** | Dynamic application security testing |

### Findings Management

| Tool | Purpose |
|------|---------|
| **GitHub Security** | Centralized SARIF findings in GitHub |
| **DefectDojo** | Centralized vulnerability management across all scanners |

## Key Features

✅ **Application Security** — Gitleaks, Semgrep, Trivy scanning across multiple languages (Node.js, Python, Go)

✅ **Infrastructure as Code Scanning** — Terraform and Kubernetes manifest validation

✅ **Kubernetes Admission Control** — Kyverno policies enforcing image tags, resource limits, trusted registries

✅ **Policy Exceptions** — Scoped exceptions for legitimate platform workloads

✅ **Runtime Security** — Falco detecting suspicious process execution and file access

✅ **Dynamic Testing** — OWASP ZAP scanning deployed applications

✅ **Centralized Findings** — DefectDojo aggregating results from all security tools

✅ **GitOps Integration** — Security scanning triggered by GitHub Actions, results fed to DefectDojo

## Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GA as GitHub Actions
    participant GH as GHCR
    participant AC as ArgoCD
    participant K8s as Kubernetes
    participant ZAP as OWASP ZAP
    participant DD as DefectDojo

    Dev->>GA: Push to otel-labs
    GA->>GA: Gitleaks, Semgrep, Trivy FS
    GA->>GH: Build & Scan Images
    GA->>AC: Update image tags

    AC->>K8s: Sync manifests
    K8s->>K8s: Kyverno validation
    K8s->>K8s: Deploy workloads
    K8s->>K8s: Falco monitoring

    K8s->>ZAP: Application ready
    ZAP->>ZAP: Run DAST scan

    GA->>DD: Report findings
    ZAP->>DD: Report findings

    DD->>Dev: Security dashboard
```

## Deployment

### Prerequisites

* AWS account with EKS permissions
* kubectl configured
* GitHub repositories set up
* DefectDojo instance (local or cloud)

### Bootstrap

Provision the infrastructure:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

The bootstrap script automatically installs:
* ArgoCD
* Kyverno
* Falco

### Configure Security Workflows

Set GitHub Actions secrets in both repositories:

```text
DEFECTDOJO_URL
DEFECTDOJO_API_KEY
```

### Deploy Applications

Applications deploy via ArgoCD using the GitOps pattern:

```bash
kubectl apply -f k8s/argo-apps/root-app.yml
```

Or individually:

```bash
kubectl apply -f k8s/argo-apps/kyverno-policy.yml
kubectl apply -f k8s/argo-apps/traefik-app.yml
kubectl apply -f k8s/argo-apps/node-frontend-app.yml
# ... etc
```

## End-to-End Flow

```mermaid
graph TD
    A["Code Commit<br/>otel-labs main"]
    B["Application<br/>Security Layer"]
    C["Gitleaks<br/>Semgrep<br/>Dependabot"]
    D["Build & Artifact<br/>Security Layer"]
    E["Trivy FS<br/>Trivy Image<br/>SBOM"]
    F["Container Push<br/>to GHCR"]
    G["GitOps Promotion<br/>to platform repo"]
    H["Infrastructure<br/>Security Layer"]
    I["Gitleaks<br/>Trivy Config"]
    J["ArgoCD Sync"]
    K["Kubernetes Cluster"]
    L["Admission Control"]
    M["Kyverno<br/>Policies"]
    N["Accepted<br/>Workloads"]
    O["Runtime<br/>Security Layer"]
    P["Falco<br/>FalcoSidekick"]
    Q["Application Testing"]
    R["OWASP ZAP<br/>DAST"]
    S["Findings<br/>Management"]
    T["DefectDojo<br/>Centralized View"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P
    P --> Q
    Q --> R
    R --> S
    S --> T

    C -.->|SARIF| T
    E -.->|SARIF| T
    I -.->|SARIF| T
    P -.->|Events| T
    R -.->|XML| T
```

## Blog Post

For a detailed walkthrough of the complete implementation, architecture decisions, and hands-on examples, see:

[**End-to-End DevSecOps on EKS: Code, Containers, Kubernetes & Runtime Security**](/blogs/devsecops/)

The blog covers:
* Application security scanning (Gitleaks, Semgrep, Trivy)
* Infrastructure scanning (Trivy Config)
* Kyverno concepts and policy enforcement
* Falco runtime detection with practical examples
* OWASP ZAP dynamic testing
* DefectDojo centralized findings management
* End-to-end deployment and setup

## Implementation Status

```mermaid
graph LR
    A["Source Code"] -->|✅| B["Dependencies"]
    B -->|✅| C["Container Image"]
    C -->|✅| D["Infrastructure"]
    D -->|✅| E["Kubernetes"]
    E -->|✅| F["Admission Control"]
    F -->|✅| G["Runtime"]
    G -->|✅| H["Application"]
    H -->|✅| I["Centralized Findings"]

    classDef complete fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    class A,B,C,D,E,F,G,H,I complete
```

### Completed

* ✅ Gitleaks secret scanning (application + platform repos)
* ✅ Semgrep SAST analysis
* ✅ Dependabot dependency updates
* ✅ Trivy filesystem scanning (SCA)
* ✅ Trivy container image scanning
* ✅ Trivy configuration scanning (Terraform + Kubernetes)
* ✅ GitHub Security integration (SARIF uploads)
* ✅ DefectDojo centralized findings management
* ✅ Kyverno admission policies (image tags, resource limits, trusted registries)
* ✅ Kyverno policy exceptions (scoped exemptions)
* ✅ Falco runtime security with FalcoSidekick
* ✅ OWASP ZAP DAST integration
* ✅ End-to-end workflow validation
* ✅ Comprehensive blog documentation

## Related Projects

[**Infrastructure foundation and observability setup: OTel on EKS**](/projects/k8s-otel-proj/)
