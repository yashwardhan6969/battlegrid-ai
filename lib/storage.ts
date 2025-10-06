export function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) as T : fallback;
  } catch {
    return fallback;
  }
}
export function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
