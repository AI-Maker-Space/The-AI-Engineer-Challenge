"""Maps internal failures to safe, user-facing error messages."""

import logging

logger = logging.getLogger(__name__)

# Messages shown to end users — never expose raw provider or stack traces.
MSG_SERVICE_UNAVAILABLE = (
    "The coach is temporarily unavailable. Please try again in a few minutes."
)
MSG_TRY_AGAIN = (
    "Something went wrong while generating a reply. Please try again."
)
MSG_RATE_LIMIT = (
    "We're receiving a lot of messages right now. Please wait a moment and try again."
)
MSG_TIMEOUT = (
    "That took longer than expected. Please try again."
)
MSG_MISSING_KEY = MSG_SERVICE_UNAVAILABLE


def user_message_for_openai_error(error: Exception) -> tuple[int, str]:
    """
    Convert an OpenAI/client exception into an HTTP status and a safe user message.
    Logs the original error for debugging.
    """
    logger.exception("OpenAI chat request failed: %s", error)
    message = str(error).lower()

    if any(
        token in message
        for token in ("rate limit", "rate_limit", "429", "too many requests")
    ):
        return 429, MSG_RATE_LIMIT

    if any(
        token in message
        for token in ("timeout", "timed out", "deadline")
    ):
        return 504, MSG_TIMEOUT

    if any(
        token in message
        for token in ("api key", "authentication", "incorrect api key", "unauthorized")
    ):
        return 503, MSG_SERVICE_UNAVAILABLE

    return 500, MSG_TRY_AGAIN
