/**
 * Client-side image compression utilities.
 *
 * Resizes and re-encodes images to WebP *before* they are uploaded to R2
 * Storage. This drastically reduces both the stored file size and the bandwidth
 * (egress) consumed every time Next.js fetches the original to optimize it.
 *
 * These helpers rely on browser APIs (canvas/Image) and must only run on the
 * client. They fail safe: on any error, the original file is returned unchanged.
 */

export interface CompressImageOptions {
    /** Max output width in px (image is scaled down to fit, never up). */
    maxWidth?: number;
    /** Max output height in px (image is scaled down to fit, never up). */
    maxHeight?: number;
    /** WebP quality from 0 to 1. */
    quality?: number;
}

// Formats we should not touch (animation / vector).
const SKIP_TYPES = new Set(['image/gif', 'image/svg+xml']);

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function toWebpName(name: string): string {
    const base = name.replace(/\.[^/.]+$/, '');
    return `${base || 'image'}.webp`;
}

/**
 * Compress a single image file to WebP. Returns the original file untouched if
 * it is not a (raster) image, if the browser APIs are unavailable, or if
 * compression would not make it smaller.
 */
export async function compressImage(
    file: File,
    options: CompressImageOptions = {}
): Promise<File> {
    const { maxWidth = 1280, maxHeight = 1280, quality = 0.8 } = options;

    if (typeof window === 'undefined' || typeof document === 'undefined') return file;
    if (!(file instanceof File) || file.size === 0) return file;
    if (!file.type.startsWith('image/') || SKIP_TYPES.has(file.type)) return file;

    try {
        const dataUrl = await readAsDataURL(file);
        const img = await loadImage(dataUrl);

        const ratio = Math.min(1, maxWidth / img.width, maxHeight / img.height);
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return file;
        ctx.drawImage(img, 0, 0, width, height);

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/webp', quality)
        );
        if (!blob) return file;

        // Don't bloat already-small/optimized images.
        if (blob.size >= file.size) return file;

        return new File([blob], toWebpName(file.name), {
            type: 'image/webp',
            lastModified: Date.now(),
        });
    } catch {
        return file;
    }
}

/** Compress multiple image files in parallel. */
export async function compressImages(
    files: File[],
    options?: CompressImageOptions
): Promise<File[]> {
    return Promise.all(files.map((f) => compressImage(f, options)));
}
