# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional, List
from datetime import datetime
import json

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

@app.get("/health")
def health():
    return {"status": "ok"}

# Configure CORS (Cross-Origin Resource Sharing) middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------
class ChatRequest(BaseModel):
    developer_message: str  # system/developer guidance
    user_message: str       # user prompt
    model: Optional[str] = "gpt-4.1-mini"
    api_key: str            # OpenAI API key for authentication

# For the coffee application example (response shape)
class CoffeePlace(BaseModel):
    name: str
    neighborhood: Optional[str] = None
    why: str
    signature_drink: Optional[str] = None
    notes: Optional[str] = None

class CoffeeResponse(BaseModel):
    city: str
    generated_at: str
    results: List[CoffeePlace]
    raw_text: Optional[str] = None  # fallback if JSON parsing fails

# ---------- Streaming chat (keep this exactly as your general chat endpoint) ----------
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        client = OpenAI(api_key=request.api_key)

        async def generate():
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "system", "content": request.developer_message},  # use valid role
                    {"role": "user", "content": request.user_message}
                ],
                stream=True
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# ---------- Coffee application example (non-streaming, returns structured JSON) ----------
@app.post("/api/coffee", response_model=CoffeeResponse)
async def coffee_recommendations(
    city: str = Body(..., embed=True),
    api_key: str = Body(...),
    model: str = Body("gpt-4.1-mini")
):
    """
    Application Example: Recommend top coffee places for a city (e.g., 'San Diego').
    Returns structured JSON; if parsing fails, returns raw_text with the model’s answer.
    """
    try:
        client = OpenAI(api_key=api_key)

        system_prompt = (
            "You are a coffee expert. Return ONLY JSON (no markdown). "
            "Schema: [{\"name\":\"...\",\"neighborhood\":\"...\",\"why\":\"...\"," 
            "\"signature_drink\":\"...\",\"notes\":\"...\"}] "
            "Provide 5–7 entries. Keep 'why' short and practical."
        )
        user_prompt = f"Best coffee places in {city}. Include well-known local favorites."

        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        content = completion.choices[0].message.content.strip()

        try:
            data = json.loads(content)
            places = [CoffeePlace(**item) for item in data]
            return CoffeeResponse(
                city=city,
                generated_at=datetime.utcnow().isoformat() + "Z",
                results=places
            )
        except Exception:
            return CoffeeResponse(
                city=city,
                generated_at=datetime.utcnow().isoformat() + "Z",
                results=[],
                raw_text=content
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
