import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
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

/**
 * The hero's Rust highlight. Same frosted pill, warmed to Rust orange so it reads as
 * the claim the green performance chips follow from rather than one more of them.
 */
const RUST_PILL: React.CSSProperties = {
  border: "1px solid rgba(247,76,0,0.45)",
  background:
    "linear-gradient(180deg,rgba(247,76,0,0.24),rgba(247,76,0,0.075))",
  backdropFilter: "blur(18px) saturate(180%)",
  WebkitBackdropFilter: "blur(18px) saturate(180%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.24),0 6px 20px rgba(247,76,0,0.24)",
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

/* Wallpoet only ships a 400 weight, so the title headings stay font-normal and take
   looser tracking than Gabarito did — its glyphs are already blocky and wide. */
const H2 = "font-title text-[clamp(36px,5vw,62px)] font-normal leading-[1.06] tracking-[-0.01em]";
const EYEBROW = "mb-[18px] text-xs font-bold uppercase tracking-[0.16em] text-[#4aa8ff]";
const LEAD = "text-[15.5px] leading-[1.58] text-[#8f8f99] text-pretty";
const CTA_LIGHT =
  "inline-flex items-center gap-2.5 rounded-full bg-[#f4f4f6] text-[15px] font-semibold text-[#0a0a0c] no-underline shadow-[0_8px_30px_rgba(255,255,255,0.10)]";

/** Installer artifact uploaded to the public R2 bucket (releases/ prefix). */
const DOWNLOAD_URL =
  "https://pub-2ed10c13accd4b438e42f7672ea46d01.r2.dev/releases/ohmywallpaper_0.1.2_x64-setup.exe";

/* --------------------------------- motion --------------------------------- */

/** The design's hero easing, reused for every entrance so the page feels of a piece. */
const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

/** Spread onto a motion element to fade + lift it in the first time it scrolls into view. */
function reveal(delay = 0, y = 24) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: EASE, delay },
  } as const;
}

/** Same idea, but for the hero — it animates on mount rather than on scroll. */
function heroRise(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  } as const;
}

/** Lift-on-hover shared by the pressable cards and buttons. */
const HOVER_LIFT = { whileHover: { y: -4 }, whileTap: { y: -1 } } as const;
const HOVER_PRESS = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } } as const;

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

/** Unique wallpapers per gallery marquee row; the loader fetches 2× this many. */
const GALLERY_ROW_TILES = 15;

/**
 * The reviews section is off until the placeholder quotes in QUOTES are replaced with
 * real ones. Flip to `true` to bring the section back.
 */
const SHOW_REVIEWS = false;

/**
 * Cards in one lap of the reviews marquee. 12 × 346px = 4152px, so a lap stays wider
 * than a 4K viewport and the same quote is never on screen twice.
 */
const REVIEW_LAP_CARDS = 12;

/**
 * Marquee durations, all scaled to hold the design's original speeds. The 55s base was
 * tuned for 320px tiles and the gallery now runs 440px ones, so its two speeds grew by
 * the same factor to stay at ~73 px/s. The reviews lap doubled in length to clear wide
 * viewports, so 83s doubled too, holding its slower ~25 px/s.
 */
const SPEED_A = "75s";
const SPEED_B = "94s";
const SPEED_C = "166s";

/* -------------------------------- fragments ------------------------------- */

/**
 * The Rust logo, for the Rust highlight. Filled with currentColor so it takes the
 * pill's warm text tint the way the other glyphs do — it is denser than the gear it
 * replaced, hence the slightly larger default.
 */
function RustGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 224 224" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M218.46 109.358l-9.062-5.614c-.076-.882-.162-1.762-.258-2.642l7.803-7.265a3.107 3.107 0 00.933-2.89 3.093 3.093 0 00-1.967-2.312l-9.97-3.715c-.25-.863-.512-1.72-.781-2.58l6.214-8.628a3.114 3.114 0 00-.592-4.263 3.134 3.134 0 00-1.431-.637l-10.507-1.709a80.869 80.869 0 00-1.263-2.353l4.417-9.7a3.12 3.12 0 00-.243-3.035 3.106 3.106 0 00-2.705-1.385l-10.671.372a85.152 85.152 0 00-1.685-2.044l2.456-10.381a3.125 3.125 0 00-3.762-3.763l-10.384 2.456a88.996 88.996 0 00-2.047-1.684l.373-10.671a3.11 3.11 0 00-1.385-2.704 3.127 3.127 0 00-3.034-.246l-9.681 4.417c-.782-.429-1.567-.854-2.353-1.265l-1.713-10.506a3.098 3.098 0 00-1.887-2.373 3.108 3.108 0 00-3.014.35l-8.628 6.213c-.85-.27-1.703-.53-2.56-.778l-3.716-9.97a3.111 3.111 0 00-2.311-1.97 3.134 3.134 0 00-2.89.933l-7.266 7.802a93.746 93.746 0 00-2.643-.258l-5.614-9.082A3.125 3.125 0 00111.97 4c-1.09 0-2.085.56-2.642 1.478l-5.615 9.081a93.32 93.32 0 00-2.642.259l-7.266-7.802a3.13 3.13 0 00-2.89-.933 3.106 3.106 0 00-2.312 1.97l-3.715 9.97c-.857.247-1.71.506-2.56.778L73.7 12.588a3.101 3.101 0 00-3.014-.35A3.127 3.127 0 0068.8 14.61l-1.713 10.506c-.79.41-1.575.832-2.353 1.265l-9.681-4.417a3.125 3.125 0 00-4.42 2.95l.372 10.67c-.69.553-1.373 1.115-2.048 1.685l-10.383-2.456a3.143 3.143 0 00-2.93.832 3.124 3.124 0 00-.833 2.93l2.436 10.383a93.897 93.897 0 00-1.68 2.043l-10.672-.372a3.138 3.138 0 00-2.704 1.385 3.126 3.126 0 00-.246 3.035l4.418 9.7c-.43.779-.855 1.563-1.266 2.353l-10.507 1.71a3.097 3.097 0 00-2.373 1.886 3.117 3.117 0 00.35 3.013l6.214 8.628a89.12 89.12 0 00-.78 2.58l-9.97 3.715a3.117 3.117 0 00-1.035 5.202l7.803 7.265c-.098.879-.184 1.76-.258 2.642l-9.062 5.614A3.122 3.122 0 004 112.021c0 1.092.56 2.084 1.478 2.642l9.062 5.614c.074.882.16 1.762.258 2.642l-7.803 7.265a3.117 3.117 0 001.034 5.201l9.97 3.716a110 110 0 00.78 2.58l-6.212 8.627a3.112 3.112 0 00.6 4.27c.419.33.916.547 1.443.63l10.507 1.709c.407.792.83 1.576 1.265 2.353l-4.417 9.68a3.126 3.126 0 002.95 4.42l10.65-.374c.553.69 1.115 1.372 1.685 2.047l-2.435 10.383a3.09 3.09 0 00.831 2.91 3.117 3.117 0 002.931.83l10.384-2.436a82.268 82.268 0 002.047 1.68l-.371 10.671a3.11 3.11 0 001.385 2.704 3.125 3.125 0 003.034.241l9.681-4.416c.779.432 1.563.854 2.353 1.265l1.713 10.505a3.147 3.147 0 001.887 2.395 3.111 3.111 0 003.014-.349l8.628-6.213c.853.271 1.71.535 2.58.783l3.716 9.969a3.112 3.112 0 002.312 1.967 3.112 3.112 0 002.89-.933l7.266-7.802c.877.101 1.761.186 2.642.264l5.615 9.061a3.12 3.12 0 002.642 1.478 3.165 3.165 0 002.663-1.478l5.614-9.061c.884-.078 1.765-.163 2.643-.264l7.265 7.802a3.106 3.106 0 002.89.933 3.105 3.105 0 002.312-1.967l3.716-9.969c.863-.248 1.719-.512 2.58-.783l8.629 6.213a3.12 3.12 0 004.9-2.045l1.713-10.506c.793-.411 1.577-.838 2.353-1.265l9.681 4.416a3.13 3.13 0 003.035-.241 3.126 3.126 0 001.385-2.704l-.372-10.671a81.794 81.794 0 002.046-1.68l10.383 2.436a3.123 3.123 0 003.763-3.74l-2.436-10.382a84.588 84.588 0 001.68-2.048l10.672.374a3.104 3.104 0 002.704-1.385 3.118 3.118 0 00.244-3.035l-4.417-9.68c.43-.779.852-1.563 1.263-2.353l10.507-1.709a3.08 3.08 0 002.373-1.886 3.11 3.11 0 00-.35-3.014l-6.214-8.627c.272-.857.532-1.717.781-2.58l9.97-3.716a3.109 3.109 0 001.967-2.311 3.107 3.107 0 00-.933-2.89l-7.803-7.265c.096-.88.182-1.761.258-2.642l9.062-5.614a3.11 3.11 0 001.478-2.642 3.157 3.157 0 00-1.476-2.663h-.064zm-60.687 75.337c-3.468-.747-5.656-4.169-4.913-7.637a6.412 6.412 0 017.617-4.933c3.468.741 5.676 4.169 4.933 7.637a6.414 6.414 0 01-7.617 4.933h-.02zm-3.076-20.847c-3.158-.677-6.275 1.334-6.936 4.5l-3.22 15.026c-9.929 4.5-21.055 7.018-32.614 7.018-11.89 0-23.12-2.622-33.234-7.328l-3.22-15.026c-.677-3.158-3.778-5.18-6.936-4.499l-13.273 2.848a80.222 80.222 0 01-6.853-8.091h64.61c.731 0 1.218-.132 1.218-.797v-22.91c0-.665-.487-.797-1.218-.797H94.133v-14.469h20.415c1.864 0 9.97.533 12.551 10.898.811 3.179 2.601 13.54 3.818 16.863 1.214 3.715 6.152 11.146 11.415 11.146h32.202c.365 0 .755-.041 1.166-.116a80.56 80.56 0 01-7.307 8.587l-13.583-2.911-.113.058zm-89.38 20.537a6.407 6.407 0 01-7.617-4.933c-.74-3.467 1.462-6.894 4.934-7.637a6.417 6.417 0 017.617 4.933c.74 3.468-1.464 6.894-4.934 7.637zm-24.564-99.28a6.438 6.438 0 01-3.261 8.484c-3.241 1.438-7.019-.025-8.464-3.261-1.445-3.237.025-7.039 3.262-8.483a6.416 6.416 0 018.463 3.26zM33.22 102.94l13.83-6.15c2.952-1.311 4.294-4.769 2.972-7.72l-2.848-6.44H58.36v50.362h-22.5a79.158 79.158 0 01-3.014-21.672c0-2.869.155-5.697.452-8.483l-.08.103zm60.687-4.892v-14.86h26.629c1.376 0 9.722 1.59 9.722 7.822 0 5.18-6.399 7.038-11.663 7.038h-24.77.082zm96.811 13.375c0 1.973-.072 3.922-.216 5.862h-8.113c-.811 0-1.137.532-1.137 1.327v3.715c0 8.752-4.934 10.671-9.268 11.146-4.129.464-8.691-1.726-9.248-4.252-2.436-13.684-6.482-16.595-12.881-21.672 7.948-5.036 16.204-12.487 16.204-22.498 0-10.753-7.369-17.523-12.385-20.847-7.059-4.644-14.862-5.572-16.968-5.572H52.899c11.374-12.673 26.835-21.673 44.174-24.975l9.887 10.361a5.849 5.849 0 008.278.19l11.064-10.568c23.119 4.314 42.729 18.721 54.082 38.598l-7.576 17.09c-1.306 2.951.027 6.419 2.973 7.72l14.573 6.48c.255 2.607.383 5.224.384 7.843l-.021.052zM106.912 24.94a6.398 6.398 0 019.062.209 6.437 6.437 0 01-.213 9.082 6.396 6.396 0 01-9.062-.21 6.436 6.436 0 01.213-9.083v.002zm75.137 60.476a6.402 6.402 0 018.463-3.26 6.425 6.425 0 013.261 8.482 6.402 6.402 0 01-8.463 3.261 6.425 6.425 0 01-3.261-8.483z"
      />
    </svg>
  );
}

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
 * A landing screenshot: it fades up the first time it scrolls into view, then
 * drifts against the scroll for a little depth. The drift lives on the wrapper
 * and the entrance on the image, so the two never fight over `y`.
 */
