---
date: '2024-04-07T19:26:10+05:30'
draft: false
title: 'Part IX — Using Domain name with TLS Cert for Nginx Ingress Controller.'
Description: Ingress in K8s — Name based Routing with TLS
tags:
  - nginx
  - tls
  - k8s
  - ingress
  - devops
---

![captionless image](https://miro.medium.com/v2/resize:fit:1356/format:webp/1*yecPvYFABn0s-xmGCJLLbA.png)

### Preface:

In the [**_previous article_**](https://medium.com/faun/nginx-ingress-controller-for-kubernetes-networking-8a452fb66d62) we saw how to use nginx ingress for routing. Today we will experiment with adding domain to our app and will also use TLS cert for the domain.

### Getting started:

A valid domain is required for this experiment.

If you have domain outside of azure, then add the name server from azure.

Create dns zone. Change the name server in the providers dns management section to be able to manage dns records from azure itself.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LSQoCbUyTeIr2gy6v7Fcmw.png)

Now create a managed identity(You can use even service principals).

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tf-rxPBFlirmb-yZbaBZVA.png)

Assign contributor role to the identity.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*uXRkZj7_Lx1Dwvnqzloskw.png)

Add any external dns. Update the json with azure ac details.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9tZBTzeoHKo3ylEM412-4w.png)

Add the identity to vm scale set.


Create secret based on the azure.json and apply the external dns yaml. The yaml uses this secret.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YT8HKJpuMIa0VLGdufDLxw.png)

And apply the external dns.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IQS8uL8x_FF0qgspsHXt0A.png)

Now apply the ingress resource.

```
kctl apply -f named_ingress.yml
```
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
 name: host-ingress
 annotations:
  kubernetes.io/ingress.class: nginx
spec:
 ingressClassName: nginx
 rules:
 - host: hotel.sagarpanda.com
   http:
    paths:
    - path: /
      pathType: Exact
      backend:
       service:
         name: hotel
         port:
          number: 80

 - host: coffee.sagarpanda.com
   http:
    paths:
    - path: /
      pathType: Exact
      backend:
       service:
         name: coffee
         port:
          number: 80

```

Once we do that, we can see dns records getting created automatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s8ggDaJJ-32m0anNpuvWsw.png)
<br> </br>
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6x_tbHvh0jQftD3Ll4Zlfg.png)

get ip of the ingress and browse.

```
kctl get ingress
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZZbzHAMDy-B04JGsE96ooA.png)

There we go. Our ingress is working fine and routing works fine.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DpCKJ_1WVxWjfGisIr1mbg.png)

Adding TLS:
-----------

Now that our app is set and working fine, lets add ssl certificate.

Note: Here I’m using lets encrypt cert.
First we need to install the cert manager.

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.yaml
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x12aUNAfiEFDJEGtlUY-zw.png)

Create a certIssuer with cert provider details.

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  #use valid mail or it wont work
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Get the secret created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3K7BLGZfT9mY05FY_WetTw.png)

Update the ingress with the TLS details.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: host-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  rules:
  - host: hotel.sagarpanda.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hotel
            port:
              number: 80
  - host: coffee.sagarpanda.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: coffee
            port:
              number: 80
  tls:
  - hosts:
    - hotel.sagarpanda.com
    - coffee.sagarpanda.com
    secretName: sagarpanda-tls-secret-lqblm
```

And finally, we have TLS cert.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s7JHH7zRY2lStGt_ciLzDA.png)

View the cert details and validity.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N5dwWnFvLYKmwkvouC76Xg.png)

Noice 😁

There you go. Our app running on k8s with nginx ingress using our own domain.

**Read more on K8s:**

[View list](https://sagarkpanda.medium.com/list/kubernetes-a0f8fab4ee0d?source=post_page-----9173b09ad5c9---------------------------------------)
