"""Composes the full system prompt from guardrails, persona, and creativity."""

from .characters import DEFAULT_CHARACTER, get_character_prompt
from .guardrails import GUARDRAILS

STYLE_BY_LEVEL: list[tuple[int, str]] = [
    (
        25,
        "Response style: focused and concise. Prefer direct, practical guidance over open-ended exploration.",
    ),
    (
        50,
        "Response style: clear and grounded. Balance empathy with actionable guidance.",
    ),
    (
        75,
        "Response style: warm and thoughtful. Explore ideas with care while staying supportive.",
    ),
    (
        90,
        "Response style: expressive. Offer varied perspectives and gently explore different angles.",
    ),
    (
        101,
        "Response style: imaginative and exploratory. Use creative reframes and metaphors while remaining safe and supportive.",
    ),
]


def _creativity_style(creativity: int) -> str:
    clamped = max(0, min(100, creativity))

    for threshold, style in STYLE_BY_LEVEL:
        if clamped < threshold:
            return style

    return STYLE_BY_LEVEL[-1][1]


def build_system_prompt(
    character: str = DEFAULT_CHARACTER,
    creativity: int = 50,
) -> str:
    """Combine safety guardrails, coach persona, and creativity level."""
    persona = get_character_prompt(character)
    style = _creativity_style(creativity)
    return f"{GUARDRAILS}\n\n{persona}\n\n{style}"
