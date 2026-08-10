import { Link, createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download01Icon,
  Image01Icon,
  StarIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { getStats } from "../../server/admin";
import { timeAgo } from "../../lib/format";

export const Route = createFileRoute("/admin/")({
  loader: () => getStats(),
  component: Dashboard,
});

function Dashboard() {
  const stats = Route.useLoaderData();

  const cards = [
    { label: "Static wallpapers", value: stats.static, icon: Image01Icon },
    { label: "Live wallpapers", value: stats.live, icon: Video01Icon },
    { label: "Featured", value: stats.featured, icon: StarIcon },
    { label: "Total downloads", value: stats.downloads.toLocaleString("en-US"), icon: Download01Icon },
  ];
  const maxCategory = Math.max(1, ...stats.categories.map((c) => c.count));

  return (
    <div id="admin-dashboard" className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        {stats.total} wallpapers in the catalog.
      </p>

      <div id="stat-card-list" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-panel p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <HugeiconsIcon icon={c.icon} size={18} />
            </span>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{c.value}</p>
            <p className="mt-0.5 text-xs text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-line bg-panel p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">By category</h2>
          <div className="mt-5 flex flex-col gap-3.5">
            {stats.categories.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg">{c.category}</span>
                  <span className="text-muted">{c.count}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-[#7c5cff]"
                    style={{ width: `${(c.count / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recently added</h2>
            <Link to="/admin/wallpapers" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            {stats.recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-ink/50 p-2.5"
              >
                <img
                  src={item.urlThumb}
                  alt=""
                  className="h-11 w-[70px] shrink-0 rounded-lg border border-line object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.category} · {item.kind === "live" ? "Live" : "Static"}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-faint">{timeAgo(item.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
