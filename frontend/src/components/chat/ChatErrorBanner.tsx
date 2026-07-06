interface ChatErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ChatErrorBanner({ message, onDismiss }: ChatErrorBannerProps) {
  return (
    <div
      role="alert"
      className="mx-4 mb-2 flex items-start gap-3 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
    >
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        ⚠️
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">Couldn&apos;t get a reply</p>
        <p className="mt-1 text-error/90">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-error/80 transition-colors hover:bg-error/10 hover:text-error"
        aria-label="Dismiss error"
      >
        Dismiss
      </button>
    </div>
  );
}
