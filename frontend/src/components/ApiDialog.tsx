import React, { useEffect } from "react";
import type { ApiEndpoint } from "../types/api";
import { useApiRequest } from "../hooks/useApiRequest";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ApiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: ApiEndpoint | null;
}

// Modal dialog that shows loading, error and response states for an endpoint.
export function ApiDialog({ open, onOpenChange, endpoint }: ApiDialogProps) {
  const { loading, error, response, execute } = useApiRequest(endpoint);

  // Trigger request when dialog opens for the selected endpoint.
  useEffect(() => {
    if (open && endpoint) {
      void execute();
    }
  }, [open, endpoint, execute]);

  if (!endpoint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{endpoint.title}</DialogTitle>
          <DialogDescription>
            We&apos;ll call{" "}
            <span className="font-mono text-xs text-emerald-300">
              {endpoint.method} {endpoint.path}
            </span>{" "}
            against your FastAPI backend and stream the result here.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3">
              <span className="h-3 w-3 animate-ping rounded-full bg-sky-400" />
              <p className="text-sm text-slate-200">
                Talking to your LLM-powered backend&hellip;
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/60 bg-red-950/60 px-4 py-3 text-sm text-red-100">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 text-xs text-red-200">{error}</p>
            </div>
          )}

          {!loading && !error && response && (
            <pre className="mt-1 max-h-72 overflow-auto rounded-2xl border border-slate-700/70 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-100">
              {JSON.stringify(response, null, 2)}
            </pre>
          )}

          {!loading && !error && !response && (
            <p className="text-sm text-slate-300">
              Click <span className="font-semibold">Run again</span> to call
              this endpoint.
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                void execute();
              }}
            >
              Run again
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}


