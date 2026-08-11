/** A row of the API's `categories` table — the catalog's category list is data, not a constant. */
export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  count: number;
}

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

export interface PublicStats {
  total: number;
  live: number;
  uhd: number;
  categories: number;
  downloads: number;
}
