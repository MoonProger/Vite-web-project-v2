export interface HttpError extends Error {
  status?: number;
}

export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  const text = await response.text();
  const isJson = text && (text.trim().startsWith('{') || text.trim().startsWith('['));
  if (!response.ok) {
    const error: HttpError = new Error(
      `HTTP ${response.status}: ${text || response.statusText}`,
    );
    error.status = response.status;
    throw error;
  }

  return (isJson ? JSON.parse(text) : (text as unknown)) as T;
}

