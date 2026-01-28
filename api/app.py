# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import boto3 for AWS Bedrock
import boto3
import json
import os
from typing import Optional

# Initialize FastAPI application with a title
app = FastAPI(title="AWS Bedrock Anthropic Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # System message for the AI
    user_message: str      # Message from the user
    model: Optional[str] = "us.anthropic.claude-3-5-sonnet-20241022-v2:0"  # Default Anthropic model
    aws_region: Optional[str] = "us-east-1"  # AWS region for Bedrock

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize Bedrock runtime client
        # Uses AWS credentials from environment or IAM role
        bedrock_runtime = boto3.client(
            service_name="bedrock-runtime",
            region_name=request.aws_region
        )

        # Create an async generator function for streaming responses
        async def generate():
            # Prepare the request body for Anthropic Claude via Bedrock
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 4096,
                "system": request.developer_message,
                "messages": [
                    {"role": "user", "content": request.user_message}
                ]
            })

            # Invoke model with streaming
            response = bedrock_runtime.invoke_model_with_response_stream(
                modelId=request.model,
                contentType="application/json",
                accept="application/json",
                body=body
            )

            # Process the streaming response
            for event in response.get("body"):
                chunk = json.loads(event["chunk"]["bytes"])
                if chunk["type"] == "content_block_delta":
                    if "delta" in chunk and "text" in chunk["delta"]:
                        yield chunk["delta"]["text"]

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
