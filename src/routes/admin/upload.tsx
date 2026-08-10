import { useEffect, useRef, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudUploadIcon,
  Image01Icon,
  PlayIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { createWallpaper } from "../../server/admin";
import { CATEGORIES, type WallpaperKind } from "../../lib/types";
import { formatBytes, formatDuration } from "../../lib/format";

export const Route = createFileRoute("/admin/upload")({
  component: Upload,
});

const ACCEPT = "image/jpeg,image/png,image/webp,video/mp4,video/webm";

interface Probe {
  kind: WallpaperKind;
  width: number;
  height: number;
  duration: number | null;
  thumb: Blob;
}

function probeImage(file: File): Promise<Probe> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = Math.min(640, img.naturalWidth);
      canvas.width = w;
      canvas.height = Math.round((w * img.naturalHeight) / img.naturalWidth);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error("Could not generate a thumbnail"));
          resolve({
            kind: "static",
            width: img.naturalWidth,
            height: img.naturalHeight,
            duration: null,
            thumb: blob,
          });
        },
        "image/jpeg",
        0.82,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The browser could not decode this image"));
    };
    img.src = url;
  });
}

function probeVideo(file: File): Promise<Probe> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    const fail = (msg: string) => {
      URL.revokeObjectURL(url);
      reject(new Error(msg));
    };
    video.onerror = () => fail("The browser could not decode this video");
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const w = Math.min(640, video.videoWidth);
      canvas.width = w;
      canvas.height = Math.round((w * video.videoHeight) / video.videoWidth);
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          const meta = {
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
          };
          URL.revokeObjectURL(url);
          video.removeAttribute("src");
          if (!blob) return reject(new Error("Could not capture a poster frame"));
          resolve({ kind: "live", duration: meta.duration, width: meta.width, height: meta.height, thumb: blob });
        },
        "image/jpeg",
        0.82,
      );
    };
    video.src = url;
  });
}

function Upload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [probing, setProbing] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [featured, setFeatured] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    };
  }, [thumbUrl]);

  async function choose(f: File) {
    setError(null);
    setProbe(null);
    setFile(f);
    setProbing(true);
    if (thumbUrl) {
      URL.revokeObjectURL(thumbUrl);
      setThumbUrl(null);
    }
    setName(f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim());
    try {
      const p = f.type.startsWith("video/") ? await probeVideo(f) : await probeImage(f);
      setProbe(p);
      setThumbUrl(URL.createObjectURL(p.thumb));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this file");
      setFile(null);
    } finally {
      setProbing(false);
    }
  }

  async function submit() {
    if (!file || !probe) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("thumb", new File([probe.thumb], "thumb.jpg", { type: "image/jpeg" }));
      form.set("name", name.trim() || "Untitled");
      form.set("category", category);
      form.set("kind", probe.kind);
      form.set("width", String(probe.width));
      form.set("height", String(probe.height));
      if (probe.duration) form.set("durationSeconds", String(Math.round(probe.duration)));
      form.set("featured", String(featured));
      await createWallpaper({ data: form });
      await router.navigate({ to: "/admin/wallpapers" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setBusy(false);
    }
  }

  return (
    <div id="admin-upload" className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Upload wallpaper</h1>
      <p className="mt-1 text-sm text-muted">
        JPEG, PNG, or WebP for static — MP4 or WebM for live. Files go to R2, metadata to
        the catalog.
      </p>

      <div
        id="upload-dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) void choose(f);
        }}
        className={`mt-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragOver ? "border-accent bg-accent-soft" : "border-line bg-panel hover:border-line-strong"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void choose(f);
            e.target.value = "";
          }}
        />
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <HugeiconsIcon icon={CloudUploadIcon} size={24} />
        </span>
        <p className="mt-4 text-sm font-medium">
          {probing ? "Reading file…" : "Drop a file here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-faint">Recommended: 2560×1440 or larger</p>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {file && probe && thumbUrl && (
        <div className="mt-6 grid gap-5 rounded-2xl border border-line bg-panel p-6 sm:grid-cols-[240px_1fr]">
          <div>
            <div className="relative overflow-hidden rounded-xl border border-line">
              <img src={thumbUrl} alt="Generated thumbnail" className="aspect-[16/10] w-full object-cover" />
              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                <HugeiconsIcon icon={probe.kind === "live" ? PlayIcon : Image01Icon} size={10} />
                {probe.kind === "live" ? "Live" : "Static"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <HugeiconsIcon
                icon={probe.kind === "live" ? Video01Icon : Image01Icon}
                size={14}
                className="shrink-0 text-faint"
              />
              <span className="truncate">
                {probe.width}×{probe.height} · {formatBytes(file.size)}
                {probe.duration ? ` · ${formatDuration(probe.duration)}` : ""}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Thumbnail generated in your browser and uploaded alongside the original.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Display name
            </label>
            <input
              id="input-upload-name"
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
              Feature on the app's Home screen
            </label>
            <button
              id="btn-publish-wallpaper"
              onClick={submit}
              disabled={busy || name.trim() === ""}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              <HugeiconsIcon icon={CloudUploadIcon} size={17} />
              {busy ? "Publishing…" : "Publish to catalog"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
