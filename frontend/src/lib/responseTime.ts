/** Formats model response duration for display in the chat UI. */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms} ms`;
  }
  return `${(ms / 1000).toFixed(1)} s`;
}
