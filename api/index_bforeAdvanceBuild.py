"""
This file defines the backend web API for the app.
It uses the FastAPI framework to expose a simple HTTP interface
that the frontend (web page) can call to talk to an AI model.
"""

# Import required FastAPI components.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic BaseModel for data validation.
from pydantic import BaseModel
# Import OpenAI client for talking to the AI model.
from openai import OpenAI
# Import os for environment variables.
import os
# Import dotenv for loading environment variables from a .env file.
from dotenv import load_dotenv

load_dotenv()

# Create a FastAPI app.
app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Create an OpenAI client.
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define a Pydantic model for the chat request.
class ChatRequest(BaseModel):
    # The message the user sent.
    message: str

# Define a root endpoint.
@app.get("/")
# Return a simple JSON object.
def root():
    return {"status": "ok"}

# Define a chat endpoint.
@app.post("/api/chat")
# The request body is a ChatRequest object.
def chat(request: ChatRequest):
    # If the OpenAI API key is not set, raise an HTTP exception.
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        # Get the user's message from the request body.
        user_message = request.message
        # Ask the OpenAI chat completion API to generate a response.
        response = client.chat.completions.create(
            model="gpt-5-nano",
            messages=[
                {"role": "system", "content": "You are a supportive mental coach."},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
