# --- Provider configuration -------------------------------------------------
# Each provider is reachable through the OpenAI-compatible Chat Completions API.
# We only change base_url / api_key / default model per provider.

import os

from openai import OpenAI

PROVIDERS = {
    "openai": {
        "base_url": None,  # SDK default (https://api.openai.com/v1)
        "api_key_env": "OPENAI_API_KEY",
        "default_model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    },
    "anthropic": {
        # Anthropic exposes an OpenAI-compatible endpoint.
        "base_url": os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com/v1/"),
        "api_key_env": "ANTHROPIC_API_KEY",
        "default_model": os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5"),
    }
}


class ProviderConfigError(Exception):
    """Raised when the selected LLM provider is missing required configuration."""


def get_client(provider: str) -> tuple[OpenAI, str]:
    """Return an OpenAI-compatible client and the configured model for a provider."""

    normalized_provider = provider.lower().strip()
    config = PROVIDERS.get(normalized_provider)

    if config is None:
        valid_providers = ", ".join(PROVIDERS)
        raise ProviderConfigError(
            f"Unknown provider '{provider}'. Choose one of: {valid_providers}"
        )

    api_key_env = config["api_key_env"]
    api_key = os.getenv(api_key_env)

    if not api_key:
        raise ProviderConfigError(
            f"{api_key_env} is not configured for provider '{normalized_provider}'"
        )

    model = config["default_model"]

    if not model:
        raise ProviderConfigError(
            f"No model is configured for provider '{normalized_provider}'"
        )

    client = OpenAI(api_key=api_key, base_url=config["base_url"])

    return client, model