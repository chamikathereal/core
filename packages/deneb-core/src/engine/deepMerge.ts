export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Record<string, unknown>,
  depth = 0,
  seen = new WeakSet<object>(),
): T {
  if (depth > 50) return { ...base, ...patch } as T;
  if (seen.has(patch)) return patch as unknown as T;
  seen.add(patch);

  const next = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch)) {
    if (isPlainObject(value) && isPlainObject(next[key])) {
      next[key] = deepMerge(
        next[key] as Record<string, unknown>,
        value,
        depth + 1,
        seen,
      );
    } else {
      next[key] = value;
    }
  }
  return next as T;
}
