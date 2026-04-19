---
date: '2024-03-22T19:26:10+05:30'
draft: false
title: 'If Statement - Conditional in Bash Scripting'
Description: "Part 3: Usage of if, else and elif statements in shell scripting"
tags:
  - linux
  - shell scrpting
  - devops
  - bash
---


![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aYAEBPL0-U8a-fXcPpr9Ug.png)

### Intro:

So, what’s the deal with 'if' statements? Think of them as the script’s way of making decisions. It’s like having a little script buddy that can say, "Hey, if this thing happens, do this. Otherwise, try something else!"

Syntax:

```
if [ condition ]; then
    # Do this if the condition is true
fi

```

We have a set of keywords: if, then, elif, else and fi.

Let's see a basic example:

```
#!/bin/bash
a=5
if [ $a -eq 5 ]
then
    echo "The condition is True"
fi
```

In this example, we assigned the var a with the value 5. Now the **if** condition checks the value of a and if it matches we do some action with the **then** keyword (just echo here notifying the condition matched)**.** The **fi** keyword marks the end of conditional block.

![captionless image](https://miro.medium.com/v2/resize:fit:932/format:webp/1*YmlsrdPKvSLdZYgcRBfDnA.png)

The [] is an alias of Linux command test. The -eq is an operator, which means “equals to”. Similarly, there are many other operators like -ne for not equals, -gt for greater than, -f for existence of a file, -d for directory and etc. To see all use man page.

```
man test
```

We can even do the test without using [].

```
#!/bin/bash
a=5
if test $a -eq 5
then
    echo "The condition is True"
fi
```

### Using if..else:

If we have multiple checks, then we can use multiple if statements or better yet use else condition.

```
#!/bin/bash
a=5
if test $a -eq 8
then
    echo "The condition is True"
else
    echo "The value of a is not 8"
fi
```

Let's see another example to check if a file exists, if it does then simply print the content of the file. If it does not then create the file and then print its content.

```
#!/bin/bash
file="/home/sagar/random.txt"
data="Hello there, this is testing."
if [ -f "$file" ];
then
    echo "File exists. Printing its content: "
    cat "$file"
else
    echo "File does not exist. Creating the file..."
    echo "$data" > "$file"
    cat "$file"
    echo "File created at $file"
fi
```

Here, we have the -f to check if a file exists. The first time I ran it, I did not have the random.txt, so it was created and running it again just printed the content as the first condition matched.

![captionless image](https://miro.medium.com/v2/resize:fit:1306/format:webp/1*vRBOHj00QhtiCZjOutynqA.png)

### Using elif:

Another example to check if a particular command is installed. If already installed then just run it, if not, install it and then run.

In case we want to install, we need to use package managers. As there are multiple Linux distros with different package managers, we shall make the script universal and to check the distro at run time and use proper commands.

**Note:** We can use either -f to check for the command using its path or use the Linux co**mmand called “command”. Use which command to find location of a program.

```
$ which nano
/usr/bin/nano
$ command -v nano
```
<br></br>

```
#!/bin/bash
cmd=/usr/bin/nano
if [ -f $cmd ]
then
   echo "$cmd is present"
else
   echo "$cmd is not present"
fi
--------------------------
#!/bin/bash
cmd=nano
if command -v $cmd
then
   echo "$cmd is present"
else
   echo "$cmd is not present"
fi
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*D1Wt01g9fYK94uPmlLAdaw.png)

Let's now proceed with the main script.

**Note :** Use update command to refresh the package cache first and then install.

```
#!/bin/bash
app=htop
if command -v "$app" &> /dev/null; then
    echo "$app is present"
else
    echo "$app is not present, installing it"
    if command -v apt &> /dev/null; then
        echo "Debian/Ubuntu Based OS, using apt"
        sudo apt install htop -y
    elif command -v yum &> /dev/null; then
        echo "Red Hat based OS, using DNF/yum"
        sudo yum install htop -y
    else
        echo "Unsupported package manager. Please install htop manually."
        exit 1
    fi
fi
echo "Running $app..."
"$app"
```

**Note:** Usage of the sudo command will ask to enter the password at the time of running the script. To avoid such scenarios the script should either run from the root user or the user should be configured not to ask password for these particular commands.

Use sudo visudo:

```
<username> ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/yum
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZQE6ncGNCDUHIznpTYRbsA.gif)

### Wrapping It Up:

And there you have it! 'if' statements are the secret sauce that’ll take your shell scripts from meh to magnificent. So go ahead, experiment, get creative, and let the 'if' magic flow! Your scripts will thank you later. 😉

Thanks for reading!

[Read More on shell scrpting→](/blogs/#linux)
