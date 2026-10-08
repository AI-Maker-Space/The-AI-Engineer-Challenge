import * as React from "react";

import { cn } from "../../utils/cn";

// Lightweight, shadcn-inspired dialog built without external deps so it
// works out-of-the-box in this template. The API mirrors the typical Dialog
// components you might see in shadcn/ui.

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-xl px-4">{children}</div>
    </div>
  );
}

export function DialogContent({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-surface rounded-3xl p-6 shadow-soft-glass animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-3 flex flex-col gap-1.5", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold tracking-tight text-slate-50",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-sm text-slate-300 leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}

export function DialogBody({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mt-2 text-sm text-slate-100", className)}>
      {children}
    </div>
  );
}


