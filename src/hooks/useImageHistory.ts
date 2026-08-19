import { useCallback, useEffect, useState } from 'react';
import type { GeneratedImage } from '@/types';

const STORAGE_KEY = 't2i_history';
const MAX_HISTORY = 24;

function loadHistory(): GeneratedImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeneratedImage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useImageHistory() {
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addImage = useCallback((image: GeneratedImage) => {
    setHistory((prev) => {
      const next = [image, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full — silently drop
      }
      return next;
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((img) => img.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { history, addImage, removeImage, clearHistory };
}
