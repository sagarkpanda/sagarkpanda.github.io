---
title: "Kubernetes DevSecOps"
date: 2026-07-01
summary: "End-to-end DevSecOps implementation from application code to Kubernetes runtime"
status: "in_progress"

tags:
 - devsecops
 - kubernetes
 - "SAST"
 - "DAST"

link: "https://github.com/sagarkpanda/otel-labs"
---

An end-to-end Kubernetes DevSecOps implementation covering the software delivery lifecycle from application code to Kubernetes runtime.

The project uses **OTel Labs** as the application workload and **OTel Labs Platform** for the infrastructure, Kubernetes, CI/CD, and security controls.

Security is implemented across the **code-to-cluster** lifecycle:

* **Source code:** SAST and secret detection
* **Dependencies & IaC:** SCA and configuration scanning
* **Container images:** vulnerability scanning and SBOM
* **Kubernetes:** manifest and configuration security
* **Admission control:** Kyverno security policies
* **Network security:** Kubernetes network policies
* **Runtime:** Falco runtime security
* **Application:** DAST with OWASP ZAP
* **Security findings:** centralized vulnerability reporting

The goal is to demonstrate how security controls can be integrated throughout the software delivery lifecycle rather than treated as a final security check.

## Repositories

**Application Repo:** {{< icon name="github" size="lg" >}} [otel-labs](https://github.com/sagarkpanda/otel-labs)

**Config and Manifests Repo:** {{< icon name="github" size="lg" >}} [otel-labs-platform](https://github.com/sagarkpanda/otel-labs-platform)

## Status

## Work in progress — progressively implementing and documenting the complete DevSecOps workflow.

### Completed

* Application and platform repositories established
* Container image build, tagging and GHCR publishing
* GitHub Actions CI/CD and GitOps promotion
* Gitleaks secret scanning
* Semgrep SAST
* Dependency Review
* Trivy filesystem scanning
* Trivy container image scanning
* SBOM generation
* Trivy Terraform, Kubernetes and configuration scanning
* DefectDojo security finding management
* Kubernetes deployment through Argo CD
* Kyverno admission policies
* OWASP ZAP DAST integration

### Pending

* Falco runtime security
* Final end-to-end DevSecOps workflow validation

> The project is being implemented progressively from **source code → dependencies → container → infrastructure → Kubernetes → admission control → runtime security**.

Last updated: August 9, 2026
