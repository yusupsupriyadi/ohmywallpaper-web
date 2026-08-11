import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  ColorsIcon,
  Delete02Icon,
  Image01Icon,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import {
  autoAccent,
  createCategory,
  deleteCategory,
  listWallpapers,
  updateCategory,
  type CategoryPatch,
} from "../../server/admin";
import { listCategories } from "../../server/public";
import type { Category, WallpaperItem } from "../../lib/types";

export const Route = createFileRoute("/admin/categories")({
  loader: () => listCategories(),
  component: Categories,
});

const DEFAULT_ACCENT = "#4c8dff";

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong";
}

function Categories() {
  const cats = Route.useLoaderData();
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cats.reduce((sum, c) => sum + c.count, 0);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await router.invalidate();
      return true;
    } catch (e) {
      setError(errorText(e));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function add() {
    const name = newName.trim();
    if (!name) return;
    if (await run(() => createCategory({ data: { name } }))) setNewName("");
  }

  /** Swap sort_order with the neighbour; the guard keeps a tie from being a no-op. */
  async function move(index: number, dir: -1 | 1) {
    const a = cats[index];
    const b = cats[index + dir];
    if (!b) return;
    const aOrder = a.sortOrder === b.sortOrder ? b.sortOrder + dir : b.sortOrder;
    await run(async () => {
      await updateCategory({ data: { id: a.id, patch: { sortOrder: aOrder } } });
      await updateCategory({ data: { id: b.id, patch: { sortOrder: a.sortOrder } } });
    });
  }

  return (
    <div id="admin-categories" className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-1 text-sm text-muted">
        {cats.length} categories covering {total} wallpapers. Cover, colour and tagline
        drive how each one looks in the app — no code change needed.
      </p>

      <form
        id="form-add-category"
        className="mt-6 flex gap-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <input
          id="input-new-category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name…"
          className="flex-1 rounded-xl border border-line bg-panel px-3.5 py-2.5 text-sm outline-none placeholder:text-faint focus:border-accent"
        />
        <button
          id="btn-add-category"
          type="submit"
          disabled={busy || newName.trim() === ""}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Add
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <div id="category-list" className="mt-5 flex flex-col gap-2.5">
        {cats.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3.5 overflow-hidden rounded-2xl border border-line bg-panel p-3"
            style={{
              backgroundImage: `linear-gradient(90deg, ${c.accent ?? DEFAULT_ACCENT}22, transparent 55%)`,
            }}
          >
            <div className="flex shrink-0 flex-col">
              <button
                title="Move up"
                disabled={busy || i === 0}
                onClick={() => void move(i, -1)}
                className="rounded p-0.5 text-faint transition-colors hover:text-fg disabled:opacity-30 disabled:hover:text-faint"
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="rotate-180" />
              </button>
              <button
                title="Move down"
                disabled={busy || i === cats.length - 1}
                onClick={() => void move(i, 1)}
                className="rounded p-0.5 text-faint transition-colors hover:text-fg disabled:opacity-30 disabled:hover:text-faint"
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
              </button>
            </div>

            <div
              className="h-12 w-20 shrink-0 overflow-hidden rounded-xl border bg-ink"
              style={{ borderColor: c.accent ?? "var(--color-line)" }}
            >
              {c.coverThumb ? (
                <img src={c.coverThumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-faint">
                  <HugeiconsIcon icon={Image01Icon} size={16} />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold">
                {c.name}
                {c.coverWallpaperId === null && c.coverThumb && (
                  <span className="rounded-full border border-line px-1.5 py-0.5 text-[10px] font-medium text-faint">
                    auto cover
                  </span>
                )}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {c.description ?? <span className="text-faint">No tagline yet</span>}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {c.count}
            </span>
            <button
              title="Edit"
              disabled={busy}
              onClick={() => {
                setEditing(c);
                setError(null);
              }}
              className="rounded-lg p-2 text-faint transition-colors hover:text-fg disabled:opacity-50"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
            </button>
            <button
              title={
                c.count > 0
                  ? "Move its wallpapers to another category first"
                  : "Delete category"
              }
              disabled={busy || c.count > 0}
              onClick={() => setDeleting(c)}
              className="rounded-lg p-2 text-faint transition-colors hover:text-danger disabled:opacity-30 disabled:hover:text-faint"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-faint">
        Renaming a category moves every wallpaper in it to the new name. A category can
        only be deleted once it is empty.
      </p>

      {editing && (
        <EditCategoryDialog
          category={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await router.invalidate();
          }}
        />
      )}

      {deleting && (
        <Dialog onClose={() => setDeleting(null)}>
          <h2 className="text-lg font-semibold">Delete category</h2>
          <p className="mt-2 text-sm text-muted">
            Remove <span className="text-fg">{deleting.name}</span> from the catalog's
            category list? This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setDeleting(null)}
              className="rounded-xl border border-line px-4 py-2.5 text-sm text-muted hover:text-fg"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-delete-category"
              disabled={busy}
              onClick={async () => {
                const id = deleting.id;
                setDeleting(null);
                await run(() => deleteCategory({ data: { id } }));
              }}
              className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function Dialog({
  children,
  onClose,
  wide = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-line bg-panel-2 p-6 shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function EditCategoryDialog({
  category,
  onClose,
  onSaved,
}: {
  category: Category;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [accent, setAccent] = useState(category.accent ?? DEFAULT_ACCENT);
  const [hasAccent, setHasAccent] = useState(category.accent !== null);
  const [coverId, setCoverId] = useState<string | null>(category.coverWallpaperId);
  const [choices, setChoices] = useState<WallpaperItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // the cover picker only makes sense with this category's own wallpapers
  useEffect(() => {
    let alive = true;
    listWallpapers({ data: { category: category.name } })
      .then((res) => alive && setChoices(res.items))
      .catch(() => alive && setChoices([]));
    return () => {
      alive = false;
    };
  }, [category.name]);

  async function pickAccentFromCover() {
    setBusy(true);
    setError(null);
    try {
      const res = await autoAccent({ data: { id: category.id, wallpaperId: coverId } });
      setAccent(res.accent);
      setHasAccent(true);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError(null);
    const patch: CategoryPatch = {
      name: name.trim(),
      description: description.trim() || null,
      accent: hasAccent ? accent : null,
      coverWallpaperId: coverId,
    };
    try {
      await updateCategory({ data: { id: category.id, patch } });
      await onSaved();
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  const preview = choices?.find((w) => w.id === coverId)?.urlThumb ?? category.coverThumb;

  return (
    <Dialog onClose={onClose} wide>
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">Edit category</h2>
        <button onClick={onClose} className="rounded-lg p-1 text-faint hover:text-fg">
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>
      </div>

      <div
        className="mt-4 flex h-32 items-end rounded-2xl border border-line bg-ink p-4"
        style={{
          backgroundImage: `linear-gradient(90deg, ${accent}cc, ${accent}22 45%, transparent 70%)${
            preview ? `, url(${preview})` : ""
          }`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Category
          </p>
          <p className="text-2xl font-bold text-white drop-shadow">{name || "Untitled"}</p>
          {description && <p className="text-xs text-white/75">{description}</p>}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-faint">Roughly how the app renders this category.</p>

      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm outline-none focus:border-accent"
      />

      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Tagline
      </label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="One line shown under the title, e.g. “Knights, ruins and rain.”"
        className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm outline-none placeholder:text-faint focus:border-accent"
      />

      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Accent colour
      </label>
      <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
        <input
          type="color"
          value={accent}
          onChange={(e) => {
            setAccent(e.target.value);
            setHasAccent(true);
          }}
          className="h-10 w-14 cursor-pointer rounded-xl border border-line bg-ink p-1"
        />
        <input
          value={accent}
          onChange={(e) => {
            setAccent(e.target.value);
            setHasAccent(true);
          }}
          className="w-28 rounded-xl border border-line bg-ink px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => void pickAccentFromCover()}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50"
        >
          <HugeiconsIcon icon={ColorsIcon} size={16} />
          Pick from cover
        </button>
        {hasAccent && (
          <button
            type="button"
            onClick={() => {
              setHasAccent(false);
              setAccent(DEFAULT_ACCENT);
            }}
            className="text-xs text-faint underline-offset-2 hover:text-fg hover:underline"
          >
            Use app default
          </button>
        )}
      </div>

      <label className="mt-5 block text-xs font-medium uppercase tracking-wide text-muted">
        Cover
      </label>
      {choices === null ? (
        <p className="mt-2 text-sm text-faint">Loading wallpapers…</p>
      ) : choices.length === 0 ? (
        <p className="mt-2 text-sm text-faint">
          This category has no wallpapers yet, so it has no cover to pick.
        </p>
      ) : (
        <div className="mt-2 grid grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => setCoverId(null)}
            className={`flex aspect-[16/10] items-center justify-center rounded-lg border text-[11px] font-medium transition-colors ${
              coverId === null
                ? "border-accent bg-accent-soft text-accent"
                : "border-line text-faint hover:border-line-strong hover:text-fg"
            }`}
          >
            Auto
          </button>
          {choices.map((w) => (
            <button
              key={w.id}
              type="button"
              title={w.name}
              onClick={() => setCoverId(w.id)}
              className={`aspect-[16/10] overflow-hidden rounded-lg border transition-colors ${
                coverId === w.id ? "border-accent" : "border-line hover:border-line-strong"
              }`}
            >
              <img src={w.urlThumb} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-faint">
        Auto follows the category's most popular wallpaper, so it keeps itself current.
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
          id="btn-save-category"
          disabled={busy || name.trim() === ""}
          onClick={() => void save()}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </Dialog>
  );
}
