import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  BatteryEcoChargingIcon,
  BatteryFullIcon,
  CpuIcon,
  Download01Icon,
  FlashIcon,
  GridViewIcon,
  Image01Icon,
  LockIcon,
  MonitorDotIcon,
  PlayIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { Logo } from "../components/Logo";
import { getShowcase } from "../server/public";
import type { WallpaperItem } from "../lib/types";

export const Route = createFileRoute("/")({
  loader: () => getShowcase(),
  component: Landing,
});

/* ---------------------------------- data ---------------------------------- */

const FEATURES: { icon: IconSvgElement; tint: string; title: string; body: string }[] = [
  {
    icon: FlashIcon,
    tint: "#34d399",
    title: "Lightweight",
    body: "A native Rust engine, not a browser in disguise. Tiny installer, tiny memory footprint.",
  },
  {
    icon: Video01Icon,
    tint: "#a78bfa",
    title: "Live wallpapers",
    body: "MP4 and WebM play behind your desktop icons using the real WorkerW technique.",
  },
  {
    icon: MonitorDotIcon,
    tint: "#4c8dff",
    title: "Multiple displays",
    body: "A different wallpaper on every monitor, span mode, and DPI-correct placement.",
  },
  {
    icon: BatteryEcoChargingIcon,
    tint: "#2dd4bf",
    title: "Battery aware",
    body: "Playback pauses on battery, power saver, fullscreen apps, and the lock screen.",
  },
  {
    icon: CpuIcon,
    tint: "#fb923c",
    title: "Native Win32",
    body: "IDesktopWallpaper, DWM, and WIC — the same APIs Windows itself uses.",
  },
  {
    icon: LockIcon,
    tint: "#f472b6",
    title: "No login, no ads",
    body: "No account, no telemetry, no nags. Your desktop, your files, your business.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is OhMyWallpaper really free?",
    a: "Yes. The app and the built-in Explore catalog are free to use. No account, no trial timers, no ads.",
  },
  {
    q: "Will it slow down my PC or drain my battery?",
    a: "No. Static wallpapers are handed to Windows itself, so there is zero runtime cost. Live wallpapers pause automatically on battery, in power-saver mode, when an app runs fullscreen, and on the lock screen.",
  },
  {
    q: "Which Windows versions are supported?",
    a: "Windows 10 (1809 or newer) and Windows 11, with the WebView2 runtime — preinstalled on almost every modern machine.",
  },
  {
    q: "Can I use my own images and videos?",
    a: "Yes. Import JPEG, PNG, WebP, BMP, or GIF images and MP4 or WebM videos of any length — drag and drop them straight into the app.",
  },
  {
    q: "How do live wallpapers stay behind my desktop icons?",
    a: "The engine parents its player into the desktop's own WorkerW layer — the native technique, not an always-on-top overlay — so icons, clicks, and desktop menus keep working normally.",
  },
  {
    q: "Do I need to create an account?",
    a: "Never. Everything, including the online catalog, works without signing in.",
  },
];

