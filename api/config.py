"""Server-side limits for OpenAI usage — all configurable via environment variables."""

import os

# Defaults preserve current dev behavior; tighten in production via Vercel env vars.
DEFAULT_OPENAI_MODEL = "gpt-5"
DEFAULT_MAX_TOKENS = 800
DEFAULT_MAX_MESSAGE_CHARS = 2000


def openai_model() -> str:
    """OpenAI model id — never exposed to or controlled by the client."""
    return os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)


def openai_max_tokens() -> int:
    """Cap completion length to limit cost per request."""
    raw = os.getenv("OPENAI_MAX_TOKENS", str(DEFAULT_MAX_TOKENS))
    try:
        value = int(raw)
    except ValueError:
        return DEFAULT_MAX_TOKENS
    return max(1, min(value, 16_384))


def openai_completion_limit_kwargs() -> dict[str, int]:
    """
    Token limit kwargs for chat.completions.create.
    gpt-5+ requires max_completion_tokens; older models accept both.
    """
    limit = openai_max_tokens()
    return {"max_completion_tokens": limit}


def max_message_chars() -> int:
    """Max characters accepted in a user message."""
    raw = os.getenv("OPENAI_MAX_MESSAGE_CHARS", str(DEFAULT_MAX_MESSAGE_CHARS))
    try:
        value = int(raw)
    except ValueError:
        return DEFAULT_MAX_MESSAGE_CHARS
    return max(1, min(value, 32_000))
