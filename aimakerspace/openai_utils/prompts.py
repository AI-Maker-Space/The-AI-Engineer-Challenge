import re


class BasePrompt:
    def __init__(self, prompt):
        """
        Initializes the BasePrompt object with a prompt template.

        :param prompt: A string that can contain placeholders within curly braces
        """
        self.prompt = prompt
        self._pattern = re.compile(r"\{([^}]+)\}")

    def format_prompt(self, **kwargs):
        """
        Formats the prompt string using the keyword arguments provided.

        :param kwargs: The values to substitute into the prompt string
        :return: The formatted prompt string
        """
        matches = self._pattern.findall(self.prompt)
        return self.prompt.format(**{match: kwargs.get(match, "") for match in matches})

    def get_input_variables(self):
        """
        Gets the list of input variable names from the prompt string.

        :return: List of input variable names
        """
        return self._pattern.findall(self.prompt)


class RolePrompt(BasePrompt):
    def __init__(self, prompt, role: str):
        """
        Initializes the RolePrompt object with a prompt template and a role.

        :param prompt: A string that can contain placeholders within curly braces
        :param role: The role for the message ('system', 'user', or 'assistant')
        """
        super().__init__(prompt)
        self.role = role

    def create_message(self, format=True, **kwargs):
        """
        Creates a message dictionary with a role and a formatted message.

        :param kwargs: The values to substitute into the prompt string
        :return: Dictionary containing the role and the formatted message
        """
        if format:
            return {"role": self.role, "content": self.format_prompt(**kwargs)}
        
        return {"role": self.role, "content": self.prompt}


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