function Screenshot({
  src,
  alt,
  width,
  height,
  imgClassName,
  glow,
  eager = false,
  drift = 36,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  imgClassName: string;
  glow?: React.ReactNode;
  eager?: boolean;
  drift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <div ref={ref} className="relative">
      {glow}
      <motion.div style={reduced ? undefined : { y }} className="relative">
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? undefined : "lazy"}
          className={imgClassName}
          initial={{ opacity: 0, y: 36, scale: 0.975 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: EASE }}
        />
      </motion.div>
    </div>
  );
}

/**
 * One marquee lap: `items` repeated until it holds at least `min` entries. Repeating
 * happens in whole passes so nothing ever lands next to a copy of itself, which a
 * partial pass would cause at the seam. The caller renders the lap twice, and the
 * lap has to be wider than the viewport or the same entry shows up twice at once.
 */
function marqueeLap<T>(items: T[], min: number): T[] {
  if (items.length === 0) return [];
  const passes = Math.max(1, Math.ceil(min / items.length));
  return Array.from({ length: items.length * passes }, (_, i) => items[i % items.length]);
}

/**
 * One auto-scrolling row of wallpapers. `direction` is the way the tiles travel:
 * `marquee-a` walks the track left, `marquee-b` walks it right.
 *
 * The 16px gap is a margin on every tile rather than `gap` on the track. `gap` only
 * sits *between* items, which leaves the track 16px short of two whole laps and makes
 * the `translateX(-50%)` loop jump by 8px each time round.
 */
