from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import APIConnectionError, APIError, AuthenticationError, BadRequestError, RateLimitError

load_dotenv()

from api.provider import ProviderConfigError, get_client

app = FastAPI()

# CORS so the frontend can talk to backend
# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware, # type: ignore[arg-type]
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


class ChatRequest(BaseModel):
    message: str


def get_provider_name() -> str:
    """Return the configured LLM provider, defaulting to OpenAI."""
    return os.getenv("LLM_PROVIDER", "openai").lower().strip()


def raise_llm_http_error(error: Exception, provider: str) -> None:
    """Convert provider/client errors into safe HTTP responses."""

    if isinstance(error, AuthenticationError):
        raise HTTPException(
            status_code=401,
            detail=f"Invalid API key for provider '{provider}'"
        )

    if isinstance(error, RateLimitError):
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded for provider '{provider}'. Please try again later."
        )

    if isinstance(error, BadRequestError):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid request sent to provider '{provider}'"
        )

    if isinstance(error, APIConnectionError):
        raise HTTPException(
            status_code=502,
            detail=f"Could not connect to provider '{provider}'. Please try again later."
        )

    if isinstance(error, APIError):
        raise HTTPException(
            status_code=502,
            detail=f"Provider '{provider}' returned an API error. Please try again later."
        )

    raise HTTPException(
        status_code=500,
        detail="An unexpected server error occurred"
    )


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    provider = get_provider_name()

    try:
        client, model = get_client(provider)

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a supportive mental coach."},
                {"role": "user", "content": request.message}
            ]
        )

        return {"reply": response.choices[0].message.content}

    except ProviderConfigError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    except Exception as error:
        raise_llm_http_error(error, provider)