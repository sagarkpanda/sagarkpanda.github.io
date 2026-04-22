---
date: '2023-07-09T10:26:10+05:30'
draft: false
title: 'Terraform on AWS — Outputs, Indexing and Variables'
Description: Chapter II —Generating Output, using Variables and Refactoring the Script into different files.
tags:
  - AWS
  - vpc
  - devops
  - terraform
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ADb5oFBqgBA4h-SDyW2D7Q.jpeg)

[**_In the previous article_**]({{< relref "terraform_setup" >}}), we setup tf and got familiar with it with basic example. Now lets proceed further.

All configs can be found on [GitHub](https://github.com/sagarkrp/Terraform_Automation).

### Displaying Output in TF:

For every action we create we can generate output also to be shown on the terminal.

To do so we need to add output block to our config.

For example on the IAM config, add the below output block at the end of the file.

```
output "iam_result" {
  value = aws_iam_user.my_iam_users
}
```
![captionless image](https://miro.medium.com/v2/resize:fit:1204/format:webp/1*U73ZslxbACjVZPib7p3uuw.png)

As of now the the output block is very small as it contains only one resource output. Consider having multiple output blocks for different resources, in that case we can declutter the main config file by creating a new outputs.tf file and having all the output blocks there.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l875zkxC0P7bedTWoMfA5Q.png)

Now apply the config and we should see the outpu printed.

**_Note: For this kind of apply where we know that there is no change in our main requirements we can use -refresh=false. Example here since we know the iam user is already present and we don’t need to verify it._**

```
[root@DELL-G5 iam]# tf apply -refresh=false
No changes. Your infrastructure matches the configuration.
Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.
Outputs:
iam_result = {
  "arn" = "arn:aws:iam::610990668971:user/sagar-iam"
  "force_destroy" = false
  "id" = "sagar-iam"
  "name" = "sagar-iam"
  "path" = "/"
  "permissions_boundary" = tostring(null)
  "tags" = tomap(null) /* of string */
  "tags_all" = tomap({})
  "unique_id" = "AIDAY4QPBXSV5EZQMWAL3"
}
```

### Indexing:

In the previous examples, we created only resource, however we can create multiple instances of same resource such as multiple S3 buckets or multiple EC2s.

We can use a count flag and pass that to the resource name.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SmTDXZwzvN1jE2aHErohZg.png)

### Variables:

Input variables are make the configuration more flexible by defining values that we can assign to customize the configuration. We can change the variable value without interfering on the actual config.

Unlike variables found in programming languages, Terraform’s input variables don’t change values during a Terraform run such as plan, apply, or destroy. Instead, they allow users to more safely customize their infrastructure by assigning different values to the variables before execution begins, rather than editing configuration files manually.

```
variable "iam_user_prefix" {
  default = "labputer_user"
}
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}
provider "aws" {
  region = "${var.aws_region}"
}
resource "aws_iam_user" "my_iam_users" {
  count = 2
  name  = "${var.iam_user_prefix}_${count.index}"
}
```
```
aws_iam_user.my_iam_users[0]: Creating...
aws_iam_user.my_iam_users[1]: Creating...
aws_iam_user.my_iam_users[0]: Creation complete after 2s [id=labputer_user_0]
aws_iam_user.my_iam_users[1]: Creation complete after 2s [id=labputer_user_1]
```

We can pass variables in different ways. In the above config if we comment the default for values, we’ll asked to enter the value while applying. We can set the variable as environment values or create a file called terraform.tfvars or pass the variable value from the command line.

example:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*U87H2aIJdulDBlQdaPESnA.png)

Create the file terraform.tfvars for the above config and add the varible with different value.

```
iam_user_prefix = "iam_user_from_tfvars"
```

Now if we apply, the value from the .tfvars will be used even if we don’t have it commented.

```
[root@DELL-G5 varibles]# tf plan
aws_iam_user.my_iam_users[0]: Refreshing state... [id=labputer_user_0]
aws_iam_user.my_iam_users[1]: Refreshing state... [id=labputer_user_1]
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place
Terraform will perform the following actions:
  # aws_iam_user.my_iam_users[0] will be updated in-place
  ~ resource "aws_iam_user" "my_iam_users" {
        id            = "labputer_user_0"
      ~ name          = "labputer_user_0" -> "iam_user_from_tfvars_0"
        tags          = {}
        # (5 unchanged attributes hidden)
    }
  # aws_iam_user.my_iam_users[1] will be updated in-place
  ~ resource "aws_iam_user" "my_iam_users" {
        id            = "labputer_user_1"
      ~ name          = "labputer_user_1" -> "iam_user_from_tfvars_1"
        tags          = {}
        # (5 unchanged attributes hidden)
    }
Plan: 0 to add, 2 to change, 0 to destroy.
```

If we want to override this, we can pass -var in command line.

```
[root@DELL-G5 varibles]# tf plan -refresh=false -var="iam_user_prefix=iam_user_from_cmd"
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place
Terraform will perform the following actions:
  # aws_iam_user.my_iam_users[0] will be updated in-place
  ~ resource "aws_iam_user" "my_iam_users" {
        id            = "labputer_user_0"
      ~ name          = "labputer_user_0" -> "iam_user_from_cmd_0"
        tags          = {}
        # (5 unchanged attributes hidden)
    }
  # aws_iam_user.my_iam_users[1] will be updated in-place
  ~ resource "aws_iam_user" "my_iam_users" {
        id            = "labputer_user_1"
      ~ name          = "labputer_user_1" -> "iam_user_from_cmd_1"
        tags          = {}
        # (5 unchanged attributes hidden)
    }
Plan: 0 to add, 2 to change, 0 to destroy.
```

> <small>Note: Priority of variables → Command line > .tfvars > env varibles > default value.</small>

Alright that’s it for now. We’ll see more feature in further articles. Thanks for reading.

[Read more on Terraform →](/blogs/#terraform)