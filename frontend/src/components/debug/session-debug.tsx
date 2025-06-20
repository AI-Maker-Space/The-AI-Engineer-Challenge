'use client';

import { useEffect, useState } from 'react';
import { logger } from '@/lib';
import { useChatStore } from '@/store';

interface SessionInfo {
  [key: string]: string;
}

interface LocalStorageData {
  state?: {
    selectedModel?: string;
    messages?: unknown[];
    isExpanded?: boolean;
    showTimestamps?: boolean;
    hasSeenWelcomeAnimation?: boolean;
    hasCompletedInitialSetup?: boolean;
    lastSuccessfulKeyType?: string | null;
  };
  version?: number;
}

// Alternative: Direct Zustand persist structure
interface ZustandPersistedData {
  selectedModel?: string;
  messages?: unknown[];
  isExpanded?: boolean;
  showTimestamps?: boolean;
  hasSeenWelcomeAnimation?: boolean;
  hasCompletedInitialSetup?: boolean;
  lastSuccessfulKeyType?: string | null;
  version?: number;
}

/**
 * Displays a fixed debug panel in development mode with session and persistence state details.
 *
 * Shows key session flags, Zustand store values, parsed localStorage data, and visible cookies to assist in diagnosing session or persistence issues during development. The panel is visually distinct, fixed to the viewport, and uses semantic markup for accessibility. It does not render in production environments.
 */
export function SessionDebug() {
  const {
    hasValidApiKey,
    apiKeyType,
    apiKeyLength,
    isInitialized,
    messages,
    hasSeenWelcomeAnimation,
    hasCompletedInitialSetup,
  } = useChatStore();

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [localStorageInfo, setLocalStorageInfo] = useState<ZustandPersistedData | null>(null);

  useEffect(() => {
    const checkStorage = () => {
      // Check localStorage persistence
      try {
        const stored = localStorage.getItem('chat-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          logger.debug('Raw localStorage data', {
            component: 'SessionDebug',
            data: parsed,
          });
          setLocalStorageInfo(parsed as ZustandPersistedData);
        } else {
          setLocalStorageInfo(null);
        }
      } catch (error) {
        logger.error(
          'Failed to read localStorage',
          error instanceof Error ? error : new Error(String(error)),
          {
            component: 'SessionDebug',
          },
        );
      }

      // Check cookies (visible ones)
      const cookies = document.cookie.split(';').reduce((acc: SessionInfo, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key) {
          acc[key] = value || '';
        }
        return acc;
      }, {});

      setSessionInfo(cookies);
    };

    // Initial check
    checkStorage();

    // Watch for storage changes
    const interval = setInterval(checkStorage, 1000);
    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 max-w-sm rounded-lg bg-black/80 p-4 text-xs text-white backdrop-blur-sm">
      <h3 className="font-bold text-yellow-300">🔍 Session Debug</h3>

      <div className="mt-2 space-y-1">
        <div>Initialized: {isInitialized ? '✅' : '❌'}</div>
        <div>Valid API Key: {hasValidApiKey ? '✅' : '❌'}</div>
        <div>API Key Type: {apiKeyType || 'None'}</div>
        <div>API Key Length: {apiKeyLength || 'None'}</div>
        <div>Messages Count: {messages.length}</div>
        <div>Seen Welcome: {hasSeenWelcomeAnimation ? '✅' : '❌'}</div>
        <div>Setup Complete: {hasCompletedInitialSetup ? '✅' : '❌'}</div>
      </div>

      <div className="mt-2">
        <div className="font-semibold text-blue-300">localStorage:</div>
        <div className="max-h-20 overflow-y-auto text-[10px]">
          {localStorageInfo ? <pre>{JSON.stringify(localStorageInfo, null, 1)}</pre> : 'No data'}
        </div>
      </div>

      <div className="mt-2">
        <div className="font-semibold text-green-300">Cookies (visible):</div>
        <div className="max-h-20 overflow-y-auto text-[10px]">
          {sessionInfo && Object.keys(sessionInfo).length > 0 ? (
            <pre>{JSON.stringify(sessionInfo, null, 1)}</pre>
          ) : (
            'No cookies visible'
          )}
        </div>
      </div>
    </div>
  );
}
