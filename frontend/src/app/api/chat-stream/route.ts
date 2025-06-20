// src/app/api/chat-stream/route.ts
import type { NextRequest } from 'next/server';
import { getApiKeySession, getDecryptedApiKey } from '@/app/actions/api-key-actions';
import { logger } from '@/lib';

/**
 * Handles chat streaming POST requests by validating the API key session, parsing and validating the user message and model, and forwarding the request to a backend FastAPI service. Returns a streaming response with the AI-generated reply or an appropriate error message.
 *
 * Expects a JSON body with a `message` (required), an optional `model`, and an optional `developerMessage`. Enforces authentication, input validation, and model selection, and streams the backend response to the client.
 *
 * @returns A streaming response with the AI-generated reply, or a JSON error response with appropriate HTTP status codes.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify session exists (SECURE)
    const session = await getApiKeySession();
    if (!session?.hasValidKey) {
      return new Response(
        JSON.stringify({ error: 'API key session expired. Please re-authenticate.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 2. Get decrypted API key (SECURE - server-side only)
    const apiKey = await getDecryptedApiKey();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve API key. Please re-authenticate.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 3. Parse request body
    const body = await request.json();
    const {
      message,
      model = 'gpt-4o-mini',
      developerMessage = 'You are a helpful AI assistant.',
    } = body;

    // 4. Validate inputs
    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (message.length > 4000) {
      return new Response(JSON.stringify({ error: 'Message too long (max 4000 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Validate and log model selection
    const allowedModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
    const selectedModel = allowedModels.includes(model) ? model : 'gpt-4o-mini';

    if (model !== selectedModel) {
      logger.warn(`Invalid model "${model}" requested, falling back to "${selectedModel}"`, {
        component: 'ChatStreamAPI',
        requestedModel: model,
        selectedModel,
      });
    }

    logger.info(`Using model: ${selectedModel} for user request`, {
      component: 'ChatStreamAPI',
      model: selectedModel,
      messageLength: message.length,
    });

    // 6. Call FastAPI backend with streaming
    const apiUrl = process.env.API_URL || 'http://localhost:8000';

    logger.debug('Calling FastAPI backend', {
      component: 'ChatStreamAPI',
      apiUrl,
      model: selectedModel,
    });

    const response = await fetch(`${apiUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        developer_message: developerMessage,
        user_message: message.trim(),
        model: selectedModel, // Use validated model
        api_key: apiKey, // SECURE: Only sent server-to-server
      }),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      logger.error('FastAPI backend error', new Error(`Backend error: ${response.status}`), {
        component: 'ChatStreamAPI',
        status: response.status,
        errorText,
      });

      return new Response(
        JSON.stringify({
          error:
            response.status === 401
              ? 'Invalid API key. Please re-authenticate.'
              : `Backend error: ${response.status} - ${errorText}`,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 7. Return the streaming response directly
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        // Add model info to response headers for debugging
        'X-Model-Used': selectedModel,
      },
    });
  } catch (error) {
    logger.error('Chat stream error', error instanceof Error ? error : new Error(String(error)), {
      component: 'ChatStreamAPI',
    });

    return new Response(
      JSON.stringify({ error: 'Failed to process chat request. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
