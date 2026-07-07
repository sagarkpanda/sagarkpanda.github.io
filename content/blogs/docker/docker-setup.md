---
date: '2023-04-16T19:26:10+05:30'
draft: false
title: 'Docker: Containerization for beginners.'
description: Docker Chapter 1 — How to Install Docker on Linux and Windows.
cover: https://miro.medium.com/v2/resize:fit:1202/format:webp/1*Ms3dGlKGPJhQPkPe9c-73w.jpeg
tags:
- docker
- devops
categories:
- Kubernetes & Containers
---

## Introduction

Docker is a software platform that allows you to build, test, and deploy applications by packaging everything the application needs to run including libraries, code, and runtime.

When we package the application and all its dependencies to a single unit, its called an image and when the image is used to run the application its called a container.

Image: Application package.

Container: Application/Image in running state.

Lets see how to install it on popular Linux distributions like Ubuntu and RHEL and Windows as well.

## Installation on Linux:

*   First update the repository index.

```
sudo apt update (Ubuntu)
sudo dnf update (red hat)
```

*   Install below packages which are not related to docker but they help in setting up the docker repository.

```
On Ubuntu:
$ sudo apt install ca-certificates curl gnupg
On Red Hat Linux:
$ sudo yum install yum-utils -y
```

*   Setup Docker repository:

```
On Ubutnu:
$ sudo mkdir -m 0755 -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
On Red Hat:
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
```

*   Update repository index again and install docker engine with the following command:

```
sudo apt update (Ubuntu)
sudo dnf update (red hat)

Ubuntu:
$ sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
Red Hat Linux:
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Check Docker status and start it if its not active. Enable service if you want to start docker at boot time.

```
$ systemctl status docker
$ sudo systemctl start docker
$ sudo systemctl enable dockerInstallation on Windows:To use Docker on Windows, we need to have WSL (Windows Subsystem for Linux) enabled. Follow [this official guide by Microsoft on how to do so.](https://learn.microsoft.com/en-us/windows/wsl/install)
```

*   Download docker desktop app from the [official website](https://docs.docker.com/desktop/install/windows-install/), and install just like any windows application.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x1tbtuynZ8hri-EHUvwUKA.png)

Check docker version:

```
$ docker --version
Docker version 23.0.3, build 3e7cbfd
```

*   Pull and run a test image.

Note: You might get permission denied error while using docker command on Linux. To avoid this, use sudo or add your user to docker group. Follow the official guide on how to do this here: [Post Installation](https://docs.docker.com/engine/install/linux-postinstall/) on Linux

```
$ docker run hello-world

$ docker pull hello-world
$ docker run hello-world
```

_Pull vs Run_: Docker pull downloads an images and we have to start the container manually using the docker run command whereas docker run pulls the images and starts the container.

The above is an test image, with docker run it shows a message like below:

```
└──| docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:4e83453afed1b4fa1a3500525091dbfca6ce1e66903fd4c01ff015dbcb1ba33e
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
This message shows that your installation appears to be working correctly.
To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash
Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/
For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

The pull command downloads the image and stores in our machine. So if you pull or run again, the existing image will be used.

```
──| docker pull hello-world
Using default tag: latest
latest: Pulling from library/hello-world
Digest: sha256:4e83453afed1b4fa1a3500525091dbfca6ce1e66903fd4c01ff015dbcb1ba33e
Status: Image is up to date for hello-world:latest
docker.io/library/hello-world:latest
```

Hurray! This completes the docker installation. On next chapter we’ll see how to build your first image and push to docker hub.

Source: [Docker Docs](https://docs.docker.com/engine/install/).

<!-- [**Checkout more artciles on Docker →**](/blogs/#docker) -->