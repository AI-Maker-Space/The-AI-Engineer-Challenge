import os
import io
import csv
import json
from typing import List, Dict, Any
import pandas as pd
from PIL import Image
import PyPDF2
import magic
import google.generativeai as genai

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI application
app = FastAPI(title="PRD to Test Case Generator API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class TestCase(BaseModel):
    test_case_id: str
    feature: str
    scenario: str
    test_steps: str
    expected_result: str
    priority: str
    category: str

class ProcessResponse(BaseModel):
    success: bool
    message: str
    test_cases: List[TestCase]

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text content from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_image(file_content: bytes, gemini_model) -> str:
    """Extract text content from image using Gemini Vision"""
    try:
        # Open image with PIL
        image = Image.open(io.BytesIO(file_content))
        
        # Use Gemini to extract text from image
        prompt = """
        Please extract all text content from this image. This appears to be a Product Requirements Document (PRD).
        Return only the extracted text content, maintaining the structure and formatting as much as possible.
        """
        
        response = gemini_model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

def generate_test_cases(prd_content: str, gemini_model) -> List[TestCase]:
    """Generate test cases from PRD content using Gemini AI"""
    try:
        prompt = f"""
        You are a senior QA engineer. Based on the following Product Requirements Document (PRD), generate comprehensive test cases.

        PRD Content:
        {prd_content}

        Please generate test cases covering:
        1. Functional testing scenarios
        2. UI/UX testing scenarios  
        3. Edge cases and error handling
        4. Performance considerations
        5. Security testing scenarios
        6. Integration testing scenarios

        For each test case, provide:
        - test_case_id: A unique identifier (TC001, TC002, etc.)
        - feature: The feature being tested
        - scenario: Brief description of the test scenario
        - test_steps: Detailed step-by-step instructions
        - expected_result: What should happen when the test is executed
        - priority: High, Medium, or Low
        - category: Functional, UI/UX, Performance, Security, Integration, or Edge Case

        Return the response as a JSON array with exactly this structure:
        [
            {{
                "test_case_id": "TC001",
                "feature": "Feature name",
                "scenario": "Test scenario description",
                "test_steps": "1. Step one\\n2. Step two\\n3. Step three",
                "expected_result": "Expected outcome",
                "priority": "High",
                "category": "Functional"
            }}
        ]

        Generate at least 10-15 comprehensive test cases. Ensure the JSON is valid and properly formatted.
        """
        
        response = gemini_model.generate_content(prompt)
        
        # Parse the JSON response
        try:
            # Clean the response text
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            test_cases_data = json.loads(response_text)
            
            # Convert to TestCase objects
            test_cases = [TestCase(**case) for case in test_cases_data]
            return test_cases
            
        except json.JSONDecodeError as e:
            # Fallback: try to extract JSON from the response
            import re
            json_match = re.search(r'\[.*\]', response.text, re.DOTALL)
            if json_match:
                try:
                    test_cases_data = json.loads(json_match.group(0))
                    test_cases = [TestCase(**case) for case in test_cases_data]
                    return test_cases
                except:
                    pass
            
            raise HTTPException(status_code=500, detail=f"Error parsing AI response: {str(e)}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating test cases: {str(e)}")

@app.post("/api/upload-prd", response_model=ProcessResponse)
async def upload_prd(
    file: UploadFile = File(...),
    gemini_api_key: str = Form(...)
):
    """Upload PRD file and generate test cases"""
    
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file type. Please upload PDF, JPEG, JPG, or PNG files."
        )
    
    try:
        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Read file content
        file_content = await file.read()
        
        # Extract text based on file type
        if file.content_type == 'application/pdf':
            prd_text = extract_text_from_pdf(file_content)
        else:  # Image files
            prd_text = extract_text_from_image(file_content, model)
        
        if not prd_text.strip():
            raise HTTPException(status_code=400, detail="No text content found in the uploaded file")
        
        # Generate test cases
        test_cases = generate_test_cases(prd_text, model)
        
        return ProcessResponse(
            success=True,
            message=f"Successfully generated {len(test_cases)} test cases",
            test_cases=test_cases
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/download-csv")
async def download_csv(test_cases: List[TestCase]):
    """Download test cases as CSV file"""
    try:
        # Convert test cases to DataFrame
        df_data = []
        for tc in test_cases:
            df_data.append({
                'Test Case ID': tc.test_case_id,
                'Feature': tc.feature,
                'Scenario': tc.scenario,
                'Test Steps': tc.test_steps,
                'Expected Result': tc.expected_result,
                'Priority': tc.priority,
                'Category': tc.category
            })
        
        df = pd.DataFrame(df_data)
        
        # Create CSV content
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_content = csv_buffer.getvalue()
        
        # Return as streaming response
        return StreamingResponse(
            io.StringIO(csv_content),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=test_cases.csv"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating CSV: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "PRD to Test Case Generator"}

# Entry point for running the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
