// src/components/store-initializer.tsx
'use client';

import { useEffect } from 'react';
import { logger } from '@/lib';
import { useChatStore } from '@/store';

/**
 * Initializes the application store and checks user session on app startup.
 *
 * Ensures the store is hydrated and any existing user session is validated before the app renders. This component does not render any UI and should be included at the root of the application.
 */
export function StoreInitializer() {
  const { initializeStore, checkSession, isInitialized } = useChatStore();

  useEffect(() => {
    // Only run initialization once
    if (isInitialized) {
      logger.debug('Store already initialized, skipping', {
        component: 'StoreInitializer',
      });
      return;
    }

    const initialize = async () => {
      logger.info('Starting store initialization', {
        component: 'StoreInitializer',
      });

      // First initialize the store (handles first-time vs returning user)
      initializeStore();

      // Then check for existing session
      await checkSession();

      logger.success('Store initialization complete', {
        component: 'StoreInitializer',
      });
    };

    initialize().catch((error) => {
      logger.error(
        'Store initialization failed',
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'StoreInitializer',
        },
      );
    });
  }, [initializeStore, checkSession, isInitialized]);

  // This component doesn't render anything
  return null;
}

// Add this to your layout.tsx:
/*
import { StoreInitializer } from '@/components/store-initializer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
*/
