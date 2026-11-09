# Agent Instructions

> This is the single source of truth for AI agent behavior in this repo.
> `CLAUDE.md`, `.github/copilot-instructions.md`, and `.cursor/rules/` all defer to this file.
> Edit this file to change the rules for every agent at once.

## General Rules (always apply)

- You must always commit your changes whenever you update code.
- You must always try and write code that is well-documented (self-documenting or commented is fine).
- You must only work on a single feature at a time.
- You must explain your decisions thoroughly to the user.

## Frontend Rules (when designing a frontend or frontend components)

- You must pay attention to visual clarity and contrast. Do not place white text on a white background.
- You must ensure the UX is pleasant. Boxes should grow to fit their contents, etc.
- When asking the user for sensitive information, you must use password-style text-entry boxes in the UI.
- You should use Next.js as it works best with Vercel.
- This frontend will ultimately be deployed on Vercel, but it should be possible to test locally.
- Always provide users with a way to run the created UI once you have created it.

## README.md Rules (when editing `*.md` files)

- When you create README.md's, they should be dope and use fun and approachable language.
- While being fun, they should remain technically accurate.

## Docs & Context (consult before writing frontend/deploy code)

- When working with Next.js, consult the official LLM-friendly docs index at `https://nextjs.org/docs/llms.txt`.
- When working with Vercel (deployment, config, routing), consult the official LLM-friendly docs index at `https://vercel.com/docs/llms.txt`.
- Prefer these sources over memory for version-specific APIs, config, and best practices.