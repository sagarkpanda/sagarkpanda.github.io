---
date: '2023-06-22T19:26:10+05:30'
draft: false
title: 'Container Orchestration: Kubernetes 101'
description: Part I — Intro, Components and Architecture
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NoGlXoElqYHzO15bqlEErQ.png

tags:
  - kubernetes
  - k8s
  - devops
---

## Introduction:

[Kubernetes](https://kubernetes.io/docs/concepts/overview/), also known as K8s, is an open-source platform to automate deployment, scaling, and management of containerized applications or containers.

Containers are lightweight packages of an application including all the dependencies.

Docker is one such platform for creating containerised applications. Read more about getting started with docker here: [Dcoker - Containers for beginners]({{< relref "docker-setup" >}})

While we are able to conatinerize apps with docker, managing a large number of such applications becomes a hassle. Kubernetes provides a framework to manage these apps at a higer scale in an automated fashion.

## Features of Kubernetes:

1.  **Container orchestration:** K8s automates the deployment and management of containers across a cluster of machines. It handles tasks such as container scheduling, scaling, load balancing, and rolling updates.
2.  **Service discovery and load balancing:** K8s provides a built-in service discovery mechanism that allows containers to find and communicate with each other. It also offers load balancing capabilities to distribute incoming traffic across multiple instances of an application.
3.  **Scaling and self-healing:** K8s enables automatic scaling of application instances based on CPU usage, memory utilization, or custom metrics. It can also automatically restart containers that have failed, ensuring high availability of applications.
4.  **Configuration management:** K8s allows you to define and manage application configurations using declarative manifests. You can specify the desired state of your application, and Kubernetes will work to ensure that the actual state matches the desired state.
5.  **Storage orchestration:** K8s provides a way to manage persistent storage volumes and attach them to containers as needed. This allows applications to store and retrieve data even when containers are rescheduled or restarted.
6.  **Health monitoring and logging:** K8s offers tools for monitoring the health and performance of applications running in the cluster. It integrates with various logging and monitoring systems to collect and analyze container and application metrics.

## Some common terminologies in k8s:

**Pod**: A pod is smallest deployable unit in k8s. Its basically one or multiple applications inside a container.

**Node**: A machine in K8s is called as node.

**Cluster**: A collection of nodes as a logical layer is known as cluster.

**Deployment**: is a resource object that allows you to declaratively define and manage a set of identical pods. It provides a convenient way to manage the lifecycle of your applications running in the cluster.

**Service**: A kubernetes service provides ip to pods so they can communicate. Also it provides load balancing mechanism to handle requests.

**Replicaset**: It is a higher-level abstraction that ensures a specified number of identical pod replicas are running at all times. It is responsible for maintaining the desired state of a set of pods in a cluster.

**Kubectl**: Its a command line utility used to interact with k8s cluster.

## Architecture of K8s:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qAQrOQaO9Sjl3h6_BH7pdQ.png)

Kubernetes primarily consists of two types of nodes.

*   **Master Node** — 1 or more machine that manages the cluster.

This provides way to communicate to the user and takes care authentication and authorization.

*   **Worker Node** — Worker nodes are machine where our application(s) is/are deployed.

Worker nodes communicate with the master nodes to receive instructions and report the status of containers running on them.

### Components of Master Node:

**Api Server:**

The Kubernetes API is the front end of the Kubernetes control plane,
handling internal and external requests. The API server determines if a
request is valid, if it is then processes it.

**etcd**:

Configuration data and information about the state of the cluster lives
in etcd, a key-value store (db). Fault-tolerant and distributed, etcd
is designed to be the ultimate source of truth about the cluster.

**Controller Manager:**

Controllers take care of actually running the cluster, and contains several controller function. It consults the scheduler and makes sure the correct number of pods is running. If a pod goes down, controller
notices and responds. A controller connects services to pods, so requests go to the right endpoints.

**Scheduler:**

The scheduler considers the resource needs of a pod, such as CPU or
memory, along with the health of the cluster. Then it schedules the pod
to an appropriate compute node.

### Components of Worker Node:

**Kubelet**: is a component of the Kubernetes cluster architecture. It is responsible for managing and maintaining individual nodes (or worker nodes) within the cluster. Each node in a Kubernetes cluster runs a Kubelet process, which interacts with the control plane to ensure that containers are running and healthy on the node.

All the activities instructed from master node are passed to the worker node and executed via the kubelet.

**Container Runtime:** A container runtime is responsible for running and managing containers on a host machine. It provides an environment where containers can be created, started, stopped, and managed.

Examples are Docker, cri-o, containerd and etc.

**Kubeproxy:** It runs on each worker node and is responsible for network proxying and load balancing within the cluster.

```md
                    +-----------------------+
                    |      Master Node      |
                    +-----------------------+
                    |                       |
                    |   +----------------+  |
                    |   |   API Server   |  |
                    |   +----------------+  |
                    |            |          |
                    |            |          |
                    |   +----------------+  |
                    |   |      etcd      |  |
                    |   +----------------+  |
                    |            |          |
                    |            |          |
                    |   +----------------+  |
                    |   | Controller Mgr |  |
                    |   +----------------+  |
                    |            |          |
                    |            |          |
                    |   +----------------+  |
                    |   |    Scheduler   |  |
                    |   +----------------+  |
                    +-----------------------+
                                 |
                                 |
                    +-------------------------+
                    |                         |
              +------------+            +------------+
              | Worker Node|            | Worker Node|
              +------------+            +------------+
              |   Kubelet  |            |   Kubelet  |
              |  Container |            |  Container |
              |   Runtime  |            |   Runtime  |
              | kube-proxy |            | kube-proxy |
              +------------+            +------------+
```

To create a kubernetes cluster we need atleast 2 machines, one for master and 1 for worker. For development purpose, Minikube is a tool using which we can create a single machine cluster.

However self managed k8s cluster can be hard to manage in long run. So we can use managed services like AWS EKS or Azure AKS and many more.

In the next post, we’ll discuss how to create a managed cluster on AKS.

[**Checkout more artciles on K8s →**](/blogs/#kubernetes)