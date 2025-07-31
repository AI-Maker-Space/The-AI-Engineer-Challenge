import os
import io
import csv
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import pandas as pd
from PIL import Image
import PyPDF2
import magic
import google.generativeai as genai

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
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

# Built-in API key for free tier (set via environment variable)
BUILT_IN_GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")

# Rate limiting configuration
FREE_TIER_DAILY_LIMIT = 5  # 5 free uses per day
usage_tracker = {}  # In production, use Redis or database

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
    usage_info: Dict[str, Any]

def get_client_identifier(request: Request) -> str:
    """Get a unique identifier for rate limiting (IP + User Agent)"""
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "")
    return f"{client_ip}_{hash(user_agent)}"

def check_free_tier_usage(client_id: str) -> Dict[str, Any]:
    """Check and update free tier usage"""
    today = datetime.now().date().isoformat()
    
    if client_id not in usage_tracker:
        usage_tracker[client_id] = {}
    
    if today not in usage_tracker[client_id]:
        usage_tracker[client_id][today] = 0
    
    current_usage = usage_tracker[client_id][today]
    remaining = max(0, FREE_TIER_DAILY_LIMIT - current_usage)
    
    return {
        "tier": "free",
        "daily_limit": FREE_TIER_DAILY_LIMIT,
        "used_today": current_usage,
        "remaining_today": remaining,
        "can_use": remaining > 0
    }

def increment_free_tier_usage(client_id: str):
    """Increment free tier usage counter"""
    today = datetime.now().date().isoformat()
    
    if client_id not in usage_tracker:
        usage_tracker[client_id] = {}
    
    if today not in usage_tracker[client_id]:
        usage_tracker[client_id][today] = 0
    
    usage_tracker[client_id][today] += 1

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
    request: Request,
    file: UploadFile = File(...),
    user_api_key: Optional[str] = Form(None)
):
    """Upload PRD file and generate test cases with hybrid API key approach"""
    
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file type. Please upload PDF, JPEG, JPG, or PNG files."
        )
    
    # Determine which API key to use and check usage
    client_id = get_client_identifier(request)
    usage_info = {}
    
    if user_api_key and user_api_key.strip():
        # User provided their own API key - unlimited usage
        api_key_to_use = user_api_key.strip()
        usage_info = {
            "tier": "unlimited",
            "using_own_key": True,
            "message": "Using your personal API key - unlimited usage"
        }
    else:
        # Use built-in API key with rate limiting
        if not BUILT_IN_GEMINI_KEY:
            raise HTTPException(
                status_code=503, 
                detail="Free tier temporarily unavailable. Please provide your own Gemini API key."
            )
        
        usage_info = check_free_tier_usage(client_id)
        
        if not usage_info["can_use"]:
            raise HTTPException(
                status_code=429,
                detail=f"Daily free limit ({FREE_TIER_DAILY_LIMIT} uses) reached. Please provide your own Gemini API key for unlimited usage or try again tomorrow."
            )
        
        api_key_to_use = BUILT_IN_GEMINI_KEY
        usage_info["using_own_key"] = False
        usage_info["message"] = f"Using free tier - {usage_info['remaining_today']} uses remaining today"

    try:
        # Configure Gemini with the chosen API key
        genai.configure(api_key=api_key_to_use)
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
        
        # Update usage tracking for free tier
        if not (user_api_key and user_api_key.strip()):
            increment_free_tier_usage(client_id)
            # Refresh usage info after incrementing
            usage_info = check_free_tier_usage(client_id)
            usage_info["using_own_key"] = False
            usage_info["message"] = f"✅ Used free tier - {usage_info['remaining_today']} uses remaining today"
        
        return ProcessResponse(
            success=True,
            message=f"Successfully generated {len(test_cases)} test cases",
            test_cases=test_cases,
            usage_info=usage_info
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/api/usage-info")
async def get_usage_info(request: Request):
    """Get current usage information for the client"""
    client_id = get_client_identifier(request)
    usage_info = check_free_tier_usage(client_id)
    
    return {
        "has_built_in_key": bool(BUILT_IN_GEMINI_KEY),
        "free_tier_available": bool(BUILT_IN_GEMINI_KEY),
        **usage_info
    }

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
    return {
        "status": "ok", 
        "service": "PRD to Test Case Generator",
        "free_tier_available": bool(BUILT_IN_GEMINI_KEY),
        "daily_free_limit": FREE_TIER_DAILY_LIMIT
    }

# Entry point for running the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
