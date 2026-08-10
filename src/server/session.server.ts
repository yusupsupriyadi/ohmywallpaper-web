/** Server-only session helpers — never imported into client bundles. */
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

const COOKIE = "omw_admin";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function adminToken(): string | null {
  return getCookie(COOKIE) ?? null;
}

export function requireAdminToken(): string {
  const token = adminToken();
  if (!token) throw redirect({ to: "/login" });
  return token;
}

export function storeAdminToken(token: string): void {
  setCookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export function clearAdminToken(): void {
  deleteCookie(COOKIE, { path: "/" });
}
