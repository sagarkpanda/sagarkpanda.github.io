---
date: '2026-04-22T12:30:10+05:30'
draft: false
title: 'Beyond Objects — Using Amazon S3 Files as a Native File System on EC2'
Description: 'Learn how to mount S3 buckets natively on your EC2 instances using the new NFS v4.1+ interface.'
tags:
  - aws
  - s3
  - s3files
  - cloud
  - devops
---

![AWS_S3Files](https://i.ibb.co/cSqmmDcV/x.jpg)

## Introduction

For over a decade, we’ve been known S3 is not a file system. We used hacks like `s3fs-fuse` or accepted the limited semantics of **Mountpoint for S3**. That has changed on **April 2026**.

AWS has launched a new S3 feature called **S3 Files**, a native capability that allows us to mount S3 buckets which under hood used AWS EFS (**NFS v4.1+** with full POSIX semantics).

In this tutorial we’ll mount it to EC2, however there are other suppported services.

## Demo

Lets see how to create and use S3 files with EC2 instanced.

### Step 1: Creating Bucket and file system

Create a ‘General Purpose’ S3 bucket and turn on versioning, you can’t create file system if versioning is disabled.

Now click on the file systems tab

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*waJtD90VhnjNP3sIHqSjHw.png)

Change the bucket prefix or vpc if you want or proceed with the creation.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x1BfwDM-RZuB28IDgENdJw.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wSbgWbcZNkj97zCQHQHuYQ.png)

It would take a few mins to create the file system and mount targets, mount targets will be created in all the AZs of the particular region where the bucket is created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*D70AXK92UN7a7CTNWDRiIA.png)

Once the mount targets are available, we are ready to mount this. Now as you can see we can attach this to not only EC2 but Lambda and ECS tasks as well.

> Note: Check the security group attached to these mount targets as we’ll need to edit it to allow NFS inbound rule. You can either allow 2049 from any source or allow only from the sg of the EC2 instance.

### Step 2: Creating EC2 instance

Create an EC2 instance as usual but we must select a subnet to proceed otherwise S3 files can not be mounted.

Click add shared file system by choosing S3 in files option. You should see mount point and a command for later use. Copy and paste that somewhere.

Additionally you have to attach an IAM role to the instance with specific S3files policy, or attach existing policy of S3FilesClientFullAccess. Check the documentation for more info

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bs2_QXvBouHe9_amrA8vKA.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZFDne33c-aOUkopnGBXnOA.png)

### Step 3: Mounting S3 file system

SSH to your machine, and run the command copied earlier. Make sure to update the system cache and have curl installed if not already present.

```
curl https://amazon-efs-utils.aws.com/efs-utils-installer.sh | sh -s -- --install-launch-wizard \
--mount-s3files fs-0d8949dde025cba67 /mnt/s3/fs1
```

If you see any permission errors, it could be misconfigured IAM role or the inbound port of the security group attached to S3 does not have FNS rule.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-u_pGsMlLu_2QCbU1mQsQQ.png)

When all the permission are sorted (if any) the mounting will be successful. And you can view and list the mount point.

You can now create file in that particular mount point and the files will be visible in S3 bucket or upload files in S3 bucket and the same will be available inside the instance.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KA2LKcE3q2c8z6JDGUB4Ig.png)

## Wrap up

Amazon S3 Files marks a major turning point by providing native NFS v4.1+ support and full POSIX semantics directly on your buckets. For a deeper dive into the technical setup and implementation details, be sure to explore the official documentation and the launch announcement linked below.

Source: [AWS News](https://aws.amazon.com/blogs/aws/launching-s3-files-making-s3-buckets-accessible-as-file-systems/), [AWS Docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html)

[Read more on AWS →](/blogs/#cloud)