import React from "react";

interface ChatErrorProps {
  message: string | null;
}

// Displays a friendly explanation plus the actual error returned by the backend.
export function ChatError({ message }: ChatErrorProps) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-2xl border border-red-300/70 bg-red-50/80 px-4 py-4 text-sm text-red-800 shadow-sm dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-100">
      <p className="font-semibold">
        Just so you know: once the OpenAI quota is used up, the API
        may greet you with an error message instead of actual results.
      </p>
      <p className="mt-2 text-xs text-red-700 dark:text-red-200">
        Error from server or OpenAI API: {message}
      </p>
    </div>
  );
}


