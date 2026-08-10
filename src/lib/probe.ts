/** Client-side media probing: dimensions, duration, and a 640px JPEG thumbnail. */
import type { WallpaperKind } from "./types";

export interface Probe {
  kind: WallpaperKind;
  width: number;
  height: number;
  duration: number | null;
  thumb: Blob;
}

export function probeImage(file: File): Promise<Probe> {
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

export function probeVideo(file: File): Promise<Probe> {
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

export function probeFile(file: File): Promise<Probe> {
  return file.type.startsWith("video/") ? probeVideo(file) : probeImage(file);
}
