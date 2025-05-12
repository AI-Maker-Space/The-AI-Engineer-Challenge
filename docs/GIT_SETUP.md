# 🔧 Git Setup Guide

Ready to level up your Git game? This guide is your ticket to becoming a Git ninja! We'll walk you through everything from basic setup to advanced workflows, making sure you're ready to rock your development journey. Just replace the placeholders (like `<YOUR-USERNAME>`) with your actual info, and you're good to go! 🚀

## 📋 Prerequisites

Before diving in, you will need these essentials:

- 🌐 A GitHub account (your passport to the coding universe)
- 🔧 Git installed on your local machine (the command-line magic wand)
- 💻 A code editor (like Cursor, VS Code, etc. - your digital workshop)
- ⌨️ Terminal access (Mac/Linux) or Command Prompt/PowerShell (Windows) - your command center

 🔑 In addition, you will  need a GitHub Personal Access Token (PAT). We'll show you how to create this later.


## ⚙️ Initial Setup
### 🪪 Configure Git Identity

Time to tell Git who you are! This is like setting up your developer ID card. Your Git identity is used to:
- Identify you as the author of your commits (adds your name to each change)
- Show up in commit history (your contributions are properly attributed)
- Connect your work to your GitHub profile (when email matches)
- Help other developers know who to contact about changes
<details>
<summary>⚠️ What happens if you don't set your identity?</summary>

If you don't set your Git identity:

- Commits will show as "unknown" or use your system username  
- Your contributions won't be linked to your GitHub profile  
- You might get warnings when trying to commit  
- Other developers won't know who to contact about your changes

</details>

```bash
# Set your name and email (Git needs to know who's making those awesome commits!)
git config --global user.name "<YOUR-NAME>"
git config --global user.email "<YOUR-EMAIL>"

# Double-check your settings (always good to verify!)
git config --list
```

#### 💡 Pro Tips for Git Identity

- **Name**:
	- Can be your real name or a pseudonym
	- Will be publicly visible in commit history
	- Choose something you're comfortable with being public
- **Email**:
	- Must match an email in your GitHub account for proper attribution
	- You can add multiple emails to your github account
	- You can set different identities per repository
	- For work projects, use your work email
	- For personal projects, use the email linked to your GitHub account
- **Multiple Identities**:
	How to set a different identity for a specific repository:
	```bash
	cd /[PATH TO REPO]
	git config user.name "<YOUR WORK NAME>"
	git config user.email "<WORK EMAIL@YOUR COMPANY.COM>"
	```


#### ✅ Let's Make Sure Git Knows Who You Are!

```bash
# Check if Git recognizes you
git config user.name
git config user.email

# Should show your name and email - if not, Git might be confused! 🤔

# Test your identity with a commit
echo "# Test" >> README.md
git add README.md
git commit -m "test: verify git identity"
git log -1  # Shows your most recent commit with your identity
# Should show your name and email in the commit
```

#### 🔍 How to Verify These Instructions

As a new Git user, it's smart to verify instructions! Here's how:

1. **Test in a Safe Environment**:
	- Create a test repository to try commands
	- Use `git status` frequently to understand what's happening
	- If something goes wrong, you can always delete the test repo and start over
2. **Verify Command Output**:
	- Most Git commands will show you what they're doing
	- Some Git commands have a dry-run option. You can try adding `--dry-run` to see what would happen
	- Use `git status` to check the result
3. **Common Verification Commands**:
  
	```bash
	# See what Git is doing
	git status
	
	# View your commit history
	git log
	
	# See your last commit
	git log -1
	
	# Check your configuration
	git config --list
	```

