import * as React from "react";

import { cn } from "../../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

// shadcn-style button component with Tailwind variants applied.
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed ring-offset-slate-950";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default:
        "bg-gradient-to-r from-brand-500 via-sky-500 to-emerald-400 text-slate-950 shadow-soft-glass hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-0.5",
      outline:
        "border border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800/80",
      ghost:
        "bg-transparent text-slate-200 hover:bg-slate-800/70 hover:text-white"
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";


