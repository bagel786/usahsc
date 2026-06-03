import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = process.env.UPLOADS_DIR || "./public/uploads";
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

/**
 * Persist an uploaded image and return its public URL ("/uploads/<file>").
 * Returns null when no file was provided. On Railway, mount a Volume at
 * the container's public/uploads directory so files survive redeploys.
 */
export async function saveUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Unsupported image type. Use PNG, JPG, WEBP or SVG.");
  if (file.size > MAX_BYTES) throw new Error("Image too large (max 3 MB).");

  const buf = Buffer.from(await file.arrayBuffer());
  await mkdir(UPLOAD_DIR, { recursive: true });

  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), buf);
  return `/uploads/${name}`;
}
