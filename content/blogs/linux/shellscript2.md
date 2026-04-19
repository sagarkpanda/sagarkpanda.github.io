---
date: '2024-03-10T19:26:10+05:30'
draft: false
title: 'Variables and Math Functions in Bash'
Description: "Part 2: Usage of variables to set changeable data, and math functions for arithmetic operations"
tags:
  - linux
  - shell scrpting
  - devops
  - bash
---


![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XufA9FFra4lI34SOm3UDtA.png)

### What is a variable:

A variable is a container where we can store some value which have possibility to change.

Just like any other programming language, bash also has variables, in fact we saw one default variable in the 1st chapter which is $SHELL. There are many other default variables such as $HOME, $PWD, $PATH, $USER etc.

![captionless image](https://miro.medium.com/v2/resize:fit:1280/format:webp/1*nFUQh6ivIwKFTIxHXhmLTg.png)

We can create a variable using equals symbol and to call a variable we use $. Calling the variables without $ does not make bash parse the value of the variables.

![captionless image](https://miro.medium.com/v2/resize:fit:1062/format:webp/1*uesTvtjSaZ7wIWkKueIpvw.png)

The bash default variables are always set with caps letters, we can do that too for our own variables, but it's generally a good idea to keep our vars in lowercase so we can easily distinguish if the variables are default or custom.

```
#!/bin/bash
host="Windows"
os="Ubuntu"
echo "Hello there, this is $os running on $host"
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Lz-e638LF1Kp4mzbw5M_fg.png)

Now when we execute this, we get the $os and $host values parsed and replaced.

![captionless image](https://miro.medium.com/v2/resize:fit:1316/format:webp/1*AJt8otKM38_fjn2jE_AOig.png)

Variables allow us to define something once and use it multiple times.
For example now I want to change the rocky Linux, then I don’t need to change in all the places.

```
#!/bin/bash
host="Windows"
os="Rocky Linux"
version=9
echo "Hello there, this is $os running on $host"
echo "Hello There, now its $os"
echo "The version of $os is $version"
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OueyDN_hdQz9iZRjI5RPRA.png)

## Math Function:

In bash the expr keyword is used to perform mathematical operations.
All the arithmetic operations use the general symbols like + — / and * however be careful with multiplication as * has a diff use in Linux which is to indicate everything.

So for multiplication we need to inform bash to ignore the general meaning by adding an escape sequence.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eJgqMctorC9x3Z-lkMH9gQ.png)

```
#!/bin/bash
first=50
second=3
echo "The third value is: $(expr $first + $second)"
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hHlGbDoRXgyleoc-6f-BkQ.png)

Note: expr does not calculate floating point in division, for doing so we need to use basic calculator (bc). Install it if not available with apt install.

```
sudo apt update && sudo apt install bc
```

Now we can perform division with correct way.

```
sagar@DELL-G5:~$ echo  "5 / 2" | bc -l
2.50000000000000000000
sagar@DELL-G5:~$ echo "scale=0; 5 / 2" | bc -l
2
sagar@DELL-G5:~$ echo "scale=1; 5 / 2" | bc -l
2.5
sagar@DELL-G5:~$
```

So updating the script form earlier we have the below operations. The number used for scale is the number of floating points we want to show.

![captionless image](https://miro.medium.com/v2/resize:fit:850/format:webp/1*opp7-a40-5bL8apkK4-EkA.png)

```
#!/bin/bash
first=50
second=3
echo "The third value is: $(expr $first + $second)"
echo "$first divided by $second is: $(expr $first / $second)"
echo "$first divided by $second is: $(echo "scale=1; $first / $second" | bc -l)"
```

Alright, that's all for today. Thanks for reading!

Reference: LearnLinux.TV

[Read More on shell scrpting→](/blogs/#linux)