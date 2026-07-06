import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function ChatHeader() {
  return (
    <header className="border-b border-border bg-surface-elevated/80 px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg"
            aria-hidden="true"
          >
            🌿
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Mindful Coach
            </h1>
            <p className="truncate text-sm text-muted sm:whitespace-normal">
              Supportive guidance for stress, habits &amp; confidence
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
