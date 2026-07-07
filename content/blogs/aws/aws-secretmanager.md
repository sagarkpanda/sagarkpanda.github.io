---
date: '2024-09-14T19:26:10+05:30'
draft: false
title: 'AWS Secrets Manager: A Secure Solution for Credential Management'
description: AWS Secrets Manager is a service designed to help us securely store and manage sensitive information such as passwords, API keys etc.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6eDcfbngtrF1eiKzstWkKA.png
tags:
- aws
- secret manager
- cloud
- app security
categories:
- AWS
---

### Introduction:

We generally store creds in diff ways such as using environment vars, storing them in a file and referring the file in the application (DB connection for example). However they are still stored in plaintext which we can easily peek thru. Also incase a bad actor gains access to the OS, can get all the sensitive information.

By using any kind of secret providers, we have better security with encryption, key rotation etc. AWS secrets manager is one such option and integrates well with AWS provided services such as RDS.

Setup:
------

In this example, we are going to use python to retrieve and use the creds programmatically. So make sure to install aws cli and configure your creds.

### Setup on AWS:

→ Ensure to have an IAM user with CLI access, Access keys and add secrets manager specific policies such as “GetSecretValue” and “KMS Decrypt” in case you are using a diff kms key than the default one.

Note: For the resource, instead of using *, you can use the arn of the particular secret to have even granular access.

```
{
    "Version": "2012-10-17",
    "Statement": [        {
            "Effect": "Allow",
            "Action": [                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret",
                "secretsmanager:ListSecrets",
                "kms:Decrypt",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        }
    ]
}
```

→ Search for secrets manager, store a new secret and you can choose what kind of secret you want to store based on what service you are going to use it for. I’m going to use others.

Add the creds and key:value pair. These keys will be used to retrieve the data.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZgznWTAVs0WBuI5WFsLm-g.png)

For the encryption key, you can leave it as, or use your own kms key if you have one.


On the next page define a name for the secrets, description and proceed to the next page where you can define rotation if you want.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cP9IYgh5k89rOGlsDcUT7A.png)

Then review the settings and save. This also provides you samples in diff languages to retrieve the secrets.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PcSsU2l9Bvq8uoH3aqe0Og.png)

You can view, modify and delete the secrets from the dashboard.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Lf-3YJHx3T9h1nVLhZKvLw.png)

### Python Application:

We have our creds on aws. Now to use this in our python app, we need to have boto3 module. Also I m going to use selenium for automating the login process.

```
--> pip install boto3 selenium
--> pip list (verify the modules installed)
```

Download web driver for the browser you are using. The web driver for Firefox is gecko. [mozilla/geckodriver](https://github.com/mozilla/geckodriver/releases?source=post_page-----0363beabb20b---------------------------------------)


App code:

```python
import boto3
from botocore.exceptions import ClientError
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import json

def get_secret(secret_name, region_name):
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)

    try:
        # Retrieve the secret
        response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        # Handle the error
        raise e
    else:
        # Secrets Manager decrypts the secret value and returns it as a string.
        secret = response['SecretString']
        return secret

def linkedin_login(username, password):
    # Path to your GeckoDriver executable
    driver_path = 'path to geckodriver binary'
    firefox_binary_path = 'C:/Program Files/Mozilla Firefox/firefox.exe'
    firefox_options = Options()
    firefox_options.binary_location = firefox_binary_path
    firefox_options.add_argument("--private")  # Open in private mode

    service = Service(driver_path)
    driver = webdriver.Firefox(service=service, options=firefox_options)
    driver.get("https://www.linkedin.com/login")
    driver.maximize_window()

    time.sleep(3)

    username_field = driver.find_element(By.ID, "username")
    username_field.send_keys(username)
    password_field = driver.find_element(By.ID, "password")
    password_field.send_keys(password)

    # Submit the login form
    password_field.send_keys(Keys.RETURN)

    time.sleep(10)
    driver.close() #or quit()

secret_name = "webapp_creds" #name of the secret, webapp_creds in the pic
region_name = "us-east-1"

secret_json = get_secret(secret_name, region_name)
secret = json.loads(secret_json)

# Extract credentials from the secret
username = secret["email"] #var name, email on the example pic
password = secret["password"] # same for passoword

linkedin_login(username, password)
```

Run the python app with “python app_name.py”

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MEe5J4am6RNLIKEcZUc67Q.gif)

The end!! Thanks for reading.

<!-- **Read More on AWS:**
[Read more on AWS →](/blogs/#cloud) -->

