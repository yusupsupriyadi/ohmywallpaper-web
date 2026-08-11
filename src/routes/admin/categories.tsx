import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Delete02Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { createCategory, deleteCategory, updateCategory } from "../../server/admin";
import { listCategories } from "../../server/public";
import type { Category } from "../../lib/types";

export const Route = createFileRoute("/admin/categories")({
  loader: () => listCategories(),
  component: Categories,
});

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong";
}

function Categories() {
  const cats = Route.useLoaderData();
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
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
    const ok = await run(() => createCategory({ data: { name } }));
    if (ok) setNewName("");
  }

  async function rename(c: Category) {
    const name = draftName.trim();
    if (!name || name === c.name) {
      setEditingId(null);
      return;
    }
    const ok = await run(() => updateCategory({ data: { id: c.id, patch: { name } } }));
    if (ok) setEditingId(null);
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
        {cats.length} categories covering {total} wallpapers. The order here is the order
        the app and the console show them in.
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

      <div id="category-list" className="mt-5 rounded-2xl border border-line bg-panel">
        {cats.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
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

            {editingId === c.id ? (
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void rename(c);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 rounded-lg border border-line bg-ink px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
            ) : (
              <span className="flex-1 text-sm font-medium">{c.name}</span>
            )}

            <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {c.count} {c.count === 1 ? "wallpaper" : "wallpapers"}
            </span>

            {editingId === c.id ? (
              <>
                <button
                  title="Save"
                  disabled={busy}
                  onClick={() => void rename(c)}
                  className="rounded-lg p-2 text-accent transition-colors hover:bg-accent-soft disabled:opacity-50"
                >
                  <HugeiconsIcon icon={Tick01Icon} size={16} />
                </button>
                <button
                  title="Cancel"
                  onClick={() => setEditingId(null)}
                  className="rounded-lg p-2 text-faint transition-colors hover:text-fg"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  title="Rename"
                  disabled={busy}
                  onClick={() => {
                    setEditingId(c.id);
                    setDraftName(c.name);
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
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-faint">
        Renaming a category moves every wallpaper in it to the new name. A category can
        only be deleted once it is empty.
      </p>

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
          onClick={() => setDeleting(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-line bg-panel-2 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
          </div>
        </div>
      )}
    </div>
  );
}
