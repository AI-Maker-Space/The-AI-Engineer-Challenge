// src/app/actions/chat-actions.ts
'use server';

import type { ActionResult } from '@/types';

/**
 * @deprecated This file contains legacy server actions that are no longer used.
 * Chat functionality now uses the /api/chat-stream route handler for streaming.
 *
 * These functions are kept for backward compatibility but should not be used in new code.
 */

/**
 * Checks if the provided API key matches the expected format.
 *
 * @deprecated Use validateAndStoreApiKey from api-key-actions instead.
 * @param apiKey - The API key string to validate
 * @returns An ActionResult containing `true` if the API key format is valid, otherwise `false`
 */
export async function validateApiKeyAction(apiKey: string): Promise<ActionResult<boolean>> {
  console.warn(
    'validateApiKeyAction is deprecated. Use validateAndStoreApiKey from api-key-actions instead.',
  );

  try {
    // Basic format check only - no actual validation
    const isValidFormat = /^sk-[A-Za-z0-9_-]{48}$/.test(apiKey.trim());

    return {
      success: true,
      data: isValidFormat,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation error',
    };
  }
}

/**
 * Validates the format of an API key and returns the result.
 *
 * @deprecated Not implemented. Use the route handler pattern instead.
 * @returns An ActionResult indicating whether the API key format is valid.
 */
export async function testApiKeyAction(apiKey: string): Promise<ActionResult<boolean>> {
  console.warn('testApiKeyAction is deprecated and not implemented.');

  try {
    // This would make a test request to OpenAI API
    // For now, we'll just do format validation
    const formatResult = await validateApiKeyAction(apiKey);

    if (!formatResult.success || !formatResult.data) {
      return {
        success: false,
        error: 'Invalid API key format',
      };
    }

    // TODO: Implement actual API key testing with OpenAI
    // const testResponse = await openai.models.list();

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API key test failed',
    };
  }
}
