import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // There is an unrelated package-lock.json in the parent projects/ directory
  // with no matching package.json. Without this, Next infers the workspace root
  // one level up, which breaks output file tracing and lets a stray .next from
  // another app collide with this one.
  outputFileTracingRoot: path.join(__dirname),

  // Image optimization settings
  images: {
    unoptimized: true, // For Cloudflare Pages
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.workers.dev',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_WORKER_URL: process.env.NEXT_PUBLIC_WORKER_URL || 'https://kalenjin-books-worker.pngobiro.workers.dev',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

export default nextConfig;
