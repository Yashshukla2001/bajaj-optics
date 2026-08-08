import { useSyncExternalStore, useCallback } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'bajaj:theme';
const listeners = new Set<() => void>();

function current(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore private-mode errors */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Dark/light theme, persisted and applied to <html data-theme>. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'dark' as Theme);
  const toggle = useCallback(() => apply(current() === 'dark' ? 'light' : 'dark'), []);
  const set = useCallback((t: Theme) => apply(t), []);
  return { theme, toggle, set };
}
