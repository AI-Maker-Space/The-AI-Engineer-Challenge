# MERGE Instructions - RAG Functionality Branch

## Branch Information
- **Feature Branch**: `copy_rag`
- **Target Branch**: `main`
- **Purpose**: Add PDF upload and RAG (Retrieval Augmented Generation) functionality to the chat application

## Changes Summary
This branch adds comprehensive RAG functionality to the existing chat application:

### Backend Changes (`api/app.py`)
- ✅ **RAG Class**: Inlined RAG implementation with OpenAI embeddings and chat completions
- ✅ **PDF Processing**: Added PDF text extraction using PyPDF2
- ✅ **New Endpoints**:
  - `POST /api/upload-pdf` - Upload and index PDF documents
  - `POST /api/rag-chat` - Chat using RAG context from uploaded PDFs
  - `GET /api/rag-status/{user_id}` - Check RAG index status for users
- ✅ **File Persistence**: Conversation and RAG index storage in `/tmp/` for serverless compatibility
- ✅ **Dependencies**: Added numpy, PyPDF2, python-multipart, python-dotenv

### Frontend Changes (`frontend/src/app/page.tsx`)
- ✅ **PDF Upload UI**: File input and upload functionality
- ✅ **Chat Mode Toggle**: Switch between "Normal Chat" and "RAG Chat" modes
- ✅ **RAG Status Display**: Shows whether user has uploaded and indexed a PDF
- ✅ **Enhanced Chat Input**: Textarea with auto-resize and Shift+Enter support
- ✅ **User ID Management**: Persistent user identification via localStorage

### Configuration Changes
- ✅ **Dependencies**: Updated `pyproject.toml` and `api/requirements.txt`
- ✅ **Proxy Setup**: Added `frontend/next.config.ts` for local development API routing
- ✅ **Test Files**: Created 5 vocabulary PDFs for testing RAG functionality

## Merge Options

### Option 1: GitHub Pull Request (Recommended)

#### Step 1: Push the feature branch
```bash
git push origin copy_rag
```

#### Step 2: Create Pull Request
1. Go to your GitHub repository
2. Click "Compare & pull request" for the `copy_rag` branch
3. Fill in the PR details:
   - **Title**: "Add RAG functionality with PDF upload and chat"
   - **Description**: Copy the changes summary from above
4. Assign reviewers if needed
5. Click "Create pull request"

#### Step 3: Review and Merge
1. Review the changes in the GitHub interface
2. Run any automated tests/checks
3. Click "Merge pull request" 
4. Choose merge type:
   - **"Create a merge commit"** - Preserves branch history
   - **"Squash and merge"** - Combines all commits into one clean commit
   - **"Rebase and merge"** - Replays commits without merge commit
5. Confirm the merge
6. Delete the feature branch after successful merge

### Option 2: GitHub CLI (Command Line)

#### Prerequisites
```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Authenticate with GitHub
gh auth login
```

#### Step 1: Push and create PR
```bash
# Push the feature branch
git push origin copy_rag

# Create pull request via CLI
gh pr create \
  --title "Add RAG functionality with PDF upload and chat" \
  --body "Comprehensive RAG implementation with PDF upload, document indexing, and context-aware chat functionality. Includes frontend UI updates, backend API endpoints, and test PDFs for vocabulary learning." \
  --base main \
  --head copy_rag
```

#### Step 2: Review and merge via CLI
```bash
# View the PR
gh pr view

# Merge the PR (choose one option):
# Option A: Merge commit
gh pr merge --merge

# Option B: Squash merge (recommended for feature branches)
gh pr merge --squash

# Option C: Rebase merge
gh pr merge --rebase
```

#### Step 3: Cleanup
```bash
# Delete the feature branch locally
git branch -d copy_rag

# Delete the remote feature branch
git push origin --delete copy_rag
```

## Post-Merge Verification

After merging, verify the deployment works correctly:

1. **Check Vercel Deployment**: Ensure the app redeploys automatically
2. **Test Core Functionality**:
   ```bash
   curl -s https://your-app.vercel.app/api/health
   curl -s https://your-app.vercel.app/api/rag-status/test-user
   ```
3. **Test UI**: 
   - Upload a PDF file
   - Switch to RAG chat mode
   - Ask questions about the PDF content
4. **Verify Persistence**: Check that conversations are maintained

## Rollback Plan (If Issues Occur)

If problems arise after merging:

```bash
# Find the merge commit hash
git log --oneline -10

# Revert the merge commit
git revert -m 1 <merge-commit-hash>

# Push the revert
git push origin main
```

## Notes
- **Serverless Limitation**: RAG indexes stored in `/tmp/` will be lost after ~15 minutes of inactivity
- **API Key Required**: Users must provide their own OpenAI API key for functionality
- **File Size Limits**: PDF uploads are subject to Vercel's request size limits (~4.5MB)
- **Dependencies**: All Python dependencies are properly specified in requirements.txt for Vercel deployment

---
**Created**: September 19, 2025  
**Author**: AI Assistant  
**Branch**: copy_rag → main
