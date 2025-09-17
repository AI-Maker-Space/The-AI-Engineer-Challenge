import re
from typing import Any, Dict, List


class BasePrompt:
    """Simple string template helper used to format prompt text."""

    def __init__(self, prompt: str):
        self.prompt = prompt
        self._pattern = re.compile(r"\{([^}]+)\}")

    def format_prompt(self, **kwargs: Any) -> str:
        """Return the prompt with ``kwargs`` substituted for placeholders."""

        matches = self._pattern.findall(self.prompt)
        replacements = {match: kwargs.get(match, "") for match in matches}
        return self.prompt.format(**replacements)

    def get_input_variables(self) -> List[str]:
        """Return the placeholder names used by this prompt."""

        return self._pattern.findall(self.prompt)


class RolePrompt(BasePrompt):
    """Prompt template that also captures an accompanying chat role."""

    def __init__(self, prompt: str, role: str):
        super().__init__(prompt)
        self.role = role

    def create_message(self, apply_format: bool = True, **kwargs: Any) -> Dict[str, str]:
        """Build an OpenAI chat message dictionary for this prompt."""

        content = self.format_prompt(**kwargs) if apply_format else self.prompt
        return {"role": self.role, "content": content}


class SystemRolePrompt(RolePrompt):
    def __init__(self, prompt: str):
        super().__init__(prompt, "system")


class UserRolePrompt(RolePrompt):
    def __init__(self, prompt: str):
        super().__init__(prompt, "user")


class AssistantRolePrompt(RolePrompt):
    def __init__(self, prompt: str):
        super().__init__(prompt, "assistant")


if __name__ == "__main__":
    prompt = BasePrompt("Hello {name}, you are {age} years old")
    print(prompt.format_prompt(name="John", age=30))

    prompt = SystemRolePrompt("Hello {name}, you are {age} years old")
    print(prompt.create_message(name="John", age=30))
    print(prompt.get_input_variables())
