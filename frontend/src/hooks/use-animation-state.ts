// src/hooks/use-animation-state.ts
'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/store';

/**
 * Provides animation state and control flags for background and welcome animations, ensuring hydration safety.
 *
 * This hook derives animation-related state from the global chat store, including API key validity, user setup progress, and whether the welcome animation has been seen. It tracks hydration status to ensure client-side safety and determines if the user is first-time or returning. The returned object includes flags for which background animation to show, whether to play or skip the welcome animation, and readiness indicators for hydration and animation.
 *
 * @returns An object containing animation state flags, user experience indicators, and hydration readiness.
 */
export function useAnimationState() {
  const {
    hasValidApiKey,
    apiKeyType,
    apiKeyLength,
    hasSeenWelcomeAnimation,
    hasCompletedInitialSetup,
  } = useChatStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  // Handle hydration and determine user type
  useEffect(() => {
    setIsHydrated(true);

    // Determine if this is a first-time user based on completed setup
    setIsFirstTimeUser(!hasCompletedInitialSetup);
  }, [hasCompletedInitialSetup]);

  // Calculate animation states
  const shouldShowValidAnimation =
    hasValidApiKey && apiKeyType && apiKeyLength != null && apiKeyLength > 0;
  const shouldShowInvalidAnimation = !shouldShowValidAnimation;
  const shouldPlayWelcomeAnimation = !hasSeenWelcomeAnimation && isFirstTimeUser && isHydrated;

  return {
    // Background animation states
    shouldShowValidAnimation,
    shouldShowInvalidAnimation,
    animationState: shouldShowValidAnimation ? 'valid' : 'invalid',

    // User experience states
    isFirstTimeUser,
    isReturningUser: !isFirstTimeUser,

    // Animation control
    shouldPlayWelcomeAnimation,
    shouldSkipAllAnimations: hasSeenWelcomeAnimation && !isFirstTimeUser,

    // Ready states
    isHydrationComplete: isHydrated,
    isAnimationReady: isHydrated,
  };
}
