---
date: '2024-06-10T19:26:10+05:30'
draft: false
title: 'Monitoring Kubernetes Cluster with Prometheus and Grafana'
Description: Part XIII — Helm setup to Monitor your k8s infra using Prometheus and Grafana.
image: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3KFSsDiBc2tqs8HhPJmTJA.png
tags:
  - kubernetes
  - monitoring
  - devops
  - prometheus
  - grafana
  - observability
---

## Introduction:

Keeping an eye on your Kubernetes cluster can feel like a daunting task, but with the right tools, it doesn’t have to be. Prometheus and Grafana – two fantastic open-source tools that make monitoring and visualizing your cluster easy.

Lets look into how you can use Prometheus and Grafana to keep tabs on your Kubernetes cluster. Lets look into how you can set up, the basics of configuring them.

## Setup suing helm:

Will be using helm to install both these tools to avoid writing multiple yamls for various components.

Get familiar with helm, checkout this artcle → [Helm — Your Compass in the Kubernetes Universe]({{< relref "helm" >}})

Lets roll.

First add Prometheus to the repo and update the helm repository.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HVZN7OzBxTvDo3PsI8-v-g.png)

Install Prometheus with the command below.

```
helm install prometheus prometheus-community/prometheus
```

We can use **_kubectl get all_** command to list all the resources and see all the pods, svcs and deployment belongings to prom.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SYCGHtRns-uRxlVjmLGmAA.png)

To access the prom web ui, expose the service named “Prometheus-server”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jEVBXRdGH_2TEfwrGt-e4A.png)

With the newly exposed service we have an external/public IP which we can use to get the prom web ui.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*M8VP5cQWzlWQqEWDNZpPgQ.png)

In the Status → targets, we see all the endpoints where Prometheus is getting the metrics from.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l3H5l1G4wSGUysR3OCpivA.png)

### Install Grafana:

Similarly how we did for prom, we add the grafana repo and update it.

```
 helm repo add grafana https://grafana.github.io/helm-charts
 helm repo update

 helm install grafana grafana/grafana
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*rMRh0YuIKkiMNmhKazIejw.png)

Expose grafana service to be able to access the web interface.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*X7IuA_RY2lryzcGbqVBBng.png)

The default username is **admin**, and to get the password, use kubectl get secret command.

```
kctl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FrohJphSab8z2QMgKRWHpw.png)

You can change the password if you want after login.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*woTIgICCDkblofgvtEWPKQ.png)

Click on Data sources and select Prometheus, fill out the connection details. Click save and test the connection.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6grT1OSfGDSpHJbmFOQJVQ.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Bkf5KHxWN-ElgTkpYjwofg.png)

Now I will create a dashboard. You can create your own or import existing dashboards from grafana. For this example, I’m going to import a few.

From the Prometheus home page, click on Dashboards, choose import and use 315 or similar.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ujf41dBLY-XlM1kAXir_9Q.png)

Once it’s added, we should be able to view the data.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aFJhHxV4pb7j8g02T8MhCQ.png)

### Kube-state matrics:

**Kube state metrics** service provides many metrics for `deployments`, `pods`, `jobs`, `cronjobs` etc. which is not available by default.The service has been created however we need to expose it and change Prometheus config.

```
kctl expose service prometheus-kube-state-metrics --type=NodePort --target-port=8080 --name=prom-kstate-ext
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bFGBqNJ6nvxvjAA-JuEg2Q.png)

Add the metrics end point as a scrape config job in the Prometheus config.

![captionless image](https://miro.medium.com/v2/resize:fit:1356/format:webp/1*Dea8QU5VrByZwBlhsjVRBA.png)

You can add even more dashboards for different metrics. Example: 6417 for pod metrics

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xWuMTkoAABZvlaapMwYX1w.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pCWTFKgfnspND_3hVMexTg.png)

## Wrap Up:

There we have it. Monitoring K8s with prom and grafana. Next experiment is to configure alert manager for email alerts.

[**Checkout more artciles on K8s →**](/blogs/#kubernetes)