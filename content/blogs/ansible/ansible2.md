---
date: '2023-05-29T19:26:10+05:30'
draft: false
title: 'Ansible - Groups, Vars and Loop'
Description: "Chapter 2 - Groups, Variables, Conditionals and Loops in Ansible"
tags:
  - ansible
  - devops
  - cloud
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bT5aEzzjUduWEy4rTVniFQ.jpeg)

In the [**_previous article_**]({{< relref "ansible1" >}}), we saw how to install Ansible, ping a server and a simple playbook.

In this article we’ll discuss about using groups , use of variables and loops in a playbook.

This setup includes 3 machines. The controller node is a local machine where the managed nodes are two ec2 instances.

## Inventory Groups
Ansible allows you to organize hosts into groups within the inventory file. Grouping hosts enables you to target specific subsets of hosts and apply different configurations or tasks based on their roles or characteristics.

We can create groups as below:

```
# cat hostlist
[uat]
35.154.191.210
[prod]
65.0.7.153
```
<br></br>

```
---
- hosts: uat
  become: true
  tasks:
    - apt:
        name:
        - apache2
        state: present
```
<br></br>

```
# ansible-playbook groups.yaml
 ____________
< PLAY [uat] >
 ------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
 ________________________
< TASK [Gathering Facts] >
 ------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
ok: [35.154.191.210]
 ____________
< TASK [apt] >
 ------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
changed: [35.154.191.210]
 ____________
< PLAY RECAP >
 ------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
35.154.191.210             : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

To disable the cowsay prompt, add nocows=1 in ansible.cfg

```
cat ansible.cfg
[defaults]
inventory=./hostlist
remote_user=ubuntu
ask_pass=false
nocows=1
[privilege_escalation]
become=true
become_method=sudo
```

Now lets change our playbook to include 2nd group and run the playbook.

```
---
- hosts: uat
  name: Install Apache HTTP server
  become: true
  tasks:
    - apt:
        name:
        - apache2
        state: present
- hosts: prod
  name: Install cURL
  become: true
  tasks:
    - apt:
       name:
       - curl
       state: present
```
<br></br>


**ansible-playbook groups.yaml**
```
PLAY [Install Apache HTTP server] ********************
TASK [Gathering Facts] *******************************
ok: [35.154.191.210]
TASK [apt] *******************************************
ok: [35.154.191.210]
PLAY [Install cURL] **********************************
TASK [Gathering Facts] *******************************
ok: [65.0.7.153]
TASK [apt] *******************************************
ok: [65.0.7.153]
PLAY RECAP *******************************************
35.154.191.210             : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
65.0.7.153                 : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```


### Group alll

The “all” indicates all the hosts, we don’t need to specify it explicitly, ansible takes this as default.

```
---
- hosts: uat
  name: Install Apache HTTP server
  become: true
  tasks:
    - apt:
        name:
        - apache2
        state: present

- hosts: prod
  name: Install cURL
  become: true
  tasks:
    - apt:
       name:
       - curl
       state: present
- hosts: all
  name: Create User
  tasks:
    - user:
       name: sagar
       state: present
```
<br></br>

```
ansible-playbook groups.yaml
PLAY [Install Apache HTTP server] ****
TASK [Gathering Facts] ***************
ok: [35.154.191.210]
TASK [apt] ***************************
ok: [35.154.191.210]
PLAY [Install cURL] ******************
TASK [Gathering Facts] ***************
ok: [65.0.7.153]
TASK [apt] ***************************
ok: [65.0.7.153]
PLAY [Create User] *******************
TASK [Gathering Facts] ***************
ok: [65.0.7.153]
ok: [35.154.191.210]
TASK [user] **************************
changed: [65.0.7.153]
changed: [35.154.191.210]
PLAY RECAP ***************************
35.154.191.210             : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
65.0.7.153                 : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Using Variables:

Example: If we want to install any application or perform any tasks on the nodes, we need to mention those application/task names inside playbook at various places. To avoid repetitive writing, we can create variables and call them in our tasks. We can create variables inside playbook or outside as a separate file.

```
---
- hosts: all
  vars:
    - pkg:
      - apache2
      - net-tools
    - usr:
      - kumar
  tasks:
    - name: Install applications {{pkg}}
      apt:
       name: "{{pkg}}"
       state: present
    - name: Create user {{usr}}
      user:
       name: "{{usr}}"
       state: present
```
<br></br>

