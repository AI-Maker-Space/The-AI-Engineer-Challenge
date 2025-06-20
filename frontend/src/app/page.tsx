// src/app/page.tsx
'use client';

import { useEffect } from 'react';
// import { SessionDebug } from '@/components/debug/session-debug';
import { ChatInput, MessageList } from '@/components/features/chat';
import { AnimatedBackground, ChatLayout, ChatShell } from '@/components/layout';
import {
  Avatar,
  AvatarFallback,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { useAnimationState } from '@/hooks/use-animation-state';
import { logger } from '@/lib';
import { useChatStore } from '@/store';
import { Bot, Clock, Sparkles } from 'lucide-react';

/**
 * Renders the main chat page with streaming support, state management, and dynamic UI based on user session and animation state.
 *
 * Initializes chat store after hydration, performs background session validation, and displays a chat interface with message list, input, and timestamp toggling. The header adapts to user return status and animation state.
 */
export default function HomePage() {
  const {
    messages,
    isInitialized,
    isRehydrated,
    initializeStore,
    checkSession,
    showTimestamps,
    setShowTimestamps,
    isAnimating,
    isTyping,
    isLoading,
  } = useChatStore();

  const { isReturningUser, shouldPlayWelcomeAnimation, isHydrationComplete } = useAnimationState();

  // Phase 1: Initialize store after rehydration completes
  useEffect(() => {
    if (isRehydrated && !isInitialized) {
      logger.info('Page: Initializing store after rehydration', {
        component: 'HomePage',
        action: 'initializeStore',
        isRehydrated,
        isInitialized,
      });
      initializeStore();
    }
  }, [isRehydrated, isInitialized, initializeStore]);

  // Phase 2: Check session in background (no UI blocking)
  useEffect(() => {
    if (isInitialized && isHydrationComplete) {
      logger.debug('Page: Checking session in background', {
        component: 'HomePage',
        action: 'checkSession',
      });
      checkSession().catch((error) => {
        logger.error(
          'Background session check failed',
          error instanceof Error ? error : new Error(String(error)),
          {
            component: 'HomePage',
            action: 'checkSession',
          },
        );
      });
    }
  }, [isInitialized, checkSession, isHydrationComplete]);

  const onToggleTimestamps = () => {
    setShowTimestamps(!showTimestamps);
  };

  // Header message logic
  const getHeaderMessage = () => {
    if (isReturningUser) {
      return 'Welcome back!';
    }
    if (shouldPlayWelcomeAnimation) {
      return 'Welcome to AI Assistant!';
    }
    return 'Always ready to help';
  };

  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-14 bg-gradient-to-br from-blue-500 to-purple-600">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Bot className="size-9" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute top-0 right-0">
            <Sparkles
              className={`h-4 w-4 text-yellow-300 ${
                shouldPlayWelcomeAnimation ? 'animate-pulse' : ''
              }`}
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Chat Assistant</h1>
          <p className="text-sm text-yellow-300">{getHeaderMessage()}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Clock className="size-5 shrink-0 text-white" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleTimestamps}
                  className="!h-10 !max-h-10 w-[85px] !rounded-2xl px-2 py-1 text-xs text-white hover:bg-transparent hover:text-yellow-300"
                >
                  {showTimestamps ? 'Hide Times' : 'Show Times'}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>Toggle message timestamps</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  // Always render immediately - no loading/hydration waiting
  return (
    <AnimatedBackground>
      <ChatLayout header={headerContent}>
        <ChatShell>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={messages || []} // Ensure array fallback
                isLoading={isLoading}
                isTyping={isTyping}
                isAnimating={isAnimating}
              />
            </div>
            <ChatInput />
          </div>
        </ChatShell>
      </ChatLayout>
      {/* Only show debug in development */}
      {/* {process.env.NODE_ENV === 'development' && <SessionDebug />} */}
    </AnimatedBackground>
  );
}
