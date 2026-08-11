import { createServerFn } from "@tanstack/react-start";
import type { AdminList, AdminStats, Category, WallpaperItem } from "../lib/types";
import { apiFetch } from "./api";
import { requireAdminToken } from "./session.server";

function authHeaders(): Record<string, string> {
  return { authorization: `Bearer ${requireAdminToken()}` };
}

export interface ListFilters {
  search?: string;
  category?: string;
  kind?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
}

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  return apiFetch<AdminStats>("/admin/stats", { headers: authHeaders() });
});

export const listWallpapers = createServerFn({ method: "GET" })
  .inputValidator((data: ListFilters) => data)
  .handler(async ({ data }) => {
    const params = new URLSearchParams({ limit: "20" });
    if (data.search) params.set("search", data.search);
    if (data.category) params.set("category", data.category);
    if (data.kind) params.set("kind", data.kind);
    if (data.featured) params.set("featured", "true");
    if (data.sort) params.set("sort", data.sort);
    if (data.page && data.page > 1) params.set("page", String(data.page));
    return apiFetch<AdminList>(`/admin/wallpapers?${params}`, { headers: authHeaders() });
  });

export const createWallpaper = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true; item: WallpaperItem }>("/admin/wallpapers", {
      method: "POST",
      headers: authHeaders(),
      body: data,
    });
  });

export const updateWallpaper = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id: string;
      patch: { name?: string; category?: string; featured?: boolean; popularity?: number };
    }) => data,
  )
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true; item: WallpaperItem }>(`/admin/wallpapers/${data.id}`, {
      method: "PATCH",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify(data.patch),
    });
  });

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true; item: Category }>("/admin/categories", {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify({ name: data.name }),
    });
  });

export interface CategoryPatch {
  name?: string;
  sortOrder?: number;
  description?: string | null;
  accent?: string | null;
  coverWallpaperId?: string | null;
}

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; patch: CategoryPatch }) => data)
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true; item: Category }>(`/admin/categories/${data.id}`, {
      method: "PATCH",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify(data.patch),
    });
  });

/** Derive an accent from a cover image without saving it — for previewing in the editor. */
export const autoAccent = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; wallpaperId: string | null }) => data)
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true; accent: string }>(`/admin/categories/${data.id}/accent`, {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify({ wallpaperId: data.wallpaperId }),
    });
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true }>(`/admin/categories/${data.id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  });

export const deleteWallpaper = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiFetch<{ ok: true; orphans: string[] }>(`/admin/wallpapers/${data.id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  });
