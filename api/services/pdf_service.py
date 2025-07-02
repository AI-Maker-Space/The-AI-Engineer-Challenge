import sys
import os
import uuid
from typing import List, Dict, Any
from datetime import datetime
import tempfile

# Add the aimakerspace library to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'aimakerspace'))

from text_utils import PDFLoader, CharacterTextSplitter
from utils.vector_store import vector_store


class PDFService:
    def __init__(self):
        self.text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    async def process_pdf(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Process uploaded PDF file and add to vector store"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name

            # Load PDF using aimakerspace
            pdf_loader = PDFLoader(temp_file_path)
            documents = pdf_loader.load_documents()

            if not documents:
                raise ValueError("No text could be extracted from the PDF")

            # Split text into chunks
            chunks = self.text_splitter.split_texts(documents)

            # Generate document ID
            document_id = str(uuid.uuid4())

            # Get file size
            file_size = len(file_content)

            # Create metadata
            metadata = {
                "filename": filename,
                "size": file_size,
                "pages": len(documents),  # Assuming one document per page
                "upload_date": datetime.now(),
                "chunks_count": len(chunks)
            }

            # Add to vector store
            vector_store.add_document(document_id, chunks, metadata)

            # Clean up temporary file
            os.unlink(temp_file_path)

            return {
                "success": True,
                "document_id": document_id,
                "metadata": metadata,
                "message": f"PDF '{filename}' processed successfully with {len(chunks)} chunks"
            }

        except Exception as e:
            # Clean up temporary file if it exists
            if 'temp_file_path' in locals():
                try:
                    os.unlink(temp_file_path)
                except:
                    pass

            return {
                "success": False,
                "document_id": None,
                "metadata": None,
                "message": f"Error processing PDF: {str(e)}"
            }

    def get_document(self, document_id: str) -> Dict[str, Any]:
        """Get document metadata"""
        metadata = vector_store.get_document_metadata(document_id)
        if not metadata:
            return None

        return {
            "id": document_id,
            "filename": metadata.get("filename"),
            "size": metadata.get("size"),
            "pages": metadata.get("pages"),
            "upload_date": metadata.get("upload_date"),
            "chunks_count": vector_store.get_document_chunks_count(document_id),
            "status": "ready"
        }

    def list_documents(self) -> List[Dict[str, Any]]:
        """List all documents"""
        documents = []
        for doc_id in vector_store.list_documents():
            doc = self.get_document(doc_id)
            if doc:
                documents.append(doc)
        return documents

    def delete_document(self, document_id: str) -> Dict[str, Any]:
        """Delete document from vector store"""
        try:
            vector_store.remove_document(document_id)
            return {
                "success": True,
                "message": f"Document {document_id} deleted successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error deleting document: {str(e)}"
            }


# Global PDF service instance
pdf_service = PDFService()