var Pe=Object.defineProperty;var De=(t,n,o)=>n in t?Pe(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o;var q=(t,n,o)=>De(t,typeof n!="symbol"?n+"":n,o);import{a as getAugmentedNamespace,g as getDefaultExportFromCjs}from"./C365Jnfj.js";const __vite_glob_0_0=`---
date: '2023-05-21T19:26:10+05:30'
draft: false
title: Getting started with Ansible - Configuration Managament
description: Chapter 1 - Installation, basics and playbook
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*a1Bd73PrCYh4g2P7IU1vOA.jpeg
tags:
- ansible
- devops
series:
- Ansible Fundamentals
series_order: 1
categories:
- Asnible
---

### Introduction:

Ansible is an open source configuration management utility. It can automate and standardize the configuration of remote hosts and virtual machines. We can perform application installation, system update and many such operations.


### Why use Ansible:

Ansible is very handy when it comes to installation of software on large numbers of machines. But why ansible when we can use Chef or Puppet.

*   Ansible uses YAML scripts which is very easy to understand. (While others use Ruby and a specific DSL)
*   Ansible is agent less. It uses SSH which is already present in all the machines. So we dont need to install ansible on all the destination machines. We install it on only one machine which we call Master Node. (Others need agents to be installed on the destination machines)
*   Ansible is push based system, meaning whatever we specify on our script on the master node, and run command or execute a playbook, the controller node initiates the execution and pushes the necessary tasks and configurations to the managed nodes over SSH. Each managed node runs the tasks locally based on the received instructions.

### Terminologies used in Ansible:

*   **Playbooks**: Playbooks are written in YAML format and define the desired state of a system. It contains of a set of tasks and configurations that Ansible executes on target hosts. Playbooks provide a high-level abstraction and allow you to describe complex automation workflows.
*   **Inventory**: The inventory file in Ansible defines the hosts or managed nodes on which tasks are executed. It can be a static file listing hostnames or IP addresses, or a dynamic inventory script that fetches host information from external sources like cloud providers or databases.
*   **Modules**: Ansible provides a wide range of built-in modules that abstract common system operations such as package installation, file management, service management, user management, and more. Modules are used in playbooks to perform specific tasks on target hosts.
*   **Tasks**: Tasks are the individual steps within a playbook that Ansible executes sequentially. Each task maps to a module and defines the desired state or action to be performed on the target hosts.
*   **Roles**: Roles are a way to organize and encapsulate related tasks, handlers, and files into reusable units. They promote code reuse and allow for a modular approach to configuring systems. Roles can be shared and used across multiple playbooks.
*   **Inventory Groups**: Ansible allows you to organize hosts into groups within the inventory file. Grouping hosts enables you to target specific subsets of hosts and apply different configurations or tasks based on their roles or characteristics.
*   **Ansible Vault**: Ansible Vault provides encryption and decryption capabilities to protect sensitive data such as passwords, API keys, or certificates. It allows you to securely store and use confidential information within your playbooks.
*   **Ansible Galaxy**: Ansible Galaxy is a platform for sharing and discovering Ansible roles and collections created by the community. It provides a vast collection of pre-written roles that can be easily integrated into your playbooks.

### Installation:

To use ansible, we need Python. We have two ways to install it on linux.

*   Install using system package manager like apt/dnf
*   Using pip (the package manager of python)

Here I’m using pip to install ansible.

\`\`\`
## first install pip if its not avaialble alreday
sudo apt install python3-pip
pip3 install ansible
\`\`\`

Check ansible verison with “ansible — version” command.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fZkCnkTWHKh0WYS3auUVWQ.png" alt="Anible Version" width="1000" height="600">}}

In this example, I have 2 machines. Ansible is installed in one machine and I have generated ssh keys, added that to the 2nd machine. I have also set hostnames for easy identification and added them to /etc/hostname.

\`\`\`
# on the machine with Ansibel and SSH key generated
sudo hostnamectl set-hostname Ansible_Controller
# the 2nd machine which we will configure applocation
# using ansible from the above machine
sudo hostnamectl set-hostname Ansible_Managed
\`\`\`

Create two files called **ansible.cfg** and **hostlist/inventory** (or any name). Provide the IP of the server you want to manage or the hostname if you set it in /etc/hosts.

The ansible.cfg is the main configuration that Ansible uses. We can create it inside /etc/ansible, or in our home dir or current working directory. In this example I have created in pwd.

\`\`\`ini
# the inventory/hostlist file
#172.31.32.149
#43.205.125.236
Managed
\`\`\`

\`\`\`ini
# the ansible.cfg file
[defaults]
inventory=./hostlist
remote_user=ubuntu
ask_pass=false
[privilege_escalation]
become=true
become_method=sudo
\`\`\`

Now, lets try to ping the server with the below command: **ansible -m ping all.** We are getting response from the other machine.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_aZNBaMSaS5DtazGDjNGAw.png" alt="Anible ping test" width="1000" height="600">}}

### Getting help in Ansible:

Ansible comes with documentation built into the command line. By using this we can get help on how to use different modules and even get few examples.

Use the below command to view list of modules available:

\`\`\`
ansible-doc -l
\`\`\`

To narrow down the results, we can grep the result to find the particular module (expected as there could be many or could have different name) we are looking for.

for example to look for apt module we can use the command like below:

\`\`\`
$ ansible-doc -l | grep apt
ansible.builtin.apt                                                                             ...
ansible.builtin.apt_key                                                                         Add...
ansible.builtin.apt_repository                                                                  Add and re...
check_point.mgmt.cp_mgmt_get_attachment                                                         Retrieves a packet capture or blob data, according to the attri...
community.general.apt_repo                                                                      Manage APT repo...
community.general.apt_rpm                                                                       AP...
community.skydive.skydive_capture                                                               Module which manages flow ...
community.vmware.vmware_guest_network                                                           Manage network adapters of specified virtual machine in given v...
community.windows.win_net_adapter_feature                                                                        Locks package versions i...
\`\`\`

Now after we find out the module name we can pass that to get full details of the module:

\`\`\`
ansible-doc apt
\`\`\`
{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RUwJxY6onToz3EFTVEpJBA.png" alt="Anible doc" width="1000" height="600">}}

To find example of any module type “**_/EXAMPLE_**”.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ppQcEhwf9B2KYVN5j17h-w.png" alt="Anible doc example" width="1000" height="600">}}

### Using Playbook:

**Example: Install Apache HTTP server**

Create a yaml file with the task of installing apache http server, start and enable it. Will also send a stiatic html to /var/www/html directory.

\`\`\`yml
---
- hosts: Managed
  become: true
  tasks:
    - apt:
        name:
        - apache2
        state: present
    - service: name=apache2 state=started enabled=yes
    - raw: "echo Welcome to Apache based webapge powered by Ansible | sudo tee /var/www/html/index.html
\`\`\`

Now to apply the playbook, we need to use ansible-playbook command as below:

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*5ETaRO8Nep2TsnM26KbdKA.png" alt="Anible playrbook run" width="1000" height="600">}}

We can see the tasks we defined were executed. Lets check the 2nd machine to see if apache was installed and running.

Note: Check playbook syntax before applying using “ — synytax command”. You can also use -C to check what the playbook is going to do (dry run)

\`\`\`
ansible-playbook apache.yaml --syntax
playbook: apache.yaml
----------------------------------
ansible-playbook apache.yaml -C
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Njnj10eR1_odzEwGy4jlTQ.png" alt="apache status" width="1000" height="600">}}

As we can see, Apache has been installed, started and enabled. Lets browse the IP to see our webpage.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*67iNbur6yJaBlh_HpQ8W2A.png" alt="app webpage" width="1000" height="600">}}

Congratulations on completing the basic Ansible setup. This marks the end of this tutorial. We’ll see advanced configuration in future tutorial.

**_Make sure to terminate any vm instances if you have created to avoid incurring charges._**

Thanks for reading.

Reference: Ansible Docs`,__vite_glob_0_1=`---
date: '2023-05-29T19:26:10+05:30'
draft: false
title: Ansible - Groups, Vars and Loop
description: Chapter 2 - Groups, Variables, Conditionals and Loops in Ansible
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bT5aEzzjUduWEy4rTVniFQ.jpeg
tags:
- ansible
- devops
series:
- Ansible Fundamentals
series_order: 2
categories:
- Asnible
---


In the [**_previous article_**]({{< relref "ansible1" >}}), we saw how to install Ansible, ping a server and a simple playbook.

In this article we’ll discuss about using groups , use of variables and loops in a playbook.

This setup includes 3 machines. The controller node is a local machine where the managed nodes are two ec2 instances.

## Inventory Groups
Ansible allows you to organize hosts into groups within the inventory file. Grouping hosts enables you to target specific subsets of hosts and apply different configurations or tasks based on their roles or characteristics.

We can create groups as below:

\`\`\`
# cat hostlist
[uat]
35.154.191.210
[prod]
65.0.7.153
\`\`\`
<br></br>

\`\`\`
---
- hosts: uat
  become: true
  tasks:
    - apt:
        name:
        - apache2
        state: present
\`\`\`
<br></br>

\`\`\`
# ansible-playbook groups.yaml
 ____________
< PLAY [uat] >
 ------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
 ________________________
< TASK [Gathering Facts] >
 ------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
ok: [35.154.191.210]
 ____________
< TASK [apt] >
 ------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
changed: [35.154.191.210]
 ____________
< PLAY RECAP >
 ------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
35.154.191.210             : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
\`\`\`

To disable the cowsay prompt, add nocows=1 in ansible.cfg

\`\`\`
cat ansible.cfg
[defaults]
inventory=./hostlist
remote_user=ubuntu
ask_pass=false
nocows=1
[privilege_escalation]
become=true
become_method=sudo
\`\`\`

Now lets change our playbook to include 2nd group and run the playbook.

\`\`\`
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
\`\`\`
<br></br>

**ansible-playbook groups.yaml**
\`\`\`
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
\`\`\`

### Group alll

The “all” indicates all the hosts, we don’t need to specify it explicitly, ansible takes this as default.

\`\`\`
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
\`\`\`
<br></br>

\`\`\`
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
\`\`\`

## Using Variables:

Example: If we want to install any application or perform any tasks on the nodes, we need to mention those application/task names inside playbook at various places. To avoid repetitive writing, we can create variables and call them in our tasks. We can create variables inside playbook or outside as a separate file.

\`\`\`
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
\`\`\`
<br></br>

\`\`\`
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
\`\`\`

We can also create the variables as a separate yaml file and include here.

\`\`\`
cat vars.yaml
pkg: vim
usr: nothing
\`\`\`
<br></br>

\`\`\`
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
\`\`\`
<br></br>

\`\`\`
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
\`\`\`

## Conditionals:

Ansible can use conditionals to execute tasks or plays when certain
conditions are met. For example, a conditional can be used to check
the OS distribution on a managed host before Ansible installs or configures a service.

\`\`\`
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
\`\`\`
<br></br>

\`\`\`
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
\`\`\`

## Loops:

With the \`loop\` keywords, we can execute a task multiple times.

\`\`\`
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
\`\`\`
<br></br>

\`\`\`
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
\`\`\`

## Using loops and variables:

Create usrvar.yml containing all the username and usersplay.yml for the task playbook.

\`\`\`
#vim usrvar.yml
usr:
- usera
- userb
- userc
- userd
\`\`\`

<br></br>

\`\`\`

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
\`\`\`
<br></br>

\`\`\`
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
\`\`\`

This is the End of the article. We’ll see more features in future tutorial. Thanks for reading.

**_Make sure to terminate any vm instances if you have created to avoid incurring charges._**
`,__vite_glob_0_2=`---
date: '2023-06-18T19:26:10+05:30'
draft: false
title: Ansible — Error Handling, Roles and Valult
description: 'Part 3: Learn about Notify Handler, Error handling, Vault and Roles'
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-anirzVIreNx1SOSAJl88w.jpeg
tags:
- ansible
- devops
series:
- Ansible Fundamentals
series_order: 3
categories:
- Asnible
---

In the earlier posts, we saw how to [**_Setup Ansible_**]({{< relref "ansible1" >}}), [**_simple playbooks with groups, variables, conditionals and loop_**]({{< relref "ansible2" >}})

In this article we’ll discuss about using Notify Handler, Roles, Error Handling and Vault in Ansible.

## Notify and Handler

*   Handler is a special task that executes when called by \`notify\`keyword. The \`notify\` keyword is applied to a task and accepts a list of handler names that are notified on a task change.

For example, when we are operating on any webserver, instead of restarting the service every time we can specify the time when its required using notify and handler.

\`\`\`
- name: intsall webserver
  hosts: all
  tasks:
  - name: install package
    apt:
     name: apache2
     state: present
  - name: create file
    copy:
     content: "Apache2 on Ubuntu"
     dest: /var/www/html/index.html
    notify: restart_httpd
  handlers:
  - name: restart_httpd
    service:
     name: apache2
     state: restarted
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s-dwBpWIRtMz47pY4jwXKw.png" alt="handler" width="1000" height="600">}}

## Error Handling using Block, Rescue and Always

Ignoring errors: In ansible we can ignore errors and let the playbook continue execution further.

In the below example, we have motioned some random words as a package to install. But since nothing like that exists, our playbook will stop executing and the 2nd task will not be carried out. To avaod this , we can use ignore_errors: yes in the a specific block which is not related any other tasks.

\`\`\`
#vim igerror.yml
- name: Example
  hosts: all
  tasks:
  - name: install package
    apt:
     name: httasdfasdfpd
     state: present
    ignore_errors: yes
  - name: create file
    copy:
     content: "This is myfile"
     dest: /var/www/html/index.html
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zwml22oqQRMRNb8t47U9lg.png" alt="without ignore_errors" width="1000" height="600" title="Task without ignore_errors">}}
<br></br>
{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bSLB-kuWdvkeYk02-4JZXA.png" alt="with ignore_errors" width="1000" height="600" title="Task with ignore_errors">}}

### Blocks

We create logical groups of tasks using blocks. It also offer ways to handle task errors, similar to exception handling in many programming languages.

\`\`\`
#vim block.yml
- name: Install Apache Server usign Block
  hosts: all
  tasks:
  - name: install webserver if centos
    block:
    - name: install httpd
      yum:
       name: apache2
       state: present
    - name: create file
      copy:
       content: "Hello Block"
       dest: /var/www/html/index.html
    when: ansible_distribution == 'Centos'
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ql424mVS7KfOMaTXmEA7kQ.png" alt="block" width="1000" height="600" title="block">}}

### Handling errors with Block

We can control how Ansible responds to task errors using blocks with \`rescue\` and \`always\` sections.

Rescue blocks specify tasks to run when an earlier task in a block fails. This approach is similar to exception handling in many programming languages. Ansible only runs rescue blocks after a task returns a ‘failed’ state. Bad task definitions and unreachable hosts will not trigger the rescue block.

We can also add an \`always\` section to a block. Tasks in the \`always\` section run no matter what the task status of the previous block is.

\`\`\`
- name: Example of Error Handling
  hosts: all
  tasks:
  - name: install webserver if Ubuntu/Debian
    block:
    - name: install Apache
      apt:
       name: apache2
       state: present
    - name: restart service
      service:
       name: httpd
       state: restarted
    rescue:
    - name: restart webserver
      service:
       name: apache2
       state: restarted
    always:
    - name: create file
      copy:
       content: this is always task
       dest: /var/www/html/index.html
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*q3bn71MiW9dY1YrHzyhXnA.png" alt="resuce_always" width="1000" height="600" title="block">}}

In the above example, we are installing and restartng apache web server. However on the first restart task, the package name is set to be httpd, which is not correct in case of debian based machines.

So to avoid any failures we have \`rescue\`block which contains the correct package name.

Apart from that we have \`always\` section to create the index.html no matter the status of installation and restart tasks.

## Vault:

Ansible Vault encrypts variables and files so you can protect sensitive content such as passwords or keys rather than leaving it visible as plaintext in playbooks or roles. To use Ansible Vault you need one or more passwords to encrypt and decrypt content. Use the passwords with the [ansible-vault](https://docs.ansible.com/ansible/latest/cli/ansible-vault.html#ansible-vault) command-line tool to create and view encrypted variables, create encrypted files, encrypt existing files, or edit, re-key, or decrypt files. You can then place encrypted content under source control and share it more safely.

To create a new encrypted file use the command. Use a password when prompted. the editor opens and you’ll be able to write your playbook.

\`\`\`
ansible-vault create <filename>
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:992/format:webp/1*aaUlsKShZx63aQ4nL6Y2JQ.png" alt="vault" width="1000" height="600" title="vault">}}

Now lets try to see the content of the file with cat.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fQiRXXlnQbfkTsTjxjz2LQ.png" alt="vault_content" width="1000" height="600" title="All the contents are encrypted">}}

To view the content, we can ansible-vault view command. Enter your password when prompted.

{{< figure src="https://miro.medium.com/v2/resize:fit:1242/format:webp/1*AnIgdMtPBpzoFbWeM__TSw.png" alt="vault_pw" width="1000" height="600">}}

Lets encrypt an existing playbook. Use the below commad:

\`\`\`
ansible-vault encrypt <filename>
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1114/format:webp/1*Vd85EzVScTSBDPLFZMdPgg.png" alt="vault_encrypt" width="1000" height="600" title="vault_encrypt">}}

Since this playbook is encrypted, we can’t simple use ansible-playbook for task execution. We need to specify — — ask-vault-pass and provide the pw.

\`\`\`
└──| ansible-playbook handler.yml
ERROR! Attempting to decrypt but no vault secrets found
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AxtECV9nsHLUQwEPU4vF9Q.png" alt="error" width="1000" height="600" title="We need to specify — — ask-vault-pass">}}

## Roles:

Roles let us automatically load related vars, files, tasks, handlers, and other Ansible artifacts based on a known file structure. After you group your content in roles, you can easily reuse them and share them with other users.

Role creates a directory structure with different sub directories for individual task separation.

Directory Structure:

\`\`\`
roles/
    common/               # this hierarchy represents a "role"
        tasks/            #
            main.yml      #  <-- tasks file can include smaller files if warranted
        handlers/         #
            main.yml      #  <-- handlers file
        templates/        #  <-- files for use with the template resource
            ntp.conf.j2   #  <------- templates end in .j2
        files/            #
            bar.txt       #  <-- files for use with the copy resource
            foo.sh        #  <-- script files for use with the script resource
        vars/             #
            main.yml      #  <-- variables associated with this role
        defaults/         #
            main.yml      #  <-- default lower priority variables for this role
        meta/             #
            main.yml      #  <-- role dependencies
        library/          # roles can also include custom modules
        module_utils/     # roles can also include custom module_utils
        lookup_plugins/   # or other types of plugins, like lookup in this case
    webtier/              # same kind of structure as "common" was above, done for the webtier role
    monitoring/           # ""
    fooapp/               # ""
\`\`\`

Lets create a role named “apache”

\`\`\`
ansible-galaxy init apache
\`\`\`

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QYDcZDcdcazloD6U85ZG4g.png" alt="role" width="1000" height="600" title="role named apache">}}

Move inside apache/tasks/ and edit the main.yml with your play.

\`\`\`
---
# tasks file for apache
- name: install package
  apt:
   name: apache2
   state: present
\`\`\`

To run this, we need to crate a playbook at outside our roles directry and call this role.

\`\`\`
# role.yml
- hosts: all
  roles:
  - apache
\`\`\`

Now we can run the playbook role.yml and it will execute the taks we have defined in the apache role we created earlier.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cYTOrRHP0-CVAqUGsv1JWQ.png" alt="role_run" width="1000" height="600" title="Run the role">}}

There are many more features with role such as using jinja2 template, variables, handler and etc.

**_This is the final chapter on ansible series_.** Thanks for reading it.
`,__vite_glob_0_3=`---
date: '2023-03-27T19:26:10+05:30'
draft: false
title: Apache HTTP Server Configurations
description: 'Apache HTTP Server Setup: A Guide to Key Configurations'
cover: https://miro.medium.com/v2/resize:fit:900/format:webp/1*lP93d4wUMT7XNug-XyzuQQ.png
tags:
- apache
- http server
- devops
series:
- Web Servers
series_order: 2
categories:
- Webserver
---


In the previous post, we saw how to install and setup Apache web server. In this article we’ll see how to configure a basic web application, enable SSL/TLS and few more basic configuration in regards to security enhancements.

### Prerequiste:
[Install Apache]({{< relref "apache" >}})


### Introduction:

Same as other Linux applications, the Apache web server configuration files are present inside /etc.

To view all the files or directories inside Apache, navigate to /etc/apache2 (Debian/Ubuntu etc) or /etc/httpd ( Red Hat, Rocky Linux, Alma etc) and ls.

\`\`\`
.rw-r--r-- root root 7.1 KB Mon Jan 23 23:55:54 2023  apache2.conf
drwxr-xr-x root root 4.0 KB Sat Mar 11 22:30:00 2023  conf-available
drwxr-xr-x root root 4.0 KB Fri Feb 10 12:17:51 2023  conf-enabled
.rw-r--r-- root root 1.7 KB Fri Jul 22 01:08:00 2022  envvars
.rw-r--r-- root root  30 KB Fri Jul 22 01:08:00 2022  magic
drwxr-xr-x root root  12 KB Sat Mar 11 22:30:01 2023  mods-available
drwxr-xr-x root root 4.0 KB Thu Feb  9 11:42:26 2023  mods-enabled
.rw-r--r-- root root 320 B  Fri Jul 22 01:08:00 2022  ports.conf
drwxr-xr-x root root 4.0 KB Sat Mar 11 22:30:01 2023  sites-available
drwxr-xr-x root root 4.0 KB Thu Feb  9 11:42:26 2023  sites-enabled
\`\`\`

→ apache2.conf/httpd.conf is the primary configuration file of Apache.

→ conf-available/conf-enabled : contains default configurations file like security.conf.

→ mods-available/mods-enabled : contains different module to extend the functionalities of apache.

→ sites-available/sites-enabled: contains our custom host configuration.

_Note: Any configuration inside the dir *-available will not work until we create a symlink to enable those configurations.
*-available — Contains configuration
*-enabled — Contains configuration which are enabled._

In rhe following section, we’ll see how to use these for our web application.

Hosting our web application:
----------------------------

Create a directory with the project name inside /var/www/ or any location.

\`\`\`bash
cd /var/www
sudo mkdir DemoApp
\`\`\`

Now a create an index page either index.html or index.php under DemoApp and paste your custom html which will be shown on the web page

\`\`\`
cd DemoApp
vim index.html

\`\`\`\`\`\`

\`\`\`html
<html>
  <head>
    <title> Your page title </title>
  </head>
  <body>
    <p> Contatulations! Web Server and Host configuration is successful </p>
  </body>
</html>
\`\`\`

Now that we have our application ready, we need to configure Apache to serve the web page.

### Creating Virtual Host:

Create a new file inside /etc/apache2/sites-available/. The file name should end with .conf extension.

\`\`\`bash
cd /etc/apache2/sites-available/
sudo vim abc.conf
\`\`\`

The contents inside the .conf follows a specific pattern as below.

\`\`\`apache
<VirtualHost *:80>
        ServerName <url> #example.com
        ServerAlias <www.url> # www.example.com
        DocumentRoot /var/www/path_to_the_app/ # this is where it will pickup the index from
        <Directory /var/www/path_to_the_app/>
                Options -Indexes +FollowSymLinks
                AllowOverride All
                Require all granted
        </Directory>
        ErrorLog \${APACHE_LOG_DIR}/error.log
        CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
\`\`\`

Once the above step is complete. We need to enable the configuration by creating a symlink for this .conf inside sites-enabled directory.

Alternatively on Debian/Ubuntu machines we can use Apache specific command to let Apache create the symlink for us. For the Apache to recognise the newly configured site, we need to reload/restart the web serer.

\`\`\`bash
sudo a2ensite abc.conf
sudo systemctl apache2 reload
\`\`\`

Now lets try browsing our application.

\`\`\`
http://localhost
http://ip
http://url.com
\`\`\`

This will display the web page content as we have in our index.html.

_Note: If you have a domain name already use that in the virtual host configuration and you should be able to see the web page when you browse the particular URL._

### Enabling SSL/TLS:

If we want to have SSL/TLS enabled for your application, we’ll need ssl certificates to be included in our virtual host configuration.

The configuration should look like this:

\`\`\`apache
<VirtualHost *:80>
        ServerName <url> #example.com
        ServerAlias <www.url> # www.example.com
        # Redirect permanent "/" "https://url"
        DocumentRoot /var/www/path_to_the_app/ # this is where it will pickup the index from

        <Directory /var/www/path_to_the_app/>
                Options -Indexes +FollowSymLinks
                AllowOverride All
                Require all granted
        </Directory>
        ErrorLog \${APACHE_LOG_DIR}/error.log
        CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
<IfModule mod_ssl.c>
 <VirtualHost *:443>
                ServerName <url> #example.com
                ServerAlias <www.url> # www.example.com
                DocumentRoot /var/www/path_to_the_app/
                SSLEngine on
                SSLCertificateFile /etc/apache2/ssl/cerificate.crt
                SSLCertificateKeyFile /etc/apache2/ssl/certificate.key
         <Directory /var/www/path_to_the_app/>
                Options -Indexes +FollowSymLinks
                AllowOverride All
                Require all granted
         </Directory>
</VirtualHost>
</IffModule>
\`\`\`

Now that we have our configuration ready, we need to enable ssl module in Apache and then reload Apache service to have the new configuration applied. Use the Redirect permanent if you want to transfer all HTTP traffic to HTTPS.

\`\`\`bash
sudo a2enmod ssl
sudo systemctl apache2 reload
\`\`\`

Note I: If you don’t see the expected result check the Apache status and Apache log under /var/log/syslog/apache2.
Note II: When we modify/create any new configuration, we can validate the syntax of the config file using below command.

\`\`\`bash
apachectl configtest
\`\`\`

Voila! our site is finally ready with SSL/TLS.

### Hiding Server Information:

The web server exposes a few details about itself and the host machine. To verify this, try browsing a path on your application which does not exist. You should see a 404 error page along with it the page would display Apache version, the and the host OS.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ioS2vvq61V5B0NzansIJGw.png)

To hide these details, we need to update ServerTokens and ServerSignature in ‘security.conf’ file under “/etc/apache2/conf-available/”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qB4Qgd7x-NGyXzH3ttySQQ.png)

Set ServerTokens to ‘Prod’ and ServerSignature ‘Off’. Reload Apache and check the error page.

![captionless image](https://miro.medium.com/v2/resize:fit:1246/format:webp/1*mkSBqiqfKy8ehRH4Hau9vg.png)

### Disable MIME sniffing and CROSS Origin Requests:

To disable browser to look for content type in your application set The _X-Content-Type-Options_ to ‘nosniff’.
To disable CORS or to allow only same origin request, set the _X-Frame-Options_ to ‘deny’ or ‘sameorigin’.

These can be set per application basis or globally using /etc/apache2/conf-available/security.conf .

We need to enable headers modules and restart apache2 to make these work.

\`\`\`apache
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN

sudo a2enmod headers
sudo systemctl restart apache2

\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fchoaCnueexqCB-3qsaBlg.png)

### Hide your application from Google Search:

If you want to hide your application from appearing in google search, use X-Robots-Tag header. You can set this individually for the application using .htaccess file or use the tag in virtual host configuration. To use this tag globally, add this header in apache.conf or or security.conf.

\`\`\`apache
Header set X-Robots-Tag "noindex, nofollow"
\`\`\`

That’s all for now.
Reference : MDN Docs [1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options), [2](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

[SSL for Everyone: A Guide to configure Let’s Encrypt with Certbot]({{< relref "letsencrypt-ssl" >}})`,__vite_glob_0_4=`---
date: '2023-01-25T19:26:10+05:30'
draft: false
title: How to install Apache HTTP web server on Linux.
description: Learn How to setup Apache HTTP webserver
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*B-C9bRZB0-23FLkyjZqJQg.png
tags:
- apache
- http server
- devops
series:
- Web Servers
series_order: 2
categories:
- Webserver
---


### Introduction:

If you ever worked with web application then you must have came across the term “Apache”. The Apache HTTP server is an open source web server.

In this article we’ll take a look on how to install and configure Apache on various popular Linux distributions (Debian/Ubuntu, RHEL/Rocky Linux/Alma Linux).

### Installation:

The package has different name in different distributions. On Fedora/Red Hat based distribution its called “httpd” and on Debian/Ubuntu based distributions its Apache2.

### On Debian/Ubuntu:

First we need to update the package index to ensure we get the latest applications from the repository. To do so run the command below.

\`\`\`bash
sudo apt update
\`\`\`

Don’t worry, this will just update the index, not the packages.

After the above is completed, we need to run the following command

\`\`\`bash
sudo apt install apache2
\`\`\`

This downloads and installs the Apache HTTP server.

To check the status of Apache, use the below:

\`\`\`bash
systemctl status apache2
\`\`\`

You should see the following output:

\`\`\`bash
user@host:~$ systemctl status apache2
● apache2.service - The Apache HTTP Server
  Loaded: loaded (/lib/systemd/system/apache2.service; enabled; preset: enabled)
  Active: active (running) since Sat 2023-01-12 16:10:16 IST; 7s ago
  Docs: https://httpd.apache.org/docs/2.4/
\`\`\`

In case you don’t see the status as “active (running)”, you need to run the following command:

\`\`\`bash
sudo systemctl start apache2
\`\`\`

In addition you can run the below command to enable the service, which means the Apache server will start automatically when the machine is restarted.

\`\`\`bash
sudo systemctl enable apache2
\`\`\`

Now to test it, open a web browser and type ‘localhost’ or the IP of the server and you should see the default Apache page.

### On Fedora/Red Hat:

As we have discussed before the package name in this family of Linux distributions is called httpd.

Follow the same process as the above steps:

\`\`\`bash
sudo dnf update
sudo dnf install httpd
systemctl status httpd
sudo systemctl start httpd
sudo systemctl enable httpd
\`\`\`

Hurray! Now Apache server is ready to server your web application.

<!-- [Basic configuration in Apache] ({{< relref "apache-config" >}}) -->
<!-- [Read more on Apache →](/blogs/#apache) -->`,__vite_glob_0_5=`---
date: '2024-04-27T19:26:10+05:30'
draft: false
title: How AWS ALB Keeps Your Apps in Line!
description: See how AWS ALB effortlessly manages traffic, and supports high availability to keep your app running smoothly.
cover: https://i.ibb.co/GvPkHTRn/x.jpg
tags:
- aws
- alb
- cloud
- load balanncer
categories:
- AWS
---


## What is Load Balancer

A **load balancer** is a tool that helps distribute incoming internet traffic across multiple servers to ensure that no single server becomes overwhelmed.

AWS provides different types of load balancers that help manage web traffic to your applications. The load balancer ensures that your application can handle more visitors without crashing, and it can also automatically route traffic to healthy servers if some servers are having problems.

There are multiple types of load balancer in AWS:

*   Classic Load Balancer (CLB) — this is the first gen load balancer used of traffic across multiple EC2 instances but it’s obsolete now.
*   Application Load Balancer (ALB) — its best for load balancing of HTTP and HTTPS traffic, provides advanced request routing capabilities. Operates at layer 7 of the OSI model.
*   Network Load Balancer (NLB) — Operates at layer 4, generally used applications with low latency requirements.
*   Gateway Load Balancer (GLB) — It enable us to deploy, scale, and manage virtual appliances, such as firewalls, intrusion detection and prevention systems, and deep packet inspection systems

In this article, we’ll use ALB for our web application with http and https.

## Prerequisites

1.  One or more EC2 with Nginx/Apache httpd with a simple web app
2.  A domain in Route 53 or another provider for mapping to the ALB DNS. (Optional)
3.  TLS certificate, either requested via AWS or imported to ACM, **if using HTTPS with the ALB** (only necessary if you have a domain set up in step 2).

If you would like to know how to get a free TLS certificate, check out the below article.

[The Complete DIY Guide — Let’s Encrypt SSL Setup Using Certbot](letsencrypt-ssl.md)

For importing certs to ACM, just copy the contents of the cert.pem and private.key to the respective fields in ACM and you are good to go.

## Set up:

Alright, so setup your web server on EC2, with either Apache or Nginx and you should have a webpage or even the default webpage will suffice.

In the security group attached to these machines, allow ssh and http. Optionally just use one sg for these machines.

Make a distinguishable change to the webpage so that we can see the load balancing on the browser or just install Apache in one and Nginx in the other.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xyY0eXjK7xQRXfP-TSOTSw.png" alt="instances" width="1000" height="600">}}

### Load Balancer Setup

First create a target group from the EC2 menu. Choose EC2 as the target. Provide a name and keep the port as 80 as our web app is running on http.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*oo24AiDWMcbLQblWaUVLVA.png" alt="target group" width="1000" height="600">}}
<br></br>
{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ei5JLwmJ_Cx5QioB0fkr9g.png" alt="target group protocol" width="1000" height="600">}}

Choose IPv4, choose a vpc. Keep the health check as is, again because our app is running on port 80.

The load balancer just queries this path for determining if the machine is capable of serving traffic.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pp5n2WPD1KzGUebb-i9DiA.png)

On the second step, choose the two instances you have created as targets and keep 80 port as it is then click on Add as pending.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-25O4fIx-gzMTqwlktLavg.png)

Access the Load Balancer menu from the side panel of the EC2, and click on create Load Balancer, select Application Load Balancer from the options.

Choose as internet facing, Select a vpc and select at least 2 subnets. Now select a security group/create one with only HTTP and HTTPS inbound rules.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XFm1QHkDkUg79_Vx3Khk2A.png)

On the Listener and routing, use http (80), select action as forward to target group and select the group created earlier. Similarly add HTTPS as well.

The rule for 80 will be changed later. If you don't have a domain name and not planning to use TLS then skip the HTTPS listener.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*h3F4TppcXp2850hzLz0WkQ.png)

Adding the HTTPS listener, will show another section to include TLS certificates.

I have them imported to ACM, so I just select that. And create the LB. Additionally you can integrate CloudFront or WAF.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HjCdtjsiqlCNmtiAx1Rfyw.png)

The ALB might take a couple of mins to be available. Once its active, copy the DNS name and browse it.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2Uxw1ewHZvLv12PC8Ra9Sg.png)

Great it works. The current load balancing algorithm is round robin (default) so each time traffic is distributed to one at a time.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qocwzsXGfarLau6HmNTFmg.gif)

Alright, now since alb works, lets have tls for it. Create a CNAME/Alias record for the alb dns name.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZbfmzaVgQ0dZsG2BaY2Whw.png)

And there we go, https on the custom domain works as well.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*uvd28wqN6vS6uQ38uv2kVg.gif)

At this point, we have two rules for 80 and 443. Browsing the domain without ssl also works, we want to make the non https traffic to automatically redirect to https.

We need to change the rule 80 on the listeners. To do so, go to the listener and rules tab on ALB, select HTTP:80 and edit rules. Now select the default rule and again click on edit rules.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9-6AGJ_czSPoi8FeN4LuZA.png)

For the action in HTTP rule, instead of pointing to the target group, select redirect to URL and and 443 on the port.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*g30w0IG3f1W4W-zVqqxhpA.png)

You can also do path/query based routing by checking the “custom host, path, query button”.

### Load Balancing algorithms

If you want to change the algorithm, select the target group, and click on change target group attributes from the action menu.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kxvOsos3A1hCvgfrLZkoQQ.png)

Apart of that, we have the option to change:

*   Drain time — for deregistration of targets allowing graceful target termination.
*   Slow start duration — Allows newly registered targets to receive traffic gradually.
*   Stickiness — allows a load balancer to send all requests from a single client to the same target in a target group for the duration of the client’s session.

## Additional fine-tuning

Since we are browsing the web app via Load balancer, we can disable browsing them directly.

To achieve this, we need to change the inbound rules of sg of the ec2 instances. Or create a new security group which allows HTTP and HTTPS traffic only from the sg that's attached to the ALB. So traffic flow from custom domain → ALB DNS→ ALB sg → EC2 sg.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7cZy5YLYiy8Zak0j8oSThA.png)

## Wrap up

That’s the end of this setup. Explore further on mTLS and with other integrations like CDN and WAF.

After you are done, delete all the resources to avoid incurring charges.

**Reference**: [AWS Docs](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)

<!-- **Read More on AWS:**
[Read more on AWS →](/blogs/#cloud) -->`,__vite_glob_0_6=`---
date: '2024-04-27T19:26:10+05:30'
draft: false
title: AWS Lambda - The Serverless Function
description: Schedule auto turn on/off EC2 instances with Lambda Function based on a cron schedule
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bTINZh_GvTsK8OrClazywQ.jpeg
tags:
- aws
- lambda
- cloud
- cost optimaization
- AWS EC2
categories:
- AWS
---


## What is Lambda

AWS Lambda is an Amazon serverless computing service meaning we don’t have to manage any ec2 instances. We can just deploy a piece of code that runs automatically based on certain triggers or events and so it is also known as an event-driven computing service.

Lambda supports various programming/scripting languages like NodeJS, Python, Java and etc.

You can use lambda for various purposes such as monitoring, notifying or removal of stale resources and avoid a lot of unnecessary charges.

In this article, we’ll create functions to have our EC2 instances auto shutdown and start at a particular time. Say we have few instances only for development and testing, since these are not going to be used outside of office working hours, we can turn them off during that period and bring them back during working hours.

### Architecture

This has various components such as below:

*   Two lambda functions. one for starting the machine and another and another to stop it.
*   IAM roles with policy related EC2, Cloud Watch logs and Event Bridge.
*   One or more EC2 instances.
*   Event Bridge schedule or rule.

![captionless image](https://miro.medium.com/v2/resize:fit:1318/format:webp/1*5C23TRZSU-LaigIavmKhlA.png)

## Getting Started

Create an IAM policy with the following content.

\`\`\`
{
 "Version": "2012-10-17",
 "Statement": [  {
   "Effect": "Allow",
   "Action": [    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents"
   ],
   "Resource": "arn:aws:logs:*:*:*"
  },
  {
   "Effect": "Allow",
   "Action": [    "ec2:Start*",
    "ec2:Stop*"
   ],
   "Resource": "*"
  }
 ]
}
\`\`\`

Assign a name, add the above json and save. Or use the visual editor. This actions for EC2 are “startInstnace” and “stopInstance”. The Actions for CloudWatch are CreateLogGroup, CreateLogStream and PutLogEvents.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8HyI2le7eqxZGd7FDHCEoQ.png)

Create a role and assign the above created policy.

From the role creation page, Select AWS, select lambda from from the services list.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JlHiYikKRrhj_95sypghQA.png)

Choose “customer managed” from the filter and select the role created earlier. Assign a name in the next step and save.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*q-mb2OA4Q4tKeegjkqmG5w.png)

Verify the policies attached to the Role

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zUR7tWQjzLeFZhXUjDrh0Q.png)

### Create EC2 Instances

Creates one or more instances and copy their ids.

### Create Lambda Functions

From the Lambda console, select create function. Choose author from scratch. Provide a name for the function (StopEC2). Select Python 3.x from the runtime and save.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OZpxB_bT8NzmDcRcroTNMA.png)

Add the following code snippet the code section and click on deploy.

Remember to change the instance id and location accordingly. In case of multiple instances separate them with commas.

\`\`\`
#StopEC2
import boto3
region = 'ap-south-1'
instances = ['i-0841b5e5fc3d1789a']
ec2 = boto3.client('ec2', region_name=region)
def lambda_handler(event, context):
    ec2.stop_instances(InstanceIds=instances)
    print('stopped your instances: ' + str(instances))
\`\`\`

Expand the permission section, choose existing role and select the role created earlier.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NpdUcl3eh0ZTd8NDcRv4ow.png)

Note: Click on deploy, every time you change the code.

Test is the function works fine. To do so click on the Test tab, and click on the test button again. No need to do any modifications. Either save the event or just run the test, no worries there.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8VJkb6EfUHv5PPr7Lkpq0Q.png)

To verify if the function worked, check your instance status.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4HgI9q8eiQMZoTQZDfuabQ.png)

Nice, so the function works.
Repeat this whole function process for creating another lambda function for starting the instances.

However the method changes for this function. ec2.start_instance().

\`\`\`
#StartEC2
import boto3
region = 'ap-south-1'
instances = ['i-0841b5e5fc3d1789a']
ec2 = boto3.client('ec2', region_name=region)
def lambda_handler(event, context):
    ec2.start_instances(InstanceIds=instances)
    print('started your instances: ' + str(instances))
\`\`\`

Now you should have 2 functions.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qhaZM3uRONMWpbeZD3ZPNg.png)

You can verify that 2 log groups would have been created in cloud watch. You can see the “**started/stopped”** your instance logs in these.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KUeTEqvZwUdrkn6TKwNuzw.png)

Note: In case you get any error while testing, check the permission tab to verify you see the permission of the role.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ck5ohmgaoUOeGk7_J13hZQ.png)

If you get error with timeout, go to general configuration, click on edit and increase the timeout a few more seconds.

Alright, so the functions are set. Now we need some kind of trigger to invoke the functions.

## Event Bridge Schedule

We can create a rules or schedules to do so. We’ll create two event bridge schedule for both functions.

In to event bridge console, click on schedule and click create. Set a name to identify and in schedule patters select recurring pattern.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TEhYirDMDAcgCWOcveVovw.png)

Enter the cron for your preferred time. For now I m setting it to few mins apart just not to wait.

Select Lambda as the target and select the stop function on the next screen,

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zFyg8U4AS6WWjxiTPkBtZQ.png)

In the final tab, select click create new role and save. Check the instance status after the scheduled time.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Az4ZSDM7ASAtQ-7ENh1IOA.png)

Also verify the cloudwatch logs that the particular event was run.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PycaTui2F35ilawbMWEXgA.png)

Note: I was changing times multiple time for multiple the schedule to test multiple times.

Similarly create another schedule for triggering the startec2 function. Set the cron with your preferred time and choose the StartEC2 function as the target.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*5rvYh8llyEQcRYAsaP8NuA.png)

Now verify the instance state and view the logs as well.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i05rVQU10E_-yycrMep9ZA.png)

Very well. This works fine. You should now have 2 lambda functions and and 2 event bridge schedules.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UUQG8KpxByZ6cc7a09kMEw.png)

You can view the lambda metrics such as no of calls, errors etc from the lambda dashboard.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RLrIAgGWtpjZsNW11Azs5A.png)

## Conclusions

Lambda, a server less function runs only when called (just like functions/methods in programming language) manually or by a events through event bridge. We can do many more automation like this. Explore it for more ideas and the changes related to the use of the functions.

**Reference:** [**AWS re:Post**](https://repost.aws/knowledge-center/start-stop-lambda-eventbridge)

<!-- **Read More on AWS:**
[Read more on AWS →](/blogs/#cloud) -->

`,__vite_glob_0_7=`---
date: '2024-09-14T19:26:10+05:30'
draft: false
title: 'AWS Secrets Manager: A Secure Solution for Credential Management'
description: AWS Secrets Manager is a service designed to help us securely store and manage sensitive information such as passwords, API keys etc.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6eDcfbngtrF1eiKzstWkKA.png
tags:
- aws
- secret manager
- cloud
- app security
categories:
- AWS
---

### Introduction:

We generally store creds in diff ways such as using environment vars, storing them in a file and referring the file in the application (DB connection for example). However they are still stored in plaintext which we can easily peek thru. Also incase a bad actor gains access to the OS, can get all the sensitive information.

By using any kind of secret providers, we have better security with encryption, key rotation etc. AWS secrets manager is one such option and integrates well with AWS provided services such as RDS.

Setup:
------

In this example, we are going to use python to retrieve and use the creds programmatically. So make sure to install aws cli and configure your creds.

### Setup on AWS:

→ Ensure to have an IAM user with CLI access, Access keys and add secrets manager specific policies such as “GetSecretValue” and “KMS Decrypt” in case you are using a diff kms key than the default one.

Note: For the resource, instead of using *, you can use the arn of the particular secret to have even granular access.

\`\`\`
{
    "Version": "2012-10-17",
    "Statement": [        {
            "Effect": "Allow",
            "Action": [                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret",
                "secretsmanager:ListSecrets",
                "kms:Decrypt",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        }
    ]
}
\`\`\`

→ Search for secrets manager, store a new secret and you can choose what kind of secret you want to store based on what service you are going to use it for. I’m going to use others.

Add the creds and key:value pair. These keys will be used to retrieve the data.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZgznWTAVs0WBuI5WFsLm-g.png)

For the encryption key, you can leave it as, or use your own kms key if you have one.


On the next page define a name for the secrets, description and proceed to the next page where you can define rotation if you want.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cP9IYgh5k89rOGlsDcUT7A.png)

Then review the settings and save. This also provides you samples in diff languages to retrieve the secrets.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PcSsU2l9Bvq8uoH3aqe0Og.png)

You can view, modify and delete the secrets from the dashboard.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Lf-3YJHx3T9h1nVLhZKvLw.png)

### Python Application:

We have our creds on aws. Now to use this in our python app, we need to have boto3 module. Also I m going to use selenium for automating the login process.

\`\`\`
--> pip install boto3 selenium
--> pip list (verify the modules installed)
\`\`\`

Download web driver for the browser you are using. The web driver for Firefox is gecko. [mozilla/geckodriver](https://github.com/mozilla/geckodriver/releases?source=post_page-----0363beabb20b---------------------------------------)


App code:

\`\`\`python
import boto3
from botocore.exceptions import ClientError
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import json

def get_secret(secret_name, region_name):
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)

    try:
        # Retrieve the secret
        response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        # Handle the error
        raise e
    else:
        # Secrets Manager decrypts the secret value and returns it as a string.
        secret = response['SecretString']
        return secret

def linkedin_login(username, password):
    # Path to your GeckoDriver executable
    driver_path = 'path to geckodriver binary'
    firefox_binary_path = 'C:/Program Files/Mozilla Firefox/firefox.exe'
    firefox_options = Options()
    firefox_options.binary_location = firefox_binary_path
    firefox_options.add_argument("--private")  # Open in private mode

    service = Service(driver_path)
    driver = webdriver.Firefox(service=service, options=firefox_options)
    driver.get("https://www.linkedin.com/login")
    driver.maximize_window()

    time.sleep(3)

    username_field = driver.find_element(By.ID, "username")
    username_field.send_keys(username)
    password_field = driver.find_element(By.ID, "password")
    password_field.send_keys(password)

    # Submit the login form
    password_field.send_keys(Keys.RETURN)

    time.sleep(10)
    driver.close() #or quit()

secret_name = "webapp_creds" #name of the secret, webapp_creds in the pic
region_name = "us-east-1"

secret_json = get_secret(secret_name, region_name)
secret = json.loads(secret_json)

# Extract credentials from the secret
username = secret["email"] #var name, email on the example pic
password = secret["password"] # same for passoword

linkedin_login(username, password)
\`\`\`

Run the python app with “python app_name.py”

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MEe5J4am6RNLIKEcZUc67Q.gif)

The end!! Thanks for reading.

<!-- **Read More on AWS:**
[Read more on AWS →](/blogs/#cloud) -->

`,__vite_glob_0_8=`---
date: '2024-08-20T19:26:10+05:30'
draft: false
title: AWS WAF with Load Balancer - Beginner’s Guide
description: AWS Web Application Firewall is a security service that helps protect web apps from common web exploits and attacks
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JJlzcHjGcywNPhgKk6a6ig.png
tags:
- aws
- waf
- web security
- devops
categories:
- AWS
---


### Setup:

First we need to have the web app ready. You can have multiple instances of your app as we are going to use ALB.

Create your instance and host your web app.

Read more about how to set up your web app:

[Install Apache]({{< relref "apache-setup" >}}) , [Configure Apache]({{< relref "apache-config" >}})

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*n0UbGNgxJ2_-hYr6epuv_g.png)

Now Create a target group pointing to your instance(s), and then create an Application LB pointing the target group.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kTgOPi5OEoby6B8vGpO6dQ.png)

Try browsing the dns name of ALB and we should see our webpage.
Note: You can remove all the rules (80, 443) from ec2 security group and add the LB as the inbound rule to prevent the app being accessible with ip browsing.

Alright then, now we can apply WAF to the load balancer. Choose regional as the other option is from CloudFront.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zUB2D1DPXEuUCe0sznYeEg.png)

Enter a name for the waf, click on “Add aws resources” to select the aws loadbalancer created earlier.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ih4qxRoDXMJaUH42FWE5xA.png)

For adding rules, we can opt for various preset or create our own. In this example I m going to use set of IPs.

Create an Ip set, and add the list of IPS. You will need to add the IPs in CIDR format, eg 1.2.3.4/32. Add multiple if you wish to.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-WLWX96gduR_93sHr8eL9w.png)

Back on the waf creation page, select add my own rules, select your preferred type. I have chosen IP set. Select the IP set created earlier and the action to be taken.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9YNfQEJ6cmo2UyyuGAgu5g.png)

Then proceed and select the action for other conditions and create.
In this example, I have used my own IP, and the action to be blocked, so if I try to access the app, I should get a 403 response.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bt9At0w0hOkNszVYj1P5QA.png)

Lets update the action to have a captcha when the IP matches. Click on rules tab and edit the rules to select captcha.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NqxZ4tYWP65AunXvMKP7sA.png)

Refresh the webpage again, and we shall see captcha page.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lm6JVFQuiw8EJKnarPYjiA.png)

Cool. Now experiment further to find out more on what WAF has to offer. Delete the resources once you are done with the experiment.

<!-- Read more on aws:
[Read more on AWS →](/blogs/#cloud) -->`,__vite_glob_0_9=`---
date: '2026-04-19T10:15:10+05:30'
draft: false
title: Cache Me If You Can - AWS CloudFront in Action 🌏
description: CloudFront is a CDN service that speeds up web content delivery by caching it on servers around the world.
cover: https://i.ibb.co/cSvqh9kd/x.jpg
tags:
- aws
- cloudfront
- cdn
- devops
- cloud
categories:
- AWS
---


## Intro

**AWS CloudFront** is a service that makes websites and apps load faster for users around the world. It stores copies of our application content (like images, videos, and web pages) in different data centers across the globe, called **edge locations**.

When someone visits your site, the data is first fetched from the origin (The actual server) and CloudFront caches the content from the server closest to them, so next time someone again requests the same content, its loaded from the edge locations. This reduces the time it takes for the content to load and improves the overall experience. It also offers security features like **DDoS protection** and **SSL encryption**.

You can set up different services as origin for AWS cloud front, however S3 is a better one as CDN is best for caching static content. In this particular example however I’m using EC2 with ALB as origin.

## Setup

I am using to EC2 instances with ALB managing traffic with round robin except the SSL setup at ALB.

Refer this post:

[ALB Setup]({{< relref "aws-alb" >}})

### Create distribution

We can now create a CloudFront distribution that would have ALB as the origin.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WG0srLlNg5UlqZgc50ecmg.png)

Select the origin protocol. Generally http if your origin is s3 bucket and http/https if elb has https enabled. For now my alb does not have https listeners so I'll stick to http.

> <small>\`Note 1:\` <small>The data is from Dec 2024 so the UI might have changed but concepts remain same. </small></small>

> <small>\`Note 2:\` <small>Having the CachingOptimized policy will use cdn cache for most of times and hence reducing the effect of load balancing here. If you choose the other policy for disabling cache, the ALB works but might hit the origin frequently, so you might have to set custom headers here or in web server.</small></small>

> <small> CDN is best suitable to static content.</small>

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0zK1F0EQhIq22gjyDDhAgA.png)

In the next section, choose if you want to compress objects or to redirect traffic to https if it comes via http and the http methods you want to allow example GET and HEAD are HTTP methods used to retrieve resources.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DEhq_oS9AvSV5aph1sn0bA.png)

Cache key and origin request also leave them default or choose any from list. I have selected CachingOptimized. You can modify if you want, you can change the TTL and other settings or create your own.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RXWDEIhWI5CteqR9jwkA4A.png)

Optionally you can enable waf or turn it off. You can still configure waf later.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6uenZiOEMQolctVTLAh8PA.png)

Choose the geographic region you want to use the edge locations, either all, or specific continents.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MX0YmmU8F7hbcooP_090bA.png)

I have a domain and SSL certificate imported to ACM, so i can choose those, or request the SSL cert from ACM if you don’t have.

Leave the rest to default, you may turn on/off IP v6 and S3 logging based on your requirements. Finally create the distribution.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Da_RXbmfyfewuPWI2b_YRg.png)

It might take some to provision, after which you will be able to browse it with the domain name.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AX0yCmFtYbrsnmW-fCwhzw.png)

Now we need to create a DNS entry for this cdn domain to our custom domain as CNAME.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nIBPRjzUqyOOtOBw8lqk6Q.png)

Wait for the dns to propagate and then we are ready.

### Check CDN in Action

When you first browse it goes to origin (ALB -> EC2) and then cached, so it will be rendered from the cdn cache from the next time.

A fetch from origin will be notified as miss from CloudFront where as when cached it will be hit from CloudFront.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZDqHXYzBzNPI1NQ7KhwpGw.png)

Refresh and this time it should be from cdn cache.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sLI2K4YkE0fPHF2C6XfftQ.png)

If you want to invalidate the cached data, you can do so by using cache invalidation either for all the content or the specific content by providing the path

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BcZHq8Fjm8w2hQc3IHtkpA.png)

Once you remove the cache, it will fetch the data from origin again.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DGc_eKMhKn2xEp5JgX5doA.png)

## Wrap up

Alright, so that's all, you can explore other features such as blocking or allowing to certain regions, integrate waf and etc. Once you are, done disable the distribution first and you should be able to delete it.

<!-- [Read more on AWS →](/blogs/#cloud) -->`,__vite_glob_0_10=`---
date: '2026-04-22T12:30:10+05:30'
draft: false
title: Beyond Objects — Using Amazon S3 Files as a Native File System on EC2
description: Learn how to mount S3 buckets natively on your EC2 instances using the new NFS v4.1+ interface.
cover: https://i.ibb.co/cSqmmDcV/x.jpg
tags:
- aws
- s3
- s3files
- cloud
- devops
categories:
- AWS
---

<!-- {{< figure src=@image alt="AWS_S3Files Architecture" width="1200" height="630" >}} -->

## Introduction

For over a decade, we’ve been known S3 is not a file system. We used hacks like \`s3fs-fuse\` or accepted the limited semantics of **Mountpoint for S3**. That has changed on **April 2026**.

AWS has launched a new S3 feature called **S3 Files**, a native capability that allows us to mount S3 buckets which under hood used AWS EFS (**NFS v4.1+** with full POSIX semantics).

In this tutorial we’ll mount it to EC2, however there are other suppported services.

## Demo

Lets see how to create and use S3 files with EC2 instanced.

### Step 1: Creating Bucket and file system

Create a ‘General Purpose’ S3 bucket and turn on versioning, you can’t create file system if versioning is disabled.

Now click on the file systems tab

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*waJtD90VhnjNP3sIHqSjHw.png" alt="S3 File Systems Tab" width="1000" height="600" title="S3 File Systems Tab" >}}

Change the bucket prefix or vpc if you want or proceed with the creation.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x1BfwDM-RZuB28IDgENdJw.png" alt="S3 Configuration" width="800" height="500" >}}
{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wSbgWbcZNkj97zCQHQHuYQ.png" alt="Creation Progress" width="800" height="500" >}}

It would take a few mins to create the file system and mount targets, mount targets will be created in all the AZs of the particular region where the bucket is created.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*D70AXK92UN7a7CTNWDRiIA.png" alt="Mount Targets available" width="800" height="500" >}}

Once the mount targets are available, we are ready to mount this. Now as you can see we can attach this to not only EC2 but Lambda and ECS tasks as well.

> Note: Check the security group attached to these mount targets as we’ll need to edit it to allow NFS inbound rule. You can either allow 2049 from any source or allow only from the sg of the EC2 instance.

### Step 2: Creating EC2 instance

Create an EC2 instance as usual but we must select a subnet to proceed otherwise S3 files can not be mounted.

Click add shared file system by choosing S3 in files option. You should see mount point and a command for later use. Copy and paste that somewhere.

Additionally you have to attach an IAM role to the instance with specific S3files policy, or attach existing policy of S3FilesClientFullAccess. Check the documentation for more info

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bs2_QXvBouHe9_amrA8vKA.png" alt="EC2 Shared File System Option" width="1000" height="600" >}}
{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZFDne33c-aOUkopnGBXnOA.png" alt="IAM and Policy settings" width="800" height="500" >}}

### Step 3: Mounting S3 file system

SSH to your machine, and run the command copied earlier. Make sure to update the system cache and have curl installed if not already present.

\`\`\`
curl https://amazon-efs-utils.aws.com/efs-utils-installer.sh | sh -s -- --install-launch-wizard \\
--mount-s3files fs-0d8949dde025cba67 /mnt/s3/fs1
\`\`\`

If you see any permission errors, it could be misconfigured IAM role or the inbound port of the security group attached to S3 does not have FNS rule.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-u_pGsMlLu_2QCbU1mQsQQ.png" alt="Terminal Mounting Success" width="800" height="500" >}}

When all the permission are sorted (if any) the mounting will be successful. And you can view and list the mount point.

You can now create file in that particular mount point and the files will be visible in S3 bucket or upload files in S3 bucket and the same will be available inside the instance.

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KA2LKcE3q2c8z6JDGUB4Ig.png" alt="Final File List" width="800" height="500" >}}

## Wrap up
Amazon S3 Files marks a major turning point by providing native NFS v4.1+ support and full POSIX semantics directly on your buckets. For a deeper dive into the technical setup and implementation details, be sure to explore the official documentation and the launch announcement linked below.

Source: [AWS News](https://aws.amazon.com/blogs/aws/launching-s3-files-making-s3-buckets-accessible-as-file-systems/), [AWS Docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html)

<!-- [Check out my other AWS tutorials →](/blogs/#cloud) -->

<!-- <a href="/blogs/#cloud">Read my other posts on AWS →</a> -->`,__vite_glob_0_11=`---
title: "End-to-End DevSecOps on EKS: Code, Containers, Kubernetes & Runtime Security"
description: "Hands-on DevSecOps on EKS with Gitleaks, Semgrep, Trivy, Kyverno, Falco, OWASP ZAP and DefectDojo"
date: "2026-08-15"
cover: "https://i.ibb.co/RGKsN3Gz/devsecops.png"
tags:
  - DevSecOps
  - GitHub Actions
  - Kubernetes
  - EKS
  - Kyverno
  - Trivy
  - OWASP ZAP
  - Gitleaks
  - Semgrep
  - Falco
  - DefectDojo
  - GitOps
  - "Argo CD"
  - EKS
---

## Why this setup?

Security needs to cover more than just the source code. Each tool in this lab has a specific role, from finding issues early to enforcing policies and detecting problems at runtime.

This post builds on the [otel labs]({{< relref "otel-on-eks" >}}) infrastructure and implements security across two repositories:

- ****Application Repo**** (\`otel-labs\`) — application security from source code through container images
- ****Platform Repo**** (\`otel-labs-platform\`) — infrastructure security, Kubernetes policy enforcement, runtime detection, and testing of the deployed application

{{< figure src="https://i.ibb.co/nMdLT5ZQ/proj-arch.png" alt="arch" width="1000" height="600" title="Project Overview" >}}

The separation is intentional. The application repository owns the security of the application and the artifacts it produces, while the platform repository owns the security of the infrastructure and the workloads that are deployed and run. Although **OWASP ZAP is an application-security tool**, we keep its workflow in the platform repository because the scan runs against the deployed application, and this lets us use the \`github-actions[bot]\` commit condition from the GitOps deployment flow to trigger the scan at the right point.

> **Note:** ZAP was originally an OWASP project and is now an independent open-source project supported by Checkmarx. This article still uses **OWASP ZAP** because the name remains widely recognized.


## Table of Contents

1. [*Part I: Application Security*](#part-i)
2. [*Part II: Platform Security*](#part-ii)
3. [*Part III: General Concepts & End-to-End Flow*](#part-iii)
4. [*Deployment & Setup*](#deployment)
5. [*Key Takeaways*](#takeaways)
6. [*Troubleshooting*](#troubleshooting)
7. [*Next Steps*](#next-steps)
8. [*References*](#references)


## Part I: Application Security {#part-i}

The \`otel-labs\` repository contains the application code for the three services:

- Node.js frontend
- Python orders service
- Go inventory service

The application side of the project is about protecting the code and the artifacts it produces before they move into the platform.

We use four layers here:

\`\`\`text
Source repository
      ↓
Gitleaks
      ↓
Semgrep
      ↓
Trivy FS
      ↓
Build container images
      ↓
Trivy Image
      ↓
GHCR
\`\`\`

### 1. Gitleaks: Secret Detection

The first check is for something that can cause an immediate problem if it gets committed: credentials and other secrets. We check both the current repository and Git history because deleting a secret from the latest version does not remove it from an older commit.

We use Gitleaks for both checks.

**File:** \`.github/workflows/gitleaks.yml\`

\`\`\`yaml
name: Gitleaks

on:
  push:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - '.gitignore'
      - 'LICENSE'

permissions:
  contents: read
  security-events: write

jobs:
  gitleaks:
    name: Secret Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Gitleaks (git history)
        uses: gitleaks/gitleaks-action@e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_ENABLE_UPLOAD_ARTIFACT: true
          GITLEAKS_ENABLE_SUMMARY: true

      - name: Run Gitleaks (full filesystem)
        if: always()
        run: |
          docker run --rm -v "$PWD:/path" ghcr.io/gitleaks/gitleaks:latest \\
            dir /path --report-format sarif \\
            --report-path /path/gitleaks-fs.sarif --exit-code 0

      - name: Upload SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v4
        with:
          sarif_file: gitleaks-fs.sarif
          category: gitleaks-fs

      - name: Upload to DefectDojo
        if: always()
        run: |
          curl -X POST \\
            "\${{ secrets.DEFECTDOJO_URL }}/api/v2/reimport-scan/" \\
            -H "Authorization: Token \${{ secrets.DEFECTDOJO_API_KEY }}" \\
            -H "Accept: application/json" \\
            -F "scan_type=SARIF" \\
            -F "file=@gitleaks-fs.sarif" \\
            -F "product_type_name=SP Org" \\
            -F "product_name=Otel Labs" \\
            -F "engagement_name=App Sec Engagement" \\
            -F "test_title=Gitleaks"
\`\`\`

The workflow therefore gives us two views:

- Git history — secrets committed in the past
- Filesystem — secrets present in the repository now

The findings are written as SARIF for GitHub Security and sent to DefectDojo. The filesystem scan uses \`exit-code: 0\`, so it reports findings without blocking the workflow.

### 2. Semgrep: SAST

The next check looks at our own source code. A lot of security problems can be found without running the application at all. This is the idea behind **SAST (Static Application Security Testing)**.

Semgrep analyzes the Node.js, Python, and Go code for insecure patterns. In this project we use its automatic configuration and export the results as SARIF.

**File:** \`.github/workflows/semgrep.yml\`

\`\`\`yaml
name: Semgrep

on:
  push:
    branches: [main]
    paths:
      - 'node-frontend/**'
      - 'python-orders/**'
      - 'go-inventory/**'

permissions:
  ....
  ....

jobs:
  semgrep:
    name: SAST Scan
    runs-on: ubuntu-latest

    container:
      image: semgrep/semgrep

    steps:
      .....
      .....

      - name: Run Semgrep
        continue-on-error: true
        run: |
          semgrep scan --config auto --sarif --output semgrep.sarif .

      - name: Upload SARIF to GitHub Security
        if: always()
        uses: github/codeql-action/upload-sarif@v4
        with:
          sarif_file: semgrep.sarif

      - name: Upload to DefectDojo
        if: always()
        run: |
          curl -X POST \\
            "\${{ secrets.DEFECTDOJO_URL }}/api/v2/reimport-scan/" \\
            -H "Authorization: Token \${{ secrets.DEFECTDOJO_API_KEY }}" \\
            -H "Accept: application/json" \\
            -F "scan_type=SARIF" \\
            -F "file=@semgrep.sarif" \\
            -F "product_type_name=SP Org" \\
            -F "product_name=Otel Labs" \\
            -F "engagement_name=App Sec Engagement" \\
            -F "test_title=Semgrep"
\`\`\`

The scan covers the application source itself. It is different from secret scanning: Gitleaks asks whether sensitive values have been exposed, while Semgrep looks for insecure coding patterns.

### Dependabot: Automated Dependency Updates

While Trivy **detects** vulnerable dependencies, **Dependabot** **automatically creates pull requests** to update them.

Dependabot is GitHub's native SCA tool that monitors your dependency files and creates PRs when updates are available.

**File:** \`.github/dependabot.yml\`

\`\`\`yaml
version: 2

updates:
  # Node.js/npm dependencies
  - package-ecosystem: npm
    directory: /node-frontend
    schedule:
      interval: weekly
    open-pull-requests-limit: 10

  # Python dependencies
  - package-ecosystem: pip
    directory: /python-orders
    schedule:
      interval: weekly
    open-pull-requests-limit: 10

  # Go dependencies
  - package-ecosystem: gomod
    directory: /go-inventory
    ....
    ....

  # GitHub Actions
  - package-ecosystem: github-actions
    directory: /
    ....
    ....
\`\`\`

**How it works:**

Dependabot scans \`package.json\`, \`requirements.txt\`, \`go.mod\`, and GitHub Actions workflows. When a newer version is available, it automatically creates a pull request.

Each PR triggers your existing security scanning workflows (Gitleaks, Semgrep, Trivy), so the updated dependencies are validated before merging.

**Enable in your repository:** - Settings → Code security and analysis → Dependabot alerts

Toggle on:
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Dependabot version updates

{{< figure src="https://i.ibb.co/fKysR31/sca-pr.png" alt="GH SCA" width="1000" height="600" title="PR by Dependabot SCA" >}}

**What Trivy does in this lab for SCA:**

While Dependabot handles **automatic updates**, **Trivy FS** provides **active vulnerability scanning**:

- Trivy scans every commit for known CVEs in dependencies
- Reports HIGH/CRITICAL vulnerabilities immediately
- Does not automatically create PRs (just reports findings)
- Complements Dependabot by catching vulnerabilities before they're fixed

The two can work together:

\`\`\`text
Trivy FS
↓
Detects vulnerable dependencies
↓
Reports to GitHub Security + DefectDojo
↓
Dependabot
↓
Creates update PRs
↓
Merge and re-scan with Trivy
\`\`\`

This gives you **both visibility and automation** for dependency management.

### 3. Trivy FS: Dependency / SCA Scanning

Our application also depends on packages we did not write ourselves. A vulnerability in an npm package, Python dependency, or Go module can therefore become a vulnerability in our application.

This is the area covered by **SCA (Software Composition Analysis)** or dependency scanning.

We use Trivy's filesystem scan to check the repository before the application is turned into its final container image.

**Included in:** \`.github/workflows/build-scan-push.yml\` — runs before the image build step so vulnerabilities in dependencies are caught before the final artifact is produced.

For this project, the relevant inputs include:

- \`package.json\` for the Node.js application
- \`requirements.txt\` for Python
- \`go.mod\` for Go
- Dockerfile-related configuration

This gives us an early dependency/configuration check before we deal with the final container artifact.

### 4. Trivy Image: Container Scanning

The repository scan is not the same as scanning the image that will actually run. Once the containers are built, the final artifact contains the application plus its base image, OS packages, and installed application packages.

So we scan the images themselves with **Trivy Image**.

**File:** \`.github/workflows/build-scan-push.yml\`

\`\`\`yaml
name: Build, Scan and Push Images

on:
  push:
    ....
    ....

jobs:
  build-scan-push:
    runs-on: ubuntu-latest
    env:
      GHCR_OWNER: \${{ github.repository_owner }}
      TRIVY_CONFIG: .trivy/config.yaml

    steps:
      -....
       ....

      - name: Scan node-frontend image
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          image-ref: ghcr.io/\${{ env.GHCR_OWNER }}/node-frontend:latest
          format: sarif
          output: trivy-node-frontend.sarif
          trivy-config: \${{ env.TRIVY_CONFIG }}
          exit-code: 0

      # ... repeat for python-orders, go-inventory, otel-collector

      - name: Upload node-frontend SARIF
        uses: github/codeql-action/upload-sarif@v4
        with:
          sarif_file: trivy-node-frontend.sarif
          category: trivy-node-frontend-image
          delete-old-findings: true

      - name: Upload node-frontend to DefectDojo
        if: always()
        run: |
          curl -X POST \\
            "\${{ secrets.DEFECTDOJO_URL }}/api/v2/reimport-scan/" \\
            -H "Authorization: Token \${{ secrets.DEFECTDOJO_API_KEY }}" \\
            -H "Accept: application/json" \\
            -F "scan_type=SARIF" \\
            -F "file=@trivy-node-frontend.sarif" \\
            -F "product_type_name=SP Org" \\
            -F "product_name=Otel Labs" \\
            -F "engagement_name=App Sec Engagement" \\
            -F "test_title=Trivy Node Frontend Image"

      - name: Push latest images
        run: docker compose push

      - name: Create GitOps commit
        run: |
          # Update platform repo with new image tags
          # This triggers platform repo security scans
\`\`\`

Our Trivy configuration focuses the SARIF output on HIGH and CRITICAL findings:

**File:** \`.trivy/config.yml\`

\`\`\`yaml
severity:
  - HIGH
  - CRITICAL

scanners:
  - vuln
  - misconfig

format: sarif

vulnerability:
  ignore-unfixed: true

limit-severities-for-sarif: true
\`\`\`

The images covered by the workflow are:

- \`node-frontend\`
- \`python-orders\`
- \`go-inventory\`
- \`otel-collector\`

The results go to GitHub Security and DefectDojo, and the images are pushed to GHCR as part of the workflow.

At this point the application repository has completed its security checks and produces the container images consumed by the platform repository.

{{< figure src="https://i.ibb.co/8Dz9w6hX/wf-in-src-repo.png" alt="workflow in app repo" width="1000" height="600" title="workflows in app repo" >}}


## Part II: Platform Security {#part-ii}

The platform repository is where the application moves into its Kubernetes environment. It contains the Terraform infrastructure, Kubernetes manifests, security policies, Falco configuration, and the workflow used to test the deployed application.

The platform-side flow is:

\`\`\`text
otel-labs-platform
        ↓
Gitleaks
        ↓
Trivy Config
        ↓
ArgoCD / Kubernetes
        ↓
Kyverno
        ↓
Falco
        ↓
OWASP ZAP
\`\`\`

### 1. Gitleaks: Platform Repository

The same secret problem exists in the platform repository. Terraform files, Kubernetes manifests and GitOps configuration can contain sensitive values too, so the platform repo needs its own secret scan.

The implementation is the same idea as the application repository: scan the repository and its history, produce SARIF, and send the result to the security systems.

### 2. Trivy Config: Terraform and Kubernetes

Once the application reaches the platform repository, we are looking at a different class of problems.

Here the question is not whether a package has a CVE. It is whether the infrastructure or Kubernetes configuration is unsafe.

For example:

- an unencrypted EBS volume
- an overly open security group
- a container running with unsafe settings
- missing resource limits

This is where **Trivy Config** is useful.

**File:** \`.github/workflows/trivy.yml\`

\`\`\`yaml
name: Trivy Config Scan

on:
  push:
    branches: [main]

permissions:
  contents: read
  security-events: write

jobs:
  trivy-k8s:
    ....

    steps:
      - ...

      - name: Scan Kubernetes manifests
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          scan-type: config
          scan-ref: ./k8s
          trivy-config: .trivy/config.yaml
          format: sarif
          output: trivy-k8s.sarif
          severity: HIGH,CRITICAL
          exit-code: 0

      - name: Upload Kubernetes SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v4
        with:
          sarif_file: trivy-k8s.sarif
          category: trivy-k8s

      - name: Upload to DefectDojo
        if: always()
        run: |
          curl -X POST \\
            "\${{ secrets.DEFECTDOJO_URL }}/api/v2/reimport-scan/" \\
            ....
            ....

  trivy-terraform:
    runs-on: ubuntu-latest

    steps:
      - ....

      - name: Scan Terraform
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          scan-type: config
          scan-ref: ./terraform
          trivy-config: .trivy/config.yaml
          format: sarif
          output: trivy-terraform.sarif
          severity: HIGH,CRITICAL
          exit-code: 0

      - name: Upload Terraform SARIF to GitHub Security
        ....
        ....

      - name: Upload to DefectDojo
        if: always()
        run: |
          curl -X POST \\
            ....
            ....
\`\`\`

We therefore run two configuration scans:

\`\`\`text
Terraform
   ↓
Trivy Config
   ↓
Infrastructure findings

Kubernetes
   ↓
Trivy Config
   ↓
Workload/configuration findings
\`\`\`

The scan can find configuration problems such as:

\`\`\`text
HIGH: EBS Volume Not Encrypted
HIGH: Pod Running as Root
MEDIUM: Missing Resource Limits
\`\`\`

The important point is that this is a **configuration check**, not the same thing as scanning an application dependency or container image.

{{< figure src="https://i.ibb.co/WWVqjNqP/wf-in-platform-repo.png" alt="workflow in platform repo" width="1000" height="600" title="workflows in platform repo" >}}

# The Platforms

Before looking at the remaining platform controls, it helps to understand the three ideas behind them: **admission control, runtime detection, and centralized findings management**.

## Runtime Security: Falco

Admission control is useful for controlling what enters the cluster, but it doesn't tell us what a workload actually does after it starts.

That is where runtime security comes in.

**Falco** watches activity on the running system and evaluates it against security rules.

The basic idea is:

\`\`\`text
Running workload
      ↓
Kernel activity
      ↓
Syscalls
      ↓
Falco
      ↓
Rules
      ↓
Security event
\`\`\`

### Syscalls

A process does not directly perform most privileged operations on the Linux system. It requests them through **system calls (syscalls)** exposed by the kernel.

Opening a file, creating a process, changing permissions, creating a network connection and many other operations eventually involve syscalls. That makes syscall activity useful for runtime security because it gives us a view of what processes are actually doing on the host.

For example, a command such as \`cat /etc/shadow\` results in file-access activity that Falco can observe and evaluate against its rules.

### eBPF

**eBPF (extended Berkeley Packet Filter)** is a Linux technology that allows programs to run small pieces of code safely inside the kernel without modifying the kernel itself.

For security tools such as **Falco**, eBPF can be used to observe activity happening at the kernel level, including system calls and other events generated by processes.

In simple terms:

\`\`\`text
Application / Container
        ↓
   System activity
        ↓
      Linux Kernel
        ↓
       eBPF
        ↓
       Falco
        ↓
      Falco Rules
        ↓
   Security Event
\`\`\`

The important connection is that **eBPF is one way Falco can collect the low-level runtime events it needs for detection**. Falco then evaluates those events against its rules and generates an alert when activity matches a rule.

### Falco rules

Falco turns those runtime events into security detections using rules.

We worked through:

- built-in rules
- Kubernetes-specific rules
- custom rules
- rule matching
- runtime process activity such as \`kubectl exec\`

For example, \`kubectl exec\` can result in a process being started inside a running container. That gives us a concrete runtime event to investigate with Falco.

We also used **FalcoSidekick** as the output/forwarding component for Falco events.

### Try it manually

Falco can be tested in both the local environment and the Kubernetes environment.

For the Kubernetes deployment, use the Node frontend or any app pod as the test workload.

First, identify the Node frontend pod and the Kubernetes node it is running on:

\`\`\`bash
kctl get pods -n otel-labs -o wide
\`\`\`

The Node frontend was running on:

\`\`\`text
node-frontend-7589db9c99-nv2v7   1/1   Running   ...   ip-10-0-1-116.ap-south-1.compute.internal
\`\`\`

Now identify the Falco pod running on the same node:

\`\`\`bash
kctl get pods -n falco -o wide
\`\`\`

The matching Falco pod was:

\`\`\`text
falco-z6vwk   2/2   Running   ...   ip-10-0-1-116.ap-south-1.compute.internal
\`\`\`

Both pods are therefore running on:

\`\`\`text
ip-10-0-1-116.ap-south-1.compute.internal
\`\`\`

This is important because Falco's syscall monitoring is node-local. The Falco instance running on the same node as the workload is the one that can observe its process activity.

Keep two terminals open.

In **Terminal 1**, watch the matching Falco pod:

\`\`\`bash
kctl logs -f -n falco falco-z6vwk -c falco
\`\`\`

In **Terminal 2**, execute \`whoami\` inside the Node frontend container:

\`\`\`bash
kctl exec -n otel-labs node-frontend-7589db9c99-nv2v7 -- whoami
\`\`\`

The command executes successfully, and Falco detects the process execution with the custom rule:

\`\`\`text
CUSTOM ALERT: whoami executed in container
\`\`\`

{{< figure src="https://i.ibb.co/7Jp7hFWk/falco-whoami.png" alt="falco alert" width="1000" height="600" title="custom alert triggered on match" >}}

The alert includes details such as the process, command, container name, image, namespace, and pod name.

This demonstrates Falco detecting process execution inside a real Kubernetes application container.

> **Note:** \`kubectl exec\` works even when the container uses a read-only root filesystem. \`readOnlyRootFilesystem: true\` prevents filesystem writes; it does not prevent executing processes.

#### Local — Falco and Falcosidekick

The local setup provides a second demonstration using Falco and Falcosidekick.

Then try accessing a sensitive file:

\`\`\`bash
sudo cat /etc/shadow
\`\`\`

Falco's **built-in rule** for sensitive file access should detect the attempt and generate an event.

You can also create custom rules and have them run for example using whoami or ls etc for understanding it before implementing in k8s.

\`\`\`yml
~$ cat /etc/falco/falco_rules.local.yaml
# Your custom rules!
- rule: Falco Lab Whoami
  desc: Detect whoami execution
  condition: spawned_process and proc.name = whoami
  output: "FALCO LAB: whoami executed | user=%user.name command=%proc.cmdline"
  priority: EMERGENCY
  tags: [falco_lab, identity]

- rule: Falco Lab LS
  desc: Detect ls execution
  condition: spawned_process and proc.name = ls
  output: "FALCO LAB: ls executed | user=%user.name command=%proc.cmdline"
  priority: ALERT
  tags: [falco_lab, filesystem]

- rule: Falco Lab ID
  desc: Detect id execution
  condition: spawned_process and proc.name = id
  output: "FALCO LAB: id executed | user=%user.name command=%proc.cmdline"
  priority: ERROR
  tags: [falco_lab, identity]

- rule: Falco Lab Uname
  desc: Detect uname execution
  condition: spawned_process and proc.name = uname
  output: "FALCO LAB: uname executed | user=%user.name command=%proc.cmdline"
  priority: WARNING
  tags: [falco_lab, system]
\`\`\`

The resulting events can be viewed through the **Falcosidekick UI**.

{{< figure src="https://i.ibb.co/sdfLJc3s/sidekickui.png" alt="falco sidekick" width="1000" height="600" title="falco sidekick ui view" >}}

There is an important catch in the Kubernetes setup, though: **the OTel Labs deployments run with security restrictions such as non-root execution and read-only filesystems.** Therefore, attempting to access \`/etc/shadow\` from those containers may fail because the process does not have permission to read the file in the first place.

That is actually a useful point. Runtime security is one layer, but we can also prevent this kind of activity from being possible in the first place.

That brings us to Kubernetes admission control.

## Kubernetes Admission Control: Kyverno

Falco watches what happens after a workload is running. But what if we could stop an insecure workload from entering the cluster in the first place?

That is where **Kubernetes admission control** comes in.

When the Kubernetes API server receives a request to create or modify a resource, admission controllers can inspect that request before Kubernetes accepts it.

\`\`\`text
kubectl apply
      ↓
Kubernetes API Server
      ↓
Admission
      ↓
Admission Controller
      ↓
Allow / Reject / Modify
\`\`\`

**Kyverno** is a Kubernetes-native policy engine that can be used to validate, mutate, generate, and verify resources as part of this process.

### What can Kyverno do?

Kyverno policies can be used for several different jobs:

- **Validate** — check whether a resource follows a rule
- **Mutate** — modify a resource to bring it into the desired state
- **Generate** — create additional Kubernetes resources based on a policy
- **Verify images** — verify image signatures and attestations

For validation policies, Kyverno can either report a violation or prevent the resource from being admitted.

### Audit vs Enforce

For a validation rule, Kyverno provides two failure actions:

\`\`\`text
Audit
  ↓
Violation is reported
  ↓
Resource is still allowed

Enforce
  ↓
Violation is detected
  ↓
Resource is rejected
\`\`\`

The policy can therefore start in \`Audit\` mode while we understand its impact and later move to \`Enforce\` when we are ready to make the rule mandatory.

The current syntax is:

\`\`\`yaml
spec:
  background: true
  validationFailureAction: Enforce
\`\`\`

### Policy as code

The important part is that these security requirements can be written as Kubernetes policies instead of being maintained as documentation that developers are expected to follow manually.

The policies can live in Git and be managed through the same GitOps process as the rest of the platform:

\`\`\`text
Git
 ↓
Kyverno Policy
 ↓
ArgoCD
 ↓
Kubernetes
 ↓
Kyverno
 ↓
Admission decision
\`\`\`

This also means policy changes can go through version control, review, and the same deployment process as other platform changes.

### Policy exceptions

Enforcing a policy across an entire cluster can sometimes affect workloads that have a legitimate reason to be different.

Instead of weakening the policy globally, Kyverno supports **PolicyExceptions** that can be scoped to specific resources and specific policy rules.

For example:

\`\`\`text
General policy
     ↓
Applies to workloads
     ↓
Specific legitimate exception
     ↓
PolicyException
     ↓
Only that resource/rule is excluded
\`\`\`

The idea is to keep the main policy strong while making exceptions explicit and limited.

### What we will enforce in this lab

Now that the admission-control concepts are clear, we can apply them to our EKS environment.

In this lab, we will use Kyverno to enforce rules such as:

- images must have explicit tags
- \`:latest\` is not allowed
- CPU and memory requests are required
- CPU and memory limits are required
- images must come from trusted registries

{{< figure src="https://i.ibb.co/Vc0WCfHV/kyverno.png" alt="kyverno policies" width="1000" height="600" title="kyverno policies" >}}

We will use **\`Enforce\`** for these validation policies, so workloads that violate the rules are rejected during admission.

We will also use a scoped **PolicyException** where a legitimate platform component, such as Traefik, needs an exception from one of the general policies.

### Policy exceptions

Strict policies can also affect legitimate platform components.

For example, our Traefik deployment does not satisfy every generic policy requirement, so instead of turning the policy off globally, we use a scoped \`PolicyException\`.

That is an important Kubernetes policy concept:

> Make the exception explicit and narrow rather than weakening the policy for everything.

### Try it manually

Now we can see admission control in action.

Try creating a pod using the \`latest\` tag:

\`\`\`bash
kubectl run test-pod \\
  --image nginx:latest \\
  -n otel-labs
\`\`\`

With our policy enabled, the request is rejected because \`:latest\` is not allowed.

A compliant workload with an explicitly tagged image and the required resources can be admitted.

There's also a test workload under archive/falco-trigger.yml. You can use it to test the policies because its image comes from the trusted registry already allowed by our policy.

First apply the workload by commenting anything that violates policy like requests and limits or namespace. You would see that it would fail with violations shows, if you uncomment them and try again, it is compliant and would work just fine.

{{< figure src="https://i.ibb.co/cdWmPP3/kyverno-test.png" alt="kyverno policie test" width="1000" height="600" title="kyverno compliance" >}}

This gives us two different security layers:

\`\`\`text
Kyverno
   ↓
Controls what is allowed into the cluster
   ↓
Running workload
   ↓
Falco
   ↓
Watches what happens at runtime
\`\`\`

Kyverno and Falco therefore solve different problems:

- **Kyverno** prevents or restricts workloads at admission time.
- **Falco** detects suspicious activity while workloads are running.

## Centralized Findings: DefectDojo

The scanners all answer different security questions, and each one produces its own results.

If we leave them separate, we have to check Gitleaks, Semgrep, Trivy and ZAP individually to understand what is happening across the project.

{{< figure src="https://i.ibb.co/BVkjKCHj/dd-dash.png" alt="defectdojo" width="1000" height="600" title="DD dashboard" >}}

**DefectDojo** gives us one place to collect and manage those findings.

It is not another scanner. The scanners do the actual detection; DefectDojo receives, organizes and tracks their results.

### How DefectDojo setup is organized

In the DefectDojo UI, the hierarchy is:

**Organization → Asset → Engagement → Test → Findings**

For this project:

- **Organization:** \`SP Org\`
- **Asset:** \`Otel Labs\`
- **Engagements:**
  - \`App Sec Engagement\`
  - \`Platform Sec Engagement\`
- **Tests:** individual scanner results within each Engagement
- **Findings:** security issues reported by those Tests

For example, the application-security side contains Tests for Gitleaks, Semgrep, Trivy and OWASP ZAP, while the platform-security side contains Tests for Gitleaks, Trivy Kubernetes and Trivy Terraform.

Each **Test** represents a particular security scan within an Engagement, and the findings produced by that scan are associated with that Test.

### UI vs API

When we work in the DefectDojo UI, we use the hierarchy above.

When we automate the same process from GitHub Actions, the API uses different field names:

\`\`\`text
product_type_name = SP Org
product_name      = Otel Labs
engagement_name   = App Sec Engagement
test_title        = Gitleaks
scan_type         = SARIF
file              = scanner-result.sarif
\`\`\`

The API terminology does not map one-to-one to the labels we see in the current UI, so it is useful to keep the two views separate.

### Reimporting scan results

Our workflows use the \`reimport-scan\` API so that new results from the same scanner can be imported back into the corresponding DefectDojo Test.

This keeps the scanner results associated with the same Test over time instead of creating an unrelated Test for every workflow run.

Before automating this, you can understand the structure directly in the UI by going through:

**SP Org → Otel Labs → App Sec Engagement → Test → Findings**

The platform scans follow the same structure under **Platform Sec Engagement**.

{{< figure src="https://i.ibb.co/bMDrWzyL/dd-tests.png" alt="tests" width="1000" height="600" title="one tool as a test" >}}
{{< figure src="https://i.ibb.co/S70ZwysV/finding-details.png" alt="finding" width="1000" height="600" title="individual findings" >}}

### Automating DefectDojo from GitHub Actions

Once the DefectDojo structure makes sense, the GitHub Actions workflow can automate the import.

For example, our ZAP workflow sends its report to the DefectDojo \`reimport-scan\` API:

\`\`\`bash
curl -X POST \\
  "\${{ secrets.DEFECTDOJO_URL }}/api/v2/reimport-scan/" \\
  -H "Authorization: Token \${{ secrets.DEFECTDOJO_API_KEY }}" \\
  -H "Accept: application/json" \\
  -F "scan_type=ZAP Scan" \\
  -F "file=@report_xml.xml" \\
  -F "auto_create_context=true" \\
  -F "product_type_name=$DD_PRODUCT_TYPE" \\
  -F "product_name=$DD_PRODUCT" \\
  -F "engagement_name=$DD_ENGAGEMENT" \\
  -F "test_title=OWASP ZAP DAST" \\
  -F "close_old_findings=true" \\
  -F "do_not_reactivate=false" \\
  -F "environment=$DD_ENVIRONMENT" \\
  -F "build_id=$DD_BUILD_ID" \\
  -F "branch_tag=$DD_BRANCH" \\
  -F "commit_hash=$DD_COMMIT" \\
  -F "tags=github-actions,zap,dast,$DD_BRANCH"
\`\`\`

The request handles several things in one call: it authenticates via the API token secret, identifies where to store the result using \`product_type_name\`, \`product_name\`, \`engagement_name\`, and \`test_title\`, uploads the actual ZAP XML report, passes build metadata (environment, branch, commit, build ID) for traceability, tags the import for easy filtering, and uses \`auto_create_context=true\` so DefectDojo creates the required hierarchy automatically on first run.

{{< figure src="https://i.ibb.co/Jw6B4cSD/engmnts-auto-created-by-api.png" alt="engagements" width="1000" height="600" title="auto created engagements" >}}
{{< figure src="https://i.ibb.co/twWN6cyT/dast-findings.png" alt="zap finding" width="1000" height="600" title="one of the zap finding" >}}

### Closing and reactivating findings

The reimport also controls what happens to findings from earlier scans.

\`\`\`text
-F "close_old_findings=true"
-F "do_not_reactivate=false"
\`\`\`

\`close_old_findings=true\` tells DefectDojo to close old findings that are no longer present in the newly imported scan.

\`do_not_reactivate=false\` allows a previously closed finding to become active again if a later scan reports it.

> **Note:** We currently use \`close_old_findings=true\` with DefectDojo reimport. This can be too aggressive in our setup, causing many previous findings to be closed when they are not present in the latest scan result, even though their absence does not necessarily mean they have been fixed. This is a known issue we are still investigating and tuning. [{{< icon name="github" size="lg" >}} DefectDojo issue #14205](https://github.com/DefectDojo/django-DefectDojo/issues/14205).

## GitHub Security and Workflow Artifacts

DefectDojo is not the only place where we keep the scanner results.

For scanners that produce SARIF output, we also upload the results to the **GitHub Security** tab.

This gives us two different views:

\`\`\`text
Scanner
   ↓
SARIF
   ├──→ GitHub Security
   │
   └──→ DefectDojo
\`\`\`

GitHub Security is useful for seeing security findings directly alongside the repository and its pull requests, while DefectDojo gives us the centralized view across the different scanners and engagements.

### Uploading SARIF to GitHub Security

For example, after Gitleaks, Semgrep or Trivy produces a SARIF file, we use GitHub's SARIF upload action:

\`\`\`yaml
- name: Upload SARIF to GitHub Security
  uses: github/codeql-action/upload-sarif@v4
  with:
    sarif_file: semgrep.sarif
\`\`\`

The important part is that the scanner produces the SARIF file first.

GitHub then consumes that file and displays the findings under the repository's security features.

We also use categories for scanners where multiple SARIF results are uploaded:

\`\`\`yaml
- name: Upload Trivy SARIF
  uses: github/codeql-action/upload-sarif@v4
  with:
    sarif_file: trivy-node-frontend.sarif
    category: trivy-node-frontend-image
\`\`\`

The category helps distinguish results from different scans.

{{< figure src="https://i.ibb.co/LhzYf9xm/gh-scan-reports.png" alt="gh code scanning" width="1000" height="600" title="Reports via the tools we use" >}}

### Workflow artifacts

SARIF is useful for GitHub Security, but sometimes we also want to keep the actual report produced by a workflow.

For example, ZAP produces an XML report that we send to DefectDojo. We can also upload that report as a GitHub Actions artifact.

The basic pattern is:

\`\`\`yaml
- name: Upload ZAP report
  uses: actions/upload-artifact@v4
  with:
    name: zap-dast-report
    path: report_xml.xml
\`\`\`

This gives us three different places for the same security workflow:

\`\`\`text
Scanner
   ↓
Scan report
   ├──→ GitHub Security
   │       SARIF
   │
   ├──→ GitHub Actions Artifact
   │       Raw report
   │
   └──→ DefectDojo
           Findings
\`\`\`

Each serves a different purpose:

- **GitHub Security** — view security findings alongside the repository
- **GitHub Actions artifact** — retain the raw scan report from that workflow run
- **DefectDojo** — centrally organize and track findings across scanners and engagements

This gives the project both repository-level visibility and a centralized security view without making DefectDojo responsible for generating the findings itself.

# Platform Implementation Continued

Kyverno is installed during cluster bootstrap.

**File:** \`terraform/bootstrap.sh\`

\`\`\`bash
helm upgrade --install kyverno \\
  kyverno/kyverno \\
  --namespace kyverno \\
  --create-namespace \\
  --timeout 8m \\
  --set features.policyExceptions.enabled=true \\
  --set features.policyExceptions.namespace=argocd
\`\`\`

The last two options enable Kyverno \`PolicyException\` support and tell Kyverno which namespace to use for those exception resources.

\`\`\`bash
--set features.policyExceptions.enabled=true
--set features.policyExceptions.namespace=argocd
\`\`\`

The \`argocd\` namespace here is **our choice**. Kyverno does not require PolicyExceptions to be stored there. We chose \`argocd\` because the policies and their exceptions are managed through our GitOps setup. The important part is that the namespace configured here must match the namespace where you create the \`PolicyException\` resources.

In this lab, the policies and policyexceptions are stored under:

\`\`\`text
k8s/kyverno/policies/
\`\`\`

We have several policies in the repository, but rather than showing every one here, let's look at one example and then one exception. The rest are available in the repository.

### Image tag security

One of our policies makes sure container images use an explicit tag and prevents the use of \`:latest\`:

\`\`\`yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: image-tag-security

spec:
  validationFailureAction: Enforce

  rules:
    - name: require-image-tag
      match:
        any:
          - resources:
              kinds: [Pod]
      validate:
        message: "Container images must use an explicit image tag."
        pattern:
          spec:
            containers:
              - image: "*:*"

    - name: disallow-latest-tag
      match:
        any:
          - resources:
              kinds: [Pod]
      validate:
        message: "The latest image tag is not allowed."
        pattern:
          spec:
            containers:
              - image: "!*:latest"
\`\`\`

This is a \`ClusterPolicy\`, so it can apply across the cluster.

The two rules handle related but separate checks:

- \`require-image-tag\` makes sure an image has an explicit tag.
- \`disallow-latest-tag\` specifically rejects the \`:latest\` tag.

Because the policy uses \`Enforce\`, a Pod that violates either rule is rejected during admission.

We also have policies for resource requests and limits and for restricting images to trusted registries. You can see the complete set of policies used in this lab in the repository.

### Policy exception

Policies are intentionally strict, but sometimes a platform component has a legitimate reason not to satisfy a general rule.

In our case, Traefik needs exceptions for some of the policies:

\`\`\`yaml
apiVersion: kyverno.io/v2
kind: PolicyException

metadata:
  name: traefik-resource-exception
  namespace: argocd

spec:
  exceptions:
    - policyName: resource-security
      ruleNames:
        - require-resource-requests
        - require-resource-limits

    - policyName: trusted-image-registries
      ruleNames:
        - validate-image-registry

  match:
    any:
      - resources:
          kinds: [Deployment, Pod]
          namespaces: [traefik]
          names: [traefik, traefik-*]
\`\`\`

This exception is deliberately narrow. It does not disable the policies globally — the specified rules are excluded only for the matching Traefik Deployment and Pods in the \`traefik\` namespace.

Notice that the \`PolicyException\` itself is stored in the \`argocd\` namespace (where Kyverno looks for exceptions), while the workload being excepted is in the \`traefik\` namespace. These are two different things:

- \`namespace: argocd\` — where the \`PolicyException\` resource is stored.
- \`namespaces: [traefik]\` — which workloads the exception applies to.

### Deployment through ArgoCD

The policies are stored in Git and deployed through ArgoCD.

**File:** \`k8s/argo-apps/kyverno-policy.yml\`

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: kyverno-policies
  namespace: argocd

spec:
  project: default
  source:
    repoURL: https://github.com/sagarkpanda/otel-labs-platform
    path: k8s/kyverno

  destination:
    namespace: kyverno

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

This gives us the full flow:

\`\`\`text
Policy in Git
    ↓
ArgoCD
    ↓
Kyverno
    ↓
Admission webhook
    ↓
Workload allowed or rejected
\`\`\`

## 4. Falco Implementation

Falco is installed during platform bootstrap alongside the other cluster components.

**File:** \`terraform/bootstrap.sh\`

\`\`\`bash
helm upgrade --install falco \\
  falcosecurity/falco \\
  --namespace falco \\
  --create-namespace \\
  --timeout 8m \\
  --set tty=true \\
  --set falcosidekick.enabled=true \\
  -f "$REPO_ROOT/falco/custom-rules.yml"
\`\`\`

The project also contains the custom Falco rules used by the installation.

The runtime layer therefore sits after admission:

\`\`\`text
Kubernetes admission
        ↓
      Kyverno
        ↓
   Workload starts
        ↓
       Falco
        ↓
Runtime behavior detection
\`\`\`

Falco covers runtime activity such as:

- unauthorized container escapes
- privilege escalation attempts
- unexpected network connections
- filesystem modifications
- suspicious process execution

The important thing is that these are runtime observations. The workload has already passed the Kubernetes admission stage.

## 5. OWASP ZAP Implementation

The final application-security check happens against the deployed application itself.

**File:** \`.github/workflows/zap.yml\`

\`\`\`yaml
name: OWASP ZAP DAST

on:
  push:
    branches: [main]

env:
  DAST_TARGET_URL: http://otel.sagarpanda.com

jobs:
  zap:
    name: ZAP Full Scan
    if: github.event.head_commit.committer.username == 'github-actions[bot]'
    runs-on: ubuntu-latest

    steps:
      - name: Check application availability
        id: check_url
        run: |
          if curl --fail --silent --max-time 30 \\
            "\${DAST_TARGET_URL}" > /dev/null; then
            echo "reachable=true" >> "$GITHUB_OUTPUT"
          else
            echo "reachable=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Run OWASP ZAP Full Scan
        if: steps.check_url.outputs.reachable == 'true'
        uses: zaproxy/action-full-scan@v0.13.0
        with:
          target: \${{ env.DAST_TARGET_URL }}
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-I -x report_xml.xml'
          artifact_name: 'zap-dast-report'
          fail_action: false

      - name: Upload ZAP Results to DefectDojo
        if: steps.check_url.outputs.reachable == 'true'
        run: |
          curl -X POST \\
            "\${{ secrets.DEFECTDOJO_URL }}/api/v2/reimport-scan/" \\
            -F "scan_type=ZAP Scan" \\
            -F "file=@report_xml.xml" \\
            -F "product_type_name=SP Org" \\
            -F "product_name=Otel Labs" \\
            -F "engagement_name=App Sec Engagement" \\
            -F "test_title=OWASP ZAP DAST"
\`\`\`

The workflow first checks whether the application is reachable. If it is, ZAP runs against the live application.

It is triggered by the \`github-actions[bot]\` commit used in the GitOps promotion flow.

The ZAP action can also open a GitHub issue automatically by setting \`issue: true\`. An HTML report is also generated alongside the XML and JSON for easier reading.

{{< figure src="https://i.ibb.co/60188LSJ/zap-report.png" alt="owasp zap report" width="1000" height="600" title="ZAP HTML report" >}}

The scan does not block the workflow because \`fail_action\` is set to \`false\`; the result is instead reported and sent to DefectDojo.

## End-to-End Flow {#e2e-flow}

Now all of the individual pieces fit together:

\`\`\`text
Developer
    ↓
otel-labs
    │
    ├── Gitleaks
    ├── Semgrep
    ├── Trivy FS
    │
    ↓
Build container images
    ↓
Trivy Image
    ↓
GHCR
    ↓
GitOps update
    ↓
otel-labs-platform
    │
    ├── Gitleaks
    ├── Trivy Terraform
    └── Trivy Kubernetes
    ↓
ArgoCD
    ↓
Kubernetes
    ↓
Kyverno
    │
    ├── allow
    └── reject
    ↓
Running workload
    ↓
Falco
    ↓
Runtime detection
    ↓
OWASP ZAP
    ↓
DefectDojo
\`\`\`

The important part is that these tools are not doing the same job.

\`\`\`text
Gitleaks        → secrets
Semgrep         → source-code security
Trivy FS        → dependencies
Trivy Image     → container artifacts
Trivy Config    → Terraform and Kubernetes configuration
Kyverno         → admission-time enforcement
Falco           → runtime behavior
OWASP ZAP       → live application testing
DefectDojo      → centralized findings
\`\`\`

## Deployment & Setup {#deployment}

### Prerequisites

- EKS cluster deployed from the OTel on EKS project, steps below

### Step 1: Bootstrap the cluster

Apply the Terraform configuration to create the EKS cluster. During cluster creation, the bootstrap script installs **Argo CD, Kyverno and Falco**.

The relevant Helm repositories and installations are:

\`\`\`bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo add falcosecurity https://falcosecurity.github.io/charts

helm upgrade --install kyverno kyverno/kyverno \\
  --namespace kyverno \\
  --create-namespace \\
  --timeout 8m \\
  --set features.policyExceptions.enabled=true \\
  --set features.policyExceptions.namespace=argocd

helm upgrade --install argocd argo/argo-cd \\
  -n argocd \\
  --timeout 8m

helm upgrade --install falco falcosecurity/falco \\
  --namespace falco \\
  --create-namespace \\
  --timeout 8m \\
  --set falcosidekick.enabled=true \\
  -f falco/custom-rules.yml
\`\`\`

Once the cluster is ready, you can create the \`otel-labs\` application as usual by applying the Argo CD root application. If you want to access the Argo CD UI, you can also create the Argo CD ingress.

For the complete application deployment steps, refer to the [OTel on EKS](https://sagarpanda.com/monitoring/otel-on-eks/) guide.

### FalcoSidekick

FalcoSidekick is enabled in the Falco installation above:

\`\`\`bash
--set falcosidekick.enabled=true
\`\`\`

This enables the communication path between **Falco and FalcoSidekick**, allowing Falco events to be forwarded to the destinations configured through Sidekick.

If you want to access the **FalcoSidekick UI**, enable the UI as part of the Helm installation and create an ingress for it.

You can also configure FalcoSidekick to forward Falco alerts to the OTel platform by updating its ConfigMap.

If you only want to verify that Falco is detecting events and do not need FalcoSidekick or its UI, you can omit \`--set falcosidekick.enabled=true\`. Falco can run without Sidekick; Sidekick is used when you want to forward and manage the Falco events through additional outputs.

### Step 2: Configure GitHub secrets

Set the required DefectDojo secrets in both repositories:

\`\`\`text
Settings → Secrets and variables → Actions
\`\`\`

\`\`\`text
DEFECTDOJO_URL=https://defectdojo.example.com
DEFECTDOJO_API_KEY=your-api-token
\`\`\`

You can clone the [{{< icon name="github" size="lg" >}} django-DefectDojo](https://github.com/DefectDojo/django-DefectDojo) repository and run it with Docker Compose to get DefectDojo running locally.

If you run DefectDojo this way, you can use a **Cloudflare Tunnel** to expose it with a URL that can be reached by your GitHub Actions workflows.

\`\`\`bash
cloudflared tunnel --url http://localhost:8080
\`\`\`

Once you have logged in to DefectDojo, click on your **user profile → API V2 Key** to get the API key used by the workflows.

After starting DefectDojo with Docker Compose, you can create a user from the \`uwsgi\` container:

\`\`\`bash
docker compose exec uwsgi python manage.py createsuperuser
\`\`\`

Follow the prompts to set the username, email address and password.

### Step 3: Verify workflows

**otel-labs**

\`\`\`text
Actions → Gitleaks
Actions → Semgrep
Actions → Build, Scan, Push
\`\`\`

**otel-labs-platform**

\`\`\`text
Actions → Gitleaks
Actions → Trivy Config Scan
Actions → OWASP ZAP DAST
\`\`\`

Kyverno and Falco are deployed as part of the platform bootstrap/GitOps setup. Use the earlier testing steps ☝️ [***Falco***](#try-it-manually) and [***Kyverno***](#try-it-manually-1)

### Step 4: Review DefectDojo

\`\`\`text
Dashboard → Products → Otel Labs
\`\`\`

The configured scans feed their results into the relevant DefectDojo engagements.

---

## Key Takeaways {#takeaways}

| Layer | Tool | What it covers |
|---|---|---|
| Secrets | Gitleaks | Git history and current repository |
| SAST | Semgrep | Source-code security |
| Dependencies | Trivy FS | Application dependencies |
| Image | Trivy Image | Built container images |
| Infrastructure | Trivy Config | Terraform and Kubernetes configuration |
| Admission | Kyverno | Kubernetes policy enforcement |
| Runtime | Falco | Suspicious behavior in running workloads |
| DAST | OWASP ZAP | The deployed web application |
| Findings | DefectDojo | Centralized security findings |

## Troubleshooting {#troubleshooting}

### Workflows Not Running

Check \`paths-ignore\` and the path filters in the workflow files. Some changes intentionally do not trigger every scan.

### Gitleaks Too Noisy

Reduce false positives using the repository's Gitleaks configuration/ignore rules.

### Kyverno Blocking Legitimate Pods

Use a scoped \`PolicyException\` for legitimate workloads rather than disabling the policy globally.

## Next Steps {#next-steps}

1. **Network policies** — Restrict pod-to-pod communication.
2. **Vault** — Use Hashicorp Vault for secret management.

## References {#references}

- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Semgrep Documentation](https://semgrep.dev/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Kyverno Documentation](https://kyverno.io/)
- [Falco Documentation](https://falco.org/docs/getting-started/falco-kubernetes-quickstart/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [DefectDojo](https://github.com/DefectDojo/DefectDojo)`,__vite_glob_0_12=`---
date: '2023-04-16T19:26:10+05:30'
draft: false
title: Docker - Build and Push operations.
description: Docker Chapter 2 — How to Build and Push your first image.
cover: https://miro.medium.com/v2/resize:fit:1016/format:webp/1*ktQe3mbLm09C8kyetxI-aA.png
tags:
- docker
- devops
categories:
- Kubernetes & Containers
---

## Introduction:

In the [**_previous article_**]({{< relref "docker-setup" >}}), we saw how to install docker, in this chapter we’ll go through building our own docker image and publish it to the docker hub.

## Lets Get Started:

To build a docker image, we need to have all the code, libraries and its dependencies to be available.

This is a demonstration of a simple web application which has only a static webpage and is being served by a HTTP web server. We are going using lighttpd (can be Apache or Nginx).

You can find all the code on the [GitHub](https://github.com/sagarkrp/fakeweb) repository.

Clone the repository and CD into it. fbweb directory contains all our code. Ignore the yml files for now. They are for Kubernetes.

\`\`\`
& git clone https://github.com/sagarkrp/fakeweb.git
& cd fakeweb
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2_vzcf6vWJ6K7sbVMLG8Bw.png)

We use Dockerfile to write all the instruction needed to build our Image.

Lets understand one by one.

> FROM: Use an existing Image as a base Image.
>
> RUN: To run any commands for example “apt update, mvn clean install, npm install, python -r requirement.txt , dnf install httpd” etc.
>
> COPY: Copies our application code to the OS inside the Image.
>
> ENTRYPOINT/CMD : Command to start our application.

\`\`\`docker
FROM ubuntu:22.10 - We are using Ubuntu as base image.
RUN apt update -y - Updating repository index as we generally do in Linux.
RUN apt install lighttpd -y - Installing lighttpd webserver.
COPY fbweb/ /var/www/html/ - Copying our application to the web server root directory.
ENTRYPOINT service lighttpd start && /bin/bash - Starting the web server.
\`\`\`

To build the image, we need to run the docker build command: docker build -t <name:tag> .

\`\`\`bash
docker build -t fbweb:1.0 .
\`\`\`

After Entering this command , we shall see a updates like these:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CWNEKeUlErGYybncEioP1Q.png)

If there are no errors, this will will be completed with this kind of message:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZDHUfdHCBISGBtNMlOr_VA.png)

To view the list of Images we can use : docker images command.

\`\`\`bash
└──| docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
fbweb        1.0       bcb23d33bf82   1 minute ago   163MB
\`\`\`

Now lets run this image with the following command:

\`\`\`bash
──| docker run --name fb -td -p 80:80 fbweb:1.0
551eddaa8434ac7665e85bf7e959493eb21783ad4f332fdcc5b678e5769ae233
──| docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                               NAMES
551eddaa8434   fbweb:1.0   "/bin/sh -c 'service…"   6 seconds ago   Up 6 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp   fb
\`\`\`

*   -p:<host port>:<container port> = Publish, runs the app on the host port of 80. Even though we have not explicitly exposed our app , by default a web server runs on port 80.
*   -d : Runs in detached mode, meaning in the background and leaves the terminal to use.
*   — name: To assign a custom name to the container. If we don’t mention anything, docker will auto assign a name.

The docker ps command shows the currently active containers. If you don’t see your container , use -a to find out what happened. You may see the status as “Exited” as opposed to “ Up 6 secs ago” as seen above.

If your container is in exited state , use docker logs against the container id or name to find out the reason why it exited.

\`\`\`bash
docker ps :- shows active containers
docker ps -a :-shows both active and stopped containers
docker logs <container_id> :- find out why container exited
\`\`\`

Now lets browse the IP or URL.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9bkcsd1U3amcsPA5Pivt5w.png)

ta-da! Our application is running fine. We successfully containerized the application.

### Push the Image to docker hub:

Tag the image with repository name using below command. After tagging we should see another image appear in the list with same ID.

\`\`\`bash
──| docker tag fbweb:1.0 sagarkp/fbweb:1.0

└──| docker images
REPOSITORY      TAG       IMAGE ID       CREATED             SIZE
fbweb           1.0       9443bff58bb3   About an hour ago   163MB
sagarkp/fbweb   1.0       9443bff58bb3   About an hour ago   163MB
\`\`\`

Now to push to docker hub, we first need to provide docker hub credentials in our terminal. Use the below command and enter the creds when asked.

\`\`\`bash
docker login
\`\`\`

Once we are logged in, we can use the docker push command to push the image.

\`\`\`bash
──| docker push sagarkp/fbweb:1.0
The push refers to repository [docker.io/sagarkp/fbweb]
a2517707f654: Pushed
5cd1ef7c3719: Pushing [=============================>                     ]  32.96MB/56.14MB
61800684fb13: Pushing [=================>                                 ]  12.47MB/36.45MB
c8211604066d: Pushing [================>                                  ]   22.9MB/70.25MB
\`\`\`

Now if we login to Docker Hub in our browser, we can see the image and it was published a few seconds ago.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*El9R5gJ8oj7WsZwhBuNWOA.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7mYcV3qSgGS3e6RD3H_5fQ.png)

Whalesome!!. We have successfully built and pushed our image to docker hub.

<!-- [**Checkout more artciles on Docker →**](/blogs/#docker) -->`,__vite_glob_0_13=`---
date: '2023-04-16T19:26:10+05:30'
draft: false
title: 'Docker: Containerization for beginners.'
description: Docker Chapter 1 — How to Install Docker on Linux and Windows.
cover: https://miro.medium.com/v2/resize:fit:1202/format:webp/1*Ms3dGlKGPJhQPkPe9c-73w.jpeg
tags:
- docker
- devops
categories:
- Kubernetes & Containers
---

## Introduction

Docker is a software platform that allows you to build, test, and deploy applications by packaging everything the application needs to run including libraries, code, and runtime.

When we package the application and all its dependencies to a single unit, its called an image and when the image is used to run the application its called a container.

Image: Application package.

Container: Application/Image in running state.

Lets see how to install it on popular Linux distributions like Ubuntu and RHEL and Windows as well.

## Installation on Linux:

*   First update the repository index.

\`\`\`
sudo apt update (Ubuntu)
sudo dnf update (red hat)
\`\`\`

*   Install below packages which are not related to docker but they help in setting up the docker repository.

\`\`\`
On Ubuntu:
$ sudo apt install ca-certificates curl gnupg
On Red Hat Linux:
$ sudo yum install yum-utils -y
\`\`\`

*   Setup Docker repository:

\`\`\`
On Ubutnu:
$ sudo mkdir -m 0755 -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo \\
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
On Red Hat:
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
\`\`\`

*   Update repository index again and install docker engine with the following command:

\`\`\`
sudo apt update (Ubuntu)
sudo dnf update (red hat)

Ubuntu:
$ sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
Red Hat Linux:
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
\`\`\`

Check Docker status and start it if its not active. Enable service if you want to start docker at boot time.

\`\`\`
$ systemctl status docker
$ sudo systemctl start docker
$ sudo systemctl enable dockerInstallation on Windows:To use Docker on Windows, we need to have WSL (Windows Subsystem for Linux) enabled. Follow [this official guide by Microsoft on how to do so.](https://learn.microsoft.com/en-us/windows/wsl/install)
\`\`\`

*   Download docker desktop app from the [official website](https://docs.docker.com/desktop/install/windows-install/), and install just like any windows application.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x1tbtuynZ8hri-EHUvwUKA.png)

Check docker version:

\`\`\`
$ docker --version
Docker version 23.0.3, build 3e7cbfd
\`\`\`

*   Pull and run a test image.

Note: You might get permission denied error while using docker command on Linux. To avoid this, use sudo or add your user to docker group. Follow the official guide on how to do this here: [Post Installation](https://docs.docker.com/engine/install/linux-postinstall/) on Linux

\`\`\`
$ docker run hello-world

$ docker pull hello-world
$ docker run hello-world
\`\`\`

_Pull vs Run_: Docker pull downloads an images and we have to start the container manually using the docker run command whereas docker run pulls the images and starts the container.

The above is an test image, with docker run it shows a message like below:

\`\`\`
└──| docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:4e83453afed1b4fa1a3500525091dbfca6ce1e66903fd4c01ff015dbcb1ba33e
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
This message shows that your installation appears to be working correctly.
To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash
Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/
For more examples and ideas, visit:
 https://docs.docker.com/get-started/
\`\`\`

The pull command downloads the image and stores in our machine. So if you pull or run again, the existing image will be used.

\`\`\`
──| docker pull hello-world
Using default tag: latest
latest: Pulling from library/hello-world
Digest: sha256:4e83453afed1b4fa1a3500525091dbfca6ce1e66903fd4c01ff015dbcb1ba33e
Status: Image is up to date for hello-world:latest
docker.io/library/hello-world:latest
\`\`\`

Hurray! This completes the docker installation. On next chapter we’ll see how to build your first image and push to docker hub.

Source: [Docker Docs](https://docs.docker.com/engine/install/).

<!-- [**Checkout more artciles on Docker →**](/blogs/#docker) -->`,__vite_glob_0_14=`---
date: '2023-10-21T19:26:10+05:30'
draft: false
title: A Beginner’s Introduction to GitHub Actions
description: GitHub Actions is a modern CI/CD alternative to Jenkins.
cover: https://miro.medium.com/v2/resize:fit:1358/format:webp/1*_7mJjD1resPodxT7agk16w.png
tags:
- ci/cd
- github
- devops
- pipeline
- "GitHub Actions"
series:
- GitHub Actions
series_order: 1
categories:
- Linux & Automation
---

<!-- ![action workflow](https://miro.medium.com/v2/resize:fit:1358/format:webp/1*_7mJjD1resPodxT7agk16w.png) -->

**Intro:** GitHub action is a CI/CD platform to create build, test and deployment pipeline for our application. This is a yaml based configuration.

In this tutorial, we are going to see the basics of github action and then proceed to integrate SonarQube SAST with it in the next post.

Prerequisite:

*   GitHub ac

## Set Up

First create a repository on github and add a simple program that prints just hello world.

Find the repository on [github](https://github.com/sagarkrp/github_actions).

Then in the same repository create another directory structre as .github/workflows. This is the default way github recognises the actions defined in our repository.

Create a yaml file with any name and we’ll define jobs, steps similarly to Jenkins.

The program that prints hello world. I m using python here.

\`\`\`python
#main.py
import os
print("Hello World")
\`\`\`

The action yml to take this code and run the pipeline.

\`\`\`yml
name: github-actions-demo
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: python main.py
\`\`\`

*   name: The name of our pipeline
*   on — this is the build trigger. We have different triggers like on push, or pull request or a cron job etc. We also need to define the branch on the the event should be taken from. Here the branch is main.

\`\`\`yml
on:
  schedule: # Run workflow automatically
    - cron: '30 4 * * *'
\`\`\`

On a PR. We can also define multiple branches as an array.

\`\`\`yml
on:
  push:
    branches:
      - [main, test]
  pull_request:
    branches:
      - main
\`\`\`

*   workflow_dispatch: This is optional to trigger the job manually similarly to “Build Now” on Jenkins.

Having this, we get an option as below. Skipping this means the pipeline will run only on the other events such as code push , on a cron time and pull request. We can’t run it ourself.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0VLR_HE6sb6_NwaXlHStAw.png)

*   jobs — same as Stages on Jenkins and we can define multiple jobs (stages). Every job with a particular name. In our example the job name is job1.
*   runs-on: This is for defining the node (machine) where the pipeline will be executed. It can be Linux, windows or Mac OS. We can also define our own node.

\`\`\`yml
steps:
      - uses: actions/checkout@v2
      - run: python main.py
\`\`\`

Now steps is where we actually define our commands to the run the pipeline.

The uses statements are like plugins in Jenkins. The “uses: actions/checkout@v2” statement here is a built-in action for cloning the repository to the node and the run statement is our application specific command to run.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NsNxqvuJLWjb6BIRCM6Z6A.png)

Alright, so once you save this, go to the Actions tab on top bar of repo. And we shall see the pipeline running.

On opening the pipleine, we can see the stages as we defined with number of jobs. Here I have only 1 job.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OseRaYna1YUVkxoEPggPiQ.png)

Incase you have multiple jobs, the stages will appear and with linkages of the stages in the order of execution.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fqsa5Icu-wijxWRow_TnMg.png)

Click on the jobs and expand the steps to see logs. We can also see the application printing the Hello world here.

There are some default steps defined by github. You can ignore them for now.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*n8Yq_fYvST_agi4I7XgTww.png)

If you want to run the pipeline manually, click on the action name from the list and click on the “Run workflow” as seen on the first screenshot.

### Adding credentials

As we add credentials in Jenkins using the credentials store, we can make use of github’s secret for the same purpose.

Go to the setting tab on the repository. Click on “secrets and variable” and select “actions”. Click in New repository secret and add a name for it. Paste the value in secret filed and Save.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PUbXX3GQ94xmbMAlakNfhw.png)

After you are done, we should see our secrets name. Even you can’t view the value once added. Incase you need to update it click on the pencil and paste the new value.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8MU_ES4fxDjF0pi6Q78jbw.png)

Now, I’ll update the program to use the secret values.

\`\`\`python
import os
print("Hello World")
print(os.environ.get('first_name'))
print(os.environ.get('last_name'))
print((os.environ.get('first_name'))=='Sagar')
print((os.environ.get('last_name'))=='p')
\`\`\`

As the values are coming from secret, when we try to print them, we’ll get *** printed instead. So to be able to verify, I have added conditional statements which will print True or false based on the secret values.

The “**$github.run_number**” is a built-in variable that prints the build number of workflow runs.

Now we need to create 2 variables to get the creds values into github action to pass it to the application. Since we are accessing secret, we’ll use **“\${{secrets.secretname}}”.**

Update the action yml like below:

\`\`\`yml
name: github-actions-demo
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # - run: sudo apt install python
      - run: echo \${{github.run_number}}
      - run: python main.py
        env:
            first_name : \${{secrets.FNAME}}
            last_name : \${{secrets.LNAME}}
\`\`\`

Now lets have a look at the logs. We see hello world as usual. The *** are the values of secrets but are masked because well its secret 😀.

The True is because the FNAME value is sagar, and LANME is not p, so the condition failed.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SRAs-SSLi09FlCJO8NdxFA.png)

There are even more options and many actions that can be used.

For example you can build an app and push the result to a remote machine or push to a new branch on the github repo itself, or download the build artifact.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2pmw01Ywll8UZG8ae8-90w.png)

You can also select the version of the programming language you want to use or even use multiple version of the lang.

\`\`\`yml
strategy:
      matrix:
        node-version: [10.x, 12.x]
\`\`\`

→ Here’s an example of pushing to a branch in same repo.

\`\`\`yml
name: React App Build and Push
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:
jobs:
  build_and_push:
    runs-on: ubuntu-latest
    # strategy:
    #   matrix:
    #     node-version: [16.x]
    steps:
    - name: Restore node_modules from cache
      uses: actions/cache@v3
      with:
       path: |
         node_modules
         */*/node_modules
       key: \${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
    # - name: Production build
    - uses: actions/checkout@v3
    - name: Production build
      uses: actions/setup-node@v3
      with:
        node-version: '16.x'
        #\${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - name: Deploy to gh-pages
      run: |
       git config --global user.name $user_name
       git config --global user.email $user_email
       git remote set-url origin @github.com/\${repository">https://\${github_token}@github.com/\${repository}
       npm run deploy
      env:
       user_name: 'github-actions[bot]'
       user_email: 'github-actions[bot]@users.noreply.github.com'
       github_token: \${{ secrets.PAGES_TOKEN }}
       repository: \${{ github.repository }}
\`\`\`

The last step in this example is to push the complied files to the gh-pages branch. This done using github-actions bot. “**user_name: ‘github-actions[bot]**”

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WPj8ZX8kpWsH-zzpNLqdmQ.png)

→ Another github action by Gautam, that runs daily and updates the readme.md with the medium (can be any) blogs.

\`\`\`yml
name: medium.com
on:
  schedule: # Run workflow automatically
    - cron: '30 4 * * *'
    # - cron: '30 13 * * *'
  workflow_dispatch:
permissions:
  contents: write # To write the generated contents to the readme
jobs:
  update-readme-with-blog:
    name: Update this repo's README with latest medium posts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Pull in medium posts
        uses: gautamkrishnar/blog-post-workflow@v1
        with:
          feed_list: "https://sagarkrp.medium.com/feed"
          max_post_count: 10
\`\`\`

As of now, the workflow has not run to update this particular post, I can run manually to update the list or it will be updated based on the cron job run.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3YELOksvNx9OmONFnJo4EQ.png)

Note: In this tutorial, we created the github action workflows ourselves, however there are built-in actions available.

On a new repo, click on the action tab and you will see lot of actions available. Just select the type of action you need based on your project and it will create the the .github/workflows/<workflow name>.yml automatically. You can edit the workflow if you want.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6gzGBtTOaGlp_ezdfgYT7Q.png)

You can also find more workflows both form github and the community on the github marketplace

[GitHub Marketplace: actions to improve your workflow](https://github.com/marketplace?type=actions&source=post_page-----55e14f62713b---------------------------------------)

Alright that’s about it. These are the basics. You can explore to learn more.

In the next post, we’ll integrate SonarQube for static analysis on github action.

Thanks for reading.

### Further Reading

[How to Setup Jenkins and Push Docker Image using Pileline Job](https://sagarkrp.medium.com/how-to-install-and-setup-jenkins-on-linux-with-pipeline-job-3e2973229a8f?source=post_page-----55e14f62713b---------------------------------------)

<!-- [Read more on CI/CD →](/blogs/#ci-cd) -->`,__vite_glob_0_15=`---
date: '2026-05-24T12:45:10+05:30'
draft: false
title: Turn Your GitHub Repository into a Self-Managing Workflow
description: Learn to manage github repo with automation. Create PR/Issue templates, label PRs automatically and more.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BKfu-QFmcuj1zpFzHqWSYA.png
tags:
- ci/cd
- github
- devops
- repo automation
- "GitHub Actions"
series:
- GitHub Actions
series_order: 2
categories:
- Linux & Automation
---

## Introduction

[In my previous article, I wrote the fundamentals of GitHub Actions and how they can simplify CI/CD pipelines]({{< relref "github-actions" >}}). But modern repositories need much more than just automated builds and deployments.


As projects grow, maintaining pull requests, managing issues, handling releases, updating dependencies, and reviewing security manually becomes repetitive and time-consuming.

In this article, we’ll take GitHub Actions beyond CI/CD and automate common repository management tasks such as:

*   PR & bug report templates
*   Automatic labeling
*   PR welcome comments
*   Semantic releases

By the end, you’ll have a cleaner, more maintainable, and partially self-managing GitHub repository. View all the config on [GitHub](https://github.com/sagarkpanda/action-replay).

### Repository Structure

\`\`\`text
.github/
├── ISSUE_TEMPLATE/
├── workflows/
│ ├── codeql.yml
│ ├── labeler.yml
│ ├── pr-comment.yml
│ ├── sem-release.yml
│ └── automerge.yml
├── PULL_REQUEST_TEMPLATE.md
├── dependabot.yml
├── labeler.yml
\`\`\`

### PR and Bug Report Templates

One of the simplest but most useful automations is enforcing structured pull requests and issue reports.

Without templates, contributors may omit important information, maintainers would have to ask repetitive questions and makes the review process slower.

GitHub supports both:

*   Pull Request templates
*   Issue/Feature request template

**PR Template:**

create the template under .github as below and add your data how you want to show.

\`\`\`md
## Summary

Describe the changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] CI passes

## Notes

Additional context if needed.
\`\`\`

**Issue template/feature req:**

Similarly create folder .github/ISSUE_TEMPLATE and you can add bug report and feature request template.

\`\`\`yaml
## --> bugreport.yml
name: Bug Report
description: Report a bug
title: "[Bug]: "
labels:
  - bug
body:
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Describe the bug
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce it?
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
-------------------------------------------------------
#--> feature_request.yml
name: Feature Request
description: Suggest a new feature
title: "[Feature]: "
labels:
  - enhancement
body:
  - type: textarea
    id: feature
    attributes:
      label: Feature Description
      description: Describe the feature
    validations:
      required: true
  - type: textarea
    id: problem
    attributes:
      label: Problem Solved
      description: What problem does this solve?
\`\`\`

GitHub recognises these templates and will show a panel at the top.
Note that for feature request also it says the same.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zzi6JQE8rXku9Ti4uFPkKg.png"
    alt="GitHub issue"
    width="1000"
    height="600"
>}}

Creating a new issue or PR now shows predefined templates instead of a blank page.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*p11PpcnuJaWdaXFln975vw.png"
    alt="Issue template"
    width="1000"
    height="600"
    title="Issue templates"
>}}

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WuPi-lYPLga7DrotVUL6Gg.png"
    alt="Template fields"
    width="1000"
    height="600"
    title="Issue template with predefined fields"
>}}


### Automatic PR Labeling

Instead of manually labeling every PR, GitHub Actions can automatically apply labels based on changed files.

You can view list of labels already created or create any if you want under the PR menu.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*B8EIM6a6bb7ryg8sCV90Wg.png"
    alt="PR Labels"
    width="1000"
    height="600"
>}}

Click on Labels to view, once inside the view you can create your own.

Then create a list of files labels and their associated files or path under .github/labeler.yml. This is just the config file.

\`\`\`yaml
documentation:
  - changed-files:
      - any-glob-to-any-file:
          - "**/*.md"
enhancement:
  - changed-files:
      - any-glob-to-any-file:
          - "src/**/*"
          - "features/**/*"
github-actions:
  - changed-files:
      - any-glob-to-any-file:
          - ".github/**/*"

javascript:
  - changed-files:
      - any-glob-to-any-file:
          - "package.json"
          - "package-lock.json"
          - "**/*.js"
          - "**/*.mjs"
          - "**/*.cjs"
\`\`\`

For example any changes to .md file will be labeled as documentation, and any changes made under .github/ will be marked as github-actions.

To have github auto assign these labels we have to create a workflow under .github/workflow.

\`\`\`yaml
#pr-labeler.yml
name: PR Labeler
on:
  pull_request:
jobs:
  add-label:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/labeler@v5
\`\`\`

And whenever a PR is created github action bot automatically assigns labels.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Nb_s-RRaDXWHk2oi4gEypg.png"
    alt="Auto Labels"
    width="1000"
    height="600"
>}}

### Automated PR Comments

Maintainers often manually thank contributors for their suggested changes and this can also be automated. Lets just say “thanks for the PR”.

Create the workflow the same way under .github/workflows.

\`\`\`yaml
#.github/workflows/pr-comment.yml
name: PR Comment
on:
  pull_request:
    types:
      - opened
jobs:
  comment:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    env:
      GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Comment on PR
        run: |
          gh pr comment \${{ github.event.pull_request.number }} \\
            --body "Thanks for the PR!"
\`\`\`

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QAOaeO8wYa9iGGrBQBQ5ZQ.png"
    alt="PR comment"
    width="1000"
    height="600"
    title="auto comment on a new PR"
>}}

### Semantic Release Automation

Semantic release bot can automatically do the tagging and release, could also update the changelog.md.

First add the dependencies in a package.json and .releaserc.json

\`\`\`json
#package.json
{
  "name": "dummy-semantic-release",
  "private": true,
  "version": "0.0.0",
  "description": "Test repo for semantic-release",
  "scripts": {
    "release": "semantic-release"
  },
  "devDependencies": {
    "@semantic-release/changelog": "^6.0.0",
    "@semantic-release/commit-analyzer": "^13.0.0",
    "@semantic-release/git": "^10.0.0",
    "@semantic-release/github": "^11.0.0",
    "@semantic-release/release-notes-generator": "^14.0.0",
    "semantic-release": "^24.0.0",
    "conventional-changelog-conventionalcommits": "^8.0.0"
  }
}
---------------------
#.releaserc.json
{
  "branches": ["main"],
  "plugins": [    [      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits"
      }
    ],
    [      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits"
      }
    ],
    "@semantic-release/changelog",
    "@semantic-release/github",
    [      "@semantic-release/git",
      {
        "assets": [          "CHANGELOG.md"
        ],
        "message": "chore(release): \${nextRelease.version} [skip ci]"
      }
    ]
  ]
}
\`\`\`

\`\`\`yaml
#release.yml
name: Semantic Release
on:
  push:
    branches:
      - main
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    env:
      GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Run semantic-release
        run: npx semantic-release
\`\`\`

This bot works based on commit message formats.

\`\`\`ini
feat: add user authentication
fix: resolve login timeout issue
perf: improve API response caching
docs: update installation guide
refactor: simplify payment service
\`\`\`

Version bump rules:

*   \`fix:\` → patch release (\`1.0.0\` → \`1.0.1\`)
*   \`feat:\` → minor release (\`1.0.0\` → \`1.1.0\`)
*   \`BREAKING CHANGE:\` or \`feat!:\` → major release (\`1.0.0\` → \`2.0.0\`)

any other commits or formats such as chore: or simple commits will be ignored marking no tag or release, you can view the semantic release workflow action for the details.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2tWLNG_tMtdOjYB6wn8OLQ.png"
    alt="major release"
    width="1000"
    height="600"
    title="Major Release commit with feat!:"
>}}

<br></br>
{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*dsRB6fXJrWxxmsyjHH5UWQ.png"
    alt="PR comment"
    width="1000"
    height="600"
    title="patch release for commit with fix:"
>}}

The changelog.md, the tags and the release, all have been updated.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PhsfVY0lQhib9PrNpB6CiQ.png"
    alt="changelog"
    width="1000"
    height="600"
>}}

## Wrap Up:

Alright, thats all for today. In the next article, we will take a look at more automation such as code and dependency scan with codeql and dependabot.

<!-- Checkout related article on [CI/CD →](/blogs/#ci-cd) -->
`,__vite_glob_0_16=`---
date: '2026-07-12T10:45:10+05:30'
draft: true
title: "Git Tips and Tricks Every Engineer Should Know"
description: "Rarely used got commands and repo settings"
cover: https://i.ibb.co/ZpbkFk97/x.jpg
tags:
- gitlab
- github
categories:
- Git
---

## 1. Privacy Settings

Every Git commit contains metadata about the person who created it, including the author's name and email address. If your repository is public, anyone can inspect the commit history and view that information.

Many engineers only discover this after noticing their personal email address on GitHub or GitLab.

Fortunately, preventing future exposure is straightforward, and if your email has already been committed, the repository history can be rewritten.

### Why Your Email Appears in Commits

Every Git commit stores two pieces of identity information:

- Author name
- Author email

You can check the values currently configured for Git using:

\`\`\`bash
git config --global user.name
git config --global user.email
\`\`\`

You can also inspect an existing commit:

\`\`\`bash
git log --format=fuller
\`\`\`

Example:

\`\`\`text
Author: John Doe <john@example.com>
Commit: John Doe <john@example.com>
\`\`\`

If \`john@example.com\` is your personal email and the repository is public, that email becomes publicly visible as part of the commit history.

### Using a Noreply Email

Both GitHub and GitLab provide a private **noreply** email address that can be used instead of your personal email.

Typical examples include:

\`\`\`text
GitHub:
<id>+<username>@users.noreply.github.com

GitLab:
<username>@users.noreply.gitlab.com
\`\`\`

Commits created with your noreply address are still associated with your account, while keeping your personal email private.

### Prevent Future Commits from Exposing Your Email

#### Step 1: Enable Email Privacy

For **GitHub**:

- Go to **Settings → Emails**
- Enable **Keep my email addresses private**

For **GitLab**:

- Go to **Preferences → Email**
- Enable **Use a private commit email** (wording may vary slightly depending on your GitLab version or instance).

> **Note:** These settings only affect commits created through the web interface. They do not modify your local Git configuration or existing commit history.

#### Step 2: Configure Git Locally

Configure Git to use your noreply email address:

\`\`\`bash
git config --global user.email "<your-noreply-email>"
\`\`\`

Verify the change:

\`\`\`bash
git config --global user.email
\`\`\`

From this point onward, new commits created on your local machine will use the configured noreply email.

### Existing Commits Are Not Changed

A common misconception is that changing \`user.email\` updates previous commits.

It doesn't.

Git commits are immutable objects. The author information is stored inside each commit, so changing your Git configuration only affects commits created in the future.

If your personal email already exists in the repository history, it will remain visible until that history is rewritten.

### When Should You Rewrite History?

Rewriting Git history is appropriate when you've accidentally committed information that should not remain public, such as:

- Personal email addresses
- Internal company email addresses
- Sensitive files
- Secrets, API keys, or credentials

The recommended tool for this is **git-filter-repo**, which can rewrite repository history efficiently and safely.

Later in this article, we'll use \`git-filter-repo\` to remove sensitive information from existing commits.

### Best Practices

- Use your GitHub or GitLab noreply email for public repositories.
- Enable your platform's email privacy setting before making web-based commits.
- Configure your local Git client to use the same noreply address.
- Verify your Git configuration when setting up a new machine.
- If your personal email has already been published, consider rewriting the repository history if appropriate.

## 2. Undoing Changes

Git provides several commands for undoing changes, but each one operates at a different level. Understanding when to use \`git restore\`, \`git reset\`, and \`git revert\` will help you recover from mistakes without losing work or rewriting history unintentionally.

Before we begin, it's important to understand the three areas that Git manages. Most commands such as \`git restore\`, \`git reset\`, and \`git revert\` operate on one or more of these areas.

\`\`\`text
┌──────────────────────────────┐
│     Commit History (HEAD)    │
└──────────────────────────────┘
              ▲
              │
        git commit
              │
┌──────────────────────────────┐
│     Staging Area (Index)     │
└──────────────────────────────┘
              ▲
              │
           git add
              │
┌──────────────────────────────┐
│    Working Tree (Files)      │
└──────────────────────────────┘
\`\`\`

- **Working Tree** – The files you're currently editing.
- **Staging Area (Index)** – Changes that will be included in the next commit.
- **Commit History (HEAD)** – The latest committed snapshot of your repository.

As we explore each command, we'll refer back to this diagram to see which area is being modified.

Let's create a small repository that we can safely experiment with.

### Setting Up the Demo Repository

To demonstrate the differences between \`git restore\`, \`git reset\`, and \`git revert\`, we'll create a small Git repository from scratch. Using a dedicated repository ensures you can safely experiment without affecting any existing projects.

#### Initialize a Repository

\`\`\`bash
mkdir git-reset-demo
cd git-reset-demo
git init
\`\`\`

#### Configure a Local Git Identity

For this demo, we'll configure the Git identity only for this repository. This avoids modifying your global Git configuration.

\`\`\`bash
git config --local user.name "Demo User"
git config --local user.email "demo@example.com"
\`\`\`

You can verify the configuration using:

\`\`\`bash
git config --local --list
\`\`\`

#### Create the First File

\`\`\`bash
echo "Line 1" > notes.txt
\`\`\`

At this point, Git sees the file as **untracked**:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
On branch master

No commits yet

Untracked files:
  notes.txt
\`\`\`

#### Stage the File

Add the file to the staging area:

\`\`\`bash
git add notes.txt
\`\`\`

Verify the status again:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
Changes to be committed:
  new file: notes.txt
\`\`\`

#### Create the Initial Commit

Finally, create the first commit:

\`\`\`bash
git commit -m "Initial commit"
\`\`\`

Verify the commit history:

\`\`\`bash
git log --oneline
\`\`\`

Example output:

\`\`\`text
a1b2c3d Initial commit
\`\`\`

Your repository is now in a clean state and ready for the rest of the examples in this article.

### \`git restore\`

\`git restore\` was introduced in Git 2.23 to make it clearer how to restore files without overloading the behavior of \`git checkout\`.

Its primary purpose is to restore files in your **working tree** or **staging area**, making it an excellent tool for undoing local changes without affecting your commit history.

We'll use the repository created in the previous section to demonstrate the most common use cases.

#### Discarding Unstaged Changes

Let's modify our tracked file:

\`\`\`bash
echo "Line 2" >> notes.txt
\`\`\`

Check the status:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
Changes not staged for commit:
  modified: notes.txt
\`\`\`

At this point, the change exists only in the **working tree**.

To discard the modification and restore the file to its last committed state, run:

\`\`\`bash
git restore notes.txt
\`\`\`

Verify the result:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
On branch master
nothing to commit, working tree clean
\`\`\`

Inspect the file:

\`\`\`bash
cat notes.txt
\`\`\`

Output:

\`\`\`text
Line 1
\`\`\`

The second line has been removed because it was never staged or committed.

> **Key takeaway:** \`git restore <file>\` discards changes from the **working tree**, restoring the file to the version stored in \`HEAD\`.

#### Unstaging Changes

Now let's modify the file again:

\`\`\`bash
echo "Line 2" >> notes.txt
\`\`\`

Stage the change:

\`\`\`bash
git add notes.txt
\`\`\`

Verify the status:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
Changes to be committed:
  modified: notes.txt
\`\`\`

Suppose you staged the file accidentally and want to remove it from the staging area without losing your edits.

Run:

\`\`\`bash
git restore --staged notes.txt
\`\`\`

Check the status again:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
Changes not staged for commit:
  modified: notes.txt
\`\`\`

Inspect the file:

\`\`\`bash
cat notes.txt
\`\`\`

Output:

\`\`\`text
Line 1
Line 2
\`\`\`

Notice that the modification is still present in the file.

Only the staging area has changed.

> **Key takeaway:** \`git restore --staged <file>\` removes the file from the staging area while preserving your local changes.

#### Discarding Both Staged and Unstaged Changes

If you've already staged a change and later decide you don't want it at all, you can restore both the staging area and the working tree.

First, stage the file again:

\`\`\`bash
git add notes.txt
\`\`\`

Then restore both:

\`\`\`bash
git restore --staged --worktree notes.txt
\`\`\`

You can also use the short form:

\`\`\`bash
git restore -SW notes.txt
\`\`\`

Verify the result:

\`\`\`bash
git status
\`\`\`

Output:

\`\`\`text
On branch master
nothing to commit, working tree clean
\`\`\`

Inspect the file one final time:

\`\`\`bash
cat notes.txt
\`\`\`

Output:

\`\`\`text
Line 1
\`\`\`

The file has been restored to exactly how it existed in the most recent commit.

Both the staged change and the local modification have been discarded.

> **Key takeaway:** \`git restore --staged --worktree <file>\` completely restores the file to the state of the latest commit (\`HEAD\`).

#### Summary

| Command | Description |
|---------|-------------|
| \`git restore <file>\` | Discards unstaged changes from the working tree. |
| \`git restore --staged <file>\` | Removes changes from the staging area while keeping the file modified. |
| \`git restore --staged --worktree <file>\` | Removes staged changes and discards working tree changes, restoring the file to the latest committed version. |

\`git restore\` only affects files in your working directory and staging area. It **does not rewrite commit history**, making it a safe command to use when cleaning up local changes before committing.

### \`git reset\`

Unlike \`git restore\`, which primarily affects your working directory or staging area, \`git reset\` changes where \`HEAD\` points. Depending on the mode used, it can also update the staging area and working tree.

To better understand how \`git reset\` works, let's create a few commits.

#### Create Additional Commits

Append another line to the file:

\`\`\`bash
echo "Line 2" >> notes.txt
\`\`\`

Stage and commit the change:

\`\`\`bash
git add notes.txt
git commit -m "Add Line 2"
\`\`\`

Append one more line:

\`\`\`bash
echo "Line 3" >> notes.txt
\`\`\`

Stage and commit again:

\`\`\`bash
git add notes.txt
git commit -m "Add Line 3"
\`\`\`

Verify the commit history:

\`\`\`bash
git log --oneline
\`\`\`

Example output:

\`\`\`text
c3d4e5f Add Line 3
b2c3d4e Add Line 2
a1b2c3d Initial commit
\`\`\`

We now have three commits, giving us enough history to demonstrate each reset mode.`,__vite_glob_0_17=`---
date: '2026-04-12T10:45:10+05:30'
draft: false
title: 'GitLab Setup Unlocked: Your 10-Minute Fast-Track Guide'
description: Launch Your Own GitLab Instance in Minutes
cover: https://i.ibb.co/ZpbkFk97/x.jpg
tags:
- gitlab
- aws
categories:
- Git
url: /blogs/gitlab/gitlab-setup/
aliases:
- /blogs/gitlab_setup/
---

## Setup Host
First, set up an instance. I chose **AWS EC2**, but you can use any cloud provider or your own physical server.

### Hardware Requirements
Do not try to use the "Free Tier" \`t2.micro\` or \`t3.micro\`. GitLab runs several background services (PostgreSQL, Redis, Sidekiq) that require significant memory.

* **Minimum:** 4GB RAM (e.g., \`t3.medium\`). *Note: If you use 4GB, you must configure a 4GB Swap file or the installation will crash.*
* **Recommended:** 8GB RAM or more (e.g., \`t3.large\` or \`t3.xlarge\`). This ensures a smooth experience without lag.
* **Storage:** At least 20GB–40GB . For learning purposes, 8GB is enough.

### Network Configuration
Before launching, ensure your **AWS Security Group** has the following Inbound Rules open to the world (\`0.0.0.0/0\`):

| Port | Protocol | Purpose |
| :--- | :--- | :--- |
| 80 | HTTP | Let's Encrypt Validation |
| 443 | HTTPS | Secure Web Access |
| 22 | SSH | Remote Terminal Access |


## Mapping your Domain
Create an **A record** DNS entry at your domain registrar pointing your desired subdomain (e.g., \`gitlab.sagapanda.com\`) to the machine's Public IP.

<!-- ![A record](/blogs/gitlab/dns_entry.png) -->
{{< figure src="https://i.ibb.co/WvNCpJ1F/x.png" alt="dns entry" width="1000" height="600" title="DNS Record" >}}

## Add GitLab Repository
First, update the cache and install \`curl\` if it's not already there. Then, add the GitLab repository to your system:

\`\`\`
bash
curl -sS [https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh](https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh) | sudo bash

\`\`\`

Here I have added the gitlab-ee package, you can choose to replace the ee with ce for community edition. However ee without a license essentially works as ce and we can upgrade to ee seamlessly when we want. We also have 30 days of GitLab ultimate free trial with ee.

{{< figure src="https://i.ibb.co/cXxjPCR2/x.png" alt="add gitlab repo" width="1000" height="600" title="Add gitlab repo" >}}

## Installation & SSL Setup

Now run the cmd to install GitLab.
You can either setup external URL now or can configure it later if you choose. I chose to configure later.
 
\`\`\`
sudo apt install gitlab-ce or gitlab-ee
(OR)
sudo EXTERNAL_URL="https://gitlab.yourdomain.com" apt install gitlab-ee
\`\`\`
Note: Replace ee with ce if you added ce package earlier.

{{< figure src="https://i.ibb.co/DHrZPtPq/x.png" alt="gitlab installation" width="1000" height="600" title="GitLab Installation" >}}

Now open the gitlab config file located at /etc/gitlab/gitlab.rb and search for external URL and update your domain. use ctrl+w to search in nano or any other key combo in other editors.

\`\`\`
sudo nano /etc/gitlab/gitlab.rb
\`\`\`

If you ran the install cmd with external URL, this would already be set.

{{< figure src="https://i.ibb.co/3xkCkHy/x.png" alt="external url" width="1000" height="600" title="Set external url" >}}

Again search for letsencrypt and the lets encrypt section for cert. Uncomment the first 2 lines and set the first value to 'true' which would be nil. Add your valid email address for the 2nd value inside quotes.

{{< figure src="https://i.ibb.co/WN6Yhd0c/x.png" alt="tls setup" width="1000" height="600" title="Enable Lets Encrypt TLS" >}}
<!-- <br></br> -->

Once set, you can save it and run the gitlb-ctl reconfigure for the changes to take effect.
\`\`\`bash
sudo gitlab-ctl reconfigure.
\`\`\`
{{< figure src="https://i.ibb.co/ZRfCgm50/x.png" alt="Get initial PW" width="1000" height="600" title="Get Initial password" >}}


{{< figure src="https://i.ibb.co/5gB3m1rx/x.png" alt="add gitlab lgoin landing" width="1000" height="600" title="login page" >}}
<!-- <br></br> -->

There we go, we have our gitlab ready. Get the initial admin pw from /etc/gitlab/initial_root_password, this expires in 24 hours.
The username is root and with the pw obtained earlier, you can login. As we can see sign up is enabled by default, meaning anyone could access our GitLab by just signing up themselves so its better to disable it and allow only user creation by admin. Click on the first deactivate button to do so.
<!-- <br></br> -->

{{< figure src="https://i.ibb.co/n8V92tdd/x.png" alt="gitlab landing" width="1000" height="600" title="GitLab Landing page" >}}
<!-- <br></br> -->
Now you can create another user and other relevant user management in the same page.

## Wrapping Up
Congratulations! You've just successfully setup your GitLab repo. By self-hosting GitLab, you now have total control over your repositories, CI/CD pipelines, and data privacy. Continue exploring further.
`,__vite_glob_0_18=`---
date: '2024-02-10T19:26:10+05:30'
draft: false
title: ArgoCD GitOps for Kubernetes - From Code to Cluster
description: Part VII - Continuous deployment of containerized applications into Kubernetes.
cover: https://i.ibb.co/tT8ZWJyH/x.jpg
tags:
- argo cd
- kubernetes
- gitops
- devops
- ci/cd
categories:
- Kubernetes & Containers
---


### What is GitOps:

Gitops is a practice in devops where managing applications using git is considered as a single source of truth. This is generally used in the Kubernetes world.

This means we define our application for kubernetes using declarative objects in our git repo and no manul modifications are allowed to do in the k8s cluster.

### What’s ArgoCD:

ArgoCD is an open-source tool that implements gitops. It actively monitors changes in our repo and updates the application in k8s for any desired changes. We can also configure it to discard manual changes in our cluster.

In this experiment we’ll deploy a web application using argocd.

![Img src: argo docs](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KOURuI_LU4Pik7o8yacxjA.png)

**Tools and Technologies used:**

1.  Terraform
2.  Kubernetes (AKS)
3.  ArgoCD
4.  Azure VM
5.  Ansible
6.  Jenkins
7.  Docker

All the code and the configuration are available on [github](https://github.com/SagarCodeCtrl/ArgoMagic.git) repo.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xcFQXeWQ8VkUtgO5yZhU0A.png)

### Setup AKS Cluster using Terrafom:

To set up terraform, follow the below article. Now create a .tf file with the below configuration and apply it to create the aks cluster.

\`\`\`terraform
provider "azurerm" {
  features {}
}
resource "azurerm_resource_group" "k8s_rg" {
  name     = "k8s_rg"
  location = "Central India"
}
resource "azurerm_kubernetes_cluster" "aks_cluster" {
  name                = "argo_cluster"
  location            = azurerm_resource_group.k8s_rg.location
  resource_group_name = azurerm_resource_group.k8s_rg.name
  dns_prefix          = "argocluster"
  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v3"
  }
  identity {
    type = "SystemAssigned"
  }
  network_profile {
    network_plugin = "azure"
    network_policy = "calico"
  }
  tags = {
    environment = "argocd"
    managed_by  = "Terraform"
  }
}

\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NT6igBnMaKEimHrXIK49gw.png)

### Install ArgoCD on the cluster:

To install argocd, follow the official document.

Create a namespace first, and apply the argocd manifest.

\`\`\`bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
\`\`\`

> Pick **either** the LoadBalancer step **or** the port-forward step below — not both. LoadBalancer gives you a public IP; port-forward tunnels to localhost. Doing both is redundant.

Expose argo svc with LB:

\`\`\`bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
\`\`\`

> ⚠️ This exposes the ArgoCD UI/API to the public internet with a self-signed cert and the default admin password. Fine for a quick test, but tear it down (\`kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "ClusterIP"}}'\`) or lock it down afterward — don't leave it running like this.

forward argocd port to access directly

\`\`\`bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
\`\`\`

List the services in argocd namespace and browse the ip of the loadbalancer.
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZbLtaNIZ5PAvtRJmTT3HRQ.png)

Note : If you get any security warnings, just click proceed anyway. This error is because we forwarded the agro port to 443 port (HTTPS ) but we haven’t used any TLS certificate.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SUayPZlTzHssR6GsySODQA.png)

The username is admin. To get the initial pw, run the following command:

\`\`\`bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

\`\`\`

### Creating Application in ArgoCD:

To create an application we should point to our repository containing all the required manifests (deployment, services etc)

1.  After signing in, click the + New App button → Enter the name you want for the application name → select the default value for the project.

2. Choose sync policy

a. Manual — we have to sync the argo app manually to have the changes deployed

b. Auto — Argo syncs the project automatically in certain intervals to check if there are any changes to the manifests in the repo.

3. Enter your git repo url, keep the revision as HEAD. In the path filed, provide location of the manifests on the repo.

If the files are in the root directory or the repo, then enter just a dot.

4. In the destination, select the default service and then select the namespace.


Now click on the create button. In a few mins we’ll see the application like pods, service etc details in the argo app. We can also verify the same in the cluster as well.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*V49C5rDN5nd4wiWa3ZCD0A.png)

2 pods are created as per the replica configuration in the deployment.yml

### Our web app:

Browse the web application with the load balancer ip.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7DWepO6yXzxQ-ZWdmmBrAQ.png)

### Creating VM:

We’ll create a vm and install jenkins for build and push operations for docker images.

Apply the main.tf under VM directory.

### Setup Docker and Jenkins on the VM:

Since we’ll use Jenkins for docker build and push, lets install both of them using ansible.

**Install Jenkins:** Under the playbook directory, run the jenkins playbook first.

\`\`\`yaml
---
- name: Install Jenkins
  hosts: jenkins
  become: true
  gather_facts: false
  tasks:
    - name: Update apt package cache
      apt:
        update_cache: yes
    - name: Install Java
      apt:
        name: openjdk-11-jdk
        state: present
    - name: Add Jenkins repository key
      apt_key:
        url: https://pkg.jenkins.io/debian/jenkins.io.key
        state: present
    - name: Add Jenkins repository
      apt_repository:
        repo: "deb http://pkg.jenkins.io/debian-stable binary/"
        state: present
    - name: Install Jenkins
      apt:
        name: jenkins
        state: present
    - name: Start Jenkins service
      service:
        name: jenkins
        state: started
    - name: Print Jenkins initial admin password
      command: cat /var/lib/jenkins/secrets/initialAdminPassword
      register: jenkins_admin_password
      changed_when: false
      # Print the Jenkins admin password
    - name: Display Jenkins admin password
      debug:
        var: jenkins_admin_password.stdout_lines
\`\`\`

Once the playbook has run successfully we’ll get the initial pw.

Browse ip:8080 and continue the rest of the installation as per your need.

**Install Docker:** Now run the docker playbook. This installs docker and adds the jenkins user to the docker group, so we can run docker commands from jenkins without sudo.

\`\`\`yaml
---
- name: Install Docker and add Jenkins user to Docker group
  hosts: jenkins
  become: true  # Run tasks as sudo
  vars:
    ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
  tasks:
    - name: Update apt packages
      apt:
        update_cache: yes
      when: ansible_os_family == 'Debian'
    - name: Install required packages for Docker
      package:
        name: "{{ item }}"
        state: present
      loop:
        - apt-transport-https
        - ca-certificates
        - curl
        - software-properties-common
      when: ansible_os_family == 'Debian'
    - name: Add Docker GPG key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
      when: ansible_os_family == 'Debian'
    - name: Add Docker repository
      apt_repository:
        repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_lsb.codename }} stable"
      when: ansible_os_family == 'Debian'
    - name: Update apt packages
      apt:
        update_cache: yes
      when: ansible_os_family == 'Debian'
    - name: Install Docker
      apt:
        name: docker-ce
        state: present
      when: ansible_os_family == 'Debian'
    - name: Add user jenkins to docker group
      user:
        name: jenkins
        groups: docker
        append: yes
\`\`\`

### **Sync Changes:**

The initial replica count was set to 2. Update the replica count and sync the argo app, we’ll see the number of pods increase to 3.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LBUvZUy-WdeEibTEbBhCMg.png)

Now sync the argo app as I have set the sync policy to be manual.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*a_oyYyzf_T1csJYtmAHYsw.gif)

### Jenkins for docker image CI/CD :

The jenkins setup has been completed in eariler setup with docker installed.

Now we can build and push the docker images to any preferred repo. Also since this repo is being used for argo to sync the chnages, we need to update the image tag in deployment as we update the image in docker repo.

You’ll need docker login in the VM to be able to push image with jenkins.

\`\`\`groovy
 stage('Update Deployment File') {
        environment {
            GIT_REPO_NAME = "ArgoMagic"
            GIT_USER_NAME = "<your github/gitlab username>"
        }
        steps {
            withCredentials([string(credentialsId: 'git_creds', variable: 'GITHUB_TOKEN')]) {
                sh '''
                    git config user.email "$GIT_EMAIL"
                    git config user.name "Sagar"
                    BUILD_NUMBER=\${BUILD_NUMBER}
                    sed -i "s|image: sagarkp/fakeweb:.*|image: sagarkp/fakeweb:\${BUILD_NUMBER} |" deployment.yml
                    git add deployment.yml
                    git commit -m "Update deployment image to version \${BUILD_NUMBER}"
                    git push @github.com/\${GIT_USER_NAME}/\${GIT_REPO_NAME">https://\${GITHUB_TOKEN}@github.com/\${GIT_USER_NAME}/\${GIT_REPO_NAME} HEAD:master
                '''
            }
        }
    }
\`\`\`

Alright, so the flow goes like this, we do any changes in the app, jenkins triggers (either webhook or poll scm or manual) builds and pushes the image to docker hub with a tag of the build number.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NxlLNDKw1n_pV5wSb5BRRQ.png)
<br></br>
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IJ_Zi-RPjsnYNfV10WuMFw.png)

Jenkins then writes the deployment.yml with the build number as tag and pushes to the repo.

> _Note: In case you have set up webhook or scm poll for jenkins, then you have to ignore commits by jenkins, else jenkins triggers and pushes changes to repo and that again triggers jenkins build. This cycle keeps going._

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tJPFgFSxEH5enQ1LCrh4lw.png)

Now we need to sync argo app to update the changes in deployment.yml

Lets see that. The first app deployment has two footers, 1 of them is favicon: icons8.

Now when we remove the same footer, jenkins builds and pushes the docker image with build number 26, image tag updated to 26 in the deployment.yml.

![Image tag been updated to 26, commit by Jenkins](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0Hn6xC8Ax-nDvI5YnKrMVw.png)

To update our app with latest image pull, we sync the argo app again. Once the sync is completed, we’ll see the changes being reflected on our deployed and running application.

![Favicon footer has been removed](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*uKxP_LouPSm_q8j4WySuIg.png)

### The end:

There we have it, GitOps CD using Argo.

For further experiments

1.  Try installing argo with helm or ansible or with terraform while setting up the cluster.
2.  Create the application using yaml config instead of argo GUI. Also make argo discard any manual changes to the cluster.
3.  Include trivy scan for docker image
4.  Integrate sonarqube with jenkins for static analysis.

Thanks for reading.

<!-- [Read more on K8s →](/blogs/#kubernetes)
<br></br>
[Read more on CI/CD →](/blogs/#ci-cd) -->

References: [ArgoCD docs](https://argo-cd.readthedocs.io/en/stable/getting_started/), [Red Hat](https://www.redhat.com/en/blog/argocd-and-gitops-whats-next), [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-deploy-to-kubernetes-using-argo-cd-and-gitops)
`,__vite_glob_0_19=`---
date: '2024-01-22T19:26:10+05:30'
draft: false
title: 'Calico and Kubernetes: A Perfect Pair for Robust Network Policy'
description: Part VI — In K8s, a network policy defines how pods are allowed to communicate with each other.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UEgbzVzkRaUUnRhYEKaCqw.png
tags:
- cni
- kubernetes
- k8s
- networking
- calico
categories:
- Kubernetes & Containers
---

## Before we begin:

Make sure to have calico as the network provider for the k8s cluster.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PdBhhaPcVkDIv8x81u6FOQ.png)

### Introduction:

By default k8s allows all pods to communicate with each other in a cluster across namespaces.

But what if we want to restrict and implement rules to decide which pods are allowed to communicate to other pods.

Enter network policy. To implement these policies we have to use CNI plugins.

Not all the network plugins support this. There are few like calico, weave etc. In this demonstration we’ll be using Calico.

All the example yaml are available on this [Github](https://github.com/sagarkrp/KubernetesOrchestra) repo.

### Calico:

Calico is a Kubernetes Container Network Interface (CNI) plug-in which provides networking for containers and pods.

### Getting Started:

I have a cluster with default namespace and other builtin namespaces and will set up a different namespace later. (Calico has a separate ns of itself).

First lets create 3 pods to test the communication among pods. Get the ips of pods with -o wide

\`\`\`bash
labputer [ ~ ]$ kctl run web --image=nginx -l app=web
pod/web created

labputer[ ~ ]$ kctl run db --image=nginx -l app=db
pod/db created
labputer [ ~ ]$ kctl run test --image=nginx -l app=test
pod/test created
labputer [ ~ ]$ kctl get pods -o wide
NAME   READY   STATUS    RESTARTS   AGE   IP            NODE                          NOMINATED NODE   READINESS GATES
db     1/1     Running   0          41s   10.244.0.19   aks-np1-49452408-vmss000000   <none>           <none>
test   1/1     Running   0          29s   10.244.0.20   aks-np1-49452408-vmss000000   <none>           <none>
web    1/1     Running   0          53s   10.244.0.18   aks-np1-49452408-vmss000000   <none>           <none>
\`\`\`

Now enter one pod and will ping another pod. For example I will enter the web pod and ping the db pod. And then will ping the db pod from the test pod.

DB pod ip here: 10.244.0.19

You may need to install ping, based on the images being used.

\`\`\`bash
apt update && apt install iputils-ping
labputer [ ~ ]$ kctl exec -it web -- bash
root@web:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
64 bytes from 10.244.0.19: icmp_seq=1 ttl=63 time=0.291 ms
64 bytes from 10.244.0.19: icmp_seq=2 ttl=63 time=0.108 ms
64 bytes from 10.244.0.19: icmp_seq=3 ttl=63 time=0.090 ms
^C
--- 10.244.0.19 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2053ms
rtt min/avg/max/mdev = 0.090/0.163/0.291/0.090 ms
root@web:/#
------------------------
labputer [ ~ ]$ kctl exec -it test -- bash
root@test:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
64 bytes from 10.244.0.19: icmp_seq=1 ttl=63 time=0.186 ms
64 bytes from 10.244.0.19: icmp_seq=2 ttl=63 time=0.069 ms
64 bytes from 10.244.0.19: icmp_seq=3 ttl=63 time=0.103 ms
^C
--- 10.244.0.19 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2051ms
rtt min/avg/max/mdev = 0.069/0.119/0.186/0.049 ms
root@test:/#
\`\`\`

So as we can see here, we can ping all the pods from each other meaning communication is allowed.

### Allow only a specific pod :

Suppose we want the db pod to allow incoming requests from only the web pod, then we create a network policy defining the ingress rules for the db pod.

Apply the below yaml:

\`\`\`yml
# netpol.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
 name: dbpolicy
spec:
 podSelector:
  matchLabels:
   app: db
 policyTypes:
 - Ingress
 ingress:
 - from:
   - podSelector:
      matchLabels:
       app: web
\`\`\`

Apply the policy and test the connection again.

\`\`\`bash
kctl create -f netpol.yml
networkpolicy.networking.k8s.io/dbpolicy created
--------------------
test --> db #does not work
labputer [ ~ ]$ kctl exec -it test -- bash
root@test:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
^C
--- 10.244.0.19 ping statistics ---
59 packets transmitted, 0 received, 100% packet loss, time 59400m
---------------------
web --> db #works
labputer [ ~ ]$ kctl exec -it web -- bash
root@web:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
64 bytes from 10.244.0.19: icmp_seq=1 ttl=63 time=0.296 ms
64 bytes from 10.244.0.19: icmp_seq=2 ttl=63 time=0.085 ms
64 bytes from 10.244.0.19: icmp_seq=3 ttl=63 time=0.135 ms
^C
--- 10.244.0.19 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2047ms
rtt min/avg/max/mdev = 0.085/0.172/0.296/0.090 ms
root@web:/#
\`\`\`

Now delete the netpol and we shall the connection being allowed again.

\`\`\`bash
labputer [ ~ ]$ kctl get netpol
NAME       POD-SELECTOR   AGE
dbpolicy   app=db         4m29s
-----------------
labputer [ ~ ]$ kctl delete netpol dbpolicy
networkpolicy.networking.k8s.io "dbpolicy" deleted
labputer [ ~ ]$ kctl exec -it test -- bash
root@test:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
64 bytes from 10.244.0.19: icmp_seq=1 ttl=63 time=0.136 ms
64 bytes from 10.244.0.19: icmp_seq=2 ttl=63 time=0.078 ms
^C
--- 10.244.0.19 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1020ms
rtt min/avg/max/mdev = 0.078/0.107/0.136/0.029 ms
root@test:/#
\`\`\`

### Allow only one specific port:

Say we have mysql running in db pod, and we want only requests coming at port 3306 to be received.

\`\`\`yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
 name: dbportpolicy
spec:
 podSelector:
  matchLabels:
   app: db
 policyTypes:
 - Ingress
 ingress:
 - from:
   - podSelector:
      matchLabels: {} #this means all
   ports:
     - protocol: TCP
       port: 3306
\`\`\`

### Deny all communication:

\`\`\`yml
denypol.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
 name: deny-pol
spec:
 podSelector:
  matchLabels: {}
 policyTypes:
 - Ingress
\`\`\`

Since we don’t mention anything explicitly all the communication will be blacked.

\`\`\`bash
labputer [ ~ ]$ kctl apply -f denypol.yml
networkpolicy.networking.k8s.io/deny-pol created
# ping db from web
labputer [ ~ ]$ kctl exec -it web -- bash
root@web:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
^C
--- 10.244.0.19 ping statistics ---
6 packets transmitted, 0 received, 100% packet loss, time 5110ms
#ping test from we
root@web:/# ping 10.244.0.20
PING 10.244.0.20 (10.244.0.20) 56(84) bytes of data.
^C
--- 10.244.0.20 ping statistics ---
6 packets transmitted, 0 received, 100% packet loss, time 5122ms
root@web:/#
\`\`\`

This policy applies to all the existing pods and new pods, so all the communications on the future pods are also blacked.

Lets say even with this deny policy we want to allow the db pod to have incoming req allowed from only the web. Apply the netpol.yml from earlier step.

\`\`\`bash
labputer [ ~ ]$ kctl get netpol
NAME       POD-SELECTOR   AGE
dbpolicy   app=db         3s
deny-pol   <none>         93s
labputer [ ~ ]$ kctl exec -it web -- bash
root@web:/# ping 10.244.0.19
PING 10.244.0.19 (10.244.0.19) 56(84) bytes of data.
64 bytes from 10.244.0.19: icmp_seq=1 ttl=63 time=0.130 ms
64 bytes from 10.244.0.19: icmp_seq=2 ttl=63 time=0.075 ms
64 bytes from 10.244.0.19: icmp_seq=3 ttl=63 time=0.066 ms
^C
--- 10.244.0.19 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2048ms
rtt min/avg/max/mdev = 0.066/0.090/0.130/0.028 ms
-----------------
can;t ping any other pods:
root@web:/# ping 10.244.0.20
PING 10.244.0.20 (10.244.0.20) 56(84) bytes of data.
^C
--- 10.244.0.20 ping statistics ---
4 packets transmitted, 0 received, 100% packet loss, time 3060ms
\`\`\`

Now web → db works but the rest are blocked. This policy overrides the deny policy only for the web →db communication.

Delete all the policies.

\`\`\`bash
labputer [ ~ ]$ kctl delete netpol dbpolicy deny-pol
networkpolicy.networking.k8s.io "dbpolicy" deleted
networkpolicy.networking.k8s.io "deny-pol" deleted
\`\`\`

### Policies based on Namespaces:

Allow communications only in a single namespace and black requests from other namespaces.

Now we are using default namespace. will create one more called apache. . Create pods in the 2nd ns and test connections.

\`\`\`bash
labputer [ ~ ]$ kctl get ns --show-labels
NAME              STATUS   AGE   LABELS
calico-system     Active   97m   addonmanager.kubernetes .....
default           Active   97m   kubernetes.io/metadata.name=default
.....
-----------------------
labputer [ ~ ]$ kctl create ns apache
# ceate apod in apache ns
kctl run apachenspod --image=nginx -l app=second -n apache
kctl run apachenspod2 --image=nginx -l app=third -n apache
labputer [ ~ ]$ kctl get pods -n apache
NAME           READY   STATUS    RESTARTS   AGE
apachenspod    1/1     Running   0          2m28s
apachenspod2   1/1     Running   0          30s
\`\`\`

Will have a netpol to allow communications only in default namespace. Now all the incoming reqs from apache is blocked.

\`\`\`yml
#namespace1pol.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
 name: ns-policy
spec:
 podSelector:
  matchLabels: {}
 policyTypes:
 - Ingress
 ingress:
 - from:
   - namespaceSelector:
      matchLabels:
       kubernetes.io/metadata.name: default
\`\`\`

Pings in the default ns, outgoing allowed to apache ns pods as well.

\`\`\`bash
# ping web --> test wokrs
labputer [ ~ ]$ kctl exec -it web -- bash
root@web:/# ping 10.244.0.20
PING 10.244.0.20 (10.244.0.20) 56(84) bytes of data.
64 bytes from 10.244.0.20: icmp_seq=1 ttl=63 time=0.132 ms
64 bytes from 10.244.0.20: icmp_seq=2 ttl=63 time=0.084 ms
^C
--- 10.244.0.20 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1029ms
rtt min/avg/max/mdev = 0.084/0.108/0.132/0.024 ms
root@web:/#
# ping pods in apache ns
kctl exec -it web -- bash
root@web:/# ping 10.244.0.23 # apachepod1
PING 10.244.0.23 (10.244.0.23) 56(84) bytes of data.
64 bytes from 10.244.0.23: icmp_seq=1 ttl=63 time=0.169 ms
64 bytes from 10.244.0.23: icmp_seq=2 ttl=63 time=0.082 ms
^C
--- 10.244.0.23 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1032ms
rtt min/avg/max/mdev = 0.082/0.125/0.169/0.043 ms
\`\`\`

Enetr the pods in apache ns and ping pods in default ns.

\`\`\`bash
labputer [ ~ ]$ kctl -n apache  exec -it apachenspod -- bash
labputer [ ~ ]$ kctl -n apache  exec -it apachenspod -- bash
root@apachenspod:/# ping 10.244.0.18
PING 10.244.0.18 (10.244.0.18) 56(84) bytes of data.
^C
--- 10.244.0.18 ping statistics ---
4 packets transmitted, 0 received, 100% packet loss, time 3075ms
root@apachenspod:/#
\`\`\`

### Allow communications from a specific ns:

To allow a specific pod in apache ns (or all the pods in another ns) to communicate with default ns apply the below policy in default ns.

\`\`\`yml
# cross-ns.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
 name: apache-def-np
spec:
 podSelector:
  matchLabels: {}
 policyTypes:
 - Ingress
 ingress:
 - from:
   - namespaceSelector:
      matchLabels:
       kubernetes.io/metadata.name: apache
\`\`\`

Now to test, enter a pod in apache ns and ping pod in default ns. It works.

\`\`\`bash
labputer [ ~ ]$ kctl apply -f cross-ns.yml
networkpolicy.networking.k8s.io/apache-def-np created
labputer [ ~ ]$ kctl -n apache  exec -it apachenspod -- bash
root@apachenspod:/# ping 10.244.0.18
PING 10.244.0.18 (10.244.0.18) 56(84) bytes of data.
64 bytes from 10.244.0.18: icmp_seq=1 ttl=63 time=0.124 ms
64 bytes from 10.244.0.18: icmp_seq=2 ttl=63 time=0.180 ms
64 bytes from 10.244.0.18: icmp_seq=3 ttl=63 time=0.112 ms
^C
--- 10.244.0.18 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2038ms
rtt min/avg/max/mdev = 0.112/0.138/0.180/0.029 ms
root@apachenspod:/#
\`\`\`

All the above examples we saw are for incoming requests, similarly we can define outgoing reqs with egress.

\`\`\`yml
- Egress
  egress:
 -to:
   -podSelector:
     matchLabels:
      <label>
\`\`\`

So that’s all for this one. Thanks for reading!

Reference: [Calico](https://www.tigera.io/project-calico/)

<!-- [Checkout more articles on K8s →](/blogs/#kubernetes) -->`,__vite_glob_0_20=`---
date: '2023-06-24T19:26:10+05:30'
draft: false
title: Delving into the World of Deployments in Kubernetes
description: Part IV— Deployment using YAML, Strategies and Rollback.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6QedAYWDv2AtCstjHta8Dg.png
tags:
- kubernetes
- k8s
- devops
categories:
- Kubernetes & Containers
---

In the [previous]({{< relref "k8s-intro" >}}) article, we saw ReplicaSet, Services and touched base on deployment. In this article, we will explore deployments in more detail.

As we already created deployments using the cmd line, here we’ll use yaml. We’ll combine replicaset and service config with the deployment config.

> <small> Note: kctl is an shell alias for kubectl </small>

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: mywebapp
 annotations:
  kubernetes.io/change-cause: "initial deployment"
spec:
 replicas: 3
 selector:
  matchLabels:
   app: data
 template:
  metadata:
   labels:
    app: data
  spec:
   containers:
   - name: prodapp
     image: quay.io/gauravkumar9130/production:v1
\`\`\`

Apply the deployment and expose the service with the load balancer type. (using the cmd line, for now, will merge later).

\`\`\`bash
kctl expose deployment mywebapp --target-port=80 --port=80 --type=LoadBalancer
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*VHu3nl4jWm0ouo9FPsYhiA.png)

We have 3 replicas here and since we have public ip, we can see our app with load balancing among 3 pods.

Note the version of the application here.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*I5qR82MoXxf71ZXySTd47w.gif)

Kubectl rollout history lets us see the history of deployments and since we have defined change cause in our config, we can see that getting listed in history.

Let's see the ways to update our deployment. Remember that version 1 above, will now set version 2 of the image. We can do this by using the command line, but it's better and recommended to modify the yml and reapply.

\`\`\`yaml
metadata:
 name: mywebapp
 annotations:
  kubernetes.io/change-cause: "updated to v2"
---------------------------------
containers:
   - name: prodapp
     image: quay.io/gauravkumar9130/production:v2
\`\`\`

There are 2 more ways to update the deployment:

*   using command line “kubectl set image deployment”
*   using kubectl edit

\`\`\`bash
1> kubectl set image deployment/<dep name> <containername>=<imagename>  --record
2> kctl edit deployment/<dep name>
\`\`\`

Ok, now apply the config.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WoM_ElfoRclqAOQdh9mqvg.png)

Browsing our application, we can see the v2 appearing.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KrkBrzxarSYS-ga5QKXriw.gif)

I have updated the application 2 more times and now it's set to V4.

\`\`\`bash
$kctl rollout history deployment/mywebapp
deployment.apps/mywebapp
REVISION  CHANGE-CAUSE
1         initial deployment
2         updated to v2
3         updated to v3
4         updated to v4
\`\`\`

## Rollback

We can also undo deployment to roll back to the previous version of our application in case of any requirements.

Rollout undo goes back to the previous version of the deployment by default. If we want, we can also set the version by providing the revision number.

\`\`\`bash
$ kctl rollout undo deployment/mywebapp
deployment.apps/mywebapp rolled back
$ kctl rollout history deployment/mywebapp
deployment.apps/mywebapp
REVISION  CHANGE-CAUSE
1         initial deployment
2         updated to v2
4         updated to v4
5         updated to v3
$ kctl rollout undo deployment/mywebapp --to-revision 1
deployment.apps/mywebapp rolled back
$ kctl rollout history deployment/mywebapp
deployment.apps/mywebapp
REVISION  CHANGE-CAUSE
2         updated to v2
4         updated to v4
5         updated to v3
6         initial deployment
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gqSYtL3vxA3TGRzQ0M3I0Q.png)

## Deployment Strategies:

A Deployment strategy defines how to create, upgrade, or downgrade different versions of our applications in k8s.

There are different strategies such as rolling update, blue-green, recreate and canary.

### Blue-green deployment:

In this type of deployment, our existing app is considered blue and the new app is considered green.

We deploy the new app while the old app is also still running, however, we don't point the service to the new app. We do all the testing with the new app and once we see everything is fine, we can redirect service to the new app. Now all the users accessing the app will see the updated app. We can delete the old deployment now.

\`\`\`yaml
# blue.yml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: myapp
spec:
 selector:
  matchLabels:
   app: old
 replicas: 3
 template:
  metadata:
   labels:
    app: old
  spec:
   containers:
   - name: prod-app
     image: quay.io/gauravkumar9130/production:v1
-------------
#blue-green-svc.yml
apiVersion: v1
kind: Service
metadata:
 name: mysvc
spec:
 type: LoadBalancer
 ports:
 - targetPort: 80
   port: 80
 selector:
  app: old
\`\`\`

Now create the deployment and service.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*I-QWPv_7NTz56g6VpgVnqg.png)

We have our v1 running fine.

At this point, our v2 of the application is ready and is deployed with another yml (green.yml).

\`\`\`yml
#green.yml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: myapp-v2
spec:
 selector:
  matchLabels:
   app: new
 replicas: 3
 template:
  metadata:
   labels:
    app: new
  spec:
   containers:
   - name: prod-app
     image: quay.io/gauravkumar9130/production:v2
\`\`\`

Apply this deployment, and our pods are created but we’ll still see the v1 of the application in our browser. This is because the service is still mapped to the previous deployment.

Let's update it to serve the green deployment now. To do so we just need to change the selector at the end to “new” and apply it.

\`\`\`yml
# blue-green-svc.yml
selector:
  app: new
\`\`\`

Now refresh the webpage and we shall see v2. So essentially we updated our application without any downtime. We can now delete the blue.yml deployment.

![captionless image](https://miro.medium.com/v2/resize:fit:1274/format:webp/1*a44h2rC4ooLp84hN9J-1VA.png)

### Canary deployment:

In this strategy, we use a progressive delivery approach, with one version of the application serving most users, and another, newer version serving a small pool of test users. The test deployment will be rolled out to more users after verifying everything.

Example: Will create a deployment(old) with v1 of the application and with 5 replicas. When v2 is ready, we’ll scale down the deployment (old) to 3 and create another deployment with the v2 image and 1 replica.

The service will not be changed, but it will load balance the 4 replicas.

\`\`\`yml
# new.yml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: myapp-old
spec:
 selector:
  matchLabels:
   app: myapp
 replicas: 4
 template:
  metadata:
   labels:
    app: myapp
  spec:
   containers:
   - name: prod
     image: quay.io/gauravkumar9130/production:v1
---------
# canary-svc.yml
apiVersion: v1
kind: Service
metadata:
 name: my-can-svc
spec:
 type: LoadBalancer
 ports:
 - targetPort: 80
   port: 80
 selector:
  app: myapp
\`\`\`

And apply. both the config. Now we can see v1 of the app in the browser.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*t3p67vTNm4QC2LiAQTHiOQ.png)

Now to scale down this deployment and apply the new v2 app.

\`\`\`yml
# new2.yml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: myapp-new
spec:
 selector:
  matchLabels:
   app: myapp
 replicas: 1
 template:
  metadata:
   labels:
    app: myapp
  spec:
   containers:
   - name: prod
     image: quay.io/gauravkumar9130/production:v2
\`\`\`

We don't need to change anything in the service config.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DDpXEgRqlcEOuSt_vUZX1g.png)

Apply the new config. Now we have 3 pods from the old app and 1 from new one.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*oesAyPz63ZU3kImETmxzKg.png)

Try browsing the app.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UhwyhRr8NSuiZhPvwRLhgw.gif)

### Rolling Update:

The Deployment updates Pods in a rolling update fashion when we set the .spec.strategy.type==RollingUpdate. We can specify how the updates are carried out with \`maxUnavailable\` and \`maxSurge.\`For example, if we have 4 replicas, and we want to have 25% to be new, then the pods will go one by one.

\`\`\`yml
# rolling-update.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 4
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24
        ports:
        - containerPort: 80
\`\`\`

Apply the config. Check pods and replicaset. Now we’ll update the deployment with #nginx:1.25 and will check the pod’s status. Will see new pods getting generated one by one. We will be able to differentiate the pods based on replicaset name.

\`\`\`bash
kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-6f974d74b7   0         0         0       15m # from first deployment
nginx-deployment-7dfcb6c494   0         0         0       13m # the first update
nginx-deployment-fc7586d97    4         4         4       10m # after 2nd update
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pCyv3IPWIaKoUKigx7uwBQ.png)

### Recreate:

This strategy removes all existing pods in the existing ReplicaSet first then creates new pods in the new ReplicaSet.

\`\`\`yml
 spec:
  replicas: 3
  strategy:
    type: Recreate
\`\`\`

This is a wrap of deployments in K8s. Thanks for reading.

<!-- [Checkout more articles on K8s →](/blogs/#kubernetes) -->`,__vite_glob_0_21=`---
date: '2024-05-01T19:26:10+05:30'
draft: false
title: Helm — Your Compass in the Kubernetes Universe
description: Part XI - Getting started with Helm, the package manager for Kubernetes for easy application management.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Nx1uEfCb2u81ST0RPMB8mg.jpeg
tags:
- helm
- kubernetes
- k8s
- devops
categories:
- Kubernetes & Containers
---

### What is Helm:

Helm, the package manager for k8s similar to package manager for linux such as apt (Debian/Ubuntu based) yum/dnf (Red Hat or Fedora family of linux) , which helps us with packaging and deploying application.

Deploying an application with multiple manifests is overwhelmingly time consuming to write the yml manifests and is also error prone.

So instead of reinventing the wheel, we can reuse some common application which are already written and made available for example Prometheus, Grafana, Argo CD and etc.

Many such popular applications are already packaged and hosted in repositories such as Artifact Hub.

[artifacthub.io](https://artifacthub.io/?source=post_page-----424f48f239d3---------------------------------------)


You can find also find official charts for these apps. You can serch for apps thru the CLI or via the web UI.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vr-yPoFv2CzPWeojo1wMNw.png)

I prefer searching on the web UI.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lYQUeNY68RY9RHkn4DK7Vw.png)

### Installation:

Follow the official doc for installation on various platforms.

I’m using the azure cloud shell, where it’s pre installed.

_Note: Helm v2 and v3 have different architecture. While v2 used client server arch, v3 has just the client (the CLI)._

_The server component of v2 is called Tiller._

### Terminologies:

**_Chart_**: A bundle of yaml configs same as Deployment or service etc which are necessary for the application setup. A chart also contains template structure so we can provide our own values while applying the chart.

Basically a package in helm is called a Chart.

**_Release:_** A running instance of a helm chart as an application is called a helm release. Using release is how we can manage the deployment, rollback etc.

### **Using helm:**

Lets install Prometheus, which has many components such as deployments, daemon set, replicaset etc.

Get the official chart for Prometheus. You can also find the cmds to use.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*U2W_OoFci7rGaDO2GqaJAQ.png)

To add a repository, use helm repo add. Then update the repo.

\`\`\`bash
$ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
$ helm repo update
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HarnGUhrlgQmlB_o5-Hw-w.png)

To install a particular app use helm install.

\`\`\`bash
$ helm install prom-prod prometheus-community/prometheus --version 25.20.0
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Dhs2g6qIzABPI26N8rEkvw.png)

Use helm status release-name to view the above info again incase you need it later.

It also gives you the commands to use port forward, so you can access the prom UI from a web browser. But I m gonna use LoadBalnacer service for this purpose in another article.


You can list the the releases by using helm list or helm ls.

\`\`\`bash
helm ls --all-namespaces
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*itrGESTJciNIZAKZ_g9-Qg.png)

To view all the resources created from this, use the generic kubectl get cmd.

\`\`\`bash
kubectl get all
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yUe6u2CgAzP9XEs9R8QJVg.png)

Lets install another instance of Prometheus in a different namespace.

First create a namespace. Then helm install.

\`\`\`bash
$ kctl create ns 2ndns
$ helm install prom-2 prometheus-community/prometheus --version 25.20.0 -n 2ndns
\`\`\`

And there we have it. Another prom installation.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3mgrvDT88x8VhQIZ1ljBfw.png)

List all the Prometheus releases. Keep an eye on the revisions and and the chart versions as we’ll experiment with them.

\`\`\`bash
sagar [ ~ ]$ helm ls --all-namespaces
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
prom-2          2ndns           1               2024-04-21 09:13:35.404985363 +0000 UTC deployed        prometheus-25.20.0      v2.51.2
prom-prod       default         1               2024-04-21 08:48:39.139940706 +0000 UTC deployed        prometheus-25.20.0      v2.51.2
sagar [ ~ ]$
\`\`\`

### Operations:

The other operations apart for installation are uninstalling, updating to different versions or rollback to previous releases.

**Uninstall**:

To remove a release use helm uninstall release-name. Additionally use the flag _— —keep-history_, so we can rollback if we want to.

\`\`\`bash
helm uninstall prom-2 -n 2ndns --keep-history
\`\`\`

Listing the releases now will now show the 2nd release which was prom-2, however we can still see its status with -a flag. The status is uninstalled as expected.

\`\`\`bash
helm ls --all-namespaces
helm ls --all-namespaces -a
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*M05Uhw_8XPkCojMy8vPmAg.png)

**Update:**

Consider there is a new version that I want to change. the version of prom-pord to another version.

\`\`\`bash
sagar [ ~ ]$ helm upgrade prom-prod prometheus-community/prometheus --version 25.18.0
Release "prom-prod" has been upgraded. Happy Helming!
NAME: prom-prod
LAST DEPLOYED: Sun Apr 21 09:32:17 2024
NAMESPACE: default
STATUS: deployed
REVISION: 3
-------------------------------
sagar [ ~ ]$ helm ls --all-namespaces
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
prom-prod       default         3               2024-04-21 09:32:17.689890009 +0000 UTC deployed        prometheus-25.18.0      v2.51.0
\`\`\`

**Rollback**:

To rollback to a particular release use helm rollback and the revision number. Specify ns if other than default.

To find out all the revisions, use helm history release name.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bRiFHwRhP5Uyl8fucY0ddQ.png)

We can also bring back the prom instance that was uninstalled.

\`\`\`bash
sagar [ ~ ]$ helm rollback prom-2 1 -n 2ndns
Rollback was a success! Happy Helming!
sagar [ ~ ]$ helm ls --all-namespaces
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
prom-2          2ndns           2               2024-04-21 09:39:38.609116581 +0000 UTC deployed        prometheus-25.20.0      v2.51.2
prom-prod       default         4               2024-04-21 09:38:22.868612462 +0000 UTC deployed        prometheus-25.20.0      v2.51.2
sagar [ ~ ]$ helm ls --all-namespaces -a
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
prom-2          2ndns           2               2024-04-21 09:39:38.609116581 +0000 UTC deployed        prometheus-25.20.0      v2.51.2
prom-prod       default         4               2024-04-21 09:38:22.868612462 +0000 UTC deployed        prometheus-25.20.0      v2.51.2
\`\`\`

List the history of the 2nd release.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bwtAm4TmnzikGDOBHIOr2w.png)

### Wrap up:

And there we have it, all the basics of Helm. Hope you found it useful. Explore further more on how to create your own helm charts, the folder structure, ways to override the values to customize the templates. Happy Helming!

![Img src: helm.sh](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IeU1wgJuI2ApzGmDrbr7vA.gif)

<!-- [Read more on K8s →](/blogs/#kubernetes) -->`,__vite_glob_0_22=`---
date: '2023-06-22T19:26:10+05:30'
draft: false
title: 'Container Orchestration: Kubernetes 101'
description: Part I — Intro, Components and Architecture
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NoGlXoElqYHzO15bqlEErQ.png
tags:
- kubernetes
- k8s
- devops
categories:
- Kubernetes & Containers
---

## Introduction:

[Kubernetes](https://kubernetes.io/docs/concepts/overview/), also known as K8s, is an open-source platform to automate deployment, scaling, and management of containerized applications or containers.

Containers are lightweight packages of an application including all the dependencies.

Docker is one such platform for creating containerised applications. Read more about getting started with docker here: [Dcoker - Containers for beginners]({{< relref "docker-setup" >}})

While we are able to conatinerize apps with docker, managing a large number of such applications becomes a hassle. Kubernetes provides a framework to manage these apps at a higer scale in an automated fashion.

## Features of Kubernetes:

1.  **Container orchestration:** K8s automates the deployment and management of containers across a cluster of machines. It handles tasks such as container scheduling, scaling, load balancing, and rolling updates.
2.  **Service discovery and load balancing:** K8s provides a built-in service discovery mechanism that allows containers to find and communicate with each other. It also offers load balancing capabilities to distribute incoming traffic across multiple instances of an application.
3.  **Scaling and self-healing:** K8s enables automatic scaling of application instances based on CPU usage, memory utilization, or custom metrics. It can also automatically restart containers that have failed, ensuring high availability of applications.
4.  **Configuration management:** K8s allows you to define and manage application configurations using declarative manifests. You can specify the desired state of your application, and Kubernetes will work to ensure that the actual state matches the desired state.
5.  **Storage orchestration:** K8s provides a way to manage persistent storage volumes and attach them to containers as needed. This allows applications to store and retrieve data even when containers are rescheduled or restarted.
6.  **Health monitoring and logging:** K8s offers tools for monitoring the health and performance of applications running in the cluster. It integrates with various logging and monitoring systems to collect and analyze container and application metrics.

## Some common terminologies in k8s:

**Pod**: A pod is smallest deployable unit in k8s. Its basically one or multiple applications inside a container.

**Node**: A machine in K8s is called as node.

**Cluster**: A collection of nodes as a logical layer is known as cluster.

**Deployment**: is a resource object that allows you to declaratively define and manage a set of identical pods. It provides a convenient way to manage the lifecycle of your applications running in the cluster.

**Service**: A kubernetes service provides ip to pods so they can communicate. Also it provides load balancing mechanism to handle requests.

**Replicaset**: It is a higher-level abstraction that ensures a specified number of identical pod replicas are running at all times. It is responsible for maintaining the desired state of a set of pods in a cluster.

**Kubectl**: Its a command line utility used to interact with k8s cluster.

## Architecture of K8s:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qAQrOQaO9Sjl3h6_BH7pdQ.png)

Kubernetes primarily consists of two types of nodes.

*   **Master Node** — 1 or more machine that manages the cluster.

This provides way to communicate to the user and takes care authentication and authorization.

*   **Worker Node** — Worker nodes are machine where our application(s) is/are deployed.

Worker nodes communicate with the master nodes to receive instructions and report the status of containers running on them.

### Components of Master Node:

**Api Server:**

The Kubernetes API is the front end of the Kubernetes control plane,
handling internal and external requests. The API server determines if a
request is valid, if it is then processes it.

**etcd**:

Configuration data and information about the state of the cluster lives
in etcd, a key-value store (db). Fault-tolerant and distributed, etcd
is designed to be the ultimate source of truth about the cluster.

**Controller Manager:**

Controllers take care of actually running the cluster, and contains several controller function. It consults the scheduler and makes sure the correct number of pods is running. If a pod goes down, controller
notices and responds. A controller connects services to pods, so requests go to the right endpoints.

**Scheduler:**

The scheduler considers the resource needs of a pod, such as CPU or
memory, along with the health of the cluster. Then it schedules the pod
to an appropriate compute node.

### Components of Worker Node:

**Kubelet**: is a component of the Kubernetes cluster architecture. It is responsible for managing and maintaining individual nodes (or worker nodes) within the cluster. Each node in a Kubernetes cluster runs a Kubelet process, which interacts with the control plane to ensure that containers are running and healthy on the node.

All the activities instructed from master node are passed to the worker node and executed via the kubelet.

**Container Runtime:** A container runtime is responsible for running and managing containers on a host machine. It provides an environment where containers can be created, started, stopped, and managed.

Examples are Docker, cri-o, containerd and etc.

**Kubeproxy:** It runs on each worker node and is responsible for network proxying and load balancing within the cluster.

\`\`\`md
                    +-----------------------+
                    |      Master Node      |
                    +-----------------------+
                    |                       |
                    |   +----------------+  |
                    |   |   API Server   |  |
                    |   +----------------+  |
                    |            |          |
                    |            |          |
                    |   +----------------+  |
                    |   |      etcd      |  |
                    |   +----------------+  |
                    |            |          |
                    |            |          |
                    |   +----------------+  |
                    |   | Controller Mgr |  |
                    |   +----------------+  |
                    |            |          |
                    |            |          |
                    |   +----------------+  |
                    |   |    Scheduler   |  |
                    |   +----------------+  |
                    +-----------------------+
                                 |
                                 |
                    +-------------------------+
                    |                         |
              +------------+            +------------+
              | Worker Node|            | Worker Node|
              +------------+            +------------+
              |   Kubelet  |            |   Kubelet  |
              |  Container |            |  Container |
              |   Runtime  |            |   Runtime  |
              | kube-proxy |            | kube-proxy |
              +------------+            +------------+
\`\`\`

To create a kubernetes cluster we need atleast 2 machines, one for master and 1 for worker. For development purpose, Minikube is a tool using which we can create a single machine cluster.

However self managed k8s cluster can be hard to manage in long run. So we can use managed services like AWS EKS or Azure AKS and many more.

In the next post, we’ll discuss how to create a managed cluster on AKS.

<!-- [**Checkout more artciles on K8s →**](/blogs/#kubernetes) -->`,__vite_glob_0_23=`---
date: '2024-06-10T19:26:10+05:30'
draft: false
title: Monitoring Kubernetes Cluster with Prometheus and Grafana
description: Part XIII — Helm setup to Monitor your k8s infra using Prometheus and Grafana.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3KFSsDiBc2tqs8HhPJmTJA.png
tags:
- kubernetes
- monitoring
- devops
- prometheus
- grafana
- o11y
categories:
- Kubernetes & Containers
---

## Introduction:

Keeping an eye on your Kubernetes cluster can feel like a daunting task, but with the right tools, it doesn’t have to be. Prometheus and Grafana – two fantastic open-source tools that make monitoring and visualizing your cluster easy.

Lets look into how you can use Prometheus and Grafana to keep tabs on your Kubernetes cluster. Lets look into how you can set up, the basics of configuring them.

## Setup suing helm:

Will be using helm to install both these tools to avoid writing multiple yamls for various components.

Get familiar with helm, checkout this artcle → [Helm — Your Compass in the Kubernetes Universe]({{< relref "helm" >}})

Lets roll.

First add Prometheus to the repo and update the helm repository.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HVZN7OzBxTvDo3PsI8-v-g.png)

Install Prometheus with the command below.

\`\`\`
helm install prometheus prometheus-community/prometheus
\`\`\`

We can use **_kubectl get all_** command to list all the resources and see all the pods, svcs and deployment belongings to prom.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SYCGHtRns-uRxlVjmLGmAA.png)

To access the prom web ui, expose the service named “Prometheus-server”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jEVBXRdGH_2TEfwrGt-e4A.png)

With the newly exposed service we have an external/public IP which we can use to get the prom web ui.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*M8VP5cQWzlWQqEWDNZpPgQ.png)

In the Status → targets, we see all the endpoints where Prometheus is getting the metrics from.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l3H5l1G4wSGUysR3OCpivA.png)

### Install Grafana:

Similarly how we did for prom, we add the grafana repo and update it.

\`\`\`
 helm repo add grafana https://grafana.github.io/helm-charts
 helm repo update

 helm install grafana grafana/grafana
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*rMRh0YuIKkiMNmhKazIejw.png)

Expose grafana service to be able to access the web interface.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*X7IuA_RY2lryzcGbqVBBng.png)

The default username is **admin**, and to get the password, use kubectl get secret command.

\`\`\`
kctl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FrohJphSab8z2QMgKRWHpw.png)

You can change the password if you want after login.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*woTIgICCDkblofgvtEWPKQ.png)

Click on Data sources and select Prometheus, fill out the connection details. Click save and test the connection.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6grT1OSfGDSpHJbmFOQJVQ.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Bkf5KHxWN-ElgTkpYjwofg.png)

Now I will create a dashboard. You can create your own or import existing dashboards from grafana. For this example, I’m going to import a few.

From the Prometheus home page, click on Dashboards, choose import and use 315 or similar.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ujf41dBLY-XlM1kAXir_9Q.png)

Once it’s added, we should be able to view the data.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aFJhHxV4pb7j8g02T8MhCQ.png)

### Kube-state matrics:

**Kube state metrics** service provides many metrics for \`deployments\`, \`pods\`, \`jobs\`, \`cronjobs\` etc. which is not available by default.The service has been created however we need to expose it and change Prometheus config.

\`\`\`
kctl expose service prometheus-kube-state-metrics --type=NodePort --target-port=8080 --name=prom-kstate-ext
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bFGBqNJ6nvxvjAA-JuEg2Q.png)

Add the metrics end point as a scrape config job in the Prometheus config.

![captionless image](https://miro.medium.com/v2/resize:fit:1356/format:webp/1*Dea8QU5VrByZwBlhsjVRBA.png)

You can add even more dashboards for different metrics. Example: 6417 for pod metrics

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xWuMTkoAABZvlaapMwYX1w.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pCWTFKgfnspND_3hVMexTg.png)

## Wrap Up:

There we have it. Monitoring K8s with prom and grafana. Next experiment is to configure alert manager for email alerts.

<!-- [**Checkout more artciles on K8s →**](/blogs/#kubernetes) -->`,__vite_glob_0_24=`---
date: '2024-11-11T19:26:10+05:30'
draft: false
title: Kubernetes Health Checks with Probes
description: Part XIV — Learn how Kubernetes Readiness, Liveness, and Startup probes keep your applications healthy and resilient
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nbqglR7NZ7k96PykFRClQw.png
tags:
- kubernetes
- probes
- k8s
categories:
- Kubernetes & Containers
---

### What are probes

The word **“probe”** in a general sense means a **detailed investigation** or **inspection** to gather information or check the condition of something. It’s often used in contexts where you’re trying to assess the status or health of something.

A **probe** in Kubernetes is a way to check the health of a container running in a pod. It helps Kubernetes determine whether the container is functioning properly, ready to handle requests, or needs to be restarted. There are three main types of probes.

### Types of Probes in Kubernetes

Kubernetes supports three types of probes each serving a different purpose.

### 1. Liveness Probe

*   **Purpose**: Ensures that the container is still running and healthy.
*   **How it works**: Kubernetes periodically checks if the container is still alive. If the probe fails, Kubernetes will **restart the container** to recover from potential issues.
*   **When to use**: Use a Liveness Probe for containers that can get stuck or experience issues like deadlocks or memory leaks, requiring automatic restarts to restore their functionality.

**Example Use Case**: If you’re running a microservice that occasionally crashes or becomes unresponsive, a liveness probe will ensure that the container is restarted automatically to maintain availability.

### 2. Readiness Probe

*   **Purpose**: Ensures that the container is ready to accept traffic.
*   **How it works**: Kubernetes checks if the container is in a **_ready_** state. If the readiness probe fails, Kubernetes will **stop sending traffic** to the container until the probe passes again.
*   **When to use**: Use a Readiness Probe for containers that need some time to initialize, load data, or establish connections before they can handle traffic.

**Example Use Case**: If you’re running a web server that needs to load configuration files or connect to a database before it can serve requests, a readiness probe ensures that traffic isn’t routed to it before it’s truly ready.

![Image Credit : mobilabsolutions.com](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N8eu__mQnfLN4Zi-YZFtCQ.jpeg)

### 3. Startup Probe

A startup probe verifies whether the application within a container is started. This can be used to adopt liveness checks on slow starting containers, avoiding them getting killed by the kubelet before they are up and running.

If this probe is configured, it disables liveness and readiness checks until it succeeds.

This type of probe is only executed at startup, unlike liveness and readiness probes, which are run periodically.

*   **How it works**: Kubernetes checks if the container has started correctly. If it fails, Kubernetes will **restart the container**. This probe is useful when containers take longer to start.
*   **When to use**: Use a Startup Probe for containers that require significant initialization time or those with complex startup processes.

**Example Use Case**: If you have a database service that takes several minutes to initialize and be ready for use, a startup probe ensures that Kubernetes doesn’t prematurely consider it unhealthy or attempt to restart it before it has fully started.

### How to Configure Probes in Kubernetes

Configuring probes in Kubernetes requires defining the probe type in your pod’s configuration file (usually a YAML file). Each probe can be configured with different parameters that control how and when it runs:

### Key Probe Parameters
We can probes the contianers in differnet ways such as

*   \`**httpGet**\`: make an HTTP request to check the container’s health (e.g. - http://localhost:8080/healthz)
*   \`**tcpSocket**\`: makes a TCP connection to the container's port to check if it’s accepting connections.
*   \`**exec**\`: Executes a command inside the container to check its health.

\`\`\`yml
livenessProbe:
      exec:
        command:
        - cat
        - /tmp/healthy
\`\`\`

### Common Settings

*   \`**initialDelaySeconds**\`: The amount of time to wait before performing the first probe check. This is useful for allowing the container to start up before probes are run.
*   \`**periodSeconds**\`: How often to perform the probe check.
*   \`**timeoutSeconds**\`: The time to wait for the probe to succeed before considering it a failure.
*   \`**failureThreshold**\`: The number of consecutive failures before Kubernetes takes action (e.g., restarting the container).

> _Note: The default restart policy in k8s is “Always”. if you set to Never, the kubelet wont restart pods on failure._

### Demo time

Lets see the demo. This is a python app, with 2 endpoints /health and /readyz which we’ll be calling to check the probes status. The app is running on port 8080.

Check the [github repo](https://github.com/sagarkpanda/Kubernetes_Labs/tree/main/probes) for the full app and relevant config.

\`\`\`python
@app.route('/healthz')
def health():
    return "Healthy", 200
# Readiness check endpoint for readiness probe
@app.route('/readyz')
def ready():
    # Assume the app is "ready" only if it has been running for more than 10 seconds
    if time.time() - app_start_time > 10:
        return "Ready", 200
    else:
        return "Not ready", 503
\`\`\`

And the manifest has been configured with the probes to check the status.
Check the github repo for the full config.

\`\`\`yml
        # Liveness Probe: Checks /healthz every 5 seconds
        # after an initial delay of 5 seconds
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 5
        # Readiness Probe: Checks /readyz every 5 seconds
        # after an initial delay of 10 seconds
        readinessProbe:
          httpGet:
            path: /readyz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 5
        # Startup Probe: Waits for /healthz to become available within 10 checks (50 seconds total)
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 10
\`\`\`

Apply and lets monitor.

Alright, so it runs fine and there are no restarts for now.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PNH08OWDwuizGPb-OoW4-A.png)
<br></br>

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xlQNwCtGRdjT230P7WwJwQ.png)

Will change the liveness check endpoint and have disabled the other probes.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xCi963cwlim3fq-nK8lurw.png)

And now the liveness probe should fail. Describe the pod to see the details.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Bf0X1dNOyydw3xkJu4oZuw.png)

As expected the liveness probe has failed as it tried to call /health but that that does not exist. The pod is getting restarted multiple times and it enters crashloopbackoff.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DRFih4Z5-jDMFhkmNRMQxA.png)

To test readiness probe.

First keep the correct end point (/readyz) and everything should work fine.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*irPZHV-BtTJpo7dCYcVZ2w.png)

Update the path to a wrong value.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*009fAntva5c09f9pytbi0w.png)

Now the containers status says running but the number is 0/1. Describe the pod and we see readiness probe has failed. Unlike liveness probe, kubelet won’t restart the pod but it will be removed from the service

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kqarxSViftpRITstQZ-gHg.png)

And that's why we don’t have any endpoint (k8s ep). Traffic wont be served until the probe is fine.

The same way startup probe, update the probe call path to a wrong value and the pod status will be 0/1.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*EQV2lIKkSfncOcE7YCePUg.png)

Describe and we see the status. here also we don't get ep for the service. Here I m using the same path as liveness, you can use your own if you have defined anything else.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*F7T-GUNrLIhRDX0yCWJh4w.png)

When used in combination with liveness and readiness probe, these two probes will not be used unless startup probe has passed.

### Conclusion

Kubernetes probes are crucial for maintaining healthy and reliable applications. By using **Liveness**, **Readiness**, and **Startup** probes, we can ensure that our app containers are running properly, ready to handle traffic, and given enough time to start up.

<!-- **Read More on K8s:**

[Read more on K8s →](/blogs/#kubernetes) -->

**References**: [K8s Docs](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/), [Pod Restart policy](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*24ShuRyaypkHoK17.png)`,__vite_glob_0_25=`---
date: '2024-04-07T19:26:10+05:30'
draft: false
title: Ingress in K8s - Name based Routing with TLS
description: Part IX - Using Domain name with TLS Cert for Nginx Ingress Controller.
cover: https://miro.medium.com/v2/resize:fit:1356/format:webp/1*yecPvYFABn0s-xmGCJLLbA.png
tags:
- nginx
- tls
- kubernetes
- ingress
- devops
categories:
- Kubernetes & Containers
---

### Preface:

In the [**_previous article_**]({{< relref "nginx-ingress" >}}) we saw how to use nginx ingress for routing. Today we will experiment with adding domain to our app and will also use TLS cert for the domain.

### Getting started:

A valid domain is required for this experiment.

If you have domain outside of azure, then add the name server from azure.

Create dns zone. Change the name server in the providers dns management section to be able to manage dns records from azure itself.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LSQoCbUyTeIr2gy6v7Fcmw.png)

Now create a managed identity(You can use even service principals).

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tf-rxPBFlirmb-yZbaBZVA.png)

Assign contributor role to the identity.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*uXRkZj7_Lx1Dwvnqzloskw.png)

Add any external dns. Update the json with azure ac details.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9tZBTzeoHKo3ylEM412-4w.png)

Add the identity to vm scale set.


Create secret based on the azure.json and apply the external dns yaml. The yaml uses this secret.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YT8HKJpuMIa0VLGdufDLxw.png)

And apply the external dns.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IQS8uL8x_FF0qgspsHXt0A.png)

Now apply the ingress resource.

\`\`\`bash
kctl apply -f named_ingress.yml
\`\`\`
\`\`\`yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
 name: host-ingress
 annotations:
  kubernetes.io/ingress.class: nginx
spec:
 ingressClassName: nginx
 rules:
 - host: hotel.sagarpanda.com
   http:
    paths:
    - path: /
      pathType: Exact
      backend:
       service:
         name: hotel
         port:
          number: 80

 - host: coffee.sagarpanda.com
   http:
    paths:
    - path: /
      pathType: Exact
      backend:
       service:
         name: coffee
         port:
          number: 80

\`\`\`

Once we do that, we can see dns records getting created automatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s8ggDaJJ-32m0anNpuvWsw.png)
<br> </br>
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6x_tbHvh0jQftD3Ll4Zlfg.png)

get ip of the ingress and browse.

\`\`\`bash
kctl get ingress
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZZbzHAMDy-B04JGsE96ooA.png)

There we go. Our ingress is working fine and routing works fine.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DpCKJ_1WVxWjfGisIr1mbg.png)

Adding TLS:
-----------

Now that our app is set and working fine, lets add ssl certificate.

Note: Here I’m using lets encrypt cert.
First we need to install the cert manager.

\`\`\`bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.yaml
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x12aUNAfiEFDJEGtlUY-zw.png)

Create a certIssuer with cert provider details.

\`\`\`yml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  #use valid mail or it wont work
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
\`\`\`

Get the secret created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3K7BLGZfT9mY05FY_WetTw.png)

Update the ingress with the TLS details.

\`\`\`yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: host-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  rules:
  - host: hotel.sagarpanda.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hotel
            port:
              number: 80
  - host: coffee.sagarpanda.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: coffee
            port:
              number: 80
  tls:
  - hosts:
    - hotel.sagarpanda.com
    - coffee.sagarpanda.com
    secretName: sagarpanda-tls-secret-lqblm
\`\`\`

And finally, we have TLS cert.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s7JHH7zRY2lStGt_ciLzDA.png)

View the cert details and validity.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N5dwWnFvLYKmwkvouC76Xg.png)

Noice 😁

There you go. Our app running on k8s with nginx ingress using our own domain.

<!-- [Read more on K8s →](/blogs/#kubernetes) -->
`,__vite_glob_0_26=`---
date: '2024-04-01T19:26:10+05:30'
draft: false
title: Getting Started with Ingress In Kubernetes
description: Nginx Ingress setup in kubernetes
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HdEt8m8cjh5ANwSkYL6P4A.png
tags:
- ingress
- nginx
- kubernetes
categories:
- Kubernetes & Containers
---


### Introduction:

In Kubernetes, “Ingress” is an API object that manages external access to services within a cluster.

It acts as a layer above the services, providing routing rules and load balancing for HTTP and HTTPS traffic. Essentially, it allows you to define how external traffic should be directed to services based on rules you set up, such as hostnames, paths, or other HTTP headers.


Ingress typically works in conjunction with Ingress Controllers, which are responsible for actually implementing the routing rules.

There are multiple vendors implementing ingress api and nginx is one such.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*8602-Gw2pMOApRTZ.png)

### Getting started:

First create deployments of your app.

\`\`\`bash
kctl create deployment appname --image=<name>
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FKAD4dtPPmxJpncJxRalGw.png)

Expose the deployments with just cluster ip, as we are going to manage external traffic with ingress

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZTa9Vvnlt7b5f25u5Y5O9A.png)

Note that these are only cluster IPs and can’t be accessed outside of the cluster.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aYT70x9lUe3GjtorY2GoWg.png)

### Install Nginx ingress controller:

To create a Nginx controller, clone the official repo and apply the manifest.

[GitHub - kubernetes/ingress-nginx](https://github.com/kubernetes/ingress-nginx?source=post_page-----8a452fb66d62---------------------------------------)


The location of the manifest deploy/static/provider/cloud.

This creates a namespace called “Ingress- nginx”

\`\`\`bash
kctl apply -f deploy.yml
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FICA1XdjF_qGvaBk9Qpk0g.png)

Get nginx ip and browse.

\`\`\`
kctl get svc -n ingress-nginx
\`\`\`

As of now it’s just the nginx, no application is served here so we’ll see a 404 response.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JGg9A4FGp2LAH36UAyQIig.png)

Now create an ingress resource which points the controller to the services.

\`\`\`yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
 name: myapp-ingress
 annotations:
  kubernetes.io/ingress.class: nginx
spec:
 ingressClassName: nginx
 rules:
 - http:
    paths:
    - path: /
      pathType: Prefix
      backend:
       service:
         name: hotel
         port:
          number: 80
    - path: /tea
      pathType: Prefix
      backend:
       service:
         name: tea
         port:
          number: 80
    - path: /coffee
      pathType: Prefix
      backend:
       service:
         name: coffee
         port:
          number: 80
\`\`\`

Here we define the ingress class name as nginx.

Apply and browse the ip of the ingress controller.

\`\`\`bash
sagar [ ~ ]$ kctl apply -f ingress.yml
ingress.networking.k8s.io/myapp-ingress created
sagar [ ~ ]$
\`\`\`

And we can see our app being served.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HkDkQtzZBbG_RMHmtvD8pA.png)

### Prefix vs Exact path types:

A **prefix** path type will always route to the destination even if the url doesn’t exist. For example ip/tea and ip/teaxyz will still make tea app to load.

**Exact** path type loads only when the path matches the url otherwise return a 404 page.

\`\`\`yml
    - path: /tea
      pathType: Exact
      backend:
       service:
         name: tea
         port:
          number: 80
\`\`\`

**With prefix**:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pcGQlilpRuphlC9qhaPENA.png)

**with exact:**

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DBVqT4-xgVNuas87VVrfMw.png)

### **Up Next**:

Here we used IP based routing. In [**_the next article_**]({{< relref "nginx-ingress-tls" >}}) we’ll experiment with host name based routing. We’ll also use TLS certificate on the domain name with ingress.

**Read More on K8s:**

<!-- [Read more on K8s →](/blogs/#kubernetes) -->`,__vite_glob_0_27=`---
date: '2024-05-20T19:26:10+05:30'
draft: false
title: Kubernetes Security — Role Based Access Control (RBAC)
description: Part XII — User Management in K8s with RBAC using Entra ID aka Azure Active Directory.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JPtYpwRPmc1fOMMLPgiCAQ.png
tags:
- kubernetes
- k8s
- devops
- rbac
categories:
- Kubernetes & Containers
---

## Introduction

Role-Based Access Control (RBAC) is a method used in computer security to manage access to resources within a system.

RBAC in k8s is based on the principle. There are various terminologies such as users, service account, role, role binding and etc.

RBAC policies can be assigned to define access for users or human users in k8s and also for users in the services such as pods using service accounts. While user accounts are global, service ac (sa) are limited to the namespace they are created.

When we create any namespace a default sa is created without any permission. If we don’t mention a service ac while creating a resource, the default sa ac is assigned to it.

\`\`\`
kctl get sa
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*vtwTTDPf3N7RdgmE.png)

Lets first focus on user management.

_Note: When we connect to the cluster using the two commands from the connect button, a file is created under our home dir with <username>/.kube/config which has user information and lets us communicate with the api server._

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*RbIiZ-pndXCg45g7.png)

_Similarly the master node also has the certificates stored under /etc/kubernetes/pki which we can’t access in managed cluster._

We can’t create users in our clusters. It is managed by third party identity providers such as MS AD, okta, O auth, AWS IAM and etc.

In this experiment as the cluster is on azure, we can use AD without much hassle.

## Manage users with AD

Search for Active directory (now Entra ID) and go to users.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*bEnpzEbl4_d5q19t.png)

To create a new user, click on the new add user and fill out the details. Copy the password if you select auto generate pw. This is a temp pw will be used for the first login and you’ll update it.

_Note: It shows my domain as I have added it here. In case you dont have any custom domain, you will see user@email.onmicrosoft.com_

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*I2TrOwIsCFIMgoCV.png)

Similarly you can create a group and add multiple users. All the users in a group will have the same permissions.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*R_LCKZlPXy1Y5vna.png)

Here kubeuser is the group and I have added user1 that was created earlier.

## Associate AD with cluster

Now that we have users and group setup, lets assign the Azure AD to our cluster so it can provide authentication for our cluster.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*joNgWti3gJ3VC95I.png)

You can also select this AD association process while creating the cluster.

While adding the AD to the cluster, choose a group. The users in this group have full access.

We can now test the new user logon and test RBAC with AAD.
I have 2 users, “**user1**” and “**user2**” apart from the default user. Only **user1** is part of the group “**kubeuser**”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*fXMcSgng45YAlCO1.png)

Now as the users login to the aks cluster, it asks to login to auth via a web sign in with an OTP.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*TzneOJoK3-HtZ0nO.png)

User1 can access all pods because its part of the the kubeuser group, which has admin access, however user2 can not.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*x_qUMenitllnfy96.png)

Command to check if the user has certain permissions.


get, list, create etc are called verbs, basically a particular access.

\`\`\`bash
kctl auth can-i <verb> <resourece type>
kubectl auth can-i get pods --as <username> # check for other user
\`\`\`

## Role and RoleBinding

**Role** is a set of permissions definitions and **Rolebinding** is the process of assigning the role to a user.

In this example, User2 can’t access anything, but we want to provide access to it to list resources.

To create role and assign permission to the user2, login with user1 and create role and role binding.

\`\`\`bash
kubectl create role example-role --verb=get,list,watch --resource=pods --namespace=default
kubectl create rolebinding example-role-binding --role=example-role --group=group1@example.com --namespace=default
\`\`\`

or use yaml.

\`\`\`yaml
#role.yml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: readrole
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
--------------------------------------------
#rolebind.yml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: demorole-binding
  namespace: default
subjects:
- kind: User # set to Groups for role assigning toa group
  name: "user2@sagarpanda.com"  # Replace with your Azure AD user email
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: readrole
  apiGroup: rbac.authorization.k8s.io
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9eAgPw3R51gTy8pT.png)

The user2 should now be able to list pods and services.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*zpz2mxr_gbxyhoS6.png)

user2 unable to list nodes even if you assign it.

_Note: Don’t get confused with the shell user as I m using the same shell to login all users. I delete the .kube/config and do the set and get again. Generally when different users use their own ac, they don’t need to do this.._

Role and RoleBindings are namespace specific, so even with all the permissions to a user, the user can’t list nodes, pvc etc as they are global.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*7RofSrlVt0ae2VEB.png)

User1 able to see node

To know which resources are global, we can use the below command.

\`\`\`bash
kctl api-resources --namespaced=true # to list namespace spefic resources
# similarly =false for global resources
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*OK8-iY5fIUwQ66jr.png)

## Cluster Role and Cluster Role Binding

They have the same purpose except the difference being, the permission are not limited to a namespace.

Note: There are a few default clusterroles.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*XtQpPy1Y_ksnLG2z.png)

Skipping this as this is same as doing above.

\`\`\`bash
> To create clusterrole:
kubectl create clusterrole <clusterrolename> --verb=get,list --resource=pods

> To create clusterrolebinding for user:
kubectl create clusterrolebinding <name> --clusterrole=<clusterrolename> --user=<username>

> To create clusterrolebinding for sa:
kubectl create clusterrolebinding <name> --clusterrole=<clusterrolename> --serviceaccount=<nsname>:<saname>

>To give admin access:
kubectl create clusterrolebinding <name> --clusterrole=cluster-admin --user=<username>
\`\`\`

That’s all for today. Thanks for reading.

References: [Sysdig](https://sysdig.com/learn-cloud-native/kubernetes-security/kubernetes-rbac/)

<!-- [Checkout more articles on K8s →](/blogs/#kubernetes) -->`,__vite_glob_0_28=`---
date: '2026-04-07T10:30:10+05:30'
draft: false
title: Kubernetes StatefulSets Explained - When and Why to Use Them
description: 'Part XV: Understanding Stable Pod Identity, Headless Services, and Persistent Storage in StatefulSets'
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jhtaeySqKrPpqKg8p3WRqA.png
tags:
- kubernetes
- statefulset
- pv
- pvc
categories:
- Kubernetes & Containers
url: /blogs/k8s/statefulset/
aliases:
- /blogs/statefulset/
---


### What is StatefulSet

StatefulSets are used to manage stateful applications, such as databases or other applications that keep track of their state. By using StatefulSets, a set of pods can be deployed and scaled, ensuring that they are ordered and unique.

### Why use StatefulSet

Since ips are random, we have hostname as a stable way to connect to pods. However, when we deploy any app, the service generally have hostname like this and since pod names are also generated with random characters it would become difficult to track them.

\`\`\`ini
podname.svcname.namespace.svc.cluster.local
\`\`\`

In such case when we use statefultset, we would get stable pod name and from which we can identify the sequene of pods created.

Example: For MySQL, if we want to create the first pod as master pod and the next ones as read replicas, we can make mysql-0 pod as master.

### Pod Identity and Ordering

StatefulSet pods have a unique ordinal index (0, 1, 2…). This provides:

*   **Ordered Startup:** Pods start from **0 to N-1**. \`web-1\` will not start until \`web-0\` is "Running and Ready."
*   **Ordered Termination:** When scaling down, pods are deleted in reverse (N-1 down to 0) to ensure data is safely offloaded from “workers” before “masters.”

\`\`\`yml
#sf.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
 name: web
spec:
 template:
  metadata:
   labels:
    app: web
  spec:
   containers:
   - name: web
     image: quay.io/gauravkumar9130/nginxdemo
 replicas: 3
 selector:
  matchLabels:
   app: web
 serviceName: sfsvc
\`\`\`

Once we apply we can list the pods and we shall notice sequential pod creation.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LFV98-_fFgOftlNHhXI9Wg.png)

**Test Query:** The DNS entry remains the same even if a pod is deleted. Even if the IP changes, we don’t need to worry. Say we connect our frontend app to the DB in read-mode; it always connects to the specific pod index we want (e.g., \`web-1\`).

![captionless image](https://miro.medium.com/v2/format:webp/1*FiXvygFGrPPTMZuucHOlbA.png)

If we scale up and down, the change are also going to be sequential.

![captionless image](https://miro.medium.com/v2/resize:fit:1188/format:webp/1*P5t0wzIZaGMpxyZ8_1qe8g.png)

### Headless Service

Headless service is a regular Kubernetes service where the **spec.clusterIP** is explicitly set to “None” and **spec.type** is set to “ClusterIP”. Instead, SRV records are created for all the named ports of service’s endpoints.

**DNS Format:** \`podname.svcname.namespace.svc.cluster.local\`

\`\`\`yml
apiVersion: v1
kind: Service
metadata:
 name: <HEAD LESS SERVICE NAME this needs to be
matched with the svc name in sf>
spec:
 ports:
 - port: 80
 selector:
  app: web
 clusterIP: None
\`\`\`

Apply it, and list all the services, we can see clusterIP set to None for headless service.

![captionless image](https://miro.medium.com/v2/resize:fit:1218/format:webp/1*Xh-8509zrREO7TBkfYsnjA.png)

### Using VolumeClaimTemplates

StatefulSets uses \`volumeClaimTemplates\` to provide **dedicated storage** to each pod. In a Deployment, all pods share the same volume; in a StatefulSet, each pod gets its own.

1.  **Sticky Storage:** If \`web-0\` is deleted, the new \`web-0\` will automatically re-attach to the same Persistent Volume.
2.  **Safety:** PVCs are not deleted when a StatefulSet is deleted, preventing accidental data loss.

### Taking an existing storage class

There are several storage classes in azure, to view them list all the sorage classes.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xiL8phtTJ6dabIQp6uj5lQ.png)

As we can see there are multiple with different binding mode. lets take managed as it waits for the storage to be claimed first before creating the volumes.

\`\`\`yml
#sf_vol.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
 name: myweb-statefulset
spec:
 serviceName: myweb-hsvc
 replicas: 5
 selector:
  matchLabels:
   app: web
 template:
  metadata:
   labels:
    app: web
  spec:
   containers:
   - name: web
     image: quay.io/gauravkumar9130/nginxdemo
     volumeMounts:
     - mountPath: /mydata
       name: data-volume
 volumeClaimTemplates:
 - metadata:
    name: data-volume
   spec:
    storageClassName: managed
    accessModes:
     - ReadWriteOnce
    resources:
     requests:
       storage: 500Mi
\`\`\`

Apply the config and list all the pods and PVCs. You will see that each pod index now has a corresponding volume claim that persists through pod restarts.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vccghxbBnH85me9yibZijw.png)

### Summary

StatefulSets are the key to running databases and other state-heavy applications on Kubernetes. By providing each pod with a **unique ID**, a **stable hostname**, and its own **dedicated storage**, we ensure that our data stays safe and our cluster remains predictable even during restarts or scaling.

<!-- [Read more on K8s →](/blogs/#kubernetes) -->`,__vite_glob_0_29=`---
date: '2026-03-18T19:26:10+05:30'
draft: false
title: Kafka - The Calm Brain in the Middle of Chaotic Microservices.
description: Microservices are loud. Kafka makes them finally think together
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FtTi1Yxel568GbnO7l0_0Q.png
tags:
- kafka
- microservices
- mq
categories:
- Data Streaming
- Message Queue
---


### 💡 What it is:

At its core, **Kafka is like a high-speed, super-durable logbook** for a company.

*   **What:** Kafka is a _distributed event streaming platform_. Think of it as a central nervous system for data. It takes in massive amounts of data (events) from many sources in real-time and makes that data available to many destinations
*   **Why:** Its main superpowers are **speed** and **reliability**. It's built to handle a massive volume of messages (like millions per second) very quickly. It's also "fault-tolerant," meaning if one part of the system fails, no data is lost, and the system keeps running.
*   **How it works:** It uses a "publish-subscribe" model.

1.  **Producers** (like a microservice for Order in a e-com app) _write_ events into Kafka.
2.  **Kafka** stores these events in an ordered log (like a notebook) for as long as you want (e.g., one day, one year, or forever).
3.  **Consumers** (like a database, an analytics dashboard, or another app) _read_ the events from the log at their own pace. A single event can be read by many different consumers.

### 🔑 Key Components & Terms

*   **Event:** A single piece of data. This could be anything: an order, a website click, a financial transaction, a temperature reading, etc.
*   **Producer:** An application that _writes_ (publishes) events to Kafka.
*   **Consumer:** An application that _reads_ (subscribes to) events from Kafka.
*   **Broker:** A single Kafka server. Brokers are the heart of the system; they receive, store, and serve the data. A Kafka system is usually a **Cluster** (group) of multiple brokers working together for reliability and scale.
*   **Topic:** The category or "notebook" where events are stored. For example, you might have a\`orders\` topic, a \`payments\` topic, and an \`inventory_updates\` topic.
*   **Partition:** A topic is split into several logs called partitions. This is how Kafka achieves its high speed—it can read and write to multiple partitions at the same time (in parallel).
*   **Consumer Group:** A group of consumers working together to read from a topic. Kafka automatically balances the partitions among the consumers in a group so that each event is processed by only one consumer in that group.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aVVUQJl01_rFudUxO_ttSA.png)

### 🆚 Kafka vs. Other Messaging Systems

The main difference is between **Queues** (like RabbitMQ/SQS), which delete messages after a single worker processes them, and **Streams** (like Kafka/Kinesis), which keep a persistent log of events for many consumers to read. Pulsar is a hybrid that can do both.

Pulsar is kind of interesting topic to explore further.

### Zookeeper and KRaft:

*   Kafka historically required Apache ZooKeeper, an external distributed coordination service. ZooKeeper was responsible for all cluster metadata management, including electing the “controller” broker, tracking broker membership, and storing all configurations for topics etc
*   Kafka now (v 3.3 and above) operates using **KRaft** (Kafka Raft). This is a built-in consensus protocol where Kafka manages its own cluster metadata in an internal log.

### 🚀Setup:

We are going to setup Kafka using docker, and will have 2 python apps interacting with it.

To simply learning we are going to take e commerce app for example. One called Producer (Order microservice) another is Tracker to receive the order data (consumer).

In the docker-compose.yaml, we define image, the port and other configuration Kafka needs.

\`\`\`yml
services:
  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      # Enable KRaft mode
      KAFKA_KRAFT_MODE: 'true'
      # Unique ID for the cluster
      CLUSTER_ID: 'fMCL8kv1SWm87L_Md-I2hg'
      # Unique ID for this node
      KAFKA_NODE_ID: 1
      # Run as both broker and controller
      KAFKA_PROCESS_ROLES: broker,controller
      # List of voters (just this node)
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      # Replication for internal topics (the default is 3)
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      # Internal listeners
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093
      # External address for clients
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      # Name of the controller listener
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      # Log directory inside the container.
      KAFKA_LOG_DIRS: /var/lib/kafka/data
    volumes:
      - kafka_kraft:/var/lib/kafka/data
volumes:
  kafka_kraft:
\`\`\`

Run it with cmd “docker compose up -d” and we shall have kafka up and running. Check the status with “docker ps” or “docker ps -a”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mYtU1etSj2zj0s3NmAYt-Q.png)

Now lets setup our python apps. First install the python kafka library using which python apps will be able to connect to kafka. Use pip (windows) or pip3 for installation.

\`\`\`
pip3 install confluent-kafka
\`\`\`

📤 The Producer (\`producer.py\`):

Our first app is the Producer (representing our Order microservice). Its only job is to generate order data and securely send it into our Kafka cluster. Here is how the producer works:

— It imports the \`Producer\` and connects to your Kafka broker at \`localhost:9092\`.

— Creates two sample Python dictionaries, \`order1\` and \`order2\`, giving each a unique ID using \`uuid\`.

— Kafka only sends bytes, not Python objects. So, the script does two conversions:

> \`json.dumps(order1)\`: Converts the dictionary into a JSON string.
>
> \`.encode("utf-8")\`: Converts that string into bytes.

— The \`producer.produce()\` command sends the byte-formatted message to the \`orders\` topic. (As the topic “orders” does not exist, its created automatically at the initial run)

\`--> callback=delivery_report\`: This is the most important part. Sending a message is "asynchronous" (it sends and forgets). This line tells the producer, "When you get confirmation from Kafka, please call the \`delivery_report\` function."

— The \`delivery_report\` function then prints the ✅ success or ❌ failure message for that _specific_ message, along with its location (partition and offset).

\`--> producer.flush()\`:this tells our script to Stop and wait until that local buffer is empty and Kafka has confirmed it received everything.”

\`\`\`python
#producer.py
import json
import uuid
from confluent_kafka import Producer
producer_config = {
    "bootstrap.servers": "localhost:9092"
}
producer = Producer(producer_config)
def delivery_report(err, msg):
    if err:
        print(f"❌ Delivery failed: {err}")
    else:
        print(f"✅ Delivered {msg.value().decode('utf-8')}")
        print(f"✅ Delivered to {msg.topic()} : partition {msg.partition()} : at offset {msg.offset()}")
order1 = {
    "order_id": str(uuid.uuid4()),
    "user": "John Doe",
    "item": "Shoes",
    "quantity": 2
}
order2  = {
    "order_id": str(uuid.uuid4()),
    "user": "Jane Doe",
    "item": "Phone",
    "quantity": 1
}
value1 = json.dumps(order1).encode("utf-8")
value2 = json.dumps(order2).encode("utf-8")
producer.produce(
    topic="orders",
    value=value1,
    callback=delivery_report
)
producer.produce(
    topic="orders",
    value=value2,
    callback=delivery_report
)
producer.flush()
\`\`\`

🎧 The Consumer (\`consumer.py\`):

Now that our orders are sitting safely in Kafka, we need an application to read them. This is our consumer app.

Unlike the producer, which runs once and exits, our consumer needs to run continuously, always listening for new orders.

Here is how the consumer works:

*   **Connection & Grouping:** It connects to \`localhost:9092\` and joins a \`group.id\` called "order-tracker". Kafka uses this group ID to remember which messages this specific consumer has already read.
*   \`**auto.offset.reset: "earliest"**\`**:** This tells Kafka, "If I am a brand new consumer and don't have any saved bookmarks, start reading from the very first message in the topic."
*   \`**consumer.subscribe(["orders"])**\`: This tells the consumer which topic(s) to listen to.
*   \`**while True**\`**:** It runs an infinite loop. \`consumer.poll(1.0)\` asks Kafka for new messages, waiting up to 1 second. If nothing is there, it loops and asks again.
*   When a message arrives, it’s in raw bytes. \`msg.value().decode("utf-8")\` turns it back into a string, and \`json.loads()\`converts it back into a usable Python dictionary.
*   The \`try...except...finally\` block ensures that if you stop the script with Ctrl+C, it calls \`consumer.close().\`This gracefully closes kafka consumer app without the python error of KeyboardInerrupt

\`\`\`python
# consumer.py
import json
from confluent_kafka import Consumer
consumer_config = {
    "bootstrap.servers": "localhost:9092",
    "group.id": "order-tracker",
    "auto.offset.reset": "earliest"
}
consumer = Consumer(consumer_config)
consumer.subscribe(["orders"])
print("🟢 Consumer is running and subscribed to orders topic")
try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("❌ Error:", msg.error())
            continue
        value = msg.value().decode("utf-8")
        order = json.loads(value)
        print(f"📦 Received order: {order['quantity']} x {order['item']} from {order['user']}")
except KeyboardInterrupt:
    print("\\n🔴 Stopping consumer")
finally:
    consumer.close()
\`\`\`

### 🎬 Seeing it in Action

1.  Open a terminal and start your consumer app. This will keep running and wait for messages.
2.  Open a **second** terminal and run your producer app.

\`\`\`
python3 consumer.py
python3 producer.py
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9cT9e5Qvcdb9CQMZRMpMqg.png)

Now edit an order data or create another order and run the producer again. The new order will appear next in line in consumer.

### ⌨️️Kafka CLI:

You can also directly interact with kafka using its cli.

\`\`\`
> docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list
__consumer_offsets # this is an internal kafka topic
orders
To view all the messages.
> docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic orders --from-beginning
\`\`\`

### 🎉 Wrapping Up

And that’s it! We’ve successfully built a basic Kafka setup where a Python producer and consumer talk to each other in real-time. To take our Kafka skills to the next level, best next steps are exploring **Consumer Groups** to see how reading scales, or learning how **Partitions** work to handle more data!

_Source: TechWorld With Nana_`,__vite_glob_0_30=`---
date: '2026-07-28T10:45:10+05:30'
draft: false
title: "Hands-On Lab: Build Single Sign-On (SSO) with LDAP, Keycloak, Okta, OIDC & Grafana"
description: "A complete, from-scratch identity and access management project — a directory service, an open-source identity provider, a commercial identity provider, and a real application wired into both."
cover: https://i.ibb.co/RkxkbvN5/sso.png
tags:
- ldap
- keycloak
- okta
- sso
- IAM
categories:
- authentication and authorization
---

## Preface

The goal of this project is to understand how the major building blocks of modern identity and access management fit together rather than to compare products. The technologies chosen here are representative, not exclusive:

OpenLDAP provides a traditional enterprise directory.
Keycloak represents a self-hosted Identity Provider.
Okta represents a managed cloud Identity Provider.
Grafana acts as a real application consuming identity through OpenID Connect.

Most of these components are interchangeable. For example, Active Directory could replace OpenLDAP, Authentik or Microsoft Entra ID could replace Keycloak or Okta, and any OpenID Connect-enabled application could replace Grafana. The concepts—directory services, identity federation, authentication, token issuance, and authorization—remain the same.

## Project Overview

**Goal:** stand up a working identity and access management stack from first principles: a real LDAP directory, an open-source Identity Provider (Keycloak) federated from it, a commercial Identity Provider (Okta) running alongside it, and a real application (Grafana) authenticating through both — with group-based authorization determining what each user can actually do.

**Stack:**
- **Directory:** OpenLDAP + phpLDAPadmin (web UI)
- **Identity Provider (self-hosted):** Keycloak + Postgres
- **Identity Provider (commercial):** Okta
- **Application:** Grafana
- **Infrastructure:** 3× AWS EC2 (Ubuntu 22.04), a real domain, Caddy for automatic TLS

**Architecture:**

\`\`\`
ldap.yourdomain.com     →  EC2 #1  →  OpenLDAP (native slapd) + phpLDAPadmin (Docker)
auth.yourdomain.com     →  EC2 #2  →  Keycloak (Docker, production mode) + Postgres
grafana.yourdomain.com  →  EC2 #3  →  Grafana (Docker), OIDC via both Keycloak and Okta
\`\`\`

{{< figure
    src="https://i.ibb.co/5gLwRjSS/arch.png"
    alt="phpldapadmin"
    width="1000"
    height="600"
>}}

## The Vocabulary — Authentication, Authorization, and the Alphabet Soup

Before touching any tools, it's worth defining a few terms that are often used interchangeably but solve different problems.

### Authentication vs Authorization

There are two fundamental questions every application needs to answer:

- **Authentication** — *Who are you?*
  Proving your identity using something like a password, passkey, or biometric authentication.

- **Authorization** — *What are you allowed to do?*
  Determining what actions you're permitted to perform after your identity has been verified.

A concert analogy that has always stuck with me:

- **Showing your ticket at the entrance** → Authentication
- **The color of your wristband determining which areas you can enter** → Authorization


### The Building Blocks

| Technology | What it solves |
|------------|----------------|
| **Local users** | Every application manages its own usernames and passwords. Simple for one application, but difficult to scale. |
| **LDAP** | A centralized directory that stores users and groups so multiple applications can share the same identities. |
| **SSO (OIDC / SAML)** | Users authenticate once with a central Identity Provider, and applications trust the resulting identity instead of verifying passwords themselves. |
| **WebAuthn / Passkeys** | A modern authentication method that replaces passwords with cryptographic credentials protected by biometrics or security keys. |

Note: This guide focuses on OpenID Connect (OIDC) because it is the preferred protocol for modern web and cloud-native applications. While SAML 2.0 remains widely used in enterprise environments, its concepts are similar enough that covering both would add unnecessary duplication.

### LDAP Naming Vocabulary

LDAP uses a hierarchical naming structure that appears throughout this guide.

| Term | Description |
|------|-------------|
| **DN (Distinguished Name)** | The complete, unique path to an LDAP entry.<br>\`cn=john doe,ou=people,dc=lab,dc=local\` |
| **CN (Common Name)** | The name of an individual object, such as a user or group. |
| **DC (Domain Component)** | Components of the directory's domain name.<br>\`lab.local → dc=lab,dc=local\` |
| **OU (Organizational Unit)** | A logical container used to organize users, groups, and other objects. |
| **UID (User ID)** | Typically the user's login name. |


### Where Kerberos Fits

LDAP and Kerberos are frequently mentioned together, but they solve different problems.

- **LDAP** is a **directory service**. It stores information about users, groups, and other directory objects.
- **Kerberos** is an **authentication protocol**. It issues time-limited tickets that allow users to prove their identity without repeatedly transmitting passwords across the network.

**Active Directory combines both technologies**, which is why they're often confused. LDAP provides the directory, while Kerberos provides the authentication mechanism. They complement each other rather than compete with each other.

## Part 1: The Directory — OpenLDAP + a Modern Admin UI

### Install OpenLDAP as a native service

Run the directory as a proper OS-level service, not a container — this is core infrastructure meant to run continuously, and it's how most real organizations actually deploy it.

\`\`\`bash
sudo apt update
sudo apt install -y slapd ldap-utils
sudo dpkg-reconfigure slapd
\`\`\`

Enter a DNS domain name for the directory — for example \`lab.yourdomain.com\`. This becomes your **base DN**, the root of the entire directory tree: \`dc=lab,dc=yourdomain,dc=com\`. Treat this purely as an internal LDAP naming convention; it's never resolved over the internet, unlike the real subdomains that will point at your actual servers.

Verify the directory is alive:

\`\`\`bash
ldapsearch -x -b "dc=lab,dc=yourdomain,dc=com" -D "cn=admin,dc=lab,dc=yourdomain,dc=com" -W
\`\`\`
Look for \`result: 0 Success\`.

### Install a web GUI

OpenLDAP itself has no UI of any kind — \`slapd\` is purely a protocol daemon, the same way a database server has no built-in admin panel. Every LDAP GUI is a separate client application that connects to it.

Use the actively-maintained **\`phpldapadmin/phpldapadmin\`** image (a modern Laravel + FrankenPHP rewrite), not the old, abandoned \`osixia/phpldapadmin\` most tutorials reference. Connect it to the native \`slapd\` process via Docker's host-bridge networking:

\`\`\`yaml
services:
  phpldapadmin:
    image: phpldapadmin/phpldapadmin:latest
    environment:
      LDAP_HOST: "host.docker.internal"
      LDAP_USERNAME: "cn=admin,dc=lab,dc=yourdomain,dc=com"
      LDAP_PASSWORD: "your-admin-password"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - "127.0.0.1:8080:8080"
\`\`\`

\`host.docker.internal\` lets a container reach services on its host machine. On native Docker Engine (what EC2 runs, as opposed to Docker Desktop), this requires the explicit \`extra_hosts\` line shown above.

### Put Caddy in front for automatic TLS

\`\`\`
ldap.yourdomain.com {
    reverse_proxy 127.0.0.1:8080
}
\`\`\`

That's the entire TLS configuration needed. The moment Caddy sees a real domain name as a site address, it automatically requests a Let's Encrypt certificate, proves domain ownership, and renews the certificate forever in the background — no certbot, no manual cert file paths, no explicit \`:443\` block.


{{< figure
    src="https://i.ibb.co/0yBzXWyz/phpldap.png"
    alt="phpldapadmin"
    width="1000"
    height="600"
    title="phpldap admin web ui"
>}}


> A note on transport security: this setup runs plain ldap:// on port 389 between Keycloak and the LDAP server, encrypted only at the edges by Caddy's TLS on the web UI — the LDAP protocol itself is not encrypted. For a real production deployment, slapd should be configured for LDAPS (port 636) or StartTLS, so credentials and directory data are encrypted in transit between servers too, not just between the browser and the proxy. Keycloak's LDAP federation form has an "Enable StartTLS" toggle for exactly this purpose — left off here for simplicity, but worth enabling in any deployment beyond a lab.

### Bootstrap the first real user via CLI — don't try to log in as rootDN

**Never attempt to log into a web UI using the rootDN (\`cn=admin,...\`).** It's a credential defined directly in \`slapd\`'s own config, meant for backend write operations only — it is *not* a real, searchable entry inside the directory tree. Any web app whose login flow searches for a matching user (as most do) will find nothing and fail, no matter how correct the password is.

Create the first real user directly via LDIF instead:

\`\`\`ldif
dn: ou=people,dc=lab,dc=yourdomain,dc=com
objectClass: organizationalUnit
ou: people

dn: cn=john doe,ou=people,dc=lab,dc=yourdomain,dc=com
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: posixAccount
cn: john doe
sn: doe
uid: jdoe
userPassword: your-password
mail: jdoe@lab.yourdomain.com
uidNumber: 10000
gidNumber: 10000
homeDirectory: /home/jdoe
loginShell: /bin/bash
\`\`\`

\`\`\`bash
ldapadd -x -D "cn=admin,dc=lab,dc=yourdomain,dc=com" -W -f create-jdoe.ldif
\`\`\`

Include \`posixAccount\` from the start. Most LDAP-aware web apps require this specific objectClass and search by the \`uid\` attribute to find a matching login — build the correct schema in from the beginning rather than patching it in after a failed login.

### Grant write access to a real admin user

OpenLDAP's default ACLs grant only the rootDN write access — every regular user, including the one just created, gets **read-only** by default:
\`\`\`
olcAccess: {2}to * by * read
\`\`\`

Grant \`jdoe\` explicit write access by modifying this ACL against the config backend, using the local-only \`ldapi:///\` socket with \`EXTERNAL\` SASL auth (reachable only via \`sudo\` on the machine itself):

\`\`\`ldif
dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcAccess
olcAccess: {0}to attrs=userPassword by self write by anonymous auth by * none
olcAccess: {1}to attrs=shadowLastChange by self write by * read
olcAccess: {2}to * by dn.exact="cn=john doe,ou=people,dc=lab,dc=yourdomain,dc=com" write by * read
\`\`\`

\`\`\`bash
sudo ldapmodify -Q -Y EXTERNAL -H ldapi:/// -f grant-jdoe-write.ldif
\`\`\`

For a real deployment beyond a lab, grant this to a *group* instead of one hardcoded DN (\`by group.exact="cn=ldap-admins,..." write\`), so admin rights scale with group membership rather than requiring an ACL edit for every new admin.

### Create users and groups, using both membership mechanisms correctly

Create a second user, \`asmith\`, and two groups:

- **\`developers\`** (gidNumber \`10000\`) — the **primary group** for both users, set via the \`gidNumber\` attribute directly *on each user entry*. A primary group needs no member list of its own; the link lives entirely on the user side.
- **\`grafana-admins\`** (gidNumber \`10010\`) — a **secondary group**, which lists its members explicitly via \`memberUid: jdoe\`. This group will drive actual admin permissions in Grafana later.


Query both relationship types:
\`\`\`bash
# Group → members (secondary/explicit membership)
ldapsearch -x -b "ou=people,dc=lab,dc=yourdomain,dc=com" -D "cn=admin,dc=lab,dc=yourdomain,dc=com" -W "(objectClass=posixGroup)" cn gidNumber memberUid

# User → primary group
ldapsearch -x -b "ou=people,dc=lab,dc=yourdomain,dc=com" -D "cn=admin,dc=lab,dc=yourdomain,dc=com" -W "(objectClass=posixAccount)" uid gidNumber
\`\`\`

When creating a user through the web UI, explicitly set the password hash type to **SSHA** — the default may be set to ARGON2ID, which plain \`slapd\` doesn't support without an extra module, silently preventing that user from ever authenticating.

## Part 2: Keycloak — Production Mode, a Real Database, Real Federation

### Run Keycloak in production mode with Postgres

\`\`\`yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: your-db-password

  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: start
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: your-db-password
      KC_HOSTNAME: auth.yourdomain.com
      KC_HTTP_ENABLED: "true"
      KC_PROXY_HEADERS: xforwarded
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: your-admin-password
    ports:
      - "127.0.0.1:8080:8080"
\`\`\`

- Set **\`KC_HOSTNAME\`** explicitly — production mode requires Keycloak to know its own public-facing domain.
- Set **\`KC_PROXY_HEADERS: xforwarded\`** — Caddy terminates HTTPS and talks to Keycloak internally over plain HTTP; this tells Keycloak to trust the \`X-Forwarded-*\` headers Caddy adds, so it correctly understands requests arrived over HTTPS.
- Use plain **\`start\`**, not \`start --optimized\`. The \`--optimized\` flag assumes a separate \`kc.sh build\` step has already pre-baked configuration into the image. Using it without that step causes a misleading \`Driver does not support the provided URL\` database error.

{{< figure
    src="https://i.ibb.co/rKYJzR51/kc-home.png"
    alt="keycloak"
    width="1000"
    height="600"
    title="KC default realm"
>}}

> **Keycloak doesn't require LDAP.**
>
> Keycloak includes its own internal database for storing users, groups, roles, and credentials, making it a complete standalone Identity Provider. LDAP federation is optional and is primarily used to integrate with an existing enterprise directory.

In this lab, LDAP is used to demonstrate federation rather than because Keycloak depends on it. You could create the same users and groups directly in Keycloak, assign users to groups, and authenticate Grafana exactly the same way. Keycloak also supports synchronizing data between its internal database and LDAP—importing users and groups from LDAP into Keycloak, or writing changes made in Keycloak back to LDAP when LDAP edit mode is enabled.

### Federate from LDAP across the network

First create a new relam, click on the dropdown on the top left corner and you will have the option to create a new one. Enter an id, optionally you can add a display name which will be displayed in sign in page. Switch to the new realm before continuing to user federation.

{{< figure
    src="https://i.ibb.co/fGCBbWBV/add-ldap.png"
    alt="adding ldap"
    width="1000"
    height="600"
    title="adding ldap"
>}}

Point Keycloak's LDAP federation at the directory server using the most direct private network path available. In this lab, both servers reside in the same AWS VPC, so Keycloak connects to the LDAP server's **private IP** rather than its public address.

If private connectivity isn't available, Keycloak can connect using a public IP or DNS name. In that case, the LDAP connection should be secured with **LDAPS (port 636)** or **StartTLS** instead of plain \`ldap://\`. This is the recommended production best practice whenever LDAP traffic traverses untrusted networks.

- **Connection URL:** \`ldap://<LDAP-server-private-IP>:389\`
- **Vendor:** Other
- **UUID LDAP attribute:** \`entryUUID\`
- **User object classes:** \`inetOrgPerson, posixAccount\`

Before this will connect, open the path between the two servers:
\`\`\`bash
# On the LDAP server — confirm slapd listens on all interfaces, not just localhost
sudo ss -tlnp | grep slapd
# Expect: 0.0.0.0:389

# On the Keycloak server — confirm the network path is actually open
nc -zv <LDAP-server-private-IP> 389
\`\`\`
Also add an inbound security group rule on the LDAP server allowing port 389 from the Keycloak server specifically (reference its security group as the source, not a static IP).

You can also verify the connection and authentication here.

{{< figure
    src="https://i.ibb.co/twn1VcCJ/verify.png"
    alt="test connection"
    width="1000"
    height="600"
    title="test and verify auth"
>}}

### Map LDAP groups into a token claim

- **User federation → LDAP provider → Mappers → Add mapper**, type \`group-ldap-mapper\`
- **Group Object Classes:** \`posixGroup\`
- **Membership LDAP Attribute:** \`memberUid\`
- **Membership Attribute Type:** \`UID\`
- **Preserve Group Inheritance:** Off — required when using UID-type membership, since Keycloak can't reconstruct hierarchy from flat usernames

After syncing, confirm \`grafana-admins\` appears under Keycloak's **Groups**, showing \`jdoe\` as a member.

Group data doesn't reach an application automatically — add it explicitly as a token claim:
- **Client scopes → Create client scope** named \`groups\` → **Mappers → Add mapper → Group Membership** → Token Claim Name: \`groups\`, add to both ID and access tokens
- Assign this scope to the \`grafana\` client under its own **Client scopes** tab

Skipping this step causes no error — the \`groups\` claim simply won't exist in the token, and any downstream role-mapping logic has nothing to check against.

### Register Grafana as an OpenID Connect client

Before Grafana can authenticate users through Keycloak, it must first be registered as an OpenID Connect client.

Navigate to **Clients → Create client** and configure the following:

- **Client type:** OpenID Connect
- **Client ID:** grafana
- **Client authentication:** On
- **Authorization:** Off
- **Standard flow:** Enabled
- **Root URL:** https://grafana.yourdomain.com
- **Valid redirect URI:** https://grafana.yourdomain.com/login/generic_oauth

The redirect URI must exactly match Grafana's Generic OAuth callback endpoint or the authentication request will be rejected.

{{< figure
    src="https://i.ibb.co/JRqT8Kwx/grafana-client.png"
    alt="create grafana client"
    width="1000"
    height="600"
    title="register Grafana as an OpenID Connect client"
>}}

Once the client has been created, open the **Credentials** tab and copy the generated **Client Secret**. Grafana uses this together with the **Client ID** to authenticate itself when exchanging the authorization code for tokens.

{{< figure
    src="https://i.ibb.co/9k72ytKf/client-creds.png"
    alt="client credentials"
    width="1000"
    height="600"
    title="copy the client secret"
>}}

## Part 3: Grafana — OIDC via Keycloak, Configured Through the UI

Recent Grafana versions include a full **SSO Settings UI** (Administration → Authentication → Generic OAuth) — configure and update an OAuth provider live, with no config files and no container restarts required.

{{< figure
    src="https://i.ibb.co/dCZSnqL/oauth.png"
    alt="generic oauth"
    width="1000"
    height="600"
    title="add keycloak with generic oauth"
>}}

- **Client ID & Client Secret:** Use the Client ID (grafana) and the corresponding Client Secret from the client registered earlier in Keycloak.
- **Scopes:** \`openid profile email groups\` — the last scope only works if the client scope from Part 2 has been correctly created and assigned. Requesting a scope that doesn't exist on the client can cause the entire authorization request to be rejected, not just the unrecognized piece — remove any provider-specific defaults (like GitHub's \`user:email\`) that don't apply to a generic OIDC provider.
- **Role attribute path:** \`contains(groups[*], 'grafana-admins') && 'GrafanaAdmin' || 'Viewer'\` — a JMESPath expression evaluated against the token's claims to decide what role to assign.
- **Allow assign Grafana Admin** — enable this explicitly, or Grafana silently ignores a \`GrafanaAdmin\` role value even when the path expression correctly returns it.

Keep the distinction between Grafana's two privilege tiers clear:
- **Org Admin/Editor/Viewer** — dashboard and data-source permissions within an organization.
- **Grafana Server Admin (\`GrafanaAdmin\`)** — a higher, instance-wide tier controlling things like the Authentication settings screen itself. This requires the distinct \`'GrafanaAdmin'\` value in the role path, combined with the toggle above — \`'Admin'\` alone only grants the lower org-level tier.

{{< figure
    src="https://i.ibb.co/wrCRsP84/kc-login.gif"
    alt="kc login"
    width="1000"
    height="600"
    title="jdoe login with keycloak and with admin acess"
>}}

With this correctly configured: log in as \`jdoe\` (member of \`grafana-admins\`) and land with full server-admin rights — creating data sources, editing dashboards, managing authentication settings. Log in as \`asmith\` (no special group) via the same SSO button and land on a read-only dashboard with no edit controls — real, working, group-driven authorization verified end to end.

{{< figure
    src="https://i.ibb.co/WvMgdfTd/db.png"
    alt="db view"
    width="1000"
    height="600"
    title="alice's dashboard view does not have edit option"
>}}

## Part 4: Adding Okta Alongside Keycloak

Until now we've used a self-hosted Identity Provider. Next, we'll integrate **Okta**, a managed cloud Identity Provider, with the same Grafana instance to demonstrate that applications can trust multiple independent OpenID Connect providers simultaneously.

### Create an Okta Developer Account

If you don't already have an Okta tenant, sign up for the **Okta Integrator Free Plan**.

After completing registration, you'll receive an organization URL similar to:

\`\`\`text
https://integrator-12345678.okta.com
\`\`\`

Register a second, independent Identity Provider on the same Grafana instance. Grafana treats **Okta** as its own dedicated authentication provider, separate from the **Generic OAuth** provider used for Keycloak. Both can be enabled simultaneously, each appearing as its own **"Sign in with..."** button on the Grafana login page.

### Create Users and Groups

Create one user for example:

- **Jane Doe** (\`jane.doe@example.com\`)

Next, create a group named **\`grafana-admins\`** and assign **Jane Doe** to it.

Note: Your Okta administrator account can also sign in to applications assigned to it. This guide uses a separate test user (**Jane Doe**) to clearly distinguish administration of Okta from end-user authentication, but you can use your administrator account instead if it has been assigned to the application.

> **Okta doesn't require LDAP either.**
>
> Okta's Universal Directory can store users and groups directly, but organizations with an existing LDAP directory can synchronize identities using the Okta LDAP Agent. This lab uses Universal Directory to keep the cloud identity provider independent from the LDAP-backed Keycloak deployment.

### Register Grafana in Okta

Create a new OIDC application for Grafana:

**Applications → Create App Integration → OIDC – OpenID Connect → Web Application**

Configure:

- **Sign-in redirect URI:** \`https://grafana.sagarpanda.com/login/okta\`

Unlike Generic OAuth, Grafana's built-in Okta provider uses the dedicated \`/login/okta\` callback path. The redirect URI configured in Okta must match this value exactly, otherwise the OIDC login flow will fail.

Assign the application to the users or groups that should be allowed to authenticate, then save the application and copy the **Client ID** and **Client Secret**.

{{< figure
    src="https://i.ibb.co/Y4LXSd4J/okta-clinet.png"
    alt="client in okta"
    width="1000"
    height="600"
    title="register Grafana as an OpenID Connect application"
>}}

### Add a Groups Claim

Okta doesn't include group membership in OIDC tokens by default, so a custom claim must be added.

Navigate to:

**Security → API → Default Authorization Server → Claims → Add Claim**

Configure the claim as follows:

- **Name:** \`groups\`
- **Include in:** ID Token and Access Token
- **Value type:** Groups
- **Filter:** Matches regex \`.*\`

This adds the authenticated user's group memberships to the token so Grafana can make authorization decisions based on them.

### Configure Grafana's Okta Provider

Open:

**Administration → Authentication → Okta**

Configure the provider with:

- **Client ID** and **Client Secret** from the Okta application
- **Okta Org URL:** your \`https://integrator-xxxxx.okta.com\` tenant
- **Scopes:** \`openid profile email groups\`
- **Role Attribute Path:**

\`\`\`text
contains(groups[*], 'grafana-admins') && 'GrafanaAdmin' || 'Viewer'
\`\`\`

Enable the provider and save the configuration.

### Test the Integration

Sign out of Grafana and return to the login page. You should now see two independent authentication options.

Sign in as **Jane Doe** and verify that Grafana grants full server administrator privileges through membership in the **\`grafana-admins\`** group.

{{< figure
    src="https://i.ibb.co/4wqvJfH5/okta-login.gif"
    alt="okta login"
    width="1000"
    height="600"
    title="login with either okta or Keycloak"
>}}

At this point, the same Grafana instance trusts two completely independent OpenID Connect identity providers—one self-hosted (Keycloak backed by LDAP) and one cloud-hosted (Okta). Both authenticate users using the same OIDC standard while independently issuing tokens that Grafana uses to authenticate users and determine their permissions.

## Wrap Up

In this project we built a complete identity stack from the ground up—starting with an LDAP directory, federating it into Keycloak, integrating a cloud identity provider with Okta, and finally securing a real application using OpenID Connect and group-based authorization.

Along the way we also explored an important architectural point: LDAP is optional. Both Keycloak and Okta can manage their own users and groups, or integrate with an existing LDAP directory when organizations already have one. The application itself remains unaware of where identities originate—it simply trusts signed tokens issued by the configured Identity Provider.

Although the technologies used here are specific, the architecture is common across modern enterprise environments. Once you understand how directories, Identity Providers, federation, and token-based authentication work together, the same concepts apply whether you're working with Active Directory, Microsoft Entra ID, Authentik, Ping Identity, or any other standards-compliant identity platform.

`,__vite_glob_0_31=`---
date: '2024-09-30T19:26:10+05:30'
draft: false
title: Fortify Your Security with CrowdSec — A Quick Start Guide
description: Install and configure CrowdSec for securing your infrastructure, a step by step guide for getting started.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iV7RJZ44oOMYMJSi0V517g.png
tags:
- linux
- firewall
- security
- devops
- crowdsec
- cloud security
categories:
- Linux & Automation
---


### What is CrowdSec:

CrowdSec is an open-source security tool designed to help protect servers and applications from cyberattacks. It works by analyzing logs from your systems to detect suspicious activity, such as brute-force attempts, and then takes action to block or prevent those threats.

CS’s uniqueness is its “crowd-powered” approach. When it detects a potential threat on one system, it shares that information with a global community of other users. This way, everyone using CrowdSec benefits from the collective knowledge of cyberattacks happening around the world, making it more effective at spotting and stopping threats.

### Setup on Linux:

⚠️Note: Experimental, cloud provides might ban you for doing this? Proceed with caution. ⚠️

Download and install on your server following the official docs. [CrowdSec](https://docs.crowdsec.net/u/getting_started/installation/linux/)

#### Before getting started it is advised to read the prerequisites page to understand the requirements for running…


You can either run the script

Note: Before running any script make sure to check the content.

\`\`\`
curl -s https://install.crowdsec.net | sudo sh
\`\`\`

Or run the commands manfully to add repo and then install crowdsec.

\`\`\`
sudo apt install crowdsec
\`\`\`

### Collections :

In CS, **collections** are bundles or sets of pre-configured security rules, parsers, and scenarios designed for specific use cases or environments. They help simplify the setup process by providing a curated combination of resources that fit particular needs. examples are sshd, nginx and various other apps or services.

Since I have nginx and open ssh installed, CS installs the related collections automatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tzmX_xh5i_7BOYSMzmpv2g.png)

To view the list the collections enabled.

\`\`\`
sudo cscli hub list
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JKNwOj9XEeYgveBIPXUI_Q.png)

If you want to enable more manually, you can run the cs wizard and select from the list.

\`\`\`
sudo /usr/share/crowdsec/wizard.sh -c
\`\`\`

This shows the collections in use. Continue to add more or cancel.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RHwNLUQXIdFxOkJOFwWTRg.png)
<br></br>
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*w7BqARVhdxHG_mXp9J3hUQ.png)

### Remediation components:

R**emediation components** are tools or mechanisms used to **mitigate** or **respond to threats** once they are detected. These components take action against malicious actors or suspicious activities to protect our systems.

CS is the detection engine that identifies threats, and remediation components enforce the actions that reduce or eliminate those threats.

Bouncers take action as decision to perform certain activities. In this example lets install cs-firewall-bouncer.

\`\`\`
sudo apt install crowdsec-firewall-bouncer crowdsec-firewall-bouncer-nftables
\`\`\`

Alright, the setup is ready and now we can test the effectiveness. Now create another instance (test).

### The Brute force attempt:

→ From the test instance try to ssh to the labputer (machine with CS installed). Use your SSH key or password and you should be good to go.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N40dkF5VRaAE31dZtvtwtg.png)

Before next steps, view the current decision list on the cs server.

\`\`\`
sudo cscli decision list
\`\`\`

→ Exit the connection and try again with wrong pw, without the key or a diff key. Repeat this a few times, and boom you are now blocked 😂.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_cVnjhk-Rk4-9v7mzl6qvA.png)

We see the Ip of the test machine has been added to the list of ban, it also shows the reason being brute force attempt. Now even if you try to login with correct password or key, you won’t be able to.

![captionless image](https://miro.medium.com/v2/resize:fit:1332/format:webp/1*rmETeU7hbBNluNwg23eMmw.png)

If you want, you can unblock the IP again with cscli decisions delete command after which you will be able to login.

\`\`\`
sudo cscli decisions delete -i <ip>

\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l9CFDTlqlYQgNPb7-6poNA.png)

### Dashboard/Web Console:

You can view these details via a neat and tidy web ui. Sign up at app.crowdsec.net.

[Home](https://app.crowdsec.net/?source=post_page-----914a6acaf5c6---------------------------------------)



![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FaDwfPxqQzNiBZaIirjxBA.png)

From the Security Engine page you will see an option to enroll your engine to be available on the Dashboard.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WNHGgwo2vBBYVrCPNuBa1Q.png)

To enroll, you will get the cmd from the bottom part of the same page.

\`\`\`
sudo cscli console enroll -e context <id>
\`\`\`

Copy and paste in your server with CS. Then you will have a promt to accept or deny the request on the dashboard.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OfJMDVqUaT5mPwThRS5Nag.png)

After enrolling, you need to restart crowdesc to have the engine reporting to the dash.

Now we can view engines, alerts, the remediation components, decision etc on the dash.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gQzqYcZPdX1weQOizyag5w.png)
<br></br>
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JrKYeKzNLuwnesvK4jR2ww.png)

Note:1. You can install and setup CS by following the visual guide from the console.

2. Actions via the dashboard might require a paid plan.

### Wrap up:

That’s all about it. Explore further on blocklists, collections and the dashboard. Be cautious about doing this experiment as you might get blocked by cloud providers (not sure yet). And delete your instances (if any) once you are done with the experiment.

<!-- [Read more on Linux →](/blogs/#linux) -->`,__vite_glob_0_32=`---
date: '2024-05-05T19:26:10+05:30'
draft: false
title: Linux Terminal tips - Part 1
description: Essential Linux Terminal Hacks for Efficiency
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LNuC4HwvmpE28qItI9T7RA.png
tags:
- linux
- terminal
- tips
series:
- Linux Tips
series_order: 1
categories:
- Linux & Automation
---


### Introduction:

In the labyrinth of Linux commands, managing tasks can be daunting. Fear not! Here are some handy tips and tricks up your sleeve to streamline your day-to-day operations, making every task a breeze


### 1. Clearing terminal:

Use Ctrl + L to clean the terminal instead of typing clear every time.


### 2. Tab auto complete cmds:

Most of us are aware of tab completion for folders and files, but the same works for commands as well.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kdps1ebzs1g4Nl-H23U33w.png)

### **3. Alias:**

Alias is a short command that we can set (a few are set by default).

eg: set the word “u”, for sudo apt update.

\`\`\`
alias u="sudo apt update"
alias i='sudo apt install"
\`\`\`

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

When you use "\`pushd /path/"\`, you switch the current directory to "\`/path/”\`, while also saving the previous directory onto the directory stack. Then, when you use \`popd\`, it removes the top directory from the stack and changes the current directory back to it."

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bxJ2IoninfaCoRKSq1cgXw.png)

### 7. hostnamectl:

Change hostname for easy identification of machine.

\`\`\`
hostnamctl set-hostname <name>
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*VO8fDqiDtTovBx_3VPMT5Q.png)

You can also set your domain name as hostname.

### 8. Get Public IP:

Get public ip using ifconfig.me

\`\`\`
curl ifconfig.me
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PY-KPwEaF5_bsuchsbgZsA.png)

### 9. Re run the previous command:

Similar to point 3, but you don’t necessarily need to go back to the start (Use those shortcuts for modification in the middle or towards the end).

We can re run the previous command using !! with the left out commands.

\`\`\`
$ systemctl stop httpd
$ sudo !!
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IdM2jrYb7K4DWoA0-4Es6g.png)

### 10. Re run the previous command arg:

Say you did ls on a directory, but you realised, you wanted to switch to it instead.

\`\`\`
$ commad <args>
$ 2nd command !$
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Cdve57jThmRnBMYqlX54Vg.png)

### 11. background and foreground task:

If you’re editing a file and need to do something else in the terminal, use \`Ctrl+Z\` to suspend the task. Then, handle your other tasks and resume the editing with \`fg\`. This method isn’t specific to any editor and works with various applications.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*va27GBXhz9z8mCAsZcY0hQ.gif)

### 12. Man page and help:

No need to remember all the details for a cmd. Use the below to retrieve them.

*   man : for info about utilities and programs.
*   help : for quick info about built-in shell cmds

\`\`\`
man wc
help cd

\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NN286i7wSM1Ph4KZQ7369A.png)

### 13. Ctrl Q:

Used Ctrl S to save our changes? In terminal this key combination freezes the terminal. To unfreeze use ctrl q.

### 14. Font Management

To increase the terminal font size use Ctrl and + button, to reduce it, use Ctrl and — button.

### Next up:
[**Checkout the part 2:**]({{< relref "linux-tips2" >}})


`,__vite_glob_0_33=`---
date: '2024-05-28T19:26:10+05:30'
draft: false
title: Linux Terminal tips - Part 2
description: Reverse cmd search, date and time in history and more.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*oJHs4IQgdGgHM-W4aiBuwQ.png
tags:
- linux
- teminal
- tips
series:
- Linux Tips
series_order: 2
categories:
- Linux & Automation
---


### 1. Reverse search cmds:

To reuse a command, use Ctrl + R and type a few matching keywords to see the recently used cmds being shown up. The search is based on the command history.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8d6OCQLH_WCzvQCcUpCfcQ.gif)

### 2. Use particular cmd from history

Use history cmd to list all the previous cmds used, and use “!<number> to reuse the cmd.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zcK7fmsxne1nTTseJWEUkQ.png)

### 3. Show Date and time in History:

To view date and time on command history, use HISTTIMEFORMAT and choose how you want the date to be displayed.

\`\`\`
HISTTIMEFORMAT="%d-%m-%y %r " history
%d – Day
%m – Month
%y – Year
%T / %r – Time in 24/12 hours format
\`\`\`

Set it permanently, add in .bashrc

\`\`\`
export HISTTIMEFORMAT="%d-%m-%y %r "
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wJNStzFCS01XB_WBxQMdEw.png)

Note: All the dates at this point might show the current date because the date was not recorded, but from now onwards it should be correct.

### 4. Run Multiple cmds at once:

If you want to run multiple commands at once, you can chain then together with with 3 options.

; — Run commands sequentially

&& — If one cmd fails then the next wont run

|| — Command runs only if previous cmd fails.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BNsvqlnGZmiuzNuHcnYquw.png)

### 5. View content with Less :

Viewing a file with large data using “cat” spams the whole window, using **_less_** shows a chunk of content and then you can scroll up or down.

Other features include:

*   Search: search for specific terms within the file using \`/<\`search term>.
*   Navigation: G to move to the end of the file, \`1G\` (go to line 1), \`N\` (repeat previous search), etc.
*   Options: various options to customize behavior, such as \`-N\` (display line numbers), \`-i\` (ignore case in search), \`-S\` (disable text wrapping), etc.

### 6. Column:

Using the \`column\` cmd, view the output of text files or command outputs in more readble format.

use -t to show in tabular format and -s to specify the delimiter. Either run with column command or pipe output of other cmds to column.

\`\`\`
column -s ',' -t data.csv #shows tabluar data from the file, separated values
cat /etc/passwd | column -s ':' -t
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BkUI__uomjzXkAiPMRuYwg.png)

### 6. Truncate a file

Remove the content of a file without opening it with truncate. Specify the size with -s (--size). 0 is to empty it or any other number to reduce to that size.

\`\`\`
truncate -s 0 filename.txt -- removes all data
truncate -s 100 filename.txt
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1Cw05a2bGal92tmsZEl76g.png)

### 7. Head and Tail:

As the name suggests, the head shows few lines of a file and the tail shows the last few lines.

You can also specify the number of lines to be displayed.

\`\`\`
head/tail -n 20 <file>
\`\`\`

**_Tail_** with **_-f_** is also helpful to view changing files like logs.

\`\`\`
tail -f <file>
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JXjzoNVWao3_gKpHWHN1CQ.png)

### 8. View exit code:

Exit codes show the results of execution, typically useful for shell script. Use “echo $?” to view the exit code of previous cmd.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nMqj8qFdZ3FGwDUZ3LX1uQ.png)

### 9. Create nested directories:

If you need to create nested director use / to define the sub dirs.

\`\`\`
mkdir -p dir/{dir1/subdir1,dir2,dir3/subdir3}

\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*b4dhhPoiN7LpyXl3TCXXrQ.png)

### 10. File command:

Use file command to check the type of any file. Especially useful to determine files without extension or files disguised as a diff file.

eg : a .sh file with python interpreter on #!

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9O2TMZGpuYx63jIx8IGASg.png)

That’s all for today.

**Read part 1:**
[here]({{< relref "linux-tips1" >}})`,__vite_glob_0_34=`---
date: '2024-02-29T19:26:10+05:30'
draft: false
title: Introduction to Shell Scripting for Beginners
description: 'Part 1: Introduction to Bash, shell and scripting for task automation'
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HVqm9vCg6-5t6qGpu1g86A.png
tags:
- linux
- shell scrpting
- devops
- bash
series:
- Shell Scricpting
series_order: 1
categories:
- Linux & Automation
---

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

\`\`\`bash
# vim hello.sh
echo Hello World!
\`\`\`

Now we simply can’t run a shell script, first we have to make it executable.

\`\`\`bash
sudo chmod +x hello.sh
\`\`\`

It’s ready to be executed. Run the script.

\`\`\`bash
./hello.sh
\`\`\`
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

\`\`\`bash
#!/bin/bash
echo 'Hello World'
#print("hello")
print('hello from python')
\`\`\`
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

\`\`\`bash
sagar@DELL-G5:~$ vim hello
#!/usr/bin/python3
#print("hello")
import os
print('hello from python')
dir = os.getcwd()
print("pwd is" + dir)
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1274/format:webp/1*AvnoPfZL0Nf9hBes1f65pA.png)

Here’s another example:

\`\`\`bash
#!/bin/bash
echo 'Hello There'
#current_date=$(date +%Y-%m-%d)
echo "Today's date is: $(date +%d.%b.%Y) and its a leap day"
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eFw-OReGtqBJWY4tmODr6Q.png)

## Conclusion:

Now that you are familiar with the basics, start exploring and practicing these. We’ll see more in the future.

Thanks for reading!

Reference: LearnLinux.tv

<!-- [Read More on shell scrpting→](/blogs/#linux) -->`,__vite_glob_0_35=`---
date: '2024-03-10T19:26:10+05:30'
draft: false
title: Variables and Math Functions in Bash
description: 'Part 2: Usage of variables to set changeable data, and math functions for arithmetic operations'
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XufA9FFra4lI34SOm3UDtA.png
tags:
- linux
- shell scrpting
- devops
- bash
series:
- Shell Scricpting
series_order: 2
categories:
- Linux & Automation
---


### What is a variable:

A variable is a container where we can store some value which have possibility to change.

Just like any other programming language, bash also has variables, in fact we saw one default variable in the 1st chapter which is $SHELL. There are many other default variables such as $HOME, $PWD, $PATH, $USER etc.

![captionless image](https://miro.medium.com/v2/resize:fit:1280/format:webp/1*nFUQh6ivIwKFTIxHXhmLTg.png)

We can create a variable using equals symbol and to call a variable we use $. Calling the variables without $ does not make bash parse the value of the variables.

![captionless image](https://miro.medium.com/v2/resize:fit:1062/format:webp/1*uesTvtjSaZ7wIWkKueIpvw.png)

The bash default variables are always set with caps letters, we can do that too for our own variables, but it's generally a good idea to keep our vars in lowercase so we can easily distinguish if the variables are default or custom.

\`\`\`bash
#!/bin/bash
host="Windows"
os="Ubuntu"
echo "Hello there, this is $os running on $host"
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Lz-e638LF1Kp4mzbw5M_fg.png)

Now when we execute this, we get the $os and $host values parsed and replaced.

![captionless image](https://miro.medium.com/v2/resize:fit:1316/format:webp/1*AJt8otKM38_fjn2jE_AOig.png)

Variables allow us to define something once and use it multiple times.
For example now I want to change the rocky Linux, then I don’t need to change in all the places.

\`\`\`bash
#!/bin/bash
host="Windows"
os="Rocky Linux"
version=9
echo "Hello there, this is $os running on $host"
echo "Hello There, now its $os"
echo "The version of $os is $version"
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OueyDN_hdQz9iZRjI5RPRA.png)

## Math Function:

In bash the expr keyword is used to perform mathematical operations.
All the arithmetic operations use the general symbols like + — / and * however be careful with multiplication as * has a diff use in Linux which is to indicate everything.

So for multiplication we need to inform bash to ignore the general meaning by adding an escape sequence.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eJgqMctorC9x3Z-lkMH9gQ.png)

\`\`\`bash
#!/bin/bash
first=50
second=3
echo "The third value is: $(expr $first + $second)"
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hHlGbDoRXgyleoc-6f-BkQ.png)

Note: expr does not calculate floating point in division, for doing so we need to use basic calculator (bc). Install it if not available with apt install.

\`\`\`bash
sudo apt update && sudo apt install bc
\`\`\`

Now we can perform division with correct way.

\`\`\`bash
sagar@DELL-G5:~$ echo  "5 / 2" | bc -l
2.50000000000000000000
sagar@DELL-G5:~$ echo "scale=0; 5 / 2" | bc -l
2
sagar@DELL-G5:~$ echo "scale=1; 5 / 2" | bc -l
2.5
sagar@DELL-G5:~$
\`\`\`

So updating the script form earlier we have the below operations. The number used for scale is the number of floating points we want to show.

![captionless image](https://miro.medium.com/v2/resize:fit:850/format:webp/1*opp7-a40-5bL8apkK4-EkA.png)

\`\`\`bash
#!/bin/bash
first=50
second=3
echo "The third value is: $(expr $first + $second)"
echo "$first divided by $second is: $(expr $first / $second)"
echo "$first divided by $second is: $(echo "scale=1; $first / $second" | bc -l)"
\`\`\`

Alright, that's all for today. Thanks for reading!

Reference: LearnLinux.TV

<!-- [Read More on shell scrpting→](/blogs/#linux) -->`,__vite_glob_0_36=`---
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

*   \`0\`: Success. The command or script executed successfully without any errors.
*   \`1\`: General error. The command or script encountered an error.
*   \`2\`: Misuse of shell built-ins (according to Bash documentation).
*   \`127\`: Command not found. This happens when the command you are trying to execute is not found in the system’s PATH.

Any non zero exit code can be considered as failure of some sort.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0F4fN1Pz6Wby8VzhAw3hGw.png)

Lets use in script.

\`\`\`bash
#!/bin/bash
app=curl
sudo apt install $app
echo "The installation status for $app is: $?"
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*issDScuC265mpRNzXBC6wg.png)

Change the app from curl to some random text which should not be any valid app/utility.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*L0SSf8EudXzzmLttaMN89g.png)

### Using exit codes to perform tasks

We can use exit codes with conditional statements and perform certain tasks based on the results.
For example to run a diff command if one fails.

\`\`\`bash
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
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hLMR-_sA22gZT3yeFIdi1Q.png)

When you check for exit status, the check should be placed at the proper location.

For example, in the above script, if you uncomment the echo statement, the result will be diff.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xYJJHLWSZoEQJZq2WAwTJA.png)

This script prints “curly was installed” even with the general apt error saying the package was not found.

Why you may ask? It’s because of the previous echo statement. The execution of the echo was successful and the status changed to 0. Now since we are validating the status after the echo, the condition matches.

### Forcing exit status

We can force the script resulting specific exit codes by using the keyword “exit”

\`\`\`bash
#!/bin/bash
echo "Hello World"
echo "The normal exit code for the above statement is: $?, check with 'echo \\$?'"
exit 155
echo "Hi"
\`\`\`

This script will print the first two echo statements and the exit code will be whatever you have set.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*buYIRtIOq3UPMdyveyNzCw.png)

Exit statements will exit the script execution no matter what you have set.

Similarly if you have set the exit code 0, even for a command failure the status will be 0.

\`\`\`bash
#!/bin/bash
xyz
echo "The normal exit code for the above statement is: $?, check with 'echo \\$?'"
exit 0
echo "Hi"
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gUpYBNGb-vh4FfUnzN18Mg.png)

Exit inside of an if block also exits the whole script not just the block.

\`\`\`bash
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
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ksxqd6V007FKqEgj9cjSig.png)

> Note: The exit statement even without any code will also terminate the script.

That’s all about it.

**References:** LearnLinuxTV

<!-- [Read More on shell scrpting→](/blogs/#linux) -->`,__vite_glob_0_37=`---
date: '2024-03-22T19:26:10+05:30'
draft: false
title: If Statement - Conditional in Bash Scripting
description: 'Part 3: Usage of if, else and elif statements in shell scripting'
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aYAEBPL0-U8a-fXcPpr9Ug.png
tags:
- linux
- shell scrpting
- devops
- bash
series:
- Shell Scricpting
series_order: 3
categories:
- Linux & Automation
---


### Intro:

So, what’s the deal with 'if' statements? Think of them as the script’s way of making decisions. It’s like having a little script buddy that can say, "Hey, if this thing happens, do this. Otherwise, try something else!"

Syntax:

\`\`\`bash
if [ condition ]; then
    # Do this if the condition is true
fi

\`\`\`

We have a set of keywords: if, then, elif, else and fi.

Let's see a basic example:

\`\`\`bash
#!/bin/bash
a=5
if [ $a -eq 5 ]
then
    echo "The condition is True"
fi
\`\`\`

In this example, we assigned the var a with the value 5. Now the **if** condition checks the value of a and if it matches we do some action with the **then** keyword (just echo here notifying the condition matched)**.** The **fi** keyword marks the end of conditional block.

![captionless image](https://miro.medium.com/v2/resize:fit:932/format:webp/1*YmlsrdPKvSLdZYgcRBfDnA.png)

The [] is an alias of Linux command test. The -eq is an operator, which means “equals to”. Similarly, there are many other operators like -ne for not equals, -gt for greater than, -f for existence of a file, -d for directory and etc. To see all use man page.

\`\`\`bash
man test
\`\`\`

We can even do the test without using [].

\`\`\`bash
#!/bin/bash
a=5
if test $a -eq 5
then
    echo "The condition is True"
fi
\`\`\`

### Using if..else:

If we have multiple checks, then we can use multiple if statements or better yet use else condition.

\`\`\`bash
#!/bin/bash
a=5
if test $a -eq 8
then
    echo "The condition is True"
else
    echo "The value of a is not 8"
fi
\`\`\`

Let's see another example to check if a file exists, if it does then simply print the content of the file. If it does not then create the file and then print its content.

\`\`\`bash
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
\`\`\`

Here, we have the -f to check if a file exists. The first time I ran it, I did not have the random.txt, so it was created and running it again just printed the content as the first condition matched.

![captionless image](https://miro.medium.com/v2/resize:fit:1306/format:webp/1*vRBOHj00QhtiCZjOutynqA.png)

### Using elif:

Another example to check if a particular command is installed. If already installed then just run it, if not, install it and then run.

In case we want to install, we need to use package managers. As there are multiple Linux distros with different package managers, we shall make the script universal and to check the distro at run time and use proper commands.

**Note:** We can use either -f to check for the command using its path or use the Linux co**mmand called “command”. Use which command to find location of a program.

\`\`\`text
$ which nano
/usr/bin/nano
$ command -v nano
\`\`\`
<br></br>

\`\`\`bash
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
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*D1Wt01g9fYK94uPmlLAdaw.png)

Let's now proceed with the main script.

**Note :** Use update command to refresh the package cache first and then install.

\`\`\`bash
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
\`\`\`

**Note:** Usage of the sudo command will ask to enter the password at the time of running the script. To avoid such scenarios the script should either run from the root user or the user should be configured not to ask password for these particular commands.

Use sudo visudo:

\`\`\`
<username> ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/yum
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZQE6ncGNCDUHIznpTYRbsA.gif)

### Wrapping It Up:

And there you have it! 'if' statements are the secret sauce that’ll take your shell scripts from meh to magnificent. So go ahead, experiment, get creative, and let the 'if' magic flow! Your scripts will thank you later. 😉

Thanks for reading!

<!-- [Read More on shell scrpting→](/blogs/#linux) -->
`,__vite_glob_0_38=`---
date: '2023-09-08T19:30:10+05:30'
draft: false
title: How to Send Email Alerts using Prometheus AlertManager
description: Get mail alerts from Prometheus about server resource usage.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y--eGmBDkRNT1NAWiv-Wtw.jpeg
tags:
- monitoring
- o11y
- devops
- prometheus
- grafana
series:
- Prometheus
series_order: 2
categories:
- Observability & Monitoring
---

This is the 2nd article, to setup Prometheus with Node exporter and Grafana refer this article, [Setup Monitoring — Prometheus and Grafana]({{< relref "prometheus" >}}).

You can find the repository on [Github](https://github.com/sagarkrp/Prometheus-and-Grafana.git).

The Prometheus Alertmanager is a tool for sending alerts via emails, slack and various other mediums.

In this article we’ll configure it to send Server Status alerts via email.

## Let’s get started.

First update the docker-compose.yml to include alertmanager image.

\`\`\`yml
version: '3.8'
networks:
  monitoring:
    driver: bridge
volumes:
  prometheus_data: {}
  grafana_data: {}
  alertmanager-data: {}
services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - 9100:9100
    networks:
      - monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus:/etc/prometheus/
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    ports:
      - 9090:9090
    networks:
      - monitoring
  alertmanager:
    image: prom/alertmanager:latest
    restart: unless-stopped
    container_name: alertmgr
    ports:
      - "9093:9093"
    volumes:
      - "./alertmanager:/config"
      - alertmanager-data:/data
    command: --config.file=/config/alertmanager.yml --log.level=debug
    networks:
      - monitoring
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    user: '0'
    ports:
      - 3000:3000
    restart: unless-stopped
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
      - /grafana_data:/var/lib/grafana
    networks:
      - monitoring

\`\`\`

Create an app password in your Google account. Follow the official guide by Google.

[Sign in with app passwords](https://support.google.com/mail/answer/185833?hl=en&source=post_page-----16df870144a4---------------------------------------)

Now create alert manager configuration using below:

\`\`\`yml
# alertmanager.yml
route:
  receiver: 'Mail Alert'
  # group_by: [ alertname ]
  repeat_interval: 30s
  group_wait: 15s
  group_interval: 15s
receivers:
  - name: 'Mail Alert'
    email_configs:
      - smarthost: 'smtp.gmail.com:587'
        auth_username: '<your email id here>'
        auth_password: "<your app password here>"
        from: '<your email id here>'
        to: '<receiver's email id here>'
        headers:
          subject: 'Prometheus Mail Alerts'
\`\`\`

Now, will create rules based on which we’ll get alerts.

\`\`\`yml
#alerts.yml
groups:
- name: Example
  rules:
    - alert: InstanceDown
      expr: up == 0
      for: 15s
      labels:
        severity: critical
      annotations:
        summary: "Instance [{{ $labels.instance }}] down"
        description: "[{{ $labels.instance }}] of job {{ $labels.job }} has been down for more than 15 seconds."
# - name: NodeMemUsgae
  # rules:
    - alert: HostMemoryIsUnderutilized
      expr: ({__name__="node_memory_MemAvailable_bytes", instance="node-exporter:9100", job="node"} > 80)
      for: 15s
      labels:
        severity: critical
      annotations:
        summary: Host Memory is underutilized (instance {{ $labels.instance }})
        description: "Node memory is < 20% for 1 week. Consider reducing memory space. (instance {{ $labels.instance }})\\n  VALUE = {{ $value }}\\n  LABELS = {{ $labels }}"
\`\`\`

We need to modify Prometheus configuration to include alertmanager and the rules configuration. I have added a node which does not exist for this demo. This is for getting the InsatnceDown alert.

\`\`\`yml
#prometheus.yml
global:
  scrape_interval: 30s
rule_files:
  - alert.yml
alerting:
  alertmanagers:
    - scheme: http
      static_configs:
        - targets: [ 'alertmanager:9093' ]
scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 1m
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
  - job_name: 'dummy_node'
    static_configs:
      - targets: ['localhost:1234']
\`\`\`

So the directory structure looks like this:

\`\`\`
[root@labputer Monitor_with_Prometheus]# tree
.
├── alertmanager
│   └── alertmanager.yml
├── docker-compose.yml
├── grafana
│   └── provisioning
│       ├── dashboards
│       │   ├── dashboard.yml
│       │   └── node_exporter.json
│       └── datasources
│           └── datasource.yml
└── prometheus
    ├── alert.yml
    └── prometheus.yml
6 directories, 7 files
\`\`\`

Now start the containers with “docker compose up -d”. We can verify alertmanager at htpp://ip:9093 and will also be able to view the alets in Prometheus. At the beginning everything seems to be fine. We don’t see any alerts being active. But a few seconds and we shall see alerts firing and we’ll get emails.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*oSdfFRFHO2FuxXL3lpnAyQ.png)

Here, both of the alerts were combined and sent via a single mail. If you want to receive separate mails based on the alert types, enable the **group_by** in alertmanager.yml.


To view the alerts and Prometheus, click on the alert tab. Expand the alerts to view the rule. Check the annotations box to view the target where the rule is being applied.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mIYifVrp73Tjd_hOjzIL5g.png)

The alerts and rules can also be viewed from alert manager. The status tab shows the status of alert manager as well as the rules we defined.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Vr-0rqVFwNoxl4e9AAgzsg.png)

You can silence any alert for a particular period of time. Click on the silence button above the alert. A new window appears to choose duration and etc. Fill all mandatory fields and click create.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PIth2NbfQGNiGyTc5OBpOQ.png)

You can make a silenced alert expire the duration forcefully and receive the alerts again.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6JTnZg9z8ivbG5tC6ky-aQ.png)

Hope you found this article helpful. In the next article we’ll discuss monitoring your website using Blackbox exporter.

Thanks for reading.

Reference: Prometheus.io

<!-- [**Checkout more on monitoring and o11y →**](/blogs/#o11y) -->

[Visualize Your Website Metrics — Blackbox Exporter and Grafana]({{< relref "blackbox" >}})`,__vite_glob_0_39=`---
date: '2023-09-25T19:30:10+05:30'
draft: false
title: Visualize Your Website Metrics — Blackbox Exporter and Grafana
description: Configure Blackbox Exporter to View Site details in Grafana, get alerts for TLS expiration and other details.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xbFMqG61f22nlG7Yvb9YHA.png
tags:
- monitoring
- o11y
- devops
- prometheus
- grafana
series:
- Prometheus
series_order: 3
categories:
- Observability & Monitoring
---


In the previous post we discussed sending email alerts with alertmanager, in this post we’ll configure the Prometheus Blackbox Exporter.

You can find the repository on [Github](https://github.com/sagarkrp/Prometheus-and-Grafana).

## Setup

BlackBox exporter is a monitoring tool that allows querying of endpoints over HTTP, HTTPS, DNS, etc.

Here we are going to monitor http://prometheus.io and a few more sites which may not exist. We are going to look for HTTP status and TLS certificate expiration duration.

A 200 HTTP response indicates that the site is working fine. Check the Mozilla article for more on HTTP response codes.

[HTTP response status codes - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status?source=post_page-----fa118b1aa843---------------------------------------)

First we need to modify docker-compose for the last time. Add Blackbox image.

\`\`\`yml
  blackbox:
    image: prom/blackbox-exporter:latest
    # privileged: true
    restart: unless-stopped
    container_name: Blackbox
    volumes:
      - ./blackbox/blackbox.yml:/etc/blackbox_exporter/config.yml
    ports:
      - '9115:9115'
    networks:
      - monitoring
\`\`\`

Now we’ll need to modify prometheus.yml config to add blackbox job to let Prometheus collect the metrics coming from the blackbox exporter. Also in the config we see that we are looking for status codes that are of 200 class.

\`\`\`yml
 - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]  # Look for a HTTP 200 response.
    static_configs:
      - targets:
        - http://prometheus.io    # Target to probe with http.
        - https://prometheus.io   # Target to probe with https.
        - http://example.com:8080 # Target to probe with http on port 8080. This is for getting site down alert
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox:9115  # The blackbox exporter's real hostname:port.
\`\`\`

Finally add the rules in the alert_rules.yml for the alertmanager to be able to send alerts when the condition meets.

As discussed earlier, the first rules here is for http status code. Here we’ll get alerts for whenever our site’s status is anything other than 200–399.

The second rule is to get alert for SSL/TLS certificate expiry duration so that we can update the certificate before it expires. Here I have set it to 60 days, meaning this alert will be activated once I have only 60 days of duration for my certificates.

Note: You can create or your own expressions or use various sites to get them. Example I have used the expressions from “[https://samber.github.io/awesome-prometheus-alerts/](https://samber.github.io/awesome-prometheus-alerts/)”.

\`\`\`yml
- name: HTTP_Status_Failure
  rules:
    - alert: BlackboxProbeHttpFailure
      expr: probe_http_status_code <= 199 OR probe_http_status_code >= 400
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Blackbox probe HTTP failure (instance {{ $labels.instance }})
        description: "HTTP status code is not 200-399\\n  VALUE = {{ $value }}\\n  LABELS = {{ $labels }}"
- name: SSL_Expiry
  rules:
    - alert: BlackboxSslCertificateWillExpireSoon
      expr: 0 <= round((last_over_time(probe_ssl_earliest_cert_expiry[10m]) - time()) / 86400, 0.1) < 60
      for: 0m
      labels:
        severity: warning
      annotations:
        summary: Blackbox SSL certificate will expire soon (instance {{ $labels.instance }})
        description: "SSL certificate expires in less than 200 days\\n  VALUE = {{ $value }}\\n  LABELS = {{ $labels }}"
\`\`\`

Start the containers with “docker compose up -d”.


Launch Prometheus console and navigate to targets, with all other previous targets, we shall now see the blackbox section with the sites that we have configured.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YXUi8SNDWx0iTFFl9iePIg.png)

Browse ip:9115 to view the blackbox exporter data and its metrics.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6sZHYbB_yYT-fJE0ZgPQJg.png)

At this point we are already getting alerts. (I had the SSL expiry rule set to 365 days)

![captionless image](https://miro.medium.com/v2/resize:fit:1120/format:webp/1*r2JYNnyTAyL5uwWMNxOQpQ.png)

Finally its time to configure Grafana dashboard for viewing blackbox metrics. We can create dashboard ourself or import existing dashboard from Grafana dashboard website.

Here I m going to import it. Click on the Menu → dashboard → New Drop down → Import.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ex5G7ANc6s5SvhiskNiCWg.png)

Now we can download a JSON or just provide the ID. I m going to use ID 7587. Click on Load button. On the next page select the datasource as Prometheus.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*rTzZ_Xqz1ptxDoYQbwwYpQ.png)


![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sJLvn1oDvGJSuLDGofehBw.png)

Well look what we have here. We get various information about the websites.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Z4wkJcl3x_bENL-fFH4mSA.png)

Hope you found this useful. Thanks for reading.


<!-- [**Checkout more on monitoring and o11y →**](/blogs/#o11y) -->

[Send Email Alerts using Prometheus AlertManager]({{< relref "prometheus" >}})


[Visualize Your Website Metrics — Blackbox Exporter and Grafana]({{< relref "alertmanager" >}})`,__vite_glob_0_40=`---
date: '2026-06-02T19:30:10+05:30'
draft: false
title: 'Observability 101: Understanding Metrics, Traces and Logs'
description: Part 1 - Get to know the 3 pillars and 4 golden signals of distrubuted observability
cover: https://i.ibb.co/Qjqd7Syh/x.jpg
tags:
- monitoring
- observability
- o11y
- devops
- opentelemetry
- otel
series:
- Observability
series_order: 1
categories:
- Observability & Monitoring
url: /blogs/monitoring/observability/
aliases:
- /blogs/monitoring/observabilty/
---

# Introduction

Most engineers encounter observability only after something breaks.

You are deep in the zone on a new feature when an urgent incident gets escalated. The report from customer support is notoriously vague:

\`\`\`text
"The website is slow."
"Checkout is failing."
"The API is timing out."
\`\`\`

The challenge in modern systems is rarely fixing the bug once you find it. The real headache is finding where the problem lives in the first place.

Modern applications are highly distributed. A single user action - like clicking "Place Order" - might travel through a frontend, a checkout service, a payment gateway, a database, a cache, and a third-party shipping API before returning a response. When a request slows down or fails, identifying the root cause across this massive web of dependencies is incredibly difficult.

Observability exists to solve this problem. It helps us answer one fundamental question:

> What is actually happening inside my system right now?

# Monitoring vs. Observability

Many engineers use these terms interchangeably, but they represent two different operational mindsets.

Monitoring focuses on known failure modes. It watches specific metrics and alerts you when predefined thresholds are crossed (e.g., CPU usage exceeds 90%, or the HTTP error rate hits 5%). It answers the question:

> Did a known problem happen?

Observability goes further. It gives you the power to debug systems from the outside without deploying new code, helping you navigate unknown failure modes. It answers the question:

> Why did this problem happen?

> Monitoring tells you WHEN a system is struggling. Observability tells you WHY.

# What Is Telemetry?

To observe a system, you need data. Telemetry is the operational data generated and emitted by software while it runs. It includes events like a request starting, a database query taking 120ms, or a payment gateway timing out.

Telemetry is the raw material of observability. Everything we infer about our application's health comes directly from it. In modern architectures, engineers often evaluate system health using the Four Golden Signals and collect telemetry through three primary forms: Metrics, Traces, and Logs.

# The Four Golden Signals

Introduced in Google's Site Reliability Engineering (SRE) book, the Four Golden Signals are the most critical elements to measure for any user-facing service.

{{< figure src="https://i.ibb.co/TB5Cp9wy/x.png" alt="4 golden signals" width="1000" height="600" title="The Four Golden Signals" >}}


## 1. Latency

Latency measures how long a request takes to complete for example 100ms, 220ms, 2s etc. Users rarely care about your infrastructure's memory consumption, they care about responsiveness.

When measuring latency, averages are an illusion. If 99 users experience a lightning-fast 10ms response, but 1 user experiences a brutal 10-second hang, your average latency sits at a reasonable-looking 110ms. The average completely hides the fact that 1% of your customer base is having a miserable experience.

To avoid this, engineering teams rely on latency percentiles:

### p50 (Median)

The exact middle of your data. 50% of requests are faster than this, and 50% are slower. It represents your typical user experience.

### p95 / p99 (Tail Latency)

The thresholds showing what the worst 5% or 1% of your users are experiencing. Production teams monitor these closely to isolate and fix performance bottlenecks before they spread.

## 2. Traffic

Traffic measures the demand being placed on your system. This is typically quantified by metrics like HTTP requests per second, database queries per second, or concurrent messages processing in a queue. Traffic provides vital context: high latency during a traffic spike points to a capacity bottleneck, while high latency during low traffic usually points to a software bug.

## 3. Errors

Errors measure the rate of requests that fail. This includes explicit failures (like HTTP 500 Internal Server Errors), implicit failures (like an HTTP 200 that returns the wrong payload), and policy failures (like a response taking longer than a 2-second timeout configuration).

## 4. Saturation

Saturation measures how close a specific system resource is to being completely exhausted. It tracks things like CPU utilization, memory allocation, disk I/O, or thread pool constraints. Saturation is a leading indicator of trouble; as resources approach 100% capacity, latency percentiles almost always begin to degrade rapidly.

> Note: To make the concepts easier to understand, this article uses a sample e-commerce application composed of multiple services such as Frontend, Cart, Checkout, Payment, Product Catalog, and databases. Rather than using generic examples like "Service A" and "Service B", we'll refer to these services directly when explaining traces, spans, logs, and observability concepts.

# The Three Pillars of Observability

To track these golden signals, modern systems emit three distinct types of telemetry: Metrics, Traces, and Logs.

{{< figure src="https://i.ibb.co/svgV5dnB/x.png" alt="3 pillars" width="1000" height="600" title="The 3 pillars" >}}


## 1. Metrics (How many? How much?)

Metrics are numeric values that tell us how many, how much, how often. For example how much of cpu, memory are in use.

\`\`\`text
CPU = 73%
Memory = 8GB
Requests/sec = 250
\`\`\`

Think of them as Numbers + Time collected over time. They are highly structured, incredibly efficient to store, and perfect for real-time alerting and dashboarding.

Modern systems like Prometheus store metrics as a time series, which consists of a metric name, key-value pairs called labels (or dimensions), and the numeric values over time.

\`\`\`text
http_requests_total{service="checkout", status="500"}  | Value: 42
\`\`\`

Metrics tell us Something is wrong, but they not necessarily why.

{{< figure src="https://i.ibb.co/848J50Hm/x.png" alt="4 golden signals" width="1000" height="600" title="metrics" >}}

# Metrics Deep Dive

Most modern metric systems store data as time series. A time series consists of:

\`\`\`text
Metric Name + Labels + Values over Time
\`\`\`

Example:

\`\`\`text
http_requests_total{service="checkout"}
\`\`\`

This is one time series.

Change the label:

\`\`\`text
http_requests_total{service="payment"}
\`\`\`

Now it becomes a different time series.

This idea is fundamental to systems such as Prometheus.

## Labels

Labels are dimensions attached to metrics.

Examples:

\`\`\`text
service=payment
region=ap-south-1
status=500
\`\`\`

Labels allow filtering, grouping, and aggregation.

Without labels " requests=1000" is not very useful.

With labels:

\`\`\`text
requests{service="payment"}
\`\`\`

Much more useful.

Labels transform raw numbers into meaningful telemetry.

## Cardinality

Every unique label combination creates a new time series.

Example:

\`\`\`text
service=checkout
service=payment
service=cart
\`\`\`

Three series. Now imagine:

\`\`\`text
user_id=1
user_id=2
user_id=3
...
user_id=1000000
\`\`\`

One million series. This is called high cardinality. High-cardinality metrics are one of the most common causes of performance and storage problems.

## Core Metrics Types

**Counter:** A value that only goes up (e.g., total_requests_received). It resets to zero only if the application restarts.

**Gauge:** A value that can fluctuate up and down fluidly (e.g., current_memory_usage or cpu_temperature).

**Histogram:** Measures the statistical distribution of events (like request durations) by sorting them into configurable data buckets. This is exactly how complex backend systems calculate p95 and p99 latencies efficiently at scale.

***Summary:***

Similar to a histogram, but calculates percentiles directly on the client application side rather than waiting for the central monitoring server to process the raw buckets.

# 2. Traces (Where is it happening?)

While metrics tell you that your application's error rate is spiking, a distributed trace tells you exactly where the request is breaking down across your infrastructure. A trace represents the end-to-end journey of a single user request through your entire network of services.

{{< figure src="https://i.ibb.co/BVtwRnGT/x.png" alt="traces" width="1000" height="600" title="Traces" >}}

Imagine a customer placing an order. The request travels through:

\`\`\`text
Frontend
 ↓
Checkout
 ↓
Payment
 ↓
Database
\`\`\`

Tracing records that journey.

Example:

\`\`\`text
Frontend     100ms
 ├── Checkout   50ms
 └── Payment   800ms
\`\`\`

Immediately we know "Payment" is slow.

Tracing is the foundation of debugging distributed systems.

## Span

A span is a single unit of work.

Examples:

- Database Query
- Cache Lookup
- HTTP Request
- Payment Processing

A span typically contains:

- Name
- Start Time
- End Time
- Duration
- Status
- Attributes

Think of a span as A timed operation.

## Trace vs Span

A trace contains many spans.

Example:

\`\`\`text
Frontend Request
 ├── Product Catalog Call
 ├── Recommendation Call
 └── Payment Call
\`\`\`

Each operation is a span. Together they form a trace.

A trace is the complete request journey while span is one step within that journey.

## Parent and Child Spans

Spans can create other spans for example Frontend initiated checkout, Frontend = Parent Span and Checkout = Child Span

\`\`\`text
Frontend
  ↓
Checkout
\`\`\`

Frontend initiated Checkout. Tracing systems use these relationships to reconstruct request flows.

## Trace ID

Every trace has a unique identifier.

Example:

\`\`\`text
trace_id = abc123
\`\`\`

All spans belonging to the same request share this identifier.

## Span ID

Every span has its own unique identifier.

\`\`\`text
span_id = xyz789
\`\`\`

## Parent Span ID

When a span creates another span, the child stores the parent's span identifier.

\`\`\`text
Trace ABC123
Frontend (Span A)
  ↓
Checkout (Span B)
  ↓
Payment (Span C)
\`\`\`

This relationship allows tracing systems to reconstruct request hierarchies.

## Context Propagation

How does one service (Payment) know it belongs to the same request?

The answer is context propagation.

Suppose:

\`\`\`text
Frontend
 ↓
Checkout
 ↓
Payment
\`\`\`

The Trace ID and related metadata are passed between services.

Without propagation:

\`\`\`text
Frontend Trace
Checkout Trace
Payment Trace
\`\`\`

appear unrelated.

With propagation, becomes one connected trace.

\`\`\`text
Frontend
 ↓
Checkout
 ↓
Payment
\`\`\`

This mechanism is what makes distributed tracing possible.

# 3. Logs (What exactly happened?)

Metrics tell us that something happened. Traces tell where the issue originates but Logs tell us what exactly happened.

{{< figure src="https://i.ibb.co/pr11Ss4m/x.png" alt="logs" width="1000" height="600" title="logs" >}}


\`\`\`text
2025-01-01 10:00:00 INFO User logged in
2025-01-01 10:00:01 ERROR Payment timeout
2025-01-01 10:00:02 ERROR Database connection failed
\`\`\`

Metrics might tell us:

\`\`\`text
Payment Errors = 500
\`\`\`

Logs explain why those errors occurred. It provide the most detailed level of information, granular, timestamped record of an isolated event. They represent the definitive story of an execution path.

\`\`\`text
2026-06-02 14:10:05 ERROR [payment-service] Line 42:
Credit card processing failed.
Reason: Connection refused by gateway.
\`\`\`

While storing logs for billions of successful requests is expensive and hard to query efficiently, a detailed error log is completely indispensable when you need to know the precise exception or code block that caused a transaction to fail.

# Correlation: Putting It All Together

The real power of observability appears when metrics, traces, and logs work together.

Metric tells us latency suddenly increases.

Traces tell us Payment service is slow.

Logs tell us Database connection timeout.

The ability to move between metrics, traces, and logs while investigating the same incident is called correlation.

Modern observability platforms are built around this idea.

When investigating a production issue:

- Metrics answer: Is there a problem?
- Traces answer: Where is the problem?
- Logs answer: What exactly happened?

Observability is not about collecting more telemetry. It is about reducing the time required to understand and resolve production issues.

By connecting these layers, you drastically cut down your Mean Time to Resolution (MTTR), transforming confusing, out-of-context charts into a clear window showing exactly how your distributed applications are behaving in the wild.

# Next: OpenTelemetry

Throughout this article, we've focused on understanding observability concepts rather than specific tools.

In modern distributed systems, OpenTelemetry (OTel) has emerged as the industry standard for generating, transporting, and processing telemetry.

Whether telemetry ultimately ends up in Prometheus, Jaeger, OpenSearch, Grafana, New Relic, Datadog, or another observability platform, OpenTelemetry is often the foundation that makes it possible.

Understanding OpenTelemetry is becoming an essential skill for engineers working with modern cloud-native systems.

In the next article, we'll move from concepts to implementation and explore OpenTelemetry along with the tools commonly used to collect, store, and visualize telemetry.

<!-- [**Checkout more on monitoring and o11y →**](/blogs/#o11y) -->
`,__vite_glob_0_41=`---
date: '2026-06-08T09:10:10+05:30'
draft: false
title: 'Hands-On OpenTelemetry: Prometheus, Jaeger, Grafana and the OTel Demo'
description: Part 2 - Explore Prometheus, Jaegar and Grafna in details for distributed metrics
cover: https://i.ibb.co/TxQpjhPB/x.jpg
tags:
- monitoring
- observability
- o11y
- devops
- opentelemetry
- otel
series:
- Observability
series_order: 2
categories:
- Observability & Monitoring
---

## Preface

In the [**_previous article_**]({{< relref "observability" >}}), we covered the core observability concepts theoretically. The next step is exploring them practically using the OpenTelemetry Demo application.

The goal here is not to memorize PromQL syntax, but to understand how telemetry actually appears inside a real observability platform. So, let's get started.

## Cloning the Repository

The OpenTelemetry Demo repository already contains a complete observability stack including:

* OpenTelemetry Collector
* Prometheus
* Jaeger
* OpenSearch
* Grafana

Clone the repository:

\`\`\`bash
git clone https://github.com/open-telemetry/opentelemetry-demo.git

cd opentelemetry-demo
\`\`\`

## Starting the Observability Stack

The demo ships with multiple Docker Compose files. Start the stack by ruuning it using these 2 main compose files:

\`\`\`bash
docker compose -f compose.yaml -f compose.observability.yaml up -d
\`\`\`

This starts:

* frontend application
* OpenTelemetry Collector
* Prometheus
* Jaeger
* OpenSearch
* Grafana

Verify containers:

\`\`\`bash
docker ps
\`\`\`

Expected containers include:

\`\`\`text
frontend-proxy
otel-collector
prometheus
jaeger
opensearch
grafana

and more container of the demo application
\`\`\`

## Understanding the Architecture

Telemetry flow in the demo looks like:

{{< figure src="https://i.ibb.co/9mhr7kvC/x.png" alt="otel arch" width="1000" height="600" title="Telemetry flow with Otel" >}}


The OpenTelemetry Collector acts as the central telemetry pipeline. Applications send telemetry using OTLP. The Collector processes telemetry and exports it to different backends.

## Exploring the Docker Compose File

The main observability infrastructure is defined in compose.observability.yaml

This file defines:

* Prometheus
* Jaeger
* OpenSearch
* Grafana
* OTel Collector

along with:

* ports
* mounted configs
* startup commands
* networking

This is essentially the infrastructure wiring for the observability stack.

## Understanding the Collector Configuration

The OpenTelemetry Collector is a vendor-neutral telemetry pipeline that receives, processes, and exports telemetry data. In this demo, the Collector acts as the central hub between the application and the observability backends.

Common alternatives include:

* Grafana Alloy
* Fluent Bit
* Fluentd
* Vector

The telemetry pipeline itself is defined inside src/otel-collector/otelcol-config.yml

This file contains:

\`\`\`yaml
receivers:
processors:
exporters:
service:
\`\`\`

The Collector:

* receives telemetry
* processes telemetry
* exports telemetry

The demo loads multiple collector configs together using multiple \`--config\` arguments from Docker Compose.

One important component inside the Collector configuration is:

\`\`\`yaml
connectors:
  span_metrics:
\`\`\`

This converts traces/spans into Prometheus metrics. That is why Prometheus later exposes metrics such as:

\`\`\`text
traces_span_metrics_calls_total
\`\`\`

These metrics are generated from spans.

## Understanding the Prometheus Configuration

The demo also includes /etc/prometheus/prometheus-config.yaml

This is different from traditional Prometheus scraping setups.

Instead of primarily scraping \`/metrics\` endpoints, Prometheus in this setup is integrated with OpenTelemetry telemetry pipelines.

Important section:

\`\`\`yaml
otlp:
  promote_resource_attributes:
\`\`\`

This converts OpenTelemetry resource attributes into Prometheus labels.

Example:

\`\`\`text
service.name → service_name
\`\`\`

This is why metrics later contain labels such as:

\`\`\`text
service_name
service_version
host_name
status_code
span_kind
\`\`\`

## Accessing the Demo and Observability Tools

Once the stack is running, the OpenTelemetry Demo exposes the storefront and observability tools through a frontend proxy running on port \`8080\`.

Rather than listing every endpoint here, refer to the official documentation screenshot below, which shows the currently available URLs for the demo application, Grafana, Jaeger, the load generator, and other supporting tools.

{{< figure src="https://i.ibb.co/5Wz6mgQc/x.png" alt="otel apps" width="1000" height="600" title="Source: otel docs" >}}

The OpenTelemetry Demo documentation also explains how the proxy routes requests and how to change the default port if required.

Open the demo application at ***'http://localhost:8080'*** and generate telemetry by:

* browsing products
* refreshing pages
* adding items to cart
* checking out

Without traffic, metrics, traces, and logs will remain mostly empty.

The demo also includes a load generator service that continuously produces traffic. However, I usually stop the load-generator container while learning a new observability tool. Exploring the application manually generates smaller and more meaningful request flows, making it easier to understand metrics, traces, and service interactions without the noise of constant background traffic.

{{< figure src="https://i.ibb.co/FqCtr8cM/x.png" alt="otel demo app store" width="1000" height="600" title="Demo Store APP" >}}

> Note: The Demo includes a feature flag management interface powered by Flagd.

The UI is available through the frontend proxy and allows various behaviors to be enabled or disabled without modifying application code.

{{< figure src="https://i.ibb.co/b5nsnfVp/x.png" alt="Feature Flag UI" width="1000" height="600">}}

# Prometheus

Prometheus is an open-source time-series database and monitoring system.

It stores metrics, executes PromQL queries, and powers alerting and dashboards.

Common alternatives include:

* VictoriaMetrics
* InfluxDB
* Datadog Metrics
* New Relic

Prometheus is available at ***'http://localhost:9090'***. Try this query first: ***traces_span_metrics_calls_total***

{{< figure src="https://i.ibb.co/hFMMGN4Q/x.png" alt="prom data" width="1000" height="600">}}


### Understanding a Prometheus Metric

Example output:

\`\`\`text
traces_span_metrics_calls_total{
  service_name="recommendation",
  span_kind="SPAN_KIND_CLIENT",
  span_name="flagd.evaluation.v1.Service/ResolveBoolean"
}
\`\`\`

Prometheus metrics consist of:

\`\`\`text
metric_name{labels}
\`\`\`

Metric name:

\`\`\`text
traces_span_metrics_calls_total
\`\`\`

Labels:

\`\`\`text
service_name, span_kind, span_name, status_code
\`\`\`

These labels originate from OpenTelemetry resource attributes and span metadata.


### Understanding Span Kinds

Different span kinds appeare:

\`\`\`text
SPAN_KIND_SERVER, SPAN_KIND_CLIENT, SPAN_KIND_INTERNAL
\`\`\`

Meaning:

\`\`\`text
SERVER   → incoming requests | CLIENT   → outgoing dependency calls | INTERNAL → internal service processing
\`\`\`

This was the first point where tracing concepts became visible inside Prometheus metrics.

### Counters and Rates

The metric: **'traces_span_metrics_calls_total'** is a counter. Counters only increase.

To understand traffic rate, try the query

\`\`\`promql
rate(traces_span_metrics_calls_total[5m])
\`\`\`
This converts counters into, opeartions per second, which is significantly more useful for observability analysis.

### Aggregating by Service

The next query using sum groups telemetry per service. This reduces noisy per-span telemetry into a high-level service traffic view.

Example:

\`\`\`promql
sum by(service_name)(
  rate(traces_span_metrics_calls_total[15m])
)
\`\`\`

This shows which services were most active.

{{< figure src="https://i.ibb.co/jPTYkpRj/x.png" alt="prom data" width="1000" height="600">}}

### Histograms and Latency

Latency metrics appear as histogram buckets:

\`\`\`promql
traces_span_metrics_duration_milliseconds_bucket
\`\`\`

These metrics introduced the \`le\` label:

\`\`\`text
le = less than or equal to
\`\`\`

Example:

\`\`\`text
le="8"
\`\`\`

means:

\`\`\`text
Requests completed within 8ms
\`\`\`

Histograms allow Prometheus to calculate percentiles such as:

* p50
* p95
* p99

### Calculating p95 Latency

The following query calculates p95 latency per service:

\`\`\`promql
histogram_quantile(
  0.95,
  sum by(le, service_name)(
    rate(
      traces_span_metrics_duration_milliseconds_bucket[5m]
    )
  )
)
\`\`\`

This reveals slow services such as:

\`\`\`text
checkout, curreny conversion
\`\`\`

With Prometheus we could now see which services are slow but not yet why are they slow? That investigation belongs to tracing systems such as Jaeger.

### Filtering Errors

Error rates can be explored using:

\`\`\`promql
sum by(service_name)(
  rate(
    traces_span_metrics_calls_total{
      status_code="STATUS_CODE_ERROR"
    }[5m]
  )
)
\`\`\`

{{< figure src="https://i.ibb.co/X6cptbb/x.png" alt="prom data" width="1000" height="600">}}

This showes which services were actively generating errors.

Prometheus time series may still appear with value \`0\` because the time series exists historically even if no recent errors occurred.


### Filtering Individual Services

Specific services can be isolated using label selectors:

\`\`\`promql
sum by(span_kind)(
  rate(
    traces_span_metrics_calls_total{
      service_name="frontend"
    }[5m]
  )
)
\`\`\`

This shows how the frontend service behaved internally:

* receiving requests
* making dependency calls
* performing internal processing

### Key Observations

Prometheus metrics are:

* time-series data
* identified by labels
* aggregated using PromQL

The OpenTelemetry demo also demonstrates an important modern observability concept:

\`\`\`text
Metrics generated from traces
\`\`\`

using the \`span_metrics\` connector inside the OpenTelemetry Collector.

By the end of the Prometheus exploration, the following concepts become much clearer practically:

* metrics
* labels
* counters
* rates
* histograms
* percentiles
* filtering
* aggregation
* service-level telemetry
* span-derived metrics

The next step is understanding traces visually using Jaeger.

# Jaeger

Jaeger is a distributed tracing platform used to visualize requests as they travel across multiple services.

It helps identify latency bottlenecks, understand service dependencies, and troubleshoot request flows.

Common alternatives include:

* Grafana Tempo
* Zipkin
* Elastic APM
* Datadog APM
* New Relic Distributed Tracing

The OpenTelemetry demo also exposes Jaeger through the frontend proxy, ***"http://localhost:8080/jaeger/ui/"***

## Exploring Distributed Tracing with Jaeger

Prometheus successfully answered questions such as: Which services are slow? Which services are generating errors? Which services receive the most traffic? However, metrics alone could not explain: Why is checkout slow? Which dependency caused the delay? What exactly happened during a request?

This is where distributed tracing becomes useful. Metrics summarize behavior, Traces explain behavior.

### Understanding Traces and Spans

A trace represents the complete journey of a request through a distributed system.

Example:

\`\`\`text
User Checkout Request
        ↓
Frontend
        ↓
Checkout
        ↓
Cart
        ↓
Product Catalog
        ↓
Currency
        ↓
Payment
        ↓
Email
\`\`\`

Everything that happens for this request belongs to a single trace. Each individual operation inside that trace is called a span.

Example:

\`\`\`text
Trace
 ├── Frontend Span
 ├── Checkout Span
 ├── Cart Span
 ├── Product Catalog Span
 ├── Currency Span
 ├── Payment Span
 └── Email Span
\`\`\`

A trace is therefore a collection of spans.

After generating traffic by browsing products and placing orders, traces will be immediately available inside the Jaeger search interface.

Searching for the checkout service quickly reveals complete order execution flows.

### Reading a Trace Timeline

To explore tracing in practice, start by selecting a checkout trace from the search results.

For example:

\`\`\`text
Service: checkout
Operation: PlaceOrder
\`\`\`

Open one of the traces to view its execution timeline.

{{< figure src="https://i.ibb.co/PsPTPVd8/x.png" alt="jaegar search" width="1000" height="600" title="Jaeger trace serach" >}}

Each horizontal bar represents a span. The width of the bar represents duration.

The nesting of spans represents relationships between operations.

{{< figure src="https://i.ibb.co/6Jf6XSsX/x.png" alt="jaegar search" width="1000" height="600">}}


The timeline effectively becomes a visual execution diagram of the request.

Instead of reading logs line by line, the entire request flow becomes visible immediately.

### Parent and Child Spans

Expanding the checkout trace reveals a hierarchy of spans.

For example:

\`\`\`text
CheckoutService/PlaceOrder
\`\`\`

acts as a parent span.

Inside it are child spans such as:

\`\`\`text
GetCart

GetProduct

ConvertCurrency

GetShippingQuote

ChargePayment

SendOrderConfirmation
\`\`\`

{{< figure src="https://i.ibb.co/QjJYgB8C/x.png" alt="jaegar search" width="1000" height="600" >}}

This hierarchy makes it possible to understand which operations belong to a larger workflow.

The checkout service orchestrates multiple downstream dependencies to complete the order.

### Understanding Span Kinds

Selecting an individual span reveals additional metadata.

One useful field is:

\`\`\`text
span.kind
\`\`\`

Common values include:

\`\`\`text
SPAN_KIND_SERVER

SPAN_KIND_CLIENT

SPAN_KIND_INTERNAL
\`\`\`

Meaning:

\`\`\`text
SERVER
Incoming request handled by a service

CLIENT
Outgoing dependency call

INTERNAL
Internal processing inside a service
\`\`\`

These values help explain the role each operation plays during request execution.

### CLIENT and SERVER Spans

A single service call typically generates two spans.

For example:

\`\`\`text
Frontend
    ↓
Checkout
\`\`\`

The frontend service generates a CLIENT span because it initiates the request.

The checkout service generates a SERVER span because it receives the request.

Conceptually:

\`\`\`text
Frontend
  CLIENT → CheckoutService/PlaceOrder

Checkout
  SERVER → CheckoutService/PlaceOrder
\`\`\`

Together these spans describe both sides of the same network call.

### Trace IDs and Span IDs

Every trace contains a unique Trace ID.

Every span contains its own Span ID.

The Trace ID links all spans belonging to the same request.

Span IDs uniquely identify individual operations.

These identifiers become especially useful later when correlating traces with logs.


### Investigating Slow Requests

One checkout trace may show a total duration of approximately:

\`\`\`text
1.2 seconds
\`\`\`

At first glance, this makes the checkout operation appear slow.

However, expanding the trace reveals how the time is distributed across downstream operations.

For example:

* cart retrieval
* product lookup
* currency conversion
* shipping calculation
* payment processing
* email generation

Tracing therefore answers a much more useful question than metrics alone:

\`\`\`text
Where is the latency occurring?
\`\`\`

### Service Dependencies Become Visible

The checkout trace also reveals service relationships directly.

For example:

\`\`\`text
Checkout
    ↓
Cart

Checkout
    ↓
Product Catalog

Checkout
    ↓
Currency

Checkout
    ↓
Payment

Checkout
    ↓
Shipping
\`\`\`

Without reading source code, it becomes possible to understand how services interact with one another.

This is particularly useful when exploring unfamiliar systems.

{{< figure src="https://i.ibb.co/TqKstmDC/x.png" alt="jaegar search" width="800" height="400" >}}


### Finding Bottlenecks

A practical tracing workflow is:

\`\`\`text
Start with the largest span.

Expand child spans.

Identify where time is spent.

Continue drilling down until the slow dependency is found.
\`\`\`

Metrics identify that a problem exists.

Tracing identifies where the problem exists.

# OpenSearch

OpenSearch is used as the log storage backend.

Responsibilities:

stores application logs
indexes log data
supports searching and filtering

Common alternatives:

Elasticsearch
Loki

## Exploring Logs with OpenSearch

In the OpenTelemetry Demo, logs are exported through the OpenTelemetry Collector and stored inside OpenSearch indices.

The architecture looks like:

\`\`\`text
Application
    ↓
OTel SDK
    ↓
OTel Collector
    ↓
OpenSearch
    ↓
OpenSearch Dashboards
\`\`\`

### Enabling OpenSearch Dashboards

Unlike Jaeger and Grafana, OpenSearch Dashboards is not enabled by default in the demo.

The dashboard container must first be added to the observability stack (compose.observability.yaml) right after the opensearch section.

\`\`\`yaml
  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:latest
    container_name: opensearch-dashboards
    restart: unless-stopped
    ports:
      - "5601:5601"
    environment:
      - OPENSEARCH_HOSTS=["http://opensearch:9200"]
      - DISABLE_SECURITY_DASHBOARDS_PLUGIN=true <-- This disbales login

    depends_on:
      opensearch:
        condition: service_healthy
\`\`\`

After restarting the observability stack, OpenSearch Dashboards shoul available at **'http://localhost:5601'**

{{< figure src="https://i.ibb.co/xqt3s1Y2/x.png" alt="os db" width="1000" height="800" >}}

Unlike Jaeger, OpenSearch initially contains raw indices and documents rather than traces or dashboards.

The first step is creating a data view.

### Creating a Data View

Open Manage menu and then index pattern and click on Create index pattern.

Serach for otel-logs-*and select @timestamp as the time field.
{{< figure src="https://i.ibb.co/DD5BvTBh/x.png" alt="os db" width="1000" height="800" >}}

This tells OpenSearch Dashboards which indices should be searched when exploring logs.

### Discovering Logs

After creating the data view, open Discover and select: otel-logs-*

The interface displays:

* a log volume histogram
* searchable log documents
* timestamps
* indexed fields

{{< figure src="https://i.ibb.co/NdWJt8TD/x.png" alt="os db" width="1000" height="800" >}}

Each row represents a single log document stored in OpenSearch.

Unlike traces, which show request flow, logs represent individual events generated by services.

### Understanding a Log Document

Expanding a document reveals the fields captured by OpenTelemetry.

Example:

\`\`\`text
resource.service.name
body
severity.text
severity.number
traceId
spanId
@timestamp
\`\`\`

Meaning:

\`\`\`text
resource.service.name → service generating the log

body → log message

severity.text → INFO, WARN, ERROR

traceId → request identifier

spanId → operation identifier

@timestamp → event time
\`\`\`

This makes it possible to identify:

* who generated the log
* what happened
* when it happened
* which request generated it

### Filtering Logs by Service

Logs can be filtered using search queries.

For example:

\`\`\`text
resource.service.name:checkout
\`\`\`

returns logs generated by the checkout service.

{{< figure src="https://i.ibb.co/CK0t5DLf/x.png" alt="os db" width="1000" height="800" >}}


This is similar to filtering Prometheus metrics using labels.

Instead of querying telemetry metrics, OpenSearch is querying log documents.

### Correlating Logs with Traces

One of the most useful OpenTelemetry features is trace correlation.

A log document contains:

\`\`\`text
traceId
spanId
\`\`\`

These values match the identifiers visible inside Jaeger.

Searching for a specific trace ID:

\`\`\`text
traceId:b0ca45069ad74d8870a4c655f3129612
\`\`\`

returns all logs generated during that request.

This allows navigation from:

\`\`\`text
Trace
    ↓
Related Logs
\`\`\`

which is one of the core observability workflows.

### Exploring Errors

Logs can also be filtered by severity.

Example:

\`\`\`text
severity.text:ERROR
\`\`\`

or

\`\`\`text
severity.text:WARN
\`\`\`

During exploration, one of the logs revealed a collector error:

\`\`\`text
unable to dial:
lookup kafka on 127.0.0.11:53:
no such host
\`\`\`

Expanding the document exposed additional diagnostic information:

\`\`\`text
attributes.error

attributes.code.file.path

attributes.code.function.name

attributes.code.line.number

attributes.code.stacktrace
\`\`\`

{{< figure src="https://i.ibb.co/4n9QnLYM/x.png" alt="os db" width="1000" height="800" >}}

This demonstrates one of the biggest strengths of logs.

While traces show where a failure occurs, logs often explain why it occurred.

### Key Observations

OpenSearch stores logs as searchable documents.

During exploration we learned how to:

* create a data view
* search indices
* inspect log documents
* filter by service
* filter by severity
* inspect error details
* correlate logs with traces using trace IDs

Together with Prometheus and Jaeger, OpenSearch completes the third pillar of observability:

\`\`\`text
Metrics → Is there a problem?

Traces → Where is the problem?

Logs → What exactly happened?
\`\`\`

# Grafana

Grafana provides dashboards and visualization capabilities. It helps visualize metrics, logs, and traces, while also enabling the creation of operational dashboards.

Unlike Prometheus, Jaeger, and OpenSearch, Grafana is not a core observability backend. It does not store telemetry itself. Instead, it connects to backends ('data source' in grafana terminology) and provides a unified interface for exploring and visualizing telemetry data.

Several alternatives exist in this space, with Kibana from the ELK stack being one of the most widely used.

## Exploring Grafana

Unlike Prometheus, Jaeger, and OpenSearch, Grafana is not a telemetry backend. Instead, it acts as a visualization layer on top of multiple observability systems.

In the OpenTelemetry Demo, Grafana comes preconfigured with multiple data sources including:

* Prometheus for metrics
* Jaeger for traces
* OpenSearch for logs

This allows telemetry from different systems to be viewed from a single interface.

### Data Sources

The demo exposes Grafana through the frontend proxy so open it at **'http://localhost:8080/grafana/'**. Now navigate to connections - data source - available data source.

{{< figure src="https://i.ibb.co/8D2MH1mW/x.png" alt="os db" width="1000" height="800" >}}

### Dashboards

The demo ships with several preconfigured dashboards including:

* APM Dashboard (Jaeger, Prometheus, OpenSearch)
* Spanmetrics Demo Dashboard
* OpenTelemetry Collector Dashboard

One particularly useful dashboard is:

\`\`\`text
APM Dashboard (Jaeger, Prometheus, OpenSearch)
\`\`\`
This dashboard combines metrics, traces, and logs into a single operational view. At the top you can view the sources for all the streams and select a service of the app to view its data.

The dashboard visualizes the RED metrics commonly used for service monitoring:

\`\`\`text
Rate
Errors
Duration
\`\`\`
{{< figure src="https://i.ibb.co/Kxtj6PDZ/x.png" alt="Grafana APM Dashboard" width="1000" height="600" title="red metrics">}}

{{< figure src="https://i.ibb.co/ZpW3x1PN/x.png" alt="Grafana APM Dashboard" width="1000" height="600" title="logs, traces">}}

These metrics provide a quick overview of service health and are derived from the same telemetry previously explored directly inside Prometheus.

Grafana does not replace Prometheus, Jaeger, or OpenSearch. Instead, it provides a more user-friendly way to visualize and correlate telemetry across multiple backends.

For learning purposes, exploring the individual tools directly is often more valuable because it helps build a deeper understanding of metrics, traces, and logs. Once those concepts become familiar, Grafana serves as a convenient layer for operational monitoring and dashboarding.

At this point, the complete observability stack becomes much easier to understand:

\`\`\`text
Prometheus → Metrics

Jaeger → Traces

OpenSearch → Logs

Grafana → Visualization and Dashboards
\`\`\`
Together these components provide a practical introduction to modern observability using OpenTelemetry.

## Wrapping Up

This article focuses on understanding how telemetry appears inside real observability tools rather than learning every query or dashboard.

The Otel Demo app provides plenty for further exploration. Try enabling failure-related feature flags, introducing latency, or stopping individual containers and then investigate the resulting behavior across the observability stack.

As an exercise, start with a failure and follow it through metrics, traces, and logs. Then explore how the same telemetry appears inside Grafana dashboards.

Another important takeaway is that OpenTelemetry is not tied to Prometheus, Jaeger, OpenSearch, or Grafana. By changing collector and exporter configurations, telemetry can be routed to many different observability backends without modifying application code.

In a future article, we'll move beyond the demo application and instrument our own application using OpenTelemetry to understand what is required to generate telemetry from scratch.

The more scenarios you experiment with, the easier it becomes to understand how modern observability platforms help diagnose and troubleshoot distributed systems.

<!-- [**Checkout more on monitoring and o11y →**](/blogs/#o11y) -->
`,__vite_glob_0_42=`---
date: '2026-06-20T07:45:10+05:30'
draft: false
title: Seeing Inside Amazon EKS with OpenTelemetry 🔍
description: Building a Cloud Native observability platform on Amazon EKS with OpenTelemetry, GitOps, Terraform, multi-backend telemetry, and Claude powered analysis
cover: https://i.ibb.co/pjgVNXn4/x.png
tags:
- monitoring
- o11y
- devops
- opentelemetry
- kubernetes
- aws
- cloud
- terraform
- new relic
- "Argo CD"
- EKS
series:
- Observability
series_order: 3
categories:
- Observability & Monitoring
---

## Why This Setup?

Before getting into the architecture, a few quick notes. Telemetry goes to both **New Relic** and **Honeycomb** to test OpenTelemetry's backend-independence promise and compare the two. New Relic wins on day-to-day usability — dashboards, APM, and alerts work intuitively. Honeycomb takes more getting used to, but its MCP server is where it genuinely shines: connected to Claude, you can ask plain-English questions against live telemetry — no NRQL or PromQL required. That's the part worth [***jumping to*** 👇](#ask-claude) first if you're short on time.

## Introduction

Observability has become a critical part of operating modern cloud-native applications. While application metrics, logs, and traces provide valuable insights, true observability also requires visibility into the Kubernetes platform itself.

In this project, I built a complete observability platform on Amazon EKS using OpenTelemetry, ArgoCD, Traefik, New Relic, and Honeycomb. The goal was to learn OpenTelemetry end-to-end while implementing GitOps practices and collecting telemetry from both applications and Kubernetes infrastructure.

## Architecture Overview

The platform consists of:

* Amazon EKS
* ArgoCD
* Traefik Ingress Controller
* OpenTelemetry Collector
* kube-state-metrics
* Node Frontend Service
* Python Orders Service
* Go Inventory Service
* New Relic
* Honeycomb

The OpenTelemetry Collector acts as the central telemetry pipeline and exports data to multiple observability backends.

{{< figure src="https://i.ibb.co/7JtYFk5k/x.jpg" alt="otel arch" width="1000" height="600" title="overall control flow architecture" >}}

## Project Structure

The project is split into two repositories.

The first repository, [{{< icon name="github" size="lg" >}} otel-labs](https://github.com/sagarkpanda/otel-labs), contains the application source code, OpenTelemetry instrumentation, Dockerfiles, and GitHub Actions workflows.
<!-- <a href="https://github.com/sagarkpanda/otel-labs" target="_blank" rel="noopener noreferrer">
  {{< icon name="github" size="lg" >}} otel-labs
</a> -->
The second repository, [{{< icon name="github" size="lg" >}} otel-labs-platform](https://github.com/sagarkpanda/otel-labs-platform), contains the infrastructure and Kubernetes platform configuration required to run those applications on Amazon EKS.

This separation follows a common GitOps pattern where application development and platform management are handled independently.

\`\`\`text
otel-labs
│
├── Source Code
├── Dockerfiles
├── OpenTelemetry Instrumentation
└── GitHub Actions

otel-labs-platform
│
├── Terraform
│   ├── VPC
│   ├── Amazon EKS
│   ├── Node Groups
│   └── Bootstrap Configuration
│
└── Kubernetes
    ├── ArgoCD Applications
    ├── Traefik
    ├── OpenTelemetry Collector
    ├── kube-state-metrics
    └── Application Manifests
\`\`\`

### Application Repository (otel-labs)

The application repository contains three microservices:

* Node Frontend
* Python Orders
* Go Inventory

Each service is instrumented using OpenTelemetry SDKs and exports telemetry using the OTLP protocol.

The repository also contains a GitHub Actions workflow that builds container images and publishes them to GitHub Container Registry (GHCR). Images are tagged with both a \`short commit hash\` and a \`latest\` tag, although the Kubernetes manifests always reference the immutable commit-based tag.

After publishing an image, the workflow updates the image tag in the platform repository's \`kustomization.yml\` using \`sed\`. The workflow then commits and pushes the change to the platform using the GitHub Actions bot account. ArgoCD detects the Git change during its next sync cycle and automatically deploys the new version. No manual \`kubectl apply\` commands are required, and Git remains the single source of truth.

\`\`\`text
Code Change
     │
     ▼
GitHub Actions
     │
     ▼
Build Container Images
     │
     ▼
Push Images to GHCR
     │
     ▼
Update Image Tag in
otel-labs-platform
\`\`\`

This means the application repository is responsible only for producing deployable artifacts, while the platform repository remains responsible for deployment.

{{< figure src="https://i.ibb.co/vvj3k2MF/x.jpg" alt="tag update" width="1000" height="600" title="GitHub Actions updating image tags in the platform repository" >}}

For local development, the entire application stack can be started using Docker Compose.

After creating a \`.env\` file from \`.env.example\`, run:

\`\`\`bash
docker compose up --build -d
\`\`\`

This launches all services together with the OpenTelemetry Collector, allowing telemetry to be exported to the configured observability backends.

### Platform Repository (otel-labs-platform)

The platform repository contains everything required to run the applications on Kubernetes.

\`\`\`text
terraform/
├── eks.tf
├── addons.tf
├── bootstrap.sh
└── ...

k8s/
├── argo-apps/
├── node-frontend/
├── python-orders/
├── go-inventory/
├── otel-collector/
└── kustomization.yml
\`\`\`

Terraform is responsible for infrastructure provisioning, while Kubernetes manifests are managed using GitOps through ArgoCD.

This separation allows infrastructure, platform services, and application workloads to evolve independently while remaining declarative.

## Setup AWS EKS with Terraform

The Kubernetes platform is hosted on Amazon EKS and provisioned entirely using Terraform.

The deployment creates:

* VPC
* Public Subnets
* Amazon EKS Control Plane
* Managed Node Group
* EKS Managed Addons

The managed addons installed are:

* VPC CNI
* CoreDNS
* kube-proxy


{{< figure src="https://i.ibb.co/2TCmmzd/x.jpg" alt="eks cluster" width="1000" height="600" title="eks cluster view" >}}

Using EKS managed addons simplifies upgrades and reduces operational overhead.

After Terraform finishes provisioning the cluster, it invokes a bootstrap script which performs the initial platform setup.

The bootstrap process:

1. Updates the local kubeconfig.
2. Creates the ArgoCD namespace.
3. Installs ArgoCD using Helm.
4. Creates the application namespace.
5. Applies observability secrets required by the OpenTelemetry Collector.

\`\`\`text
Terraform Apply
       │
       ▼
Amazon EKS Created
       │
       ▼
bootstrap.sh
       │
       ├── Update kubeconfig
       ├── Install ArgoCD
       ├── Create Namespaces
       └── Apply Secrets
\`\`\`

The secrets contain the credentials required by the OpenTelemetry Collector exporters to send telemetry to New Relic and Honeycomb.

A \`secrets.example.yml\` file is included in the repository as a reference, while the actual secrets file remains excluded from version control.

{{< figure src="https://i.ibb.co/nZbNyMg/x.jpg" alt="eks arch" width="1000" height="600" title="Amazon EKS platform architecture" >}}

## Installing ArgoCD

After the EKS cluster is provisioned, a GitOps controller is required to manage Kubernetes resources declaratively.

ArgoCD continuously monitors Git repositories and reconciles the cluster state to match the desired configuration stored in Git. This removes the need to manually apply manifests after every change and provides a centralized view of application deployments.

As part of the cluster bootstrap process, ArgoCD is installed automatically using Helm.

The bootstrap workflow performs:

1. Update kubeconfig
2. Create the ArgoCD namespace
3. Add the Argo Helm repository
4. Install ArgoCD
5. Apply observability secrets

\`\`\`bash
helm upgrade --install argocd \\
  argo/argo-cd \\
  -n argocd \\
  --set configs.params."server\\.insecure"=true
\`\`\`

## GitOps Deployment Approaches

ArgoCD supports multiple bootstrap patterns depending on how applications are organized and deployed.

Regardless of the approach used, ArgoCD remains responsible for continuously reconciling workloads and ensuring the cluster matches the desired state defined in Git.

### Option 1: Individual Application Manifests

Each ArgoCD Application can be created independently.

\`\`\`bash
kubectl apply -f traefik-app.yml
kubectl apply -f kube-state-metrics-app.yml
kubectl apply -f otel-collector-app.yml
kubectl apply -f node-frontend-app.yml
kubectl apply -f python-orders-app.yml
kubectl apply -f go-inventory-app.yml
\`\`\`

This approach provides maximum flexibility and is useful when deploying or troubleshooting applications individually.

### Option 2: Root Application (App of Apps)

A parent application manages a collection of child applications.

\`\`\`text
Root Application
      |
      +---- Traefik
      +---- kube-state-metrics
      +---- OpenTelemetry Collector
      +---- Node Frontend
      +---- Python Orders
      +---- Go Inventory
\`\`\`

Flow:

\`\`\`text
Install ArgoCD
      |
      v
Apply Root Application
      |
      v
ArgoCD Creates Child Applications
      |
      v
Applications Deploy Workloads
\`\`\`

This pattern is commonly known as the App of Apps pattern and provides a single entry point for deploying an entire platform stack.

The root application itself can also be applied automatically during cluster bootstrap, allowing workloads to be deployed immediately after the cluster becomes available.

### Option 3: Kustomize Bootstrap

The final implementation uses a Kustomize root directory that references all ArgoCD applications.

\`\`\`text
k8s/
├── argo-apps/
│   ├── traefik-app.yml
│   ├── kube-state-metrics-app.yml
│   ├── otel-collector-app.yml
│   ├── node-frontend-app.yml
│   ├── python-orders-app.yml
│   └── go-inventory-app.yml
\`\`\`

Everything can be deployed using:

\`\`\`bash
kubectl apply -k k8s
\`\`\`

Flow:

\`\`\`text
Install ArgoCD
      |
      v
Apply Kustomize Root
      |
      v
ArgoCD Applications Created
      |
      v
Applications Deploy Workloads
\`\`\`

This approach removes the need for a dedicated root application while still providing a single deployment entry point for the entire platform.

## Installing Traefik

A Kubernetes cluster requires an ingress controller to route external traffic to internal services.

Traefik is deployed through ArgoCD using the official Helm chart and automatically discovers Kubernetes Ingress resources. Whenever a new Ingress object is created, Traefik dynamically updates its routing configuration without requiring additional manual configuration.

\`\`\`yaml
source:
  repoURL: https://traefik.github.io/charts
  chart: traefik
\`\`\`

Within this platform, Traefik acts as the entry point for external traffic and routes requests to services running inside the cluster.

The node-frontend is exposed via Treafik Ingress. To view the ingress dns name run \`kubectl get ing -A\`. Then map that dns records to a CNAME record with your domain registrar.

{{< figure src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*4sEpzWN8j4uzq_cBakjbIQ.gif" alt="otel app" width="1000" height="600" title="otel app with ingress" >}}

## Exposing ArgoCD

After installation, the ArgoCD server is only accessible from within the cluster.

To provide browser access, a Kubernetes Ingress resource is created. Traefik detects the Ingress and automatically configures routing for the ArgoCD service. Apply the ingress resource under \`k8s/infra/argo/argo-ingress.yml\`, which also uses the same ingress created earlier for node app. Similarly create another CNAME record for argo ui.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
\`\`\`

{{< figure src="https://i.ibb.co/fdtzqTsV/x.jpg" alt="argo apps db" width="1000" height="600" title="Argo CD Apps Dashboard exposed with Ingress" >}}

## OpenTelemetry Collector

The OpenTelemetry Collector acts as the central telemetry pipeline for the platform. The collector is deployed as a DaemonSet to ensure node-local Kubernetes metrics are collected from every worker node in the cluster.

Instead of applications sending telemetry directly to observability platforms, traces, metrics, and logs are first sent to the collector. This provides a central location for processing, enrichment, filtering, and routing while keeping application instrumentation vendor-neutral.

The collector is responsible for:

* Receiving OTLP telemetry
* Collecting Kubernetes metrics
* Enriching telemetry with Kubernetes metadata
* Exporting telemetry to multiple backends

Telemetry flow:

\`\`\`text
Applications
      ↓
OTLP Receiver
      ↓
Processors
      ↓
Exporters
      ↓
New Relic / Honeycomb
\`\`\`

The same telemetry stream can be exported to multiple destinations simultaneously without modifying application code.

## Collecting Application Telemetry

The platform contains three sample services:

\`\`\`text
node-frontend
python-orders
go-inventory
\`\`\`

Each service is instrumented using OpenTelemetry SDKs and exports telemetry using OTLP.

Whenever a request flows through the application, traces, metrics, and logs are generated and sent to the OpenTelemetry Collector.

\`\`\`text
Application
      ↓
OTLP
      ↓
OpenTelemetry Collector
\`\`\`

By routing telemetry through the collector, applications remain independent of any specific observability vendor while still supporting multiple observability backends.


## Kubernetes Observability

Application telemetry provides visibility into application behavior, but understanding the health of the Kubernetes platform requires additional telemetry sources.

The OpenTelemetry Collector gathers Kubernetes telemetry from multiple components and APIs to provide visibility into nodes, pods, deployments, services, and overall cluster state.

### kubeletstats

Provides:

* Node Metrics
* Pod Metrics
* Container Metrics

\`\`\`text
kubelet
   ↓
kubeletstats receiver
\`\`\`

### k8s_cluster

Provides:

* Cluster State
* Kubernetes Events

\`\`\`text
Kubernetes API
       ↓
k8s_cluster receiver
\`\`\`

### kube-state-metrics

Provides:

* Deployments
* StatefulSets
* DaemonSets
* Services
* Replica Counts
* Pod Status

\`\`\`text
kube-state-metrics
        ↓
Prometheus Receiver
        ↓
OpenTelemetry Collector
\`\`\`

## Multi-Backend Observability

One of the primary benefits of OpenTelemetry is backend independence.

Telemetry can be exported to multiple observability platforms simultaneously while maintaining a single instrumentation strategy across applications and infrastructure.

In this platform, telemetry is exported to both New Relic and Honeycomb. Now we have telemetry data from both the apps and the k8s infrastructure and workloads.

> <small>Note: Create API keys for both platforms to be able to export data into them. For New Relic, create ingest license, for honeycomb create ingest api key </small>

### New Relic

New Relic provides a user-friendly interface with built-in dashboards, APM views, service maps, tracing, logging, and alerting capabilities. While Kubernetes metrics collected through OpenTelemetry are available and queryable using NRQL, some of New Relic's prebuilt Kubernetes experiences may require the New Relic Kubernetes integration for full functionality.

Kubernetes metrics can be queried directly using NRQL, or used to build custom dashboards and visualizations tailored to your environment.

{{< figure src="https://i.ibb.co/Gvrrs6yx/x.jpg" alt="New Relic dashboard" width="1000" height="600" title="Custom dashboard built using NRQL queries" >}}

New Relic offers a generous free tier for learning and personal projects. The platform includes features such as:

* APM and Dashboards
* Metrics and Logs
* Distributed Tracing
* Span Correlation
* Service Maps
* Dependency Discovery
* Alerts

Alerts can be configured using NRQL conditions and delivered through channels such as Email, Slack, Microsoft Teams, or Webhooks. When a threshold is met, New Relic automatically triggers the configured notification.


{{< figure src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*hxdh5qiyzEHsd54-9qQu6w.png" alt="New Relic Overview" width="1000" height="600" title="New Relic Overview" >}}

To explore distributed tracing, open the Node Frontend service from the APM view and navigate to Distributed Traces. Open a recent request, inspect the spans, attributes, and logs, then copy the Trace ID to correlate activity across the other services participating in the same request flow.

### Honeycomb.io

{{< figure src="https://i.ibb.co/WNqfgCCG/x.jpg" alt="Honeycomb" width="1000" height="600" title="Honeycomb Home view" >}}

Honeycomb is an observability platform built around OpenTelemetry with AI-assisted observability capabilities. Since both application and Kubernetes telemetry flow through the OTel Collector's multi-exporter pipeline, the same data lands in Honeycomb without additional instrumentation.

Honeycomb also provides ready-made templates for common observability use cases. These can be accessed from **Boards → Templates**, where templates such as **Kubernetes Node Metrics**, **Kubernetes Pod Metrics**, and **Kubernetes Workload Health** are available. Selecting a template lets use review the prebuilt board and save it, after which the saved board becomes available directly under the **Boards** section for future use.

{{< figure src="https://i.ibb.co/8CLh903/hc-dashboards.png" alt="Honeycomb Templates" width="1000" height="600" title="Honeycomb Dashboard Templates" >}}

The query builder is solid for slicing metrics and traces, but where Honeycomb stands out is the MCP server and Canvas — once connected to Claude, your telemetry becomes something you can interrogate in plain English rather than hand-writing queries.

{{< figure src="https://i.ibb.co/TqMSNr2D/x.jpg" alt="Honeycomb Canvas" width="1000" height="600" title="Honeycomb Canvas" >}}

## Ask Claude

Honeycomb also provides an MCP server. The integration is straightforward and can be connected directly to Claude using only an API key, without requiring additional JSON configuration or setup. This makes it possible to ask questions about application and Kubernetes telemetry using natural language. Similar questions can also be asked directly from the Honeycomb Canvas interface shown earlier.

For example, you can ask questions about application operations:

{{< figure src="https://i.ibb.co/ks7FvvxV/x.jpg" alt="Claude questions" width="1000" height="600" title="Application Operations" >}}

You can also investigate cluster health, identify unhealthy pods, or ask other questions that help analyze application and Kubernetes behavior.

{{< figure src="https://i.ibb.co/ZphdWtbJ/x.jpg" alt="Claude questions" width="1000" height="600" title="Unhealthy Pods View" >}}

## Cleanup

To avoid issues during teardown, delete the ArgoCD applications first, remove the ingress resources, and then run \`terraform destroy\` to tear down the EKS infrastructure.

\`\`\`text
Delete ArgoCD Applications
        ↓
Delete Ingress Resources
        ↓
terraform destroy
\`\`\`
Depending on the deployment approach used, remove the individual applications, root application, or Kustomize bootstrap before destroying the EKS infrastructure.

## Lessons Learned

* The OpenTelemetry Collector's multi-exporter pipeline makes backend independence practical — New Relic and Honeycomb can receive the same telemetry without requiring any application changes.
* Deploying the OpenTelemetry Collector as a DaemonSet ensures node-level metrics are collected from every worker node. A single collector Deployment only scrapes the kubelet of the node where it is running, resulting in incomplete metrics in multi-node clusters.
* Kubernetes observability requires combining multiple telemetry sources — \`kubeletstats\`, \`k8s_cluster\`, and \`kube-state-metrics\` each provide a different view of cluster health and workload behavior.
* \`kube-state-metrics\` exposes Prometheus metrics that can be scraped by the OpenTelemetry Collector and forwarded alongside application telemetry through a single telemetry pipeline.

## Wrap Up

At this stage, the platform is fully operational and telemetry is flowing from both the applications and the Kubernetes cluster into multiple observability backends. Continue exploring New Relic and Honeycomb to analyze traces, metrics, logs, and Kubernetes telemetry from different perspectives, or integrate the telemetry pipeline with other observability stacks such as LGTM, ELK, Splunk or Dynatrace and compare how they fit your needs.
<!-- <br></br> -->

<!-- Found this article helpful? Consider leaving a like if it added value or helped you learn something new. 👇
<br></br>
[**Checkout more Monitoring and Observability Articles →**](/blogs/#o11y) -->

<!-- [**Read more articles on Kubernetes →**](/blogs/#kubernetes) -->`,__vite_glob_0_43=`---
date: '2023-08-26T19:30:10+05:30'
draft: false
title: Setup Monitoring with Prometheus and Grafana.
description: Monitoring Linux Server with Prometheus Node exporter. Setup using docker.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*32z2k-B-WPcunJTX3iAF5w.png
tags:
- monitoring
- o11y
- devops
- prometheus
- grafana
series:
- Prometheus
series_order: 1
categories:
- Observability & Monitoring
---

## Introduction:

**Prometheus** is a open-source platform for monitoring hardware and services. It collects metrics from the system of any other services that we configured.

It has a querying language called PromQL to analyse the metrics. We can also configure mail alerts for situation like hight resources usage, SSL expiration etc.

Although Prometheus has a bit of graphical representation for the collected metrics, **Grafana,** another oss offers rich visualisation of the data such as pie chart, bar chart etc. Grafana can show results form multiple platforms (called datasources) including prometheus.

In this article we are going to see how to setup monitoring of a linux machine.

I’m going to use Docker to setup this process, however you can install binaries as usual.

## Prerequisites:

*   Linux machine with docker and docker-compose.

Clone this [github](https://github.com/sagarkrp/Prometheus-and-Grafana.git) repository.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NUXWYRtyZ0Bijj3CE1NenA.png)

Lets understand the configuration:

We are launching 3 containers, so its better to use docker compose.

\`\`\`yml
#docker-compose.yml
version: '3.8'
networks:
  monitoring:
    driver: bridge
volumes:
  prometheus_data: {}
  grafana_data: {}
services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - 9100:9100
    networks:
      - monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    ports:
      - 9090:9090
    networks:
      - monitoring
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    user: '0'
    ports:
      - 3000:3000
    restart: unless-stopped
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
      - /grafana_data:/var/lib/grafana
    networks:
      - monitoring
\`\`\`

The first service is node-exporter and and the commands are the locations from where node-exporter will collect system metrics. Node expoter is going to run on port 9100.

The 2nd service is Prometheus container with volume containing prometheus.yml the main configuration for Prometheus (we’ll see later in the article). Prometheus is set to run on 9090.

Finally the last container is Grafana. Here the first volume is an additional configuration for automatic configuration of Prometheus. If we skip this we can manually configure Prometheus data source and dashboard.

Create the prometheus.yml file with the below content:

\`\`\`
#prometheus.yml
global:
  scrape_interval: 1m
scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 1m
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
\`\`\`

**— targets: [‘localhost:9090’]** — Here prometheus collects it’s own metrics. You can skip this.

**— targets: [‘node-exporter:9100’]** — Here prometheus collects the data provided by the node exporter. these are the metrics for the resource usage of machine.

Now to start the containers, first navigate the location where the compose file is present. We need to run the command:

\`\`\`
$ docker compose up -d
\`\`\`

To understand more about docker, checkout out these articles. [**_Docker_**](/tags/docker/)

Once the images are pulled and ran without any error, we can browse the particular applications.


Check the status of the containers with docker ps. If any container is exited or restarting continuously, see the logs to find out what’s wrong.

\`\`\`
$ docker ps <or>
$ docker ps -a
CONTAINER ID   IMAGE                       COMMAND                  CREATED          STATUS          PORTS                                       NAMES
018a806beb2b   prom/prometheus:latest      "/bin/prometheus --c…"   24 minutes ago   Up 24 minutes   0.0.0.0:9090->9090/tcp, :::9090->9090/tcp   prometheus
213b22c60659   prom/node-exporter:latest   "/bin/node_exporter …"   24 minutes ago   Up 24 minutes   0.0.0.0:9100->9100/tcp, :::9100->9100/tcp   node-exporter
bc42690098fb   grafana/grafana:latest      "/run.sh"                24 minutes ago   Up 24 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   grafana
\`\`\`

\`\`\`
$ docker compose logs <conatainer name or id>
$ docker compose logs prmoetheus

\`\`\`

Browse your IP:9090 for Prometheus , 9100 for Node exporter and 3000 for Grafana.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*dB9lMq1EekaQQ1R-SQU4IA.png)

You can click on the metrics link on node exporter to see the data collected are displayed in raw format. Query data in prometheus and view as graph.

Now login to Grafana with admin/admin creds, reset password. Once completed. Now we can configure it to pull data from Prometheus by adding datasource. Add your Prometheus url and save it. Once this has been completed, you can query the same metrics inside grafana, create dashboard.

To create, dashboard, we can define everything manually or get predefined configuration from grafana (either by using ID or the json). View the list of dashboards available with the link below.

[Dashboards | Grafana Labs | Browse a library of official and community-built dashboards](https://grafana.com/grafana/dashboards/?source=post_page-----2431b26cd757---------------------------------------)

Now we have our monitoring setup ready. However, we can ease the setup of data source and dashboard configurations by proving configuration in our docker-compose.

To do so, we have to create the provisiong and datasources directories with the configurations shown in the screenshot.

\`\`\`
[root@labputer Monitor_with_Prometheus]# tree
.
├── docker-compose.yml
├── grafana
│   └── provisioning
│       ├── dashboards
│       │   ├── dashboard.yml
│       │   └── node_exporter.json
│       └── datasources
│           └── datasource.yml
└── prometheus.yml
4 directories, 5 files
\`\`\`

The datasouces.yml configues the desired data-source (prometheus here) and the dashboard.yml is for creating dashboard automatically along with the provided json (obtained from grafna dashboards website [https://grafana.com/grafana/dashboards/](https://grafana.com/grafana/dashboards/), similar to how we need to do ourself with id or the json when doing manually).

\`\`\`yml
# datasouces.yml
apiVersion: 1
datasources:
  - name: Prometheus # here we can configure differnt sources
    type: prometheus
    access: proxy
    orgId: 1
    url: http://prometheus:9090
    basicAuth: false
    isDefault: true
    editable: true
# -----------------------------
# dashboard.yml
apiVersion: 1
providers:
  - name: 'Prometheus'
    # orgId: 1
    # folder: 'General'
    type: file
    disableDeletion: false
    editable: true
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
# node_exporter.json
skipped as the file is very long.
Downloaded from https://grafana.com/grafana/dashboards/.
You can configure as many dashbboards with json as per your requiremets.
I'm going to use only node exporter full.
\`\`\`

Now terminate the containers and we’ll run then again and this time with the first volume for the grafana config above in compose.

for your reference:

\`\`\`
volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
\`\`\`

Use docker compose down to terminate all and start them again with compose up.

\`\`\`
$ docker compose down # terminates all containers
$ dockdr compose up -d

\`\`\`

Now opening Grafana, we can verify that Prometheus is already set as the default data source and our dashboard is also ready.

\`\`\`
ip:3000/dashboards, ip:3000/datasources
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HX5yG38dlG2b9VUcN-0-EA.png)

Alright, now we are all set. Browse the node exporter full to view all the metrics. Explore the settings to change visualization, query duration and etc.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gcrxLOGImAPeo_2LJ0yF-w.png)

Thanks for reading. In a future article, we will see how to configure alert manager and Blackbox exporter.

### Further Reading:

<!-- [**Checkout more on monitoring and o11y →**](/blogs/#o11y) -->

[Send Email Alerts using Prometheus AlertManager]({{< relref "alertmanager" >}})

[Visualize Your Website Metrics — Blackbox Exporter and Grafana]({{< relref "blackbox" >}})
`,__vite_glob_0_44=`---
date: '2023-11-06T19:26:10+05:30'
draft: false
title: Let’s Encrypt SSL Configuration using Certbot
description: Setup SSL certificate for free. Secure your application with Let’s Encrypt - DIY Guide
cover: https://miro.medium.com/v2/resize:fit:1280/format:webp/1*rYd5jblnBNdOUHyFiQFKXw.png
tags:
- nginx
- tls
- web security
- devops
categories:
- Linux & Automation
---

### What is SSL/TLS:

SSL or Secure Sockets Layer is a security protocol used to establish an encrypted connection between your web browser and a web server.

This ensures that the data transfer between you and the server can’t be read by an intruder.

The padlock icon you see on a URL, that’s what is the indication of an SSL in use.

Though the current protocol TLS (Transport Layer Security) is the successor and the current implementation, people still refer to it as SSL but be sure it’s in fact TLS in use.

### Initial Setup:

I’ll be using Ubuntu and Nginx for this example, but this can be done with other web servers and Linux flavors as well.

See supported systems on certbot site.

[Certbot Instructions](https://certbot.eff.org/instructions?source=post_page-----13c4098b84d9---------------------------------------)

First update the package index and install Nginx with the below command

\`\`\`bash
sudo apt update && sudo apt install nginx
\`\`\`

On completion, nginx should already be running as it’s on Ubuntu and no other app is using port 80.

Browse your ip and you should see the default Nginx webpage.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sEa1jBCNfU-0ehOKKg-kew.png)

Add dns entry in your registrar for the above IP.

![DNS entry](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QhvmITCOPsqE2cR9Y7HOFQ.png)

 Create an index.html with your web app content in any directory of your choice. I have it in /var/www/html/<username>.

\`\`\`nginx
<title> SSL setup </title>
<h1> Hello There! Welcome to Let's Encrypt setup </h1>
\`\`\`

Create a configuration for your website with the server name, enable the site.

\`\`\`nginx
server {
       listen 80;
       listen [::]:80;
       server_name web.sagarpanda.com;
       root /var/www/html/sagar;
       index index.html;
       location / {
               try_files $uri $uri/ =404;
       }
}
\`\`\`

Here the **web** is the config file I have created.

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/web /etc/nginx/sites-enabled/web
\`\`\`

Check syntax of your config and reload nginx. And try browsing your site with the domain or subdomain.

\`\`\`bash
sudo nginx -t
sudo systemctl reload nginx
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4-JVrkB4Fe3Qc-tgOmBpPg.png)

And our application is ready.

### Configure SSL using Certbot:

Certbot is a software that does the job of getting us a let’s encrypt certificate and also renews it automatically.

There are multiple ways to install certbot but the official recommendation is to use snap.

Visit the certbot site, choose your web server and linux flavour.

Follow the instructions on the screen to install snapd (not required on Ubuntu, since snapd is built-in)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-pPzDXwzJGQm5_bEYfeVjw.png)

Install the certbot tool and create a sysmlink.

\`\`\`bash
sudo snap install --classic certbot
# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
\`\`\`

Certbot gives us the option to configure ssl certs ourselves or it can also do the same automatically.

Choose the first if you want automatic configuration. Certbot will change the nginx configuration or the config file we created earlier.

However I’ll do the configuration myself. So I chose the second command.

\`\`\`bash
sudo certbot --nginx
OR
sudo certbot certonly --nginx
\`\`\`

*   Follow the on-screen instructions and answer the question to proceed. Certbot will automatically find the domains listed in our machine and ask us to provide the confirmation on which domain/subdomain we want ssl for.
*   Choose the one you need. Provide the number in case you have multiple domains available in the same machine.

Example below: It found 1 domain so I had to enter the corresponding number “1".

After this the certificate files are atore under /etc/lets-encrypt/live directory.

\`\`\`ini
Which names would you like to activate HTTPS for?
We recommend selecting either all domains, or all domains in a VirtualHost/server block.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: web.sagarpanda.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
Requesting a certificate for web.sagarpanda.com
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/web.sagarpanda.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/web.sagarpanda.com/privkey.pem
This certificate expires on 2024-02-03.
\`\`\`

Test Auto renewal:

\`\`\`text
sudo certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/web.sagarpanda.com.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Account registered.
Simulating renewal of an existing certificate for web.sagarpanda.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/web.sagarpanda.com/fullchain.pem (success)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
\`\`\`

*   Change config to add ssl part in nginx conf. Optionally you can add a redirect statement in http server block and remove web root so even http traffic is sent to https.
*   Add the paths to the certificate files in the https server block.

\`\`\`nginx
server {
       listen 80;
       listen [::]:80;
       server_name web.sagarpanda.com;
       return 301 https://web.sagarpanda.com;
}
server {
      listen  443 ssl;
      server_name web.sagarpanda.com;

       root /var/www/html/sagar;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
    ssl_certificate     /etc/letsencrypt/live/web.sagarpanda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/web.sagarpanda.com/privkey.pem;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
}
\`\`\`

Save, test the config for syntax errors and reload nginx.

\`\`\`bash
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

Now off to check our web app. Bingo !!

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LMjtjmV29mcQLf_Yv44BFw.png)

Click on the lock icon to see it’s from Let’s Encrypt.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ChHXVXDJDGhhyXtJcXhyXA.png)

View more details of the cert:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fr8simaGefKRWE9Ihpm4Kw.png)

We have 3 months of validity but fret not as we saw with dry run, certbot will renew the certificate for us.

Another web page for example.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Q4hful2L4VRtV5g-h7aR6Q.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1368/format:webp/1*Nsq3BasnUb7Sl_ZgDEp35g.png)

If you want to delete the certificate, try certbot delete. However make sure to update the nginx site config as it does not remove the server config for https.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bEkCBdWNHXKd-q7-5h9GHQ.png)

And that’s about it. Thanks for reading!

**References**: [Certbot](https://certbot.eff.org/), [Nginx](https://nginx.org/en/docs/http/configuring_https_servers.html)

### Up next:

In this article we configure mTLS with Nginx, mTLS enables two way validation with client-server handshake for enhanced security and how NGINX helps us load balance mutiple servers.

<!-- **Read More on Web Servers:**

[Apache →](/blogs/#apache)
<br></br>
[Nginx →](/blogs/#nginx) -->
[Mutual TLS Handshake for robust security]({{< relref "nginx-mtls" >}})

[Load Balancing Magic: Unleashing the Potential of NGINX]({{< relref "nginx-lb" >}})
`,__vite_glob_0_45=`---
date: '2023-04-22T19:26:10+05:30'
draft: false
title: Load Balancing Magic — Unleashing the Potential of NGINX.
description: Load Balance Multiple servers with Nginx. Run multiple servers (containers) using Docker Compose.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KtQHN4HBPNple7bwXDUCsg.png
tags:
- nginx
- loadbalancer
- devops
categories:
- Linux & Automation
---

## Introduction

### What is NGINX:

Nginx (pronounced engine x /ˌɛndʒɪnˈɛks/ EN-jin-EKS) is an open source HTTP web and reverse proxy server.

### What’s is a Load Balancer:

A load balancer sits in front of all your web server and distributes all client requests. By doing so it reduces the chance of service failure and also exposes a single point of request.

![Img source: Nginx](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BN3WyxHwigDwbTI7m8jGRQ.png)

In this article we’ll see how to use NGINX as Load Balancer and Reverse Proxy.

All the project codes are available on this [GitHub](https://github.com/sagarkrp/NGINX_LB_DockerCompose.git) repository. This repository has 2 projects. The Nodejs project uses local nginx installation and the python app uses nginx as a container.


## Example 1:
### Using Nodejs , Docker and Nginx:

### Prerequisite:

*   Docker

[Docker Chapter 1 — How to Install Docker on Linux and Windows.](https://medium.com/@sagarkrp/docker-chapter-1-how-to-install-docker-on-linux-and-windows-6020c9a36693?source=post_page-----c8e1d746f02b---------------------------------------)

*   Nginx

Lets install Nginx and nodejs, use the command below:

\`\`\`
sudo apt update && sudo apt install nginx -y
sudo apt install nodejs
\`\`\`

Nodejs is required only to run the application locally. You can skip if you want.

### Building our application:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-db_MrxAH8VqZqV9eNnhHw.png)

The server.js in our main application that runs on port 2000 and when its run it prints the hostname.

To run the application locally, you can use “npm run start”.

### Build and run the container:

Since we need to see Load Balancing same application, we need to create multiple instances of the app.

But we’ll use Docker to spin up 3 servers in and our application will transfer request to all servers and we should see hostname changing with each request we make (the default laod balancing algorithm is Round Robin).

Dockerfile:

\`\`\`dockerfile
# Using node image as base
FROM node:18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm i express
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 2000
CMD [ "npm", "run", "start"]
\`\`\`

To Build the docker images and run use the below commands:

\`\`\`
docker build -t nlb:1.0 .
docker run -d -p 2000:2000 nlb:1.0
\`\`\`

Lets run more containers in different ports.

\`\`\`

┌──[13:54:13]─[0]─[labputer:~/Documents/Docker/Nginx_LB]
└──| docker run -d -p 3000:2000 nlb:1.0
927e3765aeee5d2615f0375f6ede30902d0ac9600de8085fac6400ae437a83e1
┌──[13:54:16]─[0]─[labputer:~/Documents/Docker/Nginx_LB]
└──| docker run -d -p 4000:2000 nlb:1.0
f75486b51aabe02337082e0f7c1b025631f43c60aeb9a4b723592687c9d73dff
\`\`\`

View more abut docker build:

[Docker Chapter 2 — Build and Push Your First Docker Image](https://medium.com/@sagarkrp/docker-chapter-2-build-and-push-your-first-docker-image-7d7f9d71f1ca?source=post_page-----c8e1d746f02b---------------------------------------)

Now browse the ip or url with port 2000,3000 and 4000. We should see a response with hostname.

Note: The hostname here are the IDs of docker containers.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qA-QakFflPdzjosbs0io3A.png)

But wait, that’s nothing exciting, we don’t have any load balancing. That’s right, we’ll setup nginx to act as a load balancer to the 3 containers and we should be able to see varying hostname changes with single ip (the default load balancing algorithm is Round Robin).

To configure nginx as load balancer, we must edit the nginx.conf file under /etc/nginx. We need to http black here like below:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hpdEVDA5xJRacnfUaiZVTw.png)

\`\`\`nginx
http {
       upstream beservers{
               server 127.0.0.1:2000;
               server 127.0.0.1:3000;
               server 127.0.0.1:4000;
       }
\`\`\`

Note: the “besevers” is just an identification that we’ll use in our virtual host configuration.

Now all the requests coming from all these different servers (ports in this example) will be transferred to “beserver”, but what is this name how does it forward the request. For that we’ll be using proxy pass.

Add the following block to the default site or create a new site.

\`\`\`nginx
location / {
                proxy_pass http://beservers/;
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
\`\`\`

I m going to create a new site under /etc/nginx/sites-available called example.com (can be any name). And create a symlink to sites-enabled.

#example.com

\`\`\`nginx
server {
        listen 80;
        server_name example.com #this is your website url
        root /usr/share/nginx/html;
        try_files index.html =404;
        location / {
        proxy_pass http://beservers/;
        }
}
\`\`\`
<br></br>
\`\`\`
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
\`\`\`

Now, lets browse our application. These hostnames are coming from Docker containers. use “docker ps” to verify their IDs with the ones from here.

![captionless image](https://miro.medium.com/v2/resize:fit:770/format:webp/1*HnZtFKPmUjISh9AgQg_StA.gif)

Awesome!

Note: This “sites-available” , “sites-enabled” are only applicable incase of Debian/Ubuntu and its derivatives. In redhat family of linux, all these configurations are to be done under conf.d directory.

If you want however, you can imitate the same debian/ubuntu like directory structure by creating “sites-available” , “sites-enabled” and including the “sites-enabled” in nginx.conf.

\`\`\`bash
Cretae the directoies:
$sudo mkdir /etc/nginx/sites-available /etc/nginx/sites-enabled
$sudo vim /etc/nginx/nginx.conf
Add this line to the end of the file:
IncludeOptional sites-enabled/*.conf
\`\`\`

## Example 2:
### Using Python and Docker Compose:

### Prerequisite:

1.  Docker and Docker compose.

### What is Docker Compose:

Compose is a tool for defining and running multi-container Docker applications.

Lets discuss the application.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wUXmPem7ihvDIceQrXlO_A.png)

Same as the first example, the hello.py in our main application that runs on the defined port and prints the hostname.

### Dockerfile:

\`\`\`dockerfile
# using alpine varinat of python image
FROM python:alpine3.17
# define working directory
WORKDIR /flaskapp
# copy everything to working directory
COPY . .
# intstall required python packes (flask and gunicorn for this example)
RUN pip install -r requirements.txt
# start application with guincorn
CMD gunicorn --bind 0.0.0.0:3000 hello:app
\`\`\`

### nginx.conf:

\`\`\`nginx
events{
    worker_connections 100;
}
http{
server{
    listen 80;
    location /{
        proxy_pass http://flaskapp:3000/;
    }
}
}
\`\`\`

In this example, we don’t need local nginx instance, and its better to stop nginx if its running on your host since in this example we are exposing nginx on 80, it will conflict otherwise.

Here the proxy_pass transfers the request to flaskapp:3000 which is our python application.

### docker-compose.yaml:

\`\`\`yml
version: '3'
services:
    flaskapp:
      build:
          context: app
      ports:
        - "3000"
    nginx:
        image: nginx:1.24.0
        volumes:
          - ./nginx.conf:/etc/nginx/nginx.conf
        depends_on:
            - flaskapp
        ports:
          - "80:80"
\`\`\`

Here we are launching 2 services, the app is our python application and nginx. You might ask why is there no host port defined for the first service. Since we are going to launch multiple instances of our app, mentioning a particular host will launch all containers on same port which is not possible and after 1 instance of our app is created the next 2 will fail to start.

Not mentioning any host port means the containers will be assigned with random ports. Now comes another problem, if we don’t know the ports then how can we configure upstream servers? In this case docker uses the services to find the ip and port.

\`\`\`yml
services:
    flaskapp:
      build:
          context: app
      ports:
        - "3000"
\`\`\`

Now the 2nd service is to download and start nginx container. Here volume is used to mount a file from our host to the container path. The depends on notifies that the nginx container should start after the first containers are available.

Alright, lets build it. To build using docker compose we use “docker compose up” and to stop and remove the containers use “docker compose down”.

With docker compose, we can also scale number of containers using — scale option.

\`\`\`
└──| docker compose up -d --scale flaskapp=3
\`\`\`

This launches 3 instances of the “flaskapp” container and a nginx container.

Check all the running containers with docker ps:

\`\`\`bash
──| docker ps
CONTAINER ID   IMAGE               COMMAND                  CREATED              STATUS              PORTS                                         NAMES
3479b1e2e677   nginx:1.24.0        "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, :::80->80/tcp             flaskapp-nginx-1
64f5725ab5b8   flaskapp-flaskapp   "/bin/sh -c 'gunicor…"   About a minute ago   Up About a minute   0.0.0.0:32773->3000/tcp, :::32773->3000/tcp   flaskapp-flaskapp-1
41ff26ba1ff8   flaskapp-flaskapp   "/bin/sh -c 'gunicor…"   About a minute ago   Up About a minute   0.0.0.0:32774->3000/tcp, :::32774->3000/tcp   flaskapp-flaskapp-2
1e201d31fbb7   flaskapp-flaskapp   "/bin/sh -c 'gunicor…"   About a minute ago   Up About a minute   0.0.0.0:32775->3000/tcp, :::32775->3000/tcp   flaskapp-flaskapp-3
\`\`\`

Time to browse our application. Every refresh shows different hostnames from the above list of container IDs (Except the first one, since its Nginx container).

![captionless image](https://miro.medium.com/v2/resize:fit:1204/format:webp/1*KbgXjo2bRroiVDo6I2_oog.gif)

Congratulations !!

Reference: YouTube [1](https://www.youtube.com/watch?v=7VAI73roXaY), [2](https://www.youtube.com/watch?v=42Q65H8ch7U&t=974s) | [Docker Docs](https://docs.docker.com/compose/) | [Nodejs](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)

More on Docker : [Build and Push your first Image](https://medium.com/@sagarkrp/docker-chapter-2-build-and-push-your-first-docker-image-7d7f9d71f1ca)

**Read more on Nginx:**

[SSL for Everyone: A Guide to configure Let’s Encrypt using Certbot]({{< relref "letsencrypt-ssl" >}})`,__vite_glob_0_46=`---
date: '2024-12-09T19:26:10+05:30'
draft: false
title: Set Up mTLS in NGINX for Robust Web Security.
description: Discover how mTLS strengthens security and learn to set it up with NGINX.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZhRTae65blWVYB0aXvHoJA.png
tags:
- nginx
- mtls
- tls
- web security
- devops
categories:
- Linux & Automation
---


### What is mTLS:

mTLS, or **mutual TLS**, is a security protocol that ensures **both** the client and the server authenticate each other when they communicate over a network. It’s like a handshake where both sides check each other’s identity, making sure that both are who they say they are.

Typically, in regular TLS (like when you visit a website), only the server presents its identity (via a certificate). The client (browser for example) trusts the server based on that certificate.

With **mTLS**, the server also wants to make sure the client is trustworthy and the client also presents its own certificate to prove its identity.

**How it works:**

*   Both the **client** and the **server** each have a digital certificate.
*   When they communicate, they exchange certificates during the handshake process.
*   Each side checks the other’s certificate to ensure it’s valid and trusted.
*   If everything checks out, the connection is encrypted and secure.

This is the second article on how to set up a TLS certificate. Check out the article below to get the setup ready and proceed further.

[The Complete DIY Guide — Let’s Encrypt SSL Setup Using Certbot](https://medium.com/ssl-for-everyone-a-guide-to-configure-lets-encrypt-with-certbot-13c4098b84d9?source=post_page-----3b306ec7061d---------------------------------------)


### Set Up:

As of now we have the server certificate ready and it works fine. Now we need to generate client certificates and update nginx config.

### 1. Generate a Self-Signed CA Certificate

\`\`\`bash
openssl req -newkey rsa:4096 -x509 -keyout ca.key -out ca.crt -days 30 -nodes -subj "/CN=Sagar"
\`\`\`

### Explanation:

*   \`**req**\`: Invokes the certificate request (CSR) generation utility.
*   \`**-newkey rsa:4096**\`: Generates a new RSA private key with a size of 4096 bits.
*   \`**-x509**\`: Indicates that a self-signed certificate (X.509 standard) is being created, instead of a CSR.
*   \`**-keyout ca.key**\`: Saves the generated private key to the file \`ca.key\`.
*   \`**-out ca.crt**\`: Saves the generated self-signed certificate to the file \`ca.crt\`.
*   \`**-days 30**\`: Specifies that the certificate will be valid for 30 days.
*   \`**-nodes**\`: Prevents encryption of the private key with a passphrase.
*   \`**-subj "/CN=Sagar"**\`: Provides the subject name (Common Name, or CN) directly without prompting.

This command creates a self-signed CA (Certificate Authority) certificate and its private key. The CA can be used to sign other certificates.

### 2. Generate a Client Key and CSR

\`\`\`
openssl req -newkey rsa:4096 -keyout client.key -out client.csr -nodes -days 30 -subj "/CN=sagar"
\`\`\`

## Explanation:

*   \`**req**\`: Invokes the certificate request (CSR) generation utility.
*   \`**-newkey rsa:4096**\`: Generates a new RSA private key with a size of 4096 bits.
*   \`**-keyout client.key**\`: Saves the generated private key to the file \`client.key\`.
*   \`**-out client.csr**\`: Saves the generated Certificate Signing Request (CSR) to the file \`client.csr\`.
*   \`**-nodes**\`: Prevents encryption of the private key with a passphrase.
*   \`**-days 30**\`: Specifies the intended validity of the certificate being requested (used for CSR metadata; not enforced here).
*   \`**-subj "/CN=sagar"**\`: Specifies the subject of the CSR with a Common Name of "sagar".

This command creates:

1.  A private key for the client (\`client.key\`).
2.  A CSR (\`client.csr\`) to be signed by the CA.

### 3. Sign the Client Certificate with the CA

\`\`\`
openssl x509 -req -in client.csr -out client.crt -CA ca.crt -CAkey ca.key -CAcreateserial -days 30
\`\`\`

### Explanation:

*   \`**x509**\`: Invokes the X.509 certificate utility to create the signed certificate.
*   \`**-req**\`: Indicates that the input is a Certificate Signing Request (CSR).
*   \`**-in client.csr**\`: Specifies the CSR file to be signed.
*   \`**-out client.crt**\`: Specifies the output file for the signed certificate.
*   \`**-CA ca.crt**\`: Specifies the CA certificate to use for signing.
*   \`**-CAkey ca.key**\`: Specifies the CA’s private key to sign the certificate.
*   \`**-CAcreateserial**\`: Creates a new serial number file (\`ca.srl\`) to track the certificates issued by the CA.
*   \`**-days 30**\`: Specifies that the client certificate will be valid for 30 days.

This command takes the client’s CSR, signs it with the CA’s private key (\`ca.key\`), and generates a signed client certificate (\`client.crt\`).

### Nginx Config Changes:

Update the nginx config to include the client cert and restart nginx.

\`\`\`bash
ssl_client_certificate /etc/nginx/ssl/ca.crt;
ssl_verify_client on;
\`\`\`
\`\`\`nginx
 server {
    listen 443 ssl;
    server_name app.sagarpanda.com;
    # Use Let's Encrypt certificates for the server
    ssl_certificate <path to lets encrypt cert>
    ssl_certificate_key <path to lets encrypt cert>
    # Set up client certificate verification
    ssl_client_certificate /etc/nginx/ssl/ca.crt;
    ssl_verify_client on;
    # Optional: Restrict the client certificate verification depth
    ssl_verify_depth 2;
    # Additional security settings (optional)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    location / {
        root /var/www/html/sagar;
        index index.html;
    }
}
\`\`\`

At this point we can test the connection using curl. And this works fine.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*t2s5v3XRkRC_tYBdtUDe0w.png)

Let’s browse the app in browser and we will get error indicating we did not provide any client cert.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x2gFkDYoiLLIcjtexXw7pw.png)

We need to provide the cert via browser. First convert the cleint.crt to pkcs12 format by combining both client.key and client.crt. This will ask you to enter a passphrase and creates an encrypted file.

\`\`\`bash
openssl pkcs12 -export -inkey client.key -in client.crt -out client.pkcs12
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MCXVI-2S8GPqXE6mCDNdbA.png)

To import the certificate into the browser go to settings → privacy & security → certs → your certificates → import →select the pcks12 file and enter the passphrase.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IhsJGuxCZrYEDIXOI5ukuw.png)
<br></br>

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1ZYJ13OOS77Dcj4k2UuCRw.png)

And that’s it. Refresh the page and a pop up should appear with the cert imported earlier and the app works. Interesting right?

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i3pROHO6xg2aFmOOsp07wg.png)

### Conclusion:

mTLS adds another layer of security to enhance security, and authenticated communication for our application.

If you found this article helpful, click the 👏 button, it keeps me motivated to write more!

**Read More on Nginx:**

<!-- [Apache →](/blogs/#apache)
<br></br>
[Nginx →](/blogs/#nginx) -->

[Load Balancing Magic: Unleashing the Potential of NGINX]({{< relref "nginx-lb" >}})`,__vite_glob_0_47=`---
date: '2023-05-01T19:26:10+05:30'
draft: false
title: SonarQube Setup with Jenkins
description: Code Quality Analysis with SonrQube on Jenkins
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XIBVAu-3lA0o7rivQ4Cvug.jpeg
tags:
- Jenkins
- SonarQube
- DevOps
- ci/cd
categories:
- CI/CD Automation
---

### Introduction:

SonarQube is an open-source platform used to perform continuous review and verification of code quality to detect bugs, vulnerabilities and code smells in the application.


In this tutorial, we’ll see how to install and configure it for a project. All the codes and configuration are on [Github](https://github.com/sagarkrp/SonarQube_Gradle.git).


### Prerequisite:

*   **Java 17**
*   **PostgreSQL**
*   **Jenkins**

View this tutorial below to install and setup Jenkins.


[Install Jenkins](https://sagarkrp.medium.com/how-to-install-and-setup-jenkins-on-linux-with-pipeline-job-3e2973229a8f?source=post_page-----2fe6c732620---------------------------------------)

### Setup Database:

First login to PostgreSQL and create a user named **sonaruser** or any other name with password as shown below.

Create a database named **sonarqubedb** with **sonaruser** as the owner. Grant all the privileges on the **sonarqubedb** database to the **sonaruser**. And exit postgress and the postgress user.

\`\`\`bash
sudo su - postgres
postgres@labputer:~$ psql
psql (14.7 (Ubuntu 14.7-0ubuntu0.22.10.1))
Type "help" for help.
postgres=# CREATE USER sonaruser WITH PASSWORD 'sonarpwd';
CREATE ROLE
postgres=# CREATE DATABASE sonarqubedb;
CREATE DATABASE
postgres=# GRANT ALL PRIVILEGES ON DATABASE sonarqubedb to sonaruser;
GRANT
postgres=# exit
postgres@labputer:~$ exit
logout
\`\`\`

Now download the sonarqube archive from the official site and extract it. Then move the files to /opt

[Download SonarQube](https://www.sonarsource.com/products/sonarqube/downloads/?source=post_page-----2fe6c732620---------------------------------------)


\`\`\`
sudo mv sonarqube /opt
\`\`\`

We need to edit the config file under /opt/sonarqube/conf/sonar.properties with the DB details before we start SonarQube.

At the Database section, uncomment the **jdbc.username and jdbc.password** lines with the username and password we created earlier.

On the PostgreSQL section uncomment the **jdbc.url** line as following. Save and exit.

\`\`\`ini
$ vim /opt/sonarqube/conf/sonar.properties
-------------------------------------------
# DATABASE
sonar.jdbc.username=sonaruser
sonar.jdbc.password=sonarpwd
#----- PostgreSQL 11 or greater
sonar.jdbc.url=jdbc:postgresql://localhost:5432/sonarqubedb
\`\`\`

At this point, we can start sonarqube by executing the shell script, but for convince and for auto starting the server, we’ll create and enable sonarqube service.

First create the systemd service file with the content as below. Save and quit.

\`\`\`
$ sudo vim /etc/systemd/system/sonar.service
\`\`\`

\`\`\`ini
[Unit]
Description=SonarQube service
After=syslog.target network.target
[Service]
Type=forking
ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop
User=sagar
Group=sagar
Restart=always
LimitNOFILE=65536
LimitNPROC=4096
[Install]
WantedBy=multi-user.target
\`\`\`

Start and Enable the service with the following commands:

\`\`\`
$ sudo systemctl start sonar && sudo systemctl enable sonar
$ sudo systemctl status sonar
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s46Y-WeW_ZqHrAGKh9fZwg.png)

Now browse your IP with port 9000. We shall see the login page in few seconds.

The default username and password both are “admin”. After you login, you’ll prompted to change the password. Proceed further and we shall see project creation page.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eLMscTZp9Ogm0rlWdt7FFQ.png)

SonarQube installation is complete.

Integration with Jenkins:
-------------------------

Before we proceed, lets understand the components

1.  SonarQube Server — Server which stores and displays all the information about project.
2.  SonarScanner — A standalone application, that runs analysis and sends to the SonarQube server.

So we need to configure both these in our Jenkins, to automatically scan the project and display the result.

### Adding SonarScnnaer :

*   Add SonarScanner plugin in Jenkins

**Manage Jenkins → Manage Plugins → Available Plugins → Search “SonarScanner” → Select checkbox → Install** (any of the two options below).

Now that we have the plugins, lets configure the version

[**Manage Jenkins**](http://jenkins.example.com/manage/) **→** [**Global Tool Configuration**](http://jenkins.example.com/manage/configureTools/)**.**

*   Provide a name, check Install automatically , select a version and save.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nH3HMZ5lcD2r2zyrN927zg.png)

### Configuring SonarQube Server in Jenkins:

First generate a token in SonarQube administarive section:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AhZgVYmdziIb0JHIYFM5eA.png)

Add the generated token to Jenkins credentials with any ID.

[**Manage Jenkins**](http://jenkins.example.com/manage/) **→** [**Credentials**](http://jenkins.example.com/manage/credentials/) **→** [**System**](http://jenkins.example.com/manage/credentials/store/system/) **→**[**Global credentials (unrestricted)**](http://jenkins.example.com/manage/credentials/store/system/domain/_/) **→ Add Credentials .**Select Secret Text from the drop down, paste in the token, assign an ID and save.

We need to tell Jenkins where the SonarQube server is

**Manage Jenkins → Configure System → SonarQube Servers → Check Environment Variables.**

Provide name, sonarqube sever host url and select the credential created earlier and save.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vNGMJ5Sgsc5_VjwitNFp0w.png)

### Running Analysis:

You can create projects by connecting to any of the repository platforms by connecting to them. In this way you will see all your repositories to be available to SonarQube.

Or you can just create it manually. (Follow the guide on the setup page)

1.  Provide Project name and key.
2.  Select Jenkins as integration platform, and Project type to get code snippet
3.  Use that code snippet in Jenkins file.

However, I m going to do a separate way. I have defined everything in my project. Now I just need to configure all the details in Jenkinsfile.

Here I m using a Gradle project (credits : [SonarSource github](https://github.com/SonarSource/sonar-scanning-examples)). Project name and key are defined under the build.gradle file.

![captionless image](https://miro.medium.com/v2/resize:fit:1110/format:webp/1*LYmELXNFjZwON0iojiVm-A.png)

In Jenksins file I just need to run the **_gradlew sonar_** command with the somarqube login details.

We will use a token for login. We can create a new token and it to the credentials store or use the previous one. As we have the credentials stored, we’ll use environmental variable to call the token and pass it to the gradle sonar command.

### Jenkins Pipeline Job:

Configure jenkins job for auto project analysis. Follow the article below on jenkins job setup.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HIzffX_X3yZMbdCTyJAVrA.png)

After the the job is built, go to SoarQube server and we should see our project is created and all the details are being displayed.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*X4DGhT2ruJdsU06IFBi6Ng.png)

Click on Issues to view more details on where the issues are how to fix them

Quality Gate Setup:
-------------------

Quality gate is a set of conditions based on which the you decide whether the code is ready to be published. The Projects overall status can also change based on what you define. For example you set the code coverage to be min 75%, or duplicate lines not to be more than 50. By default the **Sonar Way** quality gate is applied.

Lest setup one with few of our own condition.

Select Quality Gate and click create button. Name it and Save.

![captionless image](https://miro.medium.com/v2/resize:fit:1156/format:webp/1*cdUmgwr3eZvqR9XY1jo4Aw.png)

Now click on “Unlock Editing” at the end of the page and then “Add Condition” button. Select if you want to apply the condition on new code or the whole application code. Select a condition from the drop down, provide a value and save.

![captionless image](https://miro.medium.com/v2/resize:fit:1116/format:webp/1*x369XmOSMRnr-MqvkXWZ3A.png)

Scroll to the project section and select on which project you want to apply this quality gate.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1K3j799NH5RufeIC1GfnOw.png)

Now rebuild the jenkins job and we shall see the project status as “failed” in sonarqube as opposed to the previous status.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nHfHYv7HAdsLXF6LudyaXQ.png)

Now click on the project to see why this failed. As we can see the code coverage is 50% < our condition of 75% . Similarly code smell count is 3 > our set condition of 2.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*06-xSl6JvbOOJ6ubJY4dsA.png)

### Sending Quality Gate Status to Jenkins:

If we look at our jenkins job status, we see its successful since there was no error. But as our code is not ready to be published yet. We may want to mark the job status based on our quality gate status.

For this, we need to setup a webhook to send the result back to Jenkins.

Click on Administration tab, select Webhook from the drop down and click on create button. Name it, provide jenkins url/sonarqube-webhook. Save.

![captionless image](https://miro.medium.com/v2/resize:fit:1118/format:webp/1*I5qOnmri84F79wWh5uFiag.png)

Note: SonarQube does not allow webhook on localhost (loopback address) by default. If you want to use localhost, disable the validation as shown below:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sOScyY6kyiw3L9p9ok_kDQ.png)

Now, we need to modify the Jenkinsfile to receive the quality gate webhook.

\`\`\`groovy
pipeline {
    agent any
    stages {
        stage('Gradle Build') {
            steps {
                sh 'chmod +x gradlew'
                sh "./gradlew build"
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(installationName: 'SQ_Server'){

                sh 'chmod +x gradlew'
                sh "./gradlew sonar"
                //-Dsonar.token=$SONAR_LOGIN"
               }

           }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES')
                {
                    waitForQualityGate abortPipeline: true
                }
           }

        }
    }
}
\`\`\`

Rebuild the job. Once the job is complete, we should see it fail because of quality gate.

![captionless image](https://miro.medium.com/v2/resize:fit:1064/format:webp/1*dt93OFvREWZFVNj1dGuNYA.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*C3ZjjdS6qz8WXmoFFexvig.png)

That’s all about it. Hope you found it useful.

Reference: [SonarQube Docs](https://docs.sonarqube.org/latest/), [Vultur](https://www.vultr.com/docs/install-sonarqube-on-ubuntu-20-04-lts/), [TecMint](https://www.tecmint.com/install-postgresql-and-pgadmin-in-ubuntu/)

<!-- [Read more on CI/CD →](/blogs/#ci-cd) -->`,__vite_glob_0_48=`---
date: '2024-09-20T19:26:10+05:30'
draft: false
title: Automate AWS VPC Setup with Terraform
description: Build Your Own AWS VPC - Simple Terraform Deployment Steps!
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*e779UvuArbonBmYoTt9tYQ.png
tags:
- AWS
- vpc
- cloud
- terraform
categories:
- Cloud Infrastructure
---

### Introduction

The VPC is a logical private network that allows us to control how our resources, like servers, are connected and protected.

With the help of VPC, we decide the range of IP addresses for the network, how we can divide the network into smaller parts, data flow into & out and rules for securing our resource.

First lets understand the components by setting it manually.


### What is CIDR

CIDR is a method used to organize and allocate IP addresses more efficiently. Instead of assigning individual IP addresses one by one, CIDR allows us to group a set of addresses together. This makes network management and routing easier, especially when dealing with large numbers of devices.

There are many handy tools to calculate cidr range.

[https://www.ipaddressguide.com/cidr](https://www.ipaddressguide.com/cidr)

### Breaking Down CIDR Notation

An IP address typically looks like this: \`192.168.1.0\`. With CIDR, we’ll often see something like \`192.168.1.0/24\`. Here’s what that means:

*   The IP part (\`192.168.1.0\`): This is the base address, also known as the "network address." It represents the starting point of a range of IP addresses.
*   **The** \`**/24**\` **part**: This is the **CIDR suffix** and tells us how many bits (out of 32 total bits in an IPv4 address) are used to identify the network part of the address. In this case, \`/24\` means that the first 24 bits define the network, leaving the remaining 8 bits to define individual devices (or hosts) within that network.

### Internet Gateway

An **Internet Gateway (IGW)** is a managed aws service in a VPC that allows internet connection to our cloud resources.

### Subnets

A **subnet** (**sub**-**net**work) is a smaller network within one large network, usually within a **Virtual Private Cloud (VPC)**. It helps to divide an IP network into logical segments to manage traffic more effectively and improve security.

In case of AWS subnets are attached to specific availability zone. An example would be Mumbai region is ap-south-1 and it has 3 subnets in 3 diff availability zones (in a single city) as ap-south-1a, 1b and 1c. We can already see this from the default vpc.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_GqJeur_hn5crZTFFReoQQ.png)

### Types of Subnets

1.  Public Subnet:

*   A **public subnet** is a network segment that is accessible from the internet. It has an **Internet Gateway** attached, which allows traffic to flow in and out from the internet.
*   You typically place resources that need public access (like web servers) in a public subnet.

2. Private Subnet:

*   A **private subnet** is a segment that **does not** have direct internet access. Resources in a private subnet are protected from the public internet.
*   Private subnets are generally used for sensitive resources (like databases or internal services) that should not be exposed to the internet.
*   Instances in a private subnet can access the internet indirectly via a **NAT Gateway** for outbound traffic (like software updates).

By default all subnets are private, unless we attach an IGW and update the routes. We’ll see this in action when creating a VPC and subnets.

![Img credit: Kerno](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vp9un5ITb8ZmvmSsbhehhQ.gif)

### Route Tables (RT)

A **Route Table** in a VPC is a set of rules that determine where network traffic from your subnet or gateway is directed. It plays a critical role in controlling the flow of traffic in and out of your VPC, ensuring that data reaches its intended destination.

### Key Concepts of Route Tables:

1.  **Routing Rules**:

*   Each route table contains a list of routes that define how traffic is directed. Each route has a destination CIDR block (which specifies the range of IP addresses) and a target (which can be an Internet Gateway, NAT Gateway, or another resource).
*   For example, a route might specify that any traffic destined for \`0.0.0.0/0\` (which means all IP addresses) should go to the Internet Gateway (IGW).

**2. Subnet Association**:

*   Each subnet in a VPC must be associated with a route table. If no explicit route table is associated, the subnet uses the VPC’s main route table by default.
*   You can have multiple route tables in a VPC, allowing for different routing rules for different subnets.

**3. Public vs. Private Route Tables**:

*   **Public Route Table**: Contains routes directing traffic to the IGW. Subnets associated with this route table are considered public because they can send and receive traffic from the internet.
*   **Private Route Table**: Typically does not contain a route to the IGW. Instead, it may route traffic through a NAT Gateway for instances in private subnets to access the internet without exposing them directly.

### Components of a Route Table:

*   **Destination**: The destination CIDR block (e.g., \`10.0.0.0/16\`, \`0.0.0.0/0\`).
*   **Target**: The target for the traffic defined by the route (e.g., IGW, NAT Gateway, VPC Peering Connection, or another subnet).
*   **Local Route**: Automatically created for your VPC, allowing communication between instances in the same VPC.

**Example:**

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7qiNTr_-sUL69X_Ju-vjUQ.png)

in this example:

*   **The first route (0.0.0.0/0)**: Sends all internet-bound traffic to the Internet Gateway (IGW). This allows instances in the associated subnets to access the internet.
*   **The second route (172.31.0.0/16)**: Enables local communication within the VPC. This route allows instances to communicate with each other using their private IP addresses.

Alright then, lets start creating them.

Setup VPC:
----------

From the console go to vpc, click on create vpc and then select VPC only so we have granular control over what we are creating. Enter a name, choose cidr range (/24 for 256 ips, /16 for 65,536 ips etc) and create it.

You may also use the cli cmds if you wish to.

\`\`\`
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --region ap-south-1 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=WbApp_VPC}]'
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LLcXx6ZHQL6b6iZTXtGNFA.png)

The vpc has been created and a route table has also has been created.

Edit the route table name for easy identification. As we see the route table is attached to the vpc we created. (WebApp_VPC).

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zo3Lw99ezB4umw_ZEUaJrw.png)

We can now proceed to create subnets. From the left menu click on subnets, click on create subnet. Choose the recent vpc id from the drop down.



Now we choose the name, subnet CIDR and optionally AZ. Note it shows how many IPs will be available in one subnet (256 for the example below).

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Vyo3uWjBbbWH850XUHivhA.png)

Similarly you can create more subnets by clicking on add new subnets on the bottom of the page.

Be careful to choose diff cidr range, if they overlap, it wont be created.

Now we have 2 subnets. lets create an instance in the public subnet.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l9oZL4Xc5xaiK2oYV1W2Xw.png)

Note: The number of available ips now is 251 contrast to 256 while creation. This is because AWS reserves 5 IP addresses in each subnet for internal networking and management purposes.

1. Network Address: The first IP address (.0) is reserved for the network identifier.

2. VPC Router: The second IP address (.1) is used for the default gateway (VPC router).

3. Reserved by AWS: The third IP address (.2) is reserved for future AWS use.

4. DNS Server: The fourth IP address (.3) is used for Amazon's DNS service.

5. Broadcast Address: The last IP address in the range is reserved for the broadcast address (even though AWS doesn't support broadcast).

These reserved addresses ensure smooth network operation within the AWS infrastructure.

### Further operations with IGW and RT:

From the EC2 creation page, edit the network settings, choose your vpc, and then select the public subnet. Assign public ip.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MtbGSPTQ8s0x_31vbQ5PcQ.png)

Create a security group, and have SSH allowed, and launch the instance.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vCJ1emsVUgROUfyb7coMnA.png)

Alright we have our instance running, so lets ssh into it. Since I did not create a key pair, I'll use instance connect.

And here we alredy see a message saying instance is not in public subnet.
Now even if you try connecting, it will fail.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Aowz1IodF_DlCbdYQjpe4A.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Wz9UhLMdjc7kpUcMQBofZA.png)

So what’s wrong, we launched the instance in public subnet right? Nah, we just named the subnet as public but its indeed a private subnet.

Alright, so Internet gateway can provide internet to our subnet. Lets create it.

VPC — Internet gateway — Create Igw.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*P_t7vyMLhrYa-8jeDGQcHw.png)

While creating the igw, we did not specify how it going to connect to our resources, so we need to attach it to our vpc.

Select the igw — — action — attach to VPC, select your vpc.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YdExH-otbqs6QxwQ243gqg.png)

Alright, now that igw has been attached, we should b able to ssh?

Eh, still nope. The remember route tables from the above? This still does not have a route to decide what to do if the request comes from a diff ip range (out of the cidr, our ip from public internet).

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*L1Wacwv9PPeCI0S-9B97RQ.png)

We can modify the route to add another that points to the igw, but it would make the other subnet also publically accessible as this route table created automaticllay with vpc and has been associted to all subnets (2 in cour case).

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2jWvUzmjwJGO4XOjsupptQ.png)

So lets create another RT, and associate it to one subnet which we wish to be public.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*azve-cpr9HpVUJIjr1PpMg.png)

We still need to assiciate it to the subent.

Click on action - edit subnet association and then select the one you want to make public.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*q5NxGQ9fixnbS5UKeNs0mg.png)

Now, we need to update the routes of the subnet, Click on routes, then edit routes and add route.

Select 0.0.0.0/0 from the drop down, select the internet gateway from the drop down and choose your igw and save.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YtdsUU-vSoVucvDq1shP4Q.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*r1wZuPbl2oRqW7hck2fUQA.png)

Lets try ssh again and here are go.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*c_O-rucukHcD5eR1O-5x5w.png)

Create another vm in private subnet and test it, we still should not be able to ssh into it.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ABqGU8Riea_B5DHIIoRb2A.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OmB_1If4-vbzl84A1CU12g.png)

You can skip assigning public ip to the instance in private subnet. I added it just to be able to view the above message.

You can access an EC2 instance in a private subnet using a bastion host (jump server). Alternatively, if you want the instance to access the internet for outbound traffic (say to update the repo cache or install any DB server), you would use a NAT gateway, but this won’t allow inbound internet access to the instance itself. We’ll cover NAT gateways in more detail later.

Alright. So that's all. Now lets automate this lengthy process with Terraform/OpenTofu.

Automation using OpenTofu:
--------------------------

We follow the same approach. Create VPC, create 2 subnets in two diff AZs, create an IGW, add tags to the default rt, associate igw with vpc, subnet, edit routes for igw destination.

*   Data source to filter the main RT which is created automatically with the vpc, we’ll tag it later. Also getting the ami of az linux 2023 to be used in ec2 creation
*   All the resources creation and association. Tagging the main rt with null resources and creating VMs by fetching data from data.tf
*   Printing the outputs with output.tf

### Wrap Up

In this article, we’ve walked through the process of setting up an AWS VPC both manually and through Terraform. Understanding the manual setup helps you grasp the core networking components, while using Terraform simplifies and automates the deployment, making it more efficient and scalable. Whether you prefer hands-on configuration or automation, you now have the tools to build and manage your AWS VPC with confidence.

Be sure to delete/destroy resources once you are done with the experiment.

In future articles we’ll learn more about NAT gateway, bastion host, VPC peering and other features of VPC.

<!-- [Read more on Terraform →](/blogs/#terraform) -->
`,__vite_glob_0_49=`---
date: '2023-07-02T10:26:10+05:30'
draft: false
title: Infrastructure as Code (IAC) - Automation using Terraform 101
description: Chapter I — Getting Started, setup, terminologies and basic examples..
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fCBP8ShpFHETAU7JEenXLQ.png
tags:
- AWS
- Terraform
- DevOps
categories:
- Cloud Infrastructure
---


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

\`\`\`bash
alias tf='terraform'
export AWS_ACCESS_KEY_ID="<your aws access key id>"
export AWS_SECRET_ACCESS_KEY="<your aws secret access key>"
\`\`\`

Now create a file called main.tf and paste in the code below:

\`\`\`terraform
provider "aws" {
  region = "ap-south-1"
}
\`\`\`

Now we need initiate the the script so that terraform downloads the aws provider plugin.

\`\`\`
terraform init
\`\`\`

We’ll see a new folder and few more files getting generated automatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*y3BULntFvI98150xPt_wLw.png)

And since we got the successful message, we are reedy to go.

As we know the workflow consist of 3 stages and we did 1, so lets proceed with the next two stages with the 2 commnds below.

\`\`\`bash
terraform plan -- shows us the overview of the result.
terraform apply -- applies the configuration and creates the infra as we instruted.
\`\`\`

For the above config we don’t have any instruction for creating any resource. So nothing will happen.

### Example 1 - Creating an IAM user:

Starting with basics, lets create an IAM user. Add the code below to our .tf file and then run terraform plan, then terraform apply.

\`\`\`terraform
resource "aws_iam_user" "my_iam_users" {
  name  = "sagar-iam"
}
\`\`\`

Note that I have only IAM user in AWS as of now. First with plan, we see the expected outcome.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eytIvI0ADexp_TgTb5e1yw.png)

And then with apply the iam user will be created. TF apply asks for confirmation, so type yes when prompted.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LwvY46apJuWOxoXH-53PIw.png)

Now we can see the user has been created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*H0E7eGVVK9wcnxO4fyXs2w.png)

### Deleting resources:

TF lifecycle includes the destroy command to remove resources which are created using TF. Confirm the action when prompted.

\`\`\`bash
terraform destroy
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OfaN81Xu0yxUJ-AktPnpyA.png)

Now the IAM user has been deleted from our AWS account.

### Few more terraform commands:

\`\`\`bash
terraform validate -- checks syntax of our config.
terraform fmt -- rearranges the config file with proper alignments.
\`\`\`

### Example 2 - Creating S3 bucket:

Use the config below to create a bucket. Run tf init, tf plan and then tf apply. You can pass -autp-approve arg to apply command.

\`\`\`terraform
provider "aws" {
  region = "ap-south-1"
}
resource "aws_s3_bucket" "my_s3_bucket" {
    bucket = "my-s3-bucket-sagar-2-jul-23"
}
\`\`\`

\`\`\`bash
terraform apply -auto-approve
terraform destroy -auto-approve
\`\`\`

Verify that the bucket has been created in AWS console. After you done practicing, use tf destroy to delete the bucket.

Alright, we are now set to proceed with more examples and understanding in details which we’ll see in next articles. Thanks for reading.

<!-- [Read more on Terraform →](/blogs/#terraform)

[Read more on Ansible →](/blogs/#ansible) -->

References: [Terraform Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)`,__vite_glob_0_50=`---
date: '2023-07-09T10:26:10+05:30'
draft: false
title: Terraform on AWS — Outputs, Indexing and Variables
description: Chapter II —Generating Output, using Variables and Refactoring the Script into different files.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ADb5oFBqgBA4h-SDyW2D7Q.jpeg
tags:
- AWS
- vpc
- devops
- terraform
categories:
- Cloud Infrastructure
---

[**_In the previous article_**]({{< relref "terraform-setup" >}}), we setup tf and got familiar with it with basic example. Now lets proceed further.

All configs can be found on [GitHub](https://github.com/sagarkrp/Terraform_Automation).

### Displaying Output in TF:

For every action we create we can generate output also to be shown on the terminal.

To do so we need to add output block to our config.

For example on the IAM config, add the below output block at the end of the file.

\`\`\`terraform
output "iam_result" {
  value = aws_iam_user.my_iam_users
}
\`\`\`
![captionless image](https://miro.medium.com/v2/resize:fit:1204/format:webp/1*U73ZslxbACjVZPib7p3uuw.png)

As of now the the output block is very small as it contains only one resource output. Consider having multiple output blocks for different resources, in that case we can declutter the main config file by creating a new outputs.tf file and having all the output blocks there.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l875zkxC0P7bedTWoMfA5Q.png)

Now apply the config and we should see the outpu printed.

**_Note: For this kind of apply where we know that there is no change in our main requirements we can use -refresh=false. Example here since we know the iam user is already present and we don’t need to verify it._**

\`\`\`terraform
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
\`\`\`

### Indexing:

In the previous examples, we created only resource, however we can create multiple instances of same resource such as multiple S3 buckets or multiple EC2s.

We can use a count flag and pass that to the resource name.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SmTDXZwzvN1jE2aHErohZg.png)

### Variables:

Input variables are make the configuration more flexible by defining values that we can assign to customize the configuration. We can change the variable value without interfering on the actual config.

Unlike variables found in programming languages, Terraform’s input variables don’t change values during a Terraform run such as plan, apply, or destroy. Instead, they allow users to more safely customize their infrastructure by assigning different values to the variables before execution begins, rather than editing configuration files manually.

\`\`\`terraform
variable "iam_user_prefix" {
  default = "labputer_user"
}
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}
provider "aws" {
  region = "\${var.aws_region}"
}
resource "aws_iam_user" "my_iam_users" {
  count = 2
  name  = "\${var.iam_user_prefix}_\${count.index}"
}
\`\`\`
\`\`\`bash
aws_iam_user.my_iam_users[0]: Creating...
aws_iam_user.my_iam_users[1]: Creating...
aws_iam_user.my_iam_users[0]: Creation complete after 2s [id=labputer_user_0]
aws_iam_user.my_iam_users[1]: Creation complete after 2s [id=labputer_user_1]
\`\`\`

We can pass variables in different ways. In the above config if we comment the default for values, we’ll asked to enter the value while applying. We can set the variable as environment values or create a file called terraform.tfvars or pass the variable value from the command line.

example:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*U87H2aIJdulDBlQdaPESnA.png)

Create the file terraform.tfvars for the above config and add the varible with different value.

\`\`\`
iam_user_prefix = "iam_user_from_tfvars"
\`\`\`

Now if we apply, the value from the .tfvars will be used even if we don’t have it commented.

\`\`\`terraform
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
\`\`\`

If we want to override this, we can pass -var in command line.

\`\`\`terraform
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
\`\`\`

> <small>Note: Priority of variables → Command line > .tfvars > env varibles > default value.</small>

Alright that’s it for now. We’ll see more feature in further articles. Thanks for reading.

<!-- [Read more on Terraform →](/blogs/#terraform) -->`,__vite_glob_0_51=`---
date: '2024-05-12T10:26:10+05:30'
draft: false
title: Dynamic Data fetching — Data Sources in Terraform/OpenTofu
description: Chapter V - Dynamically fetch data from remote using data source in Terraform/OpenTofu.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*F6h8tusJxak5v3v4ViKYdw.png
tags:
- AWS
- vpc
- devops
- terraform
categories:
- Cloud Infrastructure
---

I have migrated of OpenTofu. If you wish to migrate, the process is pretty simple.

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

\`\`\`terraform
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
\`\`\`

This works fine. But the AMI id may change over time so hard coding it not really helpful and we’ll need to modify this in future as the ami id changes.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FSfhQnTI4giXYm9HRjV7GQ.png)

So instead lets use data provider and fetch the AMI id every time, similarly we can get the VPC id and the subnet id.

First lets modify the VPC, as I m using default VPC, I’ll get the id using the below block.

\`\`\`
resource "aws_default_vpc" "default" {
}
\`\`\`

The “aws_default_vpc” is a special block, terraform won’t be deleting this with the destroy command. Read more about it here.

[Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/default_vpc?source=post_page-----a0ed3e0350b9---------------------------------------)

Now for the security group creation block replace the vpc id with the above.

\`\`\`terraform
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

\`\`\`

For the subnets and AMI, I’ll create a separate file to have modularity.

\`\`\`terraform
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
\`\`\`

The first fetches all the subnets from the default VPC. The 2nd block fetches all the AMI ids and with the filters we are narrowing it down to our choice, such as the name _“al2023-ami-2023*”_ matches with Amazon Linux 2023 and the other filter selecting x86_64 bit architecture of the image.

So far we are fetching the details, now we need to update the usage in the main config.

\`\`\`terraform
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
\`\`\`

The index with the subnet_id is to choose 1 value as this data block retuns multiple values.

We can also verify these fetched data in the terraform/tofu console or with the show command.

\`\`\`bash
tofu show (terraform show)
tofu/terraform console
> commads here
> exit -- to  quit console
\`\`\`

Additionally you may output the info, so these will be printed at the end of the execution.

\`\`\`terraform
# outputs.tf
 output "aws_az_linux_2023_ids" {
   value = data.aws_ami.amazon_linux_2023
}
output "all the subnets in the default vpc" {
  value = data.aws_subnets.default_subnets.ids
}
\`\`\`

Now plan and apply. Upon completion we can verify. We can also see the AMI ID while it fetches.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Db77vGV3E1It8kY4hkEKlA.png)

Or on the plan generated and the output if you have created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SPicy52uiuk3O4GszA9QtQ.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*asrVne8J5OEwnBvdP5aHTg.png)

You may save the output to a josn file with the following command. This josn doc also contains the details.

\`\`\`
tofu output -json > output.json
\`\`\`

### Verify on console:

Open tofu console with “tofu console”.

\`\`\`terraform
> aws_default_vpc.default
> data.aws_ami.amazon_linux_2023.id
> data.aws_subnets.default_subnets
\`\`\`

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*k0n5uZim8HS4_PTv1az0_w.png)

### Wrap up:

The data blocks are read only configurations that read and fetch data from existing infra.

Don’t forget to destroy the resources with tofu destroy. No need to worry about deleting default VPC or subnets.

**References:** [**HashiCorp**](https://developer.hashicorp.com/terraform/language/data-sources)

<!-- [Read more on Terraform →](/blogs/#terraform) -->

`,__vite_glob_0_52=`---
date: '2024-12-22T19:26:10+05:30'
draft: false
title: Terraform Modules - Simplify, Organise and Reuse Your IAC
description: Chapter VI - Learn what is Module in Terraform/OpenTofu and how it helps us in reusing the same config.
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*I_rBd_SMpsI8tXzk5mk3Zg.png
tags:
- AWS
- Terraform
- Terraform Module
- devops
categories:
- Cloud Infrastructure
---


A **Terraform module** is a container/template for multiple resources that are used together. Modules are a way to organize and reuse code in Terraform, making infrastructure management more efficient and maintainable.

We first define the resource templates, and then we call the templates from outside of the module structures and we can even modify them as per our needs.

A typical module module looks something this this:

\`\`\`
.
├── main.tf
├── outputs.tf
├── README.md
└── variables.tf
\`\`\`

**Example:**

A basic example to create IAM users, in this case instead of creating multiple terraform files or changing one config again and again, we can create a base structure.

\`\`\`
iam_users
    ├── main.tf
    ├── output.tf
    └── variables.tf
\`\`\`

With main.tf for user name also we have a variable here, so that we can override it from the child module.

The output.tf as usual prints the details of the user post creation.

\`\`\`terraform
#main.tf
provider "aws" {
    region = "ap-south-1"
}
locals {
    iam_user_prefix = "my_iam_user"
}
resource "aws_iam_user" "my_iam_user" {
    name = "\${local.iam_user_prefix}_\${var.environment}"
}

# ----------------- #

#varibales.tf
variable "environment" {
  description = "Environment for the IAM user (e.g., dev, qa, prod)"
  default     = "default"
  type        = string
}
\`\`\`

Ok, so now since the root module is set up, lets create our child module and here, say for example I have two environments dev and dev2 (take any name). I just need to call the root module from these two files.

\`\`\`
├── dev
│   └── users
│       └── main.tf
\`\`\`

And the main.tf calls the root module by specifying the path of the module we want to run.

\`\`\`terraform
module "user_module" {

    source = "../../iam_users"
    environment = "dev"
}
\`\`\`

In this example, I have all the config under Modules dir. The iam_user dir contains the config for creating an iam user.

The module name “user_module” is user defined and can be anything.

The dev environment specifies the location, in this case, two directories back. Also passes the value for var “environment”.

So the full dir structure looks like this.

\`\`\`bash
sagar@DELL-G5:~/tofu/Modules$ tree
.
├── dev
│   └── users
│       └── main.tf
├── dev2
│   └── users
│       └── main.tf
└── iam_users
    ├── main.tf
    ├── output.tf
    └── variables.tf
5 directories, 5 files
\`\`\`

Cool, we just need to go to dev/users and run the config as usual to create my_iam_user_dev and similarly running from dev2/users would create my_iam_user_dev2.

So lets see if it works as expected, do the tf init and tf plan and we should be able to see the name shown. Apply the config and indeed the was created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zYBYxEAcsnKkQSC0mMhmHQ.png)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SuIVPUM8ryNy3aLcoqceQg.png)

Alright, that was a fairly easy and quick example to understand modules.

### Community Modules:

Terraform modules are highly reusable, and one of their greatest strengths is the availability of **community modules**. These modules are pre-built configurations shared by the Terraform community, which save time and effort when setting up common infrastructure components like S3 buckets, IAM roles, VPCs, and more.

Here’s how simple it is to use a community module:

1.  **Find a Module**: Look for a suitable module in the [Terraform Registry.](https://registry.terraform.io/browse/modules)
2.  **Copy Configuration**: Copy the module usage example into your code.
3.  **Add the Provider Block**: Include the required provider (e.g., AWS) in your configuration.
4.  **Run Terraform Commands**: Initialize and apply the configuration.

Example:

I just copied the S3 bucket module.

\`\`\`terraform
provider "aws" {
  region = "ap-south-1"
}
module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "<your_bucket_name>"
  acl    = "private"
  control_object_ownership = true
  object_ownership         = "ObjectWriter"
  versioning = {
    enabled = true
  }
}
\`\`\`

When we define the source as “terraform-aws-modules”, and do init, terraform automatically fetches the modules.

### Conclusion:

Terraform modules simplify infrastructure management by organizing and reusing code. Whether you create custom modules or use community-provided ones, it save time, ensure consistency, and make our IaC more maintainable. Start small and go modular.

<!-- [Read more on Terraform →](/blogs/#terraform) -->`,__vite_glob_1_0=`---
title: "Projects"
description: "Feaatured Projects"
---
`,__vite_glob_1_1=`---
title: "Kubernetes DevSecOps"
date: 2026-08-14
summary: "End-to-end DevSecOps implementation from application code to Kubernetes runtime"
status: "completed"
# cover: "https://i.ibb.co/pjgVNXn4/x.png"

tags:
  - devsecops
  - kubernetes
  - github actions
  - kyverno
  - falco
  - trivy
  - "SAST"
  - "DAST"
  - "SCA"

link: "https://github.com/sagarkpanda/otel-labs-platform"
blogLink: "/blogs/devsecops"
draft: false
---

## Kubernetes DevSecOps – End-to-End Security from Code to Runtime

{{< figure src="https://i.ibb.co/nMdLT5ZQ/proj-arch.png" alt="arch" width="1000" height="600" title="Project Overview" >}}


### Complete DevSecOps implementation spanning application code, container images, infrastructure, Kubernetes policies, runtime detection, and dynamic application testing.

This project demonstrates security controls integrated throughout the software delivery lifecycle rather than treated as a final security check.

The implementation uses **OTel Labs** as the instrumented application and **OTel Labs Platform** for infrastructure, Kubernetes, CI/CD, and security controls.

Builds on the [OTel on EKS](/projects/k8s-otel-proj/) infrastructure foundation.

## Security Layers

Security is implemented across seven distinct layers:

\`\`\`mermaid
graph TD
    A["Application Layer<br/>Gitleaks, Semgrep<br/>Dependabot"]
    B["Artifact Layer<br/>Trivy FS, Trivy Image<br/>SBOM"]
    C["Infrastructure Layer<br/>Trivy Config<br/>GitHub Security"]
    D["Admission Control<br/>Kyverno Policies<br/>Policy Exceptions"]
    E["Runtime Layer<br/>Falco<br/>FalcoSidekick"]
    F["Testing Layer<br/>OWASP ZAP DAST"]
    G["Findings Layer<br/>DefectDojo"]

    A --> B --> C --> D --> E --> F --> G
\`\`\`

## Architecture

\`\`\`mermaid
flowchart TB
    APP["Application Repo<br/><b>otel-labs</b>"]

    APPSCAN["Security Scanning<br/>Gitleaks<br/>Semgrep<br/>Trivy FS"]

    BUILD["Build & Scan<br/>Container Images<br/>Trivy Image<br/>Push to GHCR"]

    GITOPS["GitOps Promotion<br/>Update image tags"]

    PLATFORM["Platform Repo<br/><b>otel-labs-platform</b>"]

    PLAFSCAN["Security Scanning<br/>Gitleaks<br/>Trivy Config"]

    ARGOCD["ArgoCD Sync<br/>Kyverno Policies<br/>Applications"]

    K8S["Kubernetes Cluster<br/>Kyverno Admission<br/>Falco Runtime"]

    DAST["OWASP ZAP<br/>Dynamic Testing"]

    DD["DefectDojo<br/>Centralized Findings"]

    APP --> APPSCAN --> BUILD --> GITOPS --> PLATFORM
    PLATFORM --> PLAFSCAN --> ARGOCD --> K8S
    K8S --> DAST --> DD

    classDef repo fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    classDef scan fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef deploy fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef central fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff

    class APP,PLATFORM repo
    class APPSCAN,PLAFSCAN,BUILD,DAST scan
    class ARGOCD,K8S deploy
    class DD central
\`\`\`

## Scanning & Detection

\`\`\`mermaid
graph LR
    SRC["Source Code"]
    DEP["Dependencies"]
    IMG["Container Image"]
    INF["Infrastructure"]
    ADM["Admission"]
    RUN["Runtime"]
    APP["Application"]

    SRC -->|Gitleaks<br/>Semgrep| SC["Secrets & SAST"]
    DEP -->|Trivy FS<br/>Dependabot| DD["SCA"]
    IMG -->|Trivy Image| DI["Container Vulns"]
    INF -->|Trivy Config| CI["Config Issues"]
    ADM -->|Kyverno| KP["Policy Enforcement"]
    RUN -->|Falco| FR["Runtime Detection"]
    APP -->|OWASP ZAP| AD["Application Vulns"]

    SC --> DF["DefectDojo<br/>Centralized Findings"]
    DD --> DF
    DI --> DF
    CI --> DF
    KP --> DF
    FR --> DF
    AD --> DF
\`\`\`

## Repositories

**Application Repository:** [{{< icon name="github" size="lg" >}} otel-labs](https://github.com/sagarkpanda/otel-labs)
* Source code for Node.js, Python, and Go services
* Application security scanning (Gitleaks, Semgrep, Trivy)
* Container image builds and publishing to GHCR

**Platform Repository:** [{{< icon name="github" size="lg" >}} otel-labs-platform](https://github.com/sagarkpanda/otel-labs-platform)
* Terraform infrastructure (EKS, VPC, networking)
* Kubernetes manifests and ArgoCD applications
* Kyverno security policies and exceptions
* Infrastructure and configuration scanning
* OWASP ZAP DAST configuration

## Components

### Application Layer Security

| Tool | Purpose |
|------|---------|
| **Gitleaks** | Secret detection in code and Git history |
| **Semgrep** | SAST — insecure coding patterns |
| **Dependabot** | Automated dependency updates |

### Artifact & Infrastructure Layer

| Tool | Purpose |
|------|---------|
| **Trivy FS** | SCA — dependency vulnerability scanning |
| **Trivy Image** | Container image vulnerability scanning |
| **Trivy Config** | Terraform and Kubernetes configuration scanning |

### Kubernetes & Runtime Layer

| Tool | Purpose |
|------|---------|
| **Kyverno** | Admission control and security policy enforcement |
| **Falco** | Runtime behavior detection and alerting |
| **OWASP ZAP** | Dynamic application security testing |

### Findings Management

| Tool | Purpose |
|------|---------|
| **GitHub Security** | Centralized SARIF findings in GitHub |
| **DefectDojo** | Centralized vulnerability management across all scanners |

## Key Features

✅ **Application Security** — Gitleaks, Semgrep, Trivy scanning across multiple languages (Node.js, Python, Go)

✅ **Infrastructure as Code Scanning** — Terraform and Kubernetes manifest validation

✅ **Kubernetes Admission Control** — Kyverno policies enforcing image tags, resource limits, trusted registries

✅ **Policy Exceptions** — Scoped exceptions for legitimate platform workloads

✅ **Runtime Security** — Falco detecting suspicious process execution and file access

✅ **Dynamic Testing** — OWASP ZAP scanning deployed applications

✅ **Centralized Findings** — DefectDojo aggregating results from all security tools

✅ **GitOps Integration** — Security scanning triggered by GitHub Actions, results fed to DefectDojo

## Workflow

\`\`\`mermaid
sequenceDiagram
    participant Dev as Developer
    participant GA as GitHub Actions
    participant GH as GHCR
    participant AC as ArgoCD
    participant K8s as Kubernetes
    participant ZAP as OWASP ZAP
    participant DD as DefectDojo

    Dev->>GA: Push to otel-labs
    GA->>GA: Gitleaks, Semgrep, Trivy FS
    GA->>GH: Build & Scan Images
    GA->>AC: Update image tags

    AC->>K8s: Sync manifests
    K8s->>K8s: Kyverno validation
    K8s->>K8s: Deploy workloads
    K8s->>K8s: Falco monitoring

    K8s->>ZAP: Application ready
    ZAP->>ZAP: Run DAST scan

    GA->>DD: Report findings
    ZAP->>DD: Report findings

    DD->>Dev: Security dashboard
\`\`\`

## Deployment

### Prerequisites

* AWS account with EKS permissions
* kubectl configured
* GitHub repositories set up
* DefectDojo instance (local or cloud)

### Bootstrap

Provision the infrastructure:

\`\`\`bash
cd terraform
terraform init
terraform plan
terraform apply
\`\`\`

The bootstrap script automatically installs:
* ArgoCD
* Kyverno
* Falco

### Configure Security Workflows

Set GitHub Actions secrets in both repositories:

\`\`\`text
DEFECTDOJO_URL
DEFECTDOJO_API_KEY
\`\`\`

### Deploy Applications

Applications deploy via ArgoCD using the GitOps pattern:

\`\`\`bash
kubectl apply -f k8s/argo-apps/root-app.yml
\`\`\`

Or individually:

\`\`\`bash
kubectl apply -f k8s/argo-apps/kyverno-policy.yml
kubectl apply -f k8s/argo-apps/traefik-app.yml
kubectl apply -f k8s/argo-apps/node-frontend-app.yml
# ... etc
\`\`\`

## End-to-End Flow

\`\`\`mermaid
graph TD
    A["Code Commit<br/>otel-labs main"]
    B["Application<br/>Security Layer"]
    C["Gitleaks<br/>Semgrep<br/>Dependabot"]
    D["Build & Artifact<br/>Security Layer"]
    E["Trivy FS<br/>Trivy Image<br/>SBOM"]
    F["Container Push<br/>to GHCR"]
    G["GitOps Promotion<br/>to platform repo"]
    H["Infrastructure<br/>Security Layer"]
    I["Gitleaks<br/>Trivy Config"]
    J["ArgoCD Sync"]
    K["Kubernetes Cluster"]
    L["Admission Control"]
    M["Kyverno<br/>Policies"]
    N["Accepted<br/>Workloads"]
    O["Runtime<br/>Security Layer"]
    P["Falco<br/>FalcoSidekick"]
    Q["Application Testing"]
    R["OWASP ZAP<br/>DAST"]
    S["Findings<br/>Management"]
    T["DefectDojo<br/>Centralized View"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P
    P --> Q
    Q --> R
    R --> S
    S --> T

    C -.->|SARIF| T
    E -.->|SARIF| T
    I -.->|SARIF| T
    P -.->|Events| T
    R -.->|XML| T
\`\`\`

## Blog Post

For a detailed walkthrough of the complete implementation, architecture decisions, and hands-on examples, see:

[**End-to-End DevSecOps on EKS: Code, Containers, Kubernetes & Runtime Security**](/blogs/devsecops/)

The blog covers:
* Application security scanning (Gitleaks, Semgrep, Trivy)
* Infrastructure scanning (Trivy Config)
* Kyverno concepts and policy enforcement
* Falco runtime detection with practical examples
* OWASP ZAP dynamic testing
* DefectDojo centralized findings management
* End-to-end deployment and setup

## Implementation Status

\`\`\`mermaid
graph LR
    A["Source Code"] -->|✅| B["Dependencies"]
    B -->|✅| C["Container Image"]
    C -->|✅| D["Infrastructure"]
    D -->|✅| E["Kubernetes"]
    E -->|✅| F["Admission Control"]
    F -->|✅| G["Runtime"]
    G -->|✅| H["Application"]
    H -->|✅| I["Centralized Findings"]

    classDef complete fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    class A,B,C,D,E,F,G,H,I complete
\`\`\`

### Completed

* ✅ Gitleaks secret scanning (application + platform repos)
* ✅ Semgrep SAST analysis
* ✅ Dependabot dependency updates
* ✅ Trivy filesystem scanning (SCA)
* ✅ Trivy container image scanning
* ✅ Trivy configuration scanning (Terraform + Kubernetes)
* ✅ GitHub Security integration (SARIF uploads)
* ✅ DefectDojo centralized findings management
* ✅ Kyverno admission policies (image tags, resource limits, trusted registries)
* ✅ Kyverno policy exceptions (scoped exemptions)
* ✅ Falco runtime security with FalcoSidekick
* ✅ OWASP ZAP DAST integration
* ✅ End-to-end workflow validation
* ✅ Comprehensive blog documentation

## Related Projects

[**Infrastructure foundation and observability setup: OTel on EKS**](/projects/k8s-otel-proj/)
`,__vite_glob_1_2=`---
title: "Kubernetes Observability with AI"
date: 2026-06-20
summary: "GitOps infrastructure and Kubernetes platform for an OpenTelemetry observability demo, provisioned on Amazon EKS."
status: "completed"
# cover: "https://i.ibb.co/pjgVNXn4/x.png"
tags:
  - "traefik"
  - "opentelemetry"
  - "new relic"
  - "honeycomb"
link: "https://github.com/sagarkpanda/otel-labs-platform"
blogLink: "otel-on-eks"
draft: false
---

## OTel Labs Platform – OpenTelemetry on EKS: End-to-End Observability


### Infrastructure and GitOps platform for the **otel-labs** OpenTelemetry demo application.

The repository provisions an Amazon EKS cluster using Terraform and deploys platform components such as ArgoCD, Traefik, OpenTelemetry Collector, and Kubernetes observability tooling using GitOps.

The companion application repository is: [{{< icon name="github" size="lg" >}} otel-labs](https://github.com/sagarkpanda/otel-labs)

\`otel-labs\` contains the instrumented applications:

* Node Frontend
* Python Orders API
* Go Inventory API

Container images built from \`otel-labs\` are consumed and deployed by this repository.


## Architecture

\`\`\`mermaid
flowchart TB

    A["GitHub Repo<br/>otel-labs"]

    A -->|"Builds Images"| B["GHCR"]

    B -->|"Pulled by"| C["Amazon EKS"]

    subgraph C ["Amazon EKS"]

        T["Traefik"]

        N["Node Frontend"]

        P["Python Orders"]

        G["Go Inventory"]

        O["OpenTelemetry Collector"]

        T --> N

        N --> P
        N --> G

        N -. Telemetry .-> O
        P -. Telemetry .-> O
        G -. Telemetry .-> O

    end

    O --> NR["New Relic"]
    O --> HC["Honeycomb"]
\`\`\`

## Components

### Infrastructure

Provisioned using Terraform:

* VPC
* Public Subnets
* Amazon EKS
* Managed Node Group
* EKS Addons

### GitOps

Managed using ArgoCD:

* Traefik
* OpenTelemetry Collector
* kube-state-metrics
* Node Frontend
* Python Orders
* Go Inventory

### Observability

OpenTelemetry Collector receives:

* Metrics
* Logs
* Traces

and exports telemetry to:

* New Relic
* Honeycomb

The collector also gathers Kubernetes telemetry using:

* kubeletstats
* k8s_cluster
* kube-state-metrics

## Repository Structure

\`\`\`text
.
├── terraform/
│   ├── eks.tf
│   ├── nodegroup.tf
│   ├── addons.tf
│   ├── bootstrap.sh
│   └── ...
│
└── k8s/
    ├── argo-apps/
    ├── node-frontend/
    ├── python-orders/
    ├── go-inventory/
    ├── otel-collector/
    └── kustomization.yml
\`\`\`

## Relationship with otel-labs

This repository manages the platform.

The application repository manages the workloads.

\`\`\`mermaid
flowchart LR

    subgraph APP ["otel-labs"]
        A["Source Code"]
        B["Dockerfiles"]
        C["OpenTelemetry Instrumentation"]
        D["GitHub Actions"]
    end

    subgraph PLATFORM ["otel-labs-platform"]
        E["Terraform"]
        F["ArgoCD"]
        G["Traefik"]
        H["OpenTelemetry Collector"]
        I["Kubernetes Manifests"]
    end

    D -->|"Build Images"| J["GHCR"]

    D -->|"Update Image Tag"| I

    I -->|"GitOps Sync"| F
\`\`\`

When a new image is built from \`otel-labs\`, ArgoCD can deploy the updated image into the Kubernetes cluster managed by this repository.

## Cluster Bootstrap

Provision the cluster:

\`\`\`bash
cd terraform

terraform init

terraform plan

terraform apply
\`\`\`

Terraform creates:

* VPC
* EKS Cluster
* Managed Node Group
* EKS Addons

After the infrastructure is ready, the bootstrap script installs ArgoCD and applies required Kubernetes resources.

\`\`\`text
Terraform Apply
       │
       ▼
Amazon EKS
       │
       ▼
bootstrap.sh
       │
       ├── Update kubeconfig
       ├── Install ArgoCD
       ├── Create Namespaces
       └── Apply Secrets
\`\`\`
> If you want, you can use kubectl apply -f root_apps.yaml in the bootstartp so the workload is also created automatically

## Deploying ArgoCD Applications

The repository supports three deployment approaches.

### Option 1: Individual Applications

Create each ArgoCD Application separately.

\`\`\`bash
kubectl apply -f k8s/argo-apps/traefik-app.yml

kubectl apply -f k8s/argo-apps/kube-state-metrics-app.yml

kubectl apply -f k8s/argo-apps/otel-collector-app.yml

kubectl apply -f k8s/argo-apps/node-frontend-app.yml

kubectl apply -f k8s/argo-apps/python-orders-app.yml

kubectl apply -f k8s/argo-apps/go-inventory-app.yml
\`\`\`

### Option 2: Root Application (App of Apps)

A single parent application creates all child applications.

\`\`\`text
Root Application
      │
      ├── Traefik
      ├── kube-state-metrics
      ├── OpenTelemetry Collector
      ├── Node Frontend
      ├── Python Orders
      └── Go Inventory
\`\`\`

This is the classic ArgoCD App of Apps pattern.


### Option 3: Kustomize Bootstrap

Apply the root Kustomization.

\`\`\`bash
kubectl apply -k k8s
\`\`\`

\`\`\`text
k8s/
│
├── argo-apps/
│   ├── *.yml
│
└── kustomization.yml
\`\`\`

This creates all ArgoCD Applications in a single command.


## Accessing ArgoCD

Port-forward locally:

\`\`\`bash
kubectl port-forward svc/argocd-server -n argocd 8080:80
\`\`\`

Or access through the configured Traefik ingress by applying the ingress

\`\`\`bash
kubectl apply -fk8s/infra/argo/argo-ingress.yml
\`\`\`

## Kubernetes Observability

The OpenTelemetry Collector gathers cluster telemetry from multiple sources.

\`\`\`text
kubeletstats
      │
      ├── Node Metrics
      ├── Pod Metrics
      └── Container Metrics

k8s_cluster
      │
      ├── Cluster State
      └── Kubernetes Events

kube-state-metrics
      │
      ├── Deployments
      ├── StatefulSets
      ├── Services
      └── Replica Status
\`\`\`

This telemetry is exported together with application telemetry to both observability backends.

## Claude MCP

Integrate Honeycomb MCP server with  [***Claude***](/blogs/monitoring/otel-on-eks/#ask-claude) to and ask questions in natural language about cluster and applications. Honeycomb canvas also has the same AI capabilities.

## Related Projects

[**DevSecOps Implementation**](/projects/devsecops-proj/)`,__vite_glob_1_3=`---
title: "Enterprise SSO Identity Stack"
date: 2026-07-28
summary: "A production-style identity and access management lab demonstrating LDAP, OpenID Connect, Keycloak, Okta, and Grafana."
status: "completed"

tags:
  - LDAP
  - Keycloak
  - Okta
  - OpenID Connect
  - SSO

link: "https://github.com/sagarkpanda/sso-lab"
blogLink: "ldap-sso"
draft: false
---

## Enterprise SSO Identity Stack

### Production-style Identity and Access Management using LDAP, OpenID Connect, Keycloak and Okta

This project demonstrates how modern applications implement **Single Sign-On (SSO)** using open standards rather than vendor-specific integrations.

Beginning with a centralized LDAP directory, the lab federates identities into **Keycloak**, configures **Okta** as a second independent Identity Provider, and secures **Grafana** using **OpenID Connect (OIDC)** with group-based authorization.

Rather than focusing on a single product, the project illustrates how directory services, identity providers, authentication protocols, and applications work together to form a complete Identity and Access Management (IAM) architecture.

The complete implementation is documented in the accompanying blog post.

## Architecture

\`\`\`mermaid
flowchart LR

    U([User])

    C[Caddy]

    G[Grafana]
    PLA[phpLDAPadmin]

    K[Keycloak]
    O[Okta]

    L[(OpenLDAP)]

    U -->|HTTPS| C

    C -->|HTTPS| G
    C -->|HTTPS| PLA

    G -->|OIDC| K
    G -->|OIDC| O

    K -->|LDAP Federation| L

    PLA -->|Manage Users & Groups| L
  \`\`\`

The project demonstrates two independent authentication paths for the same application:

- **OpenLDAP → Keycloak → Grafana**
- **Okta Universal Directory → Grafana**

Both providers authenticate users via **OpenID Connect (OIDC)**, allowing Grafana to rely on standards rather than vendor-specific integrations.

---

## Components

### Directory Layer

**OpenLDAP** serves as the centralized directory storing users, groups, and directory objects.

Directory administration is performed through **phpLDAPadmin**, while Keycloak federates identities directly from LDAP without duplicating user credentials.

### Identity Providers

The project demonstrates two approaches to Identity and Access Management.

#### Keycloak

- LDAP Federation
- User Synchronization
- OpenID Connect (OIDC)
- Group Mapping
- Token Claims

#### Okta

- Universal Directory
- Users & Groups
- OpenID Connect (OIDC)
- Group Claims
- Enterprise Single Sign-On

Grafana is configured to trust **both Identity Providers**, demonstrating how modern applications authenticate users through standard protocols regardless of where identities are managed.

---

## Authentication Flows

### OpenLDAP → Keycloak → Grafana

\`\`\`mermaid
sequenceDiagram

    participant User
    participant Grafana
    participant Keycloak
    participant LDAP

    User->>Grafana: Access Application
    Grafana->>Keycloak: Redirect (OIDC Login)
    Keycloak->>LDAP: Authenticate User
    LDAP-->>Keycloak: User & Groups
    Keycloak-->>Grafana: ID Token + Group Claims
    Grafana-->>User: Authenticated Session
\`\`\`

### Okta → Grafana

\`\`\`mermaid
sequenceDiagram

    participant User
    participant Grafana
    participant Okta

    User->>Grafana: Access Application
    Grafana->>Okta: Redirect (OIDC Login)
    Okta-->>Grafana: ID Token + Group Claims
    Grafana-->>User: Authenticated Session
\`\`\`

The authentication mechanism remains identical from Grafana's perspective. The only difference is where identities are validated—**OpenLDAP (through Keycloak)** or **Okta Universal Directory**.

---

## Technology Stack

| Component | Purpose |
|-----------|---------|
| **OpenLDAP** | Central directory service |
| **phpLDAPadmin** | LDAP administration |
| **Keycloak** | Self-hosted Identity Provider |
| **PostgreSQL** | Keycloak database |
| **Okta** | Cloud Identity Provider |
| **Grafana** | OIDC-enabled application |
| **Caddy** | Reverse proxy with automatic HTTPS |
| **Docker Compose** | Service deployment |
| **AWS EC2** | Infrastructure hosting |


## What the Project Demonstrates

- Building an LDAP directory from scratch
- Managing users and groups
- LDAP federation into Keycloak
- OpenID Connect (OIDC)
- Single Sign-On (SSO)
- Integrating Grafana with multiple Identity Providers
- Group-based authorization using token claims
- Automatic HTTPS with Caddy
- Multi-server deployment across AWS EC2 instances
- Production-style IAM architecture using open standards`,__viteBrowserExternal={},__viteBrowserExternal$1=Object.freeze(Object.defineProperty({__proto__:null,default:__viteBrowserExternal},Symbol.toStringTag,{value:"Module"})),require$$0=getAugmentedNamespace(__viteBrowserExternal$1);var kindOf,hasRequiredKindOf;function requireKindOf(){if(hasRequiredKindOf)return kindOf;hasRequiredKindOf=1;var t=Object.prototype.toString;kindOf=function(h){if(h===void 0)return"undefined";if(h===null)return"null";var g=typeof h;if(g==="boolean")return"boolean";if(g==="string")return"string";if(g==="number")return"number";if(g==="symbol")return"symbol";if(g==="function")return d(h)?"generatorfunction":"function";if(o(h))return"array";if(s(h))return"buffer";if(p(h))return"arguments";if(r(h))return"date";if(a(h))return"error";if(l(h))return"regexp";switch(n(h)){case"Symbol":return"symbol";case"Promise":return"promise";case"WeakMap":return"weakmap";case"WeakSet":return"weakset";case"Map":return"map";case"Set":return"set";case"Int8Array":return"int8array";case"Uint8Array":return"uint8array";case"Uint8ClampedArray":return"uint8clampedarray";case"Int16Array":return"int16array";case"Uint16Array":return"uint16array";case"Int32Array":return"int32array";case"Uint32Array":return"uint32array";case"Float32Array":return"float32array";case"Float64Array":return"float64array"}if(c(h))return"generator";switch(g=t.call(h),g){case"[object Object]":return"object";case"[object Map Iterator]":return"mapiterator";case"[object Set Iterator]":return"setiterator";case"[object String Iterator]":return"stringiterator";case"[object Array Iterator]":return"arrayiterator"}return g.slice(8,-1).toLowerCase().replace(/\s/g,"")};function n(u){return typeof u.constructor=="function"?u.constructor.name:null}function o(u){return Array.isArray?Array.isArray(u):u instanceof Array}function a(u){return u instanceof Error||typeof u.message=="string"&&u.constructor&&typeof u.constructor.stackTraceLimit=="number"}function r(u){return u instanceof Date?!0:typeof u.toDateString=="function"&&typeof u.getDate=="function"&&typeof u.setDate=="function"}function l(u){return u instanceof RegExp?!0:typeof u.flags=="string"&&typeof u.ignoreCase=="boolean"&&typeof u.multiline=="boolean"&&typeof u.global=="boolean"}function d(u,h){return n(u)==="GeneratorFunction"}function c(u){return typeof u.throw=="function"&&typeof u.return=="function"&&typeof u.next=="function"}function p(u){try{if(typeof u.length=="number"&&typeof u.callee=="function")return!0}catch(h){if(h.message.indexOf("callee")!==-1)return!0}return!1}function s(u){return u.constructor&&typeof u.constructor.isBuffer=="function"?u.constructor.isBuffer(u):!1}return kindOf}/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */var isExtendable,hasRequiredIsExtendable;function requireIsExtendable(){return hasRequiredIsExtendable||(hasRequiredIsExtendable=1,isExtendable=function(n){return typeof n<"u"&&n!==null&&(typeof n=="object"||typeof n=="function")}),isExtendable}var extendShallow,hasRequiredExtendShallow;function requireExtendShallow(){if(hasRequiredExtendShallow)return extendShallow;hasRequiredExtendShallow=1;var t=requireIsExtendable();extendShallow=function(r){t(r)||(r={});for(var l=arguments.length,d=1;d<l;d++){var c=arguments[d];t(c)&&n(r,c)}return r};function n(a,r){for(var l in r)o(r,l)&&(a[l]=r[l])}function o(a,r){return Object.prototype.hasOwnProperty.call(a,r)}return extendShallow}var sectionMatter,hasRequiredSectionMatter;function requireSectionMatter(){if(hasRequiredSectionMatter)return sectionMatter;hasRequiredSectionMatter=1;var t=requireKindOf(),n=requireExtendShallow();sectionMatter=function(p,s){typeof s=="function"&&(s={parse:s});var u=a(p),h={section_delimiter:"---",parse:d},g=n({},h,s),C=g.section_delimiter,k=u.content.split(/\r?\n/),P=null,E=l(),O=[],N=[];function G(V){u.content=V,P=[],O=[]}function j(V){N.length&&(E.key=r(N[0],C),E.content=V,g.parse(E,P),P.push(E),E=l(),O=[],N=[])}for(var F=0;F<k.length;F++){var K=k[F],W=N.length,B=K.trim();if(o(B,C)){if(B.length===3&&F!==0){if(W===0||W===2){O.push(K);continue}N.push(B),E.data=O.join(`
`),O=[];continue}P===null&&G(O.join(`
`)),W===2&&j(O.join(`
`)),N.push(B);continue}O.push(K)}return P===null?G(O.join(`
`)):j(O.join(`
`)),u.sections=P,u};function o(p,s){return!(p.slice(0,s.length)!==s||p.charAt(s.length+1)===s.slice(-1))}function a(p){if(t(p)!=="object"&&(p={content:p}),typeof p.content!="string"&&!c(p.content))throw new TypeError("expected a buffer or string");return p.content=p.content.toString(),p.sections=[],p}function r(p,s){return p?p.slice(s.length).trim():""}function l(){return{key:"",data:"",content:""}}function d(p){return p}function c(p){return p&&p.constructor&&typeof p.constructor.isBuffer=="function"?p.constructor.isBuffer(p):!1}return sectionMatter}var engines={exports:{}},jsYaml$1={},loader={},common={},hasRequiredCommon;function requireCommon(){if(hasRequiredCommon)return common;hasRequiredCommon=1;function t(d){return typeof d>"u"||d===null}function n(d){return typeof d=="object"&&d!==null}function o(d){return Array.isArray(d)?d:t(d)?[]:[d]}function a(d,c){var p,s,u,h;if(c)for(h=Object.keys(c),p=0,s=h.length;p<s;p+=1)u=h[p],d[u]=c[u];return d}function r(d,c){var p="",s;for(s=0;s<c;s+=1)p+=d;return p}function l(d){return d===0&&Number.NEGATIVE_INFINITY===1/d}return common.isNothing=t,common.isObject=n,common.toArray=o,common.repeat=r,common.isNegativeZero=l,common.extend=a,common}var exception,hasRequiredException;function requireException(){if(hasRequiredException)return exception;hasRequiredException=1;function t(n,o){Error.call(this),this.name="YAMLException",this.reason=n,this.mark=o,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t.prototype.toString=function(o){var a=this.name+": ";return a+=this.reason||"(unknown reason)",!o&&this.mark&&(a+=" "+this.mark.toString()),a},exception=t,exception}var mark,hasRequiredMark;function requireMark(){if(hasRequiredMark)return mark;hasRequiredMark=1;var t=requireCommon();function n(o,a,r,l,d){this.name=o,this.buffer=a,this.position=r,this.line=l,this.column=d}return n.prototype.getSnippet=function(a,r){var l,d,c,p,s;if(!this.buffer)return null;for(a=a||4,r=r||75,l="",d=this.position;d>0&&`\0\r
\u2028\u2029`.indexOf(this.buffer.charAt(d-1))===-1;)if(d-=1,this.position-d>r/2-1){l=" ... ",d+=5;break}for(c="",p=this.position;p<this.buffer.length&&`\0\r
\u2028\u2029`.indexOf(this.buffer.charAt(p))===-1;)if(p+=1,p-this.position>r/2-1){c=" ... ",p-=5;break}return s=this.buffer.slice(d,p),t.repeat(" ",a)+l+s+c+`
`+t.repeat(" ",a+this.position-d+l.length)+"^"},n.prototype.toString=function(a){var r,l="";return this.name&&(l+='in "'+this.name+'" '),l+="at line "+(this.line+1)+", column "+(this.column+1),a||(r=this.getSnippet(),r&&(l+=`:
`+r)),l},mark=n,mark}var type,hasRequiredType;function requireType(){if(hasRequiredType)return type;hasRequiredType=1;var t=requireException(),n=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],o=["scalar","sequence","mapping"];function a(l){var d={};return l!==null&&Object.keys(l).forEach(function(c){l[c].forEach(function(p){d[String(p)]=c})}),d}function r(l,d){if(d=d||{},Object.keys(d).forEach(function(c){if(n.indexOf(c)===-1)throw new t('Unknown option "'+c+'" is met in definition of "'+l+'" YAML type.')}),this.tag=l,this.kind=d.kind||null,this.resolve=d.resolve||function(){return!0},this.construct=d.construct||function(c){return c},this.instanceOf=d.instanceOf||null,this.predicate=d.predicate||null,this.represent=d.represent||null,this.defaultStyle=d.defaultStyle||null,this.styleAliases=a(d.styleAliases||null),o.indexOf(this.kind)===-1)throw new t('Unknown kind "'+this.kind+'" is specified for "'+l+'" YAML type.')}return type=r,type}var schema,hasRequiredSchema;function requireSchema(){if(hasRequiredSchema)return schema;hasRequiredSchema=1;var t=requireCommon(),n=requireException(),o=requireType();function a(d,c,p){var s=[];return d.include.forEach(function(u){p=a(u,c,p)}),d[c].forEach(function(u){p.forEach(function(h,g){h.tag===u.tag&&h.kind===u.kind&&s.push(g)}),p.push(u)}),p.filter(function(u,h){return s.indexOf(h)===-1})}function r(){var d={scalar:{},sequence:{},mapping:{},fallback:{}},c,p;function s(u){d[u.kind][u.tag]=d.fallback[u.tag]=u}for(c=0,p=arguments.length;c<p;c+=1)arguments[c].forEach(s);return d}function l(d){this.include=d.include||[],this.implicit=d.implicit||[],this.explicit=d.explicit||[],this.implicit.forEach(function(c){if(c.loadKind&&c.loadKind!=="scalar")throw new n("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=a(this,"implicit",[]),this.compiledExplicit=a(this,"explicit",[]),this.compiledTypeMap=r(this.compiledImplicit,this.compiledExplicit)}return l.DEFAULT=null,l.create=function(){var c,p;switch(arguments.length){case 1:c=l.DEFAULT,p=arguments[0];break;case 2:c=arguments[0],p=arguments[1];break;default:throw new n("Wrong number of arguments for Schema.create function")}if(c=t.toArray(c),p=t.toArray(p),!c.every(function(s){return s instanceof l}))throw new n("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!p.every(function(s){return s instanceof o}))throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new l({include:c,explicit:p})},schema=l,schema}var str,hasRequiredStr;function requireStr(){if(hasRequiredStr)return str;hasRequiredStr=1;var t=requireType();return str=new t("tag:yaml.org,2002:str",{kind:"scalar",construct:function(n){return n!==null?n:""}}),str}var seq,hasRequiredSeq;function requireSeq(){if(hasRequiredSeq)return seq;hasRequiredSeq=1;var t=requireType();return seq=new t("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(n){return n!==null?n:[]}}),seq}var map,hasRequiredMap;function requireMap(){if(hasRequiredMap)return map;hasRequiredMap=1;var t=requireType();return map=new t("tag:yaml.org,2002:map",{kind:"mapping",construct:function(n){return n!==null?n:{}}}),map}var failsafe,hasRequiredFailsafe;function requireFailsafe(){if(hasRequiredFailsafe)return failsafe;hasRequiredFailsafe=1;var t=requireSchema();return failsafe=new t({explicit:[requireStr(),requireSeq(),requireMap()]}),failsafe}var _null,hasRequired_null;function require_null(){if(hasRequired_null)return _null;hasRequired_null=1;var t=requireType();function n(r){if(r===null)return!0;var l=r.length;return l===1&&r==="~"||l===4&&(r==="null"||r==="Null"||r==="NULL")}function o(){return null}function a(r){return r===null}return _null=new t("tag:yaml.org,2002:null",{kind:"scalar",resolve:n,construct:o,predicate:a,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"}),_null}var bool,hasRequiredBool;function requireBool(){if(hasRequiredBool)return bool;hasRequiredBool=1;var t=requireType();function n(r){if(r===null)return!1;var l=r.length;return l===4&&(r==="true"||r==="True"||r==="TRUE")||l===5&&(r==="false"||r==="False"||r==="FALSE")}function o(r){return r==="true"||r==="True"||r==="TRUE"}function a(r){return Object.prototype.toString.call(r)==="[object Boolean]"}return bool=new t("tag:yaml.org,2002:bool",{kind:"scalar",resolve:n,construct:o,predicate:a,represent:{lowercase:function(r){return r?"true":"false"},uppercase:function(r){return r?"TRUE":"FALSE"},camelcase:function(r){return r?"True":"False"}},defaultStyle:"lowercase"}),bool}var int,hasRequiredInt;function requireInt(){if(hasRequiredInt)return int;hasRequiredInt=1;var t=requireCommon(),n=requireType();function o(p){return 48<=p&&p<=57||65<=p&&p<=70||97<=p&&p<=102}function a(p){return 48<=p&&p<=55}function r(p){return 48<=p&&p<=57}function l(p){if(p===null)return!1;var s=p.length,u=0,h=!1,g;if(!s)return!1;if(g=p[u],(g==="-"||g==="+")&&(g=p[++u]),g==="0"){if(u+1===s)return!0;if(g=p[++u],g==="b"){for(u++;u<s;u++)if(g=p[u],g!=="_"){if(g!=="0"&&g!=="1")return!1;h=!0}return h&&g!=="_"}if(g==="x"){for(u++;u<s;u++)if(g=p[u],g!=="_"){if(!o(p.charCodeAt(u)))return!1;h=!0}return h&&g!=="_"}for(;u<s;u++)if(g=p[u],g!=="_"){if(!a(p.charCodeAt(u)))return!1;h=!0}return h&&g!=="_"}if(g==="_")return!1;for(;u<s;u++)if(g=p[u],g!=="_"){if(g===":")break;if(!r(p.charCodeAt(u)))return!1;h=!0}return!h||g==="_"?!1:g!==":"?!0:/^(:[0-5]?[0-9])+$/.test(p.slice(u))}function d(p){var s=p,u=1,h,g,C=[];return s.indexOf("_")!==-1&&(s=s.replace(/_/g,"")),h=s[0],(h==="-"||h==="+")&&(h==="-"&&(u=-1),s=s.slice(1),h=s[0]),s==="0"?0:h==="0"?s[1]==="b"?u*parseInt(s.slice(2),2):s[1]==="x"?u*parseInt(s,16):u*parseInt(s,8):s.indexOf(":")!==-1?(s.split(":").forEach(function(k){C.unshift(parseInt(k,10))}),s=0,g=1,C.forEach(function(k){s+=k*g,g*=60}),u*s):u*parseInt(s,10)}function c(p){return Object.prototype.toString.call(p)==="[object Number]"&&p%1===0&&!t.isNegativeZero(p)}return int=new n("tag:yaml.org,2002:int",{kind:"scalar",resolve:l,construct:d,predicate:c,represent:{binary:function(p){return p>=0?"0b"+p.toString(2):"-0b"+p.toString(2).slice(1)},octal:function(p){return p>=0?"0"+p.toString(8):"-0"+p.toString(8).slice(1)},decimal:function(p){return p.toString(10)},hexadecimal:function(p){return p>=0?"0x"+p.toString(16).toUpperCase():"-0x"+p.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),int}var float,hasRequiredFloat;function requireFloat(){if(hasRequiredFloat)return float;hasRequiredFloat=1;var t=requireCommon(),n=requireType(),o=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function a(p){return!(p===null||!o.test(p)||p[p.length-1]==="_")}function r(p){var s,u,h,g;return s=p.replace(/_/g,"").toLowerCase(),u=s[0]==="-"?-1:1,g=[],"+-".indexOf(s[0])>=0&&(s=s.slice(1)),s===".inf"?u===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:s===".nan"?NaN:s.indexOf(":")>=0?(s.split(":").forEach(function(C){g.unshift(parseFloat(C,10))}),s=0,h=1,g.forEach(function(C){s+=C*h,h*=60}),u*s):u*parseFloat(s,10)}var l=/^[-+]?[0-9]+e/;function d(p,s){var u;if(isNaN(p))switch(s){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===p)switch(s){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===p)switch(s){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(t.isNegativeZero(p))return"-0.0";return u=p.toString(10),l.test(u)?u.replace("e",".e"):u}function c(p){return Object.prototype.toString.call(p)==="[object Number]"&&(p%1!==0||t.isNegativeZero(p))}return float=new n("tag:yaml.org,2002:float",{kind:"scalar",resolve:a,construct:r,predicate:c,represent:d,defaultStyle:"lowercase"}),float}var json,hasRequiredJson;function requireJson(){if(hasRequiredJson)return json;hasRequiredJson=1;var t=requireSchema();return json=new t({include:[requireFailsafe()],implicit:[require_null(),requireBool(),requireInt(),requireFloat()]}),json}var core,hasRequiredCore;function requireCore(){if(hasRequiredCore)return core;hasRequiredCore=1;var t=requireSchema();return core=new t({include:[requireJson()]}),core}var timestamp,hasRequiredTimestamp;function requireTimestamp(){if(hasRequiredTimestamp)return timestamp;hasRequiredTimestamp=1;var t=requireType(),n=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),o=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function a(d){return d===null?!1:n.exec(d)!==null||o.exec(d)!==null}function r(d){var c,p,s,u,h,g,C,k=0,P=null,E,O,N;if(c=n.exec(d),c===null&&(c=o.exec(d)),c===null)throw new Error("Date resolve error");if(p=+c[1],s=+c[2]-1,u=+c[3],!c[4])return new Date(Date.UTC(p,s,u));if(h=+c[4],g=+c[5],C=+c[6],c[7]){for(k=c[7].slice(0,3);k.length<3;)k+="0";k=+k}return c[9]&&(E=+c[10],O=+(c[11]||0),P=(E*60+O)*6e4,c[9]==="-"&&(P=-P)),N=new Date(Date.UTC(p,s,u,h,g,C,k)),P&&N.setTime(N.getTime()-P),N}function l(d){return d.toISOString()}return timestamp=new t("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:a,construct:r,instanceOf:Date,represent:l}),timestamp}var merge,hasRequiredMerge;function requireMerge(){if(hasRequiredMerge)return merge;hasRequiredMerge=1;var t=requireType();function n(o){return o==="<<"||o===null}return merge=new t("tag:yaml.org,2002:merge",{kind:"scalar",resolve:n}),merge}function commonjsRequire(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var binary,hasRequiredBinary;function requireBinary(){if(hasRequiredBinary)return binary;hasRequiredBinary=1;var t;try{var n=commonjsRequire;t=n("buffer").Buffer}catch{}var o=requireType(),a=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function r(p){if(p===null)return!1;var s,u,h=0,g=p.length,C=a;for(u=0;u<g;u++)if(s=C.indexOf(p.charAt(u)),!(s>64)){if(s<0)return!1;h+=6}return h%8===0}function l(p){var s,u,h=p.replace(/[\r\n=]/g,""),g=h.length,C=a,k=0,P=[];for(s=0;s<g;s++)s%4===0&&s&&(P.push(k>>16&255),P.push(k>>8&255),P.push(k&255)),k=k<<6|C.indexOf(h.charAt(s));return u=g%4*6,u===0?(P.push(k>>16&255),P.push(k>>8&255),P.push(k&255)):u===18?(P.push(k>>10&255),P.push(k>>2&255)):u===12&&P.push(k>>4&255),t?t.from?t.from(P):new t(P):P}function d(p){var s="",u=0,h,g,C=p.length,k=a;for(h=0;h<C;h++)h%3===0&&h&&(s+=k[u>>18&63],s+=k[u>>12&63],s+=k[u>>6&63],s+=k[u&63]),u=(u<<8)+p[h];return g=C%3,g===0?(s+=k[u>>18&63],s+=k[u>>12&63],s+=k[u>>6&63],s+=k[u&63]):g===2?(s+=k[u>>10&63],s+=k[u>>4&63],s+=k[u<<2&63],s+=k[64]):g===1&&(s+=k[u>>2&63],s+=k[u<<4&63],s+=k[64],s+=k[64]),s}function c(p){return t&&t.isBuffer(p)}return binary=new o("tag:yaml.org,2002:binary",{kind:"scalar",resolve:r,construct:l,predicate:c,represent:d}),binary}var omap,hasRequiredOmap;function requireOmap(){if(hasRequiredOmap)return omap;hasRequiredOmap=1;var t=requireType(),n=Object.prototype.hasOwnProperty,o=Object.prototype.toString;function a(l){if(l===null)return!0;var d={},c,p,s,u,h,g=l;for(c=0,p=g.length;c<p;c+=1){if(s=g[c],h=!1,o.call(s)!=="[object Object]")return!1;for(u in s)if(n.call(s,u))if(!h)h=!0;else return!1;if(!h||n.call(d,u))return!1;Object.defineProperty(d,u,{value:!0})}return!0}function r(l){return l!==null?l:[]}return omap=new t("tag:yaml.org,2002:omap",{kind:"sequence",resolve:a,construct:r}),omap}var pairs,hasRequiredPairs;function requirePairs(){if(hasRequiredPairs)return pairs;hasRequiredPairs=1;var t=requireType(),n=Object.prototype.toString;function o(r){if(r===null)return!0;var l,d,c,p,s,u=r;for(s=new Array(u.length),l=0,d=u.length;l<d;l+=1){if(c=u[l],n.call(c)!=="[object Object]"||(p=Object.keys(c),p.length!==1))return!1;s[l]=[p[0],c[p[0]]]}return!0}function a(r){if(r===null)return[];var l,d,c,p,s,u=r;for(s=new Array(u.length),l=0,d=u.length;l<d;l+=1)c=u[l],p=Object.keys(c),s[l]=[p[0],c[p[0]]];return s}return pairs=new t("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:o,construct:a}),pairs}var set,hasRequiredSet;function requireSet(){if(hasRequiredSet)return set;hasRequiredSet=1;var t=requireType(),n=Object.prototype.hasOwnProperty;function o(r){if(r===null)return!0;var l,d=r;for(l in d)if(n.call(d,l)&&d[l]!==null)return!1;return!0}function a(r){return r!==null?r:{}}return set=new t("tag:yaml.org,2002:set",{kind:"mapping",resolve:o,construct:a}),set}var default_safe,hasRequiredDefault_safe;function requireDefault_safe(){if(hasRequiredDefault_safe)return default_safe;hasRequiredDefault_safe=1;var t=requireSchema();return default_safe=new t({include:[requireCore()],implicit:[requireTimestamp(),requireMerge()],explicit:[requireBinary(),requireOmap(),requirePairs(),requireSet()]}),default_safe}var _undefined,hasRequired_undefined;function require_undefined(){if(hasRequired_undefined)return _undefined;hasRequired_undefined=1;var t=requireType();function n(){return!0}function o(){}function a(){return""}function r(l){return typeof l>"u"}return _undefined=new t("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:n,construct:o,predicate:r,represent:a}),_undefined}var regexp,hasRequiredRegexp;function requireRegexp(){if(hasRequiredRegexp)return regexp;hasRequiredRegexp=1;var t=requireType();function n(l){if(l===null||l.length===0)return!1;var d=l,c=/\/([gim]*)$/.exec(l),p="";return!(d[0]==="/"&&(c&&(p=c[1]),p.length>3||d[d.length-p.length-1]!=="/"))}function o(l){var d=l,c=/\/([gim]*)$/.exec(l),p="";return d[0]==="/"&&(c&&(p=c[1]),d=d.slice(1,d.length-p.length-1)),new RegExp(d,p)}function a(l){var d="/"+l.source+"/";return l.global&&(d+="g"),l.multiline&&(d+="m"),l.ignoreCase&&(d+="i"),d}function r(l){return Object.prototype.toString.call(l)==="[object RegExp]"}return regexp=new t("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:n,construct:o,predicate:r,represent:a}),regexp}var _function,hasRequired_function;function require_function(){if(hasRequired_function)return _function;hasRequired_function=1;var t;try{var n=commonjsRequire;t=n("esprima")}catch{typeof window<"u"&&(t=window.esprima)}var o=requireType();function a(c){if(c===null)return!1;try{var p="("+c+")",s=t.parse(p,{range:!0});return!(s.type!=="Program"||s.body.length!==1||s.body[0].type!=="ExpressionStatement"||s.body[0].expression.type!=="ArrowFunctionExpression"&&s.body[0].expression.type!=="FunctionExpression")}catch{return!1}}function r(c){var p="("+c+")",s=t.parse(p,{range:!0}),u=[],h;if(s.type!=="Program"||s.body.length!==1||s.body[0].type!=="ExpressionStatement"||s.body[0].expression.type!=="ArrowFunctionExpression"&&s.body[0].expression.type!=="FunctionExpression")throw new Error("Failed to resolve function");return s.body[0].expression.params.forEach(function(g){u.push(g.name)}),h=s.body[0].expression.body.range,s.body[0].expression.body.type==="BlockStatement"?new Function(u,p.slice(h[0]+1,h[1]-1)):new Function(u,"return "+p.slice(h[0],h[1]))}function l(c){return c.toString()}function d(c){return Object.prototype.toString.call(c)==="[object Function]"}return _function=new o("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:a,construct:r,predicate:d,represent:l}),_function}var default_full,hasRequiredDefault_full;function requireDefault_full(){if(hasRequiredDefault_full)return default_full;hasRequiredDefault_full=1;var t=requireSchema();return default_full=t.DEFAULT=new t({include:[requireDefault_safe()],explicit:[require_undefined(),requireRegexp(),require_function()]}),default_full}var hasRequiredLoader;function requireLoader(){if(hasRequiredLoader)return loader;hasRequiredLoader=1;var t=requireCommon(),n=requireException(),o=requireMark(),a=requireDefault_safe(),r=requireDefault_full(),l=Object.prototype.hasOwnProperty,d=1,c=2,p=3,s=4,u=1,h=2,g=3,C=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,k=/[\x85\u2028\u2029]/,P=/[,\[\]\{\}]/,E=/^(?:!|!!|![a-z\-]+!)$/i,O=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function N(e){return Object.prototype.toString.call(e)}function G(e){return e===10||e===13}function j(e){return e===9||e===32}function F(e){return e===9||e===32||e===10||e===13}function K(e){return e===44||e===91||e===93||e===123||e===125}function W(e){var b;return 48<=e&&e<=57?e-48:(b=e|32,97<=b&&b<=102?b-97+10:-1)}function B(e){return e===120?2:e===117?4:e===85?8:0}function V(e){return 48<=e&&e<=57?e-48:-1}function le(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"":e===95?" ":e===76?"\u2028":e===80?"\u2029":""}function ce(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function pe(e,b,v){b==="__proto__"?Object.defineProperty(e,b,{configurable:!0,enumerable:!0,writable:!0,value:v}):e[b]=v}for(var re=new Array(256),H=new Array(256),Q=0;Q<256;Q++)re[Q]=le(Q)?1:0,H[Q]=le(Q);function xe(e,b){this.input=e,this.filename=b.filename||null,this.schema=b.schema||r,this.onWarning=b.onWarning||null,this.legacy=b.legacy||!1,this.json=b.json||!1,this.listener=b.listener||null,this.maxTotalMergeKeys=typeof b.maxTotalMergeKeys=="number"?b.maxTotalMergeKeys:1e4,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.totalMergeKeys=0,this.documents=[]}function se(e,b){return new n(b,new o(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function D(e,b){throw se(e,b)}function X(e,b){e.onWarning&&e.onWarning.call(null,se(e,b))}var ne={YAML:function(b,v,T){var i,m,f;b.version!==null&&D(b,"duplication of %YAML directive"),T.length!==1&&D(b,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(T[0]),i===null&&D(b,"ill-formed argument of the YAML directive"),m=parseInt(i[1],10),f=parseInt(i[2],10),m!==1&&D(b,"unacceptable YAML version of the document"),b.version=T[0],b.checkLineBreaks=f<2,f!==1&&f!==2&&X(b,"unsupported YAML version of the document")},TAG:function(b,v,T){var i,m;T.length!==2&&D(b,"TAG directive accepts exactly two arguments"),i=T[0],m=T[1],E.test(i)||D(b,"ill-formed tag handle (first argument) of the TAG directive"),l.call(b.tagMap,i)&&D(b,'there is a previously declared suffix for "'+i+'" tag handle'),O.test(m)||D(b,"ill-formed tag prefix (second argument) of the TAG directive"),b.tagMap[i]=m}};function U(e,b,v,T){var i,m,f,w;if(b<v){if(w=e.input.slice(b,v),T)for(i=0,m=w.length;i<m;i+=1)f=w.charCodeAt(i),f===9||32<=f&&f<=1114111||D(e,"expected valid JSON character");else C.test(w)&&D(e,"the stream contains non-printable characters");e.result+=w}}function te(e){e.totalMergeKeys+=1,e.maxTotalMergeKeys!==-1&&e.totalMergeKeys>e.maxTotalMergeKeys&&D(e,"merge keys exceeded maxTotalMergeKeys ("+e.maxTotalMergeKeys+")")}function Y(e,b,v,T){var i,m,f,w;for(t.isObject(v)||D(e,"cannot merge mappings; the provided source object is unacceptable"),te(e),i=Object.keys(v),f=0,w=i.length;f<w;f+=1)m=i[f],te(e),l.call(b,m)||(pe(b,m,v[m]),T[m]=!0)}function J(e,b,v,T,i,m,f,w){var y,A;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),y=0,A=i.length;y<A;y+=1)Array.isArray(i[y])&&D(e,"nested arrays are not supported inside keys"),typeof i=="object"&&N(i[y])==="[object Object]"&&(i[y]="[object Object]");if(typeof i=="object"&&N(i)==="[object Object]"&&(i="[object Object]"),i=String(i),b===null&&(b={}),T==="tag:yaml.org,2002:merge")if(Array.isArray(m))for(m.length>100&&D(e,"abnormal merge sequence size"),y=0,A=m.length;y<A;y+=1)Y(e,b,m[y],v);else Y(e,b,m,v);else!e.json&&!l.call(v,i)&&l.call(b,i)&&(e.line=f||e.line,e.position=w||e.position,D(e,"duplicated mapping key")),pe(b,i,m),delete v[i];return b}function ae(e){var b;b=e.input.charCodeAt(e.position),b===10?e.position++:b===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):D(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function M(e,b,v){for(var T=0,i=e.input.charCodeAt(e.position);i!==0;){for(;j(i);)i=e.input.charCodeAt(++e.position);if(b&&i===35)do i=e.input.charCodeAt(++e.position);while(i!==10&&i!==13&&i!==0);if(G(i))for(ae(e),i=e.input.charCodeAt(e.position),T++,e.lineIndent=0;i===32;)e.lineIndent++,i=e.input.charCodeAt(++e.position);else break}return v!==-1&&T!==0&&e.lineIndent<v&&X(e,"deficient indentation"),T}function ee(e){var b=e.position,v;return v=e.input.charCodeAt(b),!!((v===45||v===46)&&v===e.input.charCodeAt(b+1)&&v===e.input.charCodeAt(b+2)&&(b+=3,v=e.input.charCodeAt(b),v===0||F(v)))}function ie(e,b){b===1?e.result+=" ":b>1&&(e.result+=t.repeat(`
`,b-1))}function ue(e,b,v){var T,i,m,f,w,y,A,_,x=e.kind,I=e.result,S;if(S=e.input.charCodeAt(e.position),F(S)||K(S)||S===35||S===38||S===42||S===33||S===124||S===62||S===39||S===34||S===37||S===64||S===96||(S===63||S===45)&&(i=e.input.charCodeAt(e.position+1),F(i)||v&&K(i)))return!1;for(e.kind="scalar",e.result="",m=f=e.position,w=!1;S!==0;){if(S===58){if(i=e.input.charCodeAt(e.position+1),F(i)||v&&K(i))break}else if(S===35){if(T=e.input.charCodeAt(e.position-1),F(T))break}else{if(e.position===e.lineStart&&ee(e)||v&&K(S))break;if(G(S))if(y=e.line,A=e.lineStart,_=e.lineIndent,M(e,!1,-1),e.lineIndent>=b){w=!0,S=e.input.charCodeAt(e.position);continue}else{e.position=f,e.line=y,e.lineStart=A,e.lineIndent=_;break}}w&&(U(e,m,f,!1),ie(e,e.line-y),m=f=e.position,w=!1),j(S)||(f=e.position+1),S=e.input.charCodeAt(++e.position)}return U(e,m,f,!1),e.result?!0:(e.kind=x,e.result=I,!1)}function de(e,b){var v,T,i;if(v=e.input.charCodeAt(e.position),v!==39)return!1;for(e.kind="scalar",e.result="",e.position++,T=i=e.position;(v=e.input.charCodeAt(e.position))!==0;)if(v===39)if(U(e,T,e.position,!0),v=e.input.charCodeAt(++e.position),v===39)T=e.position,e.position++,i=e.position;else return!0;else G(v)?(U(e,T,i,!0),ie(e,M(e,!1,b)),T=i=e.position):e.position===e.lineStart&&ee(e)?D(e,"unexpected end of the document within a single quoted scalar"):(e.position++,i=e.position);D(e,"unexpected end of the stream within a single quoted scalar")}function he(e,b){var v,T,i,m,f,w;if(w=e.input.charCodeAt(e.position),w!==34)return!1;for(e.kind="scalar",e.result="",e.position++,v=T=e.position;(w=e.input.charCodeAt(e.position))!==0;){if(w===34)return U(e,v,e.position,!0),e.position++,!0;if(w===92){if(U(e,v,e.position,!0),w=e.input.charCodeAt(++e.position),G(w))M(e,!1,b);else if(w<256&&re[w])e.result+=H[w],e.position++;else if((f=B(w))>0){for(i=f,m=0;i>0;i--)w=e.input.charCodeAt(++e.position),(f=W(w))>=0?m=(m<<4)+f:D(e,"expected hexadecimal character");e.result+=ce(m),e.position++}else D(e,"unknown escape sequence");v=T=e.position}else G(w)?(U(e,v,T,!0),ie(e,M(e,!1,b)),v=T=e.position):e.position===e.lineStart&&ee(e)?D(e,"unexpected end of the document within a double quoted scalar"):(e.position++,T=e.position)}D(e,"unexpected end of the stream within a double quoted scalar")}function oe(e,b){var v=!0,T,i=e.tag,m,f=e.anchor,w,y,A,_,x,I={},S,L,z,R;if(R=e.input.charCodeAt(e.position),R===91)y=93,x=!1,m=[];else if(R===123)y=125,x=!0,m={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=m),R=e.input.charCodeAt(++e.position);R!==0;){if(M(e,!0,b),R=e.input.charCodeAt(e.position),R===y)return e.position++,e.tag=i,e.anchor=f,e.kind=x?"mapping":"sequence",e.result=m,!0;v||D(e,"missed comma between flow collection entries"),L=S=z=null,A=_=!1,R===63&&(w=e.input.charCodeAt(e.position+1),F(w)&&(A=_=!0,e.position++,M(e,!0,b))),T=e.line,Z(e,b,d,!1,!0),L=e.tag,S=e.result,M(e,!0,b),R=e.input.charCodeAt(e.position),(_||e.line===T)&&R===58&&(A=!0,R=e.input.charCodeAt(++e.position),M(e,!0,b),Z(e,b,d,!1,!0),z=e.result),x?J(e,m,I,L,S,z):A?m.push(J(e,null,I,L,S,z)):m.push(S),M(e,!0,b),R=e.input.charCodeAt(e.position),R===44?(v=!0,R=e.input.charCodeAt(++e.position)):v=!1}D(e,"unexpected end of the stream within a flow collection")}function Ae(e,b){var v,T,i=u,m=!1,f=!1,w=b,y=0,A=!1,_,x;if(x=e.input.charCodeAt(e.position),x===124)T=!1;else if(x===62)T=!0;else return!1;for(e.kind="scalar",e.result="";x!==0;)if(x=e.input.charCodeAt(++e.position),x===43||x===45)u===i?i=x===43?g:h:D(e,"repeat of a chomping mode identifier");else if((_=V(x))>=0)_===0?D(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):f?D(e,"repeat of an indentation width identifier"):(w=b+_-1,f=!0);else break;if(j(x)){do x=e.input.charCodeAt(++e.position);while(j(x));if(x===35)do x=e.input.charCodeAt(++e.position);while(!G(x)&&x!==0)}for(;x!==0;){for(ae(e),e.lineIndent=0,x=e.input.charCodeAt(e.position);(!f||e.lineIndent<w)&&x===32;)e.lineIndent++,x=e.input.charCodeAt(++e.position);if(!f&&e.lineIndent>w&&(w=e.lineIndent),G(x)){y++;continue}if(e.lineIndent<w){i===g?e.result+=t.repeat(`
`,m?1+y:y):i===u&&m&&(e.result+=`
`);break}for(T?j(x)?(A=!0,e.result+=t.repeat(`
`,m?1+y:y)):A?(A=!1,e.result+=t.repeat(`
`,y+1)):y===0?m&&(e.result+=" "):e.result+=t.repeat(`
`,y):e.result+=t.repeat(`
`,m?1+y:y),m=!0,f=!0,y=0,v=e.position;!G(x)&&x!==0;)x=e.input.charCodeAt(++e.position);U(e,v,e.position,!1)}return!0}function me(e,b){var v,T=e.tag,i=e.anchor,m=[],f,w=!1,y;for(e.anchor!==null&&(e.anchorMap[e.anchor]=m),y=e.input.charCodeAt(e.position);y!==0&&!(y!==45||(f=e.input.charCodeAt(e.position+1),!F(f)));){if(w=!0,e.position++,M(e,!0,-1)&&e.lineIndent<=b){m.push(null),y=e.input.charCodeAt(e.position);continue}if(v=e.line,Z(e,b,p,!1,!0),m.push(e.result),M(e,!0,-1),y=e.input.charCodeAt(e.position),(e.line===v||e.lineIndent>b)&&y!==0)D(e,"bad indentation of a sequence entry");else if(e.lineIndent<b)break}return w?(e.tag=T,e.anchor=i,e.kind="sequence",e.result=m,!0):!1}function ge(e,b,v){var T,i,m,f,w=e.tag,y=e.anchor,A={},_={},x=null,I=null,S=null,L=!1,z=!1,R;for(e.anchor!==null&&(e.anchorMap[e.anchor]=A),R=e.input.charCodeAt(e.position);R!==0;){if(T=e.input.charCodeAt(e.position+1),m=e.line,f=e.position,(R===63||R===58)&&F(T))R===63?(L&&(J(e,A,_,x,I,null),x=I=S=null),z=!0,L=!0,i=!0):L?(L=!1,i=!0):D(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,R=T;else if(Z(e,v,c,!1,!0))if(e.line===m){for(R=e.input.charCodeAt(e.position);j(R);)R=e.input.charCodeAt(++e.position);if(R===58)R=e.input.charCodeAt(++e.position),F(R)||D(e,"a whitespace character is expected after the key-value separator within a block mapping"),L&&(J(e,A,_,x,I,null),x=I=S=null),z=!0,L=!1,i=!1,x=e.tag,I=e.result;else if(z)D(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=w,e.anchor=y,!0}else if(z)D(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=w,e.anchor=y,!0;else break;if((e.line===m||e.lineIndent>b)&&(Z(e,b,s,!0,i)&&(L?I=e.result:S=e.result),L||(J(e,A,_,x,I,S,m,f),x=I=S=null),M(e,!0,-1),R=e.input.charCodeAt(e.position)),e.lineIndent>b&&R!==0)D(e,"bad indentation of a mapping entry");else if(e.lineIndent<b)break}return L&&J(e,A,_,x,I,null),z&&(e.tag=w,e.anchor=y,e.kind="mapping",e.result=A),z}function fe(e){var b,v=!1,T=!1,i,m,f;if(f=e.input.charCodeAt(e.position),f!==33)return!1;if(e.tag!==null&&D(e,"duplication of a tag property"),f=e.input.charCodeAt(++e.position),f===60?(v=!0,f=e.input.charCodeAt(++e.position)):f===33?(T=!0,i="!!",f=e.input.charCodeAt(++e.position)):i="!",b=e.position,v){do f=e.input.charCodeAt(++e.position);while(f!==0&&f!==62);e.position<e.length?(m=e.input.slice(b,e.position),f=e.input.charCodeAt(++e.position)):D(e,"unexpected end of the stream within a verbatim tag")}else{for(;f!==0&&!F(f);)f===33&&(T?D(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(b-1,e.position+1),E.test(i)||D(e,"named tag handle cannot contain such characters"),T=!0,b=e.position+1)),f=e.input.charCodeAt(++e.position);m=e.input.slice(b,e.position),P.test(m)&&D(e,"tag suffix cannot contain flow indicator characters")}return m&&!O.test(m)&&D(e,"tag name cannot contain such characters: "+m),v?e.tag=m:l.call(e.tagMap,i)?e.tag=e.tagMap[i]+m:i==="!"?e.tag="!"+m:i==="!!"?e.tag="tag:yaml.org,2002:"+m:D(e,'undeclared tag handle "'+i+'"'),!0}function _e(e){var b,v;if(v=e.input.charCodeAt(e.position),v!==38)return!1;for(e.anchor!==null&&D(e,"duplication of an anchor property"),v=e.input.charCodeAt(++e.position),b=e.position;v!==0&&!F(v)&&!K(v);)v=e.input.charCodeAt(++e.position);return e.position===b&&D(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(b,e.position),!0}function be(e){var b,v,T;if(T=e.input.charCodeAt(e.position),T!==42)return!1;for(T=e.input.charCodeAt(++e.position),b=e.position;T!==0&&!F(T)&&!K(T);)T=e.input.charCodeAt(++e.position);return e.position===b&&D(e,"name of an alias node must contain at least one character"),v=e.input.slice(b,e.position),l.call(e.anchorMap,v)||D(e,'unidentified alias "'+v+'"'),e.result=e.anchorMap[v],M(e,!0,-1),!0}function Z(e,b,v,T,i){var m,f,w,y=1,A=!1,_=!1,x,I,S,L,z;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,m=f=w=s===v||p===v,T&&M(e,!0,-1)&&(A=!0,e.lineIndent>b?y=1:e.lineIndent===b?y=0:e.lineIndent<b&&(y=-1)),y===1)for(;fe(e)||_e(e);)M(e,!0,-1)?(A=!0,w=m,e.lineIndent>b?y=1:e.lineIndent===b?y=0:e.lineIndent<b&&(y=-1)):w=!1;if(w&&(w=A||i),(y===1||s===v)&&(d===v||c===v?L=b:L=b+1,z=e.position-e.lineStart,y===1?w&&(me(e,z)||ge(e,z,L))||oe(e,L)?_=!0:(f&&Ae(e,L)||de(e,L)||he(e,L)?_=!0:be(e)?(_=!0,(e.tag!==null||e.anchor!==null)&&D(e,"alias node should not have any properties")):ue(e,L,d===v)&&(_=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):y===0&&(_=w&&me(e,z))),e.tag!==null&&e.tag!=="!")if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&D(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),x=0,I=e.implicitTypes.length;x<I;x+=1)if(S=e.implicitTypes[x],S.resolve(e.result)){e.result=S.construct(e.result),e.tag=S.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else l.call(e.typeMap[e.kind||"fallback"],e.tag)?(S=e.typeMap[e.kind||"fallback"][e.tag],e.result!==null&&S.kind!==e.kind&&D(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+S.kind+'", not "'+e.kind+'"'),S.resolve(e.result)?(e.result=S.construct(e.result),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):D(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):D(e,"unknown tag !<"+e.tag+">");return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||_}function Te(e){var b=e.position,v,T,i,m=!1,f;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};(f=e.input.charCodeAt(e.position))!==0&&(M(e,!0,-1),f=e.input.charCodeAt(e.position),!(e.lineIndent>0||f!==37));){for(m=!0,f=e.input.charCodeAt(++e.position),v=e.position;f!==0&&!F(f);)f=e.input.charCodeAt(++e.position);for(T=e.input.slice(v,e.position),i=[],T.length<1&&D(e,"directive name must not be less than one character in length");f!==0;){for(;j(f);)f=e.input.charCodeAt(++e.position);if(f===35){do f=e.input.charCodeAt(++e.position);while(f!==0&&!G(f));break}if(G(f))break;for(v=e.position;f!==0&&!F(f);)f=e.input.charCodeAt(++e.position);i.push(e.input.slice(v,e.position))}f!==0&&ae(e),l.call(ne,T)?ne[T](e,T,i):X(e,'unknown document directive "'+T+'"')}if(M(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,M(e,!0,-1)):m&&D(e,"directives end mark is expected"),Z(e,e.lineIndent-1,s,!1,!0),M(e,!0,-1),e.checkLineBreaks&&k.test(e.input.slice(b,e.position))&&X(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&ee(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,M(e,!0,-1));return}if(e.position<e.length-1)D(e,"end of the stream or a document separator is expected");else return}function ye(e,b){e=String(e),b=b||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var v=new xe(e,b),T=e.indexOf("\0");for(T!==-1&&(v.position=T,D(v,"null byte is not allowed in input")),v.input+="\0";v.input.charCodeAt(v.position)===32;)v.lineIndent+=1,v.position+=1;for(;v.position<v.length-1;)Te(v);return v.documents}function we(e,b,v){b!==null&&typeof b=="object"&&typeof v>"u"&&(v=b,b=null);var T=ye(e,v);if(typeof b!="function")return T;for(var i=0,m=T.length;i<m;i+=1)b(T[i])}function ve(e,b){var v=ye(e,b);if(v.length!==0){if(v.length===1)return v[0];throw new n("expected a single document in the stream, but found more")}}function ke(e,b,v){return typeof b=="object"&&b!==null&&typeof v>"u"&&(v=b,b=null),we(e,b,t.extend({schema:a},v))}function $(e,b){return ve(e,t.extend({schema:a},b))}return loader.loadAll=we,loader.load=ve,loader.safeLoadAll=ke,loader.safeLoad=$,loader}var dumper={},hasRequiredDumper;function requireDumper(){if(hasRequiredDumper)return dumper;hasRequiredDumper=1;var t=requireCommon(),n=requireException(),o=requireDefault_full(),a=requireDefault_safe(),r=Object.prototype.toString,l=Object.prototype.hasOwnProperty,d=9,c=10,p=13,s=32,u=33,h=34,g=35,C=37,k=38,P=39,E=42,O=44,N=45,G=58,j=61,F=62,K=63,W=64,B=91,V=93,le=96,ce=123,pe=124,re=125,H={};H[0]="\\0",H[7]="\\a",H[8]="\\b",H[9]="\\t",H[10]="\\n",H[11]="\\v",H[12]="\\f",H[13]="\\r",H[27]="\\e",H[34]='\\"',H[92]="\\\\",H[133]="\\N",H[160]="\\_",H[8232]="\\L",H[8233]="\\P";var Q=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function xe(i,m){var f,w,y,A,_,x,I;if(m===null)return{};for(f={},w=Object.keys(m),y=0,A=w.length;y<A;y+=1)_=w[y],x=String(m[_]),_.slice(0,2)==="!!"&&(_="tag:yaml.org,2002:"+_.slice(2)),I=i.compiledTypeMap.fallback[_],I&&l.call(I.styleAliases,x)&&(x=I.styleAliases[x]),f[_]=x;return f}function se(i){var m,f,w;if(m=i.toString(16).toUpperCase(),i<=255)f="x",w=2;else if(i<=65535)f="u",w=4;else if(i<=4294967295)f="U",w=8;else throw new n("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+f+t.repeat("0",w-m.length)+m}function D(i){this.schema=i.schema||o,this.indent=Math.max(1,i.indent||2),this.noArrayIndent=i.noArrayIndent||!1,this.skipInvalid=i.skipInvalid||!1,this.flowLevel=t.isNothing(i.flowLevel)?-1:i.flowLevel,this.styleMap=xe(this.schema,i.styles||null),this.sortKeys=i.sortKeys||!1,this.lineWidth=i.lineWidth||80,this.noRefs=i.noRefs||!1,this.noCompatMode=i.noCompatMode||!1,this.condenseFlow=i.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function X(i,m){for(var f=t.repeat(" ",m),w=0,y=-1,A="",_,x=i.length;w<x;)y=i.indexOf(`
`,w),y===-1?(_=i.slice(w),w=x):(_=i.slice(w,y+1),w=y+1),_.length&&_!==`
`&&(A+=f),A+=_;return A}function ne(i,m){return`
`+t.repeat(" ",i.indent*m)}function U(i,m){var f,w,y;for(f=0,w=i.implicitTypes.length;f<w;f+=1)if(y=i.implicitTypes[f],y.resolve(m))return!0;return!1}function te(i){return i===s||i===d}function Y(i){return 32<=i&&i<=126||161<=i&&i<=55295&&i!==8232&&i!==8233||57344<=i&&i<=65533&&i!==65279||65536<=i&&i<=1114111}function J(i){return Y(i)&&!te(i)&&i!==65279&&i!==p&&i!==c}function ae(i,m){return Y(i)&&i!==65279&&i!==O&&i!==B&&i!==V&&i!==ce&&i!==re&&i!==G&&(i!==g||m&&J(m))}function M(i){return Y(i)&&i!==65279&&!te(i)&&i!==N&&i!==K&&i!==G&&i!==O&&i!==B&&i!==V&&i!==ce&&i!==re&&i!==g&&i!==k&&i!==E&&i!==u&&i!==pe&&i!==j&&i!==F&&i!==P&&i!==h&&i!==C&&i!==W&&i!==le}function ee(i){var m=/^\n* /;return m.test(i)}var ie=1,ue=2,de=3,he=4,oe=5;function Ae(i,m,f,w,y){var A,_,x,I=!1,S=!1,L=w!==-1,z=-1,R=M(i.charCodeAt(0))&&!te(i.charCodeAt(i.length-1));if(m)for(A=0;A<i.length;A++){if(_=i.charCodeAt(A),!Y(_))return oe;x=A>0?i.charCodeAt(A-1):null,R=R&&ae(_,x)}else{for(A=0;A<i.length;A++){if(_=i.charCodeAt(A),_===c)I=!0,L&&(S=S||A-z-1>w&&i[z+1]!==" ",z=A);else if(!Y(_))return oe;x=A>0?i.charCodeAt(A-1):null,R=R&&ae(_,x)}S=S||L&&A-z-1>w&&i[z+1]!==" "}return!I&&!S?R&&!y(i)?ie:ue:f>9&&ee(i)?oe:S?he:de}function me(i,m,f,w){i.dump=(function(){if(m.length===0)return"''";if(!i.noCompatMode&&Q.indexOf(m)!==-1)return"'"+m+"'";var y=i.indent*Math.max(1,f),A=i.lineWidth===-1?-1:Math.max(Math.min(i.lineWidth,40),i.lineWidth-y),_=w||i.flowLevel>-1&&f>=i.flowLevel;function x(I){return U(i,I)}switch(Ae(m,_,i.indent,A,x)){case ie:return m;case ue:return"'"+m.replace(/'/g,"''")+"'";case de:return"|"+ge(m,i.indent)+fe(X(m,y));case he:return">"+ge(m,i.indent)+fe(X(_e(m,A),y));case oe:return'"'+Z(m)+'"';default:throw new n("impossible error: invalid scalar style")}})()}function ge(i,m){var f=ee(i)?String(m):"",w=i[i.length-1]===`
`,y=w&&(i[i.length-2]===`
`||i===`
`),A=y?"+":w?"":"-";return f+A+`
`}function fe(i){return i[i.length-1]===`
`?i.slice(0,-1):i}function _e(i,m){for(var f=/(\n+)([^\n]*)/g,w=(function(){var S=i.indexOf(`
`);return S=S!==-1?S:i.length,f.lastIndex=S,be(i.slice(0,S),m)})(),y=i[0]===`
`||i[0]===" ",A,_;_=f.exec(i);){var x=_[1],I=_[2];A=I[0]===" ",w+=x+(!y&&!A&&I!==""?`
`:"")+be(I,m),y=A}return w}function be(i,m){if(i===""||i[0]===" ")return i;for(var f=/ [^ ]/g,w,y=0,A,_=0,x=0,I="";w=f.exec(i);)x=w.index,x-y>m&&(A=_>y?_:x,I+=`
`+i.slice(y,A),y=A+1),_=x;return I+=`
`,i.length-y>m&&_>y?I+=i.slice(y,_)+`
`+i.slice(_+1):I+=i.slice(y),I.slice(1)}function Z(i){for(var m="",f,w,y,A=0;A<i.length;A++){if(f=i.charCodeAt(A),f>=55296&&f<=56319&&(w=i.charCodeAt(A+1),w>=56320&&w<=57343)){m+=se((f-55296)*1024+w-56320+65536),A++;continue}y=H[f],m+=!y&&Y(f)?i[A]:y||se(f)}return m}function Te(i,m,f){var w="",y=i.tag,A,_;for(A=0,_=f.length;A<_;A+=1)$(i,m,f[A],!1,!1)&&(A!==0&&(w+=","+(i.condenseFlow?"":" ")),w+=i.dump);i.tag=y,i.dump="["+w+"]"}function ye(i,m,f,w){var y="",A=i.tag,_,x;for(_=0,x=f.length;_<x;_+=1)$(i,m+1,f[_],!0,!0)&&((!w||_!==0)&&(y+=ne(i,m)),i.dump&&c===i.dump.charCodeAt(0)?y+="-":y+="- ",y+=i.dump);i.tag=A,i.dump=y||"[]"}function we(i,m,f){var w="",y=i.tag,A=Object.keys(f),_,x,I,S,L;for(_=0,x=A.length;_<x;_+=1)L="",_!==0&&(L+=", "),i.condenseFlow&&(L+='"'),I=A[_],S=f[I],$(i,m,I,!1,!1)&&(i.dump.length>1024&&(L+="? "),L+=i.dump+(i.condenseFlow?'"':"")+":"+(i.condenseFlow?"":" "),$(i,m,S,!1,!1)&&(L+=i.dump,w+=L));i.tag=y,i.dump="{"+w+"}"}function ve(i,m,f,w){var y="",A=i.tag,_=Object.keys(f),x,I,S,L,z,R;if(i.sortKeys===!0)_.sort();else if(typeof i.sortKeys=="function")_.sort(i.sortKeys);else if(i.sortKeys)throw new n("sortKeys must be a boolean or a function");for(x=0,I=_.length;x<I;x+=1)R="",(!w||x!==0)&&(R+=ne(i,m)),S=_[x],L=f[S],$(i,m+1,S,!0,!0,!0)&&(z=i.tag!==null&&i.tag!=="?"||i.dump&&i.dump.length>1024,z&&(i.dump&&c===i.dump.charCodeAt(0)?R+="?":R+="? "),R+=i.dump,z&&(R+=ne(i,m)),$(i,m+1,L,!0,z)&&(i.dump&&c===i.dump.charCodeAt(0)?R+=":":R+=": ",R+=i.dump,y+=R));i.tag=A,i.dump=y||"{}"}function ke(i,m,f){var w,y,A,_,x,I;for(y=f?i.explicitTypes:i.implicitTypes,A=0,_=y.length;A<_;A+=1)if(x=y[A],(x.instanceOf||x.predicate)&&(!x.instanceOf||typeof m=="object"&&m instanceof x.instanceOf)&&(!x.predicate||x.predicate(m))){if(i.tag=f?x.tag:"?",x.represent){if(I=i.styleMap[x.tag]||x.defaultStyle,r.call(x.represent)==="[object Function]")w=x.represent(m,I);else if(l.call(x.represent,I))w=x.represent[I](m,I);else throw new n("!<"+x.tag+'> tag resolver accepts not "'+I+'" style');i.dump=w}return!0}return!1}function $(i,m,f,w,y,A){i.tag=null,i.dump=f,ke(i,f,!1)||ke(i,f,!0);var _=r.call(i.dump);w&&(w=i.flowLevel<0||i.flowLevel>m);var x=_==="[object Object]"||_==="[object Array]",I,S;if(x&&(I=i.duplicates.indexOf(f),S=I!==-1),(i.tag!==null&&i.tag!=="?"||S||i.indent!==2&&m>0)&&(y=!1),S&&i.usedDuplicates[I])i.dump="*ref_"+I;else{if(x&&S&&!i.usedDuplicates[I]&&(i.usedDuplicates[I]=!0),_==="[object Object]")w&&Object.keys(i.dump).length!==0?(ve(i,m,i.dump,y),S&&(i.dump="&ref_"+I+i.dump)):(we(i,m,i.dump),S&&(i.dump="&ref_"+I+" "+i.dump));else if(_==="[object Array]"){var L=i.noArrayIndent&&m>0?m-1:m;w&&i.dump.length!==0?(ye(i,L,i.dump,y),S&&(i.dump="&ref_"+I+i.dump)):(Te(i,L,i.dump),S&&(i.dump="&ref_"+I+" "+i.dump))}else if(_==="[object String]")i.tag!=="?"&&me(i,i.dump,m,A);else{if(i.skipInvalid)return!1;throw new n("unacceptable kind of an object to dump "+_)}i.tag!==null&&i.tag!=="?"&&(i.dump="!<"+i.tag+"> "+i.dump)}return!0}function e(i,m){var f=[],w=[],y,A;for(b(i,f,w),y=0,A=w.length;y<A;y+=1)m.duplicates.push(f[w[y]]);m.usedDuplicates=new Array(A)}function b(i,m,f){var w,y,A;if(i!==null&&typeof i=="object")if(y=m.indexOf(i),y!==-1)f.indexOf(y)===-1&&f.push(y);else if(m.push(i),Array.isArray(i))for(y=0,A=i.length;y<A;y+=1)b(i[y],m,f);else for(w=Object.keys(i),y=0,A=w.length;y<A;y+=1)b(i[w[y]],m,f)}function v(i,m){m=m||{};var f=new D(m);return f.noRefs||e(i,f),$(f,0,i,!0,!0)?f.dump+`
`:""}function T(i,m){return v(i,t.extend({schema:a},m))}return dumper.dump=v,dumper.safeDump=T,dumper}var hasRequiredJsYaml$1;function requireJsYaml$1(){if(hasRequiredJsYaml$1)return jsYaml$1;hasRequiredJsYaml$1=1;var t=requireLoader(),n=requireDumper();function o(a){return function(){throw new Error("Function "+a+" is deprecated and cannot be used.")}}return jsYaml$1.Type=requireType(),jsYaml$1.Schema=requireSchema(),jsYaml$1.FAILSAFE_SCHEMA=requireFailsafe(),jsYaml$1.JSON_SCHEMA=requireJson(),jsYaml$1.CORE_SCHEMA=requireCore(),jsYaml$1.DEFAULT_SAFE_SCHEMA=requireDefault_safe(),jsYaml$1.DEFAULT_FULL_SCHEMA=requireDefault_full(),jsYaml$1.load=t.load,jsYaml$1.loadAll=t.loadAll,jsYaml$1.safeLoad=t.safeLoad,jsYaml$1.safeLoadAll=t.safeLoadAll,jsYaml$1.dump=n.dump,jsYaml$1.safeDump=n.safeDump,jsYaml$1.YAMLException=requireException(),jsYaml$1.MINIMAL_SCHEMA=requireFailsafe(),jsYaml$1.SAFE_SCHEMA=requireDefault_safe(),jsYaml$1.DEFAULT_SCHEMA=requireDefault_full(),jsYaml$1.scan=o("scan"),jsYaml$1.parse=o("parse"),jsYaml$1.compose=o("compose"),jsYaml$1.addConstructor=o("addConstructor"),jsYaml$1}var jsYaml,hasRequiredJsYaml;function requireJsYaml(){if(hasRequiredJsYaml)return jsYaml;hasRequiredJsYaml=1;var t=requireJsYaml$1();return jsYaml=t,jsYaml}var hasRequiredEngines;function requireEngines(){return hasRequiredEngines||(hasRequiredEngines=1,(function(module,exports){const yaml=requireJsYaml(),engines=module.exports;engines.yaml={parse:yaml.safeLoad.bind(yaml),stringify:yaml.safeDump.bind(yaml)},engines.json={parse:JSON.parse.bind(JSON),stringify:function(t,n){const o=Object.assign({replacer:null,space:2},n);return JSON.stringify(t,o.replacer,o.space)}},engines.javascript={parse:function parse(str,options,wrap){try{return wrap!==!1&&(str=`(function() {
return `+str.trim()+`;
}());`),eval(str)||{}}catch(t){if(wrap!==!1&&/(unexpected|identifier)/i.test(t.message))return parse(str,options,!1);throw new SyntaxError(t)}},stringify:function(){throw new Error("stringifying JavaScript is not supported")}}})(engines)),engines.exports}var utils={};/*!
 * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */var stripBomString,hasRequiredStripBomString;function requireStripBomString(){return hasRequiredStripBomString||(hasRequiredStripBomString=1,stripBomString=function(t){return typeof t=="string"&&t.charAt(0)==="\uFEFF"?t.slice(1):t}),stripBomString}var hasRequiredUtils;function requireUtils(){return hasRequiredUtils||(hasRequiredUtils=1,(function(t){const n=requireStripBomString(),o=requireKindOf();t.define=function(a,r,l){Reflect.defineProperty(a,r,{enumerable:!1,configurable:!0,writable:!0,value:l})},t.isBuffer=function(a){return o(a)==="buffer"},t.isObject=function(a){return o(a)==="object"},t.toBuffer=function(a){return typeof a=="string"?Buffer.from(a):a},t.toString=function(a){if(t.isBuffer(a))return n(String(a));if(typeof a!="string")throw new TypeError("expected input to be a string or buffer");return n(a)},t.arrayify=function(a){return a?Array.isArray(a)?a:[a]:[]},t.startsWith=function(a,r,l){return typeof l!="number"&&(l=r.length),a.slice(0,l)===r}})(utils)),utils}var defaults,hasRequiredDefaults;function requireDefaults(){if(hasRequiredDefaults)return defaults;hasRequiredDefaults=1;const t=requireEngines(),n=requireUtils();return defaults=function(o){const a=Object.assign({},o);return a.delimiters=n.arrayify(a.delims||a.delimiters||"---"),a.delimiters.length===1&&a.delimiters.push(a.delimiters[0]),a.language=(a.language||a.lang||"yaml").toLowerCase(),a.engines=Object.assign({},t,a.parsers,a.engines),a},defaults}var engine,hasRequiredEngine;function requireEngine(){if(hasRequiredEngine)return engine;hasRequiredEngine=1,engine=function(n,o){let a=o.engines[n]||o.engines[t(n)];if(typeof a>"u")throw new Error('gray-matter engine "'+n+'" is not registered');return typeof a=="function"&&(a={parse:a}),a};function t(n){switch(n.toLowerCase()){case"js":case"javascript":return"javascript";case"coffee":case"coffeescript":case"cson":return"coffee";case"yaml":case"yml":return"yaml";default:return n}}return engine}var stringify,hasRequiredStringify;function requireStringify(){if(hasRequiredStringify)return stringify;hasRequiredStringify=1;const t=requireKindOf(),n=requireEngine(),o=requireDefaults();stringify=function(r,l,d){if(l==null&&d==null)switch(t(r)){case"object":l=r.data,d={};break;case"string":return r;default:throw new TypeError("expected file to be a string or object")}const c=r.content,p=o(d);if(l==null){if(!p.data)return r;l=p.data}const s=r.language||p.language,u=n(s,p);if(typeof u.stringify!="function")throw new TypeError('expected "'+s+'.stringify" to be a function');l=Object.assign({},r.data,l);const h=p.delimiters[0],g=p.delimiters[1],C=u.stringify(l,d).trim();let k="";return C!=="{}"&&(k=a(h)+a(C)+a(g)),typeof r.excerpt=="string"&&r.excerpt!==""&&c.indexOf(r.excerpt.trim())===-1&&(k+=a(r.excerpt)+a(g)),k+a(c)};function a(r){return r.slice(-1)!==`
`?r+`
`:r}return stringify}var excerpt,hasRequiredExcerpt;function requireExcerpt(){if(hasRequiredExcerpt)return excerpt;hasRequiredExcerpt=1;const t=requireDefaults();return excerpt=function(n,o){const a=t(o);if(n.data==null&&(n.data={}),typeof a.excerpt=="function")return a.excerpt(n,a);const r=n.data.excerpt_separator||a.excerpt_separator;if(r==null&&(a.excerpt===!1||a.excerpt==null))return n;const l=typeof a.excerpt=="string"?a.excerpt:r||a.delimiters[0],d=n.content.indexOf(l);return d!==-1&&(n.excerpt=n.content.slice(0,d)),n},excerpt}var toFile,hasRequiredToFile;function requireToFile(){if(hasRequiredToFile)return toFile;hasRequiredToFile=1;const t=requireKindOf(),n=requireStringify(),o=requireUtils();return toFile=function(a){return t(a)!=="object"&&(a={content:a}),t(a.data)!=="object"&&(a.data={}),a.contents&&a.content==null&&(a.content=a.contents),o.define(a,"orig",o.toBuffer(a.content)),o.define(a,"language",a.language||""),o.define(a,"matter",a.matter||""),o.define(a,"stringify",function(r,l){return l&&l.language&&(a.language=l.language),n(a,r,l)}),a.content=o.toString(a.content),a.isEmpty=!1,a.excerpt="",a},toFile}var parse,hasRequiredParse;function requireParse(){if(hasRequiredParse)return parse;hasRequiredParse=1;const t=requireEngine(),n=requireDefaults();return parse=function(o,a,r){const l=n(r),d=t(o,l);if(typeof d.parse!="function")throw new TypeError('expected "'+o+'.parse" to be a function');return d.parse(a,l)},parse}var grayMatter,hasRequiredGrayMatter;function requireGrayMatter(){if(hasRequiredGrayMatter)return grayMatter;hasRequiredGrayMatter=1;const t=require$$0,n=requireSectionMatter(),o=requireDefaults(),a=requireStringify(),r=requireExcerpt(),l=requireEngines(),d=requireToFile(),c=requireParse(),p=requireUtils();function s(h,g){if(h==="")return{data:{},content:h,excerpt:"",orig:h};let C=d(h);const k=s.cache[C.content];if(!g){if(k)return C=Object.assign({},k),C.orig=k.orig,C;s.cache[C.content]=C}return u(C,g)}function u(h,g){const C=o(g),k=C.delimiters[0],P=`
`+C.delimiters[1];let E=h.content;C.language&&(h.language=C.language);const O=k.length;if(!p.startsWith(E,k,O))return r(h,C),h;if(E.charAt(O)===k.slice(-1))return h;E=E.slice(O);const N=E.length,G=s.language(E,C);G.name&&(h.language=G.name,E=E.slice(G.raw.length));let j=E.indexOf(P);return j===-1&&(j=N),h.matter=E.slice(0,j),h.matter.replace(/^\s*#[^\n]+/gm,"").trim()===""?(h.isEmpty=!0,h.empty=h.content,h.data={}):h.data=c(h.language,h.matter,C),j===N?h.content="":(h.content=E.slice(j+P.length),h.content[0]==="\r"&&(h.content=h.content.slice(1)),h.content[0]===`
`&&(h.content=h.content.slice(1))),r(h,C),(C.sections===!0||typeof C.section=="function")&&n(h,C.section),h}return s.engines=l,s.stringify=function(h,g,C){return typeof h=="string"&&(h=s(h,C)),a(h,g,C)},s.read=function(h,g){const C=t.readFileSync(h,"utf8"),k=s(C,g);return k.path=h,k},s.test=function(h,g){return p.startsWith(h,o(g).delimiters[0])},s.language=function(h,g){const k=o(g).delimiters[0];s.test(h)&&(h=h.slice(k.length));const P=h.slice(0,h.search(/\r?\n/));return{raw:P,name:P?P.trim():""}},s.cache={},s.clearCache=function(){s.cache={}},grayMatter=s,grayMatter}var grayMatterExports=requireGrayMatter();const matter=getDefaultExportFromCjs(grayMatterExports);function _getDefaults(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var _defaults=_getDefaults();function changeDefaults(t){_defaults=t}var noopTest={exec:()=>null};function edit(t,n=""){let o=typeof t=="string"?t:t.source;const a={replace:(r,l)=>{let d=typeof l=="string"?l:l.source;return d=d.replace(other.caret,"$1"),o=o.replace(r,d),a},getRegex:()=>new RegExp(o,n)};return a}var other={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},newline=/^(?:[ \t]*(?:\n|$))+/,blockCode=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,fences=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,bullet=/(?:[*+-]|\d{1,9}[.)])/,lheadingCore=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,lheading=edit(lheadingCore).replace(/bull/g,bullet).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),lheadingGfm=edit(lheadingCore).replace(/bull/g,bullet).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),_paragraph=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,blockText=/^[^\n]+/,_blockLabel=/(?!\s*\])(?:\\.|[^\[\]\\])+/,def=edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",_blockLabel).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),list$1=edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,bullet).getRegex(),_tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",_comment=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,html=edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",_comment).replace("tag",_tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),paragraph=edit(_paragraph).replace("hr",hr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_tag).getRegex(),blockquote=edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",paragraph).getRegex(),blockNormal={blockquote,code:blockCode,def,fences,heading,hr,html,lheading,list:list$1,newline,paragraph,table:noopTest,text:blockText},gfmTable=edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",hr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_tag).getRegex(),blockGfm={...blockNormal,lheading:lheadingGfm,table:gfmTable,paragraph:edit(_paragraph).replace("hr",hr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",gfmTable).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_tag).getRegex()},blockPedantic={...blockNormal,html:edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",_comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:noopTest,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:edit(_paragraph).replace("hr",hr).replace("heading",` *#{1,6} *[^
]`).replace("lheading",lheading).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},escape=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,inlineCode=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br=/^( {2,}|\\)\n(?!\s*$)/,inlineText=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,_punctuation=/[\p{P}\p{S}]/u,_punctuationOrSpace=/[\s\p{P}\p{S}]/u,_notPunctuationOrSpace=/[^\s\p{P}\p{S}]/u,punctuation=edit(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,_punctuationOrSpace).getRegex(),_punctuationGfmStrongEm=/(?!~)[\p{P}\p{S}]/u,_punctuationOrSpaceGfmStrongEm=/(?!~)[\s\p{P}\p{S}]/u,_notPunctuationOrSpaceGfmStrongEm=/(?:[^\s\p{P}\p{S}]|~)/u,blockSkip=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,emStrongLDelimCore=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,emStrongLDelim=edit(emStrongLDelimCore,"u").replace(/punct/g,_punctuation).getRegex(),emStrongLDelimGfm=edit(emStrongLDelimCore,"u").replace(/punct/g,_punctuationGfmStrongEm).getRegex(),emStrongRDelimAstCore="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",emStrongRDelimAst=edit(emStrongRDelimAstCore,"gu").replace(/notPunctSpace/g,_notPunctuationOrSpace).replace(/punctSpace/g,_punctuationOrSpace).replace(/punct/g,_punctuation).getRegex(),emStrongRDelimAstGfm=edit(emStrongRDelimAstCore,"gu").replace(/notPunctSpace/g,_notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g,_punctuationOrSpaceGfmStrongEm).replace(/punct/g,_punctuationGfmStrongEm).getRegex(),emStrongRDelimUnd=edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,_notPunctuationOrSpace).replace(/punctSpace/g,_punctuationOrSpace).replace(/punct/g,_punctuation).getRegex(),anyPunctuation=edit(/\\(punct)/,"gu").replace(/punct/g,_punctuation).getRegex(),autolink=edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),_inlineComment=edit(_comment).replace("(?:-->|$)","-->").getRegex(),tag=edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",_inlineComment).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),_inlineLabel=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,link=edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",_inlineLabel).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),reflink=edit(/^!?\[(label)\]\[(ref)\]/).replace("label",_inlineLabel).replace("ref",_blockLabel).getRegex(),nolink=edit(/^!?\[(ref)\](?:\[\])?/).replace("ref",_blockLabel).getRegex(),reflinkSearch=edit("reflink|nolink(?!\\()","g").replace("reflink",reflink).replace("nolink",nolink).getRegex(),inlineNormal={_backpedal:noopTest,anyPunctuation,autolink,blockSkip,br,code:inlineCode,del:noopTest,emStrongLDelim,emStrongRDelimAst,emStrongRDelimUnd,escape,link,nolink,punctuation,reflink,reflinkSearch,tag,text:inlineText,url:noopTest},inlinePedantic={...inlineNormal,link:edit(/^!?\[(label)\]\((.*?)\)/).replace("label",_inlineLabel).getRegex(),reflink:edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",_inlineLabel).getRegex()},inlineGfm={...inlineNormal,emStrongRDelimAst:emStrongRDelimAstGfm,emStrongLDelim:emStrongLDelimGfm,url:edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},inlineBreaks={...inlineGfm,br:edit(br).replace("{2,}","*").getRegex(),text:edit(inlineGfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},block={normal:blockNormal,gfm:blockGfm,pedantic:blockPedantic},inline={normal:inlineNormal,gfm:inlineGfm,breaks:inlineBreaks,pedantic:inlinePedantic},escapeReplacements={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},getEscapeReplacement=t=>escapeReplacements[t];function escape2(t,n){if(n){if(other.escapeTest.test(t))return t.replace(other.escapeReplace,getEscapeReplacement)}else if(other.escapeTestNoEncode.test(t))return t.replace(other.escapeReplaceNoEncode,getEscapeReplacement);return t}function cleanUrl(t){try{t=encodeURI(t).replace(other.percentDecode,"%")}catch{return null}return t}function splitCells(t,n){var l;const o=t.replace(other.findPipe,(d,c,p)=>{let s=!1,u=c;for(;--u>=0&&p[u]==="\\";)s=!s;return s?"|":" |"}),a=o.split(other.splitPipe);let r=0;if(a[0].trim()||a.shift(),a.length>0&&!((l=a.at(-1))!=null&&l.trim())&&a.pop(),n)if(a.length>n)a.splice(n);else for(;a.length<n;)a.push("");for(;r<a.length;r++)a[r]=a[r].trim().replace(other.slashPipe,"|");return a}function rtrim(t,n,o){const a=t.length;if(a===0)return"";let r=0;for(;r<a&&t.charAt(a-r-1)===n;)r++;return t.slice(0,a-r)}function findClosingBracket(t,n){if(t.indexOf(n[1])===-1)return-1;let o=0;for(let a=0;a<t.length;a++)if(t[a]==="\\")a++;else if(t[a]===n[0])o++;else if(t[a]===n[1]&&(o--,o<0))return a;return o>0?-2:-1}function outputLink(t,n,o,a,r){const l=n.href,d=n.title||null,c=t[1].replace(r.other.outputLinkReplace,"$1");a.state.inLink=!0;const p={type:t[0].charAt(0)==="!"?"image":"link",raw:o,href:l,title:d,text:c,tokens:a.inlineTokens(c)};return a.state.inLink=!1,p}function indentCodeCompensation(t,n,o){const a=t.match(o.other.indentCodeCompensation);if(a===null)return n;const r=a[1];return n.split(`
`).map(l=>{const d=l.match(o.other.beginningSpace);if(d===null)return l;const[c]=d;return c.length>=r.length?l.slice(r.length):l}).join(`
`)}var _Tokenizer=class{constructor(t){q(this,"options");q(this,"rules");q(this,"lexer");this.options=t||_defaults}space(t){const n=this.rules.block.newline.exec(t);if(n&&n[0].length>0)return{type:"space",raw:n[0]}}code(t){const n=this.rules.block.code.exec(t);if(n){const o=n[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n[0],codeBlockStyle:"indented",text:this.options.pedantic?o:rtrim(o,`
`)}}}fences(t){const n=this.rules.block.fences.exec(t);if(n){const o=n[0],a=indentCodeCompensation(o,n[3]||"",this.rules);return{type:"code",raw:o,lang:n[2]?n[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):n[2],text:a}}}heading(t){const n=this.rules.block.heading.exec(t);if(n){let o=n[2].trim();if(this.rules.other.endingHash.test(o)){const a=rtrim(o,"#");(this.options.pedantic||!a||this.rules.other.endingSpaceChar.test(a))&&(o=a.trim())}return{type:"heading",raw:n[0],depth:n[1].length,text:o,tokens:this.lexer.inline(o)}}}hr(t){const n=this.rules.block.hr.exec(t);if(n)return{type:"hr",raw:rtrim(n[0],`
`)}}blockquote(t){const n=this.rules.block.blockquote.exec(t);if(n){let o=rtrim(n[0],`
`).split(`
`),a="",r="";const l=[];for(;o.length>0;){let d=!1;const c=[];let p;for(p=0;p<o.length;p++)if(this.rules.other.blockquoteStart.test(o[p]))c.push(o[p]),d=!0;else if(!d)c.push(o[p]);else break;o=o.slice(p);const s=c.join(`
`),u=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");a=a?`${a}
${s}`:s,r=r?`${r}
${u}`:u;const h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,l,!0),this.lexer.state.top=h,o.length===0)break;const g=l.at(-1);if((g==null?void 0:g.type)==="code")break;if((g==null?void 0:g.type)==="blockquote"){const C=g,k=C.raw+`
`+o.join(`
`),P=this.blockquote(k);l[l.length-1]=P,a=a.substring(0,a.length-C.raw.length)+P.raw,r=r.substring(0,r.length-C.text.length)+P.text;break}else if((g==null?void 0:g.type)==="list"){const C=g,k=C.raw+`
`+o.join(`
`),P=this.list(k);l[l.length-1]=P,a=a.substring(0,a.length-g.raw.length)+P.raw,r=r.substring(0,r.length-C.raw.length)+P.raw,o=k.substring(l.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:a,tokens:l,text:r}}}list(t){let n=this.rules.block.list.exec(t);if(n){let o=n[1].trim();const a=o.length>1,r={type:"list",raw:"",ordered:a,start:a?+o.slice(0,-1):"",loose:!1,items:[]};o=a?`\\d{1,9}\\${o.slice(-1)}`:`\\${o}`,this.options.pedantic&&(o=a?o:"[*+-]");const l=this.rules.other.listItemRegex(o);let d=!1;for(;t;){let p=!1,s="",u="";if(!(n=l.exec(t))||this.rules.block.hr.test(t))break;s=n[0],t=t.substring(s.length);let h=n[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,O=>" ".repeat(3*O.length)),g=t.split(`
`,1)[0],C=!h.trim(),k=0;if(this.options.pedantic?(k=2,u=h.trimStart()):C?k=n[1].length+1:(k=n[2].search(this.rules.other.nonSpaceChar),k=k>4?1:k,u=h.slice(k),k+=n[1].length),C&&this.rules.other.blankLine.test(g)&&(s+=g+`
`,t=t.substring(g.length+1),p=!0),!p){const O=this.rules.other.nextBulletRegex(k),N=this.rules.other.hrRegex(k),G=this.rules.other.fencesBeginRegex(k),j=this.rules.other.headingBeginRegex(k),F=this.rules.other.htmlBeginRegex(k);for(;t;){const K=t.split(`
`,1)[0];let W;if(g=K,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),W=g):W=g.replace(this.rules.other.tabCharGlobal,"    "),G.test(g)||j.test(g)||F.test(g)||O.test(g)||N.test(g))break;if(W.search(this.rules.other.nonSpaceChar)>=k||!g.trim())u+=`
`+W.slice(k);else{if(C||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||G.test(h)||j.test(h)||N.test(h))break;u+=`
`+g}!C&&!g.trim()&&(C=!0),s+=K+`
`,t=t.substring(K.length+1),h=W.slice(k)}}r.loose||(d?r.loose=!0:this.rules.other.doubleBlankLine.test(s)&&(d=!0));let P=null,E;this.options.gfm&&(P=this.rules.other.listIsTask.exec(u),P&&(E=P[0]!=="[ ] ",u=u.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:s,task:!!P,checked:E,loose:!1,text:u,tokens:[]}),r.raw+=s}const c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let p=0;p<r.items.length;p++)if(this.lexer.state.top=!1,r.items[p].tokens=this.lexer.blockTokens(r.items[p].text,[]),!r.loose){const s=r.items[p].tokens.filter(h=>h.type==="space"),u=s.length>0&&s.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=u}if(r.loose)for(let p=0;p<r.items.length;p++)r.items[p].loose=!0;return r}}html(t){const n=this.rules.block.html.exec(t);if(n)return{type:"html",block:!0,raw:n[0],pre:n[1]==="pre"||n[1]==="script"||n[1]==="style",text:n[0]}}def(t){const n=this.rules.block.def.exec(t);if(n){const o=n[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),a=n[2]?n[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=n[3]?n[3].substring(1,n[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):n[3];return{type:"def",tag:o,raw:n[0],href:a,title:r}}}table(t){var d;const n=this.rules.block.table.exec(t);if(!n||!this.rules.other.tableDelimiter.test(n[2]))return;const o=splitCells(n[1]),a=n[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=(d=n[3])!=null&&d.trim()?n[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],l={type:"table",raw:n[0],header:[],align:[],rows:[]};if(o.length===a.length){for(const c of a)this.rules.other.tableAlignRight.test(c)?l.align.push("right"):this.rules.other.tableAlignCenter.test(c)?l.align.push("center"):this.rules.other.tableAlignLeft.test(c)?l.align.push("left"):l.align.push(null);for(let c=0;c<o.length;c++)l.header.push({text:o[c],tokens:this.lexer.inline(o[c]),header:!0,align:l.align[c]});for(const c of r)l.rows.push(splitCells(c,l.header.length).map((p,s)=>({text:p,tokens:this.lexer.inline(p),header:!1,align:l.align[s]})));return l}}lheading(t){const n=this.rules.block.lheading.exec(t);if(n)return{type:"heading",raw:n[0],depth:n[2].charAt(0)==="="?1:2,text:n[1],tokens:this.lexer.inline(n[1])}}paragraph(t){const n=this.rules.block.paragraph.exec(t);if(n){const o=n[1].charAt(n[1].length-1)===`
`?n[1].slice(0,-1):n[1];return{type:"paragraph",raw:n[0],text:o,tokens:this.lexer.inline(o)}}}text(t){const n=this.rules.block.text.exec(t);if(n)return{type:"text",raw:n[0],text:n[0],tokens:this.lexer.inline(n[0])}}escape(t){const n=this.rules.inline.escape.exec(t);if(n)return{type:"escape",raw:n[0],text:n[1]}}tag(t){const n=this.rules.inline.tag.exec(t);if(n)return!this.lexer.state.inLink&&this.rules.other.startATag.test(n[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(n[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(n[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(n[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:n[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:n[0]}}link(t){const n=this.rules.inline.link.exec(t);if(n){const o=n[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(o)){if(!this.rules.other.endAngleBracket.test(o))return;const l=rtrim(o.slice(0,-1),"\\");if((o.length-l.length)%2===0)return}else{const l=findClosingBracket(n[2],"()");if(l===-2)return;if(l>-1){const c=(n[0].indexOf("!")===0?5:4)+n[1].length+l;n[2]=n[2].substring(0,l),n[0]=n[0].substring(0,c).trim(),n[3]=""}}let a=n[2],r="";if(this.options.pedantic){const l=this.rules.other.pedanticHrefTitle.exec(a);l&&(a=l[1],r=l[3])}else r=n[3]?n[3].slice(1,-1):"";return a=a.trim(),this.rules.other.startAngleBracket.test(a)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(o)?a=a.slice(1):a=a.slice(1,-1)),outputLink(n,{href:a&&a.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},n[0],this.lexer,this.rules)}}reflink(t,n){let o;if((o=this.rules.inline.reflink.exec(t))||(o=this.rules.inline.nolink.exec(t))){const a=(o[2]||o[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=n[a.toLowerCase()];if(!r){const l=o[0].charAt(0);return{type:"text",raw:l,text:l}}return outputLink(o,r,o[0],this.lexer,this.rules)}}emStrong(t,n,o=""){let a=this.rules.inline.emStrongLDelim.exec(t);if(!a||a[3]&&o.match(this.rules.other.unicodeAlphaNumeric))return;if(!(a[1]||a[2]||"")||!o||this.rules.inline.punctuation.exec(o)){const l=[...a[0]].length-1;let d,c,p=l,s=0;const u=a[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,n=n.slice(-1*t.length+l);(a=u.exec(n))!=null;){if(d=a[1]||a[2]||a[3]||a[4]||a[5]||a[6],!d)continue;if(c=[...d].length,a[3]||a[4]){p+=c;continue}else if((a[5]||a[6])&&l%3&&!((l+c)%3)){s+=c;continue}if(p-=c,p>0)continue;c=Math.min(c,c+p+s);const h=[...a[0]][0].length,g=t.slice(0,l+a.index+h+c);if(Math.min(l,c)%2){const k=g.slice(1,-1);return{type:"em",raw:g,text:k,tokens:this.lexer.inlineTokens(k)}}const C=g.slice(2,-2);return{type:"strong",raw:g,text:C,tokens:this.lexer.inlineTokens(C)}}}}codespan(t){const n=this.rules.inline.code.exec(t);if(n){let o=n[2].replace(this.rules.other.newLineCharGlobal," ");const a=this.rules.other.nonSpaceChar.test(o),r=this.rules.other.startingSpaceChar.test(o)&&this.rules.other.endingSpaceChar.test(o);return a&&r&&(o=o.substring(1,o.length-1)),{type:"codespan",raw:n[0],text:o}}}br(t){const n=this.rules.inline.br.exec(t);if(n)return{type:"br",raw:n[0]}}del(t){const n=this.rules.inline.del.exec(t);if(n)return{type:"del",raw:n[0],text:n[2],tokens:this.lexer.inlineTokens(n[2])}}autolink(t){const n=this.rules.inline.autolink.exec(t);if(n){let o,a;return n[2]==="@"?(o=n[1],a="mailto:"+o):(o=n[1],a=o),{type:"link",raw:n[0],text:o,href:a,tokens:[{type:"text",raw:o,text:o}]}}}url(t){var o;let n;if(n=this.rules.inline.url.exec(t)){let a,r;if(n[2]==="@")a=n[0],r="mailto:"+a;else{let l;do l=n[0],n[0]=((o=this.rules.inline._backpedal.exec(n[0]))==null?void 0:o[0])??"";while(l!==n[0]);a=n[0],n[1]==="www."?r="http://"+n[0]:r=n[0]}return{type:"link",raw:n[0],text:a,href:r,tokens:[{type:"text",raw:a,text:a}]}}}inlineText(t){const n=this.rules.inline.text.exec(t);if(n){const o=this.lexer.state.inRawBlock;return{type:"text",raw:n[0],text:n[0],escaped:o}}}},_Lexer=class Ce{constructor(n){q(this,"tokens");q(this,"options");q(this,"state");q(this,"tokenizer");q(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=n||_defaults,this.options.tokenizer=this.options.tokenizer||new _Tokenizer,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const o={other,block:block.normal,inline:inline.normal};this.options.pedantic?(o.block=block.pedantic,o.inline=inline.pedantic):this.options.gfm&&(o.block=block.gfm,this.options.breaks?o.inline=inline.breaks:o.inline=inline.gfm),this.tokenizer.rules=o}static get rules(){return{block,inline}}static lex(n,o){return new Ce(o).lex(n)}static lexInline(n,o){return new Ce(o).inlineTokens(n)}lex(n){n=n.replace(other.carriageReturn,`
`),this.blockTokens(n,this.tokens);for(let o=0;o<this.inlineQueue.length;o++){const a=this.inlineQueue[o];this.inlineTokens(a.src,a.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(n,o=[],a=!1){var r,l,d;for(this.options.pedantic&&(n=n.replace(other.tabCharGlobal,"    ").replace(other.spaceLine,""));n;){let c;if((l=(r=this.options.extensions)==null?void 0:r.block)!=null&&l.some(s=>(c=s.call({lexer:this},n,o))?(n=n.substring(c.raw.length),o.push(c),!0):!1))continue;if(c=this.tokenizer.space(n)){n=n.substring(c.raw.length);const s=o.at(-1);c.raw.length===1&&s!==void 0?s.raw+=`
`:o.push(c);continue}if(c=this.tokenizer.code(n)){n=n.substring(c.raw.length);const s=o.at(-1);(s==null?void 0:s.type)==="paragraph"||(s==null?void 0:s.type)==="text"?(s.raw+=`
`+c.raw,s.text+=`
`+c.text,this.inlineQueue.at(-1).src=s.text):o.push(c);continue}if(c=this.tokenizer.fences(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.heading(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.hr(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.blockquote(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.list(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.html(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.def(n)){n=n.substring(c.raw.length);const s=o.at(-1);(s==null?void 0:s.type)==="paragraph"||(s==null?void 0:s.type)==="text"?(s.raw+=`
`+c.raw,s.text+=`
`+c.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title});continue}if(c=this.tokenizer.table(n)){n=n.substring(c.raw.length),o.push(c);continue}if(c=this.tokenizer.lheading(n)){n=n.substring(c.raw.length),o.push(c);continue}let p=n;if((d=this.options.extensions)!=null&&d.startBlock){let s=1/0;const u=n.slice(1);let h;this.options.extensions.startBlock.forEach(g=>{h=g.call({lexer:this},u),typeof h=="number"&&h>=0&&(s=Math.min(s,h))}),s<1/0&&s>=0&&(p=n.substring(0,s+1))}if(this.state.top&&(c=this.tokenizer.paragraph(p))){const s=o.at(-1);a&&(s==null?void 0:s.type)==="paragraph"?(s.raw+=`
`+c.raw,s.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):o.push(c),a=p.length!==n.length,n=n.substring(c.raw.length);continue}if(c=this.tokenizer.text(n)){n=n.substring(c.raw.length);const s=o.at(-1);(s==null?void 0:s.type)==="text"?(s.raw+=`
`+c.raw,s.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):o.push(c);continue}if(n){const s="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,o}inline(n,o=[]){return this.inlineQueue.push({src:n,tokens:o}),o}inlineTokens(n,o=[]){var c,p,s;let a=n,r=null;if(this.tokens.links){const u=Object.keys(this.tokens.links);if(u.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(a))!=null;)u.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(a=a.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(a))!=null;)a=a.slice(0,r.index)+"++"+a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(r=this.tokenizer.rules.inline.blockSkip.exec(a))!=null;)a=a.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let l=!1,d="";for(;n;){l||(d=""),l=!1;let u;if((p=(c=this.options.extensions)==null?void 0:c.inline)!=null&&p.some(g=>(u=g.call({lexer:this},n,o))?(n=n.substring(u.raw.length),o.push(u),!0):!1))continue;if(u=this.tokenizer.escape(n)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.tag(n)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.link(n)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.reflink(n,this.tokens.links)){n=n.substring(u.raw.length);const g=o.at(-1);u.type==="text"&&(g==null?void 0:g.type)==="text"?(g.raw+=u.raw,g.text+=u.text):o.push(u);continue}if(u=this.tokenizer.emStrong(n,a,d)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.codespan(n)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.br(n)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.del(n)){n=n.substring(u.raw.length),o.push(u);continue}if(u=this.tokenizer.autolink(n)){n=n.substring(u.raw.length),o.push(u);continue}if(!this.state.inLink&&(u=this.tokenizer.url(n))){n=n.substring(u.raw.length),o.push(u);continue}let h=n;if((s=this.options.extensions)!=null&&s.startInline){let g=1/0;const C=n.slice(1);let k;this.options.extensions.startInline.forEach(P=>{k=P.call({lexer:this},C),typeof k=="number"&&k>=0&&(g=Math.min(g,k))}),g<1/0&&g>=0&&(h=n.substring(0,g+1))}if(u=this.tokenizer.inlineText(h)){n=n.substring(u.raw.length),u.raw.slice(-1)!=="_"&&(d=u.raw.slice(-1)),l=!0;const g=o.at(-1);(g==null?void 0:g.type)==="text"?(g.raw+=u.raw,g.text+=u.text):o.push(u);continue}if(n){const g="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(g);break}else throw new Error(g)}}return o}},_Renderer=class{constructor(t){q(this,"options");q(this,"parser");this.options=t||_defaults}space(t){return""}code({text:t,lang:n,escaped:o}){var l;const a=(l=(n||"").match(other.notSpaceStart))==null?void 0:l[0],r=t.replace(other.endingNewline,"")+`
`;return a?'<pre><code class="language-'+escape2(a)+'">'+(o?r:escape2(r,!0))+`</code></pre>
`:"<pre><code>"+(o?r:escape2(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:n}){return`<h${n}>${this.parser.parseInline(t)}</h${n}>
`}hr(t){return`<hr>
`}list(t){const n=t.ordered,o=t.start;let a="";for(let d=0;d<t.items.length;d++){const c=t.items[d];a+=this.listitem(c)}const r=n?"ol":"ul",l=n&&o!==1?' start="'+o+'"':"";return"<"+r+l+`>
`+a+"</"+r+`>
`}listitem(t){var o;let n="";if(t.task){const a=this.checkbox({checked:!!t.checked});t.loose?((o=t.tokens[0])==null?void 0:o.type)==="paragraph"?(t.tokens[0].text=a+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=a+" "+escape2(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:a+" ",text:a+" ",escaped:!0}):n+=a+" "}return n+=this.parser.parse(t.tokens,!!t.loose),`<li>${n}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let n="",o="";for(let r=0;r<t.header.length;r++)o+=this.tablecell(t.header[r]);n+=this.tablerow({text:o});let a="";for(let r=0;r<t.rows.length;r++){const l=t.rows[r];o="";for(let d=0;d<l.length;d++)o+=this.tablecell(l[d]);a+=this.tablerow({text:o})}return a&&(a=`<tbody>${a}</tbody>`),`<table>
<thead>
`+n+`</thead>
`+a+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const n=this.parser.parseInline(t.tokens),o=t.header?"th":"td";return(t.align?`<${o} align="${t.align}">`:`<${o}>`)+n+`</${o}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${escape2(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:n,tokens:o}){const a=this.parser.parseInline(o),r=cleanUrl(t);if(r===null)return a;t=r;let l='<a href="'+t+'"';return n&&(l+=' title="'+escape2(n)+'"'),l+=">"+a+"</a>",l}image({href:t,title:n,text:o,tokens:a}){a&&(o=this.parser.parseInline(a,this.parser.textRenderer));const r=cleanUrl(t);if(r===null)return escape2(o);t=r;let l=`<img src="${t}" alt="${o}"`;return n&&(l+=` title="${escape2(n)}"`),l+=">",l}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:escape2(t.text)}},_TextRenderer=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},_Parser=class Ie{constructor(n){q(this,"options");q(this,"renderer");q(this,"textRenderer");this.options=n||_defaults,this.options.renderer=this.options.renderer||new _Renderer,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new _TextRenderer}static parse(n,o){return new Ie(o).parse(n)}static parseInline(n,o){return new Ie(o).parseInline(n)}parse(n,o=!0){var r,l;let a="";for(let d=0;d<n.length;d++){const c=n[d];if((l=(r=this.options.extensions)==null?void 0:r.renderers)!=null&&l[c.type]){const s=c,u=this.options.extensions.renderers[s.type].call({parser:this},s);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(s.type)){a+=u||"";continue}}const p=c;switch(p.type){case"space":{a+=this.renderer.space(p);continue}case"hr":{a+=this.renderer.hr(p);continue}case"heading":{a+=this.renderer.heading(p);continue}case"code":{a+=this.renderer.code(p);continue}case"table":{a+=this.renderer.table(p);continue}case"blockquote":{a+=this.renderer.blockquote(p);continue}case"list":{a+=this.renderer.list(p);continue}case"html":{a+=this.renderer.html(p);continue}case"paragraph":{a+=this.renderer.paragraph(p);continue}case"text":{let s=p,u=this.renderer.text(s);for(;d+1<n.length&&n[d+1].type==="text";)s=n[++d],u+=`
`+this.renderer.text(s);o?a+=this.renderer.paragraph({type:"paragraph",raw:u,text:u,tokens:[{type:"text",raw:u,text:u,escaped:!0}]}):a+=u;continue}default:{const s='Token with "'+p.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return a}parseInline(n,o=this.renderer){var r,l;let a="";for(let d=0;d<n.length;d++){const c=n[d];if((l=(r=this.options.extensions)==null?void 0:r.renderers)!=null&&l[c.type]){const s=this.options.extensions.renderers[c.type].call({parser:this},c);if(s!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(c.type)){a+=s||"";continue}}const p=c;switch(p.type){case"escape":{a+=o.text(p);break}case"html":{a+=o.html(p);break}case"link":{a+=o.link(p);break}case"image":{a+=o.image(p);break}case"strong":{a+=o.strong(p);break}case"em":{a+=o.em(p);break}case"codespan":{a+=o.codespan(p);break}case"br":{a+=o.br(p);break}case"del":{a+=o.del(p);break}case"text":{a+=o.text(p);break}default:{const s='Token with "'+p.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return a}},Se,_Hooks=(Se=class{constructor(t){q(this,"options");q(this,"block");this.options=t||_defaults}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?_Lexer.lex:_Lexer.lexInline}provideParser(){return this.block?_Parser.parse:_Parser.parseInline}},q(Se,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"])),Se),Marked=class{constructor(...t){q(this,"defaults",_getDefaults());q(this,"options",this.setOptions);q(this,"parse",this.parseMarkdown(!0));q(this,"parseInline",this.parseMarkdown(!1));q(this,"Parser",_Parser);q(this,"Renderer",_Renderer);q(this,"TextRenderer",_TextRenderer);q(this,"Lexer",_Lexer);q(this,"Tokenizer",_Tokenizer);q(this,"Hooks",_Hooks);this.use(...t)}walkTokens(t,n){var a,r;let o=[];for(const l of t)switch(o=o.concat(n.call(this,l)),l.type){case"table":{const d=l;for(const c of d.header)o=o.concat(this.walkTokens(c.tokens,n));for(const c of d.rows)for(const p of c)o=o.concat(this.walkTokens(p.tokens,n));break}case"list":{const d=l;o=o.concat(this.walkTokens(d.items,n));break}default:{const d=l;(r=(a=this.defaults.extensions)==null?void 0:a.childTokens)!=null&&r[d.type]?this.defaults.extensions.childTokens[d.type].forEach(c=>{const p=d[c].flat(1/0);o=o.concat(this.walkTokens(p,n))}):d.tokens&&(o=o.concat(this.walkTokens(d.tokens,n)))}}return o}use(...t){const n=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(o=>{const a={...o};if(a.async=this.defaults.async||a.async||!1,o.extensions&&(o.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){const l=n.renderers[r.name];l?n.renderers[r.name]=function(...d){let c=r.renderer.apply(this,d);return c===!1&&(c=l.apply(this,d)),c}:n.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const l=n[r.level];l?l.unshift(r.tokenizer):n[r.level]=[r.tokenizer],r.start&&(r.level==="block"?n.startBlock?n.startBlock.push(r.start):n.startBlock=[r.start]:r.level==="inline"&&(n.startInline?n.startInline.push(r.start):n.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(n.childTokens[r.name]=r.childTokens)}),a.extensions=n),o.renderer){const r=this.defaults.renderer||new _Renderer(this.defaults);for(const l in o.renderer){if(!(l in r))throw new Error(`renderer '${l}' does not exist`);if(["options","parser"].includes(l))continue;const d=l,c=o.renderer[d],p=r[d];r[d]=(...s)=>{let u=c.apply(r,s);return u===!1&&(u=p.apply(r,s)),u||""}}a.renderer=r}if(o.tokenizer){const r=this.defaults.tokenizer||new _Tokenizer(this.defaults);for(const l in o.tokenizer){if(!(l in r))throw new Error(`tokenizer '${l}' does not exist`);if(["options","rules","lexer"].includes(l))continue;const d=l,c=o.tokenizer[d],p=r[d];r[d]=(...s)=>{let u=c.apply(r,s);return u===!1&&(u=p.apply(r,s)),u}}a.tokenizer=r}if(o.hooks){const r=this.defaults.hooks||new _Hooks;for(const l in o.hooks){if(!(l in r))throw new Error(`hook '${l}' does not exist`);if(["options","block"].includes(l))continue;const d=l,c=o.hooks[d],p=r[d];_Hooks.passThroughHooks.has(l)?r[d]=s=>{if(this.defaults.async)return Promise.resolve(c.call(r,s)).then(h=>p.call(r,h));const u=c.call(r,s);return p.call(r,u)}:r[d]=(...s)=>{let u=c.apply(r,s);return u===!1&&(u=p.apply(r,s)),u}}a.hooks=r}if(o.walkTokens){const r=this.defaults.walkTokens,l=o.walkTokens;a.walkTokens=function(d){let c=[];return c.push(l.call(this,d)),r&&(c=c.concat(r.call(this,d))),c}}this.defaults={...this.defaults,...a}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,n){return _Lexer.lex(t,n??this.defaults)}parser(t,n){return _Parser.parse(t,n??this.defaults)}parseMarkdown(t){return(o,a)=>{const r={...a},l={...this.defaults,...r},d=this.onError(!!l.silent,!!l.async);if(this.defaults.async===!0&&r.async===!1)return d(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof o>"u"||o===null)return d(new Error("marked(): input parameter is undefined or null"));if(typeof o!="string")return d(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(o)+", string expected"));l.hooks&&(l.hooks.options=l,l.hooks.block=t);const c=l.hooks?l.hooks.provideLexer():t?_Lexer.lex:_Lexer.lexInline,p=l.hooks?l.hooks.provideParser():t?_Parser.parse:_Parser.parseInline;if(l.async)return Promise.resolve(l.hooks?l.hooks.preprocess(o):o).then(s=>c(s,l)).then(s=>l.hooks?l.hooks.processAllTokens(s):s).then(s=>l.walkTokens?Promise.all(this.walkTokens(s,l.walkTokens)).then(()=>s):s).then(s=>p(s,l)).then(s=>l.hooks?l.hooks.postprocess(s):s).catch(d);try{l.hooks&&(o=l.hooks.preprocess(o));let s=c(o,l);l.hooks&&(s=l.hooks.processAllTokens(s)),l.walkTokens&&this.walkTokens(s,l.walkTokens);let u=p(s,l);return l.hooks&&(u=l.hooks.postprocess(u)),u}catch(s){return d(s)}}}onError(t,n){return o=>{if(o.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const a="<p>An error occurred:</p><pre>"+escape2(o.message+"",!0)+"</pre>";return n?Promise.resolve(a):a}if(n)return Promise.reject(o);throw o}}},markedInstance=new Marked;function marked(t,n){return markedInstance.parse(t,n)}marked.options=marked.setOptions=function(t){return markedInstance.setOptions(t),marked.defaults=markedInstance.defaults,changeDefaults(marked.defaults),marked};marked.getDefaults=_getDefaults;marked.defaults=_defaults;marked.use=function(...t){return markedInstance.use(...t),marked.defaults=markedInstance.defaults,changeDefaults(marked.defaults),marked};marked.walkTokens=function(t,n){return markedInstance.walkTokens(t,n)};marked.parseInline=markedInstance.parseInline;marked.Parser=_Parser;marked.parser=_Parser.parse;marked.Renderer=_Renderer;marked.TextRenderer=_TextRenderer;marked.Lexer=_Lexer;marked.lexer=_Lexer.lex;marked.Tokenizer=_Tokenizer;marked.Hooks=_Hooks;marked.parse=marked;marked.options;marked.setOptions;marked.use;marked.walkTokens;marked.parseInline;_Parser.parse;_Lexer.lex;function protectCode(t){const n=[],o=a=>`@@MD_CODE_${a}_@@`;return t=t.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g,a=>{const r=n.push(a)-1;return o(r)}),t=t.replace(/`[^`\n]+`/g,a=>{const r=n.push(a)-1;return o(r)}),{text:t,restore(a){return a.replace(/@@MD_CODE_(\d+)_@@/g,(r,l)=>n[Number(l)])}}}function escapeAttr(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function getShortcodeAttr(t,n){var o;return((o=t.match(new RegExp(`\\b${n}=["']([^"']*)["']`,"i")))==null?void 0:o[1])??""}const allowedHtmlTags=new Set(["a","abbr","article","b","blockquote","body","br","button","caption","code","col","colgroup","dd","del","details","div","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","img","input","ins","kbd","label","li","main","mark","nav","ol","p","pre","s","section","small","span","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","title","tr","u","ul"]);function escapeUnknownHtmlTags(t){return t.replace(/<\/?([A-Za-z][A-Za-z0-9_-]*)(?:\s[^<>]*?)?\s*\/?>/g,(n,o)=>allowedHtmlTags.has(o.toLowerCase())?n:n.replaceAll("<","&lt;").replaceAll(">","&gt;"))}function prepareMarkdown(t,n=[],o=""){const a=protectCode(t);let r=a.text;return r=r.replace(/<!--[\s\S]*?-->/g,""),r=r.replace(/<br\s*>\s*<\/br\s*>|<br\s*\/?>/gi,"<br />"),r=r.replace(/\{\{<\s*figure\b([\s\S]*?)>\}\}/gi,(l,d)=>{const c=getShortcodeAttr(d,"src");if(!c)return"";const p=getShortcodeAttr(d,"alt")||"Image",s=getShortcodeAttr(d,"width"),u=getShortcodeAttr(d,"height"),h=getShortcodeAttr(d,"title");return["<figure>",`<img ${[`src="${escapeAttr(c)}"`,`alt="${escapeAttr(p)}"`,s?`width="${escapeAttr(s)}"`:"",u?`height="${escapeAttr(u)}"`:""].filter(Boolean).join(" ")} />`,h?`<figcaption>${escapeAttr(h)}</figcaption>`:"","</figure>"].filter(Boolean).join(`
`)}),r=r.replace(/(<figure>[\s\S]*?<\/figure>(?:\s*<br\s*\/?>\s*<figure>[\s\S]*?<\/figure>)+)/gi,l=>['<div class="article-image-row">',l.replace(/\s*<br\s*\/?>\s*/gi,""),"</div>"].join(`
`)),r=r.replace(/<([A-Za-z][A-Za-z0-9_-]*:[A-Za-z0-9_-]+)>/g,(l,d)=>`&lt;${d}&gt;`),r=escapeUnknownHtmlTags(r),r=r.replace(/\{\{<\s*icon\s+name=["']([^"']+)["'][^>]*>\}\}/g,"◉"),r=r.replace(/(\]\()([^)]*)(\))/g,(l,d,c,p)=>{const s=c.trim(),u=s.split(/[?#]/,1)[0];if(!u.toLowerCase().endsWith(".md")||/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(s))return l;const h=s.slice(u.length),g=u.replace(/\.md$/i,""),C=[...o.split("/").slice(0,-1),...g.split("/")],k=[];for(const E of C)!E||E==="."||(E===".."?k.pop():k.push(E));let P=n.find(E=>E===k.join("/"));if(!P){const E=g.split("/").pop(),O=n.filter(N=>N.split("/").pop()===E);O.length===1&&(P=O[0])}return P?`${d}/blogs/${P}/${h}${p}`:l}),r=r.replace(/\{\{<\s*relref\s+["']([^"']+)["']\s*>\}\}/g,(l,d)=>{const c=d.trim().replace(/\\/g,"/"),s={apache:"apache/apache-setup"}[c]??c,u=n.find(h=>h===s||h.endsWith(`/${s}`));return u?`/blogs/${u}/`:`/${s}/`}),a.restore(r)}const blogFiles=Object.assign({"/content/blogs/ansible/ansible1.md":__vite_glob_0_0,"/content/blogs/ansible/ansible2.md":__vite_glob_0_1,"/content/blogs/ansible/ansible3.md":__vite_glob_0_2,"/content/blogs/apache/apache-config.md":__vite_glob_0_3,"/content/blogs/apache/apache-setup.md":__vite_glob_0_4,"/content/blogs/aws/aws-alb.md":__vite_glob_0_5,"/content/blogs/aws/aws-lambda.md":__vite_glob_0_6,"/content/blogs/aws/aws-secretmanager.md":__vite_glob_0_7,"/content/blogs/aws/aws-waf.md":__vite_glob_0_8,"/content/blogs/aws/cloudfront.md":__vite_glob_0_9,"/content/blogs/aws/s3files.md":__vite_glob_0_10,"/content/blogs/devsecops.md":__vite_glob_0_11,"/content/blogs/docker/docker-operations.md":__vite_glob_0_12,"/content/blogs/docker/docker-setup.md":__vite_glob_0_13,"/content/blogs/github-actions.md":__vite_glob_0_14,"/content/blogs/github-automation.md":__vite_glob_0_15,"/content/blogs/gitlab/git-tips.md":__vite_glob_0_16,"/content/blogs/gitlab/gitlab-setup.md":__vite_glob_0_17,"/content/blogs/k8s/argocd.md":__vite_glob_0_18,"/content/blogs/k8s/calico-cni.md":__vite_glob_0_19,"/content/blogs/k8s/deployments.md":__vite_glob_0_20,"/content/blogs/k8s/helm.md":__vite_glob_0_21,"/content/blogs/k8s/k8s-intro.md":__vite_glob_0_22,"/content/blogs/k8s/k8s-monitoring.md":__vite_glob_0_23,"/content/blogs/k8s/k8s-probes.md":__vite_glob_0_24,"/content/blogs/k8s/nginx-ingress-tls.md":__vite_glob_0_25,"/content/blogs/k8s/nginx-ingress.md":__vite_glob_0_26,"/content/blogs/k8s/rbac.md":__vite_glob_0_27,"/content/blogs/k8s/statefulset.md":__vite_glob_0_28,"/content/blogs/kafka.md":__vite_glob_0_29,"/content/blogs/ldap-sso.md":__vite_glob_0_30,"/content/blogs/linux/crowdsec.md":__vite_glob_0_31,"/content/blogs/linux/linux-tips1.md":__vite_glob_0_32,"/content/blogs/linux/linux-tips2.md":__vite_glob_0_33,"/content/blogs/linux/shellscript1.md":__vite_glob_0_34,"/content/blogs/linux/shellscript2.md":__vite_glob_0_35,"/content/blogs/linux/shellscript4.md":__vite_glob_0_36,"/content/blogs/linux/shellscrpt3.md":__vite_glob_0_37,"/content/blogs/monitoring/alertmanager.md":__vite_glob_0_38,"/content/blogs/monitoring/blackbox.md":__vite_glob_0_39,"/content/blogs/monitoring/observability.md":__vite_glob_0_40,"/content/blogs/monitoring/opentelemetry.md":__vite_glob_0_41,"/content/blogs/monitoring/otel-on-eks.md":__vite_glob_0_42,"/content/blogs/monitoring/prometheus.md":__vite_glob_0_43,"/content/blogs/nginx/letsencrypt-ssl.md":__vite_glob_0_44,"/content/blogs/nginx/nginx-lb.md":__vite_glob_0_45,"/content/blogs/nginx/nginx-mtls.md":__vite_glob_0_46,"/content/blogs/sonarqube-jenkins.md":__vite_glob_0_47,"/content/blogs/terraform/terraform-aws-vpc.md":__vite_glob_0_48,"/content/blogs/terraform/terraform-setup.md":__vite_glob_0_49,"/content/blogs/terraform/terraform2.md":__vite_glob_0_50,"/content/blogs/terraform/terraform5.md":__vite_glob_0_51,"/content/blogs/terraform/tf-module.md":__vite_glob_0_52}),projectFiles=Object.assign({"/content/projects/_index.md":__vite_glob_1_0,"/content/projects/devsecops-proj.md":__vite_glob_1_1,"/content/projects/k8s-otel-proj.md":__vite_glob_1_2,"/content/projects/sso-proj.md":__vite_glob_1_3});function slugFromPath(t,n){return t.replace(`/content/${n}/`,"").replace(/\.md$/i,"").replace(/\\/g,"/")}function normalizeDate(t){return t instanceof Date?Number.isNaN(t.getTime())?"":t.toISOString().slice(0,10):typeof t=="string"||typeof t=="number"?String(t):""}function list(t){return Array.isArray(t)?t.map(String).filter(Boolean):typeof t=="string"&&t.trim()?[t.trim()]:[]}function parseFiles(t,n,o=[]){return Object.entries(t).filter(([a])=>{var r;return!((r=a.split("/").pop())!=null&&r.startsWith("_"))}).map(([a,r])=>{const l=matter(r),d=slugFromPath(a,n),c={...l.data};c.date=normalizeDate(c.date),c.tags!==void 0&&(c.tags=list(c.tags)),c.categories!==void 0&&(c.categories=list(c.categories)),c.series!==void 0&&(c.series=Array.isArray(c.series)?list(c.series):String(c.series));const p=prepareMarkdown(l.content,o,n==="blogs"?d:""),s=[],u=new Map,h=new marked.Renderer;h.heading=k=>{const P=k.depth,E=k.text??"",O=(k.raw??"").replace(/^#{1,6}\s+/,"").replace(/\s+#+\s*$/,"").trim(),N=/\s*\{#([^}]+)\}\s*$/.exec(O)??/\s*\{#([^}]+)\}\s*$/.exec(E),G=N?(O||E).replace(/\s*\{#[^}]+\}\s*$/,""):E,j=String(marked.parseInline(G,{async:!1})),F=G.replace(/`([^`]+)`/g,"$1").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[*_~]/g,"").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").trim(),K=F.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"section",W=u.get(K)??0;u.set(K,W+1);const B=(N==null?void 0:N[1])??(W?`${K}-${W}`:K);return s.push({id:B,text:F,level:P}),`<h${P} id="${escapeHtml(B)}">${j}</h${P}>
`};const g=marked.parse(p,{async:!1,renderer:h}).replace(/<a\s+href="((?:https?:)?\/\/[^"]+)"(?![^>]*\btarget=)/gi,'<a href="$1" target="_blank" rel="noopener noreferrer"'),C=l.content.trim().split(/\s+/).filter(Boolean).length;return{slug:d,route:`/${n}/${d}/`,sourcePath:a,content:p,html:g,data:c,headings:s,readingTime:Math.max(1,Math.ceil(C/200))}}).filter(a=>!a.data.draft).sort((a,r)=>String(r.data.date??"").localeCompare(String(a.data.date??"")))}const blogSlugs=Object.keys(blogFiles).filter(t=>{var n;return!((n=t.split("/").pop())!=null&&n.startsWith("_"))}).map(t=>slugFromPath(t,"blogs")),blogs=parseFiles(blogFiles,"blogs",blogSlugs),projects=parseFiles(projectFiles,"projects",blogSlugs);function escapeHtml(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}export{blogs as b,projects as p};
