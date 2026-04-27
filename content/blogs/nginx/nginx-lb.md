---
date: '2023-04-22T19:26:10+05:30'
draft: false
title: 'Load Balancing Magic — Unleashing the Potential of NGINX.'
Description: Load Balance Multiple servers with Nginx. Run multiple servers (containers) using Docker Compose.
image: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KtQHN4HBPNple7bwXDUCsg.png
tags:
  - nginx
  - loadbalancer
  - devops
---

## Introduction

### What is NGINX:

Nginx (pronounced engine x /ˌɛndʒɪnˈɛks/ EN-jin-EKS) is an open source HTTP web and reverse proxy server.

### What’s is a Load Balancer:

A load balancer sits in front of all your web server and distributes all client requests. By doing so it reduces the chance of service failure and also exposes a single point of request.

![Img source: Nginx](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BN3WyxHwigDwbTI7m8jGRQ.png)

In this article we’ll see how to use NGINX as Load Balancer and Reverse Proxy.

All the project codes are available on this [GitHub](https://github.com/sagarkrp/NGINX_LB_DockerCompose.git) repository. This repository has 2 projects. The Nodejs project uses local nginx installation and the python app uses nginx as a container.


## Example 1:
### Using Nodejs , Docker and Nginx:

### Prerequisite:

*   Docker

[Docker Chapter 1 — How to Install Docker on Linux and Windows.](https://medium.com/@sagarkrp/docker-chapter-1-how-to-install-docker-on-linux-and-windows-6020c9a36693?source=post_page-----c8e1d746f02b---------------------------------------)

*   Nginx

Lets install Nginx and nodejs, use the command below:

```
sudo apt update && sudo apt install nginx -y
sudo apt install nodejs
```

Nodejs is required only to run the application locally. You can skip if you want.

### Building our application:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-db_MrxAH8VqZqV9eNnhHw.png)

The server.js in our main application that runs on port 2000 and when its run it prints the hostname.

To run the application locally, you can use “npm run start”.

### Build and run the container:

Since we need to see Load Balancing same application, we need to create multiple instances of the app.

But we’ll use Docker to spin up 3 servers in and our application will transfer request to all servers and we should see hostname changing with each request we make (the default laod balancing algorithm is Round Robin).

Dockerfile:

```
# Using node image as base
FROM node:18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm i express
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 2000
CMD [ "npm", "run", "start"]
```

To Build the docker images and run use the below commands:

```
docker build -t nlb:1.0 .
docker run -d -p 2000:2000 nlb:1.0
```

Lets run more containers in different ports.

```

┌──[13:54:13]─[0]─[labputer:~/Documents/Docker/Nginx_LB]
└──| docker run -d -p 3000:2000 nlb:1.0
927e3765aeee5d2615f0375f6ede30902d0ac9600de8085fac6400ae437a83e1
┌──[13:54:16]─[0]─[labputer:~/Documents/Docker/Nginx_LB]
└──| docker run -d -p 4000:2000 nlb:1.0
f75486b51aabe02337082e0f7c1b025631f43c60aeb9a4b723592687c9d73dff
```

View more abut docker build:

[Docker Chapter 2 — Build and Push Your First Docker Image](https://medium.com/@sagarkrp/docker-chapter-2-build-and-push-your-first-docker-image-7d7f9d71f1ca?source=post_page-----c8e1d746f02b---------------------------------------)

Now browse the ip or url with port 2000,3000 and 4000. We should see a response with hostname.

Note: The hostname here are the IDs of docker containers.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qA-QakFflPdzjosbs0io3A.png)

But wait, that’s nothing exciting, we don’t have any load balancing. That’s right, we’ll setup nginx to act as a load balancer to the 3 containers and we should be able to see varying hostname changes with single ip (the default load balancing algorithm is Round Robin).

To configure nginx as load balancer, we must edit the nginx.conf file under /etc/nginx. We need to http black here like below:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hpdEVDA5xJRacnfUaiZVTw.png)

```
http {
       upstream beservers{
               server 127.0.0.1:2000;
               server 127.0.0.1:3000;
               server 127.0.0.1:4000;
       }
```

Note: the “besevers” is just an identification that we’ll use in our virtual host configuration.

Now all the requests coming from all these different servers (ports in this example) will be transferred to “beserver”, but what is this name how does it forward the request. For that we’ll be using proxy pass.

Add the following block to the default site or create a new site.

```
location / {
                proxy_pass http://beservers/;
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
```

I m going to create a new site under /etc/nginx/sites-available called example.com (can be any name). And create a symlink to sites-enabled.

#example.com

```
server {
        listen 80;
        server_name example.com #this is your website url
        root /usr/share/nginx/html;
        try_files index.html =404;
        location / {
        proxy_pass http://beservers/;
        }
}
```
<br></br>
```
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

Now, lets browse our application. These hostnames are coming from Docker containers. use “docker ps” to verify their IDs with the ones from here.

![captionless image](https://miro.medium.com/v2/resize:fit:770/format:webp/1*HnZtFKPmUjISh9AgQg_StA.gif)

Awesome!

Note: This “sites-available” , “sites-enabled” are only applicable incase of Debian/Ubuntu and its derivatives. In redhat family of linux, all these configurations are to be done under conf.d directory.

If you want however, you can imitate the same debian/ubuntu like directory structure by creating “sites-available” , “sites-enabled” and including the “sites-enabled” in nginx.conf.

```
Cretae the directoies:
$sudo mkdir /etc/nginx/sites-available /etc/nginx/sites-enabled
$sudo vim /etc/nginx/nginx.conf
Add this line to the end of the file:
IncludeOptional sites-enabled/*.conf
```

## Example 2:
### Using Python and Docker Compose:

### Prerequisite:

1.  Docker and Docker compose.

### What is Docker Compose:

Compose is a tool for defining and running multi-container Docker applications.

Lets discuss the application.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wUXmPem7ihvDIceQrXlO_A.png)

Same as the first example, the hello.py in our main application that runs on the defined port and prints the hostname.

### Dockerfile:

```
# using alpine varinat of python image
FROM python:alpine3.17
# define working directory
WORKDIR /flaskapp
# copy everything to working directory
COPY . .
# intstall required python packes (flask and gunicorn for this example)
RUN pip install -r requirements.txt
# start application with guincorn
CMD gunicorn --bind 0.0.0.0:3000 hello:app
```

### nginx.conf:

```
events{
    worker_connections 100;
}
http{
server{
    listen 80;
    location /{
        proxy_pass http://flaskapp:3000/;
    }
}
}
```

In this example, we don’t need local nginx instance, and its better to stop nginx if its running on your host since in this example we are exposing nginx on 80, it will conflict otherwise.

Here the proxy_pass transfers the request to flaskapp:3000 which is our python application.

### docker-compose.yaml:

```
version: '3'
services:
    flaskapp:
      build:
          context: app
      ports:
        - "3000"
    nginx:
        image: nginx:1.24.0
        volumes:
          - ./nginx.conf:/etc/nginx/nginx.conf
        depends_on:
            - flaskapp
        ports:
          - "80:80"
```

Here we are launching 2 services, the app is our python application and nginx. You might ask why is there no host port defined for the first service. Since we are going to launch multiple instances of our app, mentioning a particular host will launch all containers on same port which is not possible and after 1 instance of our app is created the next 2 will fail to start.

Not mentioning any host port means the containers will be assigned with random ports. Now comes another problem, if we don’t know the ports then how can we configure upstream servers? In this case docker uses the services to find the ip and port.

```
services:
    flaskapp:
      build:
          context: app
      ports:
        - "3000"
```

Now the 2nd service is to download and start nginx container. Here volume is used to mount a file from our host to the container path. The depends on notifies that the nginx container should start after the first containers are available.

Alright, lets build it. To build using docker compose we use “docker compose up” and to stop and remove the containers use “docker compose down”.

With docker compose, we can also scale number of containers using — scale option.

```
└──| docker compose up -d --scale flaskapp=3
```

This launches 3 instances of the “flaskapp” container and a nginx container.

Check all the running containers with docker ps:

```
──| docker ps
CONTAINER ID   IMAGE               COMMAND                  CREATED              STATUS              PORTS                                         NAMES
3479b1e2e677   nginx:1.24.0        "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, :::80->80/tcp             flaskapp-nginx-1
64f5725ab5b8   flaskapp-flaskapp   "/bin/sh -c 'gunicor…"   About a minute ago   Up About a minute   0.0.0.0:32773->3000/tcp, :::32773->3000/tcp   flaskapp-flaskapp-1
41ff26ba1ff8   flaskapp-flaskapp   "/bin/sh -c 'gunicor…"   About a minute ago   Up About a minute   0.0.0.0:32774->3000/tcp, :::32774->3000/tcp   flaskapp-flaskapp-2
1e201d31fbb7   flaskapp-flaskapp   "/bin/sh -c 'gunicor…"   About a minute ago   Up About a minute   0.0.0.0:32775->3000/tcp, :::32775->3000/tcp   flaskapp-flaskapp-3
```

Time to browse our application. Every refresh shows different hostnames from the above list of container IDs (Except the first one, since its Nginx container).

![captionless image](https://miro.medium.com/v2/resize:fit:1204/format:webp/1*KbgXjo2bRroiVDo6I2_oog.gif)

Congratulations !!

Reference: YouTube [1](https://www.youtube.com/watch?v=7VAI73roXaY), [2](https://www.youtube.com/watch?v=42Q65H8ch7U&t=974s) | [Docker Docs](https://docs.docker.com/compose/) | [Nodejs](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)

More on Docker : [Build and Push your first Image](https://medium.com/@sagarkrp/docker-chapter-2-build-and-push-your-first-docker-image-7d7f9d71f1ca)

**Read more on Nginx:**

[SSL for Everyone: A Guide to configure Let’s Encrypt using Certbot]({{< relref "letsencrypt-ssl" >}})