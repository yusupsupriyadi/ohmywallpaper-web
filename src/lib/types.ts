export const CATEGORIES = ["Nature", "Space", "City", "Abstract", "Anime", "Minimal"] as const;
export type Category = (typeof CATEGORIES)[number];

export type WallpaperKind = "static" | "live";

export interface WallpaperItem {
  id: string;
  name: string;
  category: string;
  kind: WallpaperKind;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  durationSeconds: number | null;
  urlFull: string;
  urlThumb: string;
  popularity: number;
  featured: boolean;
  createdAt: string;
  source?: string;
}

export interface AdminList {
  items: WallpaperItem[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminStats {
  total: number;
  static: number;
  live: number;
  featured: number;
  downloads: number;
  categories: { category: string; count: number }[];
  recent: WallpaperItem[];
}

export interface Showcase {
  featured: WallpaperItem[];
  picks: WallpaperItem[];
}
