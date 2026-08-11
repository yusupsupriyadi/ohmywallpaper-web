import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getShowcase } from "../server/public";
import type { WallpaperItem } from "../lib/types";

export const Route = createFileRoute("/")({
  loader: () => getShowcase(),
  component: Landing,
});

/* --------------------------------- tokens --------------------------------- */

/** Frosted panel used by the feature/review cards. */
const GLASS_CARD: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background:
    "linear-gradient(180deg,rgba(255,255,255,0.085),rgba(255,255,255,0.028))",
  backdropFilter: "blur(24px) saturate(170%)",
  WebkitBackdropFilter: "blur(24px) saturate(170%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.22),0 16px 40px rgba(0,0,0,0.35)",
};

/** Frosted pill used by the eyebrow badge and the hero perf chips. */
const GLASS_PILL: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background:
    "linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.05))",
  backdropFilter: "blur(18px) saturate(180%)",
  WebkitBackdropFilter: "blur(18px) saturate(180%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.26),0 6px 16px rgba(0,0,0,0.25)",
};

/** Frosted secondary button. */
const GLASS_BUTTON: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.16)",
  background:
    "linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.055))",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3),0 10px 26px rgba(0,0,0,0.3)",
};

const MARQUEE_MASK: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
  maskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
};

const H2 = "font-display text-[clamp(36px,5vw,62px)] font-semibold leading-[1.02] tracking-[-0.032em]";
const EYEBROW = "mb-[18px] text-xs font-bold uppercase tracking-[0.16em] text-[#4aa8ff]";
const LEAD = "text-[15.5px] leading-[1.58] text-[#8f8f99] text-pretty";
const CTA_LIGHT =
  "inline-flex items-center gap-2.5 rounded-full bg-[#f4f4f6] text-[#0a0a0c] text-[15px] font-semibold shadow-[0_8px_30px_rgba(255,255,255,0.10)] transition-transform hover:scale-[1.02]";

/* ---------------------------------- data ---------------------------------- */

const PERF_CHIPS = [
  "Low CPU",
  "Low GPU",
  "Battery friendly",
  "Just 5 MB RAM",
  "1 FPS when Windows is locked or an app is open",
];

const FEATURES: {
  title: string;
  body: string;
  gradient: string;
  glyph: React.ReactNode;
}[] = [
  {
    title: "True 4K and QHD",
    body: "Every wallpaper ships at 3840×2160 and 2560×1440, so nothing arrives stretched or resampled on your monitor.",
    gradient: "linear-gradient(135deg,#3b82f6,#22d3ee)",
    glyph: (
      <span className="font-display text-[13px] font-bold text-[#04121f]">4K</span>
    ),
  },
  {
    title: "Live, without the cost",
    body: "Looping video backgrounds that stop rendering the second a window covers them. Your GPU stays free for games.",
    gradient: "linear-gradient(135deg,#a855f7,#ff5fa2)",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
        <polygon points="9.5,1 3,9.8 8,9.8 7,16 14,7.2 9,7.2" fill="#1a0716" />
      </svg>
    ),
  },
  {
    title: "Categories that make sense",
    body: "Nature, Space, City, Abstract, Anime, Minimal, Dark. Browse by mood instead of digging through tag soup.",
    gradient: "linear-gradient(135deg,#22c55e,#84cc16)",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
        <rect x="1" y="1" width="6.6" height="6.6" rx="1.6" fill="#06210f" />
        <rect x="9.4" y="1" width="6.6" height="6.6" rx="1.6" fill="#06210f" />
        <rect x="1" y="9.4" width="6.6" height="6.6" rx="1.6" fill="#06210f" />
        <rect x="9.4" y="9.4" width="6.6" height="6.6" rx="1.6" fill="#06210f" />
      </svg>
    ),
  },
  {
    title: "One click to set",
    body: "Preview full screen, press Set Wallpaper. No saving files, no right-click menus, no Settings detour.",
    gradient: "linear-gradient(135deg,#f97316,#facc15)",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
        <rect x="0.8" y="2.4" width="15.4" height="10.2" rx="1.8" fill="#241002" />
        <rect x="5.6" y="14" width="5.8" height="1.7" rx="0.85" fill="#241002" />
      </svg>
    ),
  },
  {
    title: "Your library, offline",
    body: "Favourite anything and it stays on your PC. Once downloaded, wallpapers work with no connection at all.",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="7.2" fill="none" stroke="#0d0824" strokeWidth="2.4" />
        <circle cx="8.5" cy="8.5" r="2.4" fill="#0d0824" />
      </svg>
    ),
  },
  {
    title: "No ads, no account",
    body: "Nothing to sign up for, nothing tracked, nothing sold. Install it and it simply runs.",
    gradient: "linear-gradient(135deg,#e11d48,#fb7185)",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
        <rect x="2.6" y="7.2" width="11.8" height="8.4" rx="2" fill="#2a0410" />
        <path
          d="M5.4 7.2V5.1a3.1 3.1 0 0 1 6.2 0v2.1"
          fill="none"
          stroke="#2a0410"
          strokeWidth="2.1"
        />
      </svg>
    ),
  },
];

