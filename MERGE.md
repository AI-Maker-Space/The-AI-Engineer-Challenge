# Merge Instructions: PDF RAG System Feature

This document provides instructions for merging the `feature/pdf-rag-system` branch back to `main`.

## 🚀 Feature Overview

The PDF RAG System adds the following capabilities to the chat application:

- **PDF Upload**: Drag-and-drop or file picker for uploading PDF documents
- **Document Indexing**: Automatic text extraction and vector embedding using the `aimakerspace` library
- **RAG Chat**: Context-aware conversations with uploaded PDF content
- **Document Management**: View, select, and delete uploaded documents
- **Dual Chat Modes**: Switch between regular chat and RAG chat modes

## 📋 Pre-Merge Checklist

Before merging, ensure the following:

- [ ] All tests pass (if applicable)
- [ ] Backend API is running and accessible
- [ ] Frontend builds successfully
- [ ] Dependencies are properly installed
- [ ] Environment variables are configured

## 🔧 Dependencies Added

### Backend (api/requirements.txt)
- `PyPDF2==3.0.1` - PDF processing
- `python-dotenv==1.0.0` - Environment variable management
- `numpy==1.24.3` - Numerical operations for vector database

### Frontend
- No new dependencies added (uses existing React/Next.js setup)

## 🌐 New API Endpoints

The following new endpoints have been added to the FastAPI backend:

- `POST /api/upload-pdf` - Upload and process PDF files
- `GET /api/documents` - List all uploaded documents
- `DELETE /api/documents/{document_id}` - Delete a specific document
- `POST /api/chat-with-pdf` - RAG chat with document context

## 🗂️ New File Structure

```
api/
├── models/
│   ├── document.py (Document schemas)
│   └── chat.py (Chat request/response models)
├── services/
│   ├── pdf_service.py (PDF processing)
│   └── rag_service.py (RAG implementation)
└── utils/
    └── vector_store.py (Vector database wrapper)

frontend/src/
├── components/
│   ├── FileUpload.tsx (PDF upload component)
│   └── DocumentList.tsx (Document management)
├── hooks/
│   └── useRagChat.ts (RAG chat logic)
└── types/
    └── document.ts (Document types)
```

## 🔄 Merge Options

### Option 1: GitHub Pull Request (Recommended)

1. **Push the feature branch**:
   ```bash
   git push origin feature/pdf-rag-system
   ```

2. **Create a Pull Request**:
   - Go to the GitHub repository
   - Click "Compare & pull request" for the `feature/pdf-rag-system` branch
   - Add a descriptive title: "Add PDF upload, indexing, and RAG chat functionality"
   - Add detailed description of the changes
   - Request review if needed
   - Merge the PR

3. **Clean up**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/pdf-rag-system
   git push origin --delete feature/pdf-rag-system
   ```

### Option 2: GitHub CLI

1. **Create and merge PR using GitHub CLI**:
   ```bash
   # Create pull request
   gh pr create --title "Add PDF upload, indexing, and RAG chat functionality" \
                --body "This PR adds comprehensive PDF processing and RAG chat capabilities to the application.

   ## Changes
   - PDF upload with drag-and-drop interface
   - Document indexing using aimakerspace library
   - RAG chat system with context retrieval
   - Document management interface
   - Dual chat modes (regular and RAG)

   ## Testing
   - [x] PDF upload functionality
   - [x] Document indexing and vector storage
   - [x] RAG chat responses
   - [x] Document management (list, select, delete)
   - [x] UI/UX integration"

   # Merge the PR (if auto-merge is enabled)
   gh pr merge --auto

   # Or merge manually after review
   gh pr merge --squash
   ```

2. **Clean up**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/pdf-rag-system
   git push origin --delete feature/pdf-rag-system
   ```

## 🧪 Post-Merge Testing

After merging, test the following functionality:

1. **PDF Upload**:
   - Upload a PDF file via drag-and-drop
   - Verify processing completes successfully
   - Check document appears in sidebar

2. **RAG Chat**:
   - Select an uploaded document
   - Ask questions about the document content
   - Verify responses are contextually relevant

3. **Document Management**:
   - List uploaded documents
   - Switch between different documents
   - Delete documents

4. **Regular Chat**:
   - Ensure regular chat still works without document selection
   - Verify mode switching works correctly

## 🐛 Troubleshooting

### Common Issues

1. **PDF Processing Fails**:
   - Check if PyPDF2 is installed: `pip install PyPDF2`
   - Verify PDF file is not corrupted
   - Check file size limits (10MB max)

2. **Vector Database Errors**:
   - Ensure numpy is installed: `pip install numpy`
   - Check OpenAI API key is valid
   - Verify aimakerspace library path

3. **Frontend Build Issues**:
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `npm install`
   - Check TypeScript compilation

### Environment Variables

Ensure these environment variables are set:

```bash
# Backend
OPENAI_API_KEY=your_openai_api_key

# Frontend (optional)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Release Notes

### Version: 2.0.0
- ✨ **New**: PDF upload and processing
- ✨ **New**: RAG chat with document context
- ✨ **New**: Document management interface
- ✨ **New**: Dual chat modes (regular and RAG)
- 🔧 **Updated**: Enhanced sidebar with document controls
- 🔧 **Updated**: Improved chat interface with mode indicators

---

**Note**: This feature significantly enhances the application's capabilities by adding document-based AI interactions while maintaining backward compatibility with the existing chat functionality.