// Base client for talking to api-server. Right now api-server only exposes
// a /health route, so this is intentionally minimal — Phase 2 will add real
// endpoints (auth, menu, reservations, orders) and this file will grow
// matching React Query hooks (useMenuItems, useCreateReservation, etc.)
// built on top of this same `apiFetch` helper.

const API_BASE_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }

  // Handle empty responses (e.g. 204 No Content)
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
