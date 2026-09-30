export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    credentials: "include", // still needed for same-origin cookie sharing
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  // Some endpoints (like logout) may return 204; guard:
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}