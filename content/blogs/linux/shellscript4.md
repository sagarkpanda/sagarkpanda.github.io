---
date: '2024-06-26T19:26:10+05:30'
draft: false
title: The Essential Role of Exit Codes in Bash Scripting
description: 'Part 4: Using exit codes with if condition, manipulation by forcing exit codes.'
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AMpzINCW_0-_yto6ZmXu2Q.png
tags:
- linux
- shell scrpting
- devops
- bash
series:
- Shell Scricpting
series_order: 4
categories:
- Linux & Automation
---

## What are exit codes in linux

In Linux and Unix-like systems, an exit code is a numeric value returned by a command or a script after completion. It indicates the success or failure of the command or script execution.

Here are a few:

*   `0`: Success. The command or script executed successfully without any errors.
*   `1`: General error. The command or script encountered an error.
*   `2`: Misuse of shell built-ins (according to Bash documentation).
*   `127`: Command not found. This happens when the command you are trying to execute is not found in the system’s PATH.

Any non zero exit code can be considered as failure of some sort.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0F4fN1Pz6Wby8VzhAw3hGw.png)

Lets use in script.

```bash
#!/bin/bash
app=curl
sudo apt install $app
echo "The installation status for $app is: $?"
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*issDScuC265mpRNzXBC6wg.png)

Change the app from curl to some random text which should not be any valid app/utility.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*L0SSf8EudXzzmLttaMN89g.png)

### Using exit codes to perform tasks

We can use exit codes with conditional statements and perform certain tasks based on the results.
For example to run a diff command if one fails.

```bash
#!/bin/bash
app=curly
sudo apt install $app
#echo "The installation status for $app is: $?"
if [ $? -eq 0 ]
then
        echo "$app was installed"
        which $app
else
        echo "$app failed to install, check your script"
fi
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hLMR-_sA22gZT3yeFIdi1Q.png)

When you check for exit status, the check should be placed at the proper location.

For example, in the above script, if you uncomment the echo statement, the result will be diff.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xYJJHLWSZoEQJZq2WAwTJA.png)

This script prints “curly was installed” even with the general apt error saying the package was not found.

Why you may ask? It’s because of the previous echo statement. The execution of the echo was successful and the status changed to 0. Now since we are validating the status after the echo, the condition matches.

### Forcing exit status

We can force the script resulting specific exit codes by using the keyword “exit”

```bash
#!/bin/bash
echo "Hello World"
echo "The normal exit code for the above statement is: $?, check with 'echo \$?'"
exit 155
echo "Hi"
```

This script will print the first two echo statements and the exit code will be whatever you have set.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*buYIRtIOq3UPMdyveyNzCw.png)

Exit statements will exit the script execution no matter what you have set.

Similarly if you have set the exit code 0, even for a command failure the status will be 0.

```bash
#!/bin/bash
xyz
echo "The normal exit code for the above statement is: $?, check with 'echo \$?'"
exit 0
echo "Hi"
```

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gUpYBNGb-vh4FfUnzN18Mg.png)

Exit inside of an if block also exits the whole script not just the block.

```bash
#!/bin/bash
a=5 # try 7
if [ $a -eq 5 ]
then
   echo "condition is true"
   exit 0
else
    echo "condition is false"
    exit 1
    echo "end else"
fi
echo "the end"
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ksxqd6V007FKqEgj9cjSig.png)

> Note: The exit statement even without any code will also terminate the script.

That’s all about it.

**References:** LearnLinuxTV

[Read More on shell scrpting→](/blogs/#linux)