---
date: '2026-05-24T12:45:10+05:30'
draft: false
title: 'Turn Your GitHub Repository into a Self-Managing Workflow'
Description: Learn to manage github repo with automation. Create PR/Issue templates, label PRs automatically and more.
image: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BKfu-QFmcuj1zpFzHqWSYA.png

tags:
  - ci/cd
  - github
  - devops
  - repo automation
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

```
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
```

### PR and Bug Report Templates

One of the simplest but most useful automations is enforcing structured pull requests and issue reports.

Without templates, contributors may omit important information, maintainers would have to ask repetitive questions and makes the review process slower.

GitHub supports both:

*   Pull Request templates
*   Issue/Feature request template

**PR Template:**

create the template under .github as below and add your data how you want to show.

```md
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
```

**Issue template/feature req:**

Similarly create folder .github/ISSUE_TEMPLATE and you can add bug report and feature request template.

```
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
```

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

```
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
```

For example any changes to .md file will be labeled as documentation, and any changes made under .github/ will be marked as github-actions.

To have github auto assign these labels we have to create a workflow under .github/workflow.

```
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
```

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

```
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
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Comment on PR
        run: |
          gh pr comment ${{ github.event.pull_request.number }} \
            --body "Thanks for the PR!"
```

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

```
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
        "message": "chore(release): ${nextRelease.version} [skip ci]"
      }
    ]
  ]
}
---------------------------
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
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
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
```

This bot works based on commit message formats.

```
feat: add user authentication
fix: resolve login timeout issue
perf: improve API response caching
docs: update installation guide
refactor: simplify payment service
```

Version bump rules:

*   `fix:` → patch release (`1.0.0` → `1.0.1`)
*   `feat:` → minor release (`1.0.0` → `1.1.0`)
*   `BREAKING CHANGE:` or `feat!:` → major release (`1.0.0` → `2.0.0`)

any other commits or formats such as chore: or simple commits will be ignored marking no tag or release, you can view the semantic release workflow action for the details.

{{< figure
    src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2tWLNG_tMtdOjYB6wn8OLQ.png"
    alt="major release"
    width="1000"
    height="600"
    title="Major Release commit with feat!:"
>}}

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

Checkout related article on [CI/CD →](/blogs/#ci-cd)