```
# ansible-playbook varsplay.yaml
PLAY [all] ******************
TASK [Gathering Facts] ******
ok: [65.0.7.153]
ok: [35.154.191.210]
TASK [Install applications ['apache2', 'net-tools']] *********
changed: [35.154.191.210]
changed: [65.0.7.153]
TASK [Create user ['kumar']] *******
changed: [65.0.7.153]
changed: [35.154.191.210]
PLAY RECAP ************************
35.154.191.210             : ok=3    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
65.0.7.153                 : ok=3    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

We can also create the variables as a separate yaml file and include here.

```
cat vars.yaml
pkg: vim
usr: nothing
```
<br></br>

```
---
- hosts: all
  vars_files:
    - vars.yaml
  tasks:
    - name: Install applications {{pkg}}
      apt:
       name: "{{pkg}}"
       state: present
    - name: Create user {{usr}}
      user:
       name: "{{usr}}"
       state: present
```
<br></br>

```
ansible-playbook varsplay.yaml
PLAY [all] ************************
TASK [Gathering Facts] ************
ok: [65.0.7.153]
ok: [35.154.191.210]
TASK [Install applications vim] ****
ok: [65.0.7.153]
ok: [35.154.191.210]
TASK [Create user nothing] *********
changed: [65.0.7.153]
changed: [35.154.191.210]
PLAY RECAP *************************
35.154.191.210             : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
65.0.7.153                 : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Conditionals:

Ansible can use conditionals to execute tasks or plays when certain
conditions are met. For example, a conditional can be used to check
the OS distribution on a managed host before Ansible installs or configures a service.

```
- name: install package based on OS
  hosts: all
  tasks:
  - name: install package if CentOS
    yum:
     name: httpd
     state: present
    when: ansible_distribution == 'CentOS'
  - name: install package if Ubuntu
    apt:
     name: apache2
     state: present
    when: ansible_distribution == 'Ubuntu'
```
<br></br>

```
ansible-playbook condition.yaml
PLAY [install package based on OS] *********
TASK [Gathering Facts] *********************
ok: [35.154.191.210]
ok: [65.0.7.153]
TASK [install package if CentOS] ***********
skipping: [35.154.191.210]
skipping: [65.0.7.153]
TASK [install package if Ubuntu] ***********
ok: [65.0.7.153]
ok: [35.154.191.210]
PLAY RECAP **********************************
35.154.191.210             : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
65.0.7.153                 : ok=2    changed=0    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
```

## Loops:

With the `loop` keywords, we can execute a task multiple times.

```
- name: create users
  hosts: all
  tasks:
  - name: create user
    user:
     name: "{{ item }}"
     state: present
    loop:
    - user1
    - user2
    - user3
    - user4
```
<br></br>

```
ansible-playbook loopplay.yaml
PLAY [create users] ************************
TASK [Gathering Facts] *********************
ok: [65.0.7.153]
ok: [35.154.191.210]
TASK [create user] *************************
changed: [35.154.191.210] => (item=user1)
changed: [65.0.7.153] => (item=user1)
changed: [35.154.191.210] => (item=user2)
changed: [65.0.7.153] => (item=user2)
changed: [65.0.7.153] => (item=user3)
changed: [35.154.191.210] => (item=user3)
changed: [35.154.191.210] => (item=user4)
changed: [65.0.7.153] => (item=user4)
PLAY RECAP ************************************
35.154.191.210             : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
65.0.7.153                 : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Using loops and variables:

Create usrvar.yml containing all the username and usersplay.yml for the task playbook.

```
#vim usrvar.yml
usr:
- usera
- userb
- userc
- userd
```

<br></br>

```

#vim usersplay.yml
- name: create users
  hosts: all
  vars_files:
  - usrvar.yml
  tasks:
  - name: create user
    user:
     name: "{{ item }}"
     state: present
    loop: "{{ usr }}"
```
<br></br>

```
ansible-playbook usersplay.yaml
PLAY [create users] *************************
TASK [Gathering Facts] **********************
ok: [35.154.191.210]
ok: [65.0.7.153]
TASK [create user] **************************
changed: [65.0.7.153] => (item=usera)
changed: [35.154.191.210] => (item=usera)
changed: [65.0.7.153] => (item=userb)
changed: [35.154.191.210] => (item=userb)
changed: [65.0.7.153] => (item=userc)
changed: [35.154.191.210] => (item=userc)
changed: [65.0.7.153] => (item=userd)
changed: [35.154.191.210] => (item=userd)
PLAY RECAP ************************************
35.154.191.210             : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
65.0.7.153                 : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

This is the End of the article. We’ll see more features in future tutorial. Thanks for reading.

**_Make sure to terminate any vm instances if you have created to avoid incurring charges._**

Read More on Ansible:

[Chapter 1]({{< relref "ansible1" >}}), [Chapter 3]({{< relref "ansible3" >}})

Reference: [Ansible Docs.](https://docs.ansible.com/)