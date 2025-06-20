import { useEffect, useState, type ReactNode } from 'react';
import { Card, CardHeader } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store';
import { motion } from 'motion/react';

interface ChatLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

/**
 * Provides a responsive chat interface layout with animated expansion and contraction based on chat state.
 *
 * Renders an optional header and main content area, automatically centering content when collapsed and expanding to fill the viewport when a valid API key is present. Animations are triggered on state changes for smooth transitions. The layout is accessible and adapts to mobile and desktop screens.
 *
 * @param children - The main chat content to display within the animated area.
 * @param header - Optional header content rendered above the chat area.
 */
export function ChatLayout({ children, header }: ChatLayoutProps) {
  const { isExpanded, hasValidApiKey, setIsExpanded } = useChatStore();

  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Watch for API key changes to handle expansion with proper animation
  useEffect(() => {
    if (hasValidApiKey !== isExpanded) {
      setShouldAnimate(true);
      setIsExpanded(hasValidApiKey);

      // Reset animation flag after animation completes
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [hasValidApiKey, isExpanded, setIsExpanded]);

  // Get motion animation values
  const getMotionValues = () => {
    return {
      minHeight: isExpanded ? 'calc(100vh - 140px)' : '500px',
      height: isExpanded ? 'calc(100vh - 140px)' : 'auto',
    };
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      {/* Header Section */}
      {header && (
        <Card className={cn('w-full max-w-4xl', isExpanded ? 'mb-4' : 'mb-6')}>
          <CardHeader>{header}</CardHeader>
        </Card>
      )}

      {/* Main Content Area - Conditionally centered based on expansion */}
      <main
        className={cn(
          'flex w-full max-w-4xl flex-1',
          isExpanded ? '' : 'items-center justify-center', // Center only when collapsed
        )}
      >
        <motion.div
          className="w-full"
          initial={false}
          animate={getMotionValues()}
          transition={
            shouldAnimate ? { duration: 0.6, ease: 'easeInOut' } : { duration: 0, ease: 'linear' }
          }
          style={{ width: '100%' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