4. **When in Doubt**:
	- Check the official Git documentation: [https://git-scm.com/doc](https://git-scm.com/doc)
	- Use `git help <command>` for detailed help

> 💡 **Pro Tip**: Git is designed to be safe - it's hard to permanently lose work. If you're unsure about a command, you can usually undo it!

### 🔐 GitHub Authentication: Your Personal Access Token (PAT)

> 📸 Need visual guidance? Check out the [Detailed PAT Setup Guide](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-LLM-Development#setting-up-your-github-personal-access-token) with step-by-step screenshots!

1. Create a Personal Access Token (PAT):
	- Head to GitHub → Settings → Developer settings → Personal access tokens
	- Click "Generate new token" (your golden ticket)
	- Set permissions (at minimum: "Contents - Read and write")
	- Copy and store your token somewhere safe (like a password manager)
2. Configure credential storage (so you don't have to type your token every time):

	```bash
	# For macOS (stores in Keychain - your digital vault)
	git config --global credential.helper osxkeychain
	
	# For Windows (stores in Credential Manager - your Windows safe)
	git config --global credential.helper wincred
	
	# For Linux (stores in memory - your temporary sticky note)
	git config --global credential.helper cache
	# Note that this is temporary. If you want a permanent secure option
	# for linux, you need to install and configure a credential helper.
	```

3. Verify your setup:

	```bash
	# Test your authentication
	git clone https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
	# You should be prompted for your username and PAT
	# subsequent commands to the same remote repo will use
	# the PAT stored by the credential.helper
	```


## 🚀 Repository Setup

### 📥 Forking and Cloning

#### 🔄 Fork the Repository

	- Navigate to the original repository on GitHub  
  Example: https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge

![GitHub Fork button screenshot](https://i.imgur.com/bhjySNh.png)

- Click the "Fork" button in the top-right corner  
- Keep the repository name as is or change it if you'd like  
- Click "Create fork"


💡 **What is forking?** Forking creates your own copy of someone else’s repository on GitHub. It’s like photocopying a recipe so you can make your own changes without affecting the original. This allows you to freely experiment, contribute back via pull requests, or build your own version of a project — all while keeping the original intact.

#### 📥 Clone Your Fork

```bash
# Navigate to where you want your project to live
cd <PATH-TO-DESIRED-PARENT-DIRECTORY>

# Clone your fork (this is like downloading your copy to your computer)
git clone https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
# you may be prompted for your GitHub username and personal access token (PAT)

# Move into your new project directory
cd <REPO-NAME>

# Add the original repository as "upstream" (so you can keep up with the cool updates!)
git remote add upstream https://github.com/<ORIGINAL-REPO-OWNER>/<REPO-NAME>.git

# Check your remote connections
git remote -v
```

💡 **Tip**: If you've already stored your PAT in the macOS Keychain (or equivalent), you won’t be prompted again.

💡 **What is cloning?** Cloning creates a local copy of a GitHub repository on your computer. It downloads a working version of the project so you can explore, make changes, and push updates from your own machine. While _forking_ gives you your own copy in the cloud (on GitHub), _cloning_ brings that copy down to your local development environment.

#### ✅ Let's Make Sure Everything is Connected and Working!

```bash
# Check if Git is installed and ready to rock
git --version
#if git is installed, you should see something like "git version x.x.x"

# cd to your cloned project directory
cd <REPO-NAME>

# Check your remotes (you should see both 'origin' and 'upstream')
git remote -v

# Test your GitHub connection
git ls-remote https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
```
You should see a list of Git refs. If you get an error:
- Double-check your remote URL (`git remote -v`)
- Make sure your repository exists and is accessible
- For private repos, ensure your Personal Access Token (PAT) is valid and stored

### 🚫 Configuring .gitignore

#### 📁 Setting Up .gitignore

Check or update the `.gitignore` file to keep unnecessary files out of your repository. Things like dependencies, environment files, and system artifacts don’t belong in version control.
If your project doesn't already have a `.gitignore` file,  you can create it manually:

```bash
# Create .gitignore
touch .gitignore
```

Here are some common patterns you might want to include in your `.gitignore`:

```
# Dependencies
node_modules/
venv/
__pycache__/

# Environment files
.env
.env.local

# IDE settings
.vscode/
.idea/
*.swp

# OS artifacts
.DS_Store
Thumbs.db
```
💡 **These are just examples.** The contents of your `.gitignore` file depend on your tools and language.  
You can find pre-made templates for different tech stacks at [https://github.com/github/gitignore](https://github.com/github/gitignore).

#### ✅ Let's Make Sure Your .gitignore is Working!

```bash
# Check if .gitignore is doing its job
git status
# Should not show any ignored files — if you see them listed, your .gitignore file might not be working as expected.

# Optional: check if a specific file is being ignored and why
git check-ignore -v <FILENAME>
# This shows which rule (and file) is causing it to be ignored
```

## 🔄 Development Workflow

🧭 **Development Workflow Overview**
Here's a practical Git workflow that's great for solo projects and easy to build on as your skills grow and your team expands. It's beginner-friendly but solid enough for real-world projects.
💡**Heads-up:**  
This guide focuses on using Git from the command line, which gives you flexibility and full control, especially when working locally.  
Many of the steps explained here can also be done using GitHub’s web interface.
GitHub’s web interface can be especially helpful when you're working in a shared repository.

### 🌿 Creating and Switching Branches
Branches let you work on new features or fixes without touching the main project (creating a safe sandbox to play in). 
```bash

# Create and switch to a new branch 
git checkout -b <YOUR-BRANCH-NAME>

# Switch between branches 
git checkout <YOUR-BRANCH-NAME>

# List all branches 
git branch -a

```
💡 **What is branching?**  
Branches let you create alternate versions of your codebase where you can make changes safely, without affecting the main project. They’re useful for working on features, fixes, or experiments — and can be merged back in when ready.

### ✏️ Committing Your Changes

A commit saves a snapshot of your changes to the repository. It’s like taking a picture of your progress — with a message explaining what you changed and why. Commits help track history, share your work, and roll back if needed.
```bash
# Check status (what's changed in your universe?)
git status

# Stage changes (get your changes ready for the spotlight)
git add <FILE-NAME>
# or stage all changes 
git add .

# Commit changes (seal the deal with a message)
git commit -m "<DESCRIPTION OF CHANGES>"

# Optional but recommended: check for updates before pushing
# This ensures you're not pushing over someone else's recent changes
git fetch origin
git status
# If you're behind, consider pulling or merging before you push
# → See [Fetching and Pulling](#fetching-and-pulling) for more
# Push to your fork (send your changes to your github repo)
git push origin <YOUR-BRANCH-NAME>
```
💡 **Tip:** If you make a mistake — in your code or your commit message — just fix it and make another commit. There’s no need to rewrite history.

#### 📝 Writing Good Commit Messages

Use this format for commit messages (like writing a good story):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Common types:

1. `feat`: New feature (the cool new stuff)
2. `fix`: Bug fix (the superhero saves the day)
3. `docs`: Documentation changes (making things clearer)
4. `style`: Code style changes (making it pretty)
5. `refactor`: Code changes that neither fix bugs nor add features (spring cleaning)
6. `test`: Adding or modifying tests (making sure everything works)
7. `chore`: Changes to build process or auxiliary tools (housekeeping)

Examples:
```bash
git commit -m "feat(auth): add OAuth2 login support"
git commit -m "fix(api): resolve timeout issues in user endpoint"
git commit -m "docs(readme): update installation instructions"
```

### 📡 Fetching and Pulling

Before pushing your changes or syncing with others, it helps to understand the difference between two common Git commands: `fetch` and `pull`.

#### 🚚 `git fetch`

Downloads changes from a remote repository — but **doesn’t apply them** to your current branch.  
Use this when you want to **check for updates** without affecting your work.
```bash
git fetch origin
git log origin/main # Optional: review new commits before merging
```

#### 📥 `git pull`

Does the same fetch, **but also merges** the changes into your current branch right away.
```bash
git pull origin main
```

#### 🧠 Tip:

- Use `fetch` when you want to **stay in control** and see what’s changed first.
    
- Use `pull` when you’re ready to **update your branch immediately**.
- 
💡 You’ll see `git fetch origin` recommended in several steps below.  
It’s a safe habit that helps avoid conflicts before pushing your changes.
### 🔄 Keeping Your Fork Updated

💡 Pre-check: Make sure your local `main` branch is tracking your fork (`origin`)
Run:
```bash
git branch -vv
```
You should see `[origin/main]` next to `main` in the output, like this:
```
* main  abc1234 [origin/main] message here...
```

If your `main` branch isn’t tracking `origin/main`, you probably don’t need to fix it. But if push/pull commands aren’t working as expected, you can set it manually:
```bash
git branch --set-upstream-to=origin/main main
```

Stay in sync with the original repository so you don’t fall behind!
```bash
# Fetch changes from your fork (usually optional, but good to verify)
git fetch origin

# Fetch upstream changes (see what's new in the original project)
git fetch upstream

# Switch to your local main branch
git checkout main

# Merge upstream changes into your local main branch

git merge upstream/main

# Push the updated main branch back to your fork on GitHub
git push origin main
```
> 🎯 **If these commands succeed**, you’ll either see new commits pulled in or a message that everything is already up to date.

💡 **Why it matters**: Keeping your fork updated helps avoid painful merge conflicts later and ensures your pull requests are based on the latest project state.

### 🔀 Merging a Branch into Main

Once you're finished working on a feature branch, you'll want to bring your changes into `main`.

This helps you:
- Keep your work organized
- Prepare for sharing or submitting a pull request
- Keep your fork's `main` branch current
```bash
# Make sure you're on your feature branch
git checkout <YOUR-FEATURE-BRANCH>

# Confirm your changes are committed
git status    # Should say "nothing to commit"
git log       # Optional: sanity check your commits

# Switch to your local main branch
git checkout main

# Merge your feature branch into main
git merge <YOUR-FEATURE-BRANCH>

# Push the updated main branch to your fork on GitHub
git push origin main

```
💡 **Optional**: After merging, you can delete your feature branch if you're done with it:
```bash
git branch -d <YOUR-FEATURE-BRANCH>            # delete local branch
# with the -d flag, git only deletes the local branch  if its commits are already part of another branch (like main)

git push origin --delete <YOUR-FEATURE-BRANCH>
# deletes the branch from your fork on GitHub
```
### ✅ Checking Your Branch Status

```bash
# Check branch status (see all your parallel universes)
git branch -v
# Should show all branches and their status

# Verify remote tracking (make sure you're not lost in space)
git branch -vv
# Should show tracking information
```




## 📤 Pull Request Workflow
### 🛠️ Creating a Pull Request

  - Push your changes to your fork (get your code ready for the spotlight)
  - Go to your fork on GitHub
  - Click "Compare & pull request" (time to show off your work!)
  - Fill in the PR template (tell everyone what you've been up to)
  - Request reviews from team members (get some expert eyes on your work)
  
💡 **What is a pull request?**  
A pull request (PR) lets you propose changes to a repository — it’s like saying, “Here’s what I worked on, and I’d like to add it to the main project.” It opens a conversation where others can review, discuss, and approve your work before merging it in.
### ✨ PR Best Practices

  - Write clear, descriptive titles (make it pop!)
  - Link related issues (connect the dots)
  - Include screenshots for UI changes (show, don't just tell)
  - Keep PRs focused and small (bite-sized is better)
  - Respond to review comments promptly (keep the conversation flowing)

### 📋 PR Due-Diligence
##### ✅ Documentation & Presentation Checklist

Before hitting that "Create pull request" button, run through this quick checklist (it's like your pre-flight safety check!):

**🔧For Code Changes:**
🟦 Test your changes locally (make sure everything works as expected!)
🟦 Look for any obvious errors or bugs in your code
🟦 Review your own code once more (fresh eyes catch more issues!)
🟦 Make sure your branch is up to date with the main branch (no surprise conflicts)

**📘For Documentation:**
✅ Spelling and grammar look good  
✅ All links are working (no 404s)  
✅ Code examples are tested and runnable  
✅ Formatting looks correct in GitHub preview  
✅ Information is accurate and up to date

**Before submitting your PR, be sure to check the `CONTRIBUTING.md` file in the repository**.  
It may include important project-specific guidelines about branch naming, testing, code style, or review expectations.

> 💡 If you don’t see one, it’s still good practice to follow clear commit messages and keep your PR focused.
> 
##### 📋 Final Sanity Checks Before Submitting

```bash
# Check your branch status
git status
# Should be clean - no uncommitted changes

# Verify your commits
git log --oneline
# Should show clear, conventional commit messages

# Check if you're up to date with the original project
git fetch upstream
git status
# Should be up to date with upstream/main
```


## 🔧 Troubleshooting
### 🚫 Authentication Issues

```bash
# Reset credentials (when GitHub forgets who you are)
git config --global --unset credential.helper
git config --global credential.helper osxkeychain  # or appropriate for your OS

# Verify your PAT (check if your secret handshake still works)
git ls-remote https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
```

### 🔄 Merge Conflicts

Sometimes, when you merge changes from another branch (like `main` or `upstream/main`), Git may not be able to automatically combine everything — especially if the same lines of code were changed in both places. This creates a **merge conflict** that you'll need to resolve manually.

Here’s how to handle it step by step.
First make sure your local main is up-to-date with the original repo:
```bash
#Make sure your local main is up to date with the original repo
git checkout main
git fetch upstream
git merge upstream/main

# If there are conflicts during this merge:
# Open the conflicting files in your editor
# Look for lines marked with <<<<<<<, =======, and >>>>>>>
# Edit the files to resolve the conflicts manually

# Once you've finished resolving conflicts, stage the changes
git add .

# Then commit the resolved files
git commit -m "fix: resolve merge conflicts"

```

Then make sure whatever feature branch you are working on is also up-to-date:
```bash
#Switch to your feature branch
git checkout <YOUR-BRANCH>

```
```bash
#Merge the updated main into your feature branch
git merge main

# If this merge causes additional conflicts,
# follow the same resolution steps as above.
```

### 🔄 Branch Issues

```bash
# Delete local branch (clean up your workspace)
git branch -d <BRANCH-NAME>

# Delete remote branch (clean up the cloud)
git push origin --delete <BRANCH-NAME>

# Recover a deleted branch
# You probably won't need this, but just in case you force-deleted a branch.
git reflog
# Find the commit hash for the lost work
git checkout -b <branch-name> <commit-hash>

```
💡 You usually won’t need to recover a branch unless you force-delete (`-D`) or lose unpushed commits after a reset, rebase, or amend. Regular `-d` is safe..

## 🎓 Additional Learning Resources

- [Git Documentation](https://git-scm.com/doc) (the Git bible)
- [GitHub Guides](https://guides.github.com/) (your Git playbook)
- [Conventional Commits](https://www.conventionalcommits.org/) (the art of commit messages)
- [GitHub Flow](https://guides.github.com/introduction/flow/) (the way of the Git warrior)
- [GitHub Skills](https://skills.github.com/) (level up your Git game)

---

Remember: Git is your friend! 🚀 Happy coding! 💻