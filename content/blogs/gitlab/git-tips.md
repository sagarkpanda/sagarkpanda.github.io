---
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

```bash
git config --global user.name
git config --global user.email
```

You can also inspect an existing commit:

```bash
git log --format=fuller
```

Example:

```text
Author: John Doe <john@example.com>
Commit: John Doe <john@example.com>
```

If `john@example.com` is your personal email and the repository is public, that email becomes publicly visible as part of the commit history.

### Using a Noreply Email

Both GitHub and GitLab provide a private **noreply** email address that can be used instead of your personal email.

Typical examples include:

```text
GitHub:
<id>+<username>@users.noreply.github.com

GitLab:
<username>@users.noreply.gitlab.com
```

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

```bash
git config --global user.email "<your-noreply-email>"
```

Verify the change:

```bash
git config --global user.email
```

From this point onward, new commits created on your local machine will use the configured noreply email.

### Existing Commits Are Not Changed

A common misconception is that changing `user.email` updates previous commits.

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

Later in this article, we'll use `git-filter-repo` to remove sensitive information from existing commits.

### Best Practices

- Use your GitHub or GitLab noreply email for public repositories.
- Enable your platform's email privacy setting before making web-based commits.
- Configure your local Git client to use the same noreply address.
- Verify your Git configuration when setting up a new machine.
- If your personal email has already been published, consider rewriting the repository history if appropriate.

## 2. Undoing Changes

Git provides several commands for undoing changes, but each one operates at a different level. Understanding when to use `git restore`, `git reset`, and `git revert` will help you recover from mistakes without losing work or rewriting history unintentionally.

Before we begin, it's important to understand the three areas that Git manages. Most commands such as `git restore`, `git reset`, and `git revert` operate on one or more of these areas.

```text
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
```

- **Working Tree** – The files you're currently editing.
- **Staging Area (Index)** – Changes that will be included in the next commit.
- **Commit History (HEAD)** – The latest committed snapshot of your repository.

As we explore each command, we'll refer back to this diagram to see which area is being modified.

Let's create a small repository that we can safely experiment with.

### Setting Up the Demo Repository

To demonstrate the differences between `git restore`, `git reset`, and `git revert`, we'll create a small Git repository from scratch. Using a dedicated repository ensures you can safely experiment without affecting any existing projects.

#### Initialize a Repository

```bash
mkdir git-reset-demo
cd git-reset-demo
git init
```

#### Configure a Local Git Identity

For this demo, we'll configure the Git identity only for this repository. This avoids modifying your global Git configuration.

```bash
git config --local user.name "Demo User"
git config --local user.email "demo@example.com"
```

You can verify the configuration using:

```bash
git config --local --list
```

#### Create the First File

```bash
echo "Line 1" > notes.txt
```

At this point, Git sees the file as **untracked**:

```bash
git status
```

Output:

```text
On branch master

No commits yet

Untracked files:
  notes.txt
```

#### Stage the File

Add the file to the staging area:

```bash
git add notes.txt
```

Verify the status again:

```bash
git status
```

Output:

```text
Changes to be committed:
  new file: notes.txt
```

#### Create the Initial Commit

Finally, create the first commit:

```bash
git commit -m "Initial commit"
```

Verify the commit history:

```bash
git log --oneline
```

Example output:

```text
a1b2c3d Initial commit
```

Your repository is now in a clean state and ready for the rest of the examples in this article.

### `git restore`

`git restore` was introduced in Git 2.23 to make it clearer how to restore files without overloading the behavior of `git checkout`.

Its primary purpose is to restore files in your **working tree** or **staging area**, making it an excellent tool for undoing local changes without affecting your commit history.

We'll use the repository created in the previous section to demonstrate the most common use cases.

#### Discarding Unstaged Changes

Let's modify our tracked file:

```bash
echo "Line 2" >> notes.txt
```

Check the status:

```bash
git status
```

Output:

```text
Changes not staged for commit:
  modified: notes.txt
```

At this point, the change exists only in the **working tree**.

To discard the modification and restore the file to its last committed state, run:

```bash
git restore notes.txt
```

Verify the result:

```bash
git status
```

Output:

```text
On branch master
nothing to commit, working tree clean
```

Inspect the file:

```bash
cat notes.txt
```

Output:

```text
Line 1
```

The second line has been removed because it was never staged or committed.

> **Key takeaway:** `git restore <file>` discards changes from the **working tree**, restoring the file to the version stored in `HEAD`.

#### Unstaging Changes

Now let's modify the file again:

```bash
echo "Line 2" >> notes.txt
```

Stage the change:

```bash
git add notes.txt
```

Verify the status:

```bash
git status
```

Output:

```text
Changes to be committed:
  modified: notes.txt
```

Suppose you staged the file accidentally and want to remove it from the staging area without losing your edits.

Run:

```bash
git restore --staged notes.txt
```

Check the status again:

```bash
git status
```

Output:

```text
Changes not staged for commit:
  modified: notes.txt
```

Inspect the file:

```bash
cat notes.txt
```

Output:

```text
Line 1
Line 2
```

Notice that the modification is still present in the file.

Only the staging area has changed.

> **Key takeaway:** `git restore --staged <file>` removes the file from the staging area while preserving your local changes.

#### Discarding Both Staged and Unstaged Changes

If you've already staged a change and later decide you don't want it at all, you can restore both the staging area and the working tree.

First, stage the file again:

```bash
git add notes.txt
```

Then restore both:

```bash
git restore --staged --worktree notes.txt
```

You can also use the short form:

```bash
git restore -SW notes.txt
```

Verify the result:

```bash
git status
```

Output:

```text
On branch master
nothing to commit, working tree clean
```

Inspect the file one final time:

```bash
cat notes.txt
```

Output:

```text
Line 1
```

The file has been restored to exactly how it existed in the most recent commit.

Both the staged change and the local modification have been discarded.

> **Key takeaway:** `git restore --staged --worktree <file>` completely restores the file to the state of the latest commit (`HEAD`).

#### Summary

| Command | Description |
|---------|-------------|
| `git restore <file>` | Discards unstaged changes from the working tree. |
| `git restore --staged <file>` | Removes changes from the staging area while keeping the file modified. |
| `git restore --staged --worktree <file>` | Removes staged changes and discards working tree changes, restoring the file to the latest committed version. |

`git restore` only affects files in your working directory and staging area. It **does not rewrite commit history**, making it a safe command to use when cleaning up local changes before committing.

### `git reset`

Unlike `git restore`, which primarily affects your working directory or staging area, `git reset` changes where `HEAD` points. Depending on the mode used, it can also update the staging area and working tree.

To better understand how `git reset` works, let's create a few commits.

#### Create Additional Commits

Append another line to the file:

```bash
echo "Line 2" >> notes.txt
```

Stage and commit the change:

```bash
git add notes.txt
git commit -m "Add Line 2"
```

Append one more line:

```bash
echo "Line 3" >> notes.txt
```

Stage and commit again:

```bash
git add notes.txt
git commit -m "Add Line 3"
```

Verify the commit history:

```bash
git log --oneline
```

Example output:

```text
c3d4e5f Add Line 3
b2c3d4e Add Line 2
a1b2c3d Initial commit
```

We now have three commits, giving us enough history to demonstrate each reset mode.