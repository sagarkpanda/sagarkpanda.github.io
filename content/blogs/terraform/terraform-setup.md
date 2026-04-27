---
date: '2023-07-02T10:26:10+05:30'
draft: false
title: 'Infrastructure as Code (IAC) - Automation using Terraform 101'
Description: Chapter I — Getting Started, setup, terminologies and basic examples..
tags:
  - AWS
  - Terraform
  - DevOps
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fCBP8ShpFHETAU7JEenXLQ.png)

## What is Terraform:

Terraform is an open-source infrastructure as code (IAC) tool that helps us to safely and predictably provision and manage infrastructure in any cloud and on-prem resources in human-readable configuration files that you can version, reuse, and share.

TF* (I m going to use TF, short for Terraform) uses plugins called providers to work with different cloud platforms such as AWS, GCP and etc.

![Img Source: TF docs](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*L1rYP-XztQ-OeO4PQQ46rw.png)

## How if Works:

We write a set of instruction using a declarative DSL called HashiCorp Configuration Language (HCL) and TF executes the instructions to get the expected result for us.

The core TF workflow consists of three stages:

*   **Write:** We define what resources to be created such as a linux server with security groups rules, an S3 bucket or an application load balancer.
*   **Plan:** Terraform creates an execution plan describing the infrastructure it will create, update, or destroy based on the existing infrastructure and your configuration.
*   **Apply:** On approval, Terraform performs the proposed operations in the correct order, respecting any resource dependencies. For example, if you update the properties of a VPC and change the number of virtual machines in that VPC, Terraform will recreate the VPC before scaling the virtual machines.

![Img Src: TF docs](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HWYBl5Zlv0bJeDxYTTM2cg.png)

## State:

Whenever we apply a config, TF creates a file called “terraform.tfstate” where it stores the all the information about the resource that we created.

There are 3 states in our configuration.

1.  Desired: The configuration we specified in our tf file.
2.  Current: The state of the resource in .tfstate file.
3.  Actual: The state of the resource in the destination location.

Whenever we apply the config again, tf compares the state (now desired) to the current (in .tfstate) to see if there are any changes if not it says nothing to do. In case we modified it, then tf compares the state in the destination for example in aws to find the actual state and updates the resource accordingly.

## Installation:

Follow the official documentation here:

[Install Terraform | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli?source=post_page-----54eeaa357169---------------------------------------)

Creating Resources on AWS:
--------------------------

Now that we have it installed, time to have fun. I m going to use AWS but you can use any cloud platform.

### Prerequisite:

*   AWS account with Programmatic access.

### Setup:

We need to provide credentials to authenticate to AWS. We can set the creds in multiple ways.

Check this below official docs :

[Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs?source=post_page-----54eeaa357169---------------------------------------)

I’ll set the creds as environment variables in the .bashrc file. I have also added an alias for terraform as tf, so whenever I run tf, terraform command is executed.

```
alias tf='terraform'
export AWS_ACCESS_KEY_ID="<your aws access key id>"
export AWS_SECRET_ACCESS_KEY="<your aws secret access key>"
```

Now create a file called main.tf and paste in the code below:

```
provider "aws" {
  region = "ap-south-1"
}
```

Now we need initiate the the script so that terraform downloads the aws provider plugin.

```
terraform init
```

We’ll see a new folder and few more files getting generated automatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*y3BULntFvI98150xPt_wLw.png)

And since we got the successful message, we are reedy to go.

As we know the workflow consist of 3 stages and we did 1, so lets proceed with the next two stages with the 2 commnds below.

```
terraform plan -- shows us the overview of the result.
terraform apply -- applies the configuration and creates the infra as we instruted.
```

For the above config we don’t have any instruction for creating any resource. So nothing will happen.

### Example 1 - Creating an IAM user:

Starting with basics, lets create an IAM user. Add the code below to our .tf file and then run terraform plan, then terraform apply.

```
resource "aws_iam_user" "my_iam_users" {
  name  = "sagar-iam"
}
```

Note that I have only IAM user in AWS as of now. First with plan, we see the expected outcome.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eytIvI0ADexp_TgTb5e1yw.png)

And then with apply the iam user will be created. TF apply asks for confirmation, so type yes when prompted.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LwvY46apJuWOxoXH-53PIw.png)

Now we can see the user has been created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*H0E7eGVVK9wcnxO4fyXs2w.png)

### Deleting resources:

TF lifecycle includes the destroy command to remove resources which are created using TF. Confirm the action when prompted.

```
terraform destroy
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OfaN81Xu0yxUJ-AktPnpyA.png)

Now the IAM user has been deleted from our AWS account.

### Few more terraform commands:

```
terraform validate -- checks syntax of our config.
terraform fmt -- rearranges the config file with proper alignments.
```

### Example 2 - Creating S3 bucket:

Use the config below to create a bucket. Run tf init, tf plan and then tf apply. You can pass -autp-approve arg to apply command.

```
provider "aws" {
  region = "ap-south-1"
}
resource "aws_s3_bucket" "my_s3_bucket" {
    bucket = "my-s3-bucket-sagar-2-jul-23"
}
```

```
terraform apply -auto-approve
terraform destroy -auto-approve
```

Verify that the bucket has been created in AWS console. After you done practicing, use tf destroy to delete the bucket.

Alright, we are now set to proceed with more examples and understanding in details which we’ll see in next articles. Thanks for reading.

[Read more on Terraform →](/blogs/#terraform)

[Read more on Ansible →](/blogs/#ansible)

References: [Terraform Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)