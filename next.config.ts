import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function imageRemotePatterns() {
  const patterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
    {
      protocol: 'https',
      hostname: 'psyktnuzjukkcgnvniwz.supabase.co',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
    // R2 public URLs (*.r2.dev) — always allow so Cloudflare builds work
    // even when R2_PUBLIC_URL is only set at runtime, not build time.
    {
      protocol: 'https',
      hostname: '**.r2.dev',
      port: '',
      pathname: '/**',
    },
  ];

  const r2PublicUrl = process.env.R2_PUBLIC_URL;
  if (r2PublicUrl) {
    try {
      const { hostname, protocol } = new URL(r2PublicUrl);
      if (hostname) {
        patterns.push({
          protocol: (protocol.replace(':', '') || 'https') as 'https' | 'http',
          hostname,
          port: '',
          pathname: '/**',
        });
      }
    } catch {
      // ignore invalid R2_PUBLIC_URL at build time
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  // Turbopack resolves CSS @imports from the parent folder on Windows when the
  // project lives under D:\stores\*. Pin packages to this project's node_modules.
  turbopack: {
    resolveAlias: {
      tailwindcss: path.join(projectRoot, "node_modules/tailwindcss"),
      "tw-animate-css": path.join(projectRoot, "node_modules/tw-animate-css"),
    },
  },
  experimental: {
    serverActions: {
      // Images are compressed to WebP in the browser before upload, so each is
      // small; this headroom covers products with several images at once.
      bodySizeLimit: '8mb',
    },
  },
  images: {
    // Serve modern, smaller WebP. A single format keeps the optimizer cache
    // small (vs. caching both AVIF + WebP variants).
    formats: ['image/webp'],
    // Keep optimized images cached for 31 days so the original is fetched from
    // storage only once per variant. Uploads use unique filenames, so a long TTL
    // is safe (the src changes whenever the image changes).
    minimumCacheTTL: 2678400,
    // Trim the breakpoints to the ones we actually use → fewer generated
    // variants, so fewer downloads of the original from storage.
    deviceSizes: [640, 750, 828, 1080, 1920],
    imageSizes: [48, 64, 96, 128, 256, 384],
    // Allowed quality values (required in Next 16). Lower quality = less data.
    qualities: [50, 65, 75],
    remotePatterns: imageRemotePatterns(),
  },
};

export default nextConfig;

