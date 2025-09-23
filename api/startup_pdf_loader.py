"""
PDF Auto-loader for Kids Science Tutor
Automatically uploads all Grade-3 PDFs to RAG system during server startup
"""

import os
import json
from pathlib import Path
from typing import Dict, List
import PyPDF2
import io

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text content from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""

def load_pdf_metadata() -> Dict:
    """Load PDF metadata from the generated files"""
    metadata_path = Path("../public/pdfs/grade3/metadata.json")
    
    if not metadata_path.exists():
        print(f"Warning: Metadata file not found at {metadata_path}")
        return {}
    
    try:
        with open(metadata_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading metadata: {e}")
        return {}

def get_all_grade3_pdfs() -> List[Dict]:
    """Get all Grade-3 PDFs with their metadata"""
    pdf_dir = Path("../public/pdfs/grade3")
    metadata = load_pdf_metadata()
    
    pdfs = []
    
    if not pdf_dir.exists():
        print(f"Warning: PDF directory not found at {pdf_dir}")
        return pdfs
    
    # Find all PDF files
    for pdf_file in pdf_dir.glob("*.pdf"):
        filename = pdf_file.name
        
        # Get metadata for this file
        file_metadata = metadata.get("files", {}).get(filename, {})
        
        pdf_info = {
            "filename": filename,
            "filepath": str(pdf_file),
            "topic": file_metadata.get("topic", "Unknown"),
            "subtopic": file_metadata.get("subtopic", ""),
            "grade": "Grade-3",
            "source": "system-uploaded",
            "created_by": file_metadata.get("model", "System"),
            "sources": file_metadata.get("sources", [])
        }
        
        pdfs.append(pdf_info)
    
    return pdfs

async def upload_pdfs_to_rag(rag_system, pdfs: List[Dict]) -> int:
    """Upload all PDFs to the RAG system"""
    uploaded_count = 0
    
    for pdf_info in pdfs:
        try:
            # Extract text from PDF
            text_content = extract_text_from_pdf(pdf_info["filepath"])
            
            if not text_content:
                print(f"Skipping {pdf_info['filename']} - no text extracted")
                continue
            
            # Add document to RAG with metadata
            document_metadata = {
                "filename": pdf_info["filename"],
                "topic": pdf_info["topic"],
                "subtopic": pdf_info["subtopic"],
                "grade": pdf_info["grade"],
                "source": pdf_info["source"],
                "created_by": pdf_info["created_by"],
                "sources": pdf_info["sources"]
            }
            
            # Add to RAG system
            rag_system.add_document(
                text=text_content,
                metadata=document_metadata
            )
            
            uploaded_count += 1
            print(f"✅ Uploaded: {pdf_info['filename']} ({pdf_info['topic']})")
            
        except Exception as e:
            print(f"❌ Error uploading {pdf_info['filename']}: {e}")
    
    return uploaded_count

async def initialize_pdf_rag_system(rag_system):
    """Initialize RAG system with all Grade-3 PDFs"""
    print("🚀 Starting PDF auto-upload to RAG system...")
    
    # Get all Grade-3 PDFs
    pdfs = get_all_grade3_pdfs()
    print(f"📚 Found {len(pdfs)} Grade-3 PDFs to upload")
    
    if not pdfs:
        print("⚠️  No PDFs found - check if PDF generation script was run")
        return False
    
    # Upload to RAG
    uploaded_count = await upload_pdfs_to_rag(rag_system, pdfs)
    
    print(f"✅ PDF auto-upload complete: {uploaded_count}/{len(pdfs)} files uploaded")
    print("🎯 RAG system ready for Kids Science Tutor!")
    
    return uploaded_count > 0
