---
date: '2024-05-05T19:26:10+05:30'
draft: false
title: 'Linux Terminal tips - Part 1'
Description: Essential Linux Terminal Hacks for Efficiency
tags:
  - linux
  - terminal
  - tips
---


### Introduction:

In the labyrinth of Linux commands, managing tasks can be daunting. Fear not! Here are some handy tips and tricks up your sleeve to streamline your day-to-day operations, making every task a breeze


### 1. Clearing terminal:

Use Ctrl + L to clean the terminal instead of typing clear every time.

![Image Credit: Tec Admin](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LNuC4HwvmpE28qItI9T7RA.png)

### 2. Tab auto complete cmds:

Most of us are aware of tab completion for folders and files, but the same works for commands as well.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kdps1ebzs1g4Nl-H23U33w.png)

### **3. Alias:**

Alias is a short command that we can set (a few are set by default).

eg: set the word “u”, for sudo apt update.

```
alias u="sudo apt update"
alias i='sudo apt install"
```

Now use i to install a package. or u to update repo cache.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YOQjLQFBuDhdZtQxUjysgw.png)

_Note: To set aliases permanently add them in .bashrc._

_Open .bashrc with any editor, and add them to the last line. Save, exit and reload bash with “source .bashrc”._

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PqUni7RpZjkdYEtuUAHxZw.png)

There are several built-in aliases, such as ll is alias for ls -la and etc. To list all, just use alias w/o any other options.

Remove an alias set using cmd with unalias <alias-name>

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9HQsZHYvB7t_1ILQvqWBjA.png)

### **4. Navigate the commands:**

Assume you have typed a long command but forgot to add something at the beginning or at somewhere near to start of the command.

Instead of scrolling all the way, just use Ctrl A. Similarly Ctrl E goes to the end of the line, Ctrl U removes the cmd text prior to the cursor position.

Ctrl W removes one word before the cursor, Ctrl F to move the cursor forward and Ctrl B to move it backwards.

### **5. cd ~ vs cd — :**

the cd (without ~) or cd with ~ (tilde represents home dir) brings you to the home dir from anywhere.


“cd — ” however switches to the previous dir we were in.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yM6sgHSw_pGD-Ezz8NFt3g.png)

### 6. pushd and popd:

When you use "`pushd /path/"`, you switch the current directory to "`/path/”`, while also saving the previous directory onto the directory stack. Then, when you use `popd`, it removes the top directory from the stack and changes the current directory back to it."

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bxJ2IoninfaCoRKSq1cgXw.png)

### 7. hostnamectl:

Change hostname for easy identification of machine.

```
hostnamctl set-hostname <name>
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*VO8fDqiDtTovBx_3VPMT5Q.png)

You can also set your domain name as hostname.

### 8. Get Public IP:

Get public ip using ifconfig.me

```
curl ifconfig.me
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PY-KPwEaF5_bsuchsbgZsA.png)

### 9. Re run the previous command:

Similar to point 3, but you don’t necessarily need to go back to the start (Use those shortcuts for modification in the middle or towards the end).

We can re run the previous command using !! with the left out commands.

```
$ systemctl stop httpd
$ sudo !!
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IdM2jrYb7K4DWoA0-4Es6g.png)

### 10. Re run the previous command arg:

Say you did ls on a directory, but you realised, you wanted to switch to it instead.

```
$ commad <args>
$ 2nd command !$
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Cdve57jThmRnBMYqlX54Vg.png)

### 11. background and foreground task:

If you’re editing a file and need to do something else in the terminal, use `Ctrl+Z` to suspend the task. Then, handle your other tasks and resume the editing with `fg`. This method isn’t specific to any editor and works with various applications.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*va27GBXhz9z8mCAsZcY0hQ.gif)

### 12. Man page and help:

No need to remember all the details for a cmd. Use the below to retrieve them.

*   man : for info about utilities and programs.
*   help : for quick info about built-in shell cmds

```
man wc
help cd

```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NN286i7wSM1Ph4KZQ7369A.png)

### 13. Ctrl Q:

Used Ctrl S to save our changes? In terminal this key combination freezes the terminal. To unfreeze use ctrl q.

### 14. Font Management

To increase the terminal font size use Ctrl and + button, to reduce it, use Ctrl and — button.

### Next up:
[**Checkout the part 2:**]({{< relref "linux-tips2" >}})


