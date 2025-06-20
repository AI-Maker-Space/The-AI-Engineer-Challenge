/**
 * Environment variable check utility
 * Helps diagnose configuration issues
 */

import { logger } from './logger';

/**
 * Checks for the presence of required environment variables and provides suggestions for missing ones.
 *
 * @returns An object containing a boolean indicating if all required variables are present (`isValid`), an array of missing variable names (`missing`), and suggestions for adding any missing variables (`suggestions`).
 */
export function checkEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
  suggestions: string[];
} {
  const required = ['SESSION_SECRET', 'ENCRYPTION_SECRET'];
  const missing: string[] = [];
  const suggestions: string[] = [];

  for (const envVar of required) {
    if (!process.env[envVar]) {
      missing.push(envVar);
      suggestions.push(`Add ${envVar}=your-secret-here to your environment`);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    suggestions,
  };
}

/**
 * Logs the status of required environment variables when running in development mode.
 *
 * Checks for the presence of required environment variables and logs a success message if all are set. If any are missing, logs an error with details and suggestions, and provides additional guidance for Doppler users. No action is taken outside of development mode.
 */
export function logEnvironmentStatus(): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const check = checkEnvironmentVariables();

  if (check.isValid) {
    logger.success('Environment variables configured correctly', {
      component: 'EnvCheck',
    });
  } else {
    logger.error('Missing environment variables', new Error('Configuration error'), {
      component: 'EnvCheck',
      missing: check.missing,
      suggestions: check.suggestions,
    });
    logger.info('If using Doppler, ensure your secrets are properly loaded', {
      component: 'EnvCheck',
    });
  }
}
