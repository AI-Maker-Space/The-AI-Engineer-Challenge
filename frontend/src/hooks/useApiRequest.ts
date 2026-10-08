import { useState, useCallback } from "react";
import type { ApiEndpoint, ApiCallState } from "../types/api";
import { callEndpoint } from "../lib/apiClient";

// Reusable hook that encapsulates API loading / error / response state.
export function useApiRequest(endpoint: ApiEndpoint | null) {
  const [state, setState] = useState<ApiCallState>({
    loading: false,
    error: null,
    response: null
  });

  const execute = useCallback(async () => {
    if (!endpoint) return;
    setState({ loading: true, error: null, response: null });
    const next = await callEndpoint(endpoint);
    setState(next);
  }, [endpoint]);

  return {
    ...state,
    execute
  };
}


