from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
import random
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

def mock_coach_reply(user_message: str) -> str:
    """Return a friendly coaching response without calling external APIs."""
    starter_lines = [
        "You are doing better than you think.",
        "Progress beats perfection every time.",
        "Small steps done consistently create big results."
    ]
    action_lines = [
        "Pick one tiny next step you can finish in 10 minutes.",
        "Take one slow breath, then tackle the easiest part first.",
        "Write down one clear goal for the next hour and focus only on that."
    ]
    return (
        f"{random.choice(starter_lines)} "
        f"{random.choice(action_lines)} "
        f"You said: \"{user_message}\""
    )

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    mock_mode_enabled = os.getenv("MOCK_MODE", "true").lower() in {"1", "true", "yes"}

    if mock_mode_enabled:
        return {"reply": mock_coach_reply(request.message)}

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY not configured. Set MOCK_MODE=true for no-cost mode."
        )

    try:
        user_message = request.message
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a supportive mental coach."},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
