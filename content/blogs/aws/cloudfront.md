---
date: '2026-04-19T10:15:10+05:30'
draft: false
title: 'Cache Me If You Can - AWS CloudFront in Action 🌏'
Description: CloudFront is a CDN service that speeds up web content delivery by caching it on servers around the world.
tags:
  - aws
  - cloudfront
  - cdn
  - devops
  - cloud
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*EZhHBHT8pGu_65yiT600_g.jpeg)

### Intro:

**AWS CloudFront** is a service that makes websites and apps load faster for users around the world. It stores copies of our application content (like images, videos, and web pages) in different data centers across the globe, called **edge locations**.

When someone visits your site, the data is first fetched from the origin (The actual server) and CloudFront caches the content from the server closest to them, so next time someone again requests the same content, its loaded from the edge locations. This reduces the time it takes for the content to load and improves the overall experience. It also offers security features like **DDoS protection** and **SSL encryption**.

You can set up different services as origin for AWS cloud front, however S3 is a better one as CDN is best for caching static content. In this particular example however I’m using EC2 with ALB as origin.

### Setup

I am using to EC2 instances with ALB managing traffic with round robin except the SSL setup at ALB.

Refer this post:

[ALB Setup]({{< relref "aws_alb" >}})

### Create distribution:

We can now create a CloudFront distribution that would have ALB as the origin.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WG0srLlNg5UlqZgc50ecmg.png)

Select the origin protocol. Generally http if your origin is s3 bucket and http/https if elb has https enabled. For now my alb does not have https listeners so I'll stick to http.

Note 1: The data is from Dec 2024 so the UI might have changed but concepts remain same.

Note 2: Having the CachingOptimized policy will use cdn cache for most of times and hence reducing the effect of load balancing here. If you choose the other policy for disabling cache, the ALB works but might hit the origin frequently, so you might have to set custom headers here or in web server.

CDN is best suitable to static content.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0zK1F0EQhIq22gjyDDhAgA.png)

In the next section, choose if you want to compress objects or to redirect traffic to https if it comes via http and the http methods you want to allow example GET and HEAD are HTTP methods used to retrieve resources.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DEhq_oS9AvSV5aph1sn0bA.png)

Cache key and origin request also leave them default or choose any from list. I have selected CachingOptimized. You can modify if you want, you can change the TTL and other settings or create your own.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RXWDEIhWI5CteqR9jwkA4A.png)

Optionally you can enable waf or turn it off. You can still configure waf later.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6uenZiOEMQolctVTLAh8PA.png)

Choose the geographic region you want to use the edge locations, either all, or specific continents.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MX0YmmU8F7hbcooP_090bA.png)

I have a domain and SSL certificate imported to ACM, so i can choose those, or request the SSL cert from ACM if you don’t have.

Leave the rest to default, you may turn on/off IP v6 and S3 logging based on your requirements. Finally create the distribution.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Da_RXbmfyfewuPWI2b_YRg.png)

It might take some to provision, after which you will be able to browse it with the domain name.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AX0yCmFtYbrsnmW-fCwhzw.png)

Now we need to create a DNS entry for this cdn domain to our custom domain as CNAME.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nIBPRjzUqyOOtOBw8lqk6Q.png)

Wait for the dns to propagate and then we are ready.

### Check CDN in Action

When you first browse it goes to origin (ALB -> EC2) and then cached, so it will be rendered from the cdn cache from the next time.

A fetch from origin will be notified as miss from CloudFront where as when cached it will be hit from CloudFront.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZDqHXYzBzNPI1NQ7KhwpGw.png)

Refresh and this time it should be from cdn cache.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sLI2K4YkE0fPHF2C6XfftQ.png)

If you want to invalidate the cached data, you can do so by using cache invalidation either for all the content or the specific content by providing the path

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BcZHq8Fjm8w2hQc3IHtkpA.png)

Once you remove the cache, it will fetch the data from origin again.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DGc_eKMhKn2xEp5JgX5doA.png)

### Wrap up:

Alright, so that's all, you can explore other features such as blocking or allowing to certain regions, integrate waf and etc. Once you are, done disable the distribution first and you should be able to delete it.

[Read more on AWS →](/blogs/#aws)