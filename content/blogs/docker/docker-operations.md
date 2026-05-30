---
date: '2023-04-16T19:26:10+05:30'
draft: false
title: 'Docker - Build and Push operations.'
Description: Docker Chapter 2 — How to Build and Push your first image.
image: https://miro.medium.com/v2/resize:fit:1016/format:webp/1*ktQe3mbLm09C8kyetxI-aA.png
tags:
  - docker
  - devops
---

## Introduction:

In the [**_previous article_**]({{< relref "docker-setup" >}}), we saw how to install docker, in this chapter we’ll go through building our own docker image and publish it to the docker hub.

## Lets Get Started:

To build a docker image, we need to have all the code, libraries and its dependencies to be available.

This is a demonstration of a simple web application which has only a static webpage and is being served by a HTTP web server. We are going using lighttpd (can be Apache or Nginx).

You can find all the code on the [GitHub](https://github.com/sagarkrp/fakeweb) repository.

Clone the repository and CD into it. fbweb directory contains all our code. Ignore the yml files for now. They are for Kubernetes.

```
& git clone https://github.com/sagarkrp/fakeweb.git
& cd fakeweb
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2_vzcf6vWJ6K7sbVMLG8Bw.png)

We use Dockerfile to write all the instruction needed to build our Image.

Lets understand one by one.

> FROM: Use an existing Image as a base Image.
>
> RUN: To run any commands for example “apt update, mvn clean install, npm install, python -r requirement.txt , dnf install httpd” etc.
>
> COPY: Copies our application code to the OS inside the Image.
>
> ENTRYPOINT/CMD : Command to start our application.

```
FROM ubuntu:22.10 - We are using Ubuntu as base image.
RUN apt update -y - Updating repository index as we generally do in Linux.
RUN apt install lighttpd -y - Installing lighttpd webserver.
COPY fbweb/ /var/www/html/ - Copying our application to the web server root directory.
ENTRYPOINT service lighttpd start && /bin/bash - Starting the web server.
```

To build the image, we need to run the docker build command: docker build -t <name:tag> .

```
docker build -t fbweb:1.0 .
```

After Entering this command , we shall see a updates like these:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CWNEKeUlErGYybncEioP1Q.png)

If there are no errors, this will will be completed with this kind of message:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZDHUfdHCBISGBtNMlOr_VA.png)

To view the list of Images we can use : docker images command.

```
└──| docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
fbweb        1.0       bcb23d33bf82   1 minute ago   163MB
```

Now lets run this image with the following command:

```
──| docker run --name fb -td -p 80:80 fbweb:1.0
551eddaa8434ac7665e85bf7e959493eb21783ad4f332fdcc5b678e5769ae233
──| docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                               NAMES
551eddaa8434   fbweb:1.0   "/bin/sh -c 'service…"   6 seconds ago   Up 6 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp   fb
```

*   -p:<host port>:<container port> = Publish, runs the app on the host port of 80. Even though we have not explicitly exposed our app , by default a web server runs on port 80.
*   -d : Runs in detached mode, meaning in the background and leaves the terminal to use.
*   — name: To assign a custom name to the container. If we don’t mention anything, docker will auto assign a name.

The docker ps command shows the currently active containers. If you don’t see your container , use -a to find out what happened. You may see the status as “Exited” as opposed to “ Up 6 secs ago” as seen above.

If your container is in exited state , use docker logs against the container id or name to find out the reason why it exited.

```
docker ps :- shows active containers
docker ps -a :-shows both active and stopped containers
docker logs <container_id> :- find out why container exited
```

Now lets browse the IP or URL.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9bkcsd1U3amcsPA5Pivt5w.png)

ta-da! Our application is running fine. We successfully containerized the application.

### Push the Image to docker hub:

Tag the image with repository name using below command. After tagging we should see another image appear in the list with same ID.

```
──| docker tag fbweb:1.0 sagarkp/fbweb:1.0

└──| docker images
REPOSITORY      TAG       IMAGE ID       CREATED             SIZE
fbweb           1.0       9443bff58bb3   About an hour ago   163MB
sagarkp/fbweb   1.0       9443bff58bb3   About an hour ago   163MB
```

Now to push to docker hub, we first need to provide docker hub credentials in our terminal. Use the below command and enter the creds when asked.

```
docker login
```

Once we are logged in, we can use the docker push command to push the image.

```
──| docker push sagarkp/fbweb:1.0
The push refers to repository [docker.io/sagarkp/fbweb]
a2517707f654: Pushed
5cd1ef7c3719: Pushing [=============================>                     ]  32.96MB/56.14MB
61800684fb13: Pushing [=================>                                 ]  12.47MB/36.45MB
c8211604066d: Pushing [================>                                  ]   22.9MB/70.25MB
```

Now if we login to Docker Hub in our browser, we can see the image and it was published a few seconds ago.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*El9R5gJ8oj7WsZwhBuNWOA.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7mYcV3qSgGS3e6RD3H_5fQ.png)

Whalesome!!. We have successfully built and pushed our image to docker hub.

[**Checkout more artciles on Docker →**](/blogs/#docker)