/* --------------------------------- helpers -------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
      {children}
    </p>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  if (!now) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-8 text-center text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
      <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
        {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </p>
      <p className="mt-1 text-sm font-medium text-white/85">
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
    </div>
  );
}

/** A Windows desktop playing a live wallpaper, wallspace-style hero visual. */
function DesktopMockup({ video, poster }: { video: string | null; poster: string | null }) {
  return (
    <div
      id="hero-desktop-mockup"
      className="relative mx-auto aspect-[16/9] w-full max-w-md overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
    >
      {video ? (
        <video
          src={video}
          poster={poster ?? undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ background: "linear-gradient(135deg, #16233f, #0b1020 55%, #1b1030)" }}
        />
      )}
      <Clock />
      {/* Windows-style centered taskbar */}
      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        <div className="flex items-center gap-2 rounded-lg bg-black/45 px-3 py-1.5 backdrop-blur-md">
          <span className="h-3.5 w-3.5 rounded-[4px] bg-gradient-to-br from-accent to-[#7c5cff]" />
          <span className="h-3.5 w-3.5 rounded-[4px] bg-white/30" />
          <span className="h-3.5 w-3.5 rounded-[4px] bg-white/30" />
          <span className="h-3.5 w-3.5 rounded-[4px] bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item }: { item: WallpaperItem }) {
  return (
    <figure className="group relative m-0 aspect-[16/10] overflow-hidden rounded-xl border border-line bg-panel">
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
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-fg transition-colors hover:text-white"
      >
        {q}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className={`shrink-0 text-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-muted">{a}</p>}
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

function Landing() {
  const showcase = Route.useLoaderData();
  const picks: WallpaperItem[] = showcase?.picks ?? [];
  const stats = showcase?.stats ?? null;
  const gallery = [...(showcase?.featured ?? []), ...picks]
    .filter((item, i, arr) => arr.findIndex((x) => x.id === item.id) === i)
    .slice(0, 12);
  const heroLive = [...picks, ...(showcase?.featured ?? [])]
    .filter((x) => x.kind === "live")
    .sort((a, b) => (a.sizeBytes ?? 0) - (b.sizeBytes ?? 0))[0];

  const statCards = stats
    ? [
        { value: `${stats.total}+`, label: "Wallpapers in the catalog" },
        { value: stats.downloads.toLocaleString("en-US"), label: "Wallpapers downloaded" },
        { value: String(stats.live), label: "Live video wallpapers" },
        { value: String(stats.uhd), label: "True 4K wallpapers" },
        { value: String(stats.categories), label: "Curated categories" },
      ]
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ------------------------------- nav ------------------------------- */}
      <nav
        id="site-nav"
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <a href="#hero-section" className="flex items-center gap-2.5 no-underline">
            <Logo size={24} />
            <span className="text-sm font-semibold tracking-tight text-fg">OhMyWallpaper</span>
          </a>
          <div className="hidden items-center gap-7 text-[13px] text-muted sm:flex">
            <a href="#feature-grid" className="transition-colors hover:text-fg">
              Features
            </a>
            <a href="#gallery-section" className="transition-colors hover:text-fg">
              Gallery
            </a>
            <a href="#faq-section" className="transition-colors hover:text-fg">
              FAQ
            </a>
          </div>
          <a
            href="#download-section"
            className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Download
          </a>
        </div>
      </nav>

      {/* ------------------------------- hero ------------------------------ */}
      <header id="hero-section" className="relative px-5 pb-24 pt-28 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-30"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(76,141,255,0.35), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <DesktopMockup video={heroLive?.urlFull ?? null} poster={heroLive?.urlThumb ?? null} />

          <div className="mt-10 flex justify-center">
            <span className="rounded-2xl shadow-[0_0_60px_rgba(76,141,255,0.55)]">
              <Logo size={56} />
            </span>
          </div>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">OhMyWallpaper</h1>
          <h2 className="mt-2 text-xl font-medium text-muted sm:text-2xl">
            Live Wallpaper for Windows
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-faint">
            The live wallpaper app for Windows that won't touch your{" "}
            <HugeiconsIcon icon={BatteryFullIcon} size={15} className="inline text-muted" /> battery.
            Per-monitor control, native Rust engine — no subscription, low{" "}
            <HugeiconsIcon icon={CpuIcon} size={15} className="inline text-muted" /> CPU, no login.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              id="btn-download-hero"
              href="#download-section"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_4px_30px_rgba(255,255,255,0.15)] transition-transform hover:scale-[1.03]"
            >
              <HugeiconsIcon icon={Download01Icon} size={17} />
              Download for Windows
            </a>
            <a
              href="#gallery-section"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-white/5"
            >
              Browse wallpapers
            </a>
          </div>
          <p className="mt-5 text-xs text-faint">
            Free to use · Requires Windows 10 (1809+) or Windows 11 with WebView2
          </p>
        </div>
      </header>

      {/* ---------------------------- app mockup ---------------------------- */}
      <section id="app-section" className="px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>The app</Eyebrow>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            See it in action
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-muted">
            A frameless, Fluent-dark app that feels like part of Windows — browse, apply, done.
          </p>

          <div
            id="app-window-mockup"
            className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-line-strong bg-[#101113] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]"
          >
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Logo size={18} />
                <div className="ml-3 hidden items-center gap-1 rounded-full bg-white/5 p-1 sm:flex">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-fg">
                    Home
                  </span>
                  <span className="px-3 py-1 text-[11px] text-muted">Explore</span>
                  <span className="px-3 py-1 text-[11px] text-muted">Library</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-faint">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
              </div>
            </div>
            {/* content grid */}
            <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-4">
              {(gallery.length > 0 ? gallery.slice(0, 8) : Array.from({ length: 8 })).map(
                (item, i) => {
                  const w = item as WallpaperItem | undefined;
                  return (
                    <div
                      key={w?.id ?? i}
                      className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-panel"
                    >
                      {w ? (
                        <img
                          src={w.urlThumb}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            background: `linear-gradient(135deg, hsl(${i * 40 + 200},35%,16%), hsl(${i * 40 + 240},40%,8%))`,
                          }}
                        />
                      )}
                      {w?.kind === "live" && (
                        <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white">
                          Live
                        </span>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ gallery ----------------------------- */}
      <section id="gallery-section" className="px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>Gallery</Eyebrow>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Wallpapers you'll love
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-muted">
            {gallery.length > 0
              ? "A growing collection of static 4K and live wallpapers, curated for quality — served straight from the catalog."
              : "The catalog API is offline right now — launch ohmywallpaper-api to see live data here."}
          </p>
          {gallery.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------- stats ------------------------------ */}
      {statCards.length > 0 && (
        <section id="stats-section" className="px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <Eyebrow>Catalog</Eyebrow>
            <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              OhMyWallpaper in numbers
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-muted">
              Live figures from the catalog, updated as the library grows.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-line bg-gradient-to-b from-panel to-ink p-6 text-center"
                >
                  <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
                  <p className="mt-1.5 text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------ features ---------------------------- */}
      <section id="feature-grid" className="px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>Features</Eyebrow>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need.
            <br />
            <span className="text-accent">Nothing you don't.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-muted">
            OhMyWallpaper is engineered for performance, privacy, and simplicity.
          </p>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: `${f.tint}22`, color: f.tint }}
                >
                  <HugeiconsIcon icon={f.icon} size={18} />
                </span>
                <h3 className="mt-3.5 text-[15px] font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- faq ------------------------------- */}
      <section id="faq-section" className="px-5 py-20">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions? We've got answers.
          </h2>
          <div className="mt-10">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- final CTA ----------------------------- */}
      <section id="download-section" className="relative px-5 py-28 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] opacity-25"
          style={{
            background:
              "radial-gradient(55% 60% at 50% 100%, rgba(76,141,255,0.4), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-xl">
          <div className="flex justify-center">
            <span className="rounded-2xl shadow-[0_0_70px_rgba(76,141,255,0.6)]">
              <Logo size={48} />
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to transform your desktop?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
            Cinematic live wallpapers for Windows — free, light, and yours in seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <span
              id="btn-download-installer"
              className="inline-flex cursor-default items-center gap-2 rounded-full bg-white/12 px-6 py-3 text-sm font-semibold text-white/75"
            >
              <HugeiconsIcon icon={Download01Icon} size={17} />
              Installer (.exe / .msi) — coming soon
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-faint">
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={LockIcon} size={13} /> No account needed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={BatteryEcoChargingIcon} size={13} /> Battery friendly
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={GridViewIcon} size={13} /> Free catalog built in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={Image01Icon} size={13} /> Bring your own media
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------- footer ------------------------------ */}
      <footer className="border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Logo size={20} />
            <span className="text-sm font-semibold tracking-tight text-fg">OhMyWallpaper</span>
          </div>
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} YStudio · Windows is a trademark of Microsoft
            Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
