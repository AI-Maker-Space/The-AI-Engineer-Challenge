# Merging the PDF RAG System Feature

This document provides instructions for merging the PDF-based RAG system feature into the main branch.

## Changes Overview

The feature adds the following capabilities:
1. PDF upload and processing endpoint in the backend
2. PDF text extraction and indexing using the aimakerspace library
3. RAG-based chat functionality that answers questions based on PDF content
4. New frontend PDF upload component
5. Updated chat interface to support PDF context

## Merging via GitHub PR

1. Push the feature branch to GitHub:
   ```bash
   git push origin feature/pdf-rag-system
   ```

2. Go to GitHub and create a new Pull Request:
   - Base branch: `main`
   - Compare branch: `feature/pdf-rag-system`
   - Title: "feat: implement PDF-based RAG system"
   - Description: Include the changes overview from above

3. Request review from team members

4. After approval, merge the PR using the "Squash and merge" option

## Merging via GitHub CLI

1. Install GitHub CLI if not already installed:
   ```bash
   brew install gh
   ```

2. Authenticate with GitHub:
   ```bash
   gh auth login
   ```

3. Create and merge PR:
   ```bash
   gh pr create --title "feat: implement PDF-based RAG system" --body "Implements PDF upload and RAG-based chat functionality" --base main
   gh pr merge --squash
   ```

## Testing After Merge

1. Pull the latest changes:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Install new dependencies:
   ```bash
   cd api && pip install -r requirements.txt
   ```

3. Test the new functionality:
   - Upload a PDF file through the UI
   - Ask questions about the PDF content
   - Verify that responses are based on the PDF context
