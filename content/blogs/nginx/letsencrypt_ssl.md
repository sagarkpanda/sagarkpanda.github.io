---
date: '2024-12-09T19:26:10+05:30'
draft: false
title: 'Let’s Encrypt SSL Configuration using Certbot'
Description: Setup SSL certificate for free. Secure your application with Let’s Encrypt - DIY Guide
tags:
  - nginx
  - tls
  - web security
  - devops
---

![captionless image](https://miro.medium.com/v2/resize:fit:1280/format:webp/1*rYd5jblnBNdOUHyFiQFKXw.png)

### What is SSL/TLS:

SSL or Secure Sockets Layer is a security protocol used to establish an encrypted connection between your web browser and a web server.

This ensures that the data transfer between you and the server can’t be read by an intruder.

The padlock icon you see on a URL, that’s what is the indication of an SSL in use.

Though the current protocol TLS (Transport Layer Security) is the successor and the current implementation, people still refer to it as SSL but be sure it’s in fact TLS in use.

### Initial Setup:

I’ll be using Ubuntu and Nginx for this example, but this can be done with other web servers and Linux flavors as well.

See supported systems on certbot site.

[Certbot Instructions](https://certbot.eff.org/instructions?source=post_page-----13c4098b84d9---------------------------------------)

*   First update the package index and install Nginx with the below command

```
sudo apt update && sudo apt install nginx
```

On completion, nginx should already be running as it’s on Ubuntu and no other app is using port 80.

Browse your ip and you should see the default Nginx webpage.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sEa1jBCNfU-0ehOKKg-kew.png)

*   Add dns entry in your registrar for the above IP.

![DNS entry](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QhvmITCOPsqE2cR9Y7HOFQ.png)

*   Create an index.html with your web app content in any directory of your choice. I have it in /var/www/html/<username>.

```
<title> SSL setup </title>
<h1> Hello There! Welcome to Let's Encrypt setup </h1>
```

*   Create a configuration for your website with the server name, enable the site.

```
server {
       listen 80;
       listen [::]:80;
       server_name web.sagarpanda.com;
       root /var/www/html/sagar;
       index index.html;
       location / {
               try_files $uri $uri/ =404;
       }
}
```

Here the **web** is the config file I have created.

```
sudo ln -s /etc/nginx/sites-available/web /etc/nginx/sites-enabled/web
```

*   Check syntax of your config and reload nginx. And try browsing your site with the domain or subdomain.

```
sudo nginx -t
sudo systemctl reload nginx
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4-JVrkB4Fe3Qc-tgOmBpPg.png)

And our application is ready.

### Configure SSL using Certbot:

Certbot is a software that does the job of getting us a let’s encrypt certificate and also renews it automatically.

There are multiple ways to install certbot but the official recommendation is to use snap.

Visit the certbot site, choose your web server and linux flavour.

Follow the instructions on the screen to install snapd (not required on Ubuntu, since snapd is built-in)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-pPzDXwzJGQm5_bEYfeVjw.png)

Install the certbot tool and create a sysmlink.

```
sudo snap install --classic certbot
# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

Certbot gives us the option to configure ssl certs ourselves or it can also do the same automatically.

Choose the first if you want automatic configuration. Certbot will change the nginx configuration or the config file we created earlier.

However I’ll do the configuration myself. So I chose the second command.

```
sudo certbot --nginx
OR
sudo certbot certonly --nginx
```

*   Follow the on-screen instructions and answer the question to proceed. Certbot will automatically find the domains listed in our machine and ask us to provide the confirmation on which domain/subdomain we want ssl for.
*   Choose the one you need. Provide the number in case you have multiple domains available in the same machine.

Example below: It found 1 domain so I had to enter the corresponding number “1".

After this the certificate files are atore under /etc/lets-encrypt/live directory.

```
Which names would you like to activate HTTPS for?
We recommend selecting either all domains, or all domains in a VirtualHost/server block.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: web.sagarpanda.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
Requesting a certificate for web.sagarpanda.com
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/web.sagarpanda.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/web.sagarpanda.com/privkey.pem
This certificate expires on 2024-02-03.
```

Test Auto renewal:

```
sudo certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/web.sagarpanda.com.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Account registered.
Simulating renewal of an existing certificate for web.sagarpanda.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/web.sagarpanda.com/fullchain.pem (success)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

*   Change config to add ssl part in nginx conf. Optionally you can add a redirect statement in http server block and remove web root so even http traffic is sent to https.
*   Add the paths to the certificate files in the https server block.

```
server {
       listen 80;
       listen [::]:80;
       server_name web.sagarpanda.com;
       return 301 https://web.sagarpanda.com;
}
server {
      listen  443 ssl;
      server_name web.sagarpanda.com;

       root /var/www/html/sagar;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
    ssl_certificate     /etc/letsencrypt/live/web.sagarpanda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/web.sagarpanda.com/privkey.pem;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
}
```

Save, test the config for syntax errors and reload nginx.

```
sudo nginx -t
sudo systemctl reload nginx
```

Now off to check our web app. Bingo !!

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LMjtjmV29mcQLf_Yv44BFw.png)

Click on the lock icon to see it’s from Let’s Encrypt.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ChHXVXDJDGhhyXtJcXhyXA.png)

View more details of the cert:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fr8simaGefKRWE9Ihpm4Kw.png)

We have 3 months of validity but fret not as we saw with dry run, certbot will renew the certificate for us.

Another web page for example.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Q4hful2L4VRtV5g-h7aR6Q.png)![captionless image](https://miro.medium.com/v2/resize:fit:1368/format:webp/1*Nsq3BasnUb7Sl_ZgDEp35g.png)

If you want to delete the certificate, try certbot delete. However make sure to update the nginx site config as it does not remove the server config for https.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bEkCBdWNHXKd-q7-5h9GHQ.png)

And that’s about it. Thanks for reading!

**References**: [Certbot](https://certbot.eff.org/), [Nginx](https://nginx.org/en/docs/http/configuring_https_servers.html)

### Up next:

In this article we configure mTLS with Nginx, mTLS enables two way validation with client-server handshake for enhanced security.

**Read More on Web Servers:**

[Apache →](/blogs/#apache)
<br></br>
[Nginx →](/blogs/#nginx)

[Load Balancing Magic: Unleashing the Potential of NGINX](https://sagarkrp.medium.com/how-to-configure-nginx-to-load-balance-multiple-servers-nginx-docker-compose-c8e1d746f02b?source=post_page-----13c4098b84d9---------------------------------------)