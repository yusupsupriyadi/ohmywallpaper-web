import { createServerFn } from "@tanstack/react-start";
import { apiFetch, ApiError } from "./api";
import { adminToken, storeAdminToken, clearAdminToken } from "./session.server";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  return { authed: adminToken() !== null };
});

export const login = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => ({
    email: String(data.email ?? "").trim(),
    password: String(data.password ?? ""),
  }))
  .handler(async ({ data }) => {
    if (!data.email || !data.password) {
      return { ok: false as const, error: "Email and password are required" };
    }
    try {
      const res = await apiFetch<{ ok: true; token: string }>("/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      storeAdminToken(res.token);
      return { ok: true as const };
    } catch (e) {
      if (e instanceof ApiError) {
        return {
          ok: false as const,
          error: e.status === 401 ? "Invalid email or password" : e.message,
        };
      }
      return { ok: false as const, error: "API is unreachable — is ohmywallpaper-api running?" };
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  clearAdminToken();
  return { ok: true };
});
