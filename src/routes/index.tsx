import { createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BatteryEcoChargingIcon,
  CpuChargeIcon,
  Download01Icon,
  GridViewIcon,
  Image01Icon,
  MonitorDotIcon,
  PlayIcon,
  ShuffleIcon,
  SparklesIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { Wordmark } from "../components/Logo";
import { getShowcase } from "../server/public";
import type { WallpaperItem } from "../lib/types";

export const Route = createFileRoute("/")({
  loader: () => getShowcase(),
  component: Landing,
});

const FEATURES = [
  {
    icon: Video01Icon,
    title: "Live video wallpapers",
    body: "MP4 and WebM rendered behind your desktop icons with the native WorkerW technique — not an overlay hack.",
  },
  {
    icon: MonitorDotIcon,
    title: "Per-monitor control",
    body: "Different wallpapers per display, span mode, and DPI-correct placement on mixed-resolution setups.",
  },
  {
    icon: GridViewIcon,
    title: "Explore catalog",
    body: "Browse a curated online library — 4K and QHD statics plus live loops — and apply in one click.",
  },
  {
    icon: BatteryEcoChargingIcon,
    title: "Battery aware",
    body: "Playback pauses automatically on battery, power saver, fullscreen apps, and the lock screen.",
  },
  {
    icon: CpuChargeIcon,
    title: "Native & light",
    body: "A Rust engine talking straight to Win32 — IDesktopWallpaper, DWM, WIC. No Electron, no bloat.",
  },
  {
    icon: ShuffleIcon,
    title: "Shuffle & collections",
    body: "Organize your library into collections and rotate wallpapers on a schedule you pick.",
  },
];

function Landing() {
  const showcase = Route.useLoaderData();
  const picks: WallpaperItem[] = showcase?.picks ?? [];
  const heroTiles = picks.slice(0, 6);
  const gallery = [...(showcase?.featured ?? []), ...picks]
    .filter((item, i, arr) => arr.findIndex((x) => x.id === item.id) === i)
    .slice(0, 12);

  return (
    <div className="min-h-screen">
      <nav
        id="site-nav"
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/75 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#hero-section" className="no-underline">
            <Wordmark />
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted sm:flex">
            <a href="#feature-grid" className="transition-colors hover:text-fg">
              Features
            </a>
            <a href="#gallery-section" className="transition-colors hover:text-fg">
              Gallery
            </a>
          </div>
          <a
            href="#download-section"
            className="rounded-lg border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            Download
          </a>
        </div>
      </nav>

      <header id="hero-section" className="relative overflow-hidden px-5 pb-20 pt-36">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[840px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #4c8dff, transparent)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs text-muted">
              <HugeiconsIcon icon={SparklesIcon} size={14} className="text-accent" />
              Native wallpaper manager for Windows 10 & 11
            </span>
            <h1 className="mt-6 animate-fade-up text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              Your desktop,{" "}
              <span className="bg-gradient-to-r from-accent to-[#9a6dff] bg-clip-text text-transparent">
                alive
              </span>
              .
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Static 4K wallpapers and looping live video, per monitor, from a Rust engine
              that feels like part of Windows — because it talks to Windows directly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                id="btn-download-hero"
                href="#download-section"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(76,141,255,0.4)] transition-transform hover:scale-[1.02]"
              >
                <HugeiconsIcon icon={Download01Icon} size={18} />
                Download for Windows
              </a>
              <a
                href="#gallery-section"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-line-strong"
              >
                <HugeiconsIcon icon={Image01Icon} size={18} className="text-muted" />
                Browse the gallery
              </a>
            </div>
          </div>

          {heroTiles.length > 0 && (
            <div id="hero-collage" className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {heroTiles.map((item, i) => (
                <div
                  key={item.id}
                  className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-panel"
                  style={{ animation: `fade-up 0.6s ${i * 0.06}s ease both` }}
                >
                  <img
                    src={item.urlThumb}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.kind === "live" && (
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                      <HugeiconsIcon icon={PlayIcon} size={10} />
                      Live
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-white/60">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <section id="feature-grid" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Everything a wallpaper app should be
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted">
            Built Windows-first with the real OS APIs, so it stays fast, correct, and out of
            your way.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <HugeiconsIcon icon={f.icon} size={20} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery-section" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">From the catalog</h2>
              <p className="mt-2 text-muted">
                {gallery.length > 0
                  ? "A live sample of what Explore serves inside the app."
                  : "The catalog API is offline right now — launch ohmywallpaper-api to see live data here."}
              </p>
            </div>
          </div>
          {gallery.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((item) => (
                <figure
                  key={item.id}
                  className="group relative m-0 aspect-[16/10] overflow-hidden rounded-xl border border-line bg-panel"
                >
                  <img
                    src={item.urlThumb}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.kind === "live" && (
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                      <HugeiconsIcon icon={PlayIcon} size={10} />
                      Live
                    </span>
                  )}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-white/60">{item.category}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="download-section" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-panel p-10 text-center sm:p-14">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(closest-side, #4c8dff, transparent)" }}
            />
            <h2 className="relative text-3xl font-semibold tracking-tight">
              Get OhMyWallpaper
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-muted">
              Requires Windows 10 (1809+) or Windows 11 with WebView2.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <span
                id="btn-download-installer"
                className="inline-flex cursor-default items-center gap-2 rounded-xl bg-accent/40 px-5 py-3 text-sm font-semibold text-white/70"
              >
                <HugeiconsIcon icon={Download01Icon} size={18} />
                Installer (.exe / .msi) — coming soon
              </span>
            </div>
            <p className="relative mt-5 text-xs text-faint">
              A tiny native installer — a few MB, not a few hundred.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Wordmark size={22} />
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} YStudio · Windows is a trademark of Microsoft
            Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