const PLAN_INCLUDES = [
  "Full 4K and QHD library",
  "Every live wallpaper",
  "All seven categories",
  "Favourites and offline library",
  "Multi-monitor support",
  "New wallpapers every week",
];

const QUOTES: { text: string; name: string; role: string }[] = [
  {
    text: '"Finally a wallpaper app for Windows that does not ship with a store, a launcher and three background services."',
    name: "Rendra",
    role: "PC builder",
  },
  {
    text: '"The live ones actually pause when I play. That was the whole reason I stopped using the last app I tried."',
    name: "M. Faiz",
    role: "Streamer",
  },
  {
    text: '"Set Wallpaper, one click, done. I switch backgrounds about four times a day now."',
    name: "Aletta",
    role: "Product designer",
  },
  {
    text: '"Two monitors, two different wallpapers, no fighting with Windows settings."',
    name: "Kevin O.",
    role: "Data analyst",
  },
  {
    text: '"The Dark and Minimal categories are exactly my taste. Everything is genuinely 4K."',
    name: "Sasha",
    role: "Illustrator",
  },
  {
    text: '"No account, no ads, no nagging. It just sits there and looks good."',
    name: "Bagas",
    role: "Student",
  },
];

const FAQS: [string, string][] = [
  [
    "Is OhMyWallpaper really free?",
    "Yes, entirely. There is no paid tier, no subscription and no trial period. The full library, live wallpapers and every feature are included at no cost.",
  ],
  [
    "Will live wallpapers slow down my PC or games?",
    "Playback stops as soon as a window covers the desktop or a game goes fullscreen, and resumes when the desktop is visible again. On idle it sits at a couple of percent CPU.",
  ],
  [
    "Which Windows versions are supported?",
    "Windows 10 (build 19041 and later) and Windows 11, on both x64 and ARM64. There is no macOS or Linux build.",
  ],
  [
    "Can I use my own images and videos?",
    "Yes. Import local JPG, PNG and MP4 files and they behave exactly like library wallpapers, including per-monitor assignment and shuffle.",
  ],
  [
    "Do I need an account?",
    "No. There is no sign-up, no email, no telemetry. Downloads go straight to your machine.",
  ],
  [
    "Where are the wallpapers stored?",
    "In your user Pictures folder under OhMyWallpaper. You can move or delete them at any time and the app will keep working.",
  ],
];

/** Marquee durations, matching the design's 55s base and its 1.25×/1.5× steps. */
const SPEED_A = "55s";
const SPEED_B = "69s";
const SPEED_C = "83s";

/* -------------------------------- fragments ------------------------------- */

function WindowsGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" aria-hidden="true">
      <rect x="0" y="0" width="5.6" height="5.6" fill="currentColor" />
      <rect x="7.4" y="0" width="5.6" height="5.6" fill="currentColor" />
      <rect x="0" y="7.4" width="5.6" height="5.6" fill="currentColor" />
      <rect x="7.4" y="7.4" width="5.6" height="5.6" fill="currentColor" />
    </svg>
  );
}

/**
 * `items` repeated until the row holds at least `min` tiles. Padding happens in
 * whole laps so no wallpaper ever lands next to a copy of itself, which a partial
 * lap would cause at the seam.
 */
