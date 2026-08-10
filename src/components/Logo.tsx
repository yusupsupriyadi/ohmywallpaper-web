export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#7c5cff] shadow-[0_2px_12px_rgba(76,141,255,0.45)]"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2l2.2 6.4L21 10l-6.8 1.6L12 18l-2.2-6.4L3 10l6.8-1.6L12 2z"
          fill="#fff"
        />
        <circle cx="18.5" cy="17.5" r="1.6" fill="#fff" opacity="0.9" />
      </svg>
    </span>
  );
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size={size} />
      <span className="text-[15px] font-semibold tracking-tight text-fg">
        OhMyWallpaper
      </span>
    </span>
  );
}
