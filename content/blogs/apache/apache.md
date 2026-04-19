---
date: '2023-01-25T19:26:10+05:30'
draft: false
title: 'How to install Apache HTTP web server on Linux.'
Description: Learn How to setup Apache HTTP webserver
tags:
  - apache
  - http server
  - devops
---


### Introduction:

If you ever worked with web application then you must have came across the term “Apache”. The Apache HTTP server is an open source web server.

In this article we’ll take a look on how to install and configure Apache on various popular Linux distributions (Debian/Ubuntu, RHEL/Rocky Linux/Alma Linux).

![Source: Apache](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*B-C9bRZB0-23FLkyjZqJQg.png)

### Installation:

The package has different name in different distributions. On Fedora/Red Hat based distribution its called “httpd” and on Debian/Ubuntu based distributions its Apache2.

### On Debian/Ubuntu:

First we need to update the package index to ensure we get the latest applications from the repository. To do so run the command below.

```
sudo apt update
```

Don’t worry, this will just update the index, not the packages.

After the above is completed, we need to run the following command

```
sudo apt install apache2
```

This downloads and installs the Apache HTTP server.

To check the status of Apache, use the below:

```
systemctl status apache2
```

You should see the following output:

```
user@host:~$ systemctl status apache2
● apache2.service - The Apache HTTP Server
  Loaded: loaded (/lib/systemd/system/apache2.service; enabled; preset: enabled)
  Active: active (running) since Sat 2023-01-12 16:10:16 IST; 7s ago
  Docs: https://httpd.apache.org/docs/2.4/
```

In case you don’t see the status as “active (running)”, you need to run the following command:

```
sudo systemctl start apache2
```

In addition you can run the below command to enable the service, which means the Apache server will start automatically when the machine is restarted.

```
sudo systemctl enable apache2
```

Now to test it, open a web browser and type ‘localhost’ or the IP of the server and you should see the default Apache page.

### On Fedora/Red Hat:

As we have discussed before the package name in this family of Linux distributions is called httpd.

Follow the same process as the above steps:

```
sudo dnf update
sudo dnf install httpd
systemctl status httpd
sudo systemctl start httpd
sudo systemctl enable httpd
```

Hurray! Now Apache server is ready to server your web application.

<!-- [Basic configuration in Apache] ({{< relref "apache_config" >}}) -->
[Read more on Apache →](/blogs/#apache)