function marqueeTiles(items: WallpaperItem[], min = 7) {
  if (items.length === 0) return [];
  const laps = Math.max(1, Math.ceil(min / items.length));
  return Array.from({ length: items.length * laps }, (_, i) => items[i % items.length]);
}

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: WallpaperItem[];
  direction: "a" | "b";
  duration: string;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${direction === "a" ? "marquee-a" : "marquee-b"}`}
        style={{ "--mq-duration": duration } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="h-[150px] w-[320px] flex-none overflow-hidden rounded-[14px] border border-white/[0.16] bg-[#101014] shadow-[0_10px_26px_rgba(0,0,0,0.42)]"
          >
            <img
              src={item.urlThumb}
              alt=""
              loading="lazy"
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqRow({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-5 border-0 bg-transparent px-0.5 py-[22px] text-left text-[15px] font-semibold text-[#eaeaef]"
      >
        {q}
        <span
          aria-hidden="true"
          className="flex-none text-xl font-normal text-[#7a7a85] transition-transform duration-[250ms]"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      {open && (
        <p className="m-0 pb-6 pl-0.5 pr-11 text-[14.5px] leading-[1.62] text-[#8f8f99] text-pretty">
          {a}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

function Landing() {
  const showcase = Route.useLoaderData();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // The two gallery marquees run on the catalog's featured wallpapers only, split
  // down the middle so the rows never show the same piece: the first half scrolls
  // left, the second half scrolls right. Each row is then padded to at least 7 tiles
  // so its duplicated track stays wider than the viewport. Under four featured a
  // half would be one tile repeating, so both rows take the whole list instead.
  const featured = showcase?.featured ?? [];
  const half = Math.ceil(featured.length / 2);
  const [listA, listB] =
    featured.length >= 4
      ? [featured.slice(0, half), featured.slice(half)]
      : [featured, featured];
  const rowA = marqueeTiles(listA);
  const rowB = marqueeTiles(listB);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050505] font-body text-[#f2f2f4]">
      {/* fixed aurora backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(58vw 58vw at 6% -8%,rgba(168,85,247,0.26),transparent 62%),radial-gradient(54vw 54vw at 106% 34%,rgba(59,130,246,0.24),transparent 62%),radial-gradient(52vw 52vw at 20% 112%,rgba(255,95,162,0.18),transparent 62%),radial-gradient(70vw 50vw at 50% 55%,rgba(120,110,255,0.10),transparent 70%)",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        {/* ------------------------------- nav ------------------------------- */}
        <nav
          id="site-nav"
          className="sticky top-[14px] z-50 mx-auto mt-[14px] flex w-[calc(100%-32px)] max-w-[1180px] items-center justify-between gap-6 rounded-full py-2.5 pl-5 pr-3"
          style={{
            background:
              "linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.045))",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.28),0 14px 40px rgba(0,0,0,0.45)",
          }}
        >
          <a href="#top" className="flex items-center gap-2.5 text-[#f2f2f4] no-underline">
            <img
              src="/landing/logo-96.png"
              alt="OhMyWallpaper"
              width={30}
              height={30}
              className="block h-[30px] w-[30px]"
            />
            <span className="font-display text-base font-semibold tracking-[-0.005em]">
              OhMyWallpaper
            </span>
          </a>
          <div className="hidden items-center gap-[30px] md:flex">
            {[
              ["Features", "#features"],
              ["Gallery", "#gallery"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-[#8f8f99] no-underline transition-colors hover:text-[#f2f2f4]"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="#download"
            className="flex flex-none items-center gap-2 rounded-full bg-[#f4f4f6] px-[18px] py-[9px] text-sm font-semibold text-[#0a0a0c] no-underline"
          >
            <WindowsGlyph />
            Download
          </a>
        </nav>

        {/* ------------------------------- hero ------------------------------ */}
        <section id="top" className="relative px-8 pt-16 text-center">
          <div
            aria-hidden="true"
            className="hero-glow pointer-events-none absolute left-1/2 top-[-140px] h-[560px] w-[1100px] -translate-x-1/2 rounded-[50%] blur-[20px]"
            style={{
              background:
                "radial-gradient(ellipse at center,rgba(120,80,255,0.20),rgba(40,120,255,0.10) 45%,rgba(0,0,0,0) 70%)",
            }}
          />
          <div className="hero-rise relative mx-auto max-w-[900px]">
            <img
              src="/landing/logo-320.png"
              alt=""
              width={84}
              height={84}
              className="mx-auto mb-[26px] block h-[84px] w-[84px] drop-shadow-[0_12px_40px_rgba(120,80,255,0.45)]"
            />
            <div
              className="mb-[26px] inline-flex items-center gap-[9px] rounded-full py-1.5 pl-2 pr-3.5 text-[12.5px] font-semibold text-[#c6c6d0]"
              style={GLASS_PILL}
            >
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#4aa8ff]" />
              Free for Windows 10 &amp; 11
            </div>
            <h1 className="font-display m-0 mb-[22px] text-[clamp(46px,7.2vw,88px)] font-semibold leading-[0.98] tracking-[-0.035em] text-balance">
              Let your wallpaper
              <br />
              tell a story.
            </h1>
            <p className="mx-auto mb-[34px] max-w-[560px] text-[16.5px] leading-[1.58] text-[#8f8f99] text-pretty">
              4K and live wallpapers for your Windows PC. No ads. No account. No
              limits — just a desktop you actually want to look at.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#download" className={`${CTA_LIGHT} px-[26px] py-3.5 no-underline`}>
                <WindowsGlyph size={15} />
                Download for Windows
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-[#f0f0f4] no-underline"
                style={GLASS_BUTTON}
              >
                See it in action
              </a>
            </div>
            <p className="mt-5 text-[13px] text-[#5f5f69]">
              Free download · 42 MB installer · Windows 10 and 11
            </p>
            <div className="mt-[34px] flex flex-wrap items-center justify-center gap-2">
              {PERF_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="flex items-center gap-2 rounded-full px-[15px] py-2 text-[13px] font-semibold text-[#c4c4ce]"
                  style={GLASS_PILL}
                >
                  <span className="h-[5px] w-[5px] flex-none rounded-full bg-[#22c55e]" />
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto mt-16 max-w-[1180px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-[8%] left-[6%] right-[6%] -bottom-[6%] rounded-[40px] blur-[70px]"
              style={{
                background:
                  "linear-gradient(120deg,rgba(255,95,162,0.22),rgba(168,85,247,0.22),rgba(59,130,246,0.22))",
              }}
            />
            <img
              src="/landing/app-home.webp"
              alt="OhMyWallpaper home screen"
              width={1373}
              height={840}
              className="relative block w-full rounded-[14px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            />
          </div>
        </section>

        {/* ------------------------------- demo ------------------------------ */}
        <section id="demo" className="px-8 pt-[130px] text-center">
          <div className={EYEBROW}>Live wallpapers</div>
          <h2 className={`${H2} m-0 mb-[18px]`}>
            It runs on your desktop,
            <br />
            not in a browser tab.
          </h2>
          <p className={`mx-auto max-w-[560px] ${LEAD}`}>
            Set a still or a looping 4K video as your background. Playback pauses
            the moment a window covers it, so games and battery stay untouched.
          </p>
          <div className="relative mx-auto mt-14 max-w-[1180px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-[10%] left-[8%] right-[8%] -bottom-[4%] rounded-[40px] blur-[60px]"
              style={{
                background:
                  "radial-gradient(ellipse at center,rgba(59,130,246,0.28),rgba(0,0,0,0) 70%)",
              }}
            />
            <img
              src="/landing/desktop-demo.webp"
              alt="OhMyWallpaper running over a live desktop wallpaper"
              width={2000}
              height={998}
              loading="lazy"
              className="relative block w-full rounded-[14px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            />
          </div>
        </section>

        {/* ------------------------------ screens ---------------------------- */}
        <section id="screens" className="px-8 pt-[130px] text-center">
          <div className={EYEBROW}>The app</div>
          <h2 className={`${H2} m-0 mb-[34px]`}>Explore, without the clutter.</h2>
          <div className="mx-auto max-w-[1080px]">
            <img
              src="/landing/app-explore.webp"
              alt="OhMyWallpaper explore screen"
              width={1359}
              height={841}
              loading="lazy"
              className="block w-full rounded-[14px] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
            />
            <p className="mx-auto mt-[22px] max-w-[520px] text-[14.5px] leading-[1.58] text-[#8f8f99]">
              Explore filters by live, 4K or QHD, then drops you into seven
              categories and the newest uploads.
            </p>
          </div>
        </section>

        {/* ------------------------------ gallery ---------------------------- */}
        <section id="gallery" className="pt-[130px]">
          <div className="mx-auto max-w-[1180px] px-8">
            <div className={EYEBROW}>Gallery</div>
            <h2 className={`${H2} m-0 mb-[18px] max-w-[620px]`}>
              A library worth
              <br />
              scrolling through.
            </h2>
            <p className={`m-0 max-w-[480px] ${LEAD}`}>
              Nature, Space, City, Abstract, Anime, Minimal and Dark — every piece
              checked at full resolution before it lands in the app.
            </p>
          </div>
          {rowA.length > 0 ? (
            <div className="mt-[52px] flex flex-col gap-4" style={MARQUEE_MASK}>
              <MarqueeRow items={rowA} direction="a" duration={SPEED_A} />
              <MarqueeRow items={rowB} direction="b" duration={SPEED_B} />
            </div>
          ) : (
            <p className="mx-auto mt-[52px] max-w-[1180px] px-8 text-[14.5px] text-[#5f5f69]">
              No featured wallpapers to show right now — feature a few in the admin
              catalog and they will appear here.
            </p>
          )}
        </section>

        {/* ----------------------------- features ---------------------------- */}
        <section id="features" className="px-8 pt-[130px]">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center">
              <div className={EYEBROW}>Features</div>
              <h2 className={`${H2} m-0 mb-[18px]`}>
                Everything you need.
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#ff5fa2,#a855f7,#3b82f6)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Nothing you don't.
                </span>
              </h2>
              <p className={`mx-auto max-w-[520px] ${LEAD}`}>
                Built for Windows, tuned for speed, and stripped of everything a
                wallpaper app doesn't need.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),1fr))] gap-3.5">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-[20px] p-7" style={GLASS_CARD}>
                  <div
                    className="mb-5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px]"
                    style={{ background: f.gradient }}
                  >
                    {f.glyph}
                  </div>
                  <h3 className="font-display m-0 mb-2 text-base font-semibold tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="m-0 text-[13.8px] leading-[1.6] text-[#84848e]">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ pricing ---------------------------- */}
        <section id="pricing" className="px-8 pt-[130px]">
          <div className="mx-auto max-w-[940px]">
            <div className="text-center">
              <div className={EYEBROW}>Pricing</div>
              <h2 className={`${H2} m-0 mb-[18px]`}>Completely free.</h2>
              <p className={`mx-auto max-w-[480px] ${LEAD}`}>
                No paid tier, no subscription, no trial that runs out. Every
                wallpaper and every feature is included.
              </p>
            </div>
            <div
              className="mx-auto mt-[60px] max-w-[520px] rounded-[26px] p-10 text-center"
              style={{
                background:
                  "linear-gradient(180deg,rgba(168,85,247,0.16),rgba(255,255,255,0.035))",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(198,140,255,0.34)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.28),0 24px 60px rgba(0,0,0,0.42)",
              }}
            >
              <div className="mb-2 flex items-baseline justify-center gap-[9px]">
                <span className="font-display text-[62px] font-semibold leading-none tracking-[-0.04em]">
                  $0
                </span>
                <span className="text-[15px] text-[#6d6d77]">forever</span>
              </div>
              <p className="m-0 mb-8 text-[14.5px] text-[#84848e]">
                Everything, for everyone.
              </p>
              <div className="mb-[34px] grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-[13px] text-left">
                {PLAN_INCLUDES.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-[11px] text-sm text-[#c2c2cb]"
                  >
                    <span className="leading-[1.5] text-[#c084fc]">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="#download"
                className="block rounded-full bg-[#f4f4f6] py-3.5 text-center text-[15px] font-semibold text-[#0a0a0c] no-underline"
              >
                Download for Windows
              </a>
              <p className="m-0 mt-4 text-[12.5px] text-[#5f5f69]">
                No account · No ads · No subscription
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------ reviews ---------------------------- */}
        <section id="reviews" className="pt-[130px]">
          <div className="px-8 text-center">
            <div className={EYEBROW}>Loved by users</div>
            <h2 className={`${H2} m-0 mb-[18px]`}>What people are saying</h2>
            <p className={`mx-auto max-w-[520px] ${LEAD}`}>
              Join the Windows users who stopped settling for the default
              background.
            </p>
          </div>
          <div
            className="mt-14 overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
              maskImage:
                "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
            }}
          >
            <div
              className="marquee-a flex w-max gap-4"
              style={{ "--mq-duration": SPEED_C } as React.CSSProperties}
            >
              {[...QUOTES, ...QUOTES].map((q, i) => (
                <div
                  key={`${q.name}-${i}`}
                  className="flex w-[330px] flex-none flex-col justify-between gap-[22px] rounded-[20px] p-[26px]"
                  style={GLASS_CARD}
                >
                  <div>
                    <div className="mb-3.5 text-xs tracking-[2px] text-[#f5b93b]">
                      ★★★★★
                    </div>
                    <p className="m-0 text-[13.8px] leading-[1.6] text-[#d2d2d9]">
                      {q.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-[11px] border-t border-white/[0.07] pt-4">
                    <div className="h-[30px] w-[30px] flex-none rounded-full bg-gradient-to-br from-[#3b82f6] to-[#a855f7]" />
                    <div>
                      <div className="text-[13.5px] font-semibold text-[#eaeaef]">
                        {q.name}
                      </div>
                      <div className="text-xs text-[#6d6d77]">{q.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------- faq ------------------------------ */}
        <section id="faq" className="px-8 pt-[130px]">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-14 text-center">
              <div className={EYEBROW}>FAQ</div>
              <h2 className={`${H2} m-0`}>Questions? Answered.</h2>
            </div>
            {FAQS.map(([q, a], i) => (
              <FaqRow
                key={q}
                q={q}
                a={a}
                open={openFaq === i}
                onToggle={() => setOpenFaq((cur) => (cur === i ? null : i))}
              />
            ))}
          </div>
        </section>

        {/* ------------------------------ download --------------------------- */}
        <section
          id="download"
          className="relative overflow-hidden px-8 pb-[120px] pt-[150px] text-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-260px] left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-[50%] blur-[30px]"
            style={{
              background:
                "radial-gradient(ellipse at center,rgba(168,85,247,0.20),rgba(59,130,246,0.12) 45%,rgba(0,0,0,0) 72%)",
            }}
          />
          <div className="relative">
            <img
              src="/landing/logo-320.png"
              alt=""
              width={70}
              height={70}
              loading="lazy"
              className="mx-auto mb-[30px] block h-[70px] w-[70px] drop-shadow-[0_12px_40px_rgba(120,80,255,0.45)]"
            />
            <h2 className="font-display m-0 mb-5 text-[clamp(38px,5.4vw,68px)] font-semibold leading-[1.02] tracking-[-0.035em]">
              Give your desktop
              <br />
              something to say.
            </h2>
            <p className={`mx-auto mb-[34px] max-w-[520px] ${LEAD}`}>
              Download OhMyWallpaper free and set your first wallpaper in under a
              minute.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#top" className={`${CTA_LIGHT} px-7 py-[15px] no-underline`}>
                <WindowsGlyph size={15} />
                Download for Windows
              </a>
              <a
                href="#screens"
                className="inline-flex items-center gap-2 rounded-full px-[26px] py-[15px] text-[15px] font-semibold text-[#f0f0f4] no-underline"
                style={GLASS_BUTTON}
              >
                Watch the demo
              </a>
            </div>
            <div className="mt-[26px] flex flex-wrap items-center justify-center gap-x-[26px] gap-y-2 text-[13px] text-[#6d6d77]">
              {["No account required", "No subscription", "Windows 10 and 11"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-[7px]">
                    <span className="text-[#22c55e]">✓</span>
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------- footer ---------------------------- */}
        <footer className="px-8 pb-14">
          <div className="mx-auto max-w-[1180px] border-t border-white/[0.07] pt-[26px]">
            <p className="m-0 mb-3.5 text-[12.5px] text-[#5c5c66]">
              All artwork and metadata remain the property of their respective
              owners.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 pb-[26px] text-[12.5px]">
              <a href="#faq" className="text-[#82828c] no-underline hover:text-[#c4c4ce]">
                Terms &amp; Conditions
              </a>
              <span className="text-[#3a3a42]">·</span>
              <a href="#faq" className="text-[#82828c] no-underline hover:text-[#c4c4ce]">
                EULA
              </a>
              <span className="text-[#3a3a42]">·</span>
              <a href="#faq" className="text-[#82828c] no-underline hover:text-[#c4c4ce]">
                Privacy Policy
              </a>
              <span className="text-[#3a3a42]">·</span>
              <a href="#faq" className="text-[#82828c] no-underline hover:text-[#c4c4ce]">
                Contact
              </a>
            </div>
          </div>
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 border-t border-white/[0.07] pt-[22px]">
            <div className="flex items-center gap-[11px]">
              <img
                src="/landing/logo-96.png"
                alt=""
                width={24}
                height={24}
                loading="lazy"
                className="block h-6 w-6"
              />
              <span className="text-[12.5px] text-[#5c5c66]">
                <strong className="font-semibold text-[#a8a8b2]">OhMyWallpaper</strong>{" "}
                is a simple, Windows-native app made with care. ©{" "}
                {new Date().getFullYear()}
              </span>
            </div>
            <span className="text-xs font-semibold tracking-[0.22em] text-[#5c5c66]">
              OHMYWALLPAPER
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
