// JSON key/value storage that never throws (private windows and blocked storage just fall back).

function browserStorage() {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

export function createStorage(backend = browserStorage()) {
  return {
    get(key, fallback) {
      try {
        const raw = backend?.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch { return fallback; }
    },
    set(key, value) {
      try { backend?.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    },
  };
}

/** In-memory backend, useful for tests. */
export function createMemoryStorage() {
  const map = new Map();
  return createStorage({
    getItem: key => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
  });
}
