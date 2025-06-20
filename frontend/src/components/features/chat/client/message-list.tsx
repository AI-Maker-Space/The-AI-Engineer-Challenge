'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store';
import { Bot, User } from 'lucide-react';

import type { MessageListProps } from '../chat.types';
import { TypewriterMessage } from './typewriter-message';
import { TypingIndicator } from './typing-indicator';

/**
 * Renders a scrollable, accessible chat message list with animated assistant responses and typing indicator.
 *
 * Displays user messages right-aligned with distinct styling and avatars, and assistant messages left-aligned. Integrates typewriter animation for the latest assistant message when animating. Automatically scrolls to the newest message unless the user is actively scrolling. Shows a typing indicator when the assistant is composing a response. Optionally displays message timestamps if enabled.
 *
 * @param messages - Array of chat message objects to display in order
 * @param isTyping - Whether the assistant is currently typing
 * @param isAnimating - Whether the last assistant message should animate with a typewriter effect
 */
export function MessageList({ messages, isTyping, isAnimating }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [userIsScrolling, setUserIsScrolling] = useState(false);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const setIsAnimating = useChatStore((state) => state.setIsAnimating);
  const showTimestamps = useChatStore((state) => state.showTimestamps);

  // Detect user scrolling to respect user control
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      setUserIsScrolling(true);

      // Clear existing timeout
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }

      // Reset user scrolling flag after 1 second of no scroll activity
      userScrollTimeoutRef.current = setTimeout(() => {
        setUserIsScrolling(false);
      }, 1000);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll to bottom on new messages and content updates
  useEffect(() => {
    if (messages.length > 0) {
      // Cancel any pending animation frame
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Schedule scroll on next paint for smooth performance
      animationFrameRef.current = requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: userIsScrolling ? 'auto' : 'smooth',
          block: 'end',
        });
      });

      return () => {
        if (animationFrameRef.current !== undefined) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [messages.length, userIsScrolling]); // Only track length and scroll state to prevent excessive re-runs

  return (
    <ScrollArea className="flex-1 px-2" ref={scrollContainerRef}>
      <div className="space-y-6 py-4">
        {messages.map((message, idx) => {
          const isLastMessage = idx === messages.length - 1;
          const isUser = message.role === 'user';
          // Show typewriter animation for assistant messages that are animating
          const shouldAnimate = isLastMessage && message.role === 'assistant' && isAnimating;

          return (
            <div key={message.id} className="flex flex-col space-y-2">
              {/* Message content with proper alignment */}
              <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* User/Bot Avatar */}
                <div className="flex-shrink-0">
                  {isUser ? (
                    <Avatar className="size-8 bg-gradient-to-br from-green-500 to-emerald-600">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <User className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="size-8 bg-gradient-to-br from-blue-500 to-purple-600">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Message Content with Chat Bubble Styling */}
                <div className={`max-w-[75%] min-w-0 flex-1 ${isUser ? 'flex justify-end' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isUser
                        ? 'ml-auto bg-white/10 text-white' // User: blue bubble on right
                        : 'mr-auto text-white' // Assistant: transparent bubble on left
                    }`}
                  >
                    <TypewriterMessage
                      message={message}
                      isAnimating={shouldAnimate}
                      onAnimationComplete={shouldAnimate ? () => setIsAnimating(false) : undefined}
                      className={isUser ? 'text-white' : 'text-white'}
                    />
                  </div>
                </div>
              </div>

              {/* Timestamp if enabled */}
              {showTimestamps && message.timestamp && (
                <div
                  className={`text-xs text-blue-300 opacity-50 ${
                    isUser ? 'pr-11 text-right' : 'pl-11 text-left'
                  }`}
                >
                  {(() => {
                    const date = new Date(message.timestamp);
                    return !Number.isNaN(date.getTime())
                      ? date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Invalid time';
                  })()}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator - always on the left */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <Avatar className="size-8 bg-gradient-to-br from-blue-500 to-purple-600">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Bot className="size-5" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
