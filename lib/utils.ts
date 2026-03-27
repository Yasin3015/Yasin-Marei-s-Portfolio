import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageUrl(url: string | undefined | null) {
  if (!url) return "";
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`;
  }
  return url;
}

/**
 * Check if a string is a full remote URL (http/https)
 */
export function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

/**
 * True when the URL points to Cloudinary.
 */
export function isCloudinaryUrl(src: string) {
  return /https?:\/\/res\.cloudinary\.com\/[^/]+\//.test(src);
}

/**
 * Extract the Public ID from a Cloudinary URL.
 * If the input is already a plain Public ID (not a URL), returns it as-is.
 * 
 * Example:
 *   "https://res.cloudinary.com/dwld7kgvs/image/upload/v1234/salam.png" → "salam"
 *   "https://res.cloudinary.com/dwld7kgvs/image/upload/w_500/folder/image.jpg" → "folder/image"
 *   "salam" → "salam"
 */
export function extractCloudinaryPublicId(src: string): string {
  if (!src) return "";
  
  // If it's not a URL, assume it's already a Public ID
  if (!src.startsWith("http")) return src;
  
  // Match Cloudinary URL pattern: .../upload/[optional-transforms/][optional-version/]public_id.ext
  const match = src.match(/\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
  if (match && match[1]) {
    // Remove any transformation segments (they contain commas like w_500,h_300)
    const parts = match[1].split("/");
    const cleanParts = parts.filter(part => !part.includes(",") && !part.match(/^[a-z]_/));
    return cleanParts.join("/");
  }
  
  return src;
}

/**
 * Build a Cloudinary URL from a public ID or Cloudinary URL (for <img> tag previews in admin pages)
 */
export function buildCloudinaryUrl(src: string, width = 400, height = 400) {
  const normalized = formatImageUrl(src);
  if (!normalized) return "";

  // External URLs (e.g. Google Drive / Firebase storage) should be used as-is.
  if (isRemoteUrl(normalized) && !isCloudinaryUrl(normalized)) {
    return normalized;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwld7kgvs";
  const publicId = extractCloudinaryPublicId(normalized);
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/${publicId}`;
}

