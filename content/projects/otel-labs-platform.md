---
title: "OTel Labs Platform"
date: 2026-01-15
summary: "GitOps infrastructure and Kubernetes platform for an OpenTelemetry observability demo, provisioned on Amazon EKS."
status: "completed"
tags:
  - "traefik"
  - "opentelemetry"
  - "new-relic"
  - "honeycomb"
link: "https://github.com/sagarkpanda/otel-labs-platform"
---

Provisions an Amazon EKS cluster with Terraform and deploys the platform components (ArgoCD, Traefik, OpenTelemetry Collector, and observability tooling) using GitOps. The companion [otel-labs](https://github.com/sagarkpanda/otel-labs) repo holds the instrumented demo apps (Node frontend, Python orders API, Go inventory API); this repo builds and operates the cluster they run on.

<div class="flex flex-wrap gap-3 my-6">
  <img src="/images/aws.svg" alt="AWS / EKS" title="AWS / EKS" class="h-8 w-8" loading="lazy" />
  <img src="/images/terraform.svg" alt="Terraform" title="Terraform" class="h-8 w-8" loading="lazy" />
  <img src="/images/argo.svg" alt="ArgoCD" title="ArgoCD" class="h-8 w-8" loading="lazy" />
  <img src="/images/kubernetes.svg" alt="Kubernetes" title="Kubernetes" class="h-8 w-8" loading="lazy" />
</div>

**Infrastructure** (Terraform): VPC, public subnets, EKS cluster, managed node group, EKS addons.

**GitOps** (ArgoCD): Traefik, OpenTelemetry Collector, kube-state-metrics, and the three demo services.

**Observability**: the OpenTelemetry Collector gathers metrics, logs, and traces — including cluster-level telemetry via kubeletstats, k8s_cluster, and kube-state-metrics — and exports it to both New Relic and Honeycomb.

Read the full write-up: [Building a Kubernetes Observability Platform with OpenTelemetry](https://sagarpanda.com/blogs/monitoring/otel-on-eks/).
