import { useSyncExternalStore, useCallback } from 'react';

// A tiny global store persisted to localStorage, so the heart on a product card
// and the count in the navbar always stay in sync. (Real browser storage — this
// runs in the deployed app, not a sandbox.)
const KEY = 'bajaj:wishlist';

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

let current: string[] = typeof window !== 'undefined' ? read() : [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function write(next: string[]) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = read();
      emit();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, () => current, () => current);

  const toggle = useCallback((id: string) => {
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const clear = useCallback(() => write([]), []);

  return { ids, count: ids.length, toggle, has, clear };
}
