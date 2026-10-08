// Shared TypeScript types for the backend endpoints and API responses.

export type HttpMethod = "GET" | "POST";

export interface ApiEndpoint {
  id: string;
  path: string;
  method: HttpMethod;
  title: string;
  description: string;
  // Optional static body to send when invoking the endpoint.
  sampleBody?: unknown;
}

export interface ApiCallState {
  loading: boolean;
  error: string | null;
  response: unknown | null;
}


