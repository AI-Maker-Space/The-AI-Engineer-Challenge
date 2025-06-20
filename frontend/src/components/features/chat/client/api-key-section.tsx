'use client';

import { useEffect, useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useChatStore } from '@/store';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { ModelSelector } from './model-selector';

/**
 * React component for securely entering, validating, and managing an OpenAI API key with integrated AI model selection.
 *
 * Provides a password-masked input field with visibility toggle, real-time client and server validation, and contextual feedback for API key status. Includes accessible error messages, help text, and ARIA attributes for screen readers. Supports keyboard navigation and focus management. Allows users to select an AI model and delete or reset the API key session.
 */
export function ApiKeySection() {
  // Local state for API key input (not persisted)
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [apiKeyTouched, setApiKeyTouched] = useState(false);

  const { pending } = useFormStatus();

  // SECURE: Get session state from store (no actual keys)
  const {
    hasValidApiKey,
    apiKeyType,
    apiKeyLength,
    selectedModel,
    apiKeyError,
    setApiKey,
    setSelectedModel,
    setIsExpanded,
    isLoading,
    reset,
  } = useChatStore();

  // Production-ready API key format validation supporting all 2024-2025 formats
  const isValidApiKeyFormat = (key: string): boolean => {
    if (!key || typeof key !== 'string') {
      return false;
    }

    const trimmedKey = key.trim();

    // Modern keys with T3BlbkFJ signature (2024-2025)
    const modernKeyRegex =
      /^sk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{20,74}T3BlbkFJ[A-Za-z0-9_-]{20,74}$/;
    if (modernKeyRegex.test(trimmedKey)) {
      return true;
    }

    // Legacy keys (exactly 51 chars)
    const legacyKeyRegex = /^sk-[A-Za-z0-9]{48}$/;
    return legacyKeyRegex.test(trimmedKey);
  };

  // Get detailed key type information for better user feedback
  const getKeyType = (key: string): string => {
    if (key.startsWith('sk-proj-s-')) {
      return 'Project Service';
    }
    if (key.startsWith('sk-proj-')) {
      return 'Project';
    }
    if (key.startsWith('sk-svcacct-')) {
      return 'Service Account';
    }
    if (key.startsWith('sk-admin-')) {
      return 'Admin';
    }
    return 'Legacy';
  };

  // Handle API key input changes (immediate UI feedback)
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKeyInput(value);
    setApiKeyTouched(true);
  };

  // Handle API key validation (server-side)
  const handleApiKeyValidation = async () => {
    if (!apiKeyInput.trim() || isValidating || !isValidApiKeyFormat(apiKeyInput.trim())) {
      return;
    }

    setIsValidating(true);
    try {
      // This calls the secure server action and updates store state
      const result = await setApiKey(apiKeyInput.trim());

      // Clear input on successful validation (use return value to avoid race condition)
      if (result.success) {
        setApiKeyInput('');
        setShowApiKey(false);
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Handle Enter key for validation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApiKeyValidation();
    }
  };

  // Handle chat expansion based on API key validity
  useEffect(() => {
    setIsExpanded(hasValidApiKey);
  }, [hasValidApiKey, setIsExpanded]);

  // Handle deleting API key session
  const handleDeleteApiKey = async () => {
    // Use nuclear reset for complete cleanup - user gets fresh start
    await reset();
    setApiKeyInput('');
    setApiKeyTouched(false);
    setShowApiKey(false);
  };

  // Enhanced validation status with better UX feedback
  const getValidationStatus = () => {
    if (isValidating || isLoading) {
      return 'validating';
    }
    if (hasValidApiKey) {
      return 'valid';
    }
    if (apiKeyError && apiKeyTouched) {
      // Determine specific error type for better UX
      if (apiKeyError.includes('rate limit') || apiKeyError.includes('429')) {
        return 'rate-limited';
      }
      if (
        apiKeyError.includes('unauthorized') ||
        apiKeyError.includes('401') ||
        apiKeyError.includes('Invalid API key')
      ) {
        return 'unauthorized';
      }
      if (apiKeyError.includes('quota') || apiKeyError.includes('billing')) {
        return 'quota-exceeded';
      }
      return 'error';
    }
    if (apiKeyInput.trim() && !isValidApiKeyFormat(apiKeyInput.trim()) && apiKeyTouched) {
      return 'invalid-format';
    }
    return 'pending';
  };

  // Get error title and action based on error type
  const getErrorTitle = (error: string): string => {
    if (error.includes('rate limit')) {
      return 'Too many requests';
    }
    if (error.includes('unauthorized') || error.includes('401')) {
      return 'Invalid API key';
    }
    if (error.includes('quota')) {
      return 'Quota exceeded';
    }
    if (error.includes('format')) {
      return 'Invalid format';
    }
    return 'Validation Error';
  };

  const getErrorAction = (error: string): string | null => {
    if (error.includes('rate limit')) {
      return 'Please wait a moment before trying again.';
    }
    if (error.includes('unauthorized') || error.includes('401')) {
      return 'Generate a new API key from your OpenAI account.';
    }
    if (error.includes('quota')) {
      return 'Check your billing settings or upgrade your plan.';
    }
    if (error.includes('format')) {
      return 'Double-check your API key from the OpenAI dashboard.';
    }
    return 'Please try again or check your API key.';
  };

  const validationStatus = getValidationStatus();

  return (
    <>
      {/* API Key and Model Selector Row */}
      <div className="mb-1.5 rounded-t-xl">
        <div className="flex flex-col items-stretch gap-y-2 sm:flex-row sm:items-center sm:gap-x-1">
          {/* SECURE API Key Input */}
          <div className="relative flex-1 rounded-lg rounded-tl-lg rounded-r-none rounded-b-none bg-white/10 transition-colors duration-200 ease-in-out focus-within:bg-white/20">
            {hasValidApiKey ? (
              // Show enhanced key info when validated (no actual key)
              <div className="flex h-12 items-center px-3 text-white/80">
                <span className="text-sm">
                  🔑 {apiKeyType} key ({apiKeyLength} chars) - Valid
                </span>
              </div>
            ) : (
              // Show input when no valid key
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={handleApiKeyChange}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setApiKeyTouched(true)}
                  placeholder="sk-proj-... or sk-..."
                  disabled={pending || isValidating}
                  className="h-12 w-full border-none bg-transparent pr-16 font-sans font-light text-white shadow-none ring-0 outline-none placeholder:text-white/50 focus:border-none focus:ring-0 focus:outline-none"
                  minLength={20}
                  aria-describedby="api-key-description api-key-error"
                  aria-invalid={!!apiKeyError && apiKeyTouched}
                />

                {/* Show/Hide API Key Toggle */}
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute top-1/2 right-8 -translate-y-1/2 text-white/50 hover:text-white/70"
                  tabIndex={-1}
                >
                  {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>

                {/* Enhanced Validation Status Indicator */}
                <div
                  className={`absolute top-1/2 right-3 size-2.5 -translate-y-1/2 transform rounded-full transition-colors duration-300 ${
                    validationStatus === 'valid'
                      ? 'bg-green-400'
                      : validationStatus === 'validating'
                        ? 'animate-pulse bg-orange-400'
                        : validationStatus === 'rate-limited'
                          ? 'animate-pulse bg-yellow-400'
                          : validationStatus === 'unauthorized'
                            ? 'bg-red-500'
                            : validationStatus === 'quota-exceeded'
                              ? 'bg-purple-400'
                              : validationStatus === 'error'
                                ? 'bg-red-400'
                                : validationStatus === 'invalid-format'
                                  ? 'bg-red-300'
                                  : 'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-yellow-300'
                  }`}
                />
              </div>
            )}
          </div>

          {/* Model Selector and Action Buttons */}
          <div className="flex h-12 items-center">
            <div className="flex h-full w-full rounded-lg rounded-tl-none rounded-tr-lg rounded-b-none bg-white/10 transition-colors duration-200 ease-in-out focus-within:bg-white/20 hover:bg-white/20">
              {/* Model Selector */}
              <div className="flex flex-grow items-center [&>*]:bg-transparent [&>*]:focus-within:bg-transparent [&>*]:hover:bg-transparent [&>*]:focus:bg-transparent">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={pending || isValidating}
                  className="h-full rounded-none border-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex h-full items-center gap-1 px-2">
                {!hasValidApiKey &&
                  apiKeyInput.trim() &&
                  isValidApiKeyFormat(apiKeyInput.trim()) && (
                    // Validate Button (only show when format is valid)
                    <Button
                      type="button"
                      onClick={handleApiKeyValidation}
                      disabled={isValidating || pending}
                      className="flex size-8 items-center justify-center rounded-lg border border-solid border-orange-500/50 bg-orange-500/20 p-0 text-orange-300 hover:border-orange-400 hover:bg-orange-500/30"
                      title="Validate API Key"
                    >
                      {isValidating ? (
                        <div className="size-3 animate-spin rounded-full border border-orange-300 border-t-transparent" />
                      ) : (
                        <span className="text-xs">✓</span>
                      )}
                    </Button>
                  )}

                {hasValidApiKey && (
                  // Delete Button
                  <Button
                    type="button"
                    onClick={handleDeleteApiKey}
                    disabled={pending}
                    className="flex size-8 items-center justify-center rounded-lg border border-solid border-white/30 bg-transparent p-0 text-white/70 shadow-[rgba(0,0,0,0.3)_0px_2px_4px_0px] hover:border-red-400 hover:bg-red-500/20 hover:text-red-300"
                    title="Delete API Key"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced API Key Error Message */}
        {apiKeyError && apiKeyTouched && (
          <div role="alert" className="mt-1 text-center text-xs">
            <div className="font-medium text-red-300">{getErrorTitle(apiKeyError)}</div>
            <div className="text-red-400">{apiKeyError}</div>
            {getErrorAction(apiKeyError) && (
              <div className="mt-1 text-blue-300">{getErrorAction(apiKeyError)}</div>
            )}
          </div>
        )}

        {/* Enhanced Validation Help Text */}
        {!hasValidApiKey && apiKeyInput.trim() && (
          <p id="api-key-description" className="mt-1 text-center text-xs text-blue-300">
            {isValidApiKeyFormat(apiKeyInput.trim())
              ? 'Press Enter or click ✓ to validate your API key'
              : "OpenAI API keys start with 'sk-' (legacy), 'sk-proj-' (project), or 'sk-svcacct-' (service account)"}
          </p>
        )}
      </div>
    </>
  );
}
