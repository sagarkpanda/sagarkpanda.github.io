---
date: '2023-10-21T19:26:10+05:30'
draft: false
title: 'A Beginner’s Introduction to GitHub Actions'
Description: GitHub Actions is a modern CI/CD alternative to Jenkins.
tags:
  - ci/cd
  - github
  - devops
  - pipeline
---

![action workflow](https://miro.medium.com/v2/resize:fit:1358/format:webp/1*_7mJjD1resPodxT7agk16w.png)

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

```
#main.py
import os
print("Hello World")
```

The action yml to take this code and run the pipeline.

```
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
```

*   name: The name of our pipeline
*   on — this is the build trigger. We have different triggers like on push, or pull request or a cron job etc. We also need to define the branch on the the event should be taken from. Here the branch is main.

```
on:
  schedule: # Run workflow automatically
    - cron: '30 4 * * *'
```

On a PR. We can also define multiple branches as an array.

```
on:
  push:
    branches:
      - [main, test]
  pull_request:
    branches:
      - main
```

*   workflow_dispatch: This is optional to trigger the job manually similarly to “Build Now” on Jenkins.

Having this, we get an option as below. Skipping this means the pipeline will run only on the other events such as code push , on a cron time and pull request. We can’t run it ourself.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0VLR_HE6sb6_NwaXlHStAw.png)

*   jobs — same as Stages on Jenkins and we can define multiple jobs (stages). Every job with a particular name. In our example the job name is job1.
*   runs-on: This is for defining the node (machine) where the pipeline will be executed. It can be Linux, windows or Mac OS. We can also define our own node.

```
steps:
      - uses: actions/checkout@v2
      - run: python main.py
```

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

```
import os
print("Hello World")
print(os.environ.get('first_name'))
print(os.environ.get('last_name'))
print((os.environ.get('first_name'))=='Sagar')
print((os.environ.get('last_name'))=='p')
```

As the values are coming from secret, when we try to print them, we’ll get *** printed instead. So to be able to verify, I have added conditional statements which will print True or false based on the secret values.

The “**$github.run_number**” is a built-in variable that prints the build number of workflow runs.

Now we need to create 2 variables to get the creds values into github action to pass it to the application. Since we are accessing secret, we’ll use **“${{secrets.secretname}}”.**

Update the action yml like below:

```
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
      - run: echo ${{github.run_number}}
      - run: python main.py
        env:
            first_name : ${{secrets.FNAME}}
            last_name : ${{secrets.LNAME}}
```

Now lets have a look at the logs. We see hello world as usual. The *** are the values of secrets but are masked because well its secret 😀.

The True is because the FNAME value is sagar, and LANME is not p, so the condition failed.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SRAs-SSLi09FlCJO8NdxFA.png)

There are even more options and many actions that can be used.

For example you can build an app and push the result to a remote machine or push to a new branch on the github repo itself, or download the build artifact.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2pmw01Ywll8UZG8ae8-90w.png)

You can also select the version of the programming language you want to use or even use multiple version of the lang.

```
strategy:
      matrix:
        node-version: [10.x, 12.x]
```

→ Here’s an example of pushing to a branch in same repo.

```
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
       key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    # - name: Production build
    - uses: actions/checkout@v3
    - name: Production build
      uses: actions/setup-node@v3
      with:
        node-version: '16.x'
        #${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - name: Deploy to gh-pages
      run: |
       git config --global user.name $user_name
       git config --global user.email $user_email
       git remote set-url origin @github.com/${repository">https://${github_token}@github.com/${repository}
       npm run deploy
      env:
       user_name: 'github-actions[bot]'
       user_email: 'github-actions[bot]@users.noreply.github.com'
       github_token: ${{ secrets.PAGES_TOKEN }}
       repository: ${{ github.repository }}
```

The last step in this example is to push the complied files to the gh-pages branch. This done using github-actions bot. “**user_name: ‘github-actions[bot]**”

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WPj8ZX8kpWsH-zzpNLqdmQ.png)

→ Another github action by Gautam, that runs daily and updates the readme.md with the medium (can be any) blogs.

```
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
```

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