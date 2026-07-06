import type { NextConfig } from "next";

/**
 * In local dev, proxy /api/* to the FastAPI backend on port 8000.
 * On Vercel, root vercel.json rewrites /api/* to the Python function —
 * do not proxy to localhost in production.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.VERCEL) {
      return [];
    }

    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
