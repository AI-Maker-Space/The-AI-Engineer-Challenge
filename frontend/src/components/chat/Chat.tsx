"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage, friendlyMessageForUnknownError, isAbortError } from "@/lib/api";
import {
  CHARACTER_STORAGE_KEY,
  DEFAULT_CHARACTER,
  readStoredCharacter,
  type CoachCharacterId,
} from "@/lib/characters";
import {
  CREATIVITY_STORAGE_KEY,
  DEFAULT_CREATIVITY,
  readStoredCreativity,
} from "@/lib/creativity";
import type { ChatMessage } from "@/lib/types";
import { CharacterSelect } from "./CharacterSelect";
import { ChatErrorBanner } from "./ChatErrorBanner";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { CreativityControl } from "./CreativityControl";
import { MessageList } from "./MessageList";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there — I'm your mindful coach. Whether you're dealing with stress, building habits, or need a confidence boost, I'm here to listen. What's on your mind today?",
};

function createMessage(
  role: ChatMessage["role"],
  content: string,
  responseTimeMs?: number,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    ...(responseTimeMs !== undefined && { responseTimeMs }),
  };
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creativity, setCreativity] = useState(DEFAULT_CREATIVITY);
  const [character, setCharacter] = useState<CoachCharacterId>(DEFAULT_CHARACTER);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setCreativity(readStoredCreativity());
    setCharacter(readStoredCharacter());
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleCreativityChange = useCallback((value: number) => {
    setCreativity(value);
    localStorage.setItem(CREATIVITY_STORAGE_KEY, String(value));
  }, []);

  const handleCharacterChange = useCallback((value: CoachCharacterId) => {
    setCharacter(value);
    localStorage.setItem(CHARACTER_STORAGE_KEY, value);
  }, []);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = createMessage("user", trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const { reply, responseTimeMs } = await sendChatMessage({
        message: trimmed,
        creativity,
        character,
        signal: controller.signal,
      });
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", reply, responseTimeMs),
      ]);
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }
      const message = friendlyMessageForUnknownError(err);
      if (message) {
        setError(message);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  }, [character, creativity, isLoading]);

  return (
    <section
      className="flex h-[min(90vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface/90 shadow-2xl shadow-black/10 backdrop-blur-sm dark:shadow-black/30"
      aria-label="Chat with mindful coach"
    >
      <ChatHeader />
      <MessageList messages={messages} isLoading={isLoading} />
      {error && (
        <ChatErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      <ChatInput
        onSend={handleSend}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
      <CharacterSelect
        value={character}
        onChange={handleCharacterChange}
        disabled={isLoading}
      />
      <CreativityControl
        value={creativity}
        onChange={handleCreativityChange}
        disabled={isLoading}
      />
    </section>
  );
}
