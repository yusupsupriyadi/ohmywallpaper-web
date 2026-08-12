import { createServerFn } from "@tanstack/react-start";
import type { Category, PublicStats, Showcase } from "../lib/types";
import { apiFetch } from "./api";

/** Catalog categories, ordered by the API; empty when it is unreachable. */
export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const res = await apiFetch<{ items: Category[] }>("/categories");
  return res.items;
});

/** Fisher-Yates on a copy, so the caller's array is left alone. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Landing-page catalog preview + stats; null when the API is unreachable so the page still renders. */
export const getShowcase = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const [showcase, stats] = await Promise.all([
      // 30 = the landing gallery's two marquee rows of 15 unique wallpapers each.
      apiFetch<Showcase>("/featured?limit=30"),
      apiFetch<PublicStats>("/stats").catch(() => null),
    ]);
    // The gallery gets a fresh order per load. It has to happen here and not while
    // rendering: the loader's result is what gets serialized into the SSR payload, so
    // shuffling in the component would hand the client a different order than the
    // server-rendered markup and break hydration.
    return { ...showcase, featured: shuffle(showcase.featured ?? []), stats };
  } catch {
    return null;
  }
});
