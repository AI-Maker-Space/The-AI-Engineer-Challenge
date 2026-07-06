from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI
from typing import Literal
import os
import time
from dotenv import load_dotenv

from .config import (
    max_message_chars,
    openai_completion_limit_kwargs,
    openai_model,
)
from .errors import MSG_MISSING_KEY, user_message_for_openai_error
from .prompts.characters import DEFAULT_CHARACTER, VALID_CHARACTERS
from .prompts.system import build_system_prompt

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DEFAULT_CREATIVITY = 50

CharacterId = Literal["professional", "warm_friend", "mindful_guide", "motivational_coach"]

class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=max_message_chars(),
        description="User message to the coach.",
    )
    creativity: int = Field(
        default=DEFAULT_CREATIVITY,
        ge=0,
        le=100,
        description="Controls response style from focused (0) to creative (100).",
    )
    character: CharacterId = Field(
        default=DEFAULT_CHARACTER,
        description="Coach persona that shapes tone and coaching style.",
    )

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail=MSG_MISSING_KEY)

    if request.character not in VALID_CHARACTERS:
        raise HTTPException(
            status_code=400,
            detail="That coach style isn't available. Please choose another one.",
        )
    
    try:
        user_message = request.message
        system_prompt = build_system_prompt(
            character=request.character,
            creativity=request.creativity,
        )
        start = time.perf_counter()
        response = client.chat.completions.create(
            model=openai_model(),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            **openai_completion_limit_kwargs(),
        )
        response_time_ms = round((time.perf_counter() - start) * 1000)
        content = response.choices[0].message.content
        if not content:
            raise HTTPException(
                status_code=500,
                detail="The coach couldn't generate a reply. Please try again.",
            )
        return {"reply": content, "response_time_ms": response_time_ms}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        status_code, detail = user_message_for_openai_error(e)
        raise HTTPException(status_code=status_code, detail=detail)

@app.get("/api/health")
def health():
    return {"status": "ok"}