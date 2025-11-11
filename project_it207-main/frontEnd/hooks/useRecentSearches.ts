import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = '@recent_searches';

export function useRecentSearches(maxItems = 6) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(RECENT_KEY);
        if (raw) setRecent(JSON.parse(raw));
      } catch (e) {
      }
    })();
  }, []);

  const save = useCallback(
    async (term: string) => {
      try {
        if (!term || !term.trim()) return;
        const trimmed = term.trim();
        const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, maxItems);
        setRecent(next);
        await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch (e) {
      }
    },
    [recent, maxItems]
  );

  const clear = useCallback(async () => {
    try {
      setRecent([]);
      await AsyncStorage.removeItem(RECENT_KEY);
    } catch (e) {
    }
  }, []);

  return { recent, saveRecent: save, clearRecent: clear } as const;
}
