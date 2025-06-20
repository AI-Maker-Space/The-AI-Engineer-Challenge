import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ChatShellProps {
  children: ReactNode;
  className?: string;
  /**
   * Whether to apply maximum width constraint
   * @default true
   */
  maxWidth?: boolean;
}

/****
 * Renders a static chat container with glassmorphism styling using the Card design system.
 *
 * Acts as a flexible, responsive shell for chat content, applying an optional maximum width and custom classes.
 * Does not handle animations or expansion logic; intended for use as a presentational wrapper.
 *
 * @param children - The content to display inside the chat shell.
 * @param className - Additional CSS classes to apply to the container.
 * @param maxWidth - If true, constrains the container to a maximum width.
 */
export function ChatShell({ children, className, maxWidth = true }: ChatShellProps) {
  return (
    <Card className={cn('flex h-full w-full flex-col', maxWidth && 'max-w-4xl', className)}>
      <CardContent className="flex h-full flex-col p-4 sm:p-8">{children}</CardContent>
    </Card>
  );
}
