import type * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Renders a customizable multi-line text input element.
 *
 * Accepts all standard `<textarea>` props and supports additional styling via the `className` prop. The component is accessible, supports disabled and invalid states, and applies enhanced focus and text formatting styles for improved usability.
 *
 * @param className - Additional CSS classes to apply to the textarea element
 */
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none',
        // Better multi-line text formatting
        'font-sans leading-relaxed break-words whitespace-pre-wrap',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
