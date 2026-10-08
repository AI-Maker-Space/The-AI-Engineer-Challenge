import type { ApiEndpoint } from "../types/api";

// Central list of backend endpoints.
// The UI is generated automatically from this configuration.
export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "root",
    path: "/",
    method: "GET",
    title: "API Root Status",
    description: "Ping the root of the FastAPI backend and confirm it is alive."
  },
  {
    id: "chat",
    path: "/api/chat",
    method: "POST",
    title: "Chat with Your Coach",
    description:
      "Send a sample message to the LLM-powered supportive mental coach and see the reply.",
    sampleBody: {
      message: "Hi, I'm testing my first LLM app!"
    }
  }
];


