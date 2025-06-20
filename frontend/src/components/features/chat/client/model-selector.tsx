'use client';

import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { cn } from '@/lib/utils';

import { AVAILABLE_MODELS, type ModelSelectorProps } from '../chat.types';

/**
 * Displays a dropdown menu for selecting a model from a predefined list.
 *
 * Shows the current selection or a placeholder if none is chosen. The selector can be disabled and styled via props, and is fully accessible and keyboard-navigable.
 *
 * @param selectedModel - The ID of the currently selected model, or undefined to show the default.
 * @param onModelChange - Callback triggered with the new model ID when the selection changes.
 * @param disabled - If true, disables user interaction with the selector.
 * @param className - Additional CSS classes for custom styling.
 */
export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled,
  className,
}: ModelSelectorProps) {
  // Memoize the model list to prevent unnecessary re-renders
  const modelOptions = useMemo(() => AVAILABLE_MODELS, []);

  // Ensure we always have a valid selected model to prevent flickering
  const stableSelectedModel = useMemo(() => {
    return selectedModel || 'gpt-4.1-mini';
  }, [selectedModel]);

  return (
    <Select value={stableSelectedModel} onValueChange={onModelChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'h-12 w-full rounded-lg rounded-t-none rounded-l-none rounded-b-none border-none bg-white/10 text-white transition-colors duration-200 ease-in-out hover:bg-white/20 focus:border-none focus:ring-0 focus:ring-offset-0 focus:outline-none sm:w-[160px]',
          // Prevent selector from becoming invisible during state changes
          'visible opacity-100',
          className,
        )}
      >
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent className="bg-white-400 bg-opacity-50 h-full w-full rounded-md border border-white/10 bg-clip-padding text-white shadow-lg backdrop-blur-3xl backdrop-filter">
        {modelOptions.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="my-1 cursor-pointer rounded-md text-white/90 hover:text-white focus:bg-white/10 focus:text-white data-[highlighted]:text-white [highlighted]:bg-white/10"
          >
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
