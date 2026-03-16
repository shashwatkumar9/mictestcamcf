import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Set up the Cloudflare dev platform in development so wrangler bindings
// (D1, KV, R2, etc.) are available via `getRequestContext()` in `next dev`
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
