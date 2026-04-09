---
date: '2024-08-20T19:26:10+05:30'
draft: false
title: 'AWS WAF with Load Balancer - Beginner’s Guide'
Description: AWS Web Application Firewall is a security service that helps protect web apps from common web exploits and attacks
tags:
  - aws
  - waf
  - web security
  - devops
---


![Img bg: wallpaper cave](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JJlzcHjGcywNPhgKk6a6ig.png)

### Setup:

First we need to have the web app ready. You can have multiple instances of your app as we are going to use ALB.

Create your instance and host your web app.

Read more about how to set up your web app:

[Install Apache](https://sagarkpanda.medium.com/configuring-apache-http-server-in-linux-and-with-ssl-d59ff62c8a35) , [Configure Apache](https://sagarkpanda.medium.com/configuring-apache-http-server-in-linux-and-with-ssl-d59ff62c8a35)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*n0UbGNgxJ2_-hYr6epuv_g.png)

Now Create a target group pointing to your instance(s), and then create an Application LB pointing the target group.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kTgOPi5OEoby6B8vGpO6dQ.png)

Try browsing the dns name of ALB and we should see our webpage.
Note: You can remove all the rules (80, 443) from ec2 security group and add the LB as the inbound rule to prevent the app being accessible with ip browsing.

Alright then, now we can apply WAF to the load balancer. Choose regional as the other option is from CloudFront.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zUB2D1DPXEuUCe0sznYeEg.png)

Enter a name for the waf, click on “Add aws resources” to select the aws loadbalancer created earlier.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ih4qxRoDXMJaUH42FWE5xA.png)

For adding rules, we can opt for various preset or create our own. In this example I m going to use set of IPs.

Create an Ip set, and add the list of IPS. You will need to add the IPs in CIDR format, eg 1.2.3.4/32. Add multiple if you wish to.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-WLWX96gduR_93sHr8eL9w.png)

Back on the waf creation page, select add my own rules, select your preferred type. I have chosen IP set. Select the IP set created earlier and the action to be taken.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9YNfQEJ6cmo2UyyuGAgu5g.png)

Then proceed and select the action for other conditions and create.
In this example, I have used my own IP, and the action to be blocked, so if I try to access the app, I should get a 403 response.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bt9At0w0hOkNszVYj1P5QA.png)

Lets update the action to have a captcha when the IP matches. Click on rules tab and edit the rules to select captcha.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NqxZ4tYWP65AunXvMKP7sA.png)

Refresh the webpage again, and we shall see captcha page.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lm6JVFQuiw8EJKnarPYjiA.png)

Cool. Now experiment further to find out more on what WAF has to offer. Delete the resources once you are done with the experiment.

Read more on aws:

[**Secrets Manager**]({{< relref "aws_secretmanager" >}}), [**ALB**]({{< relref "aws_alb" >}}), [**Lambda**]({{< relref "aws_lambda" >}})