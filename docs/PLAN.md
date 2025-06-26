# Implementation Plan: ChattyCat Frontend Web Application

## Overview

Build a modern, accessible, single-page chatbot web application called **ChattyCat** using Next.js and TailwindCSS. The app will feature a cute cartoon logo, light/dark theme toggle, and two main tabs: Configuration and Chat. The frontend will communicate with the backend service in the `api` directory.

---

## 1. Project Setup

- [ ] Initialize a new Next.js project in the `frontend` directory.
- [ ] Set up TailwindCSS for styling.
- [ ] Configure TypeScript for type safety.
- [ ] Add favicon and web manifest for web icon support.

## 2. Branding & Design

- [ ] Generate and add a simple SVG cartoon cat logo for the header and web icon.
- [ ] Create a modern, responsive layout with TailwindCSS.
- [ ] Implement a light/dark theme toggle (accessible via button or switch).
- [ ] Ensure all UI components meet WCAG 2.2 accessibility standards (color contrast, keyboard navigation, ARIA labels, etc.).

## 3. Application Structure

- [ ] Use a single-page layout with a header, sidebar and main content area.
- [ ] The sidebar contains configuration input

## 4. Configuration Sidebar

- [ ] Add a password input for the user to paste their OpenAI API key (masked input, not stored persistently).
- [ ] Add a textarea for the user to update the system prompt (developer message).
- [ ] Pre-populate the system prompt with a good generic prompt by default.
- [ ] Validate inputs and provide accessible error messages if needed.

## 5. Chat Area

- [ ] Add a textarea for the user to type their question/message.
- [ ] Add a "Send" button to submit the input.
- [ ] Display chat history in a conversational format (user and assistant messages, styled with avatars or icons).
- [ ] Store chat history in local/session storage (never the API key).
- [ ] Show loading indicators and update the chat UI as streaming responses are received from the backend.
- [ ] Ensure keyboard accessibility for all controls.

## 6. API Integration

- [ ] Connect the frontend to the backend FastAPI service in the `api` directory.
- [ ] Use the `/api/chat` endpoint directly for chat functionality (POST requests with API key, system prompt, and user message).
- [ ] Handle streaming responses and errors gracefully, updating the chat UI in real time.

## 7. Accessibility & Testing

- [ ] Audit the UI for WCAG 2.2 compliance (color contrast, focus states, ARIA roles, etc.).
- [ ] Test keyboard navigation and screen reader compatibility.
- [ ] Add unit and integration tests for key components and API calls using **Vitest** and **React Testing Library** (`@testing-library/react`).
- [ ] Use `@testing-library/jest-dom` for custom matchers in assertions.

## 8. Documentation

- [ ] Update `frontend/README.md` with setup, run, and usage instructions.
- [ ] Document accessibility features and known limitations.
- [ ] Document changes to requirements in `docs/PLAN.md`

## 9. Deployment (Optional)

- [ ] Prepare the frontend for deployment to Vercel.
- [ ] Ensure environment variables (if any) are handled securely.

---

## Notes

- Do not persist the OpenAI API key in local storage or cookies for security reasons.
- Prioritize performance and security throughout the implementation.
- Use explicit variable and component names for clarity.
- Consider edge cases and error handling for all user inputs and API interactions.
