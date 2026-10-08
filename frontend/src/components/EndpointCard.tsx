import type { ApiEndpoint } from "../types/api";
import { Button } from "./ui/button";

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  onClick: () => void;
}

// Single endpoint card with gradient, hover animation and subtle glassmorphism.
export function EndpointCard({ endpoint, onClick }: EndpointCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-soft-glass backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/80 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-brand-500/35">
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-radial" />
      <div className="relative z-10 flex flex-col h-full">
        <header className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-50">
              {endpoint.title}
            </h3>
            <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
              {endpoint.method} · {endpoint.path}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2 py-1 text-[10px] font-medium text-slate-200 ring-1 ring-slate-600/70">
            Backend Action
          </span>
        </header>
        <p className="mb-4 flex-1 text-xs text-slate-300 leading-relaxed">
          {endpoint.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Click to call this endpoint and preview the response.
          </p>
          <Button size="sm" onClick={onClick}>
            Try it
          </Button>
        </div>
      </div>
    </article>
  );
}


