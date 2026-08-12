'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions {
  key: string;
  data: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  interval?: number;
  enabled?: boolean;
}

export function useAutoSave({
  key,
  data,
  onSave,
  interval = 30000,
  enabled = true,
}: UseAutoSaveOptions) {
  const lastSavedRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(() => {
    const serialized = JSON.stringify(data);
    if (serialized !== lastSavedRef.current && data.title && data.content) {
      lastSavedRef.current = serialized;
      onSave(data);
    }
  }, [data, onSave]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => save();

    window.addEventListener('beforeunload', handleBeforeUnload);

    timeoutRef.current = setInterval(save, interval);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [enabled, interval, save]);

  return { save };
}
