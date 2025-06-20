import { cn } from '@/lib/utils';

/**
 * Renders a placeholder skeleton element for loading states.
 *
 * Combines default skeleton styling with any additional classes provided via `className`. All other standard `div` props are supported. The `data-slot="skeleton"` attribute is included for targeting or accessibility purposes.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
