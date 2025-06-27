// API client for communicating with the backend and handling errors
export const apiClient = async (developerMessage: string, userMessage: string, apiKey: string) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      developer_message: developerMessage,
      user_message: userMessage,
      api_key: apiKey,
    }),
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  return response.body;
};
