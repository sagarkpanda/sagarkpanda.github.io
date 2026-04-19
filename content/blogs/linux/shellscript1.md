---
date: '2024-02-29T19:26:10+05:30'
draft: false
title: 'Introduction to Shell Scripting for Beginners'
Description: "Part 1: Introduction to Bash, shell and scripting for task automation"
tags:
  - linux
  - shell scrpting
  - devops
  - bash
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HVqm9vCg6-5t6qGpu1g86A.png)

### What’s Shell:

In simple terms shell is a program that takes input as commands and passes the operating system (OS) to perform the desired task.

In linux we have many shell programs such as bash, zsh, fish and etc. We are going to use bash in this series.

### What's Bash:

The “Bourne again shell” is a replacement and brings a lot of improvement over the original bourne shell. In modern days most of the linux distributions use bash by default.

### Why use Shell scripting:

The shell scripting contains the commands we can use without a script also.

But say we want to run a set command everyday, so instead of running them repeatedly, we can create a script and run it reducing our task.

We can also run the script on a scheduled basis hence achieving automation.

Lets Roll:

First check which shell you are using with the below command:

![captionless image](https://miro.medium.com/v2/resize:fit:1136/format:webp/1*2oeLIiFy7B9bxCBpc1QjOg.png)

As we can see the result we get is /bin/bash.

If you have any other results, then use /bin/bash to switch the shell to bash.

## **Write your first script:**

Create a file with sh extension (having sh extension is not mandatory but standard) and add the following echo statement.

```
# vim hello.sh
echo Hello World!
```

Now we simply can’t run a shell script, first we have to make it executable.

```
sudo chmod +x hello.sh
```

It’s ready to be executed. Run the script.

```
./hello.sh
```
<br></br>

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lFdG8upNlB_Lm3Eb6GslQQ.png)

There we go. We wrote a great shell script :)
Don’t worry, even though this is not useful at this point, understanding the basics really paves the way ahead.

> Note: You may try to remove the .sh extension and run the script again, it would still work just fine.

## The #!

The hash (#) bang (!) aka shebang is a special statement in linux shell scripting to instruct the shell about which interpreter we want to use.

What it means is we tell the shell to use which program to use. for example /bin/bash → for bash, /usr/bin/python3 → for python etc.

By default it takes the the default shell so in our case it’s bash. That’s why even if you remove .sh its recognised and run as a shell script. It is a good practice to always use the #!

Update the script content and lets run again.

**_Note: you can also use “#!/usr/bin/env bash”_**

```
#!/bin/bash
echo 'Hello World'
#print("hello")
print('hello from python')
```
![captionless image](https://miro.medium.com/v2/resize:fit:950/format:webp/1*T4yhk7fo5gbqoxpCeo3yow.png)

Guess what happens?
The “hello world” will be printed, the hello won’t be printed as its commented and the last print statement will cause an error since its python and we tell the shell to use bash.

Note: # symbol in Linux is generally used to comment but incase of shell scripting when used in first line it serves as interpreter definition.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gyjB931kZwo63x1UgDpNMg.png)

Ok, so lets change this, set the interpreter to python.
First run “which python3” to get the the python path.

![captionless image](https://miro.medium.com/v2/resize:fit:860/format:webp/1*rsFwjGER9CogK83A7dKxxA.png)

Now when you run it, you should get hello from python.

Include even more python program and run it.

```
sagar@DELL-G5:~$ vim hello
#!/usr/bin/python3
#print("hello")
import os
print('hello from python')
dir = os.getcwd()
print("pwd is" + dir)
```

![captionless image](https://miro.medium.com/v2/resize:fit:1274/format:webp/1*AvnoPfZL0Nf9hBes1f65pA.png)

Here’s another example:

```
#!/bin/bash
echo 'Hello There'
#current_date=$(date +%Y-%m-%d)
echo "Today's date is: $(date +%d.%b.%Y) and its a leap day"
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eFw-OReGtqBJWY4tmODr6Q.png)

## Conclusion:

Now that you are familiar with the basics, start exploring and practicing these. We’ll see more in the future.

Thanks for reading!

Reference: LearnLinux.tv

[Read More on shell scrpting→](/blogs/#linux)