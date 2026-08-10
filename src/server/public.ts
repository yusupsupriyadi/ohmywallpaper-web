import { createServerFn } from "@tanstack/react-start";
import type { Showcase } from "../lib/types";
import { apiFetch } from "./api";

/** Landing-page catalog preview; null when the API is unreachable so the page still renders. */
export const getShowcase = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await apiFetch<Showcase>("/featured");
  } catch {
    return null;
  }
});
