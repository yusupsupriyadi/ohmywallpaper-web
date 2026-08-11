import { createServerFn } from "@tanstack/react-start";
import type { Category, PublicStats, Showcase } from "../lib/types";
import { apiFetch } from "./api";

/** Catalog categories, ordered by the API; empty when it is unreachable. */
export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const res = await apiFetch<{ items: Category[] }>("/categories");
  return res.items;
});

/** Landing-page catalog preview + stats; null when the API is unreachable so the page still renders. */
export const getShowcase = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const [showcase, stats] = await Promise.all([
      apiFetch<Showcase>("/featured"),
      apiFetch<PublicStats>("/stats").catch(() => null),
    ]);
    return { ...showcase, stats };
  } catch {
    return null;
  }
});
