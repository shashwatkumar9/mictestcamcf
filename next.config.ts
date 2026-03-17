import type { NextConfig } from "next";

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
  // Exclude large @vercel/og WASM files to stay under Cloudflare Workers 3 MiB free plan limit
  outputFileTracingExcludes: {
    "**": [
      "node_modules/next/dist/compiled/@vercel/og/resvg.wasm",
      "node_modules/next/dist/compiled/@vercel/og/yoga.wasm",
      "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf.bin",
    ],
  },
};

export default nextConfig;
