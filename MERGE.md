# How to Merge Your Feature Branch Back to Main

This project uses branch-based development. Follow these steps to merge your feature branch (e.g., `feature-rag-e2e`) back to `main`.

---

## 1. GitHub Pull Request (Recommended)

1. **Push your branch to GitHub** (if you haven't already):
   ```bash
   git push origin feature-rag-e2e
   ```
2. **Go to your repository on GitHub.**
3. **Click "Compare & pull request"** next to your branch.
4. **Review the changes** and add a descriptive title and summary.
5. **Click "Create pull request".**
6. After review, **click "Merge pull request"** to merge into `main`.
7. (Optional) **Delete the feature branch** on GitHub after merging.

---

## 2. GitHub CLI (Command Line)

1. **Push your branch to GitHub** (if you haven't already):
   ```bash
   git push origin feature-rag-e2e
   ```
2. **Create a pull request from the CLI:**
   ```bash
   gh pr create --base main --head feature-rag-e2e --fill
   ```
3. **Merge the pull request from the CLI:**
   ```bash
   gh pr merge --merge
   ```
4. (Optional) **Delete the local and remote feature branch:**
   ```bash
   git branch -d feature-rag-e2e
   git push origin --delete feature-rag-e2e
   ```

---

**Note:** Always ensure all tests pass and your branch is up to date with `main` before merging. 