---
date: '2026-04-07T10:30:10+05:30'
draft: false
title: 'Kubernetes StatefulSets Explained - When and Why to Use Them'
Description: 'Part XV: Understanding Stable Pod Identity, Headless Services, and Persistent Storage in StatefulSets'
tags:
  - kubernetes
  - statefulset
  - pv
  - pvc
url: "/blogs/k8s/statefulset/"
aliases:
    - /blogs/statefulset/
---

![Image Souce: KubeBlogs](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jhtaeySqKrPpqKg8p3WRqA.png)

### What is StatefulSet

StatefulSets are used to manage stateful applications, such as databases or other applications that keep track of their state. By using StatefulSets, a set of pods can be deployed and scaled, ensuring that they are ordered and unique.

### Why use StatefulSet

Since ips are random, we have hostname as a stable way to connect to pods. However, when we deploy any app, the service generally have hostname like this and since pod names are also generated with random characters it would become difficult to track them.

```
podname.svcname.namespace.svc.cluster.local
```

In such case when we use statefultset, we would get stable pod name and from which we can identify the sequene of pods created.

Example: For MySQL, if we want to create the first pod as master pod and the next ones as read replicas, we can make mysql-0 pod as master.

### Pod Identity and Ordering

StatefulSet pods have a unique ordinal index (0, 1, 2…). This provides:

*   **Ordered Startup:** Pods start from **0 to N-1**. `web-1` will not start until `web-0` is "Running and Ready."
*   **Ordered Termination:** When scaling down, pods are deleted in reverse (N-1 down to 0) to ensure data is safely offloaded from “workers” before “masters.”

```
#sf.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
 name: web
spec:
 template:
  metadata:
   labels:
    app: web
  spec:
   containers:
   - name: web
     image: quay.io/gauravkumar9130/nginxdemo
 replicas: 3
 selector:
  matchLabels:
   app: web
 serviceName: sfsvc
```

Once we apply we can list the pods and we shall notice sequential pod creation.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LFV98-_fFgOftlNHhXI9Wg.png)

**Test Query:** The DNS entry remains the same even if a pod is deleted. Even if the IP changes, we don’t need to worry. Say we connect our frontend app to the DB in read-mode; it always connects to the specific pod index we want (e.g., `web-1`).

![captionless image](https://miro.medium.com/v2/format:webp/1*FiXvygFGrPPTMZuucHOlbA.png)

If we scale up and down, the change are also going to be sequential.

![captionless image](https://miro.medium.com/v2/resize:fit:1188/format:webp/1*P5t0wzIZaGMpxyZ8_1qe8g.png)

### Headless Service

Headless service is a regular Kubernetes service where the **spec.clusterIP** is explicitly set to “None” and **spec.type** is set to “ClusterIP”. Instead, SRV records are created for all the named ports of service’s endpoints.

**DNS Format:** `podname.svcname.namespace.svc.cluster.local`

```
apiVersion: v1
kind: Service
metadata:
 name: <HEAD LESS SERVICE NAME this needs to be
matched with the svc name in sf>
spec:
 ports:
 - port: 80
 selector:
  app: web
 clusterIP: None
```

Apply it, and list all the services, we can see clusterIP set to None for headless service.

![captionless image](https://miro.medium.com/v2/resize:fit:1218/format:webp/1*Xh-8509zrREO7TBkfYsnjA.png)

### Using VolumeClaimTemplates

StatefulSets uses `volumeClaimTemplates` to provide **dedicated storage** to each pod. In a Deployment, all pods share the same volume; in a StatefulSet, each pod gets its own.

1.  **Sticky Storage:** If `web-0` is deleted, the new `web-0` will automatically re-attach to the same Persistent Volume.
2.  **Safety:** PVCs are not deleted when a StatefulSet is deleted, preventing accidental data loss.

### Taking an existing storage class

There are several storage classes in azure, to view them list all the sorage classes.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xiL8phtTJ6dabIQp6uj5lQ.png)

As we can see there are multiple with different binding mode. lets take managed as it waits for the storage to be claimed first before creating the volumes.

```
#sf_vol.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
 name: myweb-statefulset
spec:
 serviceName: myweb-hsvc
 replicas: 5
 selector:
  matchLabels:
   app: web
 template:
  metadata:
   labels:
    app: web
  spec:
   containers:
   - name: web
     image: quay.io/gauravkumar9130/nginxdemo
     volumeMounts:
     - mountPath: /mydata
       name: data-volume
 volumeClaimTemplates:
 - metadata:
    name: data-volume
   spec:
    storageClassName: managed
    accessModes:
     - ReadWriteOnce
    resources:
     requests:
       storage: 500Mi
```

Apply the config and list all the pods and PVCs. You will see that each pod index now has a corresponding volume claim that persists through pod restarts.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vccghxbBnH85me9yibZijw.png)

### Summary

StatefulSets are the key to running databases and other state-heavy applications on Kubernetes. By providing each pod with a **unique ID**, a **stable hostname**, and its own **dedicated storage**, we ensure that our data stays safe and our cluster remains predictable even during restarts or scaling.

[Read more on K8s →](/blogs/#kubernetes)