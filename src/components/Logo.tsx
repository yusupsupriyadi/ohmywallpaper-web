export function Logo({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="OhMyWallpaper"
      width={size}
      height={size}
      className="inline-block shrink-0 select-none object-contain drop-shadow-[0_2px_10px_rgba(76,141,255,0.4)]"
      style={{ width: size, height: size }}
      draggable={false}
    />
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
