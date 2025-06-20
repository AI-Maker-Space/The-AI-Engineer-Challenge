// src/store/chat-store.ts
import { chatLogger, logger, toast } from '@/lib';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { ChatState } from './store.types';

// Welcome message constants to avoid duplication
const WELCOME_MESSAGE =
  "Hello! I'm your AI assistant. To get started, please enter your OpenAI API key in the field below. I'll be ready to help once you've added your key.";

/**
 * Generates a standardized assistant welcome message object with a fixed ID and current timestamp.
 *
 * @returns An object representing the assistant's welcome message.
 */
function createWelcomeMessage() {
  return {
    id: 'welcome',
    content: WELCOME_MESSAGE,
    role: 'assistant' as const,
    timestamp: new Date().toISOString(),
  };
}

// Initial state for data only (without action functions)
const INITIAL_DATA_STATE = {
  messages: [],
  hasValidApiKey: false,
  apiKeyType: null as string | null,
  apiKeyLength: null as number | null,
  apiKeyError: null as string | null,
  isInitialized: false,
  isRehydrated: false, // Track Zustand persistence rehydration completion
  selectedModel: 'gpt-4.1-mini',
  isLoading: false,
  isTyping: false,
  showTimestamps: false,
  isAnimating: false,
  animatedContent: '',
  isExpanded: false,
  hasSeenWelcomeAnimation: false,
  hasCompletedInitialSetup: false,
  lastSuccessfulKeyType: null as string | null,
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initialize with data state
        ...INITIAL_DATA_STATE,

        // Messages actions
        setMessages: (messages) => set({ messages }),
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message],
          })),
        updateMessage: (id, updates) =>
          set((state) => ({
            messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
          })),
        clearMessages: () => set({ messages: [] }),

        // API Key actions
        setApiKey: async (key: string) => {
          const { validateAndStoreApiKey } = await import('@/app/actions/api-key-actions');

          set({ isLoading: true, apiKeyError: null });

          try {
            const result = await validateAndStoreApiKey(key);

            if (result.success && result.data) {
              const keyType = result.data.keyInfo?.type || null;
              const keyLength = result.data.keyInfo?.length || null;

              const confirmationMessage = {
                id: `key-confirmation-${Date.now()}`,
                content: 'Thank you for adding your API key! How can I help you today?',
                role: 'assistant' as const,
                timestamp: new Date().toISOString(),
              };

              const currentState = get();

              // Single atomic state update
              set({
                hasValidApiKey: true,
                apiKeyType: keyType,
                apiKeyLength: keyLength,
                apiKeyError: null,
                isLoading: false,
                hasCompletedInitialSetup: true,
                lastSuccessfulKeyType: keyType,
                isExpanded: true,
                messages: [...currentState.messages, confirmationMessage],
                isAnimating: true,
                animatedContent: confirmationMessage.content,
              });

              chatLogger.success('API Key validated and setup complete', {
                action: 'setApiKey',
                keyType,
                keyLength,
              });
              toast.success('API key added successfully!');
              return { success: true, error: null };
            }

            set({
              hasValidApiKey: false,
              apiKeyType: null,
              apiKeyLength: null,
              apiKeyError: result.error || 'Validation failed',
              isLoading: false,
            });
            return { success: false, error: result.error || 'Validation failed' };
          } catch (error) {
            const errorMessage = 'Failed to validate API key';
            set({
              hasValidApiKey: false,
              apiKeyType: null,
              apiKeyLength: null,
              apiKeyError: errorMessage,
              isLoading: false,
            });
            return { success: false, error: errorMessage };
          }
        },

        deleteApiKey: async () => {
          const { deleteApiKeySession } = await import('@/app/actions/api-key-actions');

          try {
            await deleteApiKeySession();

            const welcomeMessage = createWelcomeMessage();

            set({
              hasValidApiKey: false,
              apiKeyType: null,
              apiKeyLength: null,
              apiKeyError: null,
              messages: [welcomeMessage],
              isExpanded: false,
              isAnimating: true,
              animatedContent: welcomeMessage.content,
            });
          } catch (error) {
            logger.error(
              'Failed to delete API key',
              error instanceof Error ? error : new Error(String(error)),
              {
                component: 'ChatStore',
                action: 'deleteApiKey',
              },
            );
            toast.error('Failed to delete API key');
          }
        },

        // Fixed initialization with proper type safety
        initializeStore: () => {
          const state = get();

          logger.debug('Store initialization check', {
            component: 'ChatStore',
            action: 'initializeStore',
            isInitialized: state.isInitialized,
            hasCompletedInitialSetup: state.hasCompletedInitialSetup,
            messagesCount: state.messages.length,
          });

          // Skip if already initialized
          if (state.isInitialized) {
            logger.debug('Store already initialized from persistence', {
              component: 'ChatStore',
              action: 'initializeStore',
            });
            return;
          }

          // Only run first-time initialization for truly new users
          if (
            state.messages.length === 0 &&
            !state.hasValidApiKey &&
            !state.hasSeenWelcomeAnimation &&
            !state.hasCompletedInitialSetup
          ) {
            const welcomeMessage = createWelcomeMessage();

            logger.info('First-time user initialization', {
              component: 'ChatStore',
              action: 'initializeStore',
            });
            set({
              messages: [welcomeMessage],
              isAnimating: true,
              animatedContent: welcomeMessage.content,
              hasSeenWelcomeAnimation: true,
              isInitialized: true,
            });
          } else {
            logger.debug('Marking as initialized without changes', {
              component: 'ChatStore',
              action: 'initializeStore',
            });
            set({
              isInitialized: true,
            });
          }
        },

        // Session check with proper array handling
        checkSession: async () => {
          const { getApiKeySession } = await import('@/app/actions/api-key-actions');

          try {
            const session = await getApiKeySession();
            const currentState = get();

            if (session?.hasValidKey) {
              set({
                hasValidApiKey: true,
                apiKeyType: session.keyType || currentState.lastSuccessfulKeyType,
                apiKeyLength: session.keyLength,
                hasCompletedInitialSetup: true,
                lastSuccessfulKeyType: session.keyType || currentState.lastSuccessfulKeyType,
                isExpanded: true,
              });
              chatLogger.success('Session restored with valid API key', {
                action: 'checkSession',
                keyType: session.keyType,
              });
            } else {
              const shouldShowWelcome =
                currentState.messages.length === 0 && !currentState.hasCompletedInitialSetup;

              if (shouldShowWelcome) {
                const welcomeMessage = createWelcomeMessage();

                set({
                  hasValidApiKey: false,
                  apiKeyType: null,
                  apiKeyLength: null,
                  messages: [welcomeMessage],
                  isExpanded: false,
                  isAnimating: true,
                  animatedContent: welcomeMessage.content,
                  hasSeenWelcomeAnimation: true,
                });
              } else {
                set({
                  hasValidApiKey: false,
                  apiKeyType: null,
                  apiKeyLength: null,
                  isExpanded: false,
                });
              }
            }
          } catch (error) {
            logger.error(
              'Session check failed',
              error instanceof Error ? error : new Error(String(error)),
              {
                component: 'ChatStore',
                action: 'checkSession',
              },
            );
            set({
              hasValidApiKey: false,
              apiKeyType: null,
              apiKeyLength: null,
              isExpanded: false,
            });
          }
        },

        // Other actions
        setSelectedModel: (model) => set({ selectedModel: model }),
        setIsLoading: (loading) => set({ isLoading: loading }),
        setIsTyping: (typing) => set({ isTyping: typing }),
        setShowTimestamps: (show) => set({ showTimestamps: show }),
        setIsAnimating: (animating) => set({ isAnimating: animating }),
        setAnimatedContent: (content) => set({ animatedContent: content }),
        setIsExpanded: (expanded) => set({ isExpanded: expanded }),
        setHasSeenWelcomeAnimation: (seen) => set({ hasSeenWelcomeAnimation: seen }),
        setHasCompletedInitialSetup: (completed) => set({ hasCompletedInitialSetup: completed }),

        // Reset with proper array initialization
        reset: async () => {
          try {
            const { deleteApiKeySession } = await import('@/app/actions/api-key-actions');
            await deleteApiKeySession();
            // Note: Removed direct localStorage.removeItem() - Zustand's persistence middleware handles cleanup
          } catch (error) {
            logger.error(
              'Reset cleanup failed',
              error instanceof Error ? error : new Error(String(error)),
              {
                component: 'ChatStore',
                action: 'reset',
              },
            );
          }

          const welcomeMessage = createWelcomeMessage();

          // Reset state - Zustand persistence middleware will handle storage cleanup automatically
          set({
            ...INITIAL_DATA_STATE,
            messages: [welcomeMessage],
            isAnimating: true,
            animatedContent: welcomeMessage.content,
            isInitialized: true,
          });
        },
      }),
      {
        name: 'chat-storage',
        partialize: (state: ChatState) => ({
          selectedModel: state.selectedModel,
          messages: state.messages,
          showTimestamps: state.showTimestamps,
          hasSeenWelcomeAnimation: state.hasSeenWelcomeAnimation,
          hasCompletedInitialSetup: state.hasCompletedInitialSetup,
          lastSuccessfulKeyType: state.lastSuccessfulKeyType,
          isInitialized: state.isInitialized,
          // Note: isExpanded is NOT persisted - it's derived from hasValidApiKey for proper animations
        }),
        onRehydrateStorage: () => (state?: ChatState, error?: unknown) => {
          if (error) {
            logger.error(
              'Store rehydration failed',
              error instanceof Error ? error : new Error(String(error)),
              {
                component: 'ChatStore',
                action: 'rehydrate',
              },
            );
            // Mark as rehydrated even on error to prevent indefinite waiting
            useChatStore.setState({ isRehydrated: true });
            return;
          }

          if (state) {
            logger.debug('Store rehydrated successfully', {
              component: 'ChatStore',
              action: 'rehydrate',
              messagesCount: state.messages.length,
              hasCompletedInitialSetup: state.hasCompletedInitialSetup,
              isInitialized: state.isInitialized,
            });
          }

          // Mark rehydration as complete and trigger initialization if needed
          useChatStore.setState((currentState) => {
            const newState = { ...currentState, isRehydrated: true };

            // Auto-trigger initialization after rehydration if not already initialized
            if (!currentState.isInitialized) {
              logger.info('Auto-triggering store initialization after rehydration', {
                component: 'ChatStore',
                action: 'postRehydrationInit',
              });

              // Call initializeStore logic directly
              if (
                currentState.messages.length === 0 &&
                !currentState.hasValidApiKey &&
                !currentState.hasSeenWelcomeAnimation &&
                !currentState.hasCompletedInitialSetup
              ) {
                const welcomeMessage = createWelcomeMessage();
                return {
                  ...newState,
                  messages: [welcomeMessage],
                  isAnimating: true,
                  animatedContent: welcomeMessage.content,
                  hasSeenWelcomeAnimation: true,
                  isInitialized: true,
                };
              }

              return {
                ...newState,
                isInitialized: true,
              };
            }

            return newState;
          });
        },
      },
    ),
    { name: 'chat-store' },
  ),
);