function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: WallpaperItem[];
  direction: "left" | "right";
  duration: string;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max ${direction === "left" ? "marquee-a" : "marquee-b"}`}
        style={{ "--mq-duration": duration } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="mr-4 h-[206px] w-[440px] flex-none overflow-hidden rounded-[16px] bg-[#101014] shadow-[0_10px_26px_rgba(0,0,0,0.42)]"
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
  index,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div className="border-b border-white/[0.08]" {...reveal(index * 0.05, 18)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-5 border-0 bg-transparent px-0.5 py-[22px] text-left text-[15px] font-semibold text-[#eaeaef] transition-colors hover:text-white"
      >
        {q}
        <motion.span
          aria-hidden="true"
          className="flex-none text-xl font-normal text-[#7a7a85]"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="m-0 pb-6 pl-0.5 pr-11 text-[14.5px] leading-[1.62] text-[#8f8f99] text-pretty">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------------------------- page ---------------------------------- */

function Landing() {
  const showcase = Route.useLoaderData();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // The two gallery marquees run on the catalog's featured wallpapers only — shuffled
  // by the loader, then split down the middle so the rows never show the same piece
  // and each load lays them out differently. With the loader's 30
  // that is 15 unique wallpapers per row. Short of that each row repeats its half
  // in whole laps, and under four featured a half would be one tile over and over,
  // so both rows take the whole list instead.
  const featured = showcase?.featured ?? [];
  const half = Math.ceil(featured.length / 2);
  const [listA, listB] =
    featured.length >= 4
      ? [featured.slice(0, half), featured.slice(half)]
      : [featured, featured];
  const rowA = marqueeLap(listA, GALLERY_ROW_TILES);
  const rowB = marqueeLap(listB, GALLERY_ROW_TILES);
  const reviewLap = marqueeLap(QUOTES, REVIEW_LAP_CARDS);

  return (
    <MotionConfig reducedMotion="user">
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
          <motion.nav
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
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <a href="#top" className="flex items-center gap-2.5 text-[#f2f2f4] no-underline">
              <img
                src="/landing/logo-96.png"
                alt="OhMyWallpaper"
                width={30}
                height={30}
                className="block h-[30px] w-[30px]"
              />
              <span className="font-title text-base font-normal tracking-[0.005em]">
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
            <motion.a
              href={DOWNLOAD_URL}
              className="flex flex-none items-center gap-2 rounded-full bg-[#f4f4f6] px-[18px] py-[9px] text-sm font-semibold text-[#0a0a0c] no-underline"
              {...HOVER_PRESS}
            >
              <WindowsGlyph />
              Download
            </motion.a>
          </motion.nav>

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
            <div className="relative mx-auto max-w-[900px]">
              <motion.img
                src="/landing/logo-320.png"
                alt=""
                width={84}
                height={84}
                className="mx-auto mb-[26px] block h-[84px] w-[84px] drop-shadow-[0_12px_40px_rgba(120,80,255,0.45)]"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              <motion.div
                className="mb-[26px] inline-flex items-center gap-[9px] rounded-full py-1.5 pl-2 pr-3.5 text-[12.5px] font-semibold text-[#c6c6d0]"
                style={GLASS_PILL}
                {...heroRise(0.08)}
              >
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#4aa8ff]" />
                Free for Windows 10 &amp; 11
              </motion.div>
              <motion.h1
                className="font-title m-0 mb-[22px] text-[clamp(42px,6.4vw,80px)] font-normal leading-[1.04] tracking-[-0.01em] text-balance"
                {...heroRise(0.16)}
              >
                Let your wallpaper
                <br />
                tell a story.
              </motion.h1>
              <motion.p
                className="mx-auto mb-[34px] max-w-[560px] text-[16.5px] leading-[1.58] text-[#8f8f99] text-pretty"
                {...heroRise(0.24)}
              >
                4K and live wallpapers for your Windows PC. No ads. No account. No
                limits — just a desktop you actually want to look at.
              </motion.p>
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3"
                {...heroRise(0.32)}
              >
                <motion.a
                  href={DOWNLOAD_URL}
                  className={`${CTA_LIGHT} px-[26px] py-3.5`}
                  {...HOVER_PRESS}
                >
                  <WindowsGlyph size={15} />
                  Download for Windows
                </motion.a>
                <motion.a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-[#f0f0f4] no-underline"
                  style={GLASS_BUTTON}
                  {...HOVER_PRESS}
                >
                  See it in action
                </motion.a>
              </motion.div>
              <motion.p className="mt-5 text-[13px] text-[#5f5f69]" {...heroRise(0.4)}>
                Free download · 2 MB installer · Windows 10 and 11
              </motion.p>
              <div className="mt-[34px] flex flex-wrap items-center justify-center gap-2">
                {/* the engine claim the rest of the row is a consequence of, so it leads */}
                <motion.span
                  className="flex items-center gap-2 rounded-full px-[15px] py-2 text-[13px] font-semibold text-[#ffd0b8]"
                  style={RUST_PILL}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.48 }}
                >
                  <RustGlyph />
                  Built on Rust
                </motion.span>
                {PERF_CHIPS.map((chip, i) => (
                  <motion.span
                    key={chip}
                    className="flex items-center gap-2 rounded-full px-[15px] py-2 text-[13px] font-semibold text-[#c4c4ce]"
                    style={GLASS_PILL}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.55 + i * 0.07 }}
                  >
                    <span className="h-[5px] w-[5px] flex-none rounded-full bg-[#22c55e]" />
                    {chip}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-16 max-w-[1180px]">
              <Screenshot
                src="/landing/app-home.webp"
                alt="OhMyWallpaper home screen"
                width={1373}
                height={840}
                eager
                drift={28}
                imgClassName="relative block w-full rounded-[14px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
                glow={
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-[8%] left-[6%] right-[6%] -bottom-[6%] rounded-[40px] blur-[70px]"
                    style={{
                      background:
                        "linear-gradient(120deg,rgba(255,95,162,0.22),rgba(168,85,247,0.22),rgba(59,130,246,0.22))",
                    }}
                  />
                }
              />
            </div>
          </section>

          {/* ------------------------------- demo ------------------------------ */}
          <section id="demo" className="px-8 pt-[130px] text-center">
            <motion.div className={EYEBROW} {...reveal()}>
              Live wallpapers
            </motion.div>
            <motion.h2 className={`${H2} m-0 mb-[18px]`} {...reveal(0.06)}>
              It runs on your desktop,
              <br />
              not in a browser tab.
            </motion.h2>
            <motion.p className={`mx-auto max-w-[560px] ${LEAD}`} {...reveal(0.12)}>
              Set a still or a looping 4K video as your background. Playback pauses
              the moment a window covers it, so games and battery stay untouched.
            </motion.p>
            <div className="mx-auto mt-14 max-w-[1180px]">
              <Screenshot
                src="/landing/desktop-demo.webp"
                alt="OhMyWallpaper running over a live desktop wallpaper"
                width={2000}
                height={998}
                imgClassName="relative block w-full rounded-[14px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
                glow={
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-[10%] left-[8%] right-[8%] -bottom-[4%] rounded-[40px] blur-[60px]"
                    style={{
                      background:
                        "radial-gradient(ellipse at center,rgba(59,130,246,0.28),rgba(0,0,0,0) 70%)",
                    }}
                  />
                }
              />
            </div>
          </section>

          {/* ------------------------------ screens ---------------------------- */}
          <section id="screens" className="px-8 pt-[130px] text-center">
            <motion.div className={EYEBROW} {...reveal()}>
              The app
            </motion.div>
            <motion.h2 className={`${H2} m-0 mb-[34px]`} {...reveal(0.06)}>
              Explore, without the clutter.
            </motion.h2>
            <div className="mx-auto max-w-[1080px]">
              <Screenshot
                src="/landing/app-explore.webp"
                alt="OhMyWallpaper explore screen"
                width={1359}
                height={841}
                drift={24}
                imgClassName="block w-full rounded-[14px] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
              />
              <motion.p
                className="mx-auto mt-[22px] max-w-[520px] text-[14.5px] leading-[1.58] text-[#8f8f99]"
                {...reveal(0.1)}
              >
                Explore filters by live, 4K or QHD, then drops you into seven
                categories and the newest uploads.
              </motion.p>
            </div>
          </section>

          {/* ------------------------------ gallery ---------------------------- */}
          <section id="gallery" className="pt-[130px]">
            <div className="mx-auto max-w-[1180px] px-8">
              <motion.div className={EYEBROW} {...reveal()}>
                Gallery
              </motion.div>
              <motion.h2 className={`${H2} m-0 mb-[18px] max-w-[620px]`} {...reveal(0.06)}>
                A library worth
                <br />
                scrolling through.
              </motion.h2>
              <motion.p className={`m-0 max-w-[480px] ${LEAD}`} {...reveal(0.12)}>
                Nature, Space, City, Abstract, Anime, Minimal and Dark — every piece
                checked at full resolution before it lands in the app.
              </motion.p>
            </div>
            {rowA.length > 0 ? (
              <motion.div
                className="mt-[52px] flex flex-col gap-4"
                style={MARQUEE_MASK}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {/* top row travels right, bottom row travels left */}
                <MarqueeRow items={rowA} direction="right" duration={SPEED_A} />
                <MarqueeRow items={rowB} direction="left" duration={SPEED_B} />
              </motion.div>
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
                <motion.div className={EYEBROW} {...reveal()}>
                  Features
                </motion.div>
                <motion.h2 className={`${H2} m-0 mb-[18px]`} {...reveal(0.06)}>
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
                </motion.h2>
                <motion.p className={`mx-auto max-w-[520px] ${LEAD}`} {...reveal(0.12)}>
                  Built for Windows, tuned for speed, and stripped of everything a
                  wallpaper app doesn't need.
                </motion.p>
              </div>
              <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),1fr))] gap-3.5">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="rounded-[20px] p-7"
                    style={GLASS_CARD}
                    {...reveal((i % 3) * 0.08)}
                    {...HOVER_LIFT}
                  >
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
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ------------------------------ pricing ---------------------------- */}
          <section id="pricing" className="px-8 pt-[130px]">
            <div className="mx-auto max-w-[940px]">
              <div className="text-center">
                <motion.div className={EYEBROW} {...reveal()}>
                  Pricing
                </motion.div>
                <motion.h2 className={`${H2} m-0 mb-[18px]`} {...reveal(0.06)}>
                  Completely free.
                </motion.h2>
                <motion.p className={`mx-auto max-w-[480px] ${LEAD}`} {...reveal(0.12)}>
                  No paid tier, no subscription, no trial that runs out. Every
                  wallpaper and every feature is included.
                </motion.p>
              </div>
              <motion.div
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
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.7, ease: EASE }}
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
                  {PLAN_INCLUDES.map((item, i) => (
                    <motion.div
                      key={item}
                      className="flex items-start gap-[11px] text-sm text-[#c2c2cb]"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.06 }}
                    >
                      <span className="leading-[1.5] text-[#c084fc]">✓</span>
                      {item}
                    </motion.div>
                  ))}
                </div>
                <motion.a
                  href={DOWNLOAD_URL}
                  className="block rounded-full bg-[#f4f4f6] py-3.5 text-center text-[15px] font-semibold text-[#0a0a0c] no-underline"
                  {...HOVER_PRESS}
                >
                  Download for Windows
                </motion.a>
                <p className="m-0 mt-4 text-[12.5px] text-[#5f5f69]">
                  No account · No ads · No subscription
                </p>
              </motion.div>
            </div>
          </section>

          {/* ------------------------------ reviews ---------------------------- */}
          {SHOW_REVIEWS && (
            <section id="reviews" className="pt-[130px]">
              <div className="px-8 text-center">
                <motion.div className={EYEBROW} {...reveal()}>
                  Loved by users
                </motion.div>
                <motion.h2 className={`${H2} m-0 mb-[18px]`} {...reveal(0.06)}>
                  What people are saying
                </motion.h2>
                <motion.p className={`mx-auto max-w-[520px] ${LEAD}`} {...reveal(0.12)}>
                  Join the Windows users who stopped settling for the default
                  background.
                </motion.p>
              </div>
              <motion.div
                className="mt-14 overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
                  maskImage:
                    "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {/* gap lives on the cards, not the track — see MarqueeRow */}
                <div
                  className="marquee-a flex w-max"
                  style={{ "--mq-duration": SPEED_C } as React.CSSProperties}
                >
                  {[...reviewLap, ...reviewLap].map((q, i) => (
                    <div
                      key={`${q.name}-${i}`}
                      className="mr-4 flex w-[330px] flex-none flex-col justify-between gap-[22px] rounded-[20px] p-[26px]"
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
              </motion.div>
            </section>
          )}

          {/* -------------------------------- faq ------------------------------ */}
          <section id="faq" className="px-8 pt-[130px]">
            <div className="mx-auto max-w-[760px]">
              <div className="mb-14 text-center">
                <motion.div className={EYEBROW} {...reveal()}>
                  FAQ
                </motion.div>
                <motion.h2 className={`${H2} m-0`} {...reveal(0.06)}>
                  Questions? Answered.
                </motion.h2>
              </div>
              {FAQS.map(([q, a], i) => (
                <FaqRow
                  key={q}
                  q={q}
                  a={a}
                  index={i}
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
              className="hero-glow pointer-events-none absolute bottom-[-260px] left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-[50%] blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse at center,rgba(168,85,247,0.20),rgba(59,130,246,0.12) 45%,rgba(0,0,0,0) 72%)",
              }}
            />
            <div className="relative">
              <motion.img
                src="/landing/logo-320.png"
                alt=""
                width={70}
                height={70}
                loading="lazy"
                className="mx-auto mb-[30px] block h-[70px] w-[70px] drop-shadow-[0_12px_40px_rgba(120,80,255,0.45)]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE }}
              />
              <motion.h2
                className="font-title m-0 mb-5 text-[clamp(36px,5vw,62px)] font-normal leading-[1.06] tracking-[-0.01em]"
                {...reveal(0.08)}
              >
                Give your desktop
                <br />
                something to say.
              </motion.h2>
              <motion.p className={`mx-auto mb-[34px] max-w-[520px] ${LEAD}`} {...reveal(0.16)}>
                Download OhMyWallpaper free and set your first wallpaper in under a
                minute.
              </motion.p>
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3"
                {...reveal(0.24)}
              >
                <motion.a
                  href={DOWNLOAD_URL}
                  className={`${CTA_LIGHT} px-7 py-[15px]`}
                  {...HOVER_PRESS}
                >
                  <WindowsGlyph size={15} />
                  Download for Windows
                </motion.a>
                <motion.a
                  href="#screens"
                  className="inline-flex items-center gap-2 rounded-full px-[26px] py-[15px] text-[15px] font-semibold text-[#f0f0f4] no-underline"
                  style={GLASS_BUTTON}
                  {...HOVER_PRESS}
                >
                  Watch the demo
                </motion.a>
              </motion.div>
              <motion.div
                className="mt-[26px] flex flex-wrap items-center justify-center gap-x-[26px] gap-y-2 text-[13px] text-[#6d6d77]"
                {...reveal(0.32)}
              >
                {["No account required", "No subscription", "Windows 10 and 11"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-[7px]">
                      <span className="text-[#22c55e]">✓</span>
                      {item}
                    </span>
                  ),
                )}
              </motion.div>
            </div>
          </section>

          {/* ------------------------------- footer ---------------------------- */}
          <motion.footer
            className="px-8 pb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
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
          </motion.footer>
        </div>
      </div>
    </MotionConfig>
  );
}
