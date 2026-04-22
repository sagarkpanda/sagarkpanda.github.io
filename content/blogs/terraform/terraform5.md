---
date: '2024-05-12T10:26:10+05:30'
draft: false
title: 'Dynamic Data fetching — Data Sources in Terraform/OpenTofu'
Description: Chapter V - Dynamically fetch data from remote using data source in Terraform/OpenTofu.
tags:
  - AWS
  - vpc
  - devops
  - terraform
---


![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*F6h8tusJxak5v3v4ViKYdw.png)

I have migrated of OpenTofu.

If you wish to migrate, the process is pretty simple.

Steps to migrate existing terraform infra:

1.  [Install opentofu](https://opentofu.org/docs/intro/install/)

2. Initialize opentofu just as you do with terraform.

tofu init, tofu apply, tofu destroy etc. every command remain the same. Once you init, the provider info will be updated with tofu registry.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3jI_mhnUoXq-mxlxkOTLFA.png)

### Intro:

A data source is a mechanism for fetching and utilizing information from external sources or existing infrastructure. These sources can include cloud service providers like AWS, Azure etc as well as APIs, databases, or other external systems

For example if we have already created a VPC, and now we want to create an EC2 instance on the VPC, so we fetch the VPC id, the subnet id (if we want to specify) and use that in the config.

First lets create an EC2 instance with hardcoded details of default VPC, for the instance I’ll use AMI id of Amazon Linux 2023, and will specify a subnet from the default VPC.

All the config are available on [GitHub](https://github.com/sagarkpanda/Terraform101.git)

```
#main.tf
provider "aws" {
  region = "ap-south-1"
}
resource "aws_security_group" "vm_sg" {
  name   = "vm_server_sg"
  vpc_id = "vpc-090dfe974036c99c4" #my default vpc id
  ingress {
    ---
  }
  egress {
    ---
  }
  tags = {
    Name = "my_sg"
  }
}
resource "aws_instance" "test_machine" {
  ami = "ami-013e83f579886baeb" #ami id of amazon linux 2023
  key_name               = "test" #create and download the key prior
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.vm_sg.id]
  subnet_id              = "subnet-018e9f41175289d9c"
  #one of the subnets of default vpc: ap-south-1a
  tags = {
    Name = "My Test VM"
  }
  connection {
    ---
  }
   provisioner "remote-exec" {
    inline = [     ---
    ]
  }
}
#skipped the varibles and outputs config here Check github repo
```

This works fine. But the AMI id may change over time so hard coding it not really helpful and we’ll need to modify this in future as the ami id changes.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FSfhQnTI4giXYm9HRjV7GQ.png)

So instead lets use data provider and fetch the AMI id every time, similarly we can get the VPC id and the subnet id.

First lets modify the VPC, as I m using default VPC, I’ll get the id using the below block.

```
resource "aws_default_vpc" "default" {
}
```

The “aws_default_vpc” is a special block, terraform won’t be deleting this with the destroy command. Read more about it here.

[Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/default_vpc?source=post_page-----a0ed3e0350b9---------------------------------------)

Now for the security group creation block replace the vpc id with the above.

```
provider "aws" {
  region = "ap-south-1"
}
resource "aws_default_vpc" "default" {
} # you can put this in another file like datasource.tf
resource "aws_security_group" "vm_sg" {
  name = "vm_server_sg"
  #   vpc_id = "vpc-090dfe974036c99c4"
  vpc_id = aws_default_vpc.default.id
---
---
---
}

```

For the subnets and AMI, I’ll create a separate file to have modularity.

```
#datasource.tf
data "aws_subnets" "default_subnets" {
  filter {
    name   = "vpc-id"
    values = [aws_default_vpc.default.id]
  }
}
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }
 filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}
```

The first fetches all the subnets from the default VPC. The 2nd block fetches all the AMI ids and with the filters we are narrowing it down to our choice, such as the name _“al2023-ami-2023*”_ matches with Amazon Linux 2023 and the other filter selecting x86_64 bit architecture of the image.

So far we are fetching the details, now we need to update the usage in the main config.

```
resource "aws_instance" "test_machine" {
  # ami = "ami-013e83f579886baeb"
  ami                    = data.aws_ami.amazon_linux_2023.id
  key_name               = "test"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.vm_sg.id]
  # subnet_id              = "subnet-018e9f41175289d9c"
  subnet_id = data.aws_subnets.default_subnets.ids[2]
--
--
}
```

The index with the subnet_id is to choose 1 value as this data block retuns multiple values.

We can also verify these fetched data in the terraform/tofu console or with the show command.

```
tofu show (terraform show)
tofu/terraform console
> commads here
> exit -- to  quit console
```

Additionally you may output the info, so these will be printed at the end of the execution.

```
# outputs.tf
 output "aws_az_linux_2023_ids" {
   value = data.aws_ami.amazon_linux_2023
}
output "all the subnets in the default vpc" {
  value = data.aws_subnets.default_subnets.ids
}
```

Now plan and apply. Upon completion we can verify. We can also see the AMI ID while it fetches.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Db77vGV3E1It8kY4hkEKlA.png)

Or on the plan generated and the output if you have created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SPicy52uiuk3O4GszA9QtQ.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*asrVne8J5OEwnBvdP5aHTg.png)

You may save the output to a josn file with the following command. This josn doc also contains the details.

```
tofu output -json > output.json
```

### Verify on console:

Open tofu console with “tofu console”.

```
> aws_default_vpc.default
> data.aws_ami.amazon_linux_2023.id
> data.aws_subnets.default_subnets
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*k0n5uZim8HS4_PTv1az0_w.png)

### Wrap up:

The data blocks are read only configurations that read and fetch data from existing infra.

Don’t forget to destroy the resources with tofu destroy. No need to worry about deleting default VPC or subnets.

**References:** [**HashiCorp**](https://developer.hashicorp.com/terraform/language/data-sources)

[Read more on Terraform →](/blogs/#terraform)

