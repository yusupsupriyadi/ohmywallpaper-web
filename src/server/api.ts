/** Server-only helpers: base URL + fetch wrapper for the ohmywallpaper-api. */

/**
 * Read per call, not at module scope: on Cloudflare Workers the var is only
 * guaranteed to be populated once a request is being handled.
 */
export const apiBase = () => process.env.API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, init);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : `API responded ${res.status}`;
    throw new ApiError(res.status, msg);
  }
  return body as T;
}
