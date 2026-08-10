import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Delete02Icon,
  PencilEdit02Icon,
  PlayIcon,
  Search01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { deleteWallpaper, listWallpapers, updateWallpaper } from "../../server/admin";
import { CATEGORIES, type WallpaperItem } from "../../lib/types";
import { formatBytes, formatDuration, formatResolution } from "../../lib/format";

interface Filters {
  q?: string;
  category?: string;
  kind?: string;
  page?: number;
}

export const Route = createFileRoute("/admin/wallpapers")({
  validateSearch: (search: Record<string, unknown>): Filters => ({
    q: typeof search.q === "string" && search.q !== "" ? search.q : undefined,
    category:
      typeof search.category === "string" && search.category !== ""
        ? search.category
        : undefined,
    kind: search.kind === "static" || search.kind === "live" ? search.kind : undefined,
    page: typeof search.page === "number" && search.page > 1 ? search.page : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    listWallpapers({
      data: { search: deps.q, category: deps.category, kind: deps.kind, page: deps.page },
    }),
  component: Wallpapers,
});

function Wallpapers() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const [editing, setEditing] = useState<WallpaperItem | null>(null);
  const [deleting, setDeleting] = useState<WallpaperItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [q, setQ] = useState(search.q ?? "");

  useEffect(() => setQ(search.q ?? ""), [search.q]);

  const pages = Math.max(1, Math.ceil(data.total / data.limit));

  function setFilter(patch: Partial<Filters>) {
    navigate({ search: (prev: Filters) => ({ ...prev, page: undefined, ...patch }) });
  }

  async function toggleFeatured(item: WallpaperItem) {
    setBusyId(item.id);
    try {
      await updateWallpaper({ data: { id: item.id, patch: { featured: !item.featured } } });
      await router.invalidate();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div id="admin-wallpapers" className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Wallpapers</h1>
          <p className="mt-1 text-sm text-muted">{data.total} items match.</p>
        </div>
        <form
          className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3.5 focus-within:border-accent"
          onSubmit={(e) => {
            e.preventDefault();
            setFilter({ q: q.trim() || undefined });
          }}
        >
          <HugeiconsIcon icon={Search01Icon} size={16} className="shrink-0 text-faint" />
          <input
            id="input-search-wallpapers"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or source…"
            className="w-56 bg-transparent py-2.5 text-sm outline-none placeholder:text-faint"
          />
        </form>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <FilterChip
          active={!search.kind}
          label="All kinds"
          onClick={() => setFilter({ kind: undefined })}
        />
        <FilterChip
          active={search.kind === "static"}
          label="Static"
          onClick={() => setFilter({ kind: "static" })}
        />
        <FilterChip
          active={search.kind === "live"}
          label="Live"
          onClick={() => setFilter({ kind: "live" })}
        />
        <span className="mx-1 h-5 w-px bg-line" />
        <FilterChip
          active={!search.category}
          label="All categories"
          onClick={() => setFilter({ category: undefined })}
        />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={search.category === c}
            label={c}
            onClick={() => setFilter({ category: c })}
          />
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
              <th className="px-5 py-3.5 font-medium">Wallpaper</th>
              <th className="px-3 py-3.5 font-medium">Category</th>
              <th className="px-3 py-3.5 font-medium">Details</th>
              <th className="px-3 py-3.5 font-medium">Downloads</th>
              <th className="px-3 py-3.5 text-center font-medium">Featured</th>
              <th className="px-5 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-line/60 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-[70px] shrink-0 overflow-hidden rounded-lg border border-line">
                      <img src={item.urlThumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                      {item.kind === "live" && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/70 p-0.5 text-white">
                          <HugeiconsIcon icon={PlayIcon} size={9} />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate font-medium">{item.name}</p>
                      <p className="max-w-[220px] truncate text-xs text-faint">{item.source}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted">{item.category}</td>
                <td className="px-3 py-3 text-xs text-muted">
                  {formatResolution(item.width, item.height)}
                  <br />
                  {formatBytes(item.sizeBytes)}
                  {item.kind === "live" ? ` · ${formatDuration(item.durationSeconds)}` : ""}
                </td>
                <td className="px-3 py-3 text-muted">{item.popularity.toLocaleString("en-US")}</td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => toggleFeatured(item)}
                    disabled={busyId === item.id}
                    title={item.featured ? "Unfeature" : "Feature on Home"}
                    className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 ${
                      item.featured ? "text-amber-400" : "text-faint hover:text-fg"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={17}
                      fill={item.featured ? "currentColor" : "none"}
                    />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing(item)}
                      title="Edit"
                      className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(item)}
                      title="Delete"
                      className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-danger/60 hover:text-danger"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted">
                  Nothing matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            disabled={(search.page ?? 1) <= 1}
            onClick={() =>
              navigate({ search: (p: Filters) => ({ ...p, page: (search.page ?? 1) - 1 <= 1 ? undefined : (search.page ?? 1) - 1 }) })
            }
            className="rounded-lg border border-line p-2 text-muted transition-colors hover:text-fg disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </button>
          <span className="text-sm text-muted">
            Page {search.page ?? 1} of {pages}
          </span>
          <button
            disabled={(search.page ?? 1) >= pages}
            onClick={() => navigate({ search: (p: Filters) => ({ ...p, page: (search.page ?? 1) + 1 }) })}
            className="rounded-lg border border-line p-2 text-muted transition-colors hover:text-fg disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>
      )}

      {editing && (
        <EditDialog
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await router.invalidate();
          }}
        />
      )}
      {deleting && (
        <DeleteDialog
          item={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={async () => {
            setDeleting(null);
            await router.invalidate();
          }}
        />
      )}
    </div>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-accent/50 bg-accent-soft text-accent"
          : "border-line text-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {label}
    </button>
  );
}

function Dialog({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-panel-2 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function EditDialog({
  item,
  onClose,
  onSaved,
}: {
  item: WallpaperItem;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [featured, setFeatured] = useState(item.featured);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await updateWallpaper({
        data: { id: item.id, patch: { name: name.trim(), category, featured } },
      });
      await onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      setBusy(false);
    }
  }

  return (
    <Dialog onClose={onClose}>
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">Edit wallpaper</h2>
        <button onClick={onClose} className="rounded-lg p-1 text-faint hover:text-fg">
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>
      </div>
      <img
        src={item.urlThumb}
        alt=""
        className="mt-4 aspect-[16/10] w-full rounded-xl border border-line object-cover"
      />
      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm outline-none focus:border-accent"
      />
      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Category
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm outline-none focus:border-accent"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-[#4c8dff]"
        />
        Featured on the app's Home screen
      </label>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-xl border border-line px-4 py-2.5 text-sm text-muted hover:text-fg"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={busy || name.trim() === ""}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </Dialog>
  );
}

function DeleteDialog({
  item,
  onClose,
  onDeleted,
}: {
  item: WallpaperItem;
  onClose: () => void;
  onDeleted: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      await deleteWallpaper({ data: { id: item.id } });
      await onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <Dialog onClose={onClose}>
      <h2 className="text-lg font-semibold">Delete “{item.name}”?</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        This removes the catalog entry and its files from R2 storage. Users who already
        downloaded it keep their local copy. This cannot be undone.
      </p>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-xl border border-line px-4 py-2.5 text-sm text-muted hover:text-fg"
        >
          Cancel
        </button>
        <button
          id="btn-confirm-delete"
          onClick={confirm}
          disabled={busy}
          className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Dialog>
  );
}
