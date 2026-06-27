---
date: '2024-05-20T19:26:10+05:30'
draft: false
title: 'Kubernetes Security — Role Based Access Control (RBAC)'
description: Part XII — User Management in K8s with RBAC using Entra ID aka Azure Active Directory.
image: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JPtYpwRPmc1fOMMLPgiCAQ.png
tags:
  - kubernetes
  - k8s
  - devops
  - rbac
---

## Introduction

Role-Based Access Control (RBAC) is a method used in computer security to manage access to resources within a system.

RBAC in k8s is based on the principle. There are various terminologies such as users, service account, role, role binding and etc.

RBAC policies can be assigned to define access for users or human users in k8s and also for users in the services such as pods using service accounts. While user accounts are global, service ac (sa) are limited to the namespace they are created.

When we create any namespace a default sa is created without any permission. If we don’t mention a service ac while creating a resource, the default sa ac is assigned to it.

```
kctl get sa
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*vtwTTDPf3N7RdgmE.png)

Lets first focus on user management.

_Note: When we connect to the cluster using the two commands from the connect button, a file is created under our home dir with <username>/.kube/config which has user information and lets us communicate with the api server._

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*RbIiZ-pndXCg45g7.png)

_Similarly the master node also has the certificates stored under /etc/kubernetes/pki which we can’t access in managed cluster._

We can’t create users in our clusters. It is managed by third party identity providers such as MS AD, okta, O auth, AWS IAM and etc.

In this experiment as the cluster is on azure, we can use AD without much hassle.

## Manage users with AD

Search for Active directory (now Entra ID) and go to users.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*bEnpzEbl4_d5q19t.png)

To create a new user, click on the new add user and fill out the details. Copy the password if you select auto generate pw. This is a temp pw will be used for the first login and you’ll update it.

_Note: It shows my domain as I have added it here. In case you dont have any custom domain, you will see user@email.onmicrosoft.com_

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*I2TrOwIsCFIMgoCV.png)

Similarly you can create a group and add multiple users. All the users in a group will have the same permissions.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*R_LCKZlPXy1Y5vna.png)

Here kubeuser is the group and I have added user1 that was created earlier.

## Associate AD with cluster

Now that we have users and group setup, lets assign the Azure AD to our cluster so it can provide authentication for our cluster.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*joNgWti3gJ3VC95I.png)

You can also select this AD association process while creating the cluster.

While adding the AD to the cluster, choose a group. The users in this group have full access.

We can now test the new user logon and test RBAC with AAD.
I have 2 users, “**user1**” and “**user2**” apart from the default user. Only **user1** is part of the group “**kubeuser**”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*fXMcSgng45YAlCO1.png)

Now as the users login to the aks cluster, it asks to login to auth via a web sign in with an OTP.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*TzneOJoK3-HtZ0nO.png)

User1 can access all pods because its part of the the kubeuser group, which has admin access, however user2 can not.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*x_qUMenitllnfy96.png)

Command to check if the user has certain permissions.


get, list, create etc are called verbs, basically a particular access.

```bash
kctl auth can-i <verb> <resourece type>
kubectl auth can-i get pods --as <username> # check for other user
```

## Role and RoleBinding

**Role** is a set of permissions definitions and **Rolebinding** is the process of assigning the role to a user.

In this example, User2 can’t access anything, but we want to provide access to it to list resources.

To create role and assign permission to the user2, login with user1 and create role and role binding.

```bash
kubectl create role example-role --verb=get,list,watch --resource=pods --namespace=default
kubectl create rolebinding example-role-binding --role=example-role --group=group1@example.com --namespace=default
```

or use yaml.

```yaml
#role.yml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: readrole
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
--------------------------------------------
#rolebind.yml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: demorole-binding
  namespace: default
subjects:
- kind: User # set to Groups for role assigning toa group
  name: "user2@sagarpanda.com"  # Replace with your Azure AD user email
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: readrole
  apiGroup: rbac.authorization.k8s.io
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9eAgPw3R51gTy8pT.png)

The user2 should now be able to list pods and services.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*zpz2mxr_gbxyhoS6.png)

user2 unable to list nodes even if you assign it.

_Note: Don’t get confused with the shell user as I m using the same shell to login all users. I delete the .kube/config and do the set and get again. Generally when different users use their own ac, they don’t need to do this.._

Role and RoleBindings are namespace specific, so even with all the permissions to a user, the user can’t list nodes, pvc etc as they are global.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*7RofSrlVt0ae2VEB.png)

User1 able to see node

To know which resources are global, we can use the below command.

```bash
kctl api-resources --namespaced=true # to list namespace spefic resources
# similarly =false for global resources
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*OK8-iY5fIUwQ66jr.png)

## Cluster Role and Cluster Role Binding

They have the same purpose except the difference being, the permission are not limited to a namespace.

Note: There are a few default clusterroles.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*XtQpPy1Y_ksnLG2z.png)

Skipping this as this is same as doing above.

```bash
> To create clusterrole:
kubectl create clusterrole <clusterrolename> --verb=get,list --resource=pods

> To create clusterrolebinding for user:
kubectl create clusterrolebinding <name> --clusterrole=<clusterrolename> --user=<username>

> To create clusterrolebinding for sa:
kubectl create clusterrolebinding <name> --clusterrole=<clusterrolename> --serviceaccount=<nsname>:<saname>

>To give admin access:
kubectl create clusterrolebinding <name> --clusterrole=cluster-admin --user=<username>
```

That’s all for today. Thanks for reading.

References: [Sysdig](https://sysdig.com/learn-cloud-native/kubernetes-security/kubernetes-rbac/)

[Checkout more articles on K8s →](/blogs/#kubernetes)