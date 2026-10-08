"""
This file defines the backend web API for the app.
It uses the FastAPI framework to expose a simple HTTP interface
that the frontend (web page) can call to talk to an AI model.
"""

# Import required for FastAPI components.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
# Import Pydantic BaseModel for data validation.
from pydantic import BaseModel
# Import OpenAI client for talking to the AI model.
from openai import OpenAI
# Import os for environment variables.
import os
# Import dotenv for loading environment variables from a .env file.
from dotenv import load_dotenv
# JSON is used to format the data we send to the frontend in a readable way.
import json

load_dotenv()

# Create a FastAPI app.
app = FastAPI(title="Mental Health Coach", description="A chatbot that helps you with your mental health")

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Create an OpenAI client.
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt that defines the AI's role and behavior.
system_prompt = """You are a supportive mental health coach.

Your sole purpose is to answer questions about mental health. 
You may answer users if they are asking about Stress management, anxiety, mood, motivation, interpersonal wellbeing, Mindset and Habit formation related to mental health.

You are not a therapist, counselor, or medical professional, and you must not diagnose, treat, or provide clinical advice.
If a user asks about topics outside this scope, reply with below message:
"I'm sorry, I'm here to support questions related to mental health, emotional well-being, and coping strategies. I may not be able to help with this topic, but if you`d like to talk about stress, feelings, relationships, or mental health concerns, I'm happy to help."

When answering questions related to mental health, keep your responses concise, focused and brief."""

# Define a Pydantic model for the chat request.
class ChatRequest(BaseModel):
    # The message the user sent.
    message: str

# Define a root health check endpoint.
@app.get("/")
# Return a simple JSON object.
def root():
    return {"status": "ok"}

# Define a chat endpoint with streaming support.
@app.post("/api/chat")
# The request body is a ChatRequest object.
async def chat(request: ChatRequest):
    # If the OpenAI API key is not set, raise an HTTP exception.
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    # This async function generates the AI response piece by piece (streaming).
    # Using "async def" makes it an async generator that can handle async operations.
    async def generate():
        try:
            # Get the user's message from the request body.
            user_message = request.message
            # Ask the OpenAI chat completion API to generate a streaming response.
            stream = client.chat.completions.create(
                model="gpt-5-nano",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                stream=True  # This enables streaming - data comes in small pieces
            )
            
            # Loop through each piece (chunk) of text as OpenAI generates it.
            # A "chunk" is like a small piece of the complete message.
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    # Send each chunk as JSON.
                    chunk_data = json.dumps({"chunk": chunk.choices[0].delta.content})
                    # Send this piece to the frontend immediately using "yield".
                    # The "await" happens implicitly between yields, allowing other async operations.
                    yield f"data: {chunk_data}\n\n"
            
            # Once all pieces have been sent, tell the frontend we're done.
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": f"Error calling OpenAI API: {str(e)}"})
            yield f"data: {error_data}\n\n"
    
    # Return the streaming response
    return StreamingResponse(generate(), media_type="text/event-stream